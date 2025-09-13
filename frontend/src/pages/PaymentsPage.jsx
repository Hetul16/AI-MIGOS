import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext'; // Corrected import for AuthContext
import { getAuth } from 'firebase/auth';
import app from '../firebase/config'; // Corrected import for app
import { Link } from 'react-router-dom';

const PaymentsPage = () => {
    const { currentUser } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth(app);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const token = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:8000/api/v1/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBookings(data.bookings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentUser, auth]);

    if (loading) {
        return <div className="text-center py-8">Loading payments...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!currentUser) {
        return <div className="text-center py-8">Please log in to view your payments.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Payments & Bookings</h1>
            {bookings.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
                    <Link to="/discover" className="text-blue-600 hover:underline">
                        Discover new trips to book!
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking ID: {booking.id}</h2>
                                <p className="text-gray-600 mb-1">Status: <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</span></p>
                                <p className="text-gray-600 mb-1">Itinerary ID: {booking.itinerary_id}</p>
                                <p className="text-gray-600 mb-1">Reservation ID: {booking.reservation_id}</p>
                                <p className="text-gray-600 mb-1">Payment ID: {booking.payment_id}</p>
                                <p className="text-gray-600 mb-1">Created At: {new Date(booking.created_at._seconds * 1000).toLocaleString()}</p>
                                {/* Add more booking details as needed */}
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <Link to={`/trips/${booking.itinerary_id}`} className="text-blue-600 hover:underline text-sm">
                                    View Itinerary
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;
