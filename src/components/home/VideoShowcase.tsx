
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

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

const VideoShowcase: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const storedVideos = localStorage.getItem('admin-videos');
    if (storedVideos) {
      const adminVideos = JSON.parse(storedVideos);
      console.log('📺 Loaded admin videos:', adminVideos);
      setVideos(adminVideos);
    } else {
      // Fallback placeholder videos if no admin videos are found
      setVideos([
        {
          id: 'wheat-processing-1',
          title: 'Premium Wheat Processing',
          description: 'Traditional wheat processing methods ensuring quality and purity',
          thumbnail: '/placeholder.svg',
          videoUrl: '/videos/wheat-processing.mp4',
          category: 'wheat'
        },
        {
          id: 'rice-processing-1',
          title: 'Rice Milling Excellence',
          description: 'Modern rice processing techniques for superior grain quality',
          thumbnail: '/placeholder.svg',
          videoUrl: '/videos/rice-processing.mp4',
          category: 'rice'
        }
      ]);
    }
  };

  const handleVideoPlay = (videoId: string) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);
  };

  // Function to check if video should be displayed vertically
  const isVerticalVideo = (video: Video) => {
    const title = video.title.toLowerCase();
    return title.includes('wheat processing') || 
           title.includes('wheat') || 
           title.includes('processing');
  };

  // Function to check if video is Lakshmikrupa Agriculture
  const isLakshmikrupaVideo = (video: Video) => {
    return video.title.toLowerCase().includes('lakshmikrupa agriculture');
  };

  // Separate videos into categories
  const verticalVideos = videos.filter(video => 
    isVerticalVideo(video) && !isLakshmikrupaVideo(video)
  );
  const horizontalVideos = videos.filter(video => 
    isLakshmikrupaVideo(video)
  );

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

  const renderVideoCard = (video: Video, isVertical: boolean = false) => (
    <motion.div key={video.id} variants={item}>
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className={`flex ${isVertical ? 'flex-col' : 'flex-col md:flex-row'}`}>
            {/* Video Player Section */}
            <div className={`${isVertical ? 'w-full aspect-[9/16]' : 'md:w-2/3 aspect-video'} relative bg-gray-900`}>
              {playingVideo === video.id && video.embedUrl ? (
                <iframe
                  src={`${video.embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-full h-full"
                  title={video.title}
                  loading="lazy"
                />
              ) : playingVideo === video.id && video.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setPlayingVideo(null)}
                  preload="metadata"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <>
                  {/* Video Thumbnail */}
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {video.category === 'wheat' ? '🌾' : '🌾'}
                      </div>
                      <p className="text-sm text-gray-600 px-4">
                        Video देखने के लिए Play बटन दबाएं
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/90 text-amber-800 hover:bg-white rounded-full w-16 h-16 p-0 shadow-lg"
                      onClick={() => handleVideoPlay(video.id)}
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                </>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  video.category === 'wheat' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {video.category === 'wheat' ? 'गेहूं' : 'चावल'}
                </span>
              </div>
            </div>

            {/* Video Info Section */}
            <div className={`${isVertical ? 'w-full' : 'md:w-1/3'} p-6 flex flex-col justify-center`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {video.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {video.description}
              </p>
              
              {/* Single Action Button */}
              <Button
                variant={playingVideo === video.id ? "destructive" : "default"}
                size="sm"
                onClick={() => handleVideoPlay(video.id)}
                className="w-full flex items-center justify-center gap-2"
              >
                {playingVideo === video.id ? (
                  <>
                    <Pause className="h-4 w-4" />
                    बंद करें
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Video देखें
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
            Lakshmikrupa Agriculture Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            हमारी अत्याधुनिक गेहूं और चावल प्रसंस्करण सुविधाओं को देखें जो 
            हर अनाज के लिए उच्चतम गुणवत्ता मानकों को सुनिश्चित करती हैं
          </p>
        </motion.div>

        {/* Horizontal Videos (Lakshmikrupa Agriculture) */}
        {horizontalVideos.length > 0 && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto space-y-6 mb-12"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Lakshmikrupa Agriculture
            </h3>
            {horizontalVideos.map((video) => renderVideoCard(video, false))}
          </motion.div>
        )}

        {/* Vertical Videos (Wheat Processing, etc.) */}
        {verticalVideos.length > 0 && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Processing Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verticalVideos.map((video) => renderVideoCard(video, true))}
            </div>
          </motion.div>
        )}

        {/* Show message if no videos */}
        {videos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600">कोई videos उपलब्ध नहीं हैं</p>
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
            हमारी processing सुविधाओं के बारे में और जानना चाहते हैं?
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            हमसे संपर्क करें
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
