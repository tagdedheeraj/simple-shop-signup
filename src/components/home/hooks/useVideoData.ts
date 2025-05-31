
import { useState, useEffect } from 'react';
import { Video } from '@/types/video';
import { loadVideosFromStorage } from '@/utils/videoLoader';
import { categorizeVideos, isVerticalVideo, isLakshmikrupaVideo } from '@/utils/videoCategorizer';

export const useVideoData = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      const validVideos = await loadVideosFromStorage();
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

  const { verticalVideos, horizontalVideos } = categorizeVideos(videos);

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
