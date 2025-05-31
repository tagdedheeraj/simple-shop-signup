
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
        console.log('📱 Mobile app - loading and cleaning videos from admin storage');
      } else {
        console.log('🌐 Web app - loading and cleaning videos from admin storage');
      }
      
      const storedVideos = localStorage.getItem('admin-videos');
      
      if (storedVideos) {
        const adminVideos = JSON.parse(storedVideos);
        console.log('📺 Found admin videos:', adminVideos.length);
        
        // Enhanced cleaning and validation for corrupted data
        const cleanedVideos = adminVideos.filter((video: any) => {
          const isValid = video && 
                         typeof video === 'object' && 
                         video.id && 
                         video.title && 
                         video.category &&
                         (video.category === 'wheat' || video.category === 'rice') &&
                         (video.googleDriveUrl || video.embedUrl || video.videoUrl);
          
          if (!isValid) {
            console.warn('⚠️ Invalid video found and removed:', video);
          }
          
          return isValid;
        }).map((video: any) => {
          // Clean up corrupted object properties - properly type the object
          const cleanVideo: Video = {
            id: video.id,
            title: video.title,
            description: video.description || '',
            category: video.category === 'rice' ? 'rice' as const : 'wheat' as const
          };

          // Clean up URL properties - remove corrupted objects
          if (video.googleDriveUrl && typeof video.googleDriveUrl === 'string' && video.googleDriveUrl.trim()) {
            cleanVideo.googleDriveUrl = video.googleDriveUrl;
          }
          
          if (video.embedUrl && typeof video.embedUrl === 'string' && video.embedUrl.trim()) {
            cleanVideo.embedUrl = video.embedUrl;
          }
          
          if (video.videoUrl && typeof video.videoUrl === 'string' && video.videoUrl.trim()) {
            cleanVideo.videoUrl = video.videoUrl;
          }
          
          if (video.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.trim()) {
            cleanVideo.thumbnail = video.thumbnail;
          }

          console.log('🧹 Cleaned video:', cleanVideo.title, cleanVideo);
          return cleanVideo;
        });
        
        // Save cleaned data back to localStorage
        if (cleanedVideos.length !== adminVideos.length) {
          console.log('💾 Saving cleaned video data back to localStorage');
          localStorage.setItem('admin-videos', JSON.stringify(cleanedVideos));
        }
        
        console.log('✅ Valid and cleaned videos loaded:', cleanedVideos.length);
        setVideos(cleanedVideos);
      } else {
        console.log('📱 No admin videos found - showing empty state');
        setVideos([]);
      }
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      // Clear corrupted data
      localStorage.removeItem('admin-videos');
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

  console.log('📊 Video categorization after cleaning:', {
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
