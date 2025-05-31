
import { Video } from '@/types/video';

export const loadVideosFromStorage = async (): Promise<Video[]> => {
  try {
    const isCapacitor = !!(window as any).Capacitor;
    
    console.log(`📱 ${isCapacitor ? 'Mobile' : 'Web'} app - loading videos from admin storage`);
    
    // Get videos from localStorage admin storage
    let adminVideos = [];
    
    try {
      const storedVideos = localStorage.getItem('admin-videos');
      console.log('Raw stored videos:', storedVideos);
      
      if (storedVideos) {
        const parsed = JSON.parse(storedVideos);
        console.log('Parsed videos:', parsed);
        
        if (Array.isArray(parsed)) {
          adminVideos = parsed;
        } else {
          console.warn('Stored videos is not an array:', parsed);
        }
      } else {
        console.warn('No admin-videos found in localStorage');
      }
    } catch (error) {
      console.error('Error parsing stored videos:', error);
      adminVideos = [];
    }
    
    console.log('📺 Found admin videos:', adminVideos.length, adminVideos);
    
    // Return all videos without strict validation to see what we have
    return adminVideos.map((video: any, index: number) => {
      console.log(`Processing video ${index}:`, video);
      
      const cleanVideo: Video = {
        id: String(video.id || index),
        title: String(video.title || 'Untitled Video'),
        description: String(video.description || ''),
        category: (video.category === 'rice' ? 'rice' : 'wheat') as 'wheat' | 'rice'
      };

      if (video.googleDriveUrl) {
        cleanVideo.googleDriveUrl = video.googleDriveUrl;
      }
      
      if (video.embedUrl) {
        cleanVideo.embedUrl = video.embedUrl;
      }
      
      if (video.videoUrl) {
        cleanVideo.videoUrl = video.videoUrl;
      }
      
      if (video.thumbnail) {
        cleanVideo.thumbnail = video.thumbnail;
      }

      console.log('✅ Processed video:', cleanVideo);
      return cleanVideo;
    });
    
  } catch (error) {
    console.error('❌ Error loading videos:', error);
    return [];
  }
};

const validateAndCleanVideos = (adminVideos: any[]): Video[] => {
  return adminVideos.filter((video: any, index: number) => {
    if (!video || typeof video !== 'object') {
      console.warn(`⚠️ Invalid video object at index ${index}:`, video);
      return false;
    }
    
    if (!video.id && !video.title) {
      console.warn(`⚠️ Video at index ${index} missing required fields:`, video);
      return false;
    }
    
    return true;
  }).map((video: any, index: number) => {
    const cleanVideo: Video = {
      id: String(video.id || `video-${index}`),
      title: String(video.title || 'Video'),
      description: String(video.description || ''),
      category: (video.category === 'rice' ? 'rice' : 'wheat') as 'wheat' | 'rice'
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
};
