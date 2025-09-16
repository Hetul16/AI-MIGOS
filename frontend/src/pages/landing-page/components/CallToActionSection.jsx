import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleStartPlanning = () => {
    navigate('/user-authentication');
  };

  const handleTryDemo = () => {
    navigate('/trip-planning-wizard');
  };

  const handleEmailSubscribe = async () => {
    if (!email?.trim()) return;
    
    setIsSubscribing(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail('');
      // Show success toast
      if (window.showToast) {
        window.showToast({
          type: 'success',
          title: 'Subscribed!',
          message: 'You\'ll receive travel tips and updates from TravelAI Pro.',
          duration: 4000
        });
      }
    }, 1500);
  };

  const benefits = [
    {
      icon: "Zap",
      text: "Plan trips 10x faster with AI"
    },
    {
      icon: "Users",
      text: "Collaborate with friends seamlessly"
    },
    {
      icon: "Shield",
      text: "24/7 emergency assistance"
    },
    {
      icon: "Sparkles",
      text: "Discover hidden gems everywhere"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-intelligent flex items-center justify-center ai-glow">
                  <Icon name="Rocket" size={24} color="white" />
                </div>
                <span className="text-accent font-caption font-caption-medium text-sm">
                  Join 50,000+ Smart Travelers
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl lg:text-6xl font-heading font-heading-bold leading-tight"
              >
                Ready to Transform
                <span className="text-gradient-intelligent block">
                  Your Travel Experience?
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-muted-foreground font-caption leading-relaxed"
              >
                Start planning smarter trips today with AI-powered recommendations, collaborative tools, and 24/7 assistance. Your perfect journey is just one click away.
              </motion.p>
            </div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon name={benefit?.icon} size={16} className="text-accent" />
                  </div>
                  <span className="text-foreground font-caption font-caption-medium">
                    {benefit?.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="default"
                size="lg"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={handleStartPlanning}
                className="bg-gradient-intelligent hover:opacity-90 interactive-scale text-lg px-8 py-4"
              >
                Start Planning Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="Play"
                iconPosition="left"
                onClick={handleTryDemo}
                className="interactive-scale text-lg px-8 py-4"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center space-x-6 pt-6 border-t border-border/30"
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-accent border-2 border-background" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary border-2 border-background" />
                </div>
                <span className="text-sm text-muted-foreground font-caption">
                  Join 50K+ travelers
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
                ))}
                <span className="text-sm text-muted-foreground font-caption ml-2">
                  4.9/5 rating
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="glass glass-hover rounded-2xl p-8 shadow-prominent">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-intelligent flex items-center justify-center mx-auto ai-glow">
                    <Icon name="Mail" size={28} color="white" />
                  </div>
                  <h3 className="text-2xl font-heading font-heading-semibold text-foreground">
                    Get Travel Insights
                  </h3>
                  <p className="text-muted-foreground font-caption">
                    Subscribe to receive AI-powered travel tips, hidden gem discoveries, and exclusive deals delivered to your inbox.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e?.target?.value)}
                      placeholder="Enter your email address"
                      className="w-full p-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground font-caption focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors duration-200"
                      onKeyPress={(e) => e?.key === 'Enter' && handleEmailSubscribe()}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Icon name="Mail" size={20} className="text-muted-foreground" />
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    iconName="Send"
                    iconPosition="right"
                    onClick={handleEmailSubscribe}
                    loading={isSubscribing}
                    disabled={!email?.trim() || isSubscribing}
                    className="w-full bg-gradient-intelligent hover:opacity-90"
                  >
                    {isSubscribing ? 'Subscribing...' : 'Get Travel Tips'}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground font-caption">
                    No spam, unsubscribe anytime. We respect your privacy.
                  </p>
                </div>

                {/* Features Preview */}
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h4 className="text-sm font-caption font-caption-medium text-foreground">
                    What you'll get:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-muted-foreground font-caption">
                        Weekly AI travel insights
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-muted-foreground font-caption">
                        Hidden gem recommendations
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="CheckCircle" size={16} className="text-success" />
                      <span className="text-sm text-muted-foreground font-caption">
                        Exclusive travel deals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm animate-pulse delay-1000" />
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="glass glass-hover rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-heading font-heading-bold text-gradient-intelligent mb-2">
                  1M+
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  Trips Planned
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-heading-bold text-gradient-intelligent mb-2">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  Happy Travelers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-heading-bold text-gradient-intelligent mb-2">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  User Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-heading-bold text-gradient-intelligent mb-2">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground font-caption">
                  AI Support
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;