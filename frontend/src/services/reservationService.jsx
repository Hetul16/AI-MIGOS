import { getAuth } from 'firebase/auth';
import { app } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const createReservation = async (reservationData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
};

export const getReservation = async (reservationId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
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
        return data.reservation;
    } catch (error) {
        console.error('Error fetching reservation:', error);
        throw error;
    }
};

export const updateReservation = async (reservationId, updateData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
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
        console.error('Error updating reservation:', error);
        throw error;
    }
};

export const deleteReservation = async (reservationId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
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
        console.error('Error deleting reservation:', error);
        throw error;
    }
};
