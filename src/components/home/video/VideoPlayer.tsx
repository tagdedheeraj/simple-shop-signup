
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoData {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  isVertical: boolean;
  category: string;
}

interface VideoPlayerProps {
  video: VideoData;
  isPlaying: boolean;
  onPlay: () => void;
  onTouch: (event: React.TouchEvent) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isPlaying, onPlay, onTouch }) => {
  return (
    <motion.div 
      className={`${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-amber-200/20`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {isPlaying ? (
        <iframe
          src={`${video.embedUrl}?autoplay=1`}
          className="w-full h-full rounded-2xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🌾</div>
            <div className="absolute bottom-4 right-4 text-4xl">🚜</div>
            <div className="absolute top-1/2 right-8 text-3xl">⚙️</div>
          </div>
          
          <div className="text-center z-10 relative">
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              🌾
            </motion.div>
            {/* Desktop: Show title on video overlay */}
            <h3 className="text-lg font-bold text-gray-800 px-6 mb-2 leading-tight md:block hidden">
              {video.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Premium Quality</span>
            </div>
          </div>
          
          {/* Enhanced Play Button Overlay with Touch support */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10 flex items-center justify-center cursor-pointer"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={onPlay}
            onTouchEnd={onTouch}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-full w-20 h-20 p-0 shadow-2xl border-4 border-white/50 backdrop-blur-sm pointer-events-none"
              >
                <Play className="h-8 w-8 ml-1" fill="currentColor" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Category Badge */}
          <div className="absolute top-6 left-6">
            <motion.span 
              className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              🎥 Processing
            </motion.span>
          </div>

          {/* Quality Badge */}
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Certified</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VideoPlayer;
