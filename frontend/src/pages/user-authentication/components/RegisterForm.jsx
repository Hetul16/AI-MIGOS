import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    travelPreferences: [],
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const travelPreferenceOptions = [
    { id: 'adventure', label: 'Adventure Travel', icon: 'Mountain' },
    { id: 'cultural', label: 'Cultural Experiences', icon: 'Camera' },
    { id: 'relaxation', label: 'Relaxation & Wellness', icon: 'Waves' },
    { id: 'food', label: 'Food & Culinary', icon: 'UtensilsCrossed' },
    { id: 'budget', label: 'Budget-Friendly', icon: 'Wallet' },
    { id: 'luxury', label: 'Luxury Travel', icon: 'Crown' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePreferenceChange = (preferenceId) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: prev?.travelPreferences?.includes(preferenceId)
        ? prev?.travelPreferences?.filter(id => id !== preferenceId)
        : [...prev?.travelPreferences, preferenceId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Success - redirect to onboarding
      navigate('/onboarding-wizard');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          description="Must contain uppercase, lowercase, and number"
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* Travel Preferences */}
      <div className="space-y-3">
        <label className="text-sm font-caption font-caption-medium text-foreground">
          Travel Preferences <span className="text-muted-foreground">(Optional)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {travelPreferenceOptions?.map((option) => (
            <motion.button
              key={option?.id}
              type="button"
              onClick={() => handlePreferenceChange(option?.id)}
              className={`
                p-3 rounded-lg border transition-all duration-200 text-left
                ${formData?.travelPreferences?.includes(option?.id)
                  ? 'border-accent bg-accent/10 text-accent' :'border-border hover:border-accent/50 text-muted-foreground hover:text-foreground'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <Icon 
                  name={option?.icon} 
                  size={16} 
                  className={formData?.travelPreferences?.includes(option?.id) ? 'text-accent' : 'text-current'} 
                />
                <span className="text-xs font-caption">{option?.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Terms and Newsletter */}
      <div className="space-y-3">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          name="agreeToTerms"
          checked={formData?.agreeToTerms}
          onChange={handleInputChange}
          error={errors?.agreeToTerms}
          required
          size="sm"
        />
        
        <Checkbox
          label="Subscribe to travel tips and exclusive offers"
          name="subscribeNewsletter"
          checked={formData?.subscribeNewsletter}
          onChange={handleInputChange}
          size="sm"
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        className="bg-gradient-intelligent hover:opacity-90 shadow-ai-glow"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </motion.form>
  );
};

export default RegisterForm;