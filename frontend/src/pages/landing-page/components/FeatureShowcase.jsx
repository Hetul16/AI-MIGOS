import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeatureShowcase = () => {
  const features = [
    {
      id: 1,
      icon: "Compass",
      title: "Hidden Gems Discovery",
      description: "AI-powered recommendations for off-the-beaten-path destinations that match your interests and travel style.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    },
    {
      id: 2,
      icon: "Users",
      title: "Group Collaboration",
      description: "Plan together with friends and family using real-time voting, shared wishlists, and collaborative decision-making.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20"
    },
    {
      id: 3,
      icon: "Mic",
      title: "Voice Assistant",
      description: "Natural language planning with multi-language support. Just speak your travel dreams and watch them come to life.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      id: 4,
      icon: "Shield",
      title: "Emergency Copilot",
      description: "24/7 safety assistance with SOS features, real-time alerts, and emergency contact integration for peace of mind.",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20"
    },
    {
      id: 5,
      icon: "BarChart3",
      title: "Smart Budget Planning",
      description: "Interactive budget visualization with cost optimization suggestions and real-time expense tracking.",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20"
    },
    {
      id: 6,
      icon: "Globe",
      title: "Multi-Language Support",
      description: "Travel confidently anywhere with real-time translation, local customs guidance, and cultural insights.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center ai-glow">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <span className="text-accent font-caption font-caption-medium text-sm">
              Powered by AI
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-heading font-heading-bold text-foreground mb-6">
            Everything You Need for
            <span className="text-gradient-intelligent block">
              Perfect Travel Planning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-caption max-w-3xl mx-auto leading-relaxed">
            From discovery to booking, our AI-powered platform handles every aspect of your journey with intelligent automation and personalized recommendations.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features?.map((feature) => (
            <motion.div
              key={feature?.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`
                glass glass-hover rounded-2xl p-8 h-full border-l-4 ${feature?.borderColor}
                transition-all duration-300 hover:scale-105 hover:shadow-prominent
                ${feature?.bgColor}
              `}>
                <div className="space-y-6">
                  <div className={`
                    w-16 h-16 rounded-2xl ${feature?.bgColor} flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <Icon 
                      name={feature?.icon} 
                      size={28} 
                      className={feature?.color}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-heading font-heading-semibold text-foreground">
                      {feature?.title}
                    </h3>
                    <p className="text-muted-foreground font-caption leading-relaxed">
                      {feature?.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm font-caption font-caption-medium">
                    <span className={feature?.color}>Learn more</span>
                    <Icon 
                      name="ArrowRight" 
                      size={16} 
                      className={`${feature?.color} group-hover:translate-x-1 transition-transform duration-200`}
                    />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="glass glass-hover rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-heading-semibold text-foreground mb-4">
              Ready to Experience AI-Powered Travel Planning?
            </h3>
            <p className="text-muted-foreground font-caption mb-6">
              Join thousands of travelers who have discovered their perfect trips with our intelligent assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-intelligent text-white rounded-xl font-caption font-caption-medium hover:opacity-90 transition-opacity duration-200 interactive-scale">
                Start Free Trial
              </button>
              <button className="px-8 py-3 border border-border text-foreground rounded-xl font-caption font-caption-medium hover:bg-muted/50 transition-colors duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;