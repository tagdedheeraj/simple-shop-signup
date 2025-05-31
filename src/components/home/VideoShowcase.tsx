
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoSection from './VideoSection';
import { useVideoData } from './hooks/useVideoData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { RefreshCw } from 'lucide-react';

const VideoShowcase: React.FC = () => {
  const { 
    videos, 
    verticalVideos, 
    horizontalVideos, 
    isLoading,
    reloadVideos 
  } = useVideoData();
  const { playingVideo, handleVideoPlay, handleVideoEnd } = useVideoPlayer();

  // Enhanced debugging for mobile app
  console.log('🎬 VideoShowcase Debug - Current state:', {
    isLoading,
    totalVideos: videos.length,
    verticalCount: verticalVideos.length,
    horizontalCount: horizontalVideos.length,
    isCapacitor: !!(window as any).Capacitor
  });

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading videos...</p>
          </motion.div>
        </div>
      </section>
    );
  }

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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Explore our state-of-the-art wheat and rice processing facilities that 
            ensure the highest quality standards for every grain
          </p>
          
          {/* Reload button for troubleshooting */}
          <Button
            variant="outline"
            size="sm"
            onClick={reloadVideos}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Videos
          </Button>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Horizontal Videos (Lakshmikrupa Agriculture) */}
          {horizontalVideos.length > 0 && (
            <motion.div variants={item}>
              <VideoSection
                title="Lakshmikrupa Agriculture"
                videos={horizontalVideos}
                playingVideo={playingVideo}
                isVertical={false}
                onVideoPlay={handleVideoPlay}
                onVideoEnd={handleVideoEnd}
              />
            </motion.div>
          )}

          {/* Vertical Videos (Wheat Processing, etc.) */}
          {verticalVideos.length > 0 && (
            <motion.div variants={item}>
              <VideoSection
                title="Processing Videos"
                videos={verticalVideos}
                playingVideo={playingVideo}
                isVertical={true}
                onVideoPlay={handleVideoPlay}
                onVideoEnd={handleVideoEnd}
              />
            </motion.div>
          )}

          {/* Enhanced No Videos Message */}
          {videos.length === 0 && !isLoading && (
            <motion.div 
              variants={item}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No videos available at the moment
              </h3>
              <p className="text-gray-600 mb-6">
                Videos will appear here once they are added through the admin panel
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>App Type: {!!(window as any).Capacitor ? 'Mobile App' : 'Web Browser'}</p>
                <p>Storage Check: {localStorage.getItem('admin-videos') ? 'Data Found' : 'No Data'}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action */}
        {videos.length > 0 && (
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
        )}
      </div>
    </section>
  );
};

export default VideoShowcase;
