import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BudgetSelector = ({ selectedBudget, onBudgetSelect, onNext, onBack, duration = 1 }) => {
  const [budgetRange, setBudgetRange] = useState(selectedBudget?.total || 50000);
  const [budgetType, setBudgetType] = useState(selectedBudget?.type || 'moderate');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const budgetTypes = [
    {
      id: 'budget',
      label: 'Budget Friendly',
      icon: 'Wallet',
      description: 'Essential experiences, local transport, budget stays',
      range: [10000, 30000],
      color: 'text-green-500'
    },
    {
      id: 'moderate',
      label: 'Moderate',
      icon: 'CreditCard',
      description: 'Comfortable stays, mix of experiences, some luxury',
      range: [30000, 80000],
      color: 'text-blue-500'
    },
    {
      id: 'luxury',
      label: 'Luxury',
      icon: 'Crown',
      description: 'Premium experiences, luxury stays, private transport',
      range: [80000, 200000],
      color: 'text-purple-500'
    }
  ];

  const getBudgetBreakdown = (total, type) => {
    const breakdowns = {
      budget: {
        accommodation: 0.35,
        food: 0.25,
        transport: 0.20,
        activities: 0.15,
        miscellaneous: 0.05
      },
      moderate: {
        accommodation: 0.40,
        food: 0.20,
        transport: 0.15,
        activities: 0.20,
        miscellaneous: 0.05
      },
      luxury: {
        accommodation: 0.45,
        food: 0.15,
        transport: 0.10,
        activities: 0.25,
        miscellaneous: 0.05
      }
    };

    const breakdown = breakdowns?.[type];
    return [
      { category: 'Accommodation', amount: Math.round(total * breakdown?.accommodation), percentage: breakdown?.accommodation * 100 },
      { category: 'Food & Dining', amount: Math.round(total * breakdown?.food), percentage: breakdown?.food * 100 },
      { category: 'Transport', amount: Math.round(total * breakdown?.transport), percentage: breakdown?.transport * 100 },
      { category: 'Activities', amount: Math.round(total * breakdown?.activities), percentage: breakdown?.activities * 100 },
      { category: 'Miscellaneous', amount: Math.round(total * breakdown?.miscellaneous), percentage: breakdown?.miscellaneous * 100 }
    ];
  };

  const pieColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const handleBudgetTypeChange = (type) => {
    setBudgetType(type);
    const selectedType = budgetTypes?.find(t => t?.id === type);
    const midRange = (selectedType?.range?.[0] + selectedType?.range?.[1]) / 2;
    setBudgetRange(midRange);
    
    onBudgetSelect({
      total: midRange,
      type: type,
      perDay: Math.round(midRange / duration),
      breakdown: getBudgetBreakdown(midRange, type)
    });
  };

  const handleBudgetRangeChange = (e) => {
    const value = parseInt(e?.target?.value);
    setBudgetRange(value);
    
    onBudgetSelect({
      total: value,
      type: budgetType,
      perDay: Math.round(value / duration),
      breakdown: getBudgetBreakdown(value, budgetType)
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const currentBreakdown = getBudgetBreakdown(budgetRange, budgetType);
  const perDayBudget = Math.round(budgetRange / duration);

  useEffect(() => {
    if (!selectedBudget) {
      handleBudgetTypeChange('moderate');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-heading-bold text-foreground mb-2">
          What's your travel budget?
        </h2>
        <p className="text-muted-foreground font-caption">
          Set your budget and see how we optimize your spending
        </p>
      </div>
      {/* Budget Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {budgetTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => handleBudgetTypeChange(type?.id)}
            className={`
              glass glass-hover rounded-xl p-4 text-left transition-all duration-200
              ${budgetType === type?.id ? 'border-accent bg-accent/10' : 'hover:border-accent/30'}
            `}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-intelligent flex items-center justify-center ${budgetType === type?.id ? 'ai-glow' : ''}`}>
                <Icon name={type?.icon} size={20} color="white" />
              </div>
              <div>
                <h3 className={`font-caption font-caption-medium ${budgetType === type?.id ? 'text-accent' : 'text-foreground'}`}>
                  {type?.label}
                </h3>
                <p className="text-xs text-muted-foreground font-caption">
                  {formatCurrency(type?.range?.[0])} - {formatCurrency(type?.range?.[1])}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-caption">
              {type?.description}
            </p>
          </button>
        ))}
      </div>
      {/* Budget Range Slider */}
      <div className="glass glass-hover rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            Total Budget
          </h3>
          <div className="text-right">
            <div className="text-2xl font-heading font-heading-bold text-accent">
              {formatCurrency(budgetRange)}
            </div>
            <div className="text-sm text-muted-foreground font-caption">
              {formatCurrency(perDayBudget)} per day
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={budgetRange}
            onChange={handleBudgetRangeChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground font-caption">
            <span>₹10K</span>
            <span>₹50K</span>
            <span>₹100K</span>
            <span>₹200K</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-200"
          >
            <Icon name="PieChart" size={16} />
            <span className="text-sm font-caption font-caption-medium">
              {showBreakdown ? 'Hide' : 'Show'} Budget Breakdown
            </span>
          </button>
          
          <div className="flex items-center space-x-2 text-success">
            <Icon name="Sparkles" size={16} />
            <span className="text-sm font-caption font-caption-medium">
              AI Optimized
            </span>
          </div>
        </div>
      </div>
      {/* Budget Breakdown */}
      {showBreakdown && (
        <div className="glass glass-hover rounded-xl p-6">
          <h3 className="text-lg font-heading font-heading-semibold text-foreground mb-6">
            Budget Breakdown
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12, fill: '#94A3B8' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                  <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {currentBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors?.[index % pieColors?.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="mt-6 space-y-3">
            {currentBreakdown?.map((item, index) => (
              <div key={item?.category} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pieColors?.[index % pieColors?.length] }}
                  />
                  <span className="font-caption font-caption-medium text-foreground">
                    {item?.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-caption font-caption-medium text-foreground">
                    {formatCurrency(item?.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground font-caption">
                    {item?.percentage?.toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* AI Recommendations */}
      <div className="glass glass-hover rounded-xl p-6 border border-accent/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-intelligent flex items-center justify-center ai-glow">
            <Icon name="Bot" size={16} color="white" />
          </div>
          <h3 className="text-lg font-heading font-heading-semibold text-foreground">
            AI Budget Recommendations
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Your budget is well-balanced for a {duration}-day trip. Consider booking accommodations early for better deals.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Based on your destination, we recommend allocating 15% more for local experiences and hidden gems.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="Calendar" size={16} className="text-accent mt-1 flex-shrink-0" />
            <p className="text-sm text-muted-foreground font-caption">
              Traveling during this season can save you up to 20% on accommodation costs.
            </p>
          </div>
        </div>
      </div>
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
          className="px-6 py-2 bg-gradient-intelligent text-white rounded-lg font-caption font-caption-medium hover:opacity-90 transition-opacity duration-200"
        >
          Continue to Preferences
        </button>
      </div>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BudgetSelector;