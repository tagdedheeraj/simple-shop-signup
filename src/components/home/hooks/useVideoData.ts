
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
                         video.category;
          
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
          thumbnail: typeof video.thumbnail === 'string' ? video.thumbnail : undefined
        }));
        
        console.log('✅ Safe videos processed:', safeVideos.length);
        setVideos(safeVideos);
      } else {
        console.log('📱 No admin videos found, loading default mobile videos...');
        // Enhanced fallback videos for mobile
        const defaultVideos = [
          {
            id: 'lakshmikrupa-main',
            title: 'Lakshmikrupa Agriculture',
            description: 'Main company introduction and facilities overview',
            thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/lakshmikrupa-main.mp4',
            category: 'wheat'
          },
          {
            id: 'wheat-processing-mobile',
            title: 'Wheat Processing',
            description: 'Advanced wheat processing techniques and quality control',
            thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/wheat-processing.mp4',
            category: 'wheat'
          },
          {
            id: 'rice-processing-mobile',
            title: 'Rice Processing',
            description: 'Modern rice milling and processing methods',
            thumbnail: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/rice-processing.mp4',
            category: 'rice'
          },
          {
            id: 'quality-control-mobile',
            title: 'Quality Control',
            description: 'Our strict quality control and testing procedures',
            thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/quality-control.mp4',
            category: 'wheat'
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
           title.includes('quality control');
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
