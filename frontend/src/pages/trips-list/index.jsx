import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import NotificationToast from '../../components/ui/NotificationToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import tripService from '../../services/tripService';
const TripsList = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, ongoing, past

  useEffect(() => {
    fetchTrips();
  }, [filter]);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await tripService.getTrips(filter === 'all' ? null : filter);
      if (response.success && response.trips) {
        setTrips(response.trips);
      } else {
        setError('Failed to load trips');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = (tripId) => {
    navigate(`/trip-itinerary-details/${tripId}`);
  };

  const handleCreateTrip = () => {
    navigate('/trip-planning-wizard');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'cancelled': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filters = [
    { id: 'all', label: 'All Trips', count: null },
    { id: 'upcoming', label: 'Upcoming', count: null },
    { id: 'ongoing', label: 'Ongoing', count: null },
    { id: 'past', label: 'Past', count: null }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NotificationToast />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-muted-foreground font-caption">Loading your trips...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NotificationToast />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-heading-bold text-foreground mb-2">
                My Trips
              </h1>
              <p className="text-muted-foreground font-caption">
                Manage and view all your travel plans
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              iconName="Plus"
              onClick={handleCreateTrip}
              className="bg-gradient-intelligent"
            >
              Plan New Trip
            </Button>
          </div>

          {/* Filters */}
          <div className="glass glass-hover rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-caption transition-colors duration-200 ${
                    filter === filterOption.id
                      ? 'bg-accent text-accent-foreground' : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                >
                  <span>{filterOption.label}</span>
                  {filterOption.count && (
                    <span className="bg-background/20 text-xs px-2 py-1 rounded-full">
                      {filterOption.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="glass glass-hover rounded-2xl p-8 text-center border-l-4 border-l-error">
              <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
              <h3 className="text-xl font-heading font-heading-semibold text-foreground mb-2">
                Unable to Load Trips
              </h3>
              <p className="text-muted-foreground font-caption mb-6">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={fetchTrips}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && trips.length === 0 && (
            <div className="glass glass-hover rounded-2xl p-8 text-center">
              <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-heading font-heading-semibold text-foreground mb-2">
                No Trips Found
              </h3>
              <p className="text-muted-foreground font-caption mb-6">
                {filter === 'all' 
                  ? "You haven't planned any trips yet. Start planning your first adventure!"
                  : `No ${filter} trips found. Try a different filter or plan a new trip.`
                }
              </p>
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                onClick={handleCreateTrip}
                className="bg-gradient-intelligent"
              >
                Plan Your First Trip
              </Button>
            </div>
          )}

          {/* Trips Grid */}
          {!loading && !error && trips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => handleTripClick(trip.id)}
                  className="glass glass-hover rounded-2xl p-6 cursor-pointer group hover:shadow-ai-glow transition-all duration-300"
                >
                  {/* Trip Image */}
                  <div className="w-full h-48 rounded-xl bg-gradient-intelligent/10 mb-4 flex items-center justify-center">
                    <Icon name="MapPin" size={48} className="text-accent" />
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-heading font-heading-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                        {trip.title || 'Untitled Trip'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Icon name={getStatusIcon(trip.status)} size={16} className={getStatusColor(trip.status)} />
                        <span className={`text-xs font-caption capitalize ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground font-caption text-sm">
                      {trip.destination || trip.summary?.destination || 'Destination'}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span className="font-caption">
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span className="font-caption">
                          {trip.travelers || trip.traveler_count || 1} travelers
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-caption">
                          {trip.duration || 'Duration'}
                        </span>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-accent transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripsList;
