import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const DestinationInterestsStep = ({ selectedDestinations, onDestinationToggle, selectedRegions, onRegionToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularDestinations = [
    { id: 'paris', name: 'Paris, France', type: 'city', icon: 'MapPin' },
    { id: 'tokyo', name: 'Tokyo, Japan', type: 'city', icon: 'MapPin' },
    { id: 'bali', name: 'Bali, Indonesia', type: 'island', icon: 'Palmtree' },
    { id: 'newyork', name: 'New York, USA', type: 'city', icon: 'Building' },
    { id: 'santorini', name: 'Santorini, Greece', type: 'island', icon: 'Sun' },
    { id: 'dubai', name: 'Dubai, UAE', type: 'city', icon: 'Building2' },
    { id: 'maldives', name: 'Maldives', type: 'island', icon: 'Waves' },
    { id: 'london', name: 'London, UK', type: 'city', icon: 'MapPin' },
    { id: 'rome', name: 'Rome, Italy', type: 'city', icon: 'Landmark' },
    { id: 'thailand', name: 'Thailand', type: 'country', icon: 'Globe' },
    { id: 'iceland', name: 'Iceland', type: 'country', icon: 'Mountain' },
    { id: 'morocco', name: 'Morocco', type: 'country', icon: 'Compass' }
  ];

  const regions = [
    { id: 'europe', name: 'Europe', icon: 'MapPin', color: 'from-blue-500 to-purple-500' },
    { id: 'asia', name: 'Asia', icon: 'Globe', color: 'from-green-500 to-teal-500' },
    { id: 'americas', name: 'Americas', icon: 'Map', color: 'from-orange-500 to-red-500' },
    { id: 'africa', name: 'Africa', icon: 'Compass', color: 'from-yellow-500 to-orange-500' },
    { id: 'oceania', name: 'Oceania', icon: 'Waves', color: 'from-cyan-500 to-blue-500' },
    { id: 'middle-east', name: 'Middle East', icon: 'Star', color: 'from-purple-500 to-pink-500' }
  ];

  const filteredDestinations = popularDestinations?.filter(dest =>
    dest?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleDestinationClick = (destinationId) => {
    onDestinationToggle(destinationId);
  };

  const handleRegionClick = (regionId) => {
    onRegionToggle(regionId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          Where do you dream of going?
        </h2>
        <p className="text-muted-foreground font-caption">
          Select destinations and regions that interest you most
        </p>
      </div>
      {/* Search Input */}
      <div className="max-w-md mx-auto">
        <Input
          type="search"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Regional Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-heading-semibold text-foreground">
          Preferred Regions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {regions?.map((region, index) => {
            const isSelected = selectedRegions?.includes(region?.id);
            
            return (
              <motion.button
                key={region?.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRegionClick(region?.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${isSelected
                    ? 'border-accent bg-accent/10 shadow-ai-glow'
                    : 'border-border/50 glass glass-hover hover:border-accent/50'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`
                    w-10 h-10 rounded-lg bg-gradient-to-br ${region?.color} 
                    flex items-center justify-center
                  `}>
                    <Icon name={region?.icon} size={20} color="white" />
                  </div>
                  <span className="text-sm font-caption font-caption-medium text-foreground">
                    {region?.name}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <Icon name="Check" size={10} color="white" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      {/* Popular Destinations */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-heading-semibold text-foreground">
          Popular Destinations
        </h3>
        <div className="flex flex-wrap gap-2">
          {filteredDestinations?.map((destination, index) => {
            const isSelected = selectedDestinations?.includes(destination?.id);
            
            return (
              <motion.button
                key={destination?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDestinationClick(destination?.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300
                  ${isSelected
                    ? 'border-accent bg-accent/10 text-accent shadow-ai-glow'
                    : 'border-border/50 glass glass-hover hover:border-accent/50 text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon 
                  name={destination?.icon} 
                  size={14} 
                  className={isSelected ? 'text-accent' : 'text-current'} 
                />
                <span className="text-sm font-caption font-caption-medium">
                  {destination?.name}
                </span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <Icon name="Check" size={10} color="white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      {/* Selection Summary */}
      {(selectedDestinations?.length > 0 || selectedRegions?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass glass-hover p-4 rounded-xl border border-accent/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Heart" size={16} className="text-accent" />
            <span className="text-sm font-caption font-caption-medium text-accent">
              Your Travel Wishlist
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-caption">
            {selectedRegions?.length} regions and {selectedDestinations?.length} destinations selected
          </p>
        </motion.div>
      )}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-caption">
          Don't worry if you're not sure yet - we'll help you discover amazing places!
        </p>
      </div>
    </div>
  );
};

export default DestinationInterestsStep;