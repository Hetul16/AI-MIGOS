import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyCopilot = ({ location, onSOSActivate }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState(null);

  // Mock emergency data based on location
  const emergencyContacts = {
    police: {
      number: "100",
      name: "Police Emergency",
      description: "For immediate police assistance"
    },
    medical: {
      number: "108",
      name: "Medical Emergency",
      description: "Ambulance and medical services"
    },
    fire: {
      number: "101",
      name: "Fire Department",
      description: "Fire and rescue services"
    },
    tourist: {
      number: "1363",
      name: "Tourist Helpline",
      description: "24/7 tourist assistance"
    }
  };

  const nearbyHospitals = [
    {
      name: "Apollo Hospital",
      address: "Sarita Vihar, New Delhi",
      distance: "2.3 km",
      phone: "+91-11-2692-5858",
      rating: 4.5
    },
    {
      name: "Max Super Speciality Hospital",
      address: "Saket, New Delhi",
      distance: "3.1 km",
      phone: "+91-11-2651-5050",
      rating: 4.3
    },
    {
      name: "Fortis Hospital",
      address: "Vasant Kunj, New Delhi",
      distance: "4.2 km",
      phone: "+91-11-4277-6222",
      rating: 4.4
    }
  ];

  const safetyAlerts = [
    {
      id: 1,
      type: "weather",
      severity: "medium",
      title: "Heavy Rain Alert",
      message: "Heavy rainfall expected in the evening. Avoid outdoor activities after 6 PM.",
      timestamp: new Date(Date.now() - 1800000),
      icon: "CloudRain"
    },
    {
      id: 2,
      type: "traffic",
      severity: "low",
      title: "Traffic Advisory",
      message: "Heavy traffic on NH-8 due to construction work. Use alternate routes.",
      timestamp: new Date(Date.now() - 3600000),
      icon: "AlertTriangle"
    }
  ];

  const handleSOSPress = () => {
    setIsSOSActive(true);
    onSOSActivate();
    
    // Show emergency toast
    if (window.showToast) {
      window.showToast({
        type: 'error',
        title: 'SOS Activated',
        message: 'Emergency contacts have been notified. Help is on the way!',
        persistent: true
      });
    }
  };

  const handleEmergencyCall = (contact) => {
    // In a real app, this would initiate a phone call
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Calling Emergency Services',
        message: `Connecting to ${contact?.name} (${contact?.number})...`,
        duration: 4000
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted/10 border-border/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <div className="glass glass-hover rounded-2xl p-6 border-l-4 border-l-error">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-error flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Emergency Copilot
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                24/7 safety assistance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <button
            onClick={handleSOSPress}
            disabled={isSOSActive}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-heading font-heading-bold text-xl transition-all duration-300 ${
              isSOSActive
                ? 'bg-error/50 cursor-not-allowed' :'bg-error hover:bg-error/90 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSOSActive ? (
              <div className="flex flex-col items-center">
                <Icon name="Check" size={32} />
                <span className="text-sm mt-2">ACTIVE</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Icon name="AlertTriangle" size={32} />
                <span className="text-sm mt-2">SOS</span>
              </div>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground font-caption">
          Press and hold SOS button to alert emergency contacts and local authorities
        </p>
      </div>
      {/* Emergency Contacts */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
            <Icon name="Phone" size={16} color="white" />
          </div>
          <h4 className="font-heading font-heading-semibold text-foreground">
            Emergency Contacts
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(emergencyContacts)?.map(([key, contact]) => (
            <button
              key={key}
              onClick={() => handleEmergencyCall(contact)}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-colors duration-200 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                <Icon name="Phone" size={16} className="text-error" />
              </div>
              <div className="flex-1">
                <p className="font-caption font-caption-medium text-foreground">
                  {contact?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {contact?.number}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Nearby Hospitals */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
            <Icon name="Cross" size={16} color="white" />
          </div>
          <h4 className="font-heading font-heading-semibold text-foreground">
            Nearby Hospitals
          </h4>
        </div>

        <div className="space-y-3">
          {nearbyHospitals?.map((hospital, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors duration-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-caption font-caption-medium text-foreground">
                    {hospital?.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-warning fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {hospital?.rating}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-caption">
                  {hospital?.address}
                </p>
                <p className="text-xs text-accent font-caption">
                  {hospital?.distance} away
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  onClick={() => handleEmergencyCall({ name: hospital?.name, number: hospital?.phone })}
                >
                  Call
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Navigation"
                >
                  Navigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Safety Alerts */}
      <div className="glass glass-hover rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center">
              <Icon name="Shield" size={16} color="white" />
            </div>
            <h4 className="font-heading font-heading-semibold text-foreground">
              Safety Alerts
            </h4>
          </div>
          <span className="text-xs text-muted-foreground font-caption">
            {safetyAlerts?.length} active alerts
          </span>
        </div>

        <div className="space-y-3">
          {safetyAlerts?.map((alert) => (
            <div 
              key={alert?.id}
              className={`p-4 rounded-lg border ${getSeverityColor(alert?.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <Icon name={alert?.icon} size={16} className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-caption font-caption-medium">
                      {alert?.title}
                    </h5>
                    <span className="text-xs opacity-70">
                      {alert?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 font-caption">
                    {alert?.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            iconName="Bell"
            className="w-full"
          >
            View All Safety Updates
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="glass glass-hover rounded-2xl p-6">
        <h4 className="font-heading font-heading-semibold text-foreground mb-4">
          Quick Actions
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="MapPin"
            className="justify-start"
          >
            Share Location
          </Button>
          <Button
            variant="outline"
            iconName="MessageCircle"
            className="justify-start"
          >
            Contact Group
          </Button>
          <Button
            variant="outline"
            iconName="Car"
            className="justify-start"
          >
            Book Emergency Ride
          </Button>
          <Button
            variant="outline"
            iconName="Shield"
            className="justify-start"
          >
            Safety Checklist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCopilot;