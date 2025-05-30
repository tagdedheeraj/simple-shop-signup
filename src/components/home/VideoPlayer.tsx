
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { convertGoogleDriveUrl, preloadVideo } from '@/utils/videoUtils';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    googleDriveUrl?: string;
    embedUrl?: string;
    videoUrl?: string;
  };
  isVertical?: boolean;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isVertical = false, onEnded }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    // Track video load time for performance monitoring
    const handleLoad = () => {
      const loadTime = Date.now() - loadStartTime;
      console.log(`📊 Video loaded in ${loadTime}ms:`, video.title);
      setIsLoading(false);
    };

    const handleError = () => {
      console.error('❌ Video failed to load:', video.title);
      setHasError(true);
      setIsLoading(false);
    };

    // Set up load monitoring
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('⏰ Video taking longer than expected to load:', video.title);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [video.id, loadStartTime, isLoading, video.title]);

  const getOptimizedEmbedUrl = () => {
    if (video.embedUrl) {
      // Add performance optimization parameters
      const url = new URL(video.embedUrl);
      url.searchParams.set('autoplay', '1');
      url.searchParams.set('modestbranding', '1');
      url.searchParams.set('rel', '0');
      url.searchParams.set('showinfo', '0');
      url.searchParams.set('controls', '1');
      return url.toString();
    }
    
    if (video.googleDriveUrl) {
      const convertedUrl = convertGoogleDriveUrl(video.googleDriveUrl);
      const url = new URL(convertedUrl);
      url.searchParams.set('autoplay', '1');
      return url.toString();
    }
    
    return video.videoUrl;
  };

  const embedUrl = getOptimizedEmbedUrl();

  if (hasError) {
    return (
      <div className={`${isVertical ? 'w-full aspect-[9/16]' : 'md:w-2/3 aspect-video'} relative bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">Failed to load video</p>
          <p className="text-sm text-gray-400 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isVertical ? 'w-full aspect-[9/16]' : 'md:w-2/3 aspect-video'} relative bg-gray-900`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      {embedUrl && video.embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="w-full h-full"
          title={video.title}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      ) : embedUrl && video.videoUrl ? (
        <video
          className="w-full h-full object-cover"
          controls
          autoPlay
          onEnded={onEnded}
          onLoadedData={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          preload="metadata"
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <p className="text-gray-600">No video source available</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
