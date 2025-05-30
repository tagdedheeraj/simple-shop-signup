
import React from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';

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

interface VideoSectionProps {
  title: string;
  videos: Video[];
  playingVideo: string | null;
  isVertical?: boolean;
  onVideoPlay: (videoId: string) => void;
  onVideoEnd: (videoId: string) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  videos,
  playingVideo,
  isVertical = false,
  onVideoPlay,
  onVideoEnd
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (videos.length === 0) return null;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={`${isVertical ? 'max-w-6xl' : 'max-w-4xl'} mx-auto ${isVertical ? '' : 'mb-12'}`}
    >
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className={isVertical ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
        {videos.map((video) => (
          <motion.div key={video.id} variants={item}>
            <VideoCard
              video={video}
              isPlaying={playingVideo === video.id}
              isVertical={isVertical}
              onPlay={() => onVideoPlay(video.id)}
              onEnd={() => onVideoEnd(video.id)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default VideoSection;
