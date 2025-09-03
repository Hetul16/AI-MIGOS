import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialAuth = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50/10'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50/10'
    }
  ];

  const handleSocialLogin = async (providerId) => {
    setLoadingProvider(providerId);
    
    // Simulate social auth
    setTimeout(() => {
      console.log(`${providerId} authentication initiated`);
      setLoadingProvider(null);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground font-caption font-caption-medium">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <motion.div
            key={provider?.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="default"
              fullWidth
              loading={loadingProvider === provider?.id}
              onClick={() => handleSocialLogin(provider?.id)}
              className={`
                glass glass-hover border-border/50 ${provider?.bgColor}
                transition-all duration-200
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon 
                  name={provider?.icon} 
                  size={18} 
                  className={provider?.color} 
                />
                <span className="font-caption font-caption-medium text-sm">
                  {provider?.name}
                </span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialAuth;