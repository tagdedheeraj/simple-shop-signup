
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
        console.log('📱 No admin videos found in localStorage - showing empty state');
        // For mobile/website consistency, if no admin videos found, show empty state
        setVideos([]);
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
