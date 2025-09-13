import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import tripService from '../../../services/tripService';

const WeatherIntegration = ({ tripId, location, onWeatherAlert }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'hourly'
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch weather data
  const fetchWeatherData = async () => {
    if (!tripId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripService.getTripWeather(tripId);
      if (response.success && response.weather) {
        setWeatherData(response.weather);
        setLastUpdated(new Date());
        
        // Check for weather alerts
        if (response.weather.daily) {
          const alerts = generateWeatherAlerts(response.weather.daily);
          if (alerts.length > 0 && onWeatherAlert) {
            onWeatherAlert(alerts);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate weather alerts based on forecast data
  const generateWeatherAlerts = (dailyForecast) => {
    const alerts = [];
    
    dailyForecast.forEach((day, index) => {
      const temp = day.temp;
      const precipitation = day.pop || 0;
      const weather = day.weather?.[0];
      
      // High temperature alert
      if (temp?.max > 35) {
        alerts.push({
          id: `temp_${index}`,
          type: 'temperature',
          severity: 'high',
          title: 'High Temperature Warning',
          message: `Temperature expected to reach ${Math.round(temp.max)}°C. Stay hydrated and avoid outdoor activities during peak hours.`,
          affectedActivities: ['Outdoor sightseeing', 'Walking tours', 'Beach activities'],
          recommendations: ['Stay hydrated', 'Use sunscreen', 'Plan indoor activities', 'Wear light clothing']
        });
      }
      
      // Heavy rain alert
      if (precipitation > 70) {
        alerts.push({
          id: `rain_${index}`,
          type: 'rain',
          severity: 'high',
          title: 'Heavy Rain Expected',
          message: `Heavy rainfall expected (${Math.round(precipitation)}% chance). Consider indoor activities or carry umbrellas.`,
          affectedActivities: ['Outdoor tours', 'Walking activities', 'Beach visits'],
          recommendations: ['Visit museums', 'Book covered transportation', 'Pack rain gear', 'Plan indoor activities']
        });
      }
      
      // Moderate rain alert
      if (precipitation > 40 && precipitation <= 70) {
        alerts.push({
          id: `moderate_rain_${index}`,
          type: 'rain',
          severity: 'medium',
          title: 'Rain Expected',
          message: `Rain expected (${Math.round(precipitation)}% chance). Consider carrying umbrellas.`,
          affectedActivities: ['Outdoor activities'],
          recommendations: ['Carry umbrella', 'Wear waterproof shoes', 'Have backup indoor plans']
        });
      }
    });
    
    return alerts;
  };

  // Process weather data from API
  const processWeatherData = (apiData) => {
    if (!apiData || !apiData.daily) return null;
    
    const daily = apiData.daily.map((day, index) => {
      const weather = day.weather?.[0];
      const temp = day.temp;
      
      return {
        date: day.dt,
        day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Date(day.dt).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(temp?.max || temp?.day || 0),
        low: Math.round(temp?.min || temp?.night || 0),
        condition: weather?.main || 'Unknown',
        description: weather?.description || '',
        humidity: Math.round((day.humidity || 0) * 100),
        windSpeed: Math.round(day.wind_speed || 0),
        precipitation: Math.round((day.pop || 0) * 100),
        icon: getWeatherIconFromCondition(weather?.main),
        hourly: generateHourlyForecast(day, index)
      };
    });
    
    return {
      current: {
        temperature: Math.round(daily[0]?.high || 0),
        condition: daily[0]?.condition || 'Unknown',
        humidity: daily[0]?.humidity || 0,
        windSpeed: daily[0]?.windSpeed || 0,
        uvIndex: Math.round(apiData.current?.uvi || 0),
        visibility: Math.round((apiData.current?.visibility || 0) / 1000),
        pressure: Math.round(apiData.current?.pressure || 0),
        icon: daily[0]?.icon || 'Sun'
      },
      forecast: daily
    };
  };

  // Generate hourly forecast (mock data for now)
  const generateHourlyForecast = (day, dayIndex) => {
    const hours = [6, 9, 12, 15, 18, 21];
    const baseTemp = day.temp?.day || 25;
    const condition = day.weather?.[0]?.main || 'Clear';
    
    return hours.map(hour => ({
      time: `${hour.toString().padStart(2, '0')}:00`,
      temp: Math.round(baseTemp + (Math.random() - 0.5) * 4),
      condition: condition,
      icon: getWeatherIconFromCondition(condition),
      precipitation: Math.round((day.pop || 0) * 100)
    }));
  };

  // Map weather conditions to icons
  const getWeatherIconFromCondition = (condition) => {
    const iconMap = {
      'Clear': 'Sun',
      'Sunny': 'Sun',
      'Clouds': 'Cloud',
      'Cloudy': 'Cloud',
      'Partly Cloudy': 'CloudSun',
      'Rain': 'CloudRain',
      'Drizzle': 'CloudRain',
      'Thunderstorm': 'CloudRain',
      'Snow': 'CloudSnow',
      'Mist': 'Cloud',
      'Fog': 'Cloud',
      'Haze': 'Cloud'
    };
    return iconMap[condition] || 'Sun';
  };

  useEffect(() => {
    fetchWeatherData();
  }, [tripId]);

  // Process weather data when it's loaded
  const processedWeatherData = weatherData ? processWeatherData(weatherData) : null;

  // Generate weather alerts from processed data
  const weatherAlerts = processedWeatherData ? generateWeatherAlerts(processedWeatherData.forecast) : [];

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

  const selectedForecast = processedWeatherData?.forecast?.[selectedDay];
  const currentRecommendations = activityRecommendations?.[selectedForecast?.condition] || activityRecommendations?.['Partly Cloudy'];

  // Show loading state
  if (loading && !processedWeatherData) {
    return (
      <div className="space-y-6">
        <div className="glass glass-hover rounded-2xl p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground font-caption">Loading weather data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !processedWeatherData) {
    return (
      <div className="space-y-6">
        <div className="glass glass-hover rounded-2xl p-6 border-l-4 border-l-error">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <h4 className="font-heading font-heading-semibold text-foreground">
              Weather Data Unavailable
            </h4>
          </div>
          <p className="text-muted-foreground font-caption mb-4">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={fetchWeatherData}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!processedWeatherData) {
    return (
      <div className="space-y-6">
        <div className="glass glass-hover rounded-2xl p-6">
          <div className="text-center py-12">
            <Icon name="CloudSun" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading font-heading-semibold text-foreground mb-2">
              No Weather Data
            </h3>
            <p className="text-muted-foreground font-caption mb-4">
              Weather information is not available for this trip.
            </p>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              onClick={fetchWeatherData}
            >
              Load Weather
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                {location} • {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={fetchWeatherData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Current Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-intelligent/10 flex items-center justify-center">
              <Icon name={getWeatherIcon(processedWeatherData?.current?.icon)} size={32} className="text-accent" />
            </div>
            <div>
              <p className={`text-3xl font-heading font-heading-bold ${getTemperatureColor(processedWeatherData?.current?.temperature)}`}>
                {processedWeatherData?.current?.temperature}°C
              </p>
              <p className="text-sm text-muted-foreground font-caption">
                {processedWeatherData?.current?.condition}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Droplets" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Humidity</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {processedWeatherData?.current?.humidity}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Wind" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Wind</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {processedWeatherData?.current?.windSpeed} km/h
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Sun" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">UV Index</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {processedWeatherData?.current?.uvIndex}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20">
              <Icon name="Eye" size={16} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-muted-foreground font-caption">Visibility</p>
              <p className="text-sm font-caption font-caption-medium text-foreground">
                {processedWeatherData?.current?.visibility} km
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
              {processedWeatherData?.forecast?.map((day, index) => (
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