
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoSection from './VideoSection';
import { useVideoData } from './hooks/useVideoData';
import { useVideoPlayer } from './hooks/useVideoPlayer';

const VideoShowcase: React.FC = () => {
  const { videos, verticalVideos, horizontalVideos } = useVideoData();
  const { playingVideo, handleVideoPlay, handleVideoEnd } = useVideoPlayer();

  // Enhanced safe filter function with comprehensive null checks
  const safeVideos = videos.filter(video => {
    if (!video || typeof video !== 'object') {
      console.warn('Invalid video object:', video);
      return false;
    }
    
    // Check required properties exist and are valid
    const hasRequiredProps = video.id && 
                            video.title && 
                            video.category;
    
    if (!hasRequiredProps) {
      console.warn('Video missing required properties:', video);
      return false;
    }
    
    return true;
  });

  // Safe vertical videos with comprehensive validation
  const safeVerticalVideos = verticalVideos.filter(video => {
    if (!video || typeof video !== 'object') {
      console.warn('Invalid vertical video object:', video);
      return false;
    }
    
    const isValid = video.id && 
                   video.title && 
                   typeof video.title === 'string' &&
                   typeof video.id === 'string';
    
    if (!isValid) {
      console.warn('Vertical video validation failed:', video);
      return false;
    }
    
    return true;
  });

  // Safe horizontal videos with comprehensive validation
  const safeHorizontalVideos = horizontalVideos.filter(video => {
    if (!video || typeof video !== 'object') {
      console.warn('Invalid horizontal video object:', video);
      return false;
    }
    
    const isValid = video.id && 
                   video.title && 
                   typeof video.title === 'string' &&
                   typeof video.id === 'string';
    
    if (!isValid) {
      console.warn('Horizontal video validation failed:', video);
      return false;
    }
    
    return true;
  });

  console.log('VideoShowcase - Safe videos loaded:', {
    total: safeVideos.length,
    vertical: safeVerticalVideos.length,
    horizontal: safeHorizontalVideos.length
  });

  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lakshmikrupa Agriculture Processing Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our state-of-the-art wheat and rice processing facilities that 
            ensure the highest quality standards for every grain
          </p>
        </motion.div>

        {/* Horizontal Videos (Lakshmikrupa Agriculture) */}
        {safeHorizontalVideos.length > 0 && (
          <VideoSection
            title="Lakshmikrupa Agriculture"
            videos={safeHorizontalVideos}
            playingVideo={playingVideo}
            isVertical={false}
            onVideoPlay={handleVideoPlay}
            onVideoEnd={handleVideoEnd}
          />
        )}

        {/* Vertical Videos (Wheat Processing, etc.) */}
        {safeVerticalVideos.length > 0 && (
          <VideoSection
            title="Processing Videos"
            videos={safeVerticalVideos}
            playingVideo={playingVideo}
            isVertical={true}
            onVideoPlay={handleVideoPlay}
            onVideoEnd={handleVideoEnd}
          />
        )}

        {/* Show message if no videos */}
        {safeVideos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600">No videos available at the moment</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Want to know more about our processing facilities?
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
