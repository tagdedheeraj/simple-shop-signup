import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { getUploadedFileUrl } from '@/utils/file-storage';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
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
      setVideos(JSON.parse(storedVideos));
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

  const getVideoUrl = (url: string) => {
    if (url.startsWith('local-storage://')) {
      return getUploadedFileUrl(url);
    }
    return url;
  };

  const getThumbnailUrl = (url: string) => {
    if (url.startsWith('local-storage://')) {
      return getUploadedFileUrl(url);
    }
    return url;
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

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

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
            Our Processing Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Witness our state-of-the-art wheat and rice processing facilities that ensure 
            the highest quality standards for every grain
          </p>
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {videos.map((video) => (
            <motion.div key={video.id} variants={item}>
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-gray-900">
                    {playingVideo === video.id ? (
                      <video
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        onEnded={() => setPlayingVideo(null)}
                      >
                        <source src={getVideoUrl(video.videoUrl)} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <>
                        <img
                          src={getThumbnailUrl(video.thumbnail)}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
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

                    {/* Video Duration Overlay */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                        2:30
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {video.description}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVideoPlay(video.id)}
                        className="flex items-center gap-2"
                      >
                        {playingVideo === video.id ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Watch Now
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Volume2 className="h-4 w-4" />
                        HD Quality
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Want to see more of our processing facilities?
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Schedule a Visit
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoShowcase;
