import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import AIAssistantSidebar from '../../components/ui/AIAssistantSidebar';
import NotificationToast, { showSuccessToast, showAIToast } from '../../components/ui/NotificationToast';

// Components
import MapView from './components/MapView';
import ListView from './components/ListView';
import FilterPanel from './components/FilterPanel';
import GemDetailsModal from './components/GemDetailsModal';
import SubmitGemModal from './components/SubmitGemModal';

const HiddenGemsExplorer = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'map' | 'list'
  const [filters, setFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearchEnabled, setIsAISearchEnabled] = useState(true);
  const [selectedGem, setSelectedGem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([1, 3, 7]); // Mock wishlisted gem IDs
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for hidden gems
  const mockGems = [
    {
      id: 1,
      name: "Secret Rooftop Garden",
      description: "A hidden oasis above the bustling city streets, perfect for sunset photography and peaceful meditation. This rooftop garden features exotic plants and stunning panoramic views.",
      category: "nature",
      difficulty: "Easy",
      rating: 4.8,
      reviewCount: 127,
      distance: "2.3 km",
      bestTime: "Evening",
      crowdLevel: "Quiet",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6139, lng: 77.2090 },
      tags: ["romantic", "sunset", "photography", "peaceful", "city views"],
      dateAdded: "2024-08-15",
      entryFee: "Free",
      duration: "1-2 hours"
    },
    {
      id: 2,
      name: "Underground Jazz Lounge",
      description: "An intimate speakeasy-style venue featuring live jazz performances and craft cocktails. Hidden beneath a vintage bookstore, this gem offers an authentic nightlife experience.",
      category: "nightlife",
      difficulty: "Moderate",
      rating: 4.6,
      reviewCount: 89,
      distance: "1.8 km",
      bestTime: "Night",
      crowdLevel: "Moderate",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6129, lng: 77.2295 },
      tags: ["jazz", "cocktails", "speakeasy", "live music", "intimate"],
      dateAdded: "2024-08-20",
      entryFee: "₹500",
      duration: "2-3 hours"
    },
    {
      id: 3,
      name: "Artisan Food Market",
      description: "A hidden food market where local artisans sell homemade delicacies and traditional street food. Experience authentic flavors away from tourist crowds.",
      category: "food",
      difficulty: "Easy",
      rating: 4.9,
      reviewCount: 203,
      distance: "3.1 km",
      bestTime: "Morning",
      crowdLevel: "Busy",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6169, lng: 77.2065 },
      tags: ["street food", "local", "authentic", "market", "traditional"],
      dateAdded: "2024-08-10",
      entryFee: "Free",
      duration: "1-2 hours"
    },
    {
      id: 4,
      name: "Historic Artist Quarter",
      description: "A cobblestone alley filled with independent art galleries, vintage shops, and creative studios. This cultural hub showcases emerging local artists and unique crafts.",
      category: "culture",
      difficulty: "Easy",
      rating: 4.7,
      reviewCount: 156,
      distance: "4.2 km",
      bestTime: "Afternoon",
      crowdLevel: "Moderate",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6189, lng: 77.2145 },
      tags: ["art", "galleries", "vintage", "creative", "cultural"],
      dateAdded: "2024-08-25",
      entryFee: "Free",
      duration: "2-3 hours"
    },
    {
      id: 5,
      name: "Waterfall Hiking Trail",
      description: "A challenging but rewarding hike leading to a secluded waterfall. The trail offers breathtaking views and a refreshing natural pool perfect for swimming.",
      category: "nature",
      difficulty: "Hard",
      rating: 4.5,
      reviewCount: 78,
      distance: "12.5 km",
      bestTime: "Morning",
      crowdLevel: "Quiet",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
      coordinates: { lat: 28.5989, lng: 77.1875 },
      tags: ["hiking", "waterfall", "swimming", "adventure", "nature"],
      dateAdded: "2024-08-05",
      entryFee: "₹100",
      duration: "4-5 hours"
    },
    {
      id: 6,
      name: "Vintage Cinema House",
      description: "A restored 1950s cinema that screens classic films and indie movies. Complete with original Art Deco interiors and a nostalgic atmosphere.",
      category: "culture",
      difficulty: "Easy",
      rating: 4.4,
      reviewCount: 92,
      distance: "5.7 km",
      bestTime: "Evening",
      crowdLevel: "Moderate",
      image: "https://images.unsplash.com/photo-1489599904472-84b0e19e8b0c?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6259, lng: 77.2175 },
      tags: ["cinema", "vintage", "classic films", "art deco", "nostalgic"],
      dateAdded: "2024-08-18",
      entryFee: "₹200",
      duration: "2-3 hours"
    },
    {
      id: 7,
      name: "Secret Beach Cove",
      description: "A hidden beach accessible only through a narrow coastal path. Crystal clear waters and pristine sand make this the perfect escape from crowded beaches.",
      category: "nature",
      difficulty: "Moderate",
      rating: 4.9,
      reviewCount: 145,
      distance: "8.3 km",
      bestTime: "Afternoon",
      crowdLevel: "Quiet",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      coordinates: { lat: 28.5859, lng: 77.1695 },
      tags: ["beach", "secluded", "swimming", "pristine", "escape"],
      dateAdded: "2024-08-12",
      entryFee: "Free",
      duration: "3-4 hours"
    },
    {
      id: 8,
      name: "Rooftop Night Market",
      description: "A vibrant night market on a converted rooftop featuring local vendors, live music, and stunning city views. Open only on weekends.",
      category: "food",
      difficulty: "Easy",
      rating: 4.6,
      reviewCount: 167,
      distance: "3.8 km",
      bestTime: "Night",
      crowdLevel: "Busy",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      coordinates: { lat: 28.6219, lng: 77.2235 },
      tags: ["night market", "rooftop", "vendors", "live music", "weekend"],
      dateAdded: "2024-08-22",
      entryFee: "Free",
      duration: "2-3 hours"
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      showAIToast(
        "I've found some amazing hidden gems near you! Try searching for 'romantic sunset spots' or explore by category.",
        "AI Discovery Assistant",
        {
          label: "Show me romantic spots",
          onClick: () => setSearchQuery("romantic sunset spots")
        }
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGemSelect = (gem) => {
    setSelectedGem(gem);
    if (gem) {
      setIsDetailsModalOpen(true);
    }
  };

  const handleWishlistToggle = (gemId) => {
    setWishlist(prev => 
      prev?.includes(gemId) 
        ? prev?.filter(id => id !== gemId)
        : [...prev, gemId]
    );
    
    const gem = mockGems?.find(g => g?.id === gemId);
    if (gem) {
      showSuccessToast(
        wishlist?.includes(gemId) 
          ? `Removed ${gem?.name} from wishlist`
          : `Added ${gem?.name} to wishlist`
      );
    }
  };

  const handleSubmitGem = (gemData) => {
    console.log('New gem submitted:', gemData);
    showSuccessToast(
      "Thank you for your submission! We'll review it and add it to our collection soon.",
      "Gem Submitted"
    );
  };

  const handleAISearch = (query) => {
    setSearchQuery(query);
    setIsAISearchEnabled(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-intelligent mx-auto flex items-center justify-center ai-glow animate-pulse">
              <Icon name="Compass" size={24} color="white" />
            </div>
            <h2 className="text-xl font-heading font-heading-semibold text-foreground">
              Discovering Hidden Gems
            </h2>
            <p className="text-muted-foreground font-caption">
              AI is analyzing the best local spots for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-intelligent-subtle border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-caption font-caption-medium mb-4">
                <Icon name="Sparkles" size={16} />
                <span>AI-Powered Discovery</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-heading-bold text-gradient-intelligent mb-4">
                Hidden Gems Explorer
              </h1>
              
              <p className="text-xl text-muted-foreground font-caption max-w-2xl mx-auto leading-relaxed">
                Discover unique local experiences and off-the-beaten-path destinations through AI-powered recommendations and community insights.
              </p>

              <div className="flex items-center justify-center space-x-4 pt-6">
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-gradient-intelligent"
                >
                  Submit a Gem
                </Button>
                <Button
                  variant="outline"
                  iconName="Heart"
                  onClick={() => navigate('/trip-itinerary-details')}
                  className="glass glass-hover"
                >
                  My Wishlist ({wishlist?.length})
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className={`
                lg:sticky lg:top-24 space-y-6
                ${isFilterPanelOpen ? 'block' : 'hidden lg:block'}
              `}>
                <div className="glass glass-hover p-6 rounded-xl">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isAISearchEnabled={isAISearchEnabled}
                    onAISearchToggle={() => setIsAISearchEnabled(!isAISearchEnabled)}
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    iconName="Filter"
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className="lg:hidden glass glass-hover"
                  >
                    Filters
                    {filters?.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-accent text-white rounded-full text-xs">
                        {filters?.length}
                      </span>
                    )}
                  </Button>
                  
                  <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground font-caption">
                    <Icon name="MapPin" size={16} />
                    <span>Showing gems near Delhi</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'list' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded-md transition-colors duration-200 ${
                        viewMode === 'map' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name="Map" size={16} />
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    iconName="Bot"
                    onClick={() => setIsAISidebarOpen(true)}
                    className="hidden lg:flex glass glass-hover text-accent"
                  >
                    AI Assistant
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="min-h-[600px]">
                {viewMode === 'map' ? (
                  <MapView
                    gems={mockGems}
                    selectedGem={selectedGem}
                    onGemSelect={handleGemSelect}
                    filters={filters}
                    searchQuery={searchQuery}
                  />
                ) : (
                  <ListView
                    gems={mockGems}
                    filters={filters}
                    searchQuery={searchQuery}
                    onGemSelect={handleGemSelect}
                    wishlist={wishlist}
                    onWishlistToggle={handleWishlistToggle}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <GemDetailsModal
        gem={selectedGem}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedGem(null);
        }}
        isWishlisted={selectedGem ? wishlist?.includes(selectedGem?.id) : false}
        onWishlistToggle={() => selectedGem && handleWishlistToggle(selectedGem?.id)}
      />
      <SubmitGemModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitGem}
      />
      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        isOpen={isAISidebarOpen}
        onToggle={() => setIsAISidebarOpen(!isAISidebarOpen)}
        contextData={{ 
          currentView: viewMode,
          activeFilters: filters,
          searchQuery: searchQuery,
          gemsCount: mockGems?.length
        }}
      />
      {/* Notifications */}
      <NotificationToast />
      {/* Mobile Filter Overlay */}
      {isFilterPanelOpen && (
        <div className="lg:hidden fixed inset-0 z-80 bg-black/60 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] glass p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-heading-semibold text-foreground">
                Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setIsFilterPanelOpen(false)}
              />
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isAISearchEnabled={isAISearchEnabled}
              onAISearchToggle={() => setIsAISearchEnabled(!isAISearchEnabled)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HiddenGemsExplorer;