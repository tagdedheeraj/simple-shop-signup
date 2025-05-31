
import { Video } from '@/types/video';

export const loadVideosFromStorage = async (): Promise<Video[]> => {
  try {
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
    
    return validateAndCleanVideos(adminVideos);
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
};
