import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Plan Trip',
      path: '/trip-planning-wizard',
      icon: 'MapPin',
      tooltip: 'Start planning your next adventure'
    },
    {
      label: 'My Trips',
      path: '/trip-itinerary-details',
      icon: 'Calendar',
      tooltip: 'View and manage your trips'
    },
    {
      label: 'Discover',
      path: '/hidden-gems-explorer',
      icon: 'Compass',
      tooltip: 'Explore hidden gems and destinations'
    }
  ];

  const secondaryItems = [
    {
      label: 'Settings',
      icon: 'Settings',
      action: () => console.log('Settings clicked')
    },
    {
      label: 'Help',
      icon: 'HelpCircle',
      action: () => console.log('Help clicked')
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    navigate('/user-authentication');
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/landing-page')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center shadow-ai-glow group-hover:shadow-ai-glow-intense transition-shadow duration-300">
                <Icon name="Plane" size={20} color="white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-heading font-heading-bold text-gradient-intelligent">
                TravelAI Pro
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  relative px-4 py-2 rounded-lg font-caption font-caption-medium text-sm
                  transition-all duration-200 group
                  ${isActive(item?.path)
                    ? 'text-accent bg-accent/10 shadow-ai-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
                title={item?.tooltip}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className={isActive(item?.path) ? 'text-accent' : 'text-current'} 
                  />
                  <span>{item?.label}</span>
                </div>
                {isActive(item?.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* More Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                More
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass glass-hover rounded-xl shadow-prominent z-60 animate-slide-up">
                  <div className="p-2">
                    {secondaryItems?.map((item) => (
                      <button
                        key={item?.label}
                        onClick={() => {
                          item?.action();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                      >
                        <Icon name={item?.icon} size={16} />
                        <span className="font-caption">{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-intelligent flex items-center justify-center text-white text-sm font-caption font-caption-medium">
                  JD
                </div>
                <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass glass-hover rounded-xl shadow-prominent z-60 animate-slide-up">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border/50">
                      <p className="text-sm font-caption font-caption-medium text-foreground">John Doe</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </div>
                    <div className="py-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200">
                        <Icon name="User" size={16} />
                        <span className="font-caption">Profile</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200">
                        <Icon name="Settings" size={16} />
                        <span className="font-caption">Preferences</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200">
                        <Icon name="CreditCard" size={16} />
                        <span className="font-caption">Billing</span>
                      </button>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
                      >
                        <Icon name="LogOut" size={16} />
                        <span className="font-caption">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-glass border-t border-border/50 shadow-prominent animate-slide-up">
            <div className="p-4 space-y-2">
              {navigationItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-caption font-caption-medium
                    transition-all duration-200
                    ${isActive(item?.path)
                      ? 'text-accent bg-accent/10 shadow-ai-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    className={isActive(item?.path) ? 'text-accent' : 'text-current'} 
                  />
                  <span>{item?.label}</span>
                </button>
              ))}
              
              <div className="pt-2 border-t border-border/50">
                {secondaryItems?.map((item) => (
                  <button
                    key={item?.label}
                    onClick={() => {
                      item?.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
                  >
                    <Icon name={item?.icon} size={18} />
                    <span className="font-caption font-caption-medium">{item?.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
                >
                  <Icon name="LogOut" size={18} />
                  <span className="font-caption font-caption-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;