import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    email: 'demo@travelai.com',
    password: 'TravelAI123'
  };

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      if (formData?.email === mockCredentials?.email && formData?.password === mockCredentials?.password) {
        // Success - redirect to dashboard
        navigate('/trip-planning-wizard');
      } else {
        setErrors({
          submit: 'Invalid email or password. Use demo@travelai.com / TravelAI123'
        });
      }
      setIsLoading(false);
    }, 1500);
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
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          size="sm"
        />
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-accent hover:text-accent/80 font-caption transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>
      {errors?.submit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-2"
        >
          <Icon name="AlertCircle" size={16} className="text-error" />
          <p className="text-sm text-error font-caption">{errors?.submit}</p>
        </motion.div>
      )}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        className="bg-gradient-intelligent hover:opacity-90 shadow-ai-glow"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Demo credentials hint */}
      <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
        <p className="text-xs text-accent font-caption font-caption-medium mb-1">Demo Credentials:</p>
        <p className="text-xs text-muted-foreground font-mono">
          Email: {mockCredentials?.email}<br />
          Password: {mockCredentials?.password}
        </p>
      </div>
    </motion.form>
  );
};

export default LoginForm;