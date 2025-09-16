import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SubmitGemModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: '',
    bestTime: '',
    tags: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed' },
    { id: 'culture', label: 'Culture & Arts', icon: 'Landmark' },
    { id: 'nature', label: 'Nature & Parks', icon: 'Trees' },
    { id: 'nightlife', label: 'Nightlife', icon: 'Music' },
    { id: 'adventure', label: 'Adventure', icon: 'Mountain' },
    { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' }
  ];

  const difficulties = ['Easy', 'Moderate', 'Hard'];
  const bestTimes = ['Morning', 'Afternoon', 'Evening', 'Night', 'Anytime'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files)?.slice(0, 5); // Limit to 5 images
    setFormData(prev => ({ ...prev, images: [...prev?.images, ...fileArray] }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        difficulty: '',
        bestTime: '',
        tags: '',
        images: []
      });
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] glass rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-xl font-heading font-heading-bold text-foreground">
              Submit a Hidden Gem
            </h2>
            <p className="text-sm text-muted-foreground font-caption mt-1">
              Share your discovery with the community
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-heading font-heading-semibold text-foreground">
              Basic Information
            </h3>
            
            <Input
              label="Gem Name"
              type="text"
              placeholder="What's this place called?"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              required
            />

            <div>
              <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                placeholder="Tell us what makes this place special..."
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                rows={4}
                className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h3 className="font-heading font-heading-semibold text-foreground">
              Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories?.map((category) => (
                <button
                  key={category?.id}
                  type="button"
                  onClick={() => handleInputChange('category', category?.id)}
                  className={`
                    flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200
                    ${formData?.category === category?.id
                      ? 'border-accent bg-accent/10 text-accent' :'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }
                  `}
                >
                  <Icon name={category?.icon} size={16} />
                  <span className="text-sm font-caption font-caption-medium">
                    {category?.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                Difficulty Level
              </label>
              <select
                value={formData?.difficulty}
                onChange={(e) => handleInputChange('difficulty', e?.target?.value)}
                className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                required
              >
                <option value="">Select difficulty</option>
                {difficulties?.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-caption font-caption-medium text-foreground mb-2">
                Best Time to Visit
              </label>
              <select
                value={formData?.bestTime}
                onChange={(e) => handleInputChange('bestTime', e?.target?.value)}
                className="w-full p-3 bg-input border border-border rounded-lg text-sm font-caption text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                required
              >
                <option value="">Select best time</option>
                {bestTimes?.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <Input
            label="Tags"
            type="text"
            placeholder="romantic, sunset, photography, peaceful (comma separated)"
            value={formData?.tags}
            onChange={(e) => handleInputChange('tags', e?.target?.value)}
            description="Add relevant tags to help others discover this gem"
          />

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="font-heading font-heading-semibold text-foreground">
              Photos
            </h3>
            
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                ${dragActive 
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e?.target?.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <Icon name="Upload" size={24} className="text-accent" />
                </div>
                <div>
                  <p className="font-caption font-caption-medium text-foreground">
                    Drop your photos here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground font-caption">
                    PNG, JPG up to 10MB each (max 5 photos)
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {formData?.images?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData?.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-border/50 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-caption">
              Your submission will be reviewed before publishing
            </p>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!formData?.name || !formData?.description || !formData?.category}
                className="bg-gradient-intelligent"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Gem'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitGemModal;