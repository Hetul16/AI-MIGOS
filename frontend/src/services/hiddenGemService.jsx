import { getAuth } from 'firebase/auth';
import { app } from '../firebase/config';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const addHiddenGem = async (gemData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/hidden_gems`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gemData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding hidden gem:', error);
        throw error;
    }
};

export const getHiddenGem = async (gemId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/hidden_gems/${gemId}`, {
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
        return data.gem;
    } catch (error) {
        console.error('Error fetching hidden gem:', error);
        throw error;
    }
};

export const getAllHiddenGems = async (itineraryId = null) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const url = itineraryId ? `${API_BASE_URL}/hidden_gems?itinerary_id=${itineraryId}` : `${API_BASE_URL}/hidden_gems`;
        const response = await fetch(url, {
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
        return data.hidden_gems;
    } catch (error) {
        console.error('Error fetching all hidden gems:', error);
        throw error;
    }
};

export const updateHiddenGem = async (gemId, updateData) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/hidden_gems/${gemId}`, {
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
        console.error('Error updating hidden gem:', error);
        throw error;
    }
};

export const deleteHiddenGem = async (gemId) => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user logged in.');
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/hidden_gems/${gemId}`, {
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
        console.error('Error deleting hidden gem:', error);
        throw error;
    }
};
