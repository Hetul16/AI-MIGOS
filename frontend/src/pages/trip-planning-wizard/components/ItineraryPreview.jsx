import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import tripService from '../../../services/tripService';

const ItineraryPreview = ({ 
  destination, 
  dates, 
  budget, 
  preferences, 
  onComplete, 
  onBack 
}) => {
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(generateMockItinerary());
  const [selectedDay, setSelectedDay] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tripTitle, setTripTitle] = useState('');

  function generateMockItinerary() {
    const days = dates?.duration || 3;
    const mockItinerary = [];

    for (let i = 0; i < days; i++) {
      mockItinerary?.push({
        day: i + 1,
        date: new Date(new Date(dates?.startDate).getTime() + i * 24 * 60 * 60 * 1000)?.toLocaleDateString(),
        activities: [
          {
            id: `${i}-1`,
            time: '09:00',
            title: i === 0 ? 'Arrival & Check-in' : `Morning Exploration - Day ${i + 1}`,
            description: i === 0 ? 'Arrive at destination and check into accommodation' : 'Start your day with local breakfast and morning activities',
            type: 'accommodation',
            duration: '2 hours',
            cost: i === 0 ? 0 : Math.floor(Math.random() * 2000) + 500,
            location: destination?.name || 'Destination',
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`
          },
          {
            id: `${i}-2`,
            time: '11:30',
            title: `Cultural Experience - ${['Local Market', 'Heritage Site', 'Art Gallery', 'Museum']?.[Math.floor(Math.random() * 4)]}`,
            description: 'Immerse yourself in local culture and traditions',
            type: 'culture',
            duration: '3 hours',
            cost: Math.floor(Math.random() * 1500) + 300,
            location: destination?.name || 'Destination',
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`
          },
          {
            id: `${i}-3`,
            time: '15:00',
            title: `Local Cuisine Experience`,
            description: 'Taste authentic local dishes at recommended restaurants',
            type: 'food',
            duration: '2 hours',
            cost: Math.floor(Math.random() * 2500) + 800,
            location: destination?.name || 'Destination',
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`
          },
          {
            id: `${i}-4`,
            time: '18:00',
            title: i === days - 1 ? 'Departure Preparation' : `Evening Activity - ${['Sunset Point', 'Night Market', 'Cultural Show', 'Relaxation']?.[Math.floor(Math.random() * 4)]}`,
            description: i === days - 1 ? 'Pack and prepare for departure' : 'End your day with memorable evening experiences',
            type: i === days - 1 ? 'transport' : 'entertainment',
            duration: '2 hours',
            cost: i === days - 1 ? 0 : Math.floor(Math.random() * 2000) + 400,
            location: destination?.name || 'Destination',
            image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop`
          }
        ]
      });
    }

    return mockItinerary;
  }

  const handleComplete = async () => {
    if (!tripTitle.trim()) {
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Trip Title Required',
          message: 'Please enter a title for your trip.',
          duration: 3000
        });
      }
      return;
    }

    setIsCreating(true);
    try {
      // Create trip data structure
      const tripData = {
        title: tripTitle,
        destination: destination?.name || 'Unknown Destination',
        start_date: dates?.startDate,
        end_date: dates?.endDate,
        duration: `${dates?.duration} days`,
        travelers: 1, // Default to 1, can be updated later
        budget: {
          total: budget?.amount || 0,
          currency: budget?.currency || 'INR',
          categories: [
            { name: 'Accommodation', budget: Math.floor((budget?.amount || 0) * 0.4), spent: 0 },
            { name: 'Transportation', budget: Math.floor((budget?.amount || 0) * 0.3), spent: 0 },
            { name: 'Food & Dining', budget: Math.floor((budget?.amount || 0) * 0.2), spent: 0 },
            { name: 'Activities', budget: Math.floor((budget?.amount || 0) * 0.1), spent: 0 }
          ]
        },
        summary: {
          destination: destination?.name || 'Unknown Destination',
          center: destination?.coordinates || { lat: 0, lng: 0 },
          days: itinerary.map((day, index) => ({
            date: day.date,
            activities: day.activities.map(activity => ({
              id: activity.id,
              title: activity.title,
              type: activity.type,
              time: activity.time,
              duration: activity.duration,
              cost: activity.cost,
              location: activity.location,
              description: activity.description,
              image: activity.image
            }))
          }))
        },
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // For now, we'll simulate trip creation since we don't have a create trip endpoint
      // In a real app, you would call: const response = await tripService.createTrip(tripData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock trip ID
      const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (window.showToast) {
        window.showToast({
          type: 'success',
          title: 'Trip Created Successfully!',
          message: 'Your trip has been saved and you can now view it in My Trips.',
          duration: 5000
        });
      }

      // Navigate to the trip details page
      navigate(`/trip-itinerary-details/${tripId}`);
      
    } catch (error) {
      console.error('Error creating trip:', error);
      if (window.showToast) {
        window.showToast({
          type: 'error',
          title: 'Failed to Create Trip',
          message: error.message || 'Something went wrong. Please try again.',
          duration: 5000
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      accommodation: 'Building2',
      culture: 'Building',
      food: 'ChefHat',
      transport: 'Car',
      entertainment: 'Music',
      nature: 'Trees',
      shopping: 'ShoppingBag'
    };
    return icons?.[type] || 'MapPin';
  };

  const getActivityColor = (type) => {
    const colors = {
      accommodation: 'text-blue-500',
      culture: 'text-purple-500',
      food: 'text-orange-500',
      transport: 'text-green-500',
      entertainment: 'text-pink-500',
      nature: 'text-emerald-500',
      shopping: 'text-yellow-500'
    };
    return colors?.[type] || 'text-accent';
  };

  const handleDragEnd = (result) => {
    if (!result?.destination) return;

    const dayIndex = selectedDay;
    const newItinerary = [...itinerary];
    const dayActivities = [...newItinerary?.[dayIndex]?.activities];
    
    const [reorderedItem] = dayActivities?.splice(result?.source?.index, 1);
    dayActivities?.splice(result?.destination?.index, 0, reorderedItem);
    
    newItinerary[dayIndex].activities = dayActivities;
    setItinerary(newItinerary);
  };

  const regenerateDay = async (dayIndex) => {
    setIsGenerating(true);
    // Simulate AI regeneration
    setTimeout(() => {
      const newItinerary = [...itinerary];
      newItinerary[dayIndex] = generateMockItinerary()?.[0];
      newItinerary[dayIndex].day = dayIndex + 1;
      setItinerary(newItinerary);
      setIsGenerating(false);
    }, 2000);
  };

  const totalCost = itinerary?.reduce((total, day) => 
    total + day?.activities?.reduce((dayTotal, activity) => dayTotal + activity?.cost, 0), 0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          Your AI-Generated Itinerary
        </h2>
        <p className="text-muted-foreground font-caption">
          Drag and drop activities to customize your perfect trip
        </p>
      </div>
      {/* Itinerary Summary */}
      <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-intelligent flex items-center justify-center mx-auto mb-2 ai-glow">
              <Icon name="MapPin" size={20} color="white" />
            </div>
            <h3 className="font-caption font-caption-medium text-foreground">
              {destination?.name || 'Destination'}
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              {destination?.type || 'Travel Destination'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-intelligent flex items-center justify-center mx-auto mb-2">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <h3 className="font-caption font-caption-medium text-foreground">
              {dates?.duration || 0} Days
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              {dates?.startDate} - {dates?.endDate}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-intelligent flex items-center justify-center mx-auto mb-2">
              <Icon name="Wallet" size={20} color="white" />
            </div>
            <h3 className="font-caption font-caption-medium text-foreground">
              {formatCurrency(totalCost)}
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              Estimated Cost
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-intelligent flex items-center justify-center mx-auto mb-2">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <h3 className="font-caption font-caption-medium text-foreground">
              AI Optimized
            </h3>
            <p className="text-xs text-muted-foreground font-caption">
              Personalized
            </p>
          </div>
        </div>
      </div>
      {/* Day Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {itinerary?.map((day, index) => (
          <button
            key={day?.day}
            onClick={() => setSelectedDay(index)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg font-caption font-caption-medium transition-all duration-200
              ${selectedDay === index
                ? 'bg-gradient-intelligent text-white shadow-ai-glow'
                : 'glass glass-hover text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Day {day?.day}
            <div className="text-xs opacity-80 mt-1">
              {day?.date}
            </div>
          </button>
        ))}
      </div>
      {/* Selected Day Itinerary */}
      <div className="glass glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            Day {itinerary?.[selectedDay]?.day} - {itinerary?.[selectedDay]?.date}
          </h3>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => regenerateDay(selectedDay)}
            loading={isGenerating}
          >
            Regenerate Day
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="activities">
            {(provided) => (
              <div
                {...provided?.droppableProps}
                ref={provided?.innerRef}
                className="space-y-4"
              >
                {itinerary?.[selectedDay]?.activities?.map((activity, index) => (
                  <Draggable key={activity?.id} draggableId={activity?.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided?.innerRef}
                        {...provided?.draggableProps}
                        {...provided?.dragHandleProps}
                        className={`
                          glass glass-hover rounded-lg p-4 transition-all duration-200
                          ${snapshot?.isDragging ? 'shadow-prominent scale-105' : ''}
                        `}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                                <Icon name={getActivityIcon(activity?.type)} size={16} />
                              </div>
                              <span className="text-sm font-mono text-muted-foreground">
                                {activity?.time}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-caption font-caption-medium text-foreground">
                                {activity?.title}
                              </h4>
                              <div className="text-right">
                                <div className="text-sm font-caption font-caption-medium text-accent">
                                  {activity?.cost > 0 ? formatCurrency(activity?.cost) : 'Free'}
                                </div>
                                <div className="text-xs text-muted-foreground font-caption">
                                  {activity?.duration}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground font-caption mb-3">
                              {activity?.description}
                            </p>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-caption">
                                  {activity?.location}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Icon name="GripVertical" size={14} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-caption">
                                  Drag to reorder
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided?.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* AI Suggestions */}
      <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center ai-glow">
            <Icon name="Bot" size={16} color="white" />
          </div>
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            AI Optimization Suggestions
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Your itinerary is well-balanced with cultural experiences and relaxation time.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Consider adding 30-minute buffer time between activities for a more relaxed pace.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Wallet" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Your estimated cost is {((totalCost / budget?.total) * 100)?.toFixed(0)}% of your budget - well within limits!
            </p>
          </div>
        </div>
      </div>
      
      {/* Trip Title Input */}
      <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Edit" size={20} className="text-accent" />
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            Name Your Trip
          </h3>
        </div>
        <input
          type="text"
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          placeholder={`${destination?.name || 'Destination'} Adventure`}
          className="w-full px-4 py-3 rounded-lg bg-muted/20 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors duration-200"
        />
        <p className="text-sm text-muted-foreground font-caption mt-2">
          Give your trip a memorable name that you'll recognize later.
        </p>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Icon name="ChevronLeft" size={16} />
          <span className="font-caption font-caption-medium">Back</span>
        </button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            iconName="Download"
          >
            Export Itinerary
          </Button>
          <Button
            variant="default"
            iconName="Check"
            onClick={handleComplete}
            disabled={isCreating}
            className="bg-gradient-intelligent hover:opacity-90"
          >
            {isCreating ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Creating Trip...</span>
              </>
            ) : (
              'Complete Planning'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPreview;