
import React from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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

  // Check if we're on mobile (using window width)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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
      
      {/* For vertical videos on mobile, use carousel */}
      {isVertical && isMobile ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {videos.map((video) => (
              <CarouselItem key={video.id} className="pl-2 md:pl-4 basis-[85%]">
                <motion.div variants={item}>
                  <VideoCard
                    video={video}
                    isPlaying={playingVideo === video.id}
                    isVertical={isVertical}
                    onPlay={() => onVideoPlay(video.id)}
                    onEnd={() => onVideoEnd(video.id)}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      ) : (
        /* For desktop or horizontal videos, use original grid layout */
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
      )}
    </motion.div>
  );
};

export default VideoSection;
