import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import CallToActionSection from './components/CallToActionSection';

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'TravelAI Pro - AI-Powered Travel Planning Platform';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Transform your travel experience with TravelAI Pro. AI-powered trip planning, hidden gems discovery, group collaboration, and 24/7 assistance. Start planning smarter trips today.');
    }

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <HeroSection />
      {/* Feature Showcase */}
      <FeatureShowcase />
      {/* Testimonials Carousel */}
      <TestimonialsCarousel />
      {/* Call to Action Section */}
      <CallToActionSection />
      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-border/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <span className="text-xl font-heading font-heading-bold text-gradient-intelligent">
                  TravelAI Pro
                </span>
              </div>
              <p className="text-muted-foreground font-caption text-sm leading-relaxed">
                AI-powered travel planning platform that transforms how you discover, plan, and experience your journeys.
              </p>
              <div className="flex items-center space-x-4">
                <button className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-lg bg-muted/30 hover:bg-muted/50 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-heading font-heading-semibold text-foreground">Product</h4>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  AI Trip Planner
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Hidden Gems
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Group Planning
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Voice Assistant
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Emergency Copilot
                </button>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-heading font-heading-semibold text-foreground">Company</h4>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  About Us
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Careers
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Press
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Blog
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Contact
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-heading font-heading-semibold text-foreground">Support</h4>
              <div className="space-y-2">
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Help Center
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Privacy Policy
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Terms of Service
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  Cookie Policy
                </button>
                <button className="block text-sm text-muted-foreground hover:text-foreground font-caption transition-colors duration-200">
                  GDPR
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground font-caption">
              © {new Date()?.getFullYear()} TravelAI Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground font-caption">Made with ❤️ in India</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-success font-caption">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;