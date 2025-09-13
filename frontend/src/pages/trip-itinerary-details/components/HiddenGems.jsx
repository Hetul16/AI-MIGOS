import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import tripService from '../../../services/tripService';

const HiddenGems = ({ tripId, onGemSelect }) => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filterOptions = [
    { id: 'all', label: 'All', icon: 'MapPin' },
    { id: 'cafe', label: 'Cafes', icon: 'Coffee' },
    { id: 'waterfall', label: 'Waterfalls', icon: 'Droplets' },
    { id: 'mountain', label: 'Mountains', icon: 'Mountain' },
    { id: 'heritage', label: 'Heritage', icon: 'Building' },
    { id: 'viewpoint', label: 'Viewpoints', icon: 'Eye' },
    { id: 'temple', label: 'Temples', icon: 'Church' },
    { id: 'museum', label: 'Museums', icon: 'BookOpen' }
  ];

  // Fetch hidden gems
  const fetchHiddenGems = async (filter = null) => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await tripService.getHiddenGems(tripId, filter);
      if (response.success && response.gems) {
        setGems(response.gems);
      } else {
        setError('Failed to load hidden gems');
      }
    } catch (err) {
      console.error('Error fetching hidden gems:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHiddenGems(selectedFilter === 'all' ? null : selectedFilter);
  }, [tripId, selectedFilter]);

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
  };

  const handleGemSelect = (gem) => {
    if (onGemSelect) {
      onGemSelect(gem);
    }
  };

  const getGemIcon = (tags) => {
    if (tags?.amenity === 'cafe') return 'Coffee';
    if (tags?.natural === 'waterfall') return 'Droplets';
    if (tags?.natural === 'peak') return 'Mountain';
    if (tags?.historic) return 'Building';
    if (tags?.tourism === 'viewpoint') return 'Eye';
    if (tags?.amenity === 'place_of_worship') return 'Church';
    if (tags?.tourism === 'museum') return 'BookOpen';
    return 'MapPin';
  };

  const getGemType = (tags) => {
    if (tags?.amenity === 'cafe') return 'Cafe';
    if (tags?.natural === 'waterfall') return 'Waterfall';
    if (tags?.natural === 'peak') return 'Mountain Peak';
    if (tags?.historic) return 'Historic Site';
    if (tags?.tourism === 'viewpoint') return 'Viewpoint';
    if (tags?.amenity === 'place_of_worship') return 'Place of Worship';
    if (tags?.tourism === 'museum') return 'Museum';
    return 'Point of Interest';
  };

  const getDistance = (gem) => {
    // Mock distance calculation (in real app, calculate based on coordinates)
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
              <Icon name="Compass" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Hidden Gems
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                Discover unique places near your trip
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              onClick={() => fetchHiddenGems(selectedFilter === 'all' ? null : selectedFilter)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <div className="flex bg-muted/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Grid" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-caption transition-colors duration-200 ${
                selectedFilter === option.id
                  ? 'bg-accent text-accent-foreground' : 'bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              <Icon name={option.icon} size={14} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass glass-hover rounded-2xl p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground font-caption">Discovering hidden gems...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass glass-hover rounded-2xl p-6 border-l-4 border-l-error">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <h4 className="font-heading font-heading-semibold text-foreground">
              Unable to Load Hidden Gems
            </h4>
          </div>
          <p className="text-muted-foreground font-caption mb-4">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => fetchHiddenGems(selectedFilter === 'all' ? null : selectedFilter)}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* No Gems State */}
      {!loading && !error && gems.length === 0 && (
        <div className="glass glass-hover rounded-2xl p-6">
          <div className="text-center py-12">
            <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-heading-semibold text-foreground mb-2">
              No Hidden Gems Found
            </h3>
            <p className="text-muted-foreground font-caption mb-4">
              No hidden gems were found for the selected filter. Try a different category.
            </p>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              onClick={() => fetchHiddenGems(selectedFilter === 'all' ? null : selectedFilter)}
            >
              Search Again
            </Button>
          </div>
        </div>
      )}

      {/* Gems Grid/List */}
      {!loading && !error && gems.length > 0 && (
        <div className="glass glass-hover rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-heading-semibold text-foreground">
                {gems.length} Hidden Gems Found
              </h4>
              <p className="text-sm text-muted-foreground font-caption">
                Click on any gem to learn more
              </p>
            </div>
          </div>

          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gems.map((gem, index) => (
                  <div
                    key={gem.id || index}
                    onClick={() => handleGemSelect(gem)}
                    className="p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-intelligent/10 flex items-center justify-center flex-shrink-0">
                        <Icon name={getGemIcon(gem.tags)} size={20} className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-caption font-caption-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-200">
                          {gem.name}
                        </h5>
                        <p className="text-xs text-muted-foreground font-caption mb-2">
                          {getGemType(gem.tags)}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{getDistance(gem)} km away</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} />
                            <span>Hidden Gem</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {gems.map((gem, index) => (
                  <div
                    key={gem.id || index}
                    onClick={() => handleGemSelect(gem)}
                    className="p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-intelligent/10 flex items-center justify-center flex-shrink-0">
                        <Icon name={getGemIcon(gem.tags)} size={24} className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-caption font-caption-medium text-foreground mb-1 group-hover:text-accent transition-colors duration-200">
                          {gem.name}
                        </h5>
                        <p className="text-sm text-muted-foreground font-caption mb-2">
                          {getGemType(gem.tags)}
                        </p>
                        <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{getDistance(gem)} km away</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} />
                            <span>Hidden Gem</span>
                          </div>
                          {gem.tags?.website && (
                            <div className="flex items-center space-x-1">
                              <Icon name="ExternalLink" size={12} />
                              <span>Website</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-accent transition-colors duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HiddenGems;
