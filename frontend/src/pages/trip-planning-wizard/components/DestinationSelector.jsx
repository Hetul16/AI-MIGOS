import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const DestinationSelector = ({ selectedDestination, onDestinationSelect, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mockDestinations = [
    {
      id: 1,
      name: "Goa, India",
      type: "Beach Paradise",
      description: "Golden beaches, vibrant nightlife, and Portuguese heritage",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
      isHiddenGem: false,
      aiScore: 95
    },
    {
      id: 2,
      name: "Hampi, Karnataka",
      type: "Hidden Gem",
      description: "Ancient ruins, boulder landscapes, and mystical vibes",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop",
      isHiddenGem: true,
      aiScore: 88
    },
    {
      id: 3,
      name: "Rishikesh, Uttarakhand",
      type: "Adventure Hub",
      description: "Yoga capital, river rafting, and spiritual experiences",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      isHiddenGem: false,
      aiScore: 92
    },
    {
      id: 4,
      name: "Spiti Valley, Himachal Pradesh",
      type: "Hidden Gem",
      description: "Cold desert, ancient monasteries, and pristine landscapes",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop",
      isHiddenGem: true,
      aiScore: 90
    },
    {
      id: 5,
      name: "Udaipur, Rajasthan",
      type: "Royal Heritage",
      description: "City of lakes, majestic palaces, and royal grandeur",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop",
      isHiddenGem: false,
      aiScore: 94
    }
  ];

  useEffect(() => {
    if (searchQuery?.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockDestinations?.filter(dest =>
          dest?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          dest?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleDestinationClick = (destination) => {
    onDestinationSelect(destination);
    setSearchQuery(destination?.name);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e?.target?.value);
    if (selectedDestination && e?.target?.value !== selectedDestination?.name) {
      onDestinationSelect(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          Where would you like to go?
        </h2>
        <p className="text-muted-foreground font-caption">
          Search for destinations or explore our AI-powered recommendations
        </p>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search destinations (e.g., Goa, Paris, Tokyo)"
          value={searchQuery}
          onChange={handleInputChange}
          className="text-lg h-14"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-muted-foreground" />
            </div>
          ) : (
            <Icon name="Search" size={20} className="text-muted-foreground" />
          )}
        </div>

        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass glass-hover rounded-xl shadow-prominent z-50 max-h-80 overflow-y-auto">
            {suggestions?.map((destination) => (
              <button
                key={destination?.id}
                onClick={() => handleDestinationClick(destination)}
                className="w-full p-4 text-left hover:bg-muted/50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={destination?.image}
                      alt={destination?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-caption font-caption-medium text-foreground">
                        {destination?.name}
                      </h3>
                      {destination?.isHiddenGem && (
                        <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full font-caption">
                          Hidden Gem
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-caption mb-2">
                      {destination?.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Icon name="Sparkles" size={14} className="text-accent" />
                      <span className="text-xs text-accent font-caption">
                        AI Score: {destination?.aiScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedDestination && (
        <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <img
                src={selectedDestination?.image}
                alt={selectedDestination?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                  {selectedDestination?.name}
                </h3>
                {selectedDestination?.isHiddenGem && (
                  <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full font-caption">
                    Hidden Gem
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-caption mb-2">
                {selectedDestination?.description}
              </p>
              <div className="flex items-center space-x-2">
                <Icon name="Sparkles" size={16} className="text-accent" />
                <span className="text-sm text-accent font-caption font-caption-medium">
                  AI Recommendation Score: {selectedDestination?.aiScore}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-caption font-caption-medium">
                Destination Selected
              </span>
            </div>
            <button
              onClick={onNext}
              className="px-6 py-2 bg-gradient-intelligent text-white rounded-lg font-caption font-caption-medium hover:opacity-90 transition-opacity duration-200"
            >
              Continue to Dates
            </button>
          </div>
        </div>
      )}
      {!showSuggestions && searchQuery?.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="col-span-full text-lg font-heading font-heading-semibold text-foreground mb-4">
            Popular Destinations
          </h3>
          {mockDestinations?.slice(0, 4)?.map((destination) => (
            <button
              key={destination?.id}
              onClick={() => handleDestinationClick(destination)}
              className="glass glass-hover rounded-xl p-4 text-left hover:border-accent/30 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    src={destination?.image}
                    alt={destination?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-caption font-caption-medium text-foreground">
                      {destination?.name}
                    </h4>
                    {destination?.isHiddenGem && (
                      <Icon name="Gem" size={14} className="text-accent" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-caption">
                    {destination?.type}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationSelector;