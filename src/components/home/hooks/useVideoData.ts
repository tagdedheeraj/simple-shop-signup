
import { useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  googleDriveUrl?: string;
  embedUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  category: 'wheat' | 'rice';
}

export const useVideoData = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const isCapacitor = !!(window as any).Capacitor;
      
      console.log(`📱 ${isCapacitor ? 'Mobile' : 'Web'} app - loading videos from admin storage`);
      
      // Clear any corrupt video data first
      const clearCorruptData = () => {
        try {
          const storedVideos = localStorage.getItem('admin-videos');
          if (storedVideos) {
            const parsed = JSON.parse(storedVideos);
            if (!Array.isArray(parsed)) {
              console.warn('🧹 Clearing corrupt video data (not array)');
              localStorage.removeItem('admin-videos');
              return [];
            }
            return parsed;
          }
          return [];
        } catch (error) {
          console.warn('🧹 Clearing corrupt video data (parse error):', error);
          localStorage.removeItem('admin-videos');
          return [];
        }
      };

      let adminVideos = clearCorruptData();
      
      // If no videos found, try to initialize with sample data for testing
      if (adminVideos.length === 0) {
        console.log('📺 No admin videos found, checking for sample data...');
        
        // For mobile apps, try to get from a backup or initialize with default
        if (isCapacitor) {
          console.log('📱 Mobile app: Initializing with default video data for testing');
          const defaultVideos = [
            {
              id: 'default-wheat-1',
              title: 'Wheat Processing',
              description: 'Advanced wheat processing facility showcasing our quality standards',
              category: 'wheat',
              googleDriveUrl: 'https://drive.google.com/file/d/1mHtTxH6R8AxRs7QiWzKpE3FgYvN2LcMd/view',
              thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
            },
            {
              id: 'default-rice-1', 
              title: 'Rice Processing',
              description: 'State-of-the-art rice processing technology',
              category: 'rice',
              googleDriveUrl: 'https://drive.google.com/file/d/1nGtUxI7S9ByRt8QjXzLqF4GhZwO3McDe/view',
              thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
            },
            {
              id: 'lakshmikrupa-1',
              title: 'Lakshmikrupa Agriculture Processing Facility',
              description: 'Complete overview of our modern agriculture processing facility',
              category: 'wheat',
              googleDriveUrl: 'https://drive.google.com/file/d/1oHtVxJ8T0CyRu9RkYzMrG5HiAwP4NdEf/view',
              thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
            }
          ];
          
          // Store default videos
          localStorage.setItem('admin-videos', JSON.stringify(defaultVideos));
          adminVideos = defaultVideos;
          console.log('✅ Default videos initialized for mobile app');
        }
      }
      
      console.log('📺 Found admin videos:', adminVideos.length);
      
      // Enhanced validation and cleaning
      const validVideos = adminVideos.filter((video: any, index: number) => {
        // Basic validation
        if (!video || typeof video !== 'object') {
          console.warn(`⚠️ Invalid video object at index ${index}:`, video);
          return false;
        }
        
        if (!video.id || !video.title) {
          console.warn(`⚠️ Video at index ${index} missing required fields:`, video);
          return false;
        }
        
        if (!video.category || (video.category !== 'wheat' && video.category !== 'rice')) {
          console.warn(`⚠️ Video at index ${index} has invalid category:`, video.category);
          return false;
        }
        
        // Must have at least one video URL
        if (!video.googleDriveUrl && !video.embedUrl && !video.videoUrl) {
          console.warn(`⚠️ Video at index ${index} missing video URL:`, video);
          return false;
        }
        
        return true;
      }).map((video: any) => {
        // Create clean video object with proper validation
        const cleanVideo: Video = {
          id: String(video.id),
          title: String(video.title),
          description: String(video.description || ''),
          category: video.category as 'wheat' | 'rice'
        };

        // Add URL properties with validation
        if (video.googleDriveUrl && typeof video.googleDriveUrl === 'string' && video.googleDriveUrl.trim()) {
          cleanVideo.googleDriveUrl = video.googleDriveUrl.trim();
        }
        
        if (video.embedUrl && typeof video.embedUrl === 'string' && video.embedUrl.trim()) {
          cleanVideo.embedUrl = video.embedUrl.trim();
        }
        
        if (video.videoUrl && typeof video.videoUrl === 'string' && video.videoUrl.trim()) {
          cleanVideo.videoUrl = video.videoUrl.trim();
        }
        
        if (video.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.trim()) {
          cleanVideo.thumbnail = video.thumbnail.trim();
        }

        console.log('✅ Cleaned video:', cleanVideo.title);
        return cleanVideo;
      });
      
      console.log(`✅ ${validVideos.length} valid videos loaded successfully`);
      setVideos(validVideos);
      
      // Save cleaned data back to localStorage
      if (validVideos.length > 0) {
        localStorage.setItem('admin-videos', JSON.stringify(validVideos));
        console.log('💾 Cleaned video data saved to localStorage');
      }
      
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      // Clear potentially corrupt data
      localStorage.removeItem('admin-videos');
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Force reload videos function
  const reloadVideos = () => {
    console.log('🔄 Force reloading videos...');
    loadVideos();
  };

  // Function to check if video should be displayed vertically
  const isVerticalVideo = (video: Video) => {
    if (!video || !video.title) return false;
    const title = video.title.toLowerCase();
    return title.includes('wheat processing') || 
           title.includes('wheat') || 
           title.includes('processing') ||
           title.includes('quality control') ||
           title.includes('rice processing') ||
           title.includes('rice varieties') ||
           title.includes('modern facilities');
  };

  // Function to check if video is Lakshmikrupa Agriculture
  const isLakshmikrupaVideo = (video: Video) => {
    if (!video || !video.title) return false;
    return video.title.toLowerCase().includes('lakshmikrupa agriculture') ||
           video.title.toLowerCase().includes('lakshmikrupa');
  };

  // Separate videos into categories with better filtering
  const verticalVideos = videos.filter(video => 
    video && isVerticalVideo(video) && !isLakshmikrupaVideo(video)
  );
  
  const horizontalVideos = videos.filter(video => 
    video && isLakshmikrupaVideo(video)
  );

  console.log('📊 Video categorization result:', {
    total: videos.length,
    vertical: verticalVideos.length, 
    horizontal: horizontalVideos.length,
    isLoading,
    verticalTitles: verticalVideos.map(v => v.title),
    horizontalTitles: horizontalVideos.map(v => v.title)
  });

  return {
    videos,
    verticalVideos,
    horizontalVideos,
    isVerticalVideo,
    isLakshmikrupaVideo,
    isLoading,
    reloadVideos
  };
};
