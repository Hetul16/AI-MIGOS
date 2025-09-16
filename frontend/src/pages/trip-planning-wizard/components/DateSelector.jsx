import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const DateSelector = ({ selectedDates, onDatesSelect, onNext, onBack }) => {
  const [startDate, setStartDate] = useState(selectedDates?.startDate || '');
  const [endDate, setEndDate] = useState(selectedDates?.endDate || '');
  const [duration, setDuration] = useState(selectedDates?.duration || 0);

  const seasonalInsights = {
    winter: {
      months: ['December', 'January', 'February'],
      icon: 'Snowflake',
      color: 'text-blue-400',
      tips: ['Perfect for hill stations', 'Great weather in South India', 'Festival season']
    },
    spring: {
      months: ['March', 'April', 'May'],
      icon: 'Flower',
      color: 'text-green-400',
      tips: ['Ideal for North India', 'Pleasant weather', 'Pre-monsoon freshness']
    },
    monsoon: {
      months: ['June', 'July', 'August', 'September'],
      icon: 'CloudRain',
      color: 'text-blue-500',
      tips: ['Lush green landscapes', 'Waterfalls at peak', 'Indoor activities recommended']
    },
    autumn: {
      months: ['October', 'November'],
      icon: 'Leaf',
      color: 'text-orange-400',
      tips: ['Post-monsoon clarity', 'Perfect for trekking', 'Clear mountain views']
    }
  };

  const getCurrentSeason = (date) => {
    if (!date) return null;
    const month = new Date(date)?.getMonth();
    if (month >= 11 || month <= 1) return seasonalInsights?.winter;
    if (month >= 2 && month <= 4) return seasonalInsights?.spring;
    if (month >= 5 && month <= 8) return seasonalInsights?.monsoon;
    return seasonalInsights?.autumn;
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e?.target?.value;
    setStartDate(newStartDate);
    
    if (newStartDate && endDate) {
      const newDuration = calculateDuration(newStartDate, endDate);
      setDuration(newDuration);
      onDatesSelect({
        startDate: newStartDate,
        endDate: endDate,
        duration: newDuration
      });
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e?.target?.value;
    setEndDate(newEndDate);
    
    if (startDate && newEndDate) {
      const newDuration = calculateDuration(startDate, newEndDate);
      setDuration(newDuration);
      onDatesSelect({
        startDate: startDate,
        endDate: newEndDate,
        duration: newDuration
      });
    }
  };

  const quickDateOptions = [
    { label: 'This Weekend', days: 2 },
    { label: 'Long Weekend', days: 3 },
    { label: 'One Week', days: 7 },
    { label: 'Two Weeks', days: 14 }
  ];

  const handleQuickDate = (days) => {
    const today = new Date();
    const start = new Date(today);
    start?.setDate(today?.getDate() + 1);
    const end = new Date(start);
    end?.setDate(start?.getDate() + days - 1);

    const startDateStr = start?.toISOString()?.split('T')?.[0];
    const endDateStr = end?.toISOString()?.split('T')?.[0];

    setStartDate(startDateStr);
    setEndDate(endDateStr);
    setDuration(days);
    
    onDatesSelect({
      startDate: startDateStr,
      endDate: endDateStr,
      duration: days
    });
  };

  const currentSeason = getCurrentSeason(startDate);
  const minDate = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          When are you planning to travel?
        </h2>
        <p className="text-muted-foreground font-caption">
          Select your travel dates and get seasonal insights
        </p>
      </div>
      {/* Quick Date Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {quickDateOptions?.map((option) => (
          <button
            key={option?.label}
            onClick={() => handleQuickDate(option?.days)}
            className="glass glass-hover rounded-lg p-3 text-center hover:border-accent/30 transition-all duration-200"
          >
            <div className="text-sm font-caption font-caption-medium text-foreground mb-1">
              {option?.label}
            </div>
            <div className="text-xs text-muted-foreground font-caption">
              {option?.days} days
            </div>
          </button>
        ))}
      </div>
      {/* Date Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="date"
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          min={minDate}
          required
        />
        <Input
          type="date"
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate || minDate}
          required
        />
      </div>
      {/* Duration Display */}
      {duration > 0 && (
        <div className="glass glass-hover rounded-xl p-4 border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-intelligent flex items-center justify-center">
                <Icon name="Calendar" size={20} color="white" />
              </div>
              <div>
                <h3 className="font-caption font-caption-medium text-foreground">
                  Trip Duration
                </h3>
                <p className="text-sm text-muted-foreground font-caption">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-heading font-heading-semibold text-accent">
                {duration}
              </div>
              <div className="text-xs text-muted-foreground font-caption">
                {duration === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Seasonal Insights */}
      {currentSeason && (
        <div className="glass glass-hover rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name={currentSeason?.icon} size={24} className={currentSeason?.color} />
            <h3 className="text-lg font-heading font-heading-semibold text-foreground">
              Seasonal Travel Insights
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSeason?.tips?.map((tip, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success flex-shrink-0" />
                <span className="text-sm text-muted-foreground font-caption">{tip}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Lightbulb" size={16} className="text-accent" />
              <span className="text-sm text-accent font-caption font-caption-medium">
                AI Tip: Based on your selected dates, this is an excellent time to visit your chosen destination!
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Icon name="ChevronLeft" size={16} />
          <span className="font-caption font-caption-medium">Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!startDate || !endDate}
          className={`
            px-6 py-2 rounded-lg font-caption font-caption-medium transition-all duration-200
            ${startDate && endDate
              ? 'bg-gradient-intelligent text-white hover:opacity-90' :'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          Continue to Budget
        </button>
      </div>
    </div>
  );
};

export default DateSelector;