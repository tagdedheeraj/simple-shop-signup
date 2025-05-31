
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayer from './video/VideoPlayer';
import VideoStats from './video/VideoStats';
import CallToAction from './video/CallToAction';

interface VideoData {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  isVertical: boolean;
  category: string;
}

const ProcessingVideos: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const videos: VideoData[] = [
    {
      id: 'horizontal-main',
      title: 'Lakshmikrupa Agriculture Processing Facility',
      youtubeUrl: 'https://youtu.be/gEYWggl0x9A',
      embedUrl: 'https://www.youtube.com/embed/gEYWggl0x9A',
      isVertical: false,
      category: 'main-facility'
    },
    {
      id: 'vertical-1',
      title: 'Modern Wheat Processing',
      youtubeUrl: 'https://youtube.com/shorts/_A8_k-sJxYw?feature=share',
      embedUrl: 'https://www.youtube.com/embed/_A8_k-sJxYw',
      isVertical: true,
      category: 'wheat-processing'
    },
    {
      id: 'vertical-2',
      title: 'Quality Control Process',
      youtubeUrl: 'https://youtu.be/HIZdUdmGarE',
      embedUrl: 'https://www.youtube.com/embed/HIZdUdmGarE',
      isVertical: true,
      category: 'quality-control'
    },
    {
      id: 'vertical-3',
      title: 'Rice Processing Excellence',
      youtubeUrl: 'https://youtu.be/cOuvngnvlgc',
      embedUrl: 'https://www.youtube.com/embed/cOuvngnvlgc',
      isVertical: true,
      category: 'rice-processing'
    }
  ];

  const horizontalVideo = videos.find(v => !v.isVertical);
  const verticalVideos = videos.filter(v => v.isVertical);

  const handleVideoPlay = (videoId: string) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  const handleVideoTouch = (videoId: string, event: React.TouchEvent) => {
    event.preventDefault();
    handleVideoPlay(videoId);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl">🌾</div>
        <div className="absolute bottom-20 right-10 text-6xl">🚜</div>
        <div className="absolute top-1/2 left-1/4 text-4xl">⚙️</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              ⚙️
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Lakshmikrupa Agriculture
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              🌾
            </motion.div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            Processing Videos
          </h3>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Explore our state-of-the-art wheat and rice processing facilities that 
              ensure the highest quality standards for every grain
            </p>
            
            <VideoStats />
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Enhanced Horizontal Main Video */}
          {horizontalVideo && (
            <motion.div className="max-w-5xl mx-auto">
              {/* Mobile: Show title above video */}
              <div className="text-center mb-8 md:mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <span className="text-2xl md:text-3xl">🏭</span>
                  <span className="md:hidden text-xl">{horizontalVideo.title}</span>
                  <span className="hidden md:inline">Main Processing Facility Tour</span>
                  <span className="text-2xl md:text-3xl">🏭</span>
                </h3>
                <p className="text-gray-600 text-base md:text-lg hidden md:block">Take a comprehensive look at our advanced processing facility</p>
              </div>
              
              <VideoPlayer 
                video={horizontalVideo}
                isPlaying={playingVideo === horizontalVideo.id}
                onPlay={() => handleVideoPlay(horizontalVideo.id)}
                onTouch={(e) => handleVideoTouch(horizontalVideo.id, e)}
              />
              
              <div className="mt-8 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={playingVideo === horizontalVideo.id ? "destructive" : "default"}
                    onClick={() => handleVideoPlay(horizontalVideo.id)}
                    className={`gap-3 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-full shadow-xl transition-all duration-300 ${
                      playingVideo === horizontalVideo.id 
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                        : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                    }`}
                  >
                    {playingVideo === horizontalVideo.id ? (
                      <>
                        <Pause className="h-4 md:h-5 w-4 md:w-5" />
                        Stop Video
                      </>
                    ) : (
                      <>
                        <Play className="h-4 md:h-5 w-4 md:w-5" fill="currentColor" />
                        Watch Full Tour
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Vertical Videos Section */}
          <motion.div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl">✨</span>
                Processing Highlights
                <span className="text-2xl md:text-3xl">✨</span>
              </h3>
              <p className="text-gray-600 text-base md:text-lg">Discover the excellence in every step of our processing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {verticalVideos.map((video) => (
                <motion.div 
                  key={video.id} 
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  {/* Mobile: Show title above video */}
                  <div className="md:hidden text-center mb-4">
                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-amber-700 transition-colors">
                      {video.title}
                    </h4>
                  </div>
                  
                  <VideoPlayer 
                    video={video}
                    isPlaying={playingVideo === video.id}
                    onPlay={() => handleVideoPlay(video.id)}
                    onTouch={(e) => handleVideoTouch(video.id, e)}
                  />
                  
                  <div className="mt-6 text-center">
                    {/* Desktop: Show title below video */}
                    <h4 className="hidden md:block font-bold text-xl text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                      {video.title}
                    </h4>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={playingVideo === video.id ? "destructive" : "outline"}
                        size="lg"
                        onClick={() => handleVideoPlay(video.id)}
                        className={`gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 ${
                          playingVideo === video.id 
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500" 
                            : "border-2 border-amber-500 text-amber-700 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 hover:text-white"
                        }`}
                      >
                        {playingVideo === video.id ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" fill="currentColor" />
                            Watch
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <CallToAction />
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessingVideos;
