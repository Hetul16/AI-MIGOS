import { getAuth } from 'firebase/auth';
import { app } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const createBooking = async (bookingData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const getBooking = async (bookingId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
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
        return data.booking;
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }
};

export const cancelBooking = async (bookingId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: 'POST',
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
        console.error('Error canceling booking:', error);
        throw error;
    }
};
