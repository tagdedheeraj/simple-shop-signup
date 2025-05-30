
import { useState } from 'react';

export const useVideoPlayer = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState<Record<string, number>>({});

  const handleVideoPlay = (videoId: string) => {
    const startTime = Date.now();
    setLoadingStats(prev => ({ ...prev, [videoId]: startTime }));
    setPlayingVideo(playingVideo === videoId ? null : videoId);
    
    console.log('🎬 Video play triggered:', videoId);
  };

  const handleVideoEnd = (videoId: string) => {
    console.log('🏁 Video ended:', videoId);
    setPlayingVideo(null);
  };

  return {
    playingVideo,
    loadingStats,
    handleVideoPlay,
    handleVideoEnd
  };
};
