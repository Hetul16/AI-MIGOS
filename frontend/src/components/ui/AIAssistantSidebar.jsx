import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AIAssistantSidebar = ({ isOpen = false, onToggle, contextData = null }) => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hi! I\'m your AI travel assistant. I can help you plan trips, find hidden gems, and answer travel questions. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(inputValue, contextData),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput, context) => {
    const responses = [
      "I'd be happy to help you with that! Based on your current planning context, I can suggest some great options.",
      "That\'s a fantastic question! Let me provide you with some personalized recommendations.",
      "I can definitely assist with that. Here are some AI-powered suggestions tailored to your preferences.",
      "Great choice! I\'ve analyzed similar trips and found some excellent alternatives you might love.",
      "Based on your travel history and preferences, I have some exciting recommendations for you."
    ];
    return responses?.[Math.floor(Math.random() * responses?.length)];
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Find flights', icon: 'Plane', action: () => setInputValue('Help me find flights') },
    { label: 'Hotel suggestions', icon: 'Building', action: () => setInputValue('Suggest hotels') },
    { label: 'Local attractions', icon: 'MapPin', action: () => setInputValue('Show local attractions') },
    { label: 'Weather info', icon: 'Cloud', action: () => setInputValue('What\'s the weather like?') }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-70"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          fixed right-0 top-0 h-full w-80 glass border-l border-border/50 z-80
          transform transition-transform duration-300 ease-spring
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:w-96
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center ai-glow">
              <Icon name="Bot" size={16} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-heading-semibold text-foreground">AI Assistant</h3>
              <p className="text-xs text-muted-foreground font-caption">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onToggle}
            className=""
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-200px)]">
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-xl font-caption text-sm
                  ${message?.type === 'user' ?'bg-primary text-primary-foreground ml-4' :'bg-muted text-muted-foreground mr-4'
                  }
                `}
              >
                <p>{message?.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground p-3 rounded-xl mr-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-caption mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions?.map((action) => (
              <button
                key={action?.label}
                onClick={action?.action}
                className="flex items-center space-x-2 p-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200"
              >
                <Icon name={action?.icon} size={14} />
                <span className="font-caption">{action?.label}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e?.target?.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your trip..."
                className="w-full p-3 bg-input border border-border rounded-xl text-sm font-caption resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors duration-200"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '100px' }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Mic"
                onClick={handleVoiceToggle}
                className={`
                  ${isListening ? 'text-accent bg-accent/10 ai-glow' : 'text-muted-foreground hover:text-foreground'}
                `}
              />
              <Button
                variant="default"
                size="sm"
                iconName="Send"
                onClick={handleSendMessage}
                disabled={!inputValue?.trim()}
                className="bg-gradient-intelligent hover:opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Toggle Button (Mobile) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-intelligent rounded-full shadow-prominent ai-glow flex items-center justify-center z-70 interactive-scale"
        >
          <Icon name="MessageCircle" size={24} color="white" />
        </button>
      )}
    </>
  );
};

export default AIAssistantSidebar;