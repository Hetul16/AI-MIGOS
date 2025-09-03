import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  searchQuery, 
  onSearchChange,
  isAISearchEnabled,
  onAISearchToggle 
}) => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [distanceRange, setDistanceRange] = useState(50);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { id: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed', color: 'text-warning bg-warning/10' },
    { id: 'culture', label: 'Culture & Arts', icon: 'Landmark', color: 'text-secondary bg-secondary/10' },
    { id: 'nature', label: 'Nature & Parks', icon: 'Trees', color: 'text-success bg-success/10' },
    { id: 'nightlife', label: 'Nightlife', icon: 'Music', color: 'text-destructive bg-destructive/10' },
    { id: 'adventure', label: 'Adventure', icon: 'Mountain', color: 'text-accent bg-accent/10' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'text-primary bg-primary/10' }
  ];

  const difficulties = ['Easy', 'Moderate', 'Hard'];
  const crowdLevels = ['Quiet', 'Moderate', 'Busy'];
  const bestTimes = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleCategoryToggle = (categoryId) => {
    const newFilters = filters?.includes(categoryId)
      ? filters?.filter(f => f !== categoryId)
      : [...filters, categoryId];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
    onSearchChange('');
    setPriceRange([0, 5000]);
    setDistanceRange(50);
  };

  const aiSearchSuggestions = [
    "romantic sunset spots",
    "hidden food gems",
    "quiet nature escapes",
    "local art galleries",
    "rooftop bars with views",
    "street food markets"
  ];

  return (
    <div className="space-y-6">
      {/* AI Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-heading-semibold text-foreground">
            AI-Powered Search
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Bot"
            onClick={onAISearchToggle}
            className={`
              ${isAISearchEnabled 
                ? 'text-accent bg-accent/10 ai-glow' :'text-muted-foreground hover:text-accent'
              }
            `}
          >
            {isAISearchEnabled ? 'AI On' : 'AI Off'}
          </Button>
        </div>

        <div className="relative">
          <Input
            type="search"
            placeholder={isAISearchEnabled ? "Try: 'romantic dinner spots with city views'" : "Search hidden gems..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon 
              name={isAISearchEnabled ? "Bot" : "Search"} 
              size={16} 
              className={isAISearchEnabled ? "text-accent ai-glow" : "text-muted-foreground"} 
            />
          </div>
        </div>

        {isAISearchEnabled && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-caption">
              Try these AI suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {aiSearchSuggestions?.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSearchChange(suggestion)}
                  className="px-3 py-1 text-xs font-caption text-accent bg-accent/10 hover:bg-accent/20 rounded-full transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-heading-semibold text-foreground">
            Categories
          </h3>
          {filters?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryToggle(category?.id)}
              className={`
                flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200
                ${filters?.includes(category?.id)
                  ? `${category?.color} border-current shadow-ai-glow`
                  : 'text-muted-foreground bg-muted/30 border-border hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              <Icon name={category?.icon} size={16} />
              <span className="text-sm font-caption font-caption-medium">
                {category?.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Distance Filter */}
      <div className="space-y-3">
        <h3 className="font-heading font-heading-semibold text-foreground">
          Distance Range
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-caption text-muted-foreground">
              Within {distanceRange} km
            </span>
            <span className="text-sm font-caption text-accent">
              {distanceRange === 100 ? '100+ km' : `${distanceRange} km`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={distanceRange}
            onChange={(e) => setDistanceRange(parseInt(e?.target?.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
      {/* Advanced Filters */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between text-foreground hover:text-accent"
        >
          Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-2 border-t border-border/50">
            {/* Difficulty */}
            <div className="space-y-2">
              <h4 className="font-caption font-caption-medium text-foreground text-sm">
                Difficulty Level
              </h4>
              <div className="flex flex-wrap gap-2">
                {difficulties?.map((difficulty) => (
                  <button
                    key={difficulty}
                    className="px-3 py-1 text-xs font-caption text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:text-foreground rounded-full transition-colors duration-200"
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Crowd Level */}
            <div className="space-y-2">
              <h4 className="font-caption font-caption-medium text-foreground text-sm">
                Crowd Level
              </h4>
              <div className="flex flex-wrap gap-2">
                {crowdLevels?.map((level) => (
                  <button
                    key={level}
                    className="px-3 py-1 text-xs font-caption text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:text-foreground rounded-full transition-colors duration-200"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Time */}
            <div className="space-y-2">
              <h4 className="font-caption font-caption-medium text-foreground text-sm">
                Best Time to Visit
              </h4>
              <div className="flex flex-wrap gap-2">
                {bestTimes?.map((time) => (
                  <button
                    key={time}
                    className="px-3 py-1 text-xs font-caption text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:text-foreground rounded-full transition-colors duration-200"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <h4 className="font-caption font-caption-medium text-foreground text-sm">
                Price Range (₹)
              </h4>
              <div className="flex items-center space-x-3">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange?.[0]}
                  onChange={(e) => setPriceRange([parseInt(e?.target?.value) || 0, priceRange?.[1]])}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange?.[1]}
                  onChange={(e) => setPriceRange([priceRange?.[0], parseInt(e?.target?.value) || 5000])}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Active Filters Summary */}
      {filters?.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-border/50">
          <h4 className="font-caption font-caption-medium text-foreground text-sm">
            Active Filters ({filters?.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters?.map((filterId) => {
              const category = categories?.find(c => c?.id === filterId);
              return (
                <div
                  key={filterId}
                  className="flex items-center space-x-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-caption"
                >
                  <Icon name={category?.icon || 'Tag'} size={12} />
                  <span>{category?.label || filterId}</span>
                  <button
                    onClick={() => handleCategoryToggle(filterId)}
                    className="hover:text-accent/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;