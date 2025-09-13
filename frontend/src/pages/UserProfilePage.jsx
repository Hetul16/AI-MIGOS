import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NotificationToast from '../components/ui/NotificationToast';
import authService from '../services/authService';

const UserProfilePage = () => {
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState('');
  const [travelPreferences, setTravelPreferences] = useState(''); // Storing as string for easy input
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser && currentUser.token) {
        setLoading(true);
        setError(null);
        try {
          const data = await getUserProfile(currentUser.token);
          setProfile(data.profile);
          setFullName(data.profile.full_name || '');
          setTravelPreferences(data.profile.travel_preferences ? data.profile.travel_preferences.join(', ') : '');
          setSubscribeNewsletter(data.profile.subscribe_newsletter || false);
          setProfileComplete(data.profile.profile_complete || false);
        } catch (err) {
          setError('Failed to fetch profile: ' + err.message);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        // If not logged in and auth is not loading, redirect or show message
        setLoading(false);
        setError('Please log in to view your profile.');
      }
    };

    fetchProfile();
  }, [currentUser, authLoading]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updateData = {
        full_name: fullName,
        travel_preferences: travelPreferences.split(',').map(pref => pref.trim()).filter(pref => pref !== ''),
        subscribe_newsletter: subscribeNewsletter,
        profile_complete: profileComplete,
      };
      await updateUserProfile(currentUser.token, updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      // Re-fetch profile to ensure UI is in sync with backend, including updated_at
      const data = await getUserProfile(currentUser.token);
      setProfile(data.profile);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form fields to current profile data
    if (profile) {
      setFullName(profile.full_name || '');
      setTravelPreferences(profile.travel_preferences ? profile.travel_preferences.join(', ') : '');
      setSubscribeNewsletter(profile.subscribe_newsletter || false);
      setProfileComplete(profile.profile_complete || false);
    }
  };

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <NotificationToast type="error" message={error} />;
  }

  if (!profile) {
    return <div className="text-center text-gray-600">No profile data available.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>

      {success && <NotificationToast type="success" message={success} />}
      {error && <NotificationToast type="error" message={error} />}

      <div className="bg-white shadow-md rounded-lg p-6">
        {!isEditing ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
              <p className="text-gray-900">{profile.full_name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Travel Preferences:</label>
              <p className="text-gray-900">{profile.travel_preferences && profile.travel_preferences.length > 0 ? profile.travel_preferences.join(', ') : 'None'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Subscribe Newsletter:</label>
              <p className="text-gray-900">{profile.subscribe_newsletter ? 'Yes' : 'No'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Profile Complete:</label>
              <p className="text-gray-900">{profile.profile_complete ? 'Yes' : 'No'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Account Created:</label>
              <p className="text-gray-900">{new Date(profile.created_at._seconds * 1000).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Last Login:</label>
              <p className="text-gray-900">{new Date(profile.last_login._seconds * 1000).toLocaleString()}</p>
            </div>
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <Input
                id="email"
                type="email"
                value={profile.email} // Email is not editable via this endpoint
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="travelPreferences" className="block text-gray-700 text-sm font-bold mb-2">Travel Preferences (comma-separated):</label>
              <Input
                id="travelPreferences"
                type="text"
                value={travelPreferences}
                onChange={(e) => setTravelPreferences(e.target.value)}
                placeholder="e.g., beach, mountains, adventure"
              />
            </div>
            <div className="mb-4 flex items-center">
              <Checkbox
                id="subscribeNewsletter"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              />
              <label htmlFor="subscribeNewsletter" className="ml-2 text-gray-700 text-sm font-bold">Subscribe to Newsletter</label>
            </div>
            <div className="mb-6 flex items-center">
              <Checkbox
                id="profileComplete"
                checked={profileComplete}
                onChange={(e) => setProfileComplete(e.target.checked)}
              />
              <label htmlFor="profileComplete" className="ml-2 text-gray-700 text-sm font-bold">Profile Complete</label>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
