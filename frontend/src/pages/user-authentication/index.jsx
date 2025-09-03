import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import TrustSignals from './components/TrustSignals';

const UserAuthentication = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  const handleLogoClick = () => {
    navigate('/landing-page');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-intelligent-subtle opacity-30" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ 
            opacity: isVisible ? 1 : 0, 
            scale: isVisible ? 1 : 0.9, 
            y: isVisible ? 0 : 20 
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Logo Header */}
          <div className="text-center mb-8">
            <motion.button
              onClick={handleLogoClick}
              className="inline-flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-intelligent flex items-center justify-center shadow-ai-glow group-hover:shadow-ai-glow-intense transition-shadow duration-300">
                <Icon name="Plane" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-heading-bold text-gradient-intelligent">
                  TravelAI Pro
                </h1>
                <p className="text-sm text-muted-foreground font-caption">
                  Your AI Travel Companion
                </p>
              </div>
            </motion.button>
          </div>

          {/* Main Auth Card */}
          <motion.div
            className="glass glass-hover rounded-2xl p-8 shadow-prominent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {showForgotPassword ? (
                <motion.div key="forgot-password">
                  <ForgotPasswordForm onBack={handleBackToLogin} />
                </motion.div>
              ) : (
                <motion.div key="auth-forms" className="space-y-6">
                  {/* Auth Tabs */}
                  <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

                  {/* Form Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'login' ? (
                      <motion.div key="login">
                        <LoginForm onForgotPassword={handleForgotPassword} />
                      </motion.div>
                    ) : (
                      <motion.div key="register">
                        <RegisterForm />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Social Authentication */}
                  <SocialAuth />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TrustSignals />
          </motion.div>

          {/* Additional Links */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground font-caption">
              Need help?{' '}
              <button className="text-accent hover:text-accent/80 transition-colors duration-200">
                Contact Support
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserAuthentication;