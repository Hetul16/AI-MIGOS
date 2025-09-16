import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ activities, onActivitySelect, selectedActivity }) => {
  const [mapView, setMapView] = useState('satellite'); // 'satellite' | 'roadmap'
  const [showRoute, setShowRoute] = useState(true);

  // Mock coordinates for demonstration
  const mapCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
  
  const getMarkerColor = (type) => {
    const colorMap = {
      'hotel': '#10B981',
      'restaurant': '#F59E0B',
      'attraction': '#6366F1',
      'transport': '#8B5CF6',
      'activity': '#06B6D4',
      'shopping': '#EF4444'
    };
    return colorMap?.[type] || '#94A3B8';
  };

  const handleMarkerClick = (activity) => {
    onActivitySelect(activity);
  };

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
              <Icon name="Map" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-heading-semibold text-foreground">
                Trip Map
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                Interactive route visualization
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showRoute ? "default" : "outline"}
              size="sm"
              iconName="Route"
              onClick={() => setShowRoute(!showRoute)}
            >
              Route
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Navigation"
            >
              Navigate
            </Button>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Trip Itinerary Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=12&output=embed`}
          className="w-full h-full"
        />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            className="bg-background/80 backdrop-blur-sm"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Minus"
            className="bg-background/80 backdrop-blur-sm"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Locate"
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>

        {/* Map Type Toggle */}
        <div className="absolute top-4 left-4">
          <div className="flex bg-background/80 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setMapView('roadmap')}
              className={`px-3 py-1 rounded-md text-xs font-caption transition-colors duration-200 ${
                mapView === 'roadmap' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapView('satellite')}
              className={`px-3 py-1 rounded-md text-xs font-caption transition-colors duration-200 ${
                mapView === 'satellite' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Activity Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {activities?.map((activity, index) => (
            <div
              key={index}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`
              }}
              onClick={() => handleMarkerClick(activity)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-110 ${
                  selectedActivity?.id === activity?.id ? 'ring-2 ring-white scale-110' : ''
                }`}
                style={{ backgroundColor: getMarkerColor(activity?.type) }}
              >
                <Icon name={activity?.type === 'hotel' ? 'Building' : 'MapPin'} size={14} />
              </div>
              {selectedActivity?.id === activity?.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg min-w-max">
                  <p className="text-xs font-caption font-caption-medium text-foreground">
                    {activity?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity?.time}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Activity Legend */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-caption font-caption-medium text-foreground">
            Activity Locations
          </h4>
          <span className="text-xs text-muted-foreground font-caption">
            {activities?.length} locations
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {activities?.slice(0, 6)?.map((activity, index) => (
            <button
              key={index}
              onClick={() => handleMarkerClick(activity)}
              className={`flex items-center space-x-2 p-2 rounded-lg text-left transition-colors duration-200 ${
                selectedActivity?.id === activity?.id
                  ? 'bg-accent/10 text-accent' :'hover:bg-muted/20 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getMarkerColor(activity?.type) }}
              />
              <span className="text-xs font-caption truncate">
                {activity?.title}
              </span>
            </button>
          ))}
        </div>

        {activities?.length > 6 && (
          <button className="w-full mt-2 py-2 text-xs text-accent hover:text-accent/80 font-caption transition-colors duration-200">
            View all {activities?.length} locations
          </button>
        )}
      </div>
      {/* Route Optimization */}
      {showRoute && (
        <div className="p-4 border-t border-border/50 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Route" size={16} className="text-accent" />
              <span className="text-sm font-caption text-foreground">
                Optimized Route
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground font-caption">
                Total: 45.2 km • 2h 15m
              </span>
              <Button
                variant="ghost"
                size="sm"
                iconName="Navigation"
                className="text-accent"
              >
                Start Navigation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;