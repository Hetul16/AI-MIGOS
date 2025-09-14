import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AIAssistantSidebar from '../../components/ui/AIAssistantSidebar';
import NotificationToast from '../../components/ui/NotificationToast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ItineraryTimeline from './components/ItineraryTimeline';
import BudgetTracker from './components/BudgetTracker';
import InteractiveMap from './components/InteractiveMap';
import GroupCollaboration from './components/GroupCollaboration';
import EmergencyCopilot from './components/EmergencyCopilot';
import BookingIntegration from './components/BookingIntegration';
import WeatherIntegration from './components/WeatherIntegration';
import HiddenGems from './components/HiddenGems';
import tripService from '../../services/tripService';
import { createReservation } from '../../services/reservationService';
import { getItineraryGroupMembers } from '../../services/groupMemberService';
import { getItineraryComments } from '../../services/commentService';
import { getItineraryVotes } from '../../services/voteService';
import { getAllHiddenGems } from '../../services/hiddenGemService';
import { getItineraryWeatherAlerts } from '../../services/weatherAlertService';
import { createBooking } from '../../services/bookingService'; // Import booking service
import { mockTrips } from '../../data/mockTrips';

const TripItineraryDetails = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingActivity, setBookingActivity] = useState(null);
  const [isTripConfirmed, setIsTripConfirmed] = useState(false); // New state for trip confirmation
  
  // Trip data state
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [fetchedWeatherAlerts, setFetchedWeatherAlerts] = useState([]); // New state for fetched weather alerts

  // Fetch trip data
  const fetchTripData = async () => {
    if (!tripId) {
      setError('No trip ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, use mock data. In production, use the real API:
      // const response = await tripService.getTrip(tripId);
      // if (response.success && response.itinerary) {
      //   setTripData(response.itinerary);
      // } else {
      //   setError('Failed to load trip data');
      // }
      
      // Mock data for testing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      const mockTrip = mockTrips.find(trip => trip.id === tripId);
      if (mockTrip) {
        setTripData(mockTrip);
      } else {
        setError('Trip not found');
      }
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process budget data from trip data
  const budgetData = tripData ? {
    totalBudget: tripData.budget?.total || 150000,
    totalSpent: tripData.budget?.spent || 0,
    categories: tripData.budget?.categories || [
      { name: 'Accommodation', budget: 45000, spent: 0 },
      { name: 'Transportation', budget: 25000, spent: 0 },
      { name: 'Food & Dining', budget: 30000, spent: 0 },
      { name: 'Activities', budget: 35000, spent: 0 },
      { name: 'Shopping', budget: 10000, spent: 0 },
      { name: 'Miscellaneous', budget: 5000, spent: 0 }
    ]
  } : null;

  const allActivities = tripData?.summary?.days?.flatMap(day => day?.activities) || [];

  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!tripId) return;
      try {
        const members = await getItineraryGroupMembers(tripId);
        setGroupMembers(members);
      } catch (err) {
        console.error('Error fetching group members:', err);
        // Optionally set an error state for group members specifically
      }
    };
    fetchGroupMembers();
  }, [tripId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!tripId) return;
      try {
        const fetchedComments = await getItineraryComments(tripId);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [tripId]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!tripId) return;
      try {
        const fetchedVotes = await getItineraryVotes(tripId);
        setVotes(fetchedVotes);
      } catch (err) {
        console.error('Error fetching votes:', err);
      }
    };
    fetchVotes();
  }, [tripId]);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      if (!tripId) return;
      try {
        const fetchedGems = await getAllHiddenGems(tripId);
        setHiddenGems(fetchedGems);
      } catch (err) {
        console.error('Error fetching hidden gems:', err);
      }
    };
    fetchHiddenGems();
  }, [tripId]);

  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      if (!tripId) return;
      try {
        const alerts = await getItineraryWeatherAlerts(tripId);
        setFetchedWeatherAlerts(alerts);
      } catch (err) {
        console.error('Error fetching weather alerts:', err);
      }
    };
    fetchWeatherAlerts();
  }, [tripId]);

  useEffect(() => {
    // Show welcome toast when trip data is loaded
    if (tripData && !loading) {
      setTimeout(() => {
        if (window.showToast) {
          window.showToast({
            type: 'ai',
            title: 'Trip Assistant Ready',
            message: `I'm here to help you manage your ${tripData.title || 'trip'}. Need any assistance?`,
            duration: 5000
          });
        }
      }, 1000);
    }
  }, [tripData, loading]);

  // Trip customization functions
  const handleActivitySwap = async (itemType, itemId, alternativeId, reason) => {
    try {
      const action = tripService.createSwapAction(itemType, itemId, alternativeId, reason);
      const response = await tripService.customizeTrip(tripId, [action]);
      
      if (response.success) {
        // Refresh trip data
        await fetchTripData();
        
        if (window.showToast) {
          window.showToast({
            type: 'success',
            title: 'Activity Swapped',
            message: 'The activity has been successfully replaced.',
            duration: 3000
          });
        }
      }
    } catch (err) {
      console.error('Error swapping activity:', err);
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Swap Failed',
          message: err.message || 'Failed to swap activity. Please try again.',
          duration: 3000
        });
      }
    }
  };

  const handleActivityAdd = async (itemType, alternativeId, reason) => {
    try {
      const action = tripService.createAddAction(itemType, alternativeId, reason);
      const response = await tripService.customizeTrip(tripId, [action]);
      
      if (response.success) {
        // Refresh trip data
        await fetchTripData();
        
        if (window.showToast) {
          window.showToast({
            type: 'success',
            title: 'Activity Added',
            message: 'The activity has been successfully added to your itinerary.',
            duration: 3000
          });
        }
      }
    } catch (err) {
      console.error('Error adding activity:', err);
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Add Failed',
          message: err.message || 'Failed to add activity. Please try again.',
          duration: 3000
        });
      }
    }
  };

  const handleActivityRemove = async (itemType, itemId, reason) => {
    try {
      const action = tripService.createRemoveAction(itemType, itemId, reason);
      const response = await tripService.customizeTrip(tripId, [action]);
      
      if (response.success) {
        // Refresh trip data
        await fetchTripData();
        
        if (window.showToast) {
          window.showToast({
            type: 'success',
            title: 'Activity Removed',
            message: 'The activity has been successfully removed from your itinerary.',
            duration: 3000
          });
        }
      }
    } catch (err) {
      console.error('Error removing activity:', err);
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Remove Failed',
          message: err.message || 'Failed to remove activity. Please try again.',
          duration: 3000
        });
      }
    }
  };

  const handleActivityEdit = (activity) => {
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Edit Activity',
        message: `Editing ${activity?.title}. Use the swap/add/remove options to customize your trip.`,
        duration: 3000
      });
    }
  };

  const handleBookingClick = (activity) => {
    setBookingActivity(activity);
    setShowBookingModal(true);
  };

  const handleConfirmTripBooking = async () => {
    // This is where the logic to store the trip booking in the database would go.
    // For now, we'll simulate success and then navigate to the payments page.
    setLoading(true);
    setError(null);
    try {
      // Create a reservation object based on tripData
      const reservationData = {
        itinerary_id: tripId,
        service_type: 'trip_package', // Or more specific types like 'hotel', 'flight'
        service_details: {
          title: tripData.title,
          destination: tripData.destination,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          traveler_count: tripData.traveler_count,
          // Add other relevant trip details
        },
        amount: tripData.budget?.total || 0, // Use total budget as reservation amount
        currency: tripData.budget?.currency || 'INR',
      };

      const response = await createReservation(reservationData);
      
      if (response.success && response.reservation_id) {
        setIsTripConfirmed(true); // Mark as confirmed on the frontend
        
        if (window.showToast) {
          window.showToast({
            type: 'success',
            title: 'Trip Confirmed!',
            message: 'Your trip details have been saved. Proceed to payment.',
            duration: 5000
          });
        }
        // Redirect to a payment initiation page or modal, passing reservation_id
        navigate(`/my-payments?reservationId=${response.reservation_id}&tripId=${tripId}&status=pending_payment`);
      } else {
        throw new Error(response.detail || 'Failed to create reservation.');
      }
    } catch (err) {
      console.error('Error confirming trip booking:', err);
      setError(err.message || 'Failed to confirm trip booking. Please try again.');
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Confirmation Failed',
          message: err.message || 'Failed to confirm trip booking. Please try again.',
          duration: 3000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = async (reservationId, paymentId, bookingDetails) => {
    setLoading(true);
    setError(null);
    try {
      const bookingData = {
        itinerary_id: tripId,
        reservation_id: reservationId,
        payment_id: paymentId,
        service_type: bookingDetails.service_type,
        service_details: bookingDetails.service_details,
        provider_refs: bookingDetails.provider_refs || [],
      };
      const response = await createBooking(bookingData);

      if (response.success && response.booking_id) {
        setShowBookingModal(false);
        setBookingActivity(null);
        
        if (window.showToast) {
          window.showToast({
            type: 'success',
            title: 'Booking Confirmed!',
            message: `Your booking (ID: ${response.booking_id}) has been successfully confirmed.`,
            duration: 5000
          });
        }
        // Refresh trip data to reflect new booking status
        fetchTripData();
      } else {
        throw new Error(response.detail || 'Failed to create booking.');
      }
    } catch (err) {
      console.error('Error completing booking:', err);
      setError(err.message || 'Failed to finalize booking. Please try again.');
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Booking Failed',
          message: err.message || 'Failed to finalize booking. Please try again.',
          duration: 3000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookingCancel = () => {
    setShowBookingModal(false);
    setBookingActivity(null);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  const handleVoteSubmit = (voteId, optionId) => {
    console.log('Vote submitted:', { voteId, optionId });
  };

  const handleCommentAdd = (comment) => {
    console.log('Comment added:', comment);
  };

  const handleSOSActivate = () => {
    console.log('SOS activated');
  };

  const handleWeatherAlert = (alerts) => {
    setWeatherAlerts(alerts);
    if (alerts.length > 0 && window.showToast) {
      window.showToast({
        type: 'warning',
        title: 'Weather Alert',
        message: `${alerts.length} weather alert(s) for your trip. Check the Weather tab for details.`,
        duration: 5000
      });
    }
  };

  const handleAddExpense = () => {
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Add Expense',
        message: 'Expense tracking feature coming soon!',
        duration: 3000
      });
    }
  };

  const handleExportItinerary = () => {
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Exporting Itinerary',
        message: 'Your itinerary is being prepared for download...',
        duration: 4000
      });
    }
  };

  const handleShareTrip = () => {
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Share Trip',
        message: 'Trip sharing feature coming soon!',
        duration: 3000
      });
    }
  };

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar', count: allActivities?.length },
    { id: 'budget', label: 'Budget', icon: 'PiggyBank', count: null },
    { id: 'map', label: 'Map', icon: 'Map', count: null },
    { id: 'gems', label: 'Hidden Gems', icon: 'Compass', count: null },
    { id: 'group', label: 'Group', icon: 'Users', count: groupMembers.length }, // Update count to actual group members
    { id: 'weather', label: 'Weather', icon: 'CloudSun', count: weatherAlerts.length > 0 ? weatherAlerts.length : null },
    { id: 'emergency', label: 'Emergency', icon: 'Shield', count: null }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NotificationToast />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-muted-foreground font-caption">Loading trip details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NotificationToast />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="glass glass-hover rounded-2xl p-8 text-center">
              <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-xl font-heading font-heading-semibold text-foreground mb-2">
                Unable to Load Trip
              </h2>
              <p className="text-muted-foreground font-caption mb-6">
                {error}
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/trip-planning-wizard')}
                >
                  Back to Planning
                </Button>
                <Button
                  variant="default"
                  onClick={fetchTripData}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!tripData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NotificationToast />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="glass glass-hover rounded-2xl p-8 text-center">
              <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading font-heading-semibold text-foreground mb-2">
                Trip Not Found
              </h2>
              <p className="text-muted-foreground font-caption mb-6">
                The requested trip could not be found or you don't have permission to view it.
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/trip-planning-wizard')}
              >
                Plan New Trip
              </Button>
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
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Trip Header */}
          <div className="glass glass-hover rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <button
                    onClick={() => navigate('/trip-planning-wizard')}
                    className="p-2 rounded-lg hover:bg-muted/20 transition-colors duration-200"
                  >
                    <Icon name="ArrowLeft" size={20} className="text-muted-foreground" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-heading font-heading-bold text-foreground">
                      {tripData?.title || 'Untitled Trip'}
                    </h1>
                    <p className="text-muted-foreground font-caption">
                      {tripData?.destination || tripData?.summary?.destination || 'Destination'} • {tripData?.duration || 'Duration'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span className="font-caption">
                      {tripData?.start_date ? new Date(tripData.start_date).toLocaleDateString('en-GB') : 'Start Date'} - {tripData?.end_date ? new Date(tripData.end_date).toLocaleDateString('en-GB') : 'End Date'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} />
                    <span className="font-caption">{tripData?.travelers || tripData?.traveler_count || 1} travelers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tripData?.status === 'confirmed' ? 'bg-success' :
                      tripData?.status === 'pending' ? 'bg-warning' :
                      tripData?.status === 'cancelled' ? 'bg-error' : 'bg-muted'
                    }`} />
                    <span className="font-caption capitalize">{tripData?.status || 'unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Share"
                  onClick={handleShareTrip}
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={handleExportItinerary}
                >
                  Export
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Edit"
                  className="bg-gradient-intelligent"
                >
                  Edit Trip
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="glass glass-hover rounded-2xl mb-8 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-caption font-caption-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'text-accent bg-accent/10 border-b-2 border-accent' :'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count && (
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'itinerary' && (
                <ItineraryTimeline
                  itinerary={tripData}
                  onActivityEdit={handleActivityEdit}
                  onBookingClick={handleBookingClick}
                  onActivitySwap={handleActivitySwap}
                  onActivityAdd={handleActivityAdd}
                  onActivityRemove={handleActivityRemove}
                />
              )}
              
              {activeTab === 'budget' && (
                <BudgetTracker
                  budgetData={budgetData}
                  onAddExpense={handleAddExpense}
                />
              )}
              
              {activeTab === 'map' && (
                <InteractiveMap
                  activities={allActivities}
                  onActivitySelect={handleActivitySelect}
                  selectedActivity={selectedActivity}
                />
              )}
              
              {activeTab === 'gems' && (
                <HiddenGems
                  tripId={tripId}
                  hiddenGems={hiddenGems} // Pass hidden gems to component
                  onGemSelect={(gem) => {
                    if (window.showToast) {
                      window.showToast({
                        type: 'info',
                        title: 'Hidden Gem Selected',
                        message: `You selected ${gem.name}. This feature will be enhanced soon!`,
                        duration: 3000
                      });
                    }
                  }}
                />
              )}
              
              {activeTab === 'group' && (
                <GroupCollaboration
                  tripId={tripData?.id}
                  groupMembers={groupMembers}
                  comments={comments}
                  votes={votes} // Pass votes to component
                  onVoteSubmit={handleVoteSubmit}
                  onCommentAdd={handleCommentAdd}
                />
              )}
              
              {activeTab === 'weather' && (
                <WeatherIntegration
                  tripId={tripId}
                  location={tripData?.destination || tripData?.summary?.destination}
                  weatherAlerts={fetchedWeatherAlerts} // Pass fetched weather alerts to component
                  onWeatherAlert={handleWeatherAlert}
                />
              )}
              
              {activeTab === 'emergency' && (
                <EmergencyCopilot
                  location={tripData?.destination}
                  onSOSActivate={handleSOSActivate}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="glass glass-hover rounded-2xl p-6">
                <h3 className="font-heading font-heading-semibold text-foreground mb-4">
                  Trip Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-caption">Total Activities</span>
                    <span className="font-caption font-caption-medium text-foreground">
                      {allActivities?.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-caption">Booked</span>
                    <span className="font-caption font-caption-medium text-success">
                      {allActivities?.filter(a => a?.status === 'booked')?.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-caption">Pending</span>
                    <span className="font-caption font-caption-medium text-warning">
                      {allActivities?.filter(a => a?.status === 'pending')?.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-caption">Budget Used</span>
                    <span className="font-caption font-caption-medium text-foreground">
                      {((budgetData?.totalSpent / budgetData?.totalBudget) * 100)?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass glass-hover rounded-2xl p-6">
                <h3 className="font-heading font-heading-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    className="w-full justify-start"
                  >
                    Add Activity
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Calendar"
                    className="w-full justify-start"
                  >
                    Modify Dates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Users"
                    className="w-full justify-start"
                  >
                    Invite Travelers
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MessageCircle"
                    className="w-full justify-start"
                    onClick={() => setIsAIAssistantOpen(true)}
                  >
                    Ask AI Assistant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {showBookingModal && bookingActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <BookingIntegration
              activity={bookingActivity}
              tripId={tripId}
              onBookingComplete={handleBookingComplete}
              onBookingCancel={handleBookingCancel}
              // Pass reservationId and paymentId if they are available from a previous step
              // For now, assume BookingIntegration handles its own payment initiation
            />
          </div>
        </div>
      )}
      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        isOpen={isAIAssistantOpen}
        onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        contextData={tripData}
      />

      {/* Trip Confirmation Block */}
      {!isTripConfirmed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-glass border-t border-border/50 p-4 shadow-prominent">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">Confirm Your Trip Booking</h3>
              <p className="text-sm text-muted-foreground font-caption">Review your itinerary and confirm to proceed with payment.</p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleConfirmTripBooking}
              disabled={loading}
              className="bg-gradient-intelligent"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Confirm Trip & Proceed to Payment'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripItineraryDetails;
