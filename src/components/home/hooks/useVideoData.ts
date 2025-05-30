
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
      const storedVideos = localStorage.getItem('admin-videos');
      if (storedVideos) {
        const adminVideos = JSON.parse(storedVideos);
        console.log('📺 Loaded admin videos:', adminVideos);
        
        // Ensure all videos have required properties and safe URL handling
        const safeVideos = adminVideos.filter((video: any) => {
          return video && 
                 typeof video === 'object' && 
                 video.id && 
                 video.title && 
                 video.category;
        }).map((video: any) => ({
          ...video,
          // Ensure URL properties are strings or undefined
          googleDriveUrl: typeof video.googleDriveUrl === 'string' ? video.googleDriveUrl : undefined,
          embedUrl: typeof video.embedUrl === 'string' ? video.embedUrl : undefined,
          videoUrl: typeof video.videoUrl === 'string' ? video.videoUrl : undefined,
          thumbnail: typeof video.thumbnail === 'string' ? video.thumbnail : undefined
        }));
        
        setVideos(safeVideos);
      } else {
        // Fallback placeholder videos if no admin videos are found
        setVideos([
          {
            id: 'wheat-processing-1',
            title: 'Premium Wheat Processing',
            description: 'Traditional wheat processing methods ensuring quality and purity',
            thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/wheat-processing.mp4',
            category: 'wheat'
          },
          {
            id: 'rice-processing-1',
            title: 'Rice Milling Excellence',
            description: 'Modern rice processing techniques for superior grain quality',
            thumbnail: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            videoUrl: '/videos/rice-processing.mp4',
            category: 'rice'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
  };

  // Function to check if video should be displayed vertically
  const isVerticalVideo = (video: Video) => {
    if (!video || !video.title) return false;
    const title = video.title.toLowerCase();
    return title.includes('wheat processing') || 
           title.includes('wheat') || 
           title.includes('processing');
  };

  // Function to check if video is Lakshmikrupa Agriculture
  const isLakshmikrupaVideo = (video: Video) => {
    if (!video || !video.title) return false;
    return video.title.toLowerCase().includes('lakshmikrupa agriculture');
  };

  // Separate videos into categories with safe filtering
  const verticalVideos = videos.filter(video => 
    video && isVerticalVideo(video) && !isLakshmikrupaVideo(video)
  );
  const horizontalVideos = videos.filter(video => 
    video && isLakshmikrupaVideo(video)
  );

  return {
    videos,
    verticalVideos,
    horizontalVideos,
    isVerticalVideo,
    isLakshmikrupaVideo
  };
};
