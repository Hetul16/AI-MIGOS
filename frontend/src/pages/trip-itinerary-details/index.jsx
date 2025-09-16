import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AIAssistantSidebar from '../../components/ui/AIAssistantSidebar';
import NotificationToast from '../../components/ui/NotificationToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ItineraryTimeline from './components/ItineraryTimeline';
import BudgetTracker from './components/BudgetTracker';
import InteractiveMap from './components/InteractiveMap';
import GroupCollaboration from './components/GroupCollaboration';
import EmergencyCopilot from './components/EmergencyCopilot';
import BookingIntegration from './components/BookingIntegration';
import WeatherIntegration from './components/WeatherIntegration';

const TripItineraryDetails = () => {
  const navigate = useNavigate();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingActivity, setBookingActivity] = useState(null);

  // Mock trip data
  const tripData = {
    id: 'trip_001',
    title: 'Golden Triangle Adventure',
    destination: 'Delhi - Agra - Jaipur',
    duration: '7 Days, 6 Nights',
    startDate: '2025-01-03',
    endDate: '2025-01-09',
    travelers: 4,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    days: [
      {
        title: 'Arrival in Delhi',
        date: 'January 3, 2025',
        totalCost: 8500,
        activities: [
          {
            id: 'act_001',
            title: 'Airport Transfer',
            type: 'transport',
            time: '10:00 AM',
            duration: '1 hour',
            cost: 1500,
            status: 'booked',
            location: 'Indira Gandhi International Airport',
            description: 'Private car transfer from airport to hotel',
            image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'
          },
          {
            id: 'act_002',
            title: 'Hotel Check-in',
            type: 'hotel',
            time: '12:00 PM',
            duration: '30 minutes',
            cost: 0,
            status: 'booked',
            location: 'The Imperial Hotel, New Delhi',
            description: 'Luxury accommodation in the heart of Delhi',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
          },
          {
            id: 'act_003',
            title: 'Red Fort Visit',
            type: 'attraction',
            time: '3:00 PM',
            duration: '2 hours',
            cost: 2000,
            status: 'pending',
            location: 'Red Fort, Old Delhi',
            description: 'Explore the historic Mughal fortress and UNESCO World Heritage site',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
          },
          {
            id: 'act_004',
            title: 'Dinner at Karim\'s',
            type: 'restaurant',
            time: '7:00 PM',
            duration: '1.5 hours',
            cost: 3000,
            status: 'pending',
            location: 'Karim\'s, Jama Masjid',
            description: 'Authentic Mughlai cuisine at the legendary restaurant',
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
          }
        ]
      },
      {
        title: 'Delhi Sightseeing',
        date: 'January 4, 2025',
        totalCost: 12000,
        activities: [
          {
            id: 'act_005',
            title: 'India Gate & Rajpath',
            type: 'attraction',
            time: '9:00 AM',
            duration: '1.5 hours',
            cost: 500,
            status: 'pending',
            location: 'India Gate, New Delhi',
            description: 'Visit the iconic war memorial and take photos at Rajpath',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
          },
          {
            id: 'act_006',
            title: 'Lotus Temple',
            type: 'attraction',
            time: '11:30 AM',
            duration: '1 hour',
            cost: 0,
            status: 'pending',
            location: 'Lotus Temple, South Delhi',
            description: 'Marvel at the architectural beauty of the Bahá\'í House of Worship',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
          },
          {
            id: 'act_007',
            title: 'Lunch at Connaught Place',
            type: 'restaurant',
            time: '1:00 PM',
            duration: '1 hour',
            cost: 2500,
            status: 'pending',
            location: 'Connaught Place, New Delhi',
            description: 'Shopping and dining at Delhi\'s commercial hub',
            image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
          },
          {
            id: 'act_008',
            title: 'Qutub Minar Complex',
            type: 'attraction',
            time: '3:30 PM',
            duration: '2 hours',
            cost: 1000,
            status: 'pending',
            location: 'Qutub Minar, Mehrauli',
            description: 'Explore the tallest brick minaret in the world',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400'
          }
        ]
      }
    ]
  };

  const budgetData = {
    totalBudget: 150000,
    totalSpent: 89500,
    categories: [
      { name: 'Accommodation', budget: 45000, spent: 32000 },
      { name: 'Transportation', budget: 25000, spent: 18500 },
      { name: 'Food & Dining', budget: 30000, spent: 22000 },
      { name: 'Activities', budget: 35000, spent: 12000 },
      { name: 'Shopping', budget: 10000, spent: 3500 },
      { name: 'Miscellaneous', budget: 5000, spent: 1500 }
    ]
  };

  const allActivities = tripData?.days?.flatMap(day => day?.activities);

  useEffect(() => {
    // Show welcome toast
    setTimeout(() => {
      if (window.showToast) {
        window.showToast({
          type: 'ai',
          title: 'Trip Assistant Ready',
          message: 'I\'m here to help you manage your Golden Triangle adventure. Need any assistance?',
          duration: 5000
        });
      }
    }, 1000);
  }, []);

  const handleActivityEdit = (activity) => {
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Edit Activity',
        message: `Editing ${activity?.title}. Feature coming soon!`,
        duration: 3000
      });
    }
  };

  const handleBookingClick = (activity) => {
    setBookingActivity(activity);
    setShowBookingModal(true);
  };

  const handleBookingComplete = (bookingData) => {
    setShowBookingModal(false);
    setBookingActivity(null);
    
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Booking Confirmed!',
        message: `${bookingData?.title} has been successfully booked.`,
        duration: 5000
      });
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
    { id: 'group', label: 'Group', icon: 'Users', count: 4 },
    { id: 'weather', label: 'Weather', icon: 'CloudSun', count: null },
    { id: 'emergency', label: 'Emergency', icon: 'Shield', count: null }
  ];

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
                      {tripData?.title}
                    </h1>
                    <p className="text-muted-foreground font-caption">
                      {tripData?.destination} • {tripData?.duration}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span className="font-caption">
                      {new Date(tripData.startDate)?.toLocaleDateString('en-GB')} - {new Date(tripData.endDate)?.toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} />
                    <span className="font-caption">{tripData?.travelers} travelers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-caption capitalize">{tripData?.status}</span>
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
              
              {activeTab === 'group' && (
                <GroupCollaboration
                  tripId={tripData?.id}
                  onVoteSubmit={handleVoteSubmit}
                  onCommentAdd={handleCommentAdd}
                />
              )}
              
              {activeTab === 'weather' && (
                <WeatherIntegration
                  location={tripData?.destination}
                  onWeatherAlert={(alert) => console.log('Weather alert:', alert)}
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
              onBookingComplete={handleBookingComplete}
              onBookingCancel={handleBookingCancel}
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
    </div>
  );
};

export default TripItineraryDetails;