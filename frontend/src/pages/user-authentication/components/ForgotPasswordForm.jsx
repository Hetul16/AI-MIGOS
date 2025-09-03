import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import authService from '../../../services/authService';

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.resetPassword(email);

      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="Mail" size={24} className="text-success" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            Check Your Email
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            We've sent a password reset link to <br />
            <span className="text-foreground font-caption-medium">{email}</span>
          </p>
          <p className="text-xs text-muted-foreground font-caption">
            Check your spam folder if you don't see the email
          </p>
        </div>
        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onBack}
            className="bg-gradient-intelligent hover:opacity-90"
          >
            Back to Sign In
          </Button>

          <button
            onClick={() => setIsSuccess(false)}
            className="text-sm text-accent hover:text-accent/80 font-caption transition-colors duration-200"
          >
            Didn't receive email? Try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-heading font-heading-semibold text-foreground">
          Reset Your Password
        </h3>
        <p className="text-sm text-muted-foreground font-caption">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e?.target?.value);
            setError('');
          }}
          error={error}
          required
        />

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            className="bg-gradient-intelligent hover:opacity-90"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="default"
            fullWidth
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;
