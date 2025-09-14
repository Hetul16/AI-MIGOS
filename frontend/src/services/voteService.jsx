import { getAuth } from 'firebase/auth';
import { app } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const addVote = async (voteData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/votes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voteData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding vote:', error);
        throw error;
    }
};

export const getItineraryVotes = async (itineraryId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/itineraries/${itineraryId}/votes`, {
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
        return data.votes;
    } catch (error) {
        console.error('Error fetching itinerary votes:', error);
        throw error;
    }
};

export const getActivityVotes = async (activityId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/activities/${activityId}/votes`, {
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
        return data.votes;
    } catch (error) {
        console.error('Error fetching activity votes:', error);
        throw error;
    }
};

export const deleteVote = async (voteId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/votes/${voteId}`, {
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
        console.error('Error deleting vote:', error);
        throw error;
    }
};
