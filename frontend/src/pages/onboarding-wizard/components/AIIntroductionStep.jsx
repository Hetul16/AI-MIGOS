import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIIntroductionStep = ({ onVoiceTest, onComplete }) => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [hasTestedVoice, setHasTestedVoice] = useState(false);

  const demoConversations = [
    {
      id: 1,
      user: "Plan a 5-day trip to Japan",
      ai: "I'd love to help! I can create a personalized itinerary for Japan including flights, hotels, and must-see attractions. What's your budget range?",
      feature: "Trip Planning"
    },
    {
      id: 2,
      user: "Find hidden gems in Paris",
      ai: "Great choice! I know some amazing local spots like the secret gardens of Musée Rodin and the underground wine bars in Montmartre. Want me to create a custom route?",
      feature: "Hidden Gems Discovery"
    },
    {
      id: 3,
      user: "What\'s the weather like in Bali?",
      ai: "Currently 28°C and sunny in Bali! Perfect beach weather. I can also suggest the best times to visit popular attractions to avoid crowds.",
      feature: "Real-time Information"
    }
  ];

  const aiFeatures = [
    {
      icon: 'MessageSquare',
      title: 'Natural Conversations',
      description: 'Chat with me like you would with a travel expert friend'
    },
    {
      icon: 'Mic',
      title: 'Voice Commands',
      description: 'Speak naturally - I understand multiple languages'
    },
    {
      icon: 'Brain',
      title: 'Smart Suggestions',
      description: 'I learn your preferences and suggest personalized experiences'
    },
    {
      icon: 'Clock',
      title: '24/7 Assistance',
      description: 'Available anytime, anywhere during your travels'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoConversations?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleVoiceTest = () => {
    setIsListening(true);
    setHasTestedVoice(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      onVoiceTest();
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-intelligent flex items-center justify-center ai-glow"
        >
          <Icon name="Bot" size={32} color="white" />
        </motion.div>
        
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          Meet your AI Travel Assistant
        </h2>
        <p className="text-muted-foreground font-caption max-w-md mx-auto">
          I'm here to make your travel planning effortless and personalized. Let me show you what I can do!
        </p>
      </div>
      {/* Demo Conversation */}
      <div className="glass glass-hover p-6 rounded-2xl border border-accent/20 max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm font-caption font-caption-medium text-accent">
            Live Demo - {demoConversations?.[currentDemo]?.feature}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentDemo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl max-w-xs">
                <p className="text-sm font-caption">
                  {demoConversations?.[currentDemo]?.user}
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={14} color="white" />
                </div>
                <div className="bg-muted text-muted-foreground p-3 rounded-xl max-w-sm">
                  <p className="text-sm font-caption">
                    {demoConversations?.[currentDemo]?.ai}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Demo Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {demoConversations?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentDemo(index)}
              className={`
                w-2 h-2 rounded-full transition-colors duration-300
                ${index === currentDemo ? 'bg-accent' : 'bg-border'}
              `}
            />
          ))}
        </div>
      </div>
      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {aiFeatures?.map((feature, index) => (
          <motion.div
            key={feature?.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass glass-hover p-4 rounded-xl border border-border/50"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={18} className="text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-caption font-caption-semibold text-foreground mb-1">
                  {feature?.title}
                </h4>
                <p className="text-xs text-muted-foreground font-caption">
                  {feature?.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Voice Test */}
      <div className="text-center space-y-4">
        <div className="glass glass-hover p-6 rounded-xl border border-border/50 max-w-md mx-auto">
          <h3 className="text-lg font-heading font-heading-semibold text-foreground mb-2">
            Try Voice Commands
          </h3>
          <p className="text-sm text-muted-foreground font-caption mb-4">
            Test the voice feature by saying "Hello" or "Plan a trip"
          </p>
          
          <Button
            variant={isListening ? "outline" : "default"}
            onClick={handleVoiceTest}
            disabled={isListening}
            className={`
              ${isListening ? 'ai-glow' : 'bg-gradient-intelligent hover:opacity-90'}
            `}
            iconName={isListening ? "Mic" : "MicOff"}
            iconPosition="left"
          >
            {isListening ? 'Listening...' : 'Test Voice'}
          </Button>

          {hasTestedVoice && !isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center space-x-2 text-success"
            >
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-caption">Voice test successful!</span>
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground font-caption">
            You can enable or disable voice features anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIIntroductionStep;