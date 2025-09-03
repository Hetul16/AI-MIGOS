import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapView = ({ gems, selectedGem, onGemSelect, filters, searchQuery }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi default
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const location = {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setIsLocationLoading(false);
        },
        (error) => {
          console.log('Location access denied');
          setIsLocationLoading(false);
        }
      );
    }
  };

  const filteredGems = gems?.filter(gem => {
    const matchesCategory = filters?.length === 0 || filters?.includes(gem?.category);
    const matchesSearch = !searchQuery || 
      gem?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      gem?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getMarkerColor = (category) => {
    switch (category) {
      case 'food': return '#F59E0B';
      case 'culture': return '#8B5CF6';
      case 'nature': return '#10B981';
      case 'nightlife': return '#EF4444';
      default: return '#06B6D4';
    }
  };

  const generateMapUrl = () => {
    const markers = filteredGems?.map(gem => 
      `markers=color:${getMarkerColor(gem?.category)?.replace('#', '0x')}%7C${gem?.coordinates?.lat},${gem?.coordinates?.lng}`
    )?.join('&');
    
    return `https://www.google.com/maps/embed/v1/view?key=demo&center=${mapCenter?.lat},${mapCenter?.lng}&zoom=12&${markers}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="MapPin"
            onClick={getCurrentLocation}
            disabled={isLocationLoading}
            className="glass glass-hover text-foreground"
          >
            {isLocationLoading ? 'Locating...' : 'My Location'}
          </Button>
          
          <div className="glass glass-hover px-3 py-2 rounded-lg">
            <span className="text-sm font-caption text-foreground">
              {filteredGems?.length} gems found
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Layers"
            className="glass glass-hover text-foreground"
          >
            Layers
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Maximize"
            className="glass glass-hover text-foreground"
          >
            Fullscreen
          </Button>
        </div>
      </div>
      {/* Map Container */}
      <div className="flex-1 relative rounded-xl overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Hidden Gems Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={generateMapUrl()}
          className="border-0"
        />
        
        {/* Map Overlay for Gem Details */}
        {selectedGem && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="glass glass-hover p-4 rounded-xl max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={selectedGem?.image}
                    alt={selectedGem?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-heading-semibold text-foreground text-sm mb-1">
                    {selectedGem?.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-caption mb-2 line-clamp-2">
                    {selectedGem?.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} className="text-warning fill-current" />
                        <span className="text-xs font-caption text-foreground">
                          {selectedGem?.rating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} className="text-muted-foreground" />
                        <span className="text-xs font-caption text-muted-foreground">
                          {selectedGem?.distance}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="X"
                      onClick={() => onGemSelect(null)}
                      className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="glass glass-hover p-3 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-xs font-caption text-foreground">Food</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-xs font-caption text-foreground">Culture</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-xs font-caption text-foreground">Nature</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-xs font-caption text-foreground">Nightlife</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;