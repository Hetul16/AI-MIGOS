# api/trips.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta, date
from uuid import uuid4
import os
import logging
import math
import httpx
import asyncio

# import your firebase db and verify_firebase_token dependency
from core.firebase import db  # Firestore client from your project
from api.authentication import verify_firebase_token  # your existing dependency

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["Trips"])

# Config
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OVERPASS_URL = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
WEATHER_CACHE_TTL_HOURS = int(os.getenv("WEATHER_CACHE_TTL_HOURS", "6"))
DEFAULT_HOLD_TTL_MIN = 30
HTTPX_TIMEOUT = 10.0  # seconds


# -----------------------------
# Pydantic models (inputs)
# -----------------------------
class TripFilterParams(BaseModel):
    status: Optional[str] = None  # past | upcoming | ongoing


class CustomizeAction(BaseModel):
    op: str  # swap | add | remove
    item_type: str  # hotel | flight | activity
    item_id: Optional[str] = None
    alternative_id: Optional[str] = None
    reason: Optional[str] = None


class CustomizeRequest(BaseModel):
    actions: List[CustomizeAction]


class AlternativesRequest(BaseModel):
    item_type: str
    current_id: str
    constraints: Optional[Dict[str, Any]] = None  # e.g., max_price, distance_km


class ReservationItem(BaseModel):
    type: str  # hotel|flight|activity
    provider_quote_id: str
    amount: Optional[float] = None
    currency: Optional[str] = "INR"


class ReserveRequest(BaseModel):
    items: List[ReservationItem]
    hold_ttl_minutes: Optional[int] = Field(DEFAULT_HOLD_TTL_MIN, ge=1, le=720)
    idempotency_key: Optional[str] = None


class CreateTripRequest(BaseModel):
    destination: str
    origin: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: Optional[int] = Field(None, ge=1, le=60)
    budget_in_inr: Optional[float] = Field(None, ge=0)
    themes: Optional[List[str]] = []  # e.g., ["heritage", "nightlife", "adventure"]
    travelers: Optional[int] = Field(1, ge=1, le=20)
    preferences: Optional[Dict[str, Any]] = None  # flexible bag for constraints


# -----------------------------
# Utility helpers
# -----------------------------
def itinerary_doc_ref(itinerary_id: str):
    return db.collection("itineraries").document(itinerary_id)


def reservations_col():
    return db.collection("reservations")


def bookings_col():
    return db.collection("bookings")


async def http_get_json(url: str, params: dict = None, timeout: float = HTTPX_TIMEOUT):
    async with httpx.AsyncClient(timeout=timeout) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


def bbox_from_latlng(lat: float, lng: float, radius_m: int):
    """
    Return (south, west, north, east) bounding box roughly approximating radius_m.
    Uses a simple conversion: 1 deg lat ~ 111.32 km; lon scaled by cos(lat).
    """
    km = radius_m / 1000.0
    deg_lat = km / 111.32
    deg_lng = km / (111.32 * math.cos(math.radians(lat)) + 1e-9)
    south = lat - deg_lat
    north = lat + deg_lat
    west = lng - deg_lng
    east = lng + deg_lng
    return south, west, north, east


# -----------------------------
# Endpoint implementations
# -----------------------------


@router.get("/trips")
async def list_trips(status: Optional[str] = None, current_user: dict = Depends(verify_firebase_token)):
    """
    List trips for the authenticated user. Optional filter by status.
    """
    uid = current_user["uid"]
    try:
        q = db.collection("itineraries").where("user_id", "==", uid)
        if status:
            q = q.where("status", "==", status)
        q = q.order_by("created_at", direction="DESCENDING").limit(100)
        docs = q.stream()
        results = []
        async for d in docs:
            data = d.to_dict()
            data["id"] = d.id
            results.append(data)
        return {"success": True, "trips": results}
    except Exception as e:
        logger.exception("list_trips failed")
        raise HTTPException(status_code=500, detail="Failed to list trips")


@router.post("/trips/create")
async def create_trip(body: CreateTripRequest, current_user: dict = Depends(verify_firebase_token)):
    """
    Create a new itinerary document with minimal scaffold so the Planner Agent or frontend can
    progressively enrich it. Stores user preferences and initial summary.
    """
    uid = current_user["uid"]
    now = datetime.utcnow()

    # Derive duration if dates present
    duration_days = body.duration_days
    if not duration_days and body.start_date and body.end_date and body.end_date >= body.start_date:
        duration_days = (body.end_date - body.start_date).days + 1

    itinerary_id = f"it_{uuid4().hex[:12]}"
    doc = {
        "id": itinerary_id,
        "user_id": uid,
        "status": "draft",
        "created_at": now,
        "updated_at": now,
        "input": {
            "destination": body.destination,
            "origin": body.origin,
            "start_date": str(body.start_date) if body.start_date else None,
            "end_date": str(body.end_date) if body.end_date else None,
            "duration_days": duration_days,
            "budget_in_inr": body.budget_in_inr,
            "themes": body.themes or [],
            "travelers": body.travelers or 1,
            "preferences": body.preferences or {},
        },
        "summary": {
            "title": f"Trip to {body.destination}",
            "center": None,  # to be set by planner/maps enrichment
            "days": [],
            "cost_breakdown": {},
        },
        "booking_options": {},
        "reservations": [],
        "edits": [],
    }

    itinerary_doc_ref(itinerary_id).set(doc)
    return {"success": True, "itinerary_id": itinerary_id}


@router.get("/trips/{itinerary_id}")
async def get_trip(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    """
    Get full itinerary. Ensures the user owns the itinerary.
    """
    uid = current_user["uid"]
    try:
        doc = itinerary_doc_ref(itinerary_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Itinerary not found")
        data = doc.to_dict()
        if data.get("user_id") != uid:
            raise HTTPException(status_code=403, detail="Forbidden")
        data["id"] = doc.id
        return {"success": True, "itinerary": data}
    except HTTPException:
        raise
    except Exception:
        logger.exception("get_trip failed")
        raise HTTPException(status_code=500, detail="Failed to fetch itinerary")


@router.post("/trips/{itinerary_id}/customize")
async def customize_trip(itinerary_id: str, body: CustomizeRequest, current_user: dict = Depends(verify_firebase_token)):
    """
    Apply lightweight edits to an itinerary: swap/add/remove.
    - For swap: expects alternative_id must exist in booking_options or known alternatives.
    - We persist edits as a change log and update summary minimally.
    """
    uid = current_user["uid"]

    doc_ref = itinerary_doc_ref(itinerary_id)

    def txn_update(tx):
        snapshot = doc_ref.get(transaction=tx)
        if not snapshot.exists:
            raise HTTPException(status_code=404, detail="Itinerary not found")
        doc = snapshot.to_dict()
        if doc.get("user_id") != uid:
            raise HTTPException(status_code=403, detail="Forbidden")
        # keep an edit log
        edits = doc.get("edits", [])
        booking_options = doc.get("booking_options", {})
        summary = doc.get("summary", {})

        for action in body.actions:
            if action.op not in ("swap", "add", "remove"):
                raise HTTPException(status_code=400, detail=f"Invalid op {action.op}")
            edit_entry = {
                "op": action.op,
                "item_type": action.item_type,
                "item_id": action.item_id,
                "alternative_id": action.alternative_id,
                "reason": action.reason,
                "ts": datetime.utcnow()
            }
            # swap behavior: try to find alternative in booking_options
            if action.op == "swap":
                if not action.item_id or not action.alternative_id:
                    raise HTTPException(status_code=400, detail="swap requires item_id and alternative_id")
                # naive replacement: search summary days & booking_options
                replaced = False
                # replace in booking_options lists if present
                for key, items in booking_options.items():
                    if isinstance(items, list):
                        for i, it in enumerate(items):
                            if it.get("id") == action.item_id or it.get("quote_id") == action.item_id:
                                # find alternative in same list
                                alt = next((x for x in items if x.get("id") == action.alternative_id or x.get("quote_id") == action.alternative_id), None)
                                if alt:
                                    items[i] = alt
                                    booking_options[key] = items
                                    replaced = True
                                    break
                    if replaced:
                        break
                # Replace in day-by-day summary if present (simple scan)
                if not replaced:
                    days = summary.get("days", [])
                    for d in days:
                        activities = d.get("activities", [])
                        for idx, act in enumerate(activities):
                            if act.get("id") == action.item_id:
                                # find alternative in booking_options by type
                                alts = booking_options.get(action.item_type + "s", [])
                                alt = next((x for x in alts if x.get("id") == action.alternative_id or x.get("quote_id") == action.alternative_id), None)
                                if alt:
                                    activities[idx] = alt
                                    d["activities"] = activities
                                    replaced = True
                                    break
                        if replaced:
                            break
                if not replaced:
                    # If alternative not found, fail
                    raise HTTPException(status_code=400, detail="alternative_id not available in booking options")
            elif action.op == "add":
                # add new item to summary; we append to day 0 by default
                new_item = {"id": action.alternative_id, "type": action.item_type}
                days = summary.setdefault("days", [])
                if not days:
                    summary["days"] = [{"date": str(datetime.utcnow().date()), "activities": [new_item]}]
                else:
                    days[0].setdefault("activities", []).append(new_item)
            elif action.op == "remove":
                # remove item from summary and booking_options (best effort)
                removed = False
                days = summary.get("days", [])
                for d in days:
                    activities = d.get("activities", [])
                    activities = [a for a in activities if a.get("id") != action.item_id]
                    d["activities"] = activities
                # also remove from booking_options lists where present
                for k, items in list(booking_options.items()):
                    if isinstance(items, list):
                        booking_options[k] = [it for it in items if it.get("id") != action.item_id and it.get("quote_id") != action.item_id]

            edits.append(edit_entry)

        # update doc
        update_data = {
            "booking_options": booking_options,
            "summary": summary,
            "edits": edits,
            "updated_at": datetime.utcnow()
        }
        tx.update(doc_ref, update_data)
        return update_data

    try:
        db.run_transaction(txn_update)
        return {"success": True, "message": "Customize applied"}
    except HTTPException:
        raise
    except Exception:
        logger.exception("customize_trip error")
        raise HTTPException(status_code=500, detail="Failed to apply customize")


@router.post("/trips/{itinerary_id}/alternatives")
async def get_alternatives(itinerary_id: str, body: AlternativesRequest, current_user: dict = Depends(verify_firebase_token)):
    """
    Return alternatives for a given item. First check booking_options in Firestore (precomputed alternates).
    If none, return a lightweight mock set (or optionally invoke real agent).
    """
    uid = current_user["uid"]
    doc = itinerary_doc_ref(itinerary_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    data = doc.to_dict()
    if data.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Forbidden")

    # check booking_options for alternatives
    booking_options = data.get("booking_options", {})
    candidates = booking_options.get(body.item_type + "s", []) or booking_options.get("alternatives", [])
    # filter by constraints (simple)
    max_price = None
    if body.constraints:
        max_price = body.constraints.get("max_price")
    filtered = []
    for c in candidates:
        price = c.get("price_total") or c.get("total_price") or c.get("amount")
        if max_price is not None and price is not None:
            if float(price) > float(max_price):
                continue
        filtered.append(c)

    # if none found, return simple mocked alternatives (so frontend can show options)
    if not filtered:
        # Minimal mock for hotels/activity
        if body.item_type == "hotel":
            filtered = [
                {"id": f"mock_ht_{uuid4().hex[:6]}", "name": "Mock Hotel A", "price_total": 2500, "stars": 3},
                {"id": f"mock_ht_{uuid4().hex[:6]}", "name": "Mock Hotel B", "price_total": 3200, "stars": 4}
            ]
        else:
            filtered = [
                {"id": f"mock_act_{uuid4().hex[:6]}", "name": "Mock Activity A", "estimated_cost": 300},
                {"id": f"mock_act_{uuid4().hex[:6]}", "name": "Mock Activity B", "estimated_cost": 450}
            ]

    return {"success": True, "alternatives": filtered}


@router.post("/trips/{itinerary_id}/reserve")
async def reserve_items(itinerary_id: str, body: ReserveRequest, current_user: dict = Depends(verify_firebase_token)):
    """
    Create a reservation (mock hold) for selected items.
    - Save reservations/{reservation_id} with expires_at based on hold_ttl_minutes.
    - Use idempotency_key to avoid duplicate holds.
    """
    uid = current_user["uid"]
    # check itinerary ownership
    it_doc = itinerary_doc_ref(itinerary_id).get()
    if not it_doc.exists:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    it_data = it_doc.to_dict()
    if it_data.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Forbidden")

    # idempotency check: if provided, attempt to find existing reservation
    if body.idempotency_key:
        q = reservations_col().where("idempotency_key", "==", body.idempotency_key).limit(1).get()
        for r in q:
            return {"success": True, "reservation_id": r.id, "status": r.to_dict().get("status")}

    # compute total amount (use provided amounts if present, otherwise try to match provider_quote_id in itinerary booking_options)
    total_amount = 0.0
    currency = "INR"
    resolved_items = []
    booking_options = it_data.get("booking_options", {})

    for item in body.items:
        resolved_amount = None
        if item.amount:
            resolved_amount = float(item.amount)
        else:
            # try to find quote by provider_quote_id in booking_options
            found = None
            for key, arr in booking_options.items():
                if isinstance(arr, list):
                    for it in arr:
                        if it.get("quote_id") == item.provider_quote_id or it.get("id") == item.provider_quote_id:
                            found = it
                            break
                    if found:
                        break
            if found:
                resolved_amount = float(found.get("total_price") or found.get("price_total") or found.get("amount") or 0.0)
        if resolved_amount is None:
            # fallback: assume 0 and keep item
            resolved_amount = 0.0
        total_amount += resolved_amount
        resolved_items.append({
            "type": item.type,
            "provider_quote_id": item.provider_quote_id,
            "amount": resolved_amount,
            "currency": item.currency or currency,
            "mock_hold_id": f"hold_{uuid4().hex[:8]}"
        })

    expires_at = datetime.utcnow() + timedelta(minutes=body.hold_ttl_minutes or DEFAULT_HOLD_TTL_MIN)
    reservation_id = f"res_{uuid4().hex[:12]}"
    reservation_doc = {
        "id": reservation_id,
        "itinerary_id": itinerary_id,
        "user_id": uid,
        "items": resolved_items,
        "total_amount": total_amount,
        "currency": currency,
        "status": "held",
        "expires_at": expires_at,
        "created_at": datetime.utcnow(),
        "idempotency_key": body.idempotency_key
    }

    # save reservation
    reservations_col().document(reservation_id).set(reservation_doc)
    # update itinerary to reference this reservation id
    itinerary_doc_ref(itinerary_id).update({
        "reservations": db.ArrayUnion([reservation_id]),
        "updated_at": datetime.utcnow()
    })

    return {
        "success": True,
        "reservation_id": reservation_id,
        "status": "held",
        "expires_at": expires_at.isoformat(),
        "total_amount": total_amount,
        "currency": currency,
        "items": resolved_items
    }


@router.post("/reservations/{reservation_id}/cancel")
async def cancel_reservation(reservation_id: str, current_user: dict = Depends(verify_firebase_token)):
    """
    Cancel a reservation (release hold). Simple mock implementation.
    """
    uid = current_user["uid"]
    doc_ref = reservations_col().document(reservation_id)
    snapshot = doc_ref.get()
    if not snapshot.exists:
        raise HTTPException(status_code=404, detail="Reservation not found")
    data = snapshot.to_dict()
    if data.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Forbidden")
    status = data.get("status")
    if status in ("cancelled", "released"):
        return {"success": True, "message": "Reservation already cancelled/released"}
    doc_ref.update({
        "status": "cancelled",
        "cancelled_at": datetime.utcnow()
    })
    # remove reservation from itinerary reservations array
    itinerary_ref = itinerary_doc_ref(data.get("itinerary_id"))
    itinerary_ref.update({"reservations": db.ArrayRemove([reservation_id]), "updated_at": datetime.utcnow()})
    return {"success": True, "message": "Reservation cancelled"}


# -----------------------------
# Weather endpoint
# -----------------------------
async def fetch_weather_for_latlng(lat: float, lng: float):
    """
    Use OpenWeatherMap One Call API (free) to fetch daily forecasts.
    Requires OPENWEATHER_API_KEY in env.
    """
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API key not configured")

    url = "https://api.openweathermap.org/data/2.5/onecall"
    params = {
        "lat": lat,
        "lon": lng,
        "exclude": "minutely,hourly,alerts",
        "units": "metric",
        "appid": OPENWEATHER_API_KEY
    }
    try:
        data = await http_get_json(url, params=params, timeout=HTTPX_TIMEOUT)
        # keep only daily forecast
        daily = data.get("daily", [])
        simplified = []
        for d in daily:
            simplified.append({
                "dt": datetime.utcfromtimestamp(d["dt"]).date().isoformat(),
                "temp": d.get("temp"),
                "weather": d.get("weather", []),
                "pop": d.get("pop", 0)  # precipitation probability
            })
        return {"fetched_at": datetime.utcnow(), "daily": simplified}
    except httpx.HTTPError as e:
        logger.exception("OpenWeather fetch failed")
        raise HTTPException(status_code=502, detail="Weather provider error")


@router.get("/trips/{itinerary_id}/weather")
async def get_trip_weather(itinerary_id: str, current_user: dict = Depends(verify_firebase_token)):
    """
    Return weather for itinerary. Requires itinerary.summary.center {lat, lng} or list of days with lat/lng per day.
    Caches result in itinerary.weather (with fetched_at) for WEATHER_CACHE_TTL_HOURS.
    """
    uid = current_user["uid"]
    doc_ref = itinerary_doc_ref(itinerary_id)
    snapshot = doc_ref.get()
    if not snapshot.exists:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    it = snapshot.to_dict()
    if it.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Forbidden")

    # check cached weather
    weather = it.get("weather")
    if weather and weather.get("fetched_at"):
        fetched_at = weather.get("fetched_at")
        if isinstance(fetched_at, datetime):
            fetched_dt = fetched_at
        else:
            try:
                fetched_dt = datetime.fromisoformat(fetched_at)
            except Exception:
                fetched_dt = None
        if fetched_dt and (datetime.utcnow() - fetched_dt) < timedelta(hours=WEATHER_CACHE_TTL_HOURS):
            return {"success": True, "weather": weather}

    # need coordinates: prefer itinerary.summary.center or first POI lat/lng
    summary = it.get("summary", {})
    center = summary.get("center")
    lat = None; lng = None
    if center and center.get("lat") and center.get("lng"):
        lat = float(center["lat"]); lng = float(center["lng"])
    else:
        # attempt to find first POI with lat/lng
        days = summary.get("days", [])
        for d in days:
            for act in d.get("activities", []):
                if act.get("lat") and act.get("lng"):
                    lat = float(act["lat"]); lng = float(act["lng"])
                    break
            if lat:
                break

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="Itinerary missing coordinates for weather lookup")

    weather_data = await fetch_weather_for_latlng(lat, lng)
    # save to itinerary doc
    doc_ref.update({"weather": weather_data, "updated_at": datetime.utcnow()})
    return {"success": True, "weather": weather_data}


# -----------------------------
# Hidden gems endpoint (OSM Overpass)
# -----------------------------
def build_overpass_query(south, west, north, east, filters: List[str]):
    """
    Build a basic OverpassQL query that searches multiple tags.
    `filters` is a list like ['amenity=cafe', 'natural=waterfall'].
    """
    # search nodes and ways
    filters_q = "".join([f'node["{k}"="{v}"]({south},{west},{north},{east});way["{k}"="{v}"]({south},{west},{north},{east});' if "=" in f else "" for f in filters])
    # For convenience allow filters provided as 'amenity=cafe' strings
    parts = []
    for f in filters:
        if "=" in f:
            k, v = f.split("=", 1)
            parts.append(f'node["{k}"="{v}"]({south},{west},{north},{east});')
            parts.append(f'way["{k}"="{v}"]({south},{west},{north},{east});')
    if not parts:
        # default: tourist attractions and viewpoints
        parts = [f'node["tourism"="attraction"]({south},{west},{north},{east});', f'node["natural"="peak"]({south},{west},{north},{east});']
    body = "\n".join(parts)
    q = f"[out:json][timeout:25];\n({body});\nout center 50;"
    return q


@router.get("/trips/{itinerary_id}/hidden_gems")
async def hidden_gems(itinerary_id: str, filter: Optional[str] = None, radius_m: Optional[int] = 5000, current_user: dict = Depends(verify_firebase_token)):
    """
    Return 'hidden gems' using OSM Overpass.
    filter param: comma-separated topics (heritage, cafe, waterfall, viewpoint, temple, museum, etc.)
    Requires itinerary summary center lat/lng.
    """
    uid = current_user["uid"]
    doc_ref = itinerary_doc_ref(itinerary_id)
    snapshot = doc_ref.get()
    if not snapshot.exists:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    it = snapshot.to_dict()
    if it.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Forbidden")

    summary = it.get("summary", {})
    center = summary.get("center")
    lat = None; lng = None
    if center and center.get("lat") and center.get("lng"):
        lat = float(center["lat"]); lng = float(center["lng"])
    else:
        # fallback: attempt to pick first activity coordinates
        days = summary.get("days", [])
        for d in days:
            for act in d.get("activities", []):
                if act.get("lat") and act.get("lng"):
                    lat = float(act["lat"]); lng = float(act["lng"])
                    break
            if lat:
                break

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="Itinerary missing coordinates for hidden_gems lookup")

    south, west, north, east = bbox_from_latlng(lat, lng, radius_m)
    filters = []
    if filter:
        for token in filter.split(","):
            token = token.strip().lower()
            if token == "cafe": filters.append("amenity=cafe")
            elif token == "waterfall": filters.append("natural=waterfall")
            elif token == "mountain" or token == "peak": filters.append("natural=peak")
            elif token == "heritage": filters.append("historic=*")
            elif token == "viewpoint": filters.append("tourism=viewpoint")
            elif token == "temple": filters.append("amenity=place_of_worship")
            else:
                # try tourism type
                filters.append(f"tourism={token}")

    overpass_query = build_overpass_query(south, west, north, east, filters)
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(OVERPASS_URL, data=overpass_query.encode("utf-8"))
            r.raise_for_status()
            payload = r.json()
    except httpx.HTTPError:
        logger.exception("Overpass request failed")
        raise HTTPException(status_code=502, detail="Failed to fetch hidden gems from Overpass")

    elements = payload.get("elements", [])
    gems = []
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name") or tags.get("ref") or "Unnamed"
        lat_el = el.get("lat") or (el.get("center") or {}).get("lat")
        lon_el = el.get("lon") or (el.get("center") or {}).get("lon")
        gems.append({
            "id": f"osm_{el.get('type')}_{el.get('id')}",
            "name": name,
            "tags": tags,
            "lat": lat_el,
            "lng": lon_el,
            "source": "osm"
        })
    # De-dup & sort by presence of name & tag richness
    gems_sorted = sorted(gems, key=lambda x: (0 if x.get("name") != "Unnamed" else 1, -len(x.get("tags", {}))))[:50]
    return {"success": True, "count": len(gems_sorted), "gems": gems_sorted}
