
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
      const isCapacitor = !!(window as any).Capacitor;
      
      if (isCapacitor) {
        console.log('📱 Mobile app - loading videos from admin storage only');
      } else {
        console.log('🌐 Web app - loading videos from admin storage');
      }
      
      const storedVideos = localStorage.getItem('admin-videos');
      
      if (storedVideos) {
        const adminVideos = JSON.parse(storedVideos);
        console.log('📺 Found admin videos:', adminVideos.length);
        
        // Validate and filter videos
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
          googleDriveUrl: typeof video.googleDriveUrl === 'string' ? video.googleDriveUrl : undefined,
          embedUrl: typeof video.embedUrl === 'string' ? video.embedUrl : undefined,
          videoUrl: typeof video.videoUrl === 'string' ? video.videoUrl : undefined,
          thumbnail: typeof video.thumbnail === 'string' ? video.thumbnail : undefined,
          category: video.category === 'rice' ? 'rice' as const : 'wheat' as const
        }));
        
        console.log('✅ Valid videos loaded:', safeVideos.length);
        setVideos(safeVideos);
      } else {
        console.log('📱 No admin videos found - showing empty state');
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

  // Separate videos into categories
  const verticalVideos = videos.filter(video => 
    video && isVerticalVideo(video) && !isLakshmikrupaVideo(video)
  );
  
  const horizontalVideos = videos.filter(video => 
    video && isLakshmikrupaVideo(video)
  );

  console.log('📊 Video categorization for display:', {
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
