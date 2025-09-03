import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [demoInput, setDemoInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoSuggestions, setDemoSuggestions] = useState([]);

  const handleDemoSubmit = async () => {
    if (!demoInput?.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const suggestions = [
        {
          id: 1,
          title: "Hidden Temple Trail",
          description: "Discover ancient temples off the beaten path with local guides",
          duration: "3 days",
          budget: "₹15,000",
          type: "Cultural"
        },
        {
          id: 2,
          title: "Sunset Photography Tour",
          description: "Capture breathtaking golden hour moments at scenic viewpoints",
          duration: "1 day",
          budget: "₹3,500",
          type: "Adventure"
        },
        {
          id: 3,
          title: "Local Food Experience",
          description: "Authentic street food tour with cooking class experience",
          duration: "Half day",
          budget: "₹2,000",
          type: "Culinary"
        }
      ];
      setDemoSuggestions(suggestions);
      setIsGenerating(false);
    }, 2000);
  };

  const handleStartPlanning = () => {
    navigate('/user-authentication');
  };

  const handleTryDemo = () => {
    navigate('/trip-planning-wizard');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-slate-900 to-slate-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-intelligent flex items-center justify-center ai-glow">
                  <Icon name="Bot" size={24} color="white" />
                </div>
                <span className="text-accent font-caption font-caption-medium text-sm">
                  Powered by Advanced AI
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-heading font-heading-bold leading-tight"
              >
                Plan Your
                <span className="text-gradient-intelligent block">
                  Dream Trip
                </span>
                with AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-muted-foreground font-caption leading-relaxed max-w-lg"
              >
                Discover hidden gems, collaborate with friends, and create personalized itineraries with our intelligent travel assistant. Your perfect journey starts here.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="default"
                size="lg"
                iconName="Plane"
                iconPosition="left"
                onClick={handleStartPlanning}
                className="bg-gradient-intelligent hover:opacity-90 interactive-scale text-lg px-8 py-4"
              >
                Start Planning
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Play"
                iconPosition="left"
                onClick={handleTryDemo}
                className="interactive-scale text-lg px-8 py-4"
              >
                Try Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center space-x-8 pt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-heading font-heading-bold text-gradient-intelligent">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  Happy Travelers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-heading font-heading-bold text-gradient-intelligent">
                  1M+
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  Trips Planned
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-heading font-heading-bold text-gradient-intelligent">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  User Rating
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="glass glass-hover rounded-2xl p-8 shadow-prominent">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
                    <Icon name="Sparkles" size={16} color="white" />
                  </div>
                  <h3 className="text-xl font-heading font-heading-semibold text-foreground">
                    Try AI Planning
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                      Where do you want to go?
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={demoInput}
                        onChange={(e) => setDemoInput(e?.target?.value)}
                        placeholder="e.g., Goa, Kerala, Rajasthan..."
                        className="w-full p-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground font-caption focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors duration-200"
                        onKeyPress={(e) => e?.key === 'Enter' && handleDemoSubmit()}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Icon name="MapPin" size={20} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    iconName="Wand2"
                    iconPosition="left"
                    onClick={handleDemoSubmit}
                    loading={isGenerating}
                    disabled={!demoInput?.trim() || isGenerating}
                    className="w-full bg-gradient-intelligent hover:opacity-90"
                  >
                    {isGenerating ? 'Generating Ideas...' : 'Get AI Suggestions'}
                  </Button>
                </div>

                {/* Demo Results */}
                {demoSuggestions?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-3 pt-4 border-t border-border/50"
                  >
                    <h4 className="text-sm font-caption font-caption-medium text-accent">
                      AI Suggestions for {demoInput}:
                    </h4>
                    {demoSuggestions?.map((suggestion, index) => (
                      <motion.div
                        key={suggestion?.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-muted/30 rounded-lg border border-border/30 hover:border-accent/30 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-caption font-caption-medium text-foreground text-sm">
                              {suggestion?.title}
                            </h5>
                            <p className="text-xs text-muted-foreground font-caption mt-1">
                              {suggestion?.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-accent font-caption">
                                {suggestion?.duration}
                              </span>
                              <span className="text-xs text-success font-caption">
                                {suggestion?.budget}
                              </span>
                              <span className="text-xs text-secondary font-caption">
                                {suggestion?.type}
                              </span>
                            </div>
                          </div>
                          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm animate-pulse delay-1000" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;