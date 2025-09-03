import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import GemCard from './GemCard';

const ListView = ({ gems, filters, searchQuery, onGemSelect, wishlist, onWishlistToggle }) => {
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'distance', 'newest'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'

  const filteredGems = gems?.filter(gem => {
    const matchesCategory = filters?.length === 0 || filters?.includes(gem?.category);
    const matchesSearch = !searchQuery || 
      gem?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      gem?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      gem?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedGems = [...filteredGems]?.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b?.rating - a?.rating;
      case 'distance':
        return parseFloat(a?.distance) - parseFloat(b?.distance);
      case 'newest':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'distance', label: 'Nearest First', icon: 'MapPin' },
    { value: 'newest', label: 'Recently Added', icon: 'Clock' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* List Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-caption text-muted-foreground">
              {sortedGems?.length} gems found
            </span>
            {filters?.length > 0 && (
              <div className="flex items-center space-x-1">
                <Icon name="Filter" size={14} className="text-accent" />
                <span className="text-sm font-caption text-accent">
                  {filters?.length} filter{filters?.length > 1 ? 's' : ''} active
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="appearance-none bg-input border border-border rounded-lg px-3 py-2 pr-8 text-sm font-caption text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Gems Grid/List */}
      <div className="flex-1 overflow-y-auto">
        {sortedGems?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="Search" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-heading-semibold text-foreground mb-2">
              No gems found
            </h3>
            <p className="text-muted-foreground font-caption max-w-sm">
              Try adjusting your filters or search terms to discover more hidden gems in this area.
            </p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' ?'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :'space-y-4'
            }
          `}>
            {sortedGems?.map((gem) => (
              <GemCard
                key={gem?.id}
                gem={gem}
                viewMode={viewMode}
                isWishlisted={wishlist?.includes(gem?.id)}
                onWishlistToggle={() => onWishlistToggle(gem?.id)}
                onClick={() => onGemSelect(gem)}
              />
            ))}
          </div>
        )}
      </div>
      {/* Load More Button */}
      {sortedGems?.length > 0 && sortedGems?.length >= 12 && (
        <div className="flex justify-center mt-6 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            iconName="RefreshCw"
            className="glass glass-hover"
          >
            Load More Gems
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListView;