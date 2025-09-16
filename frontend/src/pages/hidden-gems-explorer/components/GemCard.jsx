import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GemCard = ({ gem, viewMode = 'grid', isWishlisted, onWishlistToggle, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return 'UtensilsCrossed';
      case 'culture': return 'Landmark';
      case 'nature': return 'Trees';
      case 'nightlife': return 'Music';
      default: return 'MapPin';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'food': return 'text-warning bg-warning/10';
      case 'culture': return 'text-secondary bg-secondary/10';
      case 'nature': return 'text-success bg-success/10';
      case 'nightlife': return 'text-destructive bg-destructive/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10';
      case 'Moderate': return 'text-warning bg-warning/10';
      case 'Hard': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className="glass glass-hover p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-prominent"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start space-x-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img
              src={gem?.image}
              alt={gem?.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-105' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <Icon name="Image" size={20} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-heading font-heading-semibold text-foreground text-lg mb-1">
                  {gem?.name}
                </h3>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-caption ${getCategoryColor(gem?.category)}`}>
                    <Icon name={getCategoryIcon(gem?.category)} size={12} />
                    <span className="capitalize">{gem?.category}</span>
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-caption ${getDifficultyColor(gem?.difficulty)}`}>
                    <Icon name="TrendingUp" size={12} />
                    <span>{gem?.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Heart"
                onClick={(e) => {
                  e?.stopPropagation();
                  onWishlistToggle();
                }}
                className={`
                  ${isWishlisted 
                    ? 'text-destructive hover:text-destructive/80' :'text-muted-foreground hover:text-destructive'
                  }
                `}
              >
                <Icon 
                  name="Heart" 
                  size={16} 
                  className={isWishlisted ? 'fill-current' : ''} 
                />
              </Button>
            </div>

            <p className="text-muted-foreground font-caption text-sm mb-3 line-clamp-2">
              {gem?.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm font-caption text-foreground font-caption-medium">
                    {gem?.rating}
                  </span>
                  <span className="text-xs text-muted-foreground font-caption">
                    ({gem?.reviewCount})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} className="text-muted-foreground" />
                  <span className="text-sm font-caption text-muted-foreground">
                    {gem?.distance}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-sm font-caption text-muted-foreground">
                    {gem?.bestTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="glass glass-hover rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-prominent interactive-scale"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={gem?.image}
          alt={gem?.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/assets/images/no_image.png';
          }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="Image" size={24} className="text-muted-foreground" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-caption backdrop-blur-sm ${getCategoryColor(gem?.category)}`}>
            <Icon name={getCategoryIcon(gem?.category)} size={12} />
            <span className="capitalize">{gem?.category}</span>
          </div>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            iconName="Heart"
            onClick={(e) => {
              e?.stopPropagation();
              onWishlistToggle();
            }}
            className={`
              backdrop-blur-sm bg-black/20 hover:bg-black/40 border-0
              ${isWishlisted 
                ? 'text-destructive hover:text-destructive/80' :'text-white hover:text-destructive'
              }
            `}
          >
            <Icon 
              name="Heart" 
              size={16} 
              className={isWishlisted ? 'fill-current' : ''} 
            />
          </Button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-3 left-3">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-caption backdrop-blur-sm ${getDifficultyColor(gem?.difficulty)}`}>
            <Icon name="TrendingUp" size={12} />
            <span>{gem?.difficulty}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-heading-semibold text-foreground text-lg mb-2 line-clamp-1">
          {gem?.name}
        </h3>
        
        <p className="text-muted-foreground font-caption text-sm mb-3 line-clamp-2">
          {gem?.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-warning fill-current" />
            <span className="text-sm font-caption text-foreground font-caption-medium">
              {gem?.rating}
            </span>
            <span className="text-xs text-muted-foreground font-caption">
              ({gem?.reviewCount})
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-sm font-caption text-muted-foreground">
              {gem?.distance}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground font-caption">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Best: {gem?.bestTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={12} />
            <span>{gem?.crowdLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemCard;