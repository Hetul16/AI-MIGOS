import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import StepIndicator from './components/StepIndicator';
import TravelStyleStep from './components/TravelStyleStep';
import DestinationInterestsStep from './components/DestinationInterestsStep';
import AIIntroductionStep from './components/AIIntroductionStep';
import NavigationControls from './components/NavigationControls';
import { showSuccessToast, showInfoToast } from '../../components/ui/NotificationToast';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Step 1: Travel Style Preferences
  const [selectedStyles, setSelectedStyles] = useState([]);

  // Step 2: Destination Interests
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  // Step 3: AI Introduction
  const [hasTestedVoice, setHasTestedVoice] = useState(false);

  const steps = [
    {
      id: 'travel-style',
      label: 'Travel Style',
      icon: 'Compass',
      estimatedTime: '2 min',
      component: TravelStyleStep
    },
    {
      id: 'destinations',
      label: 'Destinations',
      icon: 'MapPin',
      estimatedTime: '3 min',
      component: DestinationInterestsStep
    },
    {
      id: 'ai-intro',
      label: 'AI Assistant',
      icon: 'Bot',
      estimatedTime: '2 min',
      component: AIIntroductionStep
    }
  ];

  const totalSteps = steps?.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Check if user can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedStyles?.length > 0;
      case 1:
        return selectedDestinations?.length > 0 || selectedRegions?.length > 0;
      case 2:
        return true; // AI intro step doesn't require completion
      default:
        return true;
    }
  };

  // Handle step navigation
  const handleNext = async () => {
    if (!canProceed() && currentStep < 2) {
      showInfoToast('Please make at least one selection to continue');
      return;
    }

    if (isLastStep) {
      await handleComplete();
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleComplete = async () => {
    // Save user preferences to localStorage
    const userPreferences = {
      travelStyles: selectedStyles,
      destinations: selectedDestinations,
      regions: selectedRegions,
      voiceTested: hasTestedVoice,
      onboardingCompleted: true,
      completedAt: new Date()?.toISOString()
    };

    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    localStorage.setItem('onboardingCompleted', 'true');

    showSuccessToast('Welcome to TravelAI Pro! Your preferences have been saved.');
    
    // Navigate to trip planning wizard
    setTimeout(() => {
      navigate('/trip-planning-wizard');
    }, 1500);
  };

  // Handle travel style selection
  const handleStyleToggle = (styleId) => {
    setSelectedStyles(prev => 
      prev?.includes(styleId) 
        ? prev?.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  // Handle destination selection
  const handleDestinationToggle = (destinationId) => {
    setSelectedDestinations(prev => 
      prev?.includes(destinationId) 
        ? prev?.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  // Handle region selection
  const handleRegionToggle = (regionId) => {
    setSelectedRegions(prev => 
      prev?.includes(regionId) 
        ? prev?.filter(id => id !== regionId)
        : [...prev, regionId]
    );
  };

  // Handle voice test
  const handleVoiceTest = () => {
    setHasTestedVoice(true);
    showSuccessToast('Voice recognition is working perfectly!');
  };

  // Get current step component
  const getCurrentStepComponent = () => {
    const StepComponent = steps?.[currentStep]?.component;
    
    switch (currentStep) {
      case 0:
        return (
          <StepComponent
            selectedStyles={selectedStyles}
            onStyleToggle={handleStyleToggle}
          />
        );
      case 1:
        return (
          <StepComponent
            selectedDestinations={selectedDestinations}
            onDestinationToggle={handleDestinationToggle}
            selectedRegions={selectedRegions}
            onRegionToggle={handleRegionToggle}
          />
        );
      case 2:
        return (
          <StepComponent
            onVoiceTest={handleVoiceTest}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === 'Enter' && canProceed()) {
        handleNext();
      } else if (e?.key === 'Escape' && currentStep > 0) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, canProceed]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Progress Indicator */}
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />

          {/* Step Content */}
          <div className="glass glass-hover rounded-2xl border border-border/50 shadow-prominent">
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: isTransitioning ? 50 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="min-h-[400px] flex flex-col justify-center"
                >
                  {getCurrentStepComponent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <NavigationControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={handleSkip}
                canProceed={canProceed()}
                isLastStep={isLastStep}
                showSkip={currentStep !== 0} // Don't show skip on first step
              />
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground font-caption">
              Use keyboard shortcuts: Enter to continue, Escape to go back
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizard;