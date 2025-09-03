import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GemDetailsModal = ({ gem, isOpen, onClose, isWishlisted, onWishlistToggle }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !gem) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageSquare' },
    { id: 'photos', label: 'Photos', icon: 'Camera' },
    { id: 'directions', label: 'Directions', icon: 'Navigation' }
  ];

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

  const mockReviews = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely stunning hidden gem! The sunset views are breathtaking and it\'s surprisingly peaceful despite being in the city."
    },
    {
      id: 2,
      user: "Raj Patel",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      date: "1 week ago",
      comment: "Great spot for photography. Best to visit during golden hour. Can get a bit crowded on weekends."
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "2 weeks ago",
      comment: "Perfect for a romantic evening. The ambiance is magical and the local food nearby is excellent!"
    }
  ];

  const mockPhotos = [
    gem?.image,
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
  ];

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] glass rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative">
          <div className="h-64 overflow-hidden">
            <img
              src={mockPhotos?.[selectedImageIndex]}
              alt={gem?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Header Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-caption backdrop-blur-sm ${getCategoryColor(gem?.category)}`}>
                    <Icon name={getCategoryIcon(gem?.category)} size={14} />
                    <span className="capitalize">{gem?.category}</span>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-caption backdrop-blur-sm bg-black/20 text-white">
                    <Icon name="TrendingUp" size={14} />
                    <span>{gem?.difficulty}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-heading font-heading-bold text-white mb-2">
                  {gem?.name}
                </h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-warning fill-current" />
                    <span className="font-caption font-caption-medium">{gem?.rating}</span>
                    <span className="text-sm">({gem?.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span className="font-caption">{gem?.distance}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Heart"
                  onClick={onWishlistToggle}
                  className={`
                    backdrop-blur-sm bg-black/20 hover:bg-black/40 border-0
                    ${isWishlisted 
                      ? 'text-destructive hover:text-destructive/80' :'text-white hover:text-destructive'
                    }
                  `}
                >
                  <Icon 
                    name="Heart" 
                    size={18} 
                    className={isWishlisted ? 'fill-current' : ''} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                  className="backdrop-blur-sm bg-black/20 hover:bg-black/40 border-0 text-white"
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={onClose}
                  className="backdrop-blur-sm bg-black/20 hover:bg-black/40 border-0 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border/50">
          <div className="flex space-x-1 p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-lg font-caption font-caption-medium text-sm transition-colors duration-200
                  ${activeTab === tab?.id
                    ? 'bg-accent/10 text-accent' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-heading-semibold text-foreground mb-3">
                  About This Place
                </h3>
                <p className="text-muted-foreground font-caption leading-relaxed">
                  {gem?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-heading font-heading-semibold text-foreground">
                    Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-caption">Best Time</span>
                      <span className="text-foreground font-caption font-caption-medium">{gem?.bestTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-caption">Crowd Level</span>
                      <span className="text-foreground font-caption font-caption-medium">{gem?.crowdLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-caption">Entry Fee</span>
                      <span className="text-foreground font-caption font-caption-medium">
                        {gem?.entryFee || 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-caption">Duration</span>
                      <span className="text-foreground font-caption font-caption-medium">
                        {gem?.duration || '1-2 hours'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-heading font-heading-semibold text-foreground">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gem?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-sm font-caption"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-heading-semibold text-foreground">
                  Reviews ({mockReviews?.length})
                </h3>
                <Button variant="outline" size="sm" iconName="Plus">
                  Write Review
                </Button>
              </div>

              <div className="space-y-4">
                {mockReviews?.map((review) => (
                  <div key={review?.id} className="glass glass-hover p-4 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review?.avatar}
                        alt={review?.user}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-caption font-caption-medium text-foreground">
                            {review?.user}
                          </h4>
                          <span className="text-xs text-muted-foreground font-caption">
                            {review?.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)]?.map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={`${
                                i < review?.rating ? 'text-warning fill-current' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground font-caption text-sm leading-relaxed">
                          {review?.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
              <h3 className="font-heading font-heading-semibold text-foreground">
                Photos ({mockPhotos?.length})
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockPhotos?.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden transition-all duration-200 hover:scale-105
                      ${selectedImageIndex === index ? 'ring-2 ring-accent' : ''}
                    `}
                  >
                    <img
                      src={photo}
                      alt={`${gem?.name} photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'directions' && (
            <div className="space-y-6">
              <h3 className="font-heading font-heading-semibold text-foreground">
                How to Get There
              </h3>

              <div className="h-64 rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title={`Directions to ${gem?.name}`}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${gem?.coordinates?.lat},${gem?.coordinates?.lng}&z=15&output=embed`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass glass-hover p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Car" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-caption font-caption-medium text-foreground">By Car</h4>
                      <p className="text-xs text-muted-foreground">15 min drive</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-caption">
                    Parking available nearby. Follow GPS directions for the most efficient route.
                  </p>
                </div>

                <div className="glass glass-hover p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Icon name="Bus" size={20} className="text-success" />
                    </div>
                    <div>
                      <h4 className="font-caption font-caption-medium text-foreground">Public Transport</h4>
                      <p className="text-xs text-muted-foreground">25 min journey</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-caption">
                    Take Bus #42 to Central Station, then 5-minute walk.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" iconName="Calendar">
                Add to Trip
              </Button>
              <Button variant="outline" iconName="Navigation">
                Get Directions
              </Button>
            </div>
            <Button variant="default" className="bg-gradient-intelligent">
              Visit Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemDetailsModal;