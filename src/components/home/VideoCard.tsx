
import React from 'react';
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

interface VideoCardProps {
  video: Video;
  isPlaying: boolean;
  isVertical?: boolean;
  onPlay: () => void;
  onEnd: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  isPlaying, 
  isVertical = false, 
  onPlay, 
  onEnd 
}) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-col md:flex-row'}`}>
          {/* Video Player Section */}
          {isPlaying ? (
            <VideoPlayer
              video={video}
              isVertical={isVertical}
              onEnded={onEnd}
            />
          ) : (
            <VideoThumbnail
              video={video}
              isVertical={isVertical}
              onPlay={onPlay}
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
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              onClick={onPlay}
              className="w-full flex items-center justify-center gap-2"
            >
              {isPlaying ? (
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
  );
};

export default VideoCard;
