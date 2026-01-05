// Comprehensive filter presets library for image and video editors
// Contains 100+ carefully crafted filters

export interface FilterPreset {
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  emoji: string;
  category: 'basic' | 'cinematic' | 'vintage' | 'mood' | 'artistic' | 'seasonal' | 'professional' | 'creative' | 'social' | 'portrait';
}

export const defaultFilter: Omit<FilterPreset, 'name' | 'emoji' | 'category'> = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
};

export const filterPresets: FilterPreset[] = [
  // Basic Filters (10)
  { name: 'Original', ...defaultFilter, emoji: '🎬', category: 'basic' },
  { name: 'Brighten', brightness: 120, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '☀️', category: 'basic' },
  { name: 'Darken', brightness: 80, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🌙', category: 'basic' },
  { name: 'High Contrast', brightness: 100, contrast: 140, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '⚡', category: 'basic' },
  { name: 'Low Contrast', brightness: 100, contrast: 70, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🌫️', category: 'basic' },
  { name: 'Vibrant', brightness: 105, contrast: 110, saturation: 150, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎨', category: 'basic' },
  { name: 'Muted', brightness: 100, contrast: 90, saturation: 60, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🖌️', category: 'basic' },
  { name: 'Soft Focus', brightness: 105, contrast: 95, saturation: 100, hue: 0, blur: 1, sepia: 0, grayscale: 0, emoji: '🔮', category: 'basic' },
  { name: 'Sharp', brightness: 100, contrast: 120, saturation: 110, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🔪', category: 'basic' },
  { name: 'Warm Glow', brightness: 108, contrast: 105, saturation: 115, hue: 15, blur: 0, sepia: 10, grayscale: 0, emoji: '🔥', category: 'basic' },

  // Cinematic Filters (15)
  { name: 'Cinematic', brightness: 95, contrast: 120, saturation: 90, hue: 10, blur: 0, sepia: 10, grayscale: 0, emoji: '🎥', category: 'cinematic' },
  { name: 'Blockbuster', brightness: 98, contrast: 125, saturation: 105, hue: 5, blur: 0, sepia: 8, grayscale: 0, emoji: '🎞️', category: 'cinematic' },
  { name: 'Thriller', brightness: 85, contrast: 140, saturation: 80, hue: 190, blur: 0, sepia: 5, grayscale: 10, emoji: '🔪', category: 'cinematic' },
  { name: 'Horror', brightness: 80, contrast: 145, saturation: 60, hue: 180, blur: 0, sepia: 0, grayscale: 20, emoji: '👻', category: 'cinematic' },
  { name: 'Romance', brightness: 108, contrast: 95, saturation: 90, hue: 350, blur: 0.5, sepia: 12, grayscale: 0, emoji: '💕', category: 'cinematic' },
  { name: 'Action', brightness: 95, contrast: 140, saturation: 115, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '💥', category: 'cinematic' },
  { name: 'Sci-Fi', brightness: 90, contrast: 130, saturation: 140, hue: 200, blur: 0, sepia: 0, grayscale: 0, emoji: '🚀', category: 'cinematic' },
  { name: 'Western', brightness: 105, contrast: 110, saturation: 85, hue: 25, blur: 0, sepia: 35, grayscale: 0, emoji: '🤠', category: 'cinematic' },
  { name: 'Noir', brightness: 88, contrast: 150, saturation: 30, hue: 0, blur: 0, sepia: 15, grayscale: 50, emoji: '🕵️', category: 'cinematic' },
  { name: 'Documentary', brightness: 100, contrast: 115, saturation: 95, hue: 0, blur: 0, sepia: 5, grayscale: 0, emoji: '📹', category: 'cinematic' },
  { name: 'Epic', brightness: 92, contrast: 135, saturation: 120, hue: 355, blur: 0, sepia: 5, grayscale: 0, emoji: '⚔️', category: 'cinematic' },
  { name: 'Fantasy', brightness: 102, contrast: 115, saturation: 125, hue: 290, blur: 0.3, sepia: 0, grayscale: 0, emoji: '🧙', category: 'cinematic' },
  { name: 'Indie', brightness: 105, contrast: 95, saturation: 80, hue: 5, blur: 0, sepia: 15, grayscale: 5, emoji: '🎭', category: 'cinematic' },
  { name: 'Drama', brightness: 95, contrast: 125, saturation: 85, hue: 0, blur: 0, sepia: 8, grayscale: 0, emoji: '🎪', category: 'cinematic' },
  { name: 'Comedy', brightness: 110, contrast: 105, saturation: 120, hue: 5, blur: 0, sepia: 0, grayscale: 0, emoji: '😄', category: 'cinematic' },

  // Vintage Filters (12)
  { name: 'Vintage', brightness: 110, contrast: 90, saturation: 70, hue: 0, blur: 0, sepia: 40, grayscale: 0, emoji: '📽️', category: 'vintage' },
  { name: 'Retro', brightness: 105, contrast: 95, saturation: 85, hue: 10, blur: 0, sepia: 25, grayscale: 0, emoji: '📺', category: 'vintage' },
  { name: '70s Film', brightness: 108, contrast: 88, saturation: 75, hue: 15, blur: 0, sepia: 30, grayscale: 0, emoji: '🕺', category: 'vintage' },
  { name: '80s Neon', brightness: 100, contrast: 130, saturation: 160, hue: 320, blur: 0, sepia: 0, grayscale: 0, emoji: '💾', category: 'vintage' },
  { name: '90s VHS', brightness: 95, contrast: 105, saturation: 90, hue: 5, blur: 0.3, sepia: 15, grayscale: 5, emoji: '📼', category: 'vintage' },
  { name: 'Polaroid', brightness: 108, contrast: 95, saturation: 80, hue: 5, blur: 0, sepia: 20, grayscale: 0, emoji: '📸', category: 'vintage' },
  { name: 'Old Film', brightness: 95, contrast: 110, saturation: 60, hue: 0, blur: 0, sepia: 45, grayscale: 10, emoji: '🎞️', category: 'vintage' },
  { name: 'Faded', brightness: 110, contrast: 85, saturation: 70, hue: 0, blur: 0, sepia: 15, grayscale: 5, emoji: '🌅', category: 'vintage' },
  { name: 'Antique', brightness: 100, contrast: 105, saturation: 50, hue: 20, blur: 0, sepia: 55, grayscale: 0, emoji: '🏛️', category: 'vintage' },
  { name: 'Sepia', brightness: 105, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 80, grayscale: 0, emoji: '🟫', category: 'vintage' },
  { name: 'Kodachrome', brightness: 105, contrast: 115, saturation: 120, hue: 10, blur: 0, sepia: 5, grayscale: 0, emoji: '📷', category: 'vintage' },
  { name: 'Lomography', brightness: 95, contrast: 130, saturation: 140, hue: 355, blur: 0, sepia: 10, grayscale: 0, emoji: '🔍', category: 'vintage' },

  // Mood Filters (15)
  { name: 'Warm', brightness: 105, contrast: 105, saturation: 120, hue: 15, blur: 0, sepia: 15, grayscale: 0, emoji: '🌞', category: 'mood' },
  { name: 'Cool', brightness: 100, contrast: 110, saturation: 90, hue: 200, blur: 0, sepia: 0, grayscale: 0, emoji: '❄️', category: 'mood' },
  { name: 'Dreamy', brightness: 115, contrast: 85, saturation: 110, hue: 330, blur: 1, sepia: 5, grayscale: 0, emoji: '💭', category: 'mood' },
  { name: 'Dramatic', brightness: 90, contrast: 150, saturation: 80, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎭', category: 'mood' },
  { name: 'Moody', brightness: 85, contrast: 125, saturation: 75, hue: 200, blur: 0, sepia: 10, grayscale: 5, emoji: '🌧️', category: 'mood' },
  { name: 'Cheerful', brightness: 112, contrast: 108, saturation: 130, hue: 10, blur: 0, sepia: 0, grayscale: 0, emoji: '😊', category: 'mood' },
  { name: 'Melancholy', brightness: 90, contrast: 105, saturation: 60, hue: 210, blur: 0, sepia: 20, grayscale: 10, emoji: '😢', category: 'mood' },
  { name: 'Peaceful', brightness: 105, contrast: 90, saturation: 85, hue: 180, blur: 0.5, sepia: 5, grayscale: 0, emoji: '🕊️', category: 'mood' },
  { name: 'Energetic', brightness: 108, contrast: 125, saturation: 140, hue: 350, blur: 0, sepia: 0, grayscale: 0, emoji: '⚡', category: 'mood' },
  { name: 'Mysterious', brightness: 85, contrast: 130, saturation: 70, hue: 270, blur: 0, sepia: 0, grayscale: 15, emoji: '🔮', category: 'mood' },
  { name: 'Nostalgic', brightness: 105, contrast: 95, saturation: 75, hue: 10, blur: 0, sepia: 25, grayscale: 0, emoji: '📸', category: 'mood' },
  { name: 'Intense', brightness: 95, contrast: 145, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🔥', category: 'mood' },
  { name: 'Serene', brightness: 108, contrast: 92, saturation: 90, hue: 190, blur: 0.3, sepia: 0, grayscale: 0, emoji: '🧘', category: 'mood' },
  { name: 'Eerie', brightness: 80, contrast: 135, saturation: 50, hue: 180, blur: 0, sepia: 5, grayscale: 25, emoji: '👁️', category: 'mood' },
  { name: 'Romantic', brightness: 108, contrast: 98, saturation: 95, hue: 345, blur: 0.5, sepia: 15, grayscale: 0, emoji: '💖', category: 'mood' },

  // Artistic Filters (12)
  { name: 'B&W Film', brightness: 105, contrast: 130, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, emoji: '⬛', category: 'artistic' },
  { name: 'B&W High Contrast', brightness: 100, contrast: 160, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, emoji: '◼️', category: 'artistic' },
  { name: 'B&W Soft', brightness: 110, contrast: 90, saturation: 0, hue: 0, blur: 0.5, sepia: 0, grayscale: 100, emoji: '⬜', category: 'artistic' },
  { name: 'Pop Art', brightness: 110, contrast: 150, saturation: 180, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎨', category: 'artistic' },
  { name: 'Duotone Blue', brightness: 100, contrast: 120, saturation: 150, hue: 220, blur: 0, sepia: 0, grayscale: 30, emoji: '💙', category: 'artistic' },
  { name: 'Duotone Pink', brightness: 105, contrast: 120, saturation: 150, hue: 320, blur: 0, sepia: 0, grayscale: 30, emoji: '💗', category: 'artistic' },
  { name: 'Duotone Orange', brightness: 105, contrast: 120, saturation: 150, hue: 30, blur: 0, sepia: 0, grayscale: 30, emoji: '🧡', category: 'artistic' },
  { name: 'Cross Process', brightness: 105, contrast: 115, saturation: 130, hue: 180, blur: 0, sepia: 10, grayscale: 0, emoji: '🔄', category: 'artistic' },
  { name: 'Infrared', brightness: 100, contrast: 120, saturation: 150, hue: 300, blur: 0, sepia: 0, grayscale: 0, emoji: '👓', category: 'artistic' },
  { name: 'Negative', brightness: 100, contrast: 100, saturation: 100, hue: 180, blur: 0, sepia: 0, grayscale: 0, emoji: '🔳', category: 'artistic' },
  { name: 'Solarize', brightness: 120, contrast: 80, saturation: 120, hue: 60, blur: 0, sepia: 0, grayscale: 0, emoji: '☀️', category: 'artistic' },
  { name: 'Watercolor', brightness: 110, contrast: 80, saturation: 130, hue: 0, blur: 0.5, sepia: 5, grayscale: 0, emoji: '🖼️', category: 'artistic' },

  // Seasonal Filters (12)
  { name: 'Summer', brightness: 110, contrast: 105, saturation: 130, hue: 40, blur: 0, sepia: 8, grayscale: 0, emoji: '☀️', category: 'seasonal' },
  { name: 'Winter', brightness: 108, contrast: 110, saturation: 70, hue: 210, blur: 0, sepia: 0, grayscale: 15, emoji: '❄️', category: 'seasonal' },
  { name: 'Autumn', brightness: 105, contrast: 110, saturation: 110, hue: 25, blur: 0, sepia: 20, grayscale: 0, emoji: '🍂', category: 'seasonal' },
  { name: 'Spring', brightness: 110, contrast: 105, saturation: 120, hue: 100, blur: 0, sepia: 0, grayscale: 0, emoji: '🌸', category: 'seasonal' },
  { name: 'Golden Hour', brightness: 108, contrast: 108, saturation: 115, hue: 25, blur: 0, sepia: 15, grayscale: 0, emoji: '🌅', category: 'seasonal' },
  { name: 'Blue Hour', brightness: 92, contrast: 110, saturation: 100, hue: 220, blur: 0, sepia: 0, grayscale: 5, emoji: '🌆', category: 'seasonal' },
  { name: 'Sunset', brightness: 105, contrast: 115, saturation: 130, hue: 15, blur: 0, sepia: 20, grayscale: 0, emoji: '🌇', category: 'seasonal' },
  { name: 'Sunrise', brightness: 108, contrast: 105, saturation: 120, hue: 35, blur: 0, sepia: 10, grayscale: 0, emoji: '🌄', category: 'seasonal' },
  { name: 'Night', brightness: 75, contrast: 125, saturation: 80, hue: 230, blur: 0, sepia: 0, grayscale: 10, emoji: '🌙', category: 'seasonal' },
  { name: 'Neon Night', brightness: 85, contrast: 140, saturation: 180, hue: 280, blur: 0, sepia: 0, grayscale: 0, emoji: '🌃', category: 'seasonal' },
  { name: 'Foggy Morning', brightness: 105, contrast: 85, saturation: 70, hue: 200, blur: 0.8, sepia: 5, grayscale: 10, emoji: '🌁', category: 'seasonal' },
  { name: 'Stormy', brightness: 85, contrast: 130, saturation: 60, hue: 210, blur: 0, sepia: 0, grayscale: 20, emoji: '⛈️', category: 'seasonal' },

  // Professional Filters (12)
  { name: 'Studio', brightness: 105, contrast: 110, saturation: 95, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '📸', category: 'professional' },
  { name: 'Portrait', brightness: 105, contrast: 100, saturation: 90, hue: 5, blur: 0.2, sepia: 5, grayscale: 0, emoji: '👤', category: 'professional' },
  { name: 'Landscape', brightness: 100, contrast: 115, saturation: 120, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🏞️', category: 'professional' },
  { name: 'Product', brightness: 108, contrast: 105, saturation: 105, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '📦', category: 'professional' },
  { name: 'Food', brightness: 105, contrast: 108, saturation: 115, hue: 10, blur: 0, sepia: 5, grayscale: 0, emoji: '🍔', category: 'professional' },
  { name: 'Architecture', brightness: 100, contrast: 120, saturation: 90, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🏛️', category: 'professional' },
  { name: 'Fashion', brightness: 105, contrast: 115, saturation: 105, hue: 350, blur: 0, sepia: 0, grayscale: 0, emoji: '👗', category: 'professional' },
  { name: 'Wedding', brightness: 108, contrast: 95, saturation: 90, hue: 5, blur: 0.3, sepia: 10, grayscale: 0, emoji: '💒', category: 'professional' },
  { name: 'Real Estate', brightness: 108, contrast: 108, saturation: 110, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🏠', category: 'professional' },
  { name: 'Sports', brightness: 100, contrast: 130, saturation: 115, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '⚽', category: 'professional' },
  { name: 'Nature', brightness: 105, contrast: 110, saturation: 125, hue: 100, blur: 0, sepia: 0, grayscale: 0, emoji: '🌿', category: 'professional' },
  { name: 'Street', brightness: 95, contrast: 125, saturation: 90, hue: 0, blur: 0, sepia: 5, grayscale: 0, emoji: '🚶', category: 'professional' },

  // Creative Filters (12)
  { name: 'Anime', brightness: 108, contrast: 120, saturation: 145, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🎌', category: 'creative' },
  { name: 'Music Video', brightness: 105, contrast: 135, saturation: 160, hue: 320, blur: 0, sepia: 0, grayscale: 0, emoji: '🎵', category: 'creative' },
  { name: 'Vlog', brightness: 105, contrast: 108, saturation: 115, hue: 10, blur: 0, sepia: 5, grayscale: 0, emoji: '📱', category: 'creative' },
  { name: 'Gaming', brightness: 95, contrast: 130, saturation: 150, hue: 270, blur: 0, sepia: 0, grayscale: 0, emoji: '🎮', category: 'creative' },
  { name: 'Cyberpunk', brightness: 90, contrast: 140, saturation: 170, hue: 300, blur: 0, sepia: 0, grayscale: 0, emoji: '🤖', category: 'creative' },
  { name: 'Vaporwave', brightness: 100, contrast: 110, saturation: 140, hue: 280, blur: 0.3, sepia: 10, grayscale: 0, emoji: '🌴', category: 'creative' },
  { name: 'Glitch', brightness: 105, contrast: 140, saturation: 130, hue: 180, blur: 0, sepia: 0, grayscale: 0, emoji: '📺', category: 'creative' },
  { name: 'Retro Wave', brightness: 95, contrast: 125, saturation: 150, hue: 310, blur: 0, sepia: 0, grayscale: 0, emoji: '🌊', category: 'creative' },
  { name: 'Synthwave', brightness: 88, contrast: 135, saturation: 160, hue: 290, blur: 0, sepia: 0, grayscale: 0, emoji: '🎹', category: 'creative' },
  { name: 'Lo-Fi', brightness: 100, contrast: 90, saturation: 80, hue: 0, blur: 0.5, sepia: 20, grayscale: 10, emoji: '🎧', category: 'creative' },
  { name: 'HDR', brightness: 100, contrast: 150, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🔆', category: 'creative' },
  { name: 'Tilt Shift', brightness: 105, contrast: 110, saturation: 120, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🔬', category: 'creative' },

  // Social Media Filters (10)
  { name: 'Instagram', brightness: 105, contrast: 108, saturation: 115, hue: 5, blur: 0, sepia: 8, grayscale: 0, emoji: '📷', category: 'social' },
  { name: 'TikTok', brightness: 105, contrast: 115, saturation: 130, hue: 350, blur: 0, sepia: 0, grayscale: 0, emoji: '🎵', category: 'social' },
  { name: 'YouTube', brightness: 105, contrast: 110, saturation: 115, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '▶️', category: 'social' },
  { name: 'Pinterest', brightness: 108, contrast: 105, saturation: 110, hue: 350, blur: 0, sepia: 5, grayscale: 0, emoji: '📌', category: 'social' },
  { name: 'Twitter', brightness: 105, contrast: 108, saturation: 105, hue: 200, blur: 0, sepia: 0, grayscale: 0, emoji: '🐦', category: 'social' },
  { name: 'Facebook', brightness: 105, contrast: 105, saturation: 105, hue: 220, blur: 0, sepia: 0, grayscale: 0, emoji: '👍', category: 'social' },
  { name: 'Snapchat', brightness: 110, contrast: 108, saturation: 125, hue: 50, blur: 0, sepia: 0, grayscale: 0, emoji: '👻', category: 'social' },
  { name: 'LinkedIn', brightness: 105, contrast: 108, saturation: 95, hue: 210, blur: 0, sepia: 0, grayscale: 0, emoji: '💼', category: 'social' },
  { name: 'Tumblr', brightness: 100, contrast: 110, saturation: 90, hue: 230, blur: 0, sepia: 10, grayscale: 5, emoji: '📝', category: 'social' },
  { name: 'Reddit', brightness: 105, contrast: 110, saturation: 105, hue: 15, blur: 0, sepia: 0, grayscale: 0, emoji: '🤖', category: 'social' },

  // Portrait Filters (10)
  { name: 'Beauty', brightness: 108, contrast: 95, saturation: 95, hue: 5, blur: 0.3, sepia: 5, grayscale: 0, emoji: '✨', category: 'portrait' },
  { name: 'Smooth Skin', brightness: 105, contrast: 92, saturation: 90, hue: 0, blur: 0.5, sepia: 0, grayscale: 0, emoji: '👩', category: 'portrait' },
  { name: 'Glow', brightness: 115, contrast: 90, saturation: 100, hue: 0, blur: 0.8, sepia: 0, grayscale: 0, emoji: '💫', category: 'portrait' },
  { name: 'Natural', brightness: 102, contrast: 100, saturation: 98, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '🌿', category: 'portrait' },
  { name: 'Tan', brightness: 105, contrast: 105, saturation: 110, hue: 20, blur: 0, sepia: 15, grayscale: 0, emoji: '🏖️', category: 'portrait' },
  { name: 'Fair', brightness: 110, contrast: 95, saturation: 85, hue: 350, blur: 0, sepia: 0, grayscale: 0, emoji: '🧚', category: 'portrait' },
  { name: 'Dramatic Portrait', brightness: 95, contrast: 130, saturation: 90, hue: 0, blur: 0, sepia: 5, grayscale: 0, emoji: '🎭', category: 'portrait' },
  { name: 'Headshot', brightness: 105, contrast: 105, saturation: 95, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '📸', category: 'portrait' },
  { name: 'Glamour', brightness: 108, contrast: 110, saturation: 105, hue: 350, blur: 0.2, sepia: 5, grayscale: 0, emoji: '💎', category: 'portrait' },
  { name: 'Magazine', brightness: 105, contrast: 115, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, emoji: '📰', category: 'portrait' },
];

// Get filters by category
export const getFiltersByCategory = (category: FilterPreset['category']): FilterPreset[] => {
  return filterPresets.filter(f => f.category === category);
};

// Get all categories
export const filterCategories: FilterPreset['category'][] = [
  'basic', 'cinematic', 'vintage', 'mood', 'artistic', 
  'seasonal', 'professional', 'creative', 'social', 'portrait'
];

// Category display names
export const categoryDisplayNames: Record<FilterPreset['category'], string> = {
  basic: '🎯 Basic',
  cinematic: '🎬 Cinematic',
  vintage: '📽️ Vintage',
  mood: '🌈 Mood',
  artistic: '🎨 Artistic',
  seasonal: '🍂 Seasonal',
  professional: '📸 Professional',
  creative: '✨ Creative',
  social: '📱 Social Media',
  portrait: '👤 Portrait',
};
