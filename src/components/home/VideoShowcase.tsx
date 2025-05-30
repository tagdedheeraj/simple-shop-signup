
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import VideoThumbnail from './VideoThumbnail';
import VideoPlayer from './VideoPlayer';

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
  const [loadingStats, setLoadingStats] = useState<Record<string, number>>({});

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
          thumbnail: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          videoUrl: '/videos/wheat-processing.mp4',
          category: 'wheat'
        },
        {
          id: 'rice-processing-1',
          title: 'Rice Milling Excellence',
          description: 'Modern rice processing techniques for superior grain quality',
          thumbnail: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          videoUrl: '/videos/rice-processing.mp4',
          category: 'rice'
        }
      ]);
    }
  };

  const handleVideoPlay = (videoId: string) => {
    const startTime = Date.now();
    setLoadingStats(prev => ({ ...prev, [videoId]: startTime }));
    setPlayingVideo(playingVideo === videoId ? null : videoId);
    
    console.log('🎬 Video play triggered:', videoId);
  };

  const handleVideoEnd = (videoId: string) => {
    console.log('🏁 Video ended:', videoId);
    setPlayingVideo(null);
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
            {playingVideo === video.id ? (
              <VideoPlayer
                video={video}
                isVertical={isVertical}
                onEnded={() => handleVideoEnd(video.id)}
              />
            ) : (
              <VideoThumbnail
                video={video}
                isVertical={isVertical}
                onPlay={() => handleVideoPlay(video.id)}
              />
            )}

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
                    Stop Video
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Watch Video
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
            Lakshmikrupa Agriculture Processing Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our state-of-the-art wheat and rice processing facilities that 
            ensure the highest quality standards for every grain
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
            <p className="text-gray-600">No videos available</p>
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
