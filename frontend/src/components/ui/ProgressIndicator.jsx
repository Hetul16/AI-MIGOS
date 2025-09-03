import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 0, 
  onStepClick = null,
  variant = 'horizontal', // 'horizontal' | 'vertical'
  showLabels = true,
  showPercentage = true,
  className = ''
}) => {
  const completedSteps = currentStep;
  const totalSteps = steps?.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'Check';
    if (step?.icon) return step?.icon;
    return 'Circle';
  };

  const handleStepClick = (stepIndex) => {
    if (onStepClick && stepIndex <= currentStep) {
      onStepClick(stepIndex);
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {showPercentage && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-caption font-caption-medium text-foreground">
                Progress
              </span>
              <span className="text-sm font-mono text-accent">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-intelligent h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        {steps?.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && index <= currentStep;

          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${status === 'completed'
                      ? 'bg-success text-success-foreground shadow-ai-glow'
                      : status === 'current' ?'bg-gradient-intelligent text-white ai-glow' :'bg-muted text-muted-foreground'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                >
                  <Icon
                    name={getStepIcon(step, status)}
                    size={16}
                    className={status === 'completed' ? 'text-white' : 'text-current'}
                  />
                </button>
                {index < steps?.length - 1 && (
                  <div
                    className={`
                      w-0.5 h-8 mt-2 transition-colors duration-300
                      ${index < currentStep ? 'bg-success' : 'bg-border'}
                    `}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className={`
                  font-caption font-caption-medium text-sm
                  ${status === 'current' ? 'text-accent' : status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                `}>
                  {step?.label}
                </h4>
                {step?.description && (
                  <p className="text-xs text-muted-foreground mt-1 font-caption">
                    {step?.description}
                  </p>
                )}
                {status === 'current' && step?.currentAction && (
                  <p className="text-xs text-accent mt-2 font-caption font-caption-medium">
                    {step?.currentAction}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-caption font-caption-medium text-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-mono text-accent">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-intelligent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = onStepClick && index <= currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                  ${status === 'completed'
                    ? 'bg-success text-success-foreground shadow-ai-glow'
                    : status === 'current' ?'bg-gradient-intelligent text-white ai-glow' :'bg-muted text-muted-foreground'
                  }
                  ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                `}
              >
                <Icon
                  name={getStepIcon(step, status)}
                  size={16}
                  className={status === 'completed' ? 'text-white' : 'text-current'}
                />
              </button>
              {showLabels && (
                <div className="text-center">
                  <p className={`
                    text-xs font-caption font-caption-medium
                    ${status === 'current' ? 'text-accent' : status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                  `}>
                    {step?.label}
                  </p>
                  {status === 'current' && step?.currentAction && (
                    <p className="text-xs text-accent mt-1 font-caption">
                      {step?.currentAction}
                    </p>
                  )}
                </div>
              )}
              {index < steps?.length - 1 && (
                <div
                  className={`
                    absolute top-5 h-0.5 transition-colors duration-300
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
    </div>
  );
};

export default ProgressIndicator;