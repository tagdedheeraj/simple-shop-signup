
import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Safe thumbnail URL extraction with comprehensive null checks
  const getThumbnailUrl = () => {
    try {
      // Return custom thumbnail if available and valid
      if (video.thumbnail && typeof video.thumbnail === 'string' && video.thumbnail.trim()) {
        return video.thumbnail;
      }

      // Check Google Drive URLs with proper validation
      const driveUrl = video.googleDriveUrl || video.embedUrl;
      if (driveUrl && typeof driveUrl === 'string' && driveUrl.trim()) {
        // Simple validation for Google Drive URLs
        if (driveUrl.includes('drive.google.com') || driveUrl.includes('docs.google.com')) {
          // Extract file ID safely
          const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/) ||
                             driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/) ||
                             driveUrl.match(/docs\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/);
          
          if (fileIdMatch && fileIdMatch[1]) {
            return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w400-h300`;
          }
        }
      }

      // Return empty string if no valid thumbnail found
      return '';
    } catch (error) {
      console.warn('Error getting thumbnail URL for video:', video.id, error);
      return '';
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
              {video.title}
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
