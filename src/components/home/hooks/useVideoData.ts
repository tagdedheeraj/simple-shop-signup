
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
        console.log('📱 Mobile app - loading videos from admin storage');
      } else {
        console.log('🌐 Web app - loading videos from admin storage');
      }
      
      const storedVideos = localStorage.getItem('admin-videos');
      
      if (storedVideos) {
        const adminVideos = JSON.parse(storedVideos);
        console.log('📺 Found admin videos:', adminVideos.length);
        
        // Simple validation and cleaning
        const validVideos = adminVideos.filter((video: any) => {
          // Basic validation
          if (!video || typeof video !== 'object') {
            console.warn('⚠️ Invalid video object found:', video);
            return false;
          }
          
          if (!video.id || !video.title || !video.category) {
            console.warn('⚠️ Video missing required fields:', video);
            return false;
          }
          
          if (video.category !== 'wheat' && video.category !== 'rice') {
            console.warn('⚠️ Video has invalid category:', video.category);
            return false;
          }
          
          // Must have at least one video URL
          if (!video.googleDriveUrl && !video.embedUrl && !video.videoUrl) {
            console.warn('⚠️ Video missing video URL:', video);
            return false;
          }
          
          return true;
        }).map((video: any) => {
          // Create clean video object
          const cleanVideo: Video = {
            id: video.id,
            title: video.title,
            description: video.description || '',
            category: video.category
          };

          // Add URL properties if they exist and are valid strings
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
        
        console.log(`✅ ${validVideos.length} valid videos loaded`);
        setVideos(validVideos);
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

  console.log('📊 Video categorization:', {
    total: videos.length,
    vertical: verticalVideos.length, 
    horizontal: horizontalVideos.length,
    verticalTitles: verticalVideos.map(v => v.title),
    horizontalTitles: horizontalVideos.map(v => v.title)
  });

  return {
    videos,
    verticalVideos,
    horizontalVideos,
    isVerticalVideo,
    isLakshmikrupaVideo
  };
};
