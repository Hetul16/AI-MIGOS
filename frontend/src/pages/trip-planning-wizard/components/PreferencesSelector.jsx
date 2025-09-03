import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const PreferencesSelector = ({ selectedPreferences, onPreferencesSelect, onNext, onBack }) => {
  const [travelStyle, setTravelStyle] = useState(selectedPreferences?.travelStyle || []);
  const [interests, setInterests] = useState(selectedPreferences?.interests || []);
  const [accommodation, setAccommodation] = useState(selectedPreferences?.accommodation || []);
  const [transport, setTransport] = useState(selectedPreferences?.transport || []);
  const [dietary, setDietary] = useState(selectedPreferences?.dietary || []);

  const travelStyles = [
    { id: 'adventure', label: 'Adventure', icon: 'Mountain', description: 'Thrilling activities and outdoor experiences' },
    { id: 'relaxation', label: 'Relaxation', icon: 'Waves', description: 'Peaceful and rejuvenating experiences' },
    { id: 'cultural', label: 'Cultural', icon: 'Building2', description: 'Museums, heritage sites, and local traditions' },
    { id: 'nightlife', label: 'Nightlife', icon: 'Music', description: 'Bars, clubs, and evening entertainment' },
    { id: 'nature', label: 'Nature', icon: 'Trees', description: 'National parks, wildlife, and natural beauty' },
    { id: 'photography', label: 'Photography', icon: 'Camera', description: 'Scenic spots and Instagram-worthy locations' }
  ];

  const interestOptions = [
    { id: 'food', label: 'Food & Cuisine', icon: 'ChefHat' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'art', label: 'Art & Museums', icon: 'Palette' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
    { id: 'sports', label: 'Sports', icon: 'Trophy' },
    { id: 'wellness', label: 'Wellness & Spa', icon: 'Heart' },
    { id: 'festivals', label: 'Festivals & Events', icon: 'Calendar' },
    { id: 'architecture', label: 'Architecture', icon: 'Building' }
  ];

  const accommodationOptions = [
    { id: 'hotel', label: 'Hotels', icon: 'Building2' },
    { id: 'resort', label: 'Resorts', icon: 'Palmtree' },
    { id: 'hostel', label: 'Hostels', icon: 'Users' },
    { id: 'airbnb', label: 'Airbnb/Homestay', icon: 'Home' },
    { id: 'boutique', label: 'Boutique Hotels', icon: 'Gem' },
    { id: 'camping', label: 'Camping', icon: 'Tent' }
  ];

  const transportOptions = [
    { id: 'flight', label: 'Flights', icon: 'Plane' },
    { id: 'train', label: 'Trains', icon: 'Train' },
    { id: 'bus', label: 'Buses', icon: 'Bus' },
    { id: 'car', label: 'Car Rental', icon: 'Car' },
    { id: 'bike', label: 'Bike/Scooter', icon: 'Bike' },
    { id: 'walk', label: 'Walking', icon: 'Footprints' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
    { id: 'halal', label: 'Halal', icon: 'Moon' },
    { id: 'kosher', label: 'Kosher', icon: 'Star' },
    { id: 'gluten-free', label: 'Gluten Free', icon: 'Wheat' },
    { id: 'no-restrictions', label: 'No Restrictions', icon: 'Check' }
  ];

  const handleMultiSelect = (value, currentArray, setter) => {
    const newArray = currentArray?.includes(value)
      ? currentArray?.filter(item => item !== value)
      : [...currentArray, value];
    setter(newArray);
    updatePreferences(newArray, 'update');
  };

  const updatePreferences = (updatedArray, type) => {
    const preferences = {
      travelStyle: type === 'travelStyle' ? updatedArray : travelStyle,
      interests: type === 'interests' ? updatedArray : interests,
      accommodation: type === 'accommodation' ? updatedArray : accommodation,
      transport: type === 'transport' ? updatedArray : transport,
      dietary: type === 'dietary' ? updatedArray : dietary
    };
    onPreferencesSelect(preferences);
  };

  const PreferenceSection = ({ title, options, selected, onToggle, columns = 2 }) => (
    <div className="glass glass-hover rounded-xl p-6">
      <h3 className="text-lg font-heading font-heading-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {options?.map((option) => (
          <button
            key={option?.id}
            onClick={() => onToggle(option?.id)}
            className={`
              flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200
              ${selected?.includes(option?.id)
                ? 'bg-accent/20 border border-accent text-accent' :'bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${selected?.includes(option?.id)
                ? 'bg-accent text-white' :'bg-muted text-muted-foreground'
              }
            `}>
              <Icon name={option?.icon} size={16} />
            </div>
            <div className="flex-1">
              <div className="font-caption font-caption-medium">
                {option?.label}
              </div>
              {option?.description && (
                <div className="text-xs opacity-80 font-caption">
                  {option?.description}
                </div>
              )}
            </div>
            {selected?.includes(option?.id) && (
              <Icon name="Check" size={16} className="text-accent" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const totalSelections = travelStyle?.length + interests?.length + accommodation?.length + transport?.length + dietary?.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          Tell us about your preferences
        </h2>
        <p className="text-muted-foreground font-caption">
          Help us personalize your perfect trip experience
        </p>
      </div>
      {/* Progress Indicator */}
      <div className="glass glass-hover rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-caption font-caption-medium text-foreground">
            Preferences Selected
          </span>
          <span className="text-sm font-mono text-accent">
            {totalSelections} selections
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-intelligent h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((totalSelections / 15) * 100, 100)}%` }}
          />
        </div>
      </div>
      {/* Travel Style */}
      <PreferenceSection
        title="Travel Style"
        options={travelStyles}
        selected={travelStyle}
        onToggle={(value) => handleMultiSelect(value, travelStyle, setTravelStyle)}
        columns={2}
      />
      {/* Interests */}
      <PreferenceSection
        title="Interests & Activities"
        options={interestOptions}
        selected={interests}
        onToggle={(value) => handleMultiSelect(value, interests, setInterests)}
        columns={3}
      />
      {/* Accommodation */}
      <PreferenceSection
        title="Accommodation Preferences"
        options={accommodationOptions}
        selected={accommodation}
        onToggle={(value) => handleMultiSelect(value, accommodation, setAccommodation)}
        columns={3}
      />
      {/* Transport */}
      <PreferenceSection
        title="Transportation"
        options={transportOptions}
        selected={transport}
        onToggle={(value) => handleMultiSelect(value, transport, setTransport)}
        columns={3}
      />
      {/* Dietary */}
      <PreferenceSection
        title="Dietary Requirements"
        options={dietaryOptions}
        selected={dietary}
        onToggle={(value) => handleMultiSelect(value, dietary, setDietary)}
        columns={3}
      />
      {/* AI Insights */}
      {totalSelections > 5 && (
        <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center ai-glow">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <h3 className="text-lg font-heading font-heading-semibold text-foreground">
              AI Personalization Insights
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Icon name="Target" size={16} className="text-accent mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground font-caption">
                Based on your preferences, we've identified you as an {travelStyle?.includes('adventure') ? 'adventure seeker' : travelStyle?.includes('cultural') ? 'culture enthusiast' : 'experience-focused'} traveler.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="Sparkles" size={16} className="text-accent mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground font-caption">
                We'll prioritize {interests?.includes('food') ? 'culinary experiences' : interests?.includes('nature') ? 'natural attractions' : 'unique activities'} in your itinerary.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="MapPin" size={16} className="text-accent mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground font-caption">
                Your accommodation and transport preferences will help us optimize your daily schedule and budget allocation.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Icon name="ChevronLeft" size={16} />
          <span className="font-caption font-caption-medium">Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={totalSelections < 3}
          className={`
            px-6 py-2 rounded-lg font-caption font-caption-medium transition-all duration-200
            ${totalSelections >= 3
              ? 'bg-gradient-intelligent text-white hover:opacity-90' :'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          Generate Itinerary
        </button>
      </div>
      {totalSelections < 3 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-caption">
            Please select at least 3 preferences to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default PreferencesSelector;