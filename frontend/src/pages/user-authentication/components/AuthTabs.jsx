import React from 'react';
import { motion } from 'framer-motion';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Sign In' },
    { id: 'register', label: 'Create Account' }
  ];

  return (
    <div className="relative mb-8">
      <div className="flex bg-muted/30 rounded-xl p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`
              relative flex-1 py-3 px-6 text-sm font-caption font-caption-medium rounded-lg
              transition-colors duration-200 z-10
              ${activeTab === tab?.id 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      <motion.div
        className="absolute top-1 left-1 right-1 bottom-1 bg-gradient-intelligent rounded-lg shadow-ai-glow"
        initial={false}
        animate={{
          x: activeTab === 'login' ? 0 : '100%'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        style={{
          width: 'calc(50% - 4px)'
        }}
      />
    </div>
  );
};

export default AuthTabs;