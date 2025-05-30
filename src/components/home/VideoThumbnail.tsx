
import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getGoogleDriveThumbnail, getCachedVideoMetadata, cacheVideoMetadata } from '@/utils/videoUtils';

interface VideoThumbnailProps {
  video: {
    id: string;
    title: string;
    googleDriveUrl?: string;
    embedUrl?: string;
    videoUrl?: string;
    thumbnail?: string;
    category: 'wheat' | 'rice';
  };
  onPlay: () => void;
  isVertical?: boolean;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, onPlay, isVertical = false }) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Get thumbnail URL with proper null/undefined checks
  const getThumbnailUrl = () => {
    try {
      // Check cache first
      const cached = getCachedVideoMetadata(video.id);
      if (cached && cached.thumbnail) {
        return cached.thumbnail;
      }

      // Try to get Google Drive thumbnail with null checks
      const driveUrl = video.googleDriveUrl || video.embedUrl;
      if (driveUrl && typeof driveUrl === 'string' && driveUrl.trim()) {
        const driveThumbnail = getGoogleDriveThumbnail(driveUrl);
        if (driveThumbnail) {
          // Cache the thumbnail URL
          cacheVideoMetadata(video.id, { thumbnail: driveThumbnail });
          return driveThumbnail;
        }
      }

      // Fallback to custom thumbnail
      return video.thumbnail || '';
    } catch (error) {
      console.warn('Error getting thumbnail URL:', error);
      return video.thumbnail || '';
    }
  };

  const thumbnailUrl = getThumbnailUrl();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (thumbnailRef.current) {
      observer.observe(thumbnailRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleThumbnailLoad = () => {
    console.log('🖼️ Thumbnail loaded for video:', video.title);
    setThumbnailLoaded(true);
  };

  const handleThumbnailError = () => {
    console.warn('❌ Thumbnail failed to load for video:', video.title);
    setThumbnailError(true);
    setThumbnailLoaded(true); // Still show fallback
  };

  const handlePlayClick = () => {
    console.log('▶️ Play clicked for video:', video.title);
    onPlay();
  };

  return (
    <div 
      ref={thumbnailRef}
      className={`${isVertical ? 'w-full aspect-[9/16]' : 'md:w-2/3 aspect-video'} relative bg-gray-900 overflow-hidden rounded-lg`}
    >
      {/* Loading Skeleton */}
      {!thumbnailLoaded && isVisible && (
        <Skeleton className="w-full h-full absolute inset-0" />
      )}

      {/* Thumbnail Image */}
      {isVisible && thumbnailUrl && !thumbnailError ? (
        <img
          src={thumbnailUrl}
          alt={`${video.title} thumbnail`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            thumbnailLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleThumbnailLoad}
          onError={handleThumbnailError}
          loading="lazy"
        />
      ) : isVisible && (
        /* Fallback Placeholder */
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {video.category === 'wheat' ? '🌾' : '🌾'}
            </div>
            <p className="text-sm text-gray-600 px-4">
              Click Play button to watch video
            </p>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <Button
          size="lg"
          className="bg-white/90 text-amber-800 hover:bg-white rounded-full w-16 h-16 p-0 shadow-lg transition-transform hover:scale-110"
          onClick={handlePlayClick}
        >
          <Play className="h-6 w-6 ml-1" />
        </Button>
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          video.category === 'wheat' 
            ? 'bg-amber-600 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          {video.category === 'wheat' ? 'Wheat' : 'Rice'}
        </span>
      </div>

      {/* Loading Indicator */}
      {!thumbnailLoaded && isVisible && (
        <div className="absolute bottom-4 right-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
