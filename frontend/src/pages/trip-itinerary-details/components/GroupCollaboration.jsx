import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const GroupCollaboration = ({ tripId, onVoteSubmit, onCommentAdd }) => {
  const [activeTab, setActiveTab] = useState('votes');
  const [newComment, setNewComment] = useState('');
  const [onlineMembers, setOnlineMembers] = useState([]);

  // Mock data for group collaboration
  const groupMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      role: "Trip Organizer",
      isOnline: true,
      lastSeen: null
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "Member",
      isOnline: true,
      lastSeen: null
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "Member",
      isOnline: false,
      lastSeen: "2 hours ago"
    },
    {
      id: 4,
      name: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "Member",
      isOnline: false,
      lastSeen: "1 day ago"
    }
  ];

  const activeVotes = [
    {
      id: 1,
      title: "Restaurant for Day 2 Dinner",
      description: "Choose between Italian or Indian cuisine",
      options: [
        { id: 1, text: "Olive Garden - Italian", votes: 3, voters: ["Sarah", "Mike", "Emma"] },
        { id: 2, text: "Spice Route - Indian", votes: 1, voters: ["Alex"] }
      ],
      deadline: "2025-01-05T18:00:00",
      createdBy: "Sarah Johnson",
      status: "active"
    },
    {
      id: 2,
      title: "Morning Activity - Day 3",
      description: "What should we do on our last morning?",
      options: [
        { id: 1, text: "City Walking Tour", votes: 2, voters: ["Sarah", "Emma"] },
        { id: 2, text: "Museum Visit", votes: 1, voters: ["Mike"] },
        { id: 3, text: "Shopping Mall", votes: 1, voters: ["Alex"] }
      ],
      deadline: "2025-01-04T12:00:00",
      createdBy: "Mike Chen",
      status: "active"
    }
  ];

  const recentComments = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      message: "I\'ve updated the hotel booking confirmation. Check your emails!",
      timestamp: new Date(Date.now() - 300000),
      type: "update"
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      message: "The weather forecast looks great for our hiking day. Should we pack light jackets just in case?",
      timestamp: new Date(Date.now() - 900000),
      type: "question"
    },
    {
      id: 3,
      user: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      message: "I found a great local restaurant near our hotel. Added it to the suggestions!",
      timestamp: new Date(Date.now() - 1800000),
      type: "suggestion"
    }
  ];

  useEffect(() => {
    // Simulate WebSocket connection for real-time updates
    const interval = setInterval(() => {
      setOnlineMembers(groupMembers?.filter(member => member?.isOnline));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = (voteId, optionId) => {
    onVoteSubmit(voteId, optionId);
    // Show success toast
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Vote Submitted',
        message: 'Your vote has been recorded successfully!',
        duration: 3000
      });
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment?.trim()) return;
    
    onCommentAdd({
      message: newComment,
      timestamp: new Date(),
      user: "You"
    });
    setNewComment('');
    
    // Show success toast
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Comment Added',
        message: 'Your comment has been shared with the group!',
        duration: 3000
      });
    }
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-intelligent flex items-center justify-center">
              <Icon name="Users" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-heading-semibold text-foreground">
                Group Collaboration
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                {onlineMembers?.length} of {groupMembers?.length} members online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onlineMembers?.slice(0, 3)?.map((member) => (
              <div key={member?.id} className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-success">
                  <Image 
                    src={member?.avatar} 
                    alt={member?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
              </div>
            ))}
            {onlineMembers?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-caption text-muted-foreground">
                  +{onlineMembers?.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border/50">
        {[
          { id: 'votes', label: 'Active Votes', icon: 'Vote', count: activeVotes?.length },
          { id: 'chat', label: 'Group Chat', icon: 'MessageCircle', count: recentComments?.length },
          { id: 'members', label: 'Members', icon: 'Users', count: groupMembers?.length }
        ]?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors duration-200 ${
              activeTab === tab?.id
                ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="font-caption font-caption-medium">{tab?.label}</span>
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="p-6">
        {activeTab === 'votes' && (
          <div className="space-y-6">
            {activeVotes?.map((vote) => (
              <div key={vote?.id} className="border border-border/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-caption font-caption-medium text-foreground mb-1">
                      {vote?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-caption mb-2">
                      {vote?.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>By {vote?.createdBy}</span>
                      <span className="text-warning">{getTimeRemaining(vote?.deadline)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {vote?.options?.map((option) => {
                    const totalVotes = vote?.options?.reduce((sum, opt) => sum + opt?.votes, 0);
                    const percentage = totalVotes > 0 ? (option?.votes / totalVotes) * 100 : 0;
                    
                    return (
                      <div key={option?.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleVote(vote?.id, option?.id)}
                            className="flex-1 text-left p-3 rounded-lg border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-caption text-foreground">{option?.text}</span>
                              <span className="text-sm text-muted-foreground">
                                {option?.votes} votes
                              </span>
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            {percentage?.toFixed(0)}%
                          </span>
                        </div>
                        {option?.voters?.length > 0 && (
                          <p className="text-xs text-muted-foreground font-caption">
                            Voted by: {option?.voters?.join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            {/* Messages */}
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentComments?.map((comment) => (
                <div key={comment?.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={comment?.avatar} 
                      alt={comment?.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-caption font-caption-medium text-foreground">
                        {comment?.user}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        comment?.type === 'update' ? 'bg-success/10 text-success' :
                        comment?.type === 'question'? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                      }`}>
                        {comment?.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-caption">
                      {comment?.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-end space-x-2 pt-4 border-t border-border/50">
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e?.target?.value)}
                  placeholder="Share an update with your group..."
                  className="w-full p-3 bg-input border border-border rounded-xl text-sm font-caption resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors duration-200"
                  rows={2}
                />
              </div>
              <Button
                variant="default"
                size="sm"
                iconName="Send"
                onClick={handleCommentSubmit}
                disabled={!newComment?.trim()}
                className="bg-gradient-intelligent"
              >
                Send
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            {groupMembers?.map((member) => (
              <div key={member?.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={member?.avatar} 
                        alt={member?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {member?.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-caption font-caption-medium text-foreground">
                      {member?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member?.role}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {member?.isOnline ? (
                    <span className="text-xs text-success font-caption">Online</span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-caption">
                      Last seen {member?.lastSeen}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCollaboration;