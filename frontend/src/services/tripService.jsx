// services/tripService.jsx
import authService from './authService';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class TripService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  async getHeaders() {
    const token = await authService.getCurrentUserToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Get all trips for the current user
  async getTrips(status = null) {
    try {
      const headers = await this.getHeaders();
      const url = status ? `${this.baseURL}/trips?status=${status}` : `${this.baseURL}/trips`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  }

  // Get a specific trip by ID
  async getTrip(tripId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/trips/${tripId}`, {
        method: 'GET',
        headers
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  }

  // Customize trip (swap/add/remove activities)
  async customizeTrip(tripId, actions) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/trips/${tripId}/customize`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ actions })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error customizing trip:', error);
      throw error;
    }
  }

  // Get alternatives for a specific item
  async getAlternatives(tripId, itemType, currentId, constraints = null) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/trips/${tripId}/alternatives`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          item_type: itemType,
          current_id: currentId,
          constraints
        })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
      throw error;
    }
  }

  // Reserve items (create booking hold)
  async reserveItems(tripId, items, holdTtlMinutes = 30, idempotencyKey = null) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/trips/${tripId}/reserve`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items,
          hold_ttl_minutes: holdTtlMinutes,
          idempotency_key: idempotencyKey
        })
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error reserving items:', error);
      throw error;
    }
  }

  // Cancel a reservation
  async cancelReservation(reservationId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  // Get weather for a trip
  async getTripWeather(tripId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/trips/${tripId}/weather`, {
        method: 'GET',
        headers
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  // Get hidden gems for a trip
  async getHiddenGems(tripId, filter = null, radiusM = 5000) {
    try {
      const headers = await this.getHeaders();
      const params = new URLSearchParams();
      if (filter) params.append('filter', filter);
      if (radiusM) params.append('radius_m', radiusM);
      
      const url = `${this.baseURL}/trips/${tripId}/hidden_gems?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching hidden gems:', error);
      throw error;
    }
  }

  // Helper method to create swap action
  createSwapAction(itemType, itemId, alternativeId, reason = null) {
    return {
      op: 'swap',
      item_type: itemType,
      item_id: itemId,
      alternative_id: alternativeId,
      reason
    };
  }

  // Helper method to create add action
  createAddAction(itemType, alternativeId, reason = null) {
    return {
      op: 'add',
      item_type: itemType,
      alternative_id: alternativeId,
      reason
    };
  }

  // Helper method to create remove action
  createRemoveAction(itemType, itemId, reason = null) {
    return {
      op: 'remove',
      item_type: itemType,
      item_id: itemId,
      reason
    };
  }

  // Helper method to create reservation item
  createReservationItem(type, providerQuoteId, amount = null, currency = 'INR') {
    return {
      type,
      provider_quote_id: providerQuoteId,
      amount,
      currency
    };
  }
}

export default new TripService();
