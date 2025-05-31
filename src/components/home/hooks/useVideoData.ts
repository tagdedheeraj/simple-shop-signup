
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
      
      // Get videos from localStorage admin storage
      let adminVideos = [];
      
      try {
        const storedVideos = localStorage.getItem('admin-videos');
        if (storedVideos) {
          const parsed = JSON.parse(storedVideos);
          if (Array.isArray(parsed)) {
            adminVideos = parsed;
          }
        }
      } catch (error) {
        console.warn('Error parsing stored videos:', error);
        adminVideos = [];
      }
      
      console.log('📺 Found admin videos:', adminVideos.length);
      
      // Enhanced validation and cleaning
      const validVideos = adminVideos.filter((video: any, index: number) => {
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
        
        if (!video.googleDriveUrl && !video.embedUrl && !video.videoUrl) {
          console.warn(`⚠️ Video at index ${index} missing video URL:`, video);
          return false;
        }
        
        return true;
      }).map((video: any) => {
        const cleanVideo: Video = {
          id: String(video.id),
          title: String(video.title),
          description: String(video.description || ''),
          category: video.category as 'wheat' | 'rice'
        };

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
      
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadVideos = () => {
    console.log('🔄 Force reloading videos...');
    loadVideos();
  };

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

  const isLakshmikrupaVideo = (video: Video) => {
    if (!video || !video.title) return false;
    return video.title.toLowerCase().includes('lakshmikrupa agriculture') ||
           video.title.toLowerCase().includes('lakshmikrupa');
  };

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
