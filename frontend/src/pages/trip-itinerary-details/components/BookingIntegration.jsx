import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import tripService from '../../../services/tripService';

const BookingIntegration = ({ activity, tripId, onBookingComplete, onBookingCancel }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const [bookingStep, setBookingStep] = useState('details'); // 'details' | 'payment' | 'confirmation'
  const [bookingDetails, setBookingDetails] = useState({
    guests: 2,
    date: '2025-01-03',
    time: '10:00',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState(null);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'UPI, Cards, Net Banking',
      icon: 'CreditCard',
      fee: 0,
      popular: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'International Cards',
      icon: 'Globe',
      fee: 2.9,
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'Paytm, PhonePe, GPay',
      icon: 'Wallet',
      fee: 0,
      popular: false
    }
  ];

  const bookingOptions = [
    {
      type: 'standard',
      name: 'Standard Booking',
      price: activity?.cost,
      features: ['Basic access', 'Standard support', 'Email confirmation'],
      recommended: false
    },
    {
      type: 'premium',
      name: 'Premium Experience',
      price: activity?.cost * 1.3,
      features: ['Priority access', '24/7 support', 'Instant confirmation', 'Free cancellation'],
      recommended: true
    },
    {
      type: 'group',
      name: 'Group Package',
      price: activity?.cost * 0.8,
      features: ['Group discount', 'Dedicated guide', 'Group photos', 'Flexible timing'],
      recommended: false
    }
  ];

  const [selectedOption, setSelectedOption] = useState('premium');

  const handleBookingSubmit = async () => {
    if (bookingStep === 'details') {
      setBookingStep('payment');
    } else if (bookingStep === 'payment') {
      if (!tripId || !activity?.id) {
        console.error('Missing tripId or activity ID');
        return;
      }

      setLoading(true);
      try {
        // Create reservation item
        const reservationItem = tripService.createReservationItem(
          activity.type || 'activity',
          activity.id,
          activity.cost || activity.price || 0,
          'INR'
        );

        // Create reservation
        const response = await tripService.reserveItems(
          tripId,
          [reservationItem],
          30, // 30 minutes hold
          `booking_${activity.id}_${Date.now()}`
        );

        if (response.success) {
          setReservation(response);
          setBookingStep('confirmation');
          
          // Complete booking after a short delay
          setTimeout(() => {
            onBookingComplete({
              ...activity,
              bookingId: response.reservation_id,
              status: 'booked',
              paymentMethod: selectedPaymentMethod,
              bookingDetails,
              selectedOption,
              totalAmount: response.total_amount,
              expiresAt: response.expires_at
            });
            
            if (window.showToast) {
              window.showToast({
                type: 'success',
                title: 'Booking Confirmed!',
                message: 'Your booking has been confirmed. Check your email for details.',
                duration: 5000
              });
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Booking error:', err);
        if (window.showToast) {
          window.showToast({
            type: 'error',
            title: 'Booking Failed',
            message: err.message || 'Failed to create reservation. Please try again.',
            duration: 5000
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateTotal = () => {
    const selectedBookingOption = bookingOptions?.find(opt => opt?.type === selectedOption);
    const basePrice = selectedBookingOption?.price * bookingDetails?.guests;
    const paymentFee = paymentMethods?.find(pm => pm?.id === selectedPaymentMethod)?.fee || 0;
    const feeAmount = (basePrice * paymentFee) / 100;
    const taxes = basePrice * 0.18; // 18% GST
    return {
      basePrice,
      feeAmount,
      taxes,
      total: basePrice + feeAmount + taxes
    };
  };

  const pricing = calculateTotal();

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
              <Icon name="CreditCard" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Book {activity?.title}
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                Secure booking with instant confirmation
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onBookingCancel}
          />
        </div>
      </div>
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {['details', 'payment', 'confirmation']?.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-caption font-caption-medium ${
                bookingStep === step
                  ? 'bg-accent text-white'
                  : index < ['details', 'payment', 'confirmation']?.indexOf(bookingStep)
                  ? 'bg-success text-white' :'bg-muted text-muted-foreground'
              }`}>
                {index < ['details', 'payment', 'confirmation']?.indexOf(bookingStep) ? (
                  <Icon name="Check" size={16} />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < ['details', 'payment', 'confirmation']?.indexOf(bookingStep)
                    ? 'bg-success' :'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        {bookingStep === 'details' && (
          <div className="space-y-6">
            {/* Activity Preview */}
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-muted/20">
              {activity?.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={activity?.image} 
                    alt={activity?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-caption font-caption-medium text-foreground mb-1">
                  {activity?.title}
                </h4>
                <p className="text-sm text-muted-foreground font-caption mb-2">
                  {activity?.description}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{activity?.time}</span>
                  <span>{activity?.duration}</span>
                  <span>{activity?.location}</span>
                </div>
              </div>
            </div>

            {/* Booking Options */}
            <div>
              <h5 className="font-caption font-caption-medium text-foreground mb-3">
                Choose Your Experience
              </h5>
              <div className="space-y-3">
                {bookingOptions?.map((option) => (
                  <div
                    key={option?.type}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors duration-200 ${
                      selectedOption === option?.type
                        ? 'border-accent bg-accent/5' :'border-border/50 hover:border-accent/50'
                    }`}
                    onClick={() => setSelectedOption(option?.type)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h6 className="font-caption font-caption-medium text-foreground">
                            {option?.name}
                          </h6>
                          {option?.recommended && (
                            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {option?.features?.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Icon name="Check" size={12} className="text-success" />
                              <span className="font-caption">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-heading font-heading-bold text-foreground">
                          ₹{option?.price?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">per person</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                  Number of Guests
                </label>
                <select
                  value={bookingDetails?.guests}
                  onChange={(e) => setBookingDetails({...bookingDetails, guests: parseInt(e?.target?.value)})}
                  className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  {[1,2,3,4,5,6,7,8]?.map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDetails?.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e?.target?.value})}
                  className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={bookingDetails?.specialRequests}
                onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e?.target?.value})}
                placeholder="Any special requirements or requests..."
                className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                rows={3}
              />
            </div>
          </div>
        )}

        {bookingStep === 'payment' && (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div>
              <h5 className="font-caption font-caption-medium text-foreground mb-3">
                Choose Payment Method
              </h5>
              <div className="space-y-3">
                {paymentMethods?.map((method) => (
                  <div
                    key={method?.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors duration-200 ${
                      selectedPaymentMethod === method?.id
                        ? 'border-accent bg-accent/5' :'border-border/50 hover:border-accent/50'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method?.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Icon name={method?.icon} size={16} className="text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-caption font-caption-medium text-foreground">
                              {method?.name}
                            </span>
                            {method?.popular && (
                              <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-caption">
                            {method?.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {method?.fee > 0 ? (
                          <span className="text-sm text-warning font-caption">
                            +{method?.fee}% fee
                          </span>
                        ) : (
                          <span className="text-sm text-success font-caption">
                            No fee
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-xl bg-muted/20">
              <h5 className="font-caption font-caption-medium text-foreground mb-3">
                Price Breakdown
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">
                    {selectedOption} × {bookingDetails?.guests} guests
                  </span>
                  <span className="text-foreground font-caption">
                    ₹{pricing?.basePrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                {pricing?.feeAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-caption">
                      Payment processing fee
                    </span>
                    <span className="text-foreground font-caption">
                      ₹{pricing?.feeAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-caption">
                    Taxes & fees (18% GST)
                  </span>
                  <span className="text-foreground font-caption">
                    ₹{pricing?.taxes?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-caption font-caption-medium text-foreground">
                      Total Amount
                    </span>
                    <span className="text-lg font-heading font-heading-bold text-foreground">
                      ₹{pricing?.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {bookingStep === 'confirmation' && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Icon name="Check" size={32} className="text-success" />
            </div>
            <div>
              <h4 className="text-xl font-heading font-heading-bold text-foreground mb-2">
                Booking Confirmed!
              </h4>
              <p className="text-muted-foreground font-caption">
                Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/20 text-left">
              <h5 className="font-caption font-caption-medium text-foreground mb-2">
                Booking Details
              </h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-caption">Booking ID:</span>
                  <span className="text-foreground font-mono">BK{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-caption">Date:</span>
                  <span className="text-foreground font-caption">{bookingDetails?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-caption">Guests:</span>
                  <span className="text-foreground font-caption">{bookingDetails?.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-caption">Total Paid:</span>
                  <span className="text-foreground font-caption font-caption-medium">
                    ₹{pricing?.total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border/50">
        <div className="flex items-center justify-between">
          {bookingStep !== 'confirmation' && (
            <Button
              variant="outline"
              onClick={onBookingCancel}
            >
              Cancel
            </Button>
          )}
          
          {bookingStep === 'details' && (
            <Button
              variant="default"
              onClick={handleBookingSubmit}
              className="bg-gradient-intelligent"
            >
              Continue to Payment
            </Button>
          )}
          
          {bookingStep === 'payment' && (
            <Button
              variant="default"
              onClick={handleBookingSubmit}
              className="bg-gradient-intelligent"
              iconName="CreditCard"
            >
              Pay ₹{pricing?.total?.toLocaleString('en-IN')}
            </Button>
          )}
          
          {bookingStep === 'confirmation' && (
            <Button
              variant="default"
              onClick={onBookingCancel}
              className="bg-gradient-intelligent w-full"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingIntegration;