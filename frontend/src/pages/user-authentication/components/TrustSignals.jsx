import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustItems = [
    {
      icon: 'Shield',
      text: 'SSL Secured',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      text: 'Privacy Protected',
      color: 'text-accent'
    },
    {
      icon: 'Award',
      text: 'Travel Certified',
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-6">
        {trustItems?.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name={item?.icon} size={14} className={item?.color} />
            <span className="text-xs text-muted-foreground font-caption">
              {item?.text}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-caption">
          By signing up, you agree to our{' '}
          <button className="text-accent hover:text-accent/80 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-accent hover:text-accent/80 transition-colors duration-200">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;