import React from 'react';
import FeatureCard from './FeatureCard';
import { Type, Image, Video, Music, FileText } from 'lucide-react';

const features = [
  {
    title: 'Text Editor',
    description: 'Rich text editing with formatting, fonts, and styling options.',
    icon: Type,
    features: [
      'Bold, italic, underline formatting',
      'Custom fonts and colors',
      'Word and character count',
      'Export to multiple formats',
    ],
    href: '/text-editor',
    gradient: 'primary' as const,
  },
  {
    title: 'Image Editor',
    description: 'Professional image editing with filters, crops, and effects.',
    icon: Image,
    features: [
      'Crop, rotate, and resize',
      'Brightness and contrast',
      'Filters and effects',
      'Add text and shapes',
    ],
    href: '/image-editor',
    gradient: 'secondary' as const,
  },
  {
    title: 'Video Editor',
    description: 'Cut, trim, and enhance your videos with ease.',
    icon: Video,
    features: [
      'Trim and cut clips',
      'Add transitions',
      'Speed adjustment',
      'Export in HD formats',
    ],
    href: '/video-editor',
    gradient: 'accent' as const,
  },
  {
    title: 'Audio Editor',
    description: 'Edit audio files with precision tools and effects.',
    icon: Music,
    features: [
      'Trim and split audio',
      'Fade in/out effects',
      'Volume adjustment',
      'Multiple format support',
    ],
    href: '/audio-editor',
    gradient: 'primary' as const,
  },
  {
    title: 'Document Editor',
    description: 'Edit PDFs and documents with full formatting control.',
    icon: FileText,
    features: [
      'PDF to text conversion',
      'Spell check',
      'Insert images',
      'Export as PDF or DOCX',
    ],
    href: '/document-editor',
    gradient: 'secondary' as const,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-24" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            All Your Editing Tools,{' '}
            <span className="gradient-text-secondary">One Place</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From quick text edits to complex video projects, we've got everything you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
