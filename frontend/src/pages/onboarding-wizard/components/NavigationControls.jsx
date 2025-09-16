import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const NavigationControls = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  onSkip, 
  canProceed = true,
  isLastStep = false,
  showSkip = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between pt-8 border-t border-border/50"
    >
      {/* Back Button */}
      <div className="flex-1">
        {currentStep > 0 ? (
          <Button
            variant="ghost"
            onClick={onBack}
            iconName="ChevronLeft"
            iconPosition="left"
            className="text-muted-foreground hover:text-foreground"
          >
            Back
          </Button>
        ) : (
          (<div />) // Empty div to maintain layout
        )}
      </div>
      {/* Skip Button */}
      <div className="flex-1 text-center">
        {showSkip && !isLastStep && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Skip for now
          </Button>
        )}
      </div>
      {/* Next/Complete Button */}
      <div className="flex-1 flex justify-end">
        <Button
          variant="default"
          onClick={onNext}
          disabled={!canProceed}
          iconName={isLastStep ? "Check" : "ChevronRight"}
          iconPosition="right"
          className="bg-gradient-intelligent hover:opacity-90 min-w-[120px]"
        >
          {isLastStep ? 'Complete Setup' : 'Next'}
        </Button>
      </div>
    </motion.div>
  );
};

export default NavigationControls;