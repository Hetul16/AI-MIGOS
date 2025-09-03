import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div
            className="bg-gradient-intelligent h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute -top-1 right-0 transform translate-x-2">
          <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                  ${isCompleted
                    ? 'bg-success text-success-foreground shadow-ai-glow'
                    : isCurrent
                    ? 'bg-gradient-intelligent text-white ai-glow' :'bg-muted text-muted-foreground'
                  }
                `}
              >
                <Icon
                  name={isCompleted ? 'Check' : step?.icon}
                  size={16}
                  className={isCompleted ? 'text-white' : 'text-current'}
                />
              </div>
              <div className="text-center">
                <p className={`
                  text-xs font-caption font-caption-medium
                  ${isCurrent ? 'text-accent' : isCompleted ? 'text-success' : 'text-muted-foreground'}
                `}>
                  {step?.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-accent mt-1 font-caption">
                    Current
                  </p>
                )}
              </div>
              {index < steps?.length - 1 && (
                <div
                  className={`
                    absolute top-5 h-0.5 transition-colors duration-300 hidden sm:block
                    ${index < currentStep ? 'bg-success' : 'bg-border'}
                  `}
                  style={{
                    left: `${((index + 1) / steps?.length) * 100 - (100 / steps?.length) / 2}%`,
                    width: `${100 / steps?.length}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Time Estimate */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground font-caption">
          Step {currentStep + 1} of {totalSteps} • Estimated time: {steps?.[currentStep]?.estimatedTime || '2 min'}
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;