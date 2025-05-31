
import { Video } from '@/types/video';

export const isVerticalVideo = (video: Video): boolean => {
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

export const isLakshmikrupaVideo = (video: Video): boolean => {
  if (!video || !video.title) return false;
  return video.title.toLowerCase().includes('lakshmikrupa agriculture') ||
         video.title.toLowerCase().includes('lakshmikrupa');
};

export const categorizeVideos = (videos: Video[]) => {
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
    verticalTitles: verticalVideos.map(v => v.title),
    horizontalTitles: horizontalVideos.map(v => v.title)
  });

  return {
    verticalVideos,
    horizontalVideos
  };
};
