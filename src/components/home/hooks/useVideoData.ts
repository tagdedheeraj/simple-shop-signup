
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

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    try {
      console.log('🎬 Loading videos for mobile app...');
      const storedVideos = localStorage.getItem('admin-videos');
      
      if (storedVideos) {
        const adminVideos = JSON.parse(storedVideos);
        console.log('📺 Loaded admin videos:', adminVideos.length, 'videos found');
        
        // Ensure all videos have required properties and safe URL handling
        const safeVideos = adminVideos.filter((video: any) => {
          const isValid = video && 
                         typeof video === 'object' && 
                         video.id && 
                         video.title && 
                         video.category &&
                         (video.category === 'wheat' || video.category === 'rice');
          
          if (!isValid) {
            console.warn('⚠️ Invalid video found:', video);
          }
          
          return isValid;
        }).map((video: any) => ({
          ...video,
          // Ensure URL properties are strings or undefined
          googleDriveUrl: typeof video.googleDriveUrl === 'string' ? video.googleDriveUrl : undefined,
          embedUrl: typeof video.embedUrl === 'string' ? video.embedUrl : undefined,
          videoUrl: typeof video.videoUrl === 'string' ? video.videoUrl : undefined,
          thumbnail: typeof video.thumbnail === 'string' ? video.thumbnail : undefined,
          // Ensure category is properly typed
          category: video.category === 'rice' ? 'rice' as const : 'wheat' as const
        }));
        
        console.log('✅ Safe videos processed:', safeVideos.length);
        setVideos(safeVideos);
      } else {
        console.log('📱 No admin videos found, loading default mobile videos...');
        // Enhanced fallback videos for mobile with proper typing
        const defaultVideos: Video[] = [
          {
            id: 'lakshmikrupa-main',
            title: 'Lakshmikrupa Agriculture',
            description: 'Main company introduction and facilities overview',
            thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/lakshmikrupa-main.mp4',
            category: 'wheat' as const
          },
          {
            id: 'wheat-processing-mobile',
            title: 'Wheat Processing',
            description: 'Advanced wheat processing techniques and quality control',
            thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/wheat-processing.mp4',
            category: 'wheat' as const
          },
          {
            id: 'rice-processing-mobile',
            title: 'Rice Processing',
            description: 'Modern rice milling and processing methods',
            thumbnail: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/rice-processing.mp4',
            category: 'rice' as const
          },
          {
            id: 'quality-control-mobile',
            title: 'Quality Control',
            description: 'Our strict quality control and testing procedures',
            thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/quality-control.mp4',
            category: 'wheat' as const
          },
          {
            id: 'modern-facilities-mobile',
            title: 'Modern Facilities',
            description: 'State-of-the-art processing and storage facilities',
            thumbnail: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/modern-facilities.mp4',
            category: 'wheat' as const
          },
          {
            id: 'rice-varieties-mobile',
            title: 'Rice Varieties',
            description: 'Different types of rice we process and their quality standards',
            thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/rice-varieties.mp4',
            category: 'rice' as const
          }
        ];
        
        setVideos(defaultVideos);
        console.log('✅ Default mobile videos loaded:', defaultVideos.length);
      }
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      setVideos([]);
    }
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

  // Separate videos into categories with safe filtering
  const verticalVideos = videos.filter(video => 
    video && isVerticalVideo(video) && !isLakshmikrupaVideo(video)
  );
  
  const horizontalVideos = videos.filter(video => 
    video && isLakshmikrupaVideo(video)
  );

  console.log('📊 Video categorization:', {
    total: videos.length,
    vertical: verticalVideos.length, 
    horizontal: horizontalVideos.length
  });

  return {
    videos,
    verticalVideos,
    horizontalVideos,
    isVerticalVideo,
    isLakshmikrupaVideo
  };
};
