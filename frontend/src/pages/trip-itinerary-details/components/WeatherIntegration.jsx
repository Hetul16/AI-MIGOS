import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeatherIntegration = ({ location, onWeatherAlert }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'hourly'

  // Mock weather data
  const weatherData = {
    current: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      uvIndex: 6,
      visibility: 10,
      pressure: 1013,
      icon: 'CloudSun'
    },
    forecast: [
      {
        date: '2025-01-03',
        day: 'Today',
        high: 32,
        low: 22,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        precipitation: 10,
        icon: 'CloudSun',
        hourly: [
          { time: '06:00', temp: 22, condition: 'Clear', icon: 'Sun', precipitation: 0 },
          { time: '09:00', temp: 26, condition: 'Partly Cloudy', icon: 'CloudSun', precipitation: 5 },
          { time: '12:00', temp: 30, condition: 'Partly Cloudy', icon: 'CloudSun', precipitation: 10 },
          { time: '15:00', temp: 32, condition: 'Cloudy', icon: 'Cloud', precipitation: 15 },
          { time: '18:00', temp: 28, condition: 'Light Rain', icon: 'CloudRain', precipitation: 60 },
          { time: '21:00', temp: 24, condition: 'Clear', icon: 'Moon', precipitation: 0 }
        ]
      },
      {
        date: '2025-01-04',
        day: 'Tomorrow',
        high: 29,
        low: 20,
        condition: 'Light Rain',
        humidity: 78,
        windSpeed: 15,
        precipitation: 70,
        icon: 'CloudRain',
        hourly: [
          { time: '06:00', temp: 20, condition: 'Cloudy', icon: 'Cloud', precipitation: 20 },
          { time: '09:00', temp: 23, condition: 'Light Rain', icon: 'CloudRain', precipitation: 70 },
          { time: '12:00', temp: 26, condition: 'Heavy Rain', icon: 'CloudRain', precipitation: 90 },
          { time: '15:00', temp: 29, condition: 'Light Rain', icon: 'CloudRain', precipitation: 60 },
          { time: '18:00', temp: 25, condition: 'Cloudy', icon: 'Cloud', precipitation: 30 },
          { time: '21:00', temp: 22, condition: 'Clear', icon: 'Moon', precipitation: 5 }
        ]
      },
      {
        date: '2025-01-05',
        day: 'Sunday',
        high: 35,
        low: 25,
        condition: 'Sunny',
        humidity: 45,
        windSpeed: 8,
        precipitation: 0,
        icon: 'Sun',
        hourly: [
          { time: '06:00', temp: 25, condition: 'Clear', icon: 'Sun', precipitation: 0 },
          { time: '09:00', temp: 29, condition: 'Sunny', icon: 'Sun', precipitation: 0 },
          { time: '12:00', temp: 33, condition: 'Sunny', icon: 'Sun', precipitation: 0 },
          { time: '15:00', temp: 35, condition: 'Sunny', icon: 'Sun', precipitation: 0 },
          { time: '18:00', temp: 31, condition: 'Clear', icon: 'Sun', precipitation: 0 },
          { time: '21:00', temp: 27, condition: 'Clear', icon: 'Moon', precipitation: 0 }
        ]
      }
    ]
  };

  const weatherAlerts = [
    {
      id: 1,
      type: 'rain',
      severity: 'medium',
      title: 'Heavy Rain Expected',
      message: 'Heavy rainfall expected tomorrow afternoon. Consider indoor activities or carry umbrellas.',
      affectedActivities: ['City Walking Tour', 'Outdoor Market Visit'],
      recommendations: ['Visit museums instead', 'Book covered transportation', 'Pack rain gear']
    }
  ];

  const activityRecommendations = {
    'Sunny': {
      recommended: ['Outdoor sightseeing', 'Beach activities', 'Hiking', 'Photography tours'],
      avoid: ['Indoor museums (unless air-conditioned)', 'Heavy outdoor activities during peak hours'],
      tips: ['Use sunscreen SPF 30+', 'Stay hydrated', 'Wear light-colored clothing']
    },
    'Light Rain': {
      recommended: ['Museums', 'Indoor attractions', 'Covered markets', 'Spa treatments'],
      avoid: ['Outdoor hiking', 'Beach activities', 'Open-air tours'],
      tips: ['Carry umbrella', 'Wear waterproof shoes', 'Book covered transportation']
    },
    'Partly Cloudy': {
      recommended: ['All outdoor activities', 'Sightseeing', 'Walking tours', 'Photography'],
      avoid: [],
      tips: ['Perfect weather for most activities', 'Light jacket for evening', 'Great for photos']
    }
  };

  const getWeatherIcon = (iconName) => {
    const iconMap = {
      'Sun': 'Sun',
      'CloudSun': 'CloudSun',
      'Cloud': 'Cloud',
      'CloudRain': 'CloudRain',
      'Moon': 'Moon'
    };
    return iconMap?.[iconName] || 'Sun';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-error';
    if (temp >= 30) return 'text-warning';
    if (temp >= 20) return 'text-success';
    return 'text-accent';
  };

  const selectedForecast = weatherData?.forecast?.[selectedDay];
  const currentRecommendations = activityRecommendations?.[selectedForecast?.condition] || activityRecommendations?.['Partly Cloudy'];

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
              <Icon name="CloudSun" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Weather Forecast
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                {location} • Updated 5 min ago
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
          >
            Refresh
          </Button>
        </div>

        {/* Current Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-intelligent/10 flex items-center justify-center">
              <Icon name={getWeatherIcon(weatherData?.current?.icon)} size={32} className="text-accent" />
            </div>
            <div>
              <p className={`text-3xl font-heading font-heading-bold ${getTemperatureColor(weatherData?.current?.temperature)}`}>
                {weatherData?.current?.temperature}°C
              </p>
              <p className="text-sm text-muted-foreground font-caption">
                {weatherData?.current?.condition}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Droplets" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Humidity</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {weatherData?.current?.humidity}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Wind" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Wind</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {weatherData?.current?.windSpeed} km/h
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Sun" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">UV Index</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {weatherData?.current?.uvIndex}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Eye" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Visibility</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {weatherData?.current?.visibility} km
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Weather Alerts */}
      {weatherAlerts?.length > 0 && (
        <div className="glass glass-hover rounded-2xl p-6 border-l-4 border-l-warning">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <h4 className="font-heading font-heading-semibold text-foreground">
              Weather Alerts
            </h4>
          </div>
          
          {weatherAlerts?.map((alert) => (
            <div key={alert?.id} className="space-y-3">
              <div>
                <h5 className="font-caption font-caption-medium text-foreground mb-1">
                  {alert?.title}
                </h5>
                <p className="text-sm text-muted-foreground font-caption">
                  {alert?.message}
                </p>
              </div>
              
              {alert?.affectedActivities?.length > 0 && (
                <div>
                  <p className="text-sm font-caption font-caption-medium text-foreground mb-2">
                    Affected Activities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {alert?.affectedActivities?.map((activity, index) => (
                      <span key={index} className="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full font-caption">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-caption font-caption-medium text-foreground mb-2">
                  Recommendations:
                </p>
                <ul className="space-y-1">
                  {alert?.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Check" size={12} className="text-success" />
                      <span className="font-caption">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Forecast */}
      <div className="glass glass-hover rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-heading-semibold text-foreground">
              3-Day Forecast
            </h4>
            <div className="flex bg-muted/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-md text-sm font-caption transition-colors duration-200 ${
                  viewMode === 'daily' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('hourly')}
                className={`px-3 py-1 rounded-md text-sm font-caption transition-colors duration-200 ${
                  viewMode === 'hourly' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Hourly
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'daily' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherData?.forecast?.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-xl text-left transition-colors duration-200 ${
                    selectedDay === index
                      ? 'bg-accent/10 border border-accent/50' :'hover:bg-muted/20 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-caption font-caption-medium text-foreground">
                      {day?.day}
                    </span>
                    <Icon name={getWeatherIcon(day?.icon)} size={24} className="text-accent" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-lg font-heading font-heading-bold ${getTemperatureColor(day?.high)}`}>
                      {day?.high}°
                    </span>
                    <span className="text-sm text-muted-foreground font-caption">
                      {day?.low}°
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-caption mb-2">
                    {day?.condition}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Droplets" size={12} />
                      <span>{day?.precipitation}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Wind" size={12} />
                      <span>{day?.windSpeed} km/h</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'hourly' && (
          <div className="p-6">
            <div className="mb-4">
              <h5 className="font-caption font-caption-medium text-foreground">
                {selectedForecast?.day} - Hourly Forecast
              </h5>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {selectedForecast?.hourly?.map((hour, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground font-caption mb-2">
                    {hour?.time}
                  </p>
                  <Icon name={getWeatherIcon(hour?.icon)} size={20} className="text-accent mx-auto mb-2" />
                  <p className={`text-sm font-caption font-caption-medium ${getTemperatureColor(hour?.temp)} mb-1`}>
                    {hour?.temp}°
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    <Icon name="Droplets" size={10} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {hour?.precipitation}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Activity Recommendations */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
            <Icon name="Compass" size={16} color="white" />
          </div>
          <h4 className="font-heading font-heading-semibold text-foreground">
            Activity Recommendations
          </h4>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-caption font-caption-medium text-success mb-2">
              Recommended Activities
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentRecommendations?.recommended?.map((activity, index) => (
                <span key={index} className="bg-success/10 text-success text-sm px-3 py-1 rounded-full font-caption">
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {currentRecommendations?.avoid?.length > 0 && (
            <div>
              <h5 className="font-caption font-caption-medium text-warning mb-2">
                Consider Avoiding
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentRecommendations?.avoid?.map((activity, index) => (
                  <span key={index} className="bg-warning/10 text-warning text-sm px-3 py-1 rounded-full font-caption">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="font-caption font-caption-medium text-foreground mb-2">
              Weather Tips
            </h5>
            <ul className="space-y-1">
              {currentRecommendations?.tips?.map((tip, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Lightbulb" size={12} className="text-accent" />
                  <span className="font-caption">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherIntegration;