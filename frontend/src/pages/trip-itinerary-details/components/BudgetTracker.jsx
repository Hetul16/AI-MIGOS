import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetTracker = ({ budgetData, onAddExpense }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const categoryColors = {
    'Accommodation': '#6366F1',
    'Transportation': '#8B5CF6',
    'Food & Dining': '#06B6D4',
    'Activities': '#10B981',
    'Shopping': '#F59E0B',
    'Miscellaneous': '#EF4444'
  };

  const spentPercentage = (budgetData?.totalSpent / budgetData?.totalBudget) * 100;
  const remainingBudget = budgetData?.totalBudget - budgetData?.totalSpent;

  const pieData = budgetData?.categories?.map(category => ({
    name: category?.name,
    value: category?.spent,
    color: categoryColors?.[category?.name] || '#94A3B8'
  }));

  const barData = budgetData?.categories?.map(category => ({
    name: category?.name?.split(' ')?.[0],
    budgeted: category?.budget,
    spent: category?.spent,
    remaining: category?.budget - category?.spent
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass p-3 rounded-lg shadow-prominent">
          <p className="font-caption font-caption-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm font-caption" style={{ color: entry?.color }}>
              {entry?.dataKey}: ₹{entry?.value?.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
            <Icon name="PiggyBank" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-heading-semibold text-foreground">
              Budget Tracker
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              Track your travel expenses
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={onAddExpense}
        >
          Add Expense
        </Button>
      </div>
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-xl bg-muted/20">
          <p className="text-sm text-muted-foreground font-caption mb-1">Total Budget</p>
          <p className="text-xl font-heading font-heading-bold text-foreground">
            ₹{budgetData?.totalBudget?.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-warning/10">
          <p className="text-sm text-muted-foreground font-caption mb-1">Total Spent</p>
          <p className="text-xl font-heading font-heading-bold text-warning">
            ₹{budgetData?.totalSpent?.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-success/10">
          <p className="text-sm text-muted-foreground font-caption mb-1">Remaining</p>
          <p className="text-xl font-heading font-heading-bold text-success">
            ₹{remainingBudget?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-caption text-foreground">Budget Usage</span>
          <span className="text-sm font-caption text-accent">{spentPercentage?.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              spentPercentage > 90 ? 'bg-error' : spentPercentage > 75 ? 'bg-warning' : 'bg-gradient-intelligent'
            }`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
        {spentPercentage > 90 && (
          <p className="text-xs text-error font-caption mt-1">
            ⚠️ You're approaching your budget limit!
          </p>
        )}
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted/20 rounded-lg p-1">
        {['overview', 'breakdown']?.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-caption font-caption-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'overview' ? 'Overview' : 'Category Breakdown'}
          </button>
        ))}
      </div>
      {/* Chart Content */}
      {activeTab === 'overview' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload?.length) {
                    const data = payload?.[0];
                    return (
                      <div className="glass p-3 rounded-lg shadow-prominent">
                        <p className="font-caption font-caption-medium text-foreground">
                          {data?.name}
                        </p>
                        <p className="text-sm font-caption text-accent">
                          ₹{data?.value?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      {activeTab === 'breakdown' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budgeted" fill="#334155" name="Budgeted" />
              <Bar dataKey="spent" fill="#6366F1" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Category List */}
      <div className="mt-6 space-y-3">
        {budgetData?.categories?.map((category, index) => {
          const categoryPercentage = (category?.spent / category?.budget) * 100;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: categoryColors?.[category?.name] || '#94A3B8' }}
                />
                <span className="font-caption text-foreground">{category?.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-caption font-caption-medium text-foreground">
                  ₹{category?.spent?.toLocaleString('en-IN')} / ₹{category?.budget?.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {categoryPercentage?.toFixed(1)}% used
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetTracker;