import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AIAssistantSidebar from '../../components/ui/AIAssistantSidebar';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import NotificationToast, { showSuccessToast, showAIToast } from '../../components/ui/NotificationToast';
import DestinationSelector from './components/DestinationSelector';
import DateSelector from './components/DateSelector';
import BudgetSelector from './components/BudgetSelector';
import PreferencesSelector from './components/PreferencesSelector'  ;
import ItineraryPreview from './components/ItineraryPreview';
import Icon from '../../components/AppIcon';

const TripPlanningWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // Form data state
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState(null);

  const steps = [
    {
      id: 0,
      label: 'Destination',
      icon: 'MapPin',
      description: 'Choose where you want to go',
      currentAction: 'Select your dream destination'
    },
    {
      id: 1,
      label: 'Dates',
      icon: 'Calendar',
      description: 'Pick your travel dates',
      currentAction: 'Choose your travel dates'
    },
    {
      id: 2,
      label: 'Budget',
      icon: 'Wallet',
      description: 'Set your travel budget',
      currentAction: 'Define your budget range'
    },
    {
      id: 3,
      label: 'Preferences',
      icon: 'Heart',
      description: 'Tell us your preferences',
      currentAction: 'Share your travel style'
    },
    {
      id: 4,
      label: 'Itinerary',
      icon: 'Route',
      description: 'Review your personalized plan',
      currentAction: 'Customize your itinerary'
    }
  ];

  useEffect(() => {
    // Show welcome AI toast
    setTimeout(() => {
      showAIToast(
        "Welcome to the Trip Planning Wizard! I'm here to help you create the perfect itinerary. Feel free to ask me anything about your destination or travel preferences.",
        "AI Travel Assistant",
        {
          label: "Ask AI",
          onClick: () => setIsAISidebarOpen(true)
        }
      );
    }, 1000);
  }, []);

  const handleStepNavigation = (stepIndex) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Show step-specific AI suggestions
      setTimeout(() => {
        const nextStep = steps?.[currentStep + 1];
        showAIToast(
          `Great progress! Now let's work on ${nextStep?.description?.toLowerCase()}. I can provide personalized suggestions based on your previous choices.`,
          "AI Assistant"
        );
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    showSuccessToast("Your trip itinerary has been created successfully!");
    setTimeout(() => {
      navigate('/trip-itinerary-details');
    }, 1500);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      showAIToast(
        "Voice assistant activated! You can now speak your preferences and I'll help you plan your trip.",
        "Voice Assistant Active"
      );
    }
  };

  const getContextData = () => {
    return {
      destination: selectedDestination,
      dates: selectedDates,
      budget: selectedBudget,
      preferences: selectedPreferences,
      currentStep: currentStep
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <DestinationSelector
            selectedDestination={selectedDestination}
            onDestinationSelect={setSelectedDestination}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DateSelector
            selectedDates={selectedDates}
            onDatesSelect={setSelectedDates}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <BudgetSelector
            selectedBudget={selectedBudget}
            onBudgetSelect={setSelectedBudget}
            onNext={handleNext}
            onBack={handleBack}
            duration={selectedDates?.duration || 1}
          />
        );
      case 3:
        return (
          <PreferencesSelector
            selectedPreferences={selectedPreferences}
            onPreferencesSelect={setSelectedPreferences}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ItineraryPreview
            destination={selectedDestination}
            dates={selectedDates}
            budget={selectedBudget}
            preferences={selectedPreferences}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NotificationToast />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-intelligent flex items-center justify-center ai-glow">
                <Icon name="Wand2" size={24} color="white" />
              </div>
              <h1 className="text-3xl font-heading font-heading-bold text-gradient-intelligent">
                Trip Planning Wizard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground font-caption max-w-2xl mx-auto">
              Let our AI assistant guide you through creating the perfect personalized travel itinerary
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepNavigation}
              variant="horizontal"
              showLabels={true}
              showPercentage={true}
            />
          </div>

          {/* Voice Assistant Toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleVoiceToggle}
              className={`
                flex items-center space-x-3 px-6 py-3 rounded-xl font-caption font-caption-medium transition-all duration-300
                ${isVoiceActive
                  ? 'bg-accent/20 text-accent border border-accent ai-glow' :'glass glass-hover text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name="Mic" size={20} />
              <span>
                {isVoiceActive ? 'Voice Assistant Active' : 'Activate Voice Assistant'}
              </span>
              {isVoiceActive && (
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </button>
          </div>

          {/* Step Content */}
          <div className="glass glass-hover rounded-2xl p-8 mb-8 min-h-[600px]">
            {renderStepContent()}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsAISidebarOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 glass glass-hover rounded-lg text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <Icon name="MessageCircle" size={16} />
              <span className="font-caption font-caption-medium">Ask AI Assistant</span>
            </button>
            
            <button
              onClick={() => navigate('/hidden-gems-explorer')}
              className="flex items-center space-x-2 px-4 py-2 glass glass-hover rounded-lg text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <Icon name="Compass" size={16} />
              <span className="font-caption font-caption-medium">Explore Hidden Gems</span>
            </button>
            
            <button
              onClick={() => navigate('/trip-itinerary-details')}
              className="flex items-center space-x-2 px-4 py-2 glass glass-hover rounded-lg text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <Icon name="Calendar" size={16} />
              <span className="font-caption font-caption-medium">View My Trips</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        isOpen={isAISidebarOpen}
        onToggle={() => setIsAISidebarOpen(!isAISidebarOpen)}
        contextData={getContextData()}
      />

      {/* Mobile Voice Button */}
      {!isAISidebarOpen && (
        <button
          onClick={handleVoiceToggle}
          className={`
            fixed bottom-20 left-6 w-14 h-14 rounded-full shadow-prominent flex items-center justify-center z-70 lg:hidden interactive-scale
            ${isVoiceActive
              ? 'bg-accent text-white ai-glow' :'bg-gradient-intelligent text-white'
            }
          `}
        >
          <Icon name="Mic" size={24} />
          {isVoiceActive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse" />
          )}
        </button>
      )}
    </div>
  );
};

export default TripPlanningWizard;