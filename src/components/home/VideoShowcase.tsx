
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoSection from './VideoSection';
import { useVideoData } from './hooks/useVideoData';
import { useVideoPlayer } from './hooks/useVideoPlayer';

const VideoShowcase: React.FC = () => {
  const { videos, verticalVideos, horizontalVideos } = useVideoData();
  const { playingVideo, handleVideoPlay, handleVideoEnd } = useVideoPlayer();

  // Add extensive debugging to track down the issue
  console.log('🎬 VideoShowcase Debug - Raw data:', {
    videosRaw: videos,
    verticalRaw: verticalVideos,
    horizontalRaw: horizontalVideos
  });

  // Comprehensive safety filter to prevent any undefined/null issues
  const safeFilter = (videoList: any[]) => {
    if (!Array.isArray(videoList)) {
      console.warn('⚠️ Video list is not an array:', videoList);
      return [];
    }
    
    return videoList.filter((video, index) => {
      console.log(`🔍 Checking video ${index}:`, video);
      
      // Basic null/undefined check
      if (!video) {
        console.warn(`❌ Video at index ${index} is null/undefined`);
        return false;
      }
      
      // Object type check
      if (typeof video !== 'object') {
        console.warn(`❌ Video at index ${index} is not an object:`, typeof video);
        return false;
      }
      
      // Required properties check
      if (!video.id || !video.title) {
        console.warn(`❌ Video at index ${index} missing required props:`, {
          hasId: !!video.id,
          hasTitle: !!video.title,
          video
        });
        return false;
      }
      
      // String type checks for URL properties
      const urlProps = ['googleDriveUrl', 'embedUrl', 'videoUrl', 'thumbnail'];
      urlProps.forEach(prop => {
        if (video[prop] !== undefined && typeof video[prop] !== 'string') {
          console.warn(`⚠️ Video ${video.id} has non-string ${prop}:`, video[prop]);
          // Convert to string or set to undefined
          video[prop] = video[prop] ? String(video[prop]) : undefined;
        }
      });
      
      console.log(`✅ Video ${video.id} passed validation`);
      return true;
    });
  };

  // Apply safety filtering to all video arrays
  const safeVerticalVideos = safeFilter(verticalVideos);
  const safeHorizontalVideos = safeFilter(horizontalVideos);
  const safeAllVideos = safeFilter(videos);

  console.log('✅ VideoShowcase - Safe videos after filtering:', {
    total: safeAllVideos.length,
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
        {safeAllVideos.length === 0 && (
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
