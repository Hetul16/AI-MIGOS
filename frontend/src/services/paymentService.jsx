import { getAuth } from 'firebase/auth';
import app from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchUserBookings = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/bookings`, {
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
        return data.bookings;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};
