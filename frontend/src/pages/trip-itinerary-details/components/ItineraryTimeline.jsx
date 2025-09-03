import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ItineraryTimeline = ({ itinerary, onActivityEdit, onBookingClick }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'flight': 'Plane',
      'hotel': 'Building',
      'restaurant': 'UtensilsCrossed',
      'attraction': 'MapPin',
      'transport': 'Car',
      'activity': 'Calendar',
      'shopping': 'ShoppingBag'
    };
    return iconMap?.[type] || 'MapPin';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'cancelled': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      {itinerary?.days?.map((day, dayIndex) => (
        <div key={dayIndex} className="glass glass-hover rounded-2xl overflow-hidden">
          {/* Day Header */}
          <div 
            className="p-6 cursor-pointer hover:bg-muted/20 transition-colors duration-200"
            onClick={() => toggleDayExpansion(dayIndex)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-intelligent flex items-center justify-center text-white font-heading font-heading-bold">
                  {dayIndex + 1}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                    {day?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-caption">
                    {day?.date} • {day?.activities?.length} activities
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-caption font-caption-medium text-foreground">
                    ₹{day?.totalCost?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {day?.activities?.filter(a => a?.status === 'booked')?.length} booked
                  </p>
                </div>
                <Icon 
                  name={expandedDay === dayIndex ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-muted-foreground" 
                />
              </div>
            </div>
          </div>

          {/* Day Activities */}
          {expandedDay === dayIndex && (
            <div className="border-t border-border/50">
              <div className="p-6 space-y-4">
                {day?.activities?.map((activity, activityIndex) => (
                  <div 
                    key={activityIndex}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/20 transition-colors duration-200"
                  >
                    {/* Timeline Connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity?.status === 'booked' ? 'bg-success text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon name={getActivityIcon(activity?.type)} size={16} />
                      </div>
                      {activityIndex < day?.activities?.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-caption font-caption-medium text-foreground">
                            {activity?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity?.time} • {activity?.duration}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-caption ${getStatusColor(activity?.status)}`}>
                            {activity?.status}
                          </span>
                          <p className="text-sm font-caption font-caption-medium text-foreground">
                            ₹{activity?.cost?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {activity?.image && (
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                          <Image 
                            src={activity?.image} 
                            alt={activity?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground mb-3 font-caption">
                        {activity?.description}
                      </p>

                      {activity?.location && (
                        <div className="flex items-center space-x-2 mb-3">
                          <Icon name="MapPin" size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-caption">
                            {activity?.location}
                          </span>
                        </div>
                      )}

                      {/* Activity Actions */}
                      <div className="flex items-center space-x-2">
                        {activity?.status !== 'booked' && (
                          <Button
                            variant="default"
                            size="sm"
                            iconName="CreditCard"
                            onClick={() => onBookingClick(activity)}
                            className="bg-gradient-intelligent"
                          >
                            Book Now
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Edit"
                          onClick={() => onActivityEdit(activity)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="MapPin"
                        >
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;