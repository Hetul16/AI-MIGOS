import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import authService from '../../../services/authService';

const SocialAuth = () => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoadingProvider('google');
    setError('');

    try {
      const result = await authService.loginWithGoogle();

      if (result.success) {
        // Navigate based on whether user is new or existing
        if (result.isNewUser) {
          navigate('/onboarding-wizard');
        } else {
          navigate('/trip-planning-wizard');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message);
    } finally {
      setLoadingProvider(null);
    }
  };

  // For demo - Facebook login placeholder
  const handleFacebookLogin = async () => {
    setLoadingProvider('facebook');
    setError('');

    // Simulate Facebook auth (not implemented)
    setTimeout(() => {
      setError('Facebook login is not available in demo mode');
      setLoadingProvider(null);
    }, 1000);
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50/10',
      onClick: handleGoogleLogin
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50/10',
      onClick: handleFacebookLogin
    }
  ];

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

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-2"
        >
          <Icon name="AlertCircle" size={16} className="text-error" />
          <p className="text-sm text-error font-caption">{error}</p>
        </motion.div>
      )}

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
              onClick={provider.onClick}
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

      {/* Info for demo */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-caption">
          Google OAuth is fully functional. Facebook login is demo only.
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;
