import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TravelStyleStep = ({ selectedStyles, onStyleToggle }) => {
  const travelStyles = [
    {
      id: 'adventure',
      name: 'Adventure',
      description: 'Thrilling experiences and outdoor activities',
      icon: 'Mountain',
      color: 'from-orange-500 to-red-500',
      features: ['Hiking & Trekking', 'Water Sports', 'Wildlife Safari', 'Rock Climbing']
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium accommodations and exclusive experiences',
      icon: 'Crown',
      color: 'from-purple-500 to-pink-500',
      features: ['5-Star Hotels', 'Fine Dining', 'Spa & Wellness', 'Private Tours']
    },
    {
      id: 'budget',
      name: 'Budget',
      description: 'Cost-effective travel with maximum value',
      icon: 'Wallet',
      color: 'from-green-500 to-emerald-500',
      features: ['Hostels & B&Bs', 'Local Transport', 'Street Food', 'Free Activities']
    },
    {
      id: 'cultural',
      name: 'Cultural',
      description: 'Immersive local experiences and heritage',
      icon: 'Landmark',
      color: 'from-blue-500 to-cyan-500',
      features: ['Museums & Galleries', 'Local Festivals', 'Traditional Cuisine', 'Historical Sites']
    }
  ];

  const handleStyleClick = (styleId) => {
    onStyleToggle(styleId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          What's your travel style?
        </h2>
        <p className="text-muted-foreground font-caption">
          Select all that match your preferences. This helps us personalize your experience.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {travelStyles?.map((style, index) => {
          const isSelected = selectedStyles?.includes(style?.id);
          
          return (
            <motion.div
              key={style?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleStyleClick(style?.id)}
                className={`
                  w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected
                    ? 'border-accent bg-accent/10 shadow-ai-glow'
                    : 'border-border/50 glass glass-hover hover:border-accent/50'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br ${style?.color} 
                    flex items-center justify-center flex-shrink-0
                  `}>
                    <Icon name={style?.icon} size={24} color="white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                        {style?.name}
                      </h3>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <Icon name="Check" size={14} color="white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground font-caption mb-3">
                      {style?.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {style?.features?.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-full font-caption"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-caption">
          You can change these preferences anytime in your profile settings
        </p>
      </div>
    </div>
  );
};

export default TravelStyleStep;