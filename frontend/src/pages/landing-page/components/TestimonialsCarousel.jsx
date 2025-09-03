import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `TravelAI Pro completely transformed how I plan my trips! The AI suggestions for hidden gems in Kerala were spot-on. I discovered places I never would have found on my own. The group planning feature made coordinating with my family so much easier.`,
      tripType: "Family Vacation",
      destination: "Kerala Backwaters",
      verified: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `As a frequent business traveler, I needed something efficient and smart. The voice assistant feature is incredible - I can plan entire itineraries while commuting. The budget optimization saved me ₹25,000 on my last Rajasthan trip!`,
      tripType: "Business + Leisure",
      destination: "Rajasthan Circuit",
      verified: true
    },
    {
      id: 3,
      name: "Ananya Patel",
      location: "Bangalore, Karnataka",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `The emergency copilot feature gave me confidence to explore solo. When I got lost in the mountains of Himachal, the SOS feature and real-time assistance were lifesavers. This app is a must-have for every traveler!`,
      tripType: "Solo Adventure",
      destination: "Himachal Pradesh",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `Planning our honeymoon was stressful until we found TravelAI Pro. The AI understood our preferences perfectly and suggested romantic spots in Goa we never knew existed. The collaborative planning made it fun for both of us!`,
      tripType: "Honeymoon",
      destination: "Goa Beaches",
      verified: true
    },
    {
      id: 5,
      name: "Meera Reddy",
      location: "Hyderabad, Telangana",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: `The multi-language support was amazing during our Northeast India trip. The app provided cultural insights and local customs that helped us connect with communities. It's like having a local guide everywhere you go!`,
      tripType: "Cultural Exploration",
      destination: "Northeast India",
      verified: true
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? "text-warning fill-current" : "text-muted-foreground"}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-background">
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
              <Icon name="Heart" size={20} color="white" />
            </div>
            <span className="text-accent font-caption font-caption-medium text-sm">
              Trusted by Travelers
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-heading font-heading-bold text-foreground mb-6">
            What Our
            <span className="text-gradient-intelligent block">
              Happy Travelers Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-caption max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied travelers who have discovered their perfect trips with TravelAI Pro's intelligent planning assistance.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div 
            className="relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="glass glass-hover rounded-2xl p-8 lg:p-12 shadow-prominent"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* Avatar and Info */}
                  <div className="flex-shrink-0 text-center lg:text-left">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-accent/20">
                        <Image
                          src={testimonials?.[currentIndex]?.avatar}
                          alt={testimonials?.[currentIndex]?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {testimonials?.[currentIndex]?.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                          <Icon name="Check" size={12} color="white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <h4 className="font-heading font-heading-semibold text-foreground text-lg">
                        {testimonials?.[currentIndex]?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-caption">
                        {testimonials?.[currentIndex]?.location}
                      </p>
                      <div className="flex items-center justify-center lg:justify-start space-x-1">
                        {renderStars(testimonials?.[currentIndex]?.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 space-y-6">
                    <div className="relative">
                      <Icon 
                        name="Quote" 
                        size={32} 
                        className="text-accent/30 absolute -top-2 -left-2" 
                      />
                      <p className="text-lg text-foreground font-caption leading-relaxed pl-8">
                        {testimonials?.[currentIndex]?.text}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
                        <Icon name="MapPin" size={14} className="text-primary" />
                        <span className="text-sm font-caption text-primary">
                          {testimonials?.[currentIndex]?.destination}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/10 rounded-full">
                        <Icon name="Tag" size={14} className="text-secondary" />
                        <span className="text-sm font-caption text-secondary">
                          {testimonials?.[currentIndex]?.tripType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 interactive-scale"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center space-x-2">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${index === currentIndex 
                      ? 'bg-accent w-8' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }
                  `}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 interactive-scale"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={24} className="text-success" />
            </div>
            <h4 className="font-heading font-heading-semibold text-foreground mb-2">
              SSL Secured
            </h4>
            <p className="text-sm text-muted-foreground font-caption">
              Bank-level security
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={24} className="text-primary" />
            </div>
            <h4 className="font-heading font-heading-semibold text-foreground mb-2">
              IATA Certified
            </h4>
            <p className="text-sm text-muted-foreground font-caption">
              Travel industry approved
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
            <h4 className="font-heading font-heading-semibold text-foreground mb-2">
              24/7 Support
            </h4>
            <p className="text-sm text-muted-foreground font-caption">
              Always here to help
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="RefreshCw" size={24} className="text-secondary" />
            </div>
            <h4 className="font-heading font-heading-semibold text-foreground mb-2">
              Free Cancellation
            </h4>
            <p className="text-sm text-muted-foreground font-caption">
              Flexible booking terms
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;