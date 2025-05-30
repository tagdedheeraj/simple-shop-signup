
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { convertGoogleDriveUrl } from '@/utils/videoUtils';

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
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('⏰ Video taking longer than expected to load:', video.title);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [video.id, loadStartTime, isLoading, video.title]);

  const getEmbedUrl = () => {
    console.log('🎥 Getting embed URL for video:', video.title);
    
    // If we have a direct embedUrl, use it
    if (video.embedUrl) {
      console.log('📺 Using embedUrl:', video.embedUrl);
      return video.embedUrl;
    }
    
    // If we have googleDriveUrl, convert it to proper embed format
    if (video.googleDriveUrl) {
      const convertedUrl = convertGoogleDriveUrl(video.googleDriveUrl);
      console.log('🔄 Converted Google Drive URL:', convertedUrl);
      return convertedUrl;
    }
    
    // Fallback to videoUrl
    if (video.videoUrl) {
      console.log('📹 Using videoUrl:', video.videoUrl);
      return video.videoUrl;
    }
    
    console.warn('❌ No video URL found for:', video.title);
    return null;
  };

  const embedUrl = getEmbedUrl();

  const handleIframeLoad = () => {
    const loadTime = Date.now() - loadStartTime;
    console.log(`📊 Video iframe loaded in ${loadTime}ms:`, video.title);
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error('❌ Video iframe failed to load:', video.title);
    setHasError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    const loadTime = Date.now() - loadStartTime;
    console.log(`📊 Video element loaded in ${loadTime}ms:`, video.title);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    console.error('❌ Video element failed to load:', video.title);
    setHasError(true);
    setIsLoading(false);
  };

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

  if (!embedUrl) {
    return (
      <div className={`${isVertical ? 'w-full aspect-[9/16]' : 'md:w-2/3 aspect-video'} relative bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-8">
          <div className="text-gray-500 text-4xl mb-4">📹</div>
          <p className="text-gray-600">No video source available</p>
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

      {/* Video Player - Check if it's a Google Drive embed URL */}
      {embedUrl.includes('drive.google.com') ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          title={video.title}
          loading="lazy"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        <video
          className="w-full h-full object-cover"
          controls
          autoPlay
          onEnded={onEnded}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          preload="metadata"
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
