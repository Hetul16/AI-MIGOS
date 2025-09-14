import { getAuth } from 'firebase/auth';
import { app } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const addWeatherAlert = async (alertData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/weather_alerts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alertData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding weather alert:', error);
        throw error;
    }
};

export const getItineraryWeatherAlerts = async (itineraryId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/itineraries/${itineraryId}/weather_alerts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.weather_alerts;
    } catch (error) {
        console.error('Error fetching itinerary weather alerts:', error);
        throw error;
    }
};

export const updateWeatherAlert = async (alertId, updateData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/weather_alerts/${alertId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating weather alert:', error);
        throw error;
    }
};

export const deleteWeatherAlert = async (alertId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/weather_alerts/${alertId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting weather alert:', error);
        throw error;
    }
};
