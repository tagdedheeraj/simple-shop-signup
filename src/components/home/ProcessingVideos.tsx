
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
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
    <div className={`${video.isVertical ? 'aspect-[9/16]' : 'aspect-video'} relative bg-gray-900 rounded-lg overflow-hidden`}>
      {playingVideo === video.id ? (
        <iframe
          src={`${video.embedUrl}?autoplay=1`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-4xl mb-2">🌾</div>
            <p className="text-sm text-gray-700 px-4 font-medium">
              {video.title}
            </p>
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white/90 text-amber-800 hover:bg-white rounded-full w-16 h-16 p-0 shadow-lg transition-transform hover:scale-110"
              onClick={() => handleVideoPlay(video.id)}
            >
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-600 text-white">
              Processing
            </span>
          </div>
        </div>
      )}
    </div>
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
    hidden: { opacity: 0, y: 20 },
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
            Lakshmikrupa Agriculture Processing Videos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our state-of-the-art wheat and rice processing facilities that 
            ensure the highest quality standards for every grain
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Horizontal Main Video */}
          {horizontalVideo && (
            <motion.div variants={item} className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Main Processing Facility Tour
              </h3>
              <VideoPlayer video={horizontalVideo} />
              <div className="mt-4 text-center">
                <Button
                  variant={playingVideo === horizontalVideo.id ? "destructive" : "default"}
                  onClick={() => handleVideoPlay(horizontalVideo.id)}
                  className="gap-2"
                >
                  {playingVideo === horizontalVideo.id ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Stop Video
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Watch Full Tour
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Vertical Videos Section */}
          <motion.div variants={item} className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Processing Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verticalVideos.map((video) => (
                <motion.div key={video.id} variants={item}>
                  <VideoPlayer video={video} />
                  <div className="mt-3 text-center">
                    <h4 className="font-medium text-gray-800 mb-2">{video.title}</h4>
                    <Button
                      variant={playingVideo === video.id ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleVideoPlay(video.id)}
                      className="gap-2"
                    >
                      {playingVideo === video.id ? (
                        <>
                          <Pause className="h-3 w-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Watch
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            variants={item}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Want to know more about our processing facilities?
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Contact Us for More Information
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessingVideos;
