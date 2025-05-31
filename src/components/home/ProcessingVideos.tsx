
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Award, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const VideoPlayer = ({ video }: { video: VideoData }) => (
    <motion.div 
      className={`${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-amber-200/20`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {playingVideo === video.id ? (
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
            <h3 className="text-lg font-bold text-gray-800 px-6 mb-2 leading-tight">
              {video.title}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Award className="h-4 w-4 text-amber-600" />
              <span>Premium Quality</span>
            </div>
          </div>
          
          {/* Enhanced Play Button Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10 flex items-center justify-center"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-full w-20 h-20 p-0 shadow-2xl border-4 border-white/50 backdrop-blur-sm"
                onClick={() => handleVideoPlay(video.id)}
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
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
            
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-gray-700">25+ Years Experience</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Award className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-gray-700">Premium Quality</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-gray-700">ISO Certified</span>
              </motion.div>
            </div>
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
            <motion.div variants={item} className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <span className="text-3xl">🏭</span>
                  Main Processing Facility Tour
                  <span className="text-3xl">🏭</span>
                </h3>
                <p className="text-gray-600 text-lg">Take a comprehensive look at our advanced processing facility</p>
              </div>
              
              <VideoPlayer video={horizontalVideo} />
              
              <div className="mt-8 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={playingVideo === horizontalVideo.id ? "destructive" : "default"}
                    onClick={() => handleVideoPlay(horizontalVideo.id)}
                    className={`gap-3 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transition-all duration-300 ${
                      playingVideo === horizontalVideo.id 
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" 
                        : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                    }`}
                  >
                    {playingVideo === horizontalVideo.id ? (
                      <>
                        <Pause className="h-5 w-5" />
                        Stop Video
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" fill="currentColor" />
                        Watch Full Tour
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Vertical Videos Section */}
          <motion.div variants={item} className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <span className="text-3xl">✨</span>
                Processing Highlights
                <span className="text-3xl">✨</span>
              </h3>
              <p className="text-gray-600 text-lg">Discover the excellence in every step of our processing</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {verticalVideos.map((video, index) => (
                <motion.div 
                  key={video.id} 
                  variants={item}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <VideoPlayer video={video} />
                  <div className="mt-6 text-center">
                    <h4 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                      {video.title}
                    </h4>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={playingVideo === video.id ? "destructive" : "outline"}
                        size="lg"
                        onClick={() => handleVideoPlay(video.id)}
                        className={`gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
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

          {/* Enhanced Call to Action */}
          <motion.div 
            variants={item}
            className="text-center mt-16 p-8 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl shadow-xl border border-amber-200"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📞
            </motion.div>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              Want to know more about our processing facilities?
            </h4>
            <p className="text-gray-600 mb-6 text-lg">
              Get in touch with our experts to learn about our advanced processing techniques
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl border-2 border-white/20">
                Contact Us for More Information
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessingVideos;
