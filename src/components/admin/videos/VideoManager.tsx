
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { saveUploadedFile } from '@/utils/file-storage';
import VideoUploadButton from './VideoUploadButton';
import EmptyVideoState from './EmptyVideoState';
import VideoCard from './VideoCard';
import VideoEditDialog from './VideoEditDialog';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: 'wheat' | 'rice';
}

const VideoManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    console.log('Loading videos from localStorage...');
    const storedVideos = localStorage.getItem('admin-videos');
    if (storedVideos) {
      const parsedVideos = JSON.parse(storedVideos);
      console.log('Videos loaded:', parsedVideos);
      setVideos(parsedVideos);
    } else {
      console.log('No videos found in localStorage');
      setVideos([]);
    }
  };

  const saveVideos = (newVideos: Video[]) => {
    console.log('Saving videos to localStorage:', newVideos);
    localStorage.setItem('admin-videos', JSON.stringify(newVideos));
    setVideos(newVideos);
    toast.success('Videos updated successfully');
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('Video upload started, file:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check if it's a video file
    const isVideoFile = file.type.startsWith('video/') || 
                       /\.(mp4|webm|ogg|avi|mov|mkv|flv|wmv)$/i.test(file.name);

    if (!isVideoFile) {
      console.log('Invalid file type:', file.type);
      toast.error('Please select a valid video file (MP4, WebM, OGG, AVI, MOV, etc.)');
      return;
    }

    // Check file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      console.log('File too large:', file.size);
      toast.error('Video size should be less than 200MB');
      return;
    }

    setUploading(true);
    toast.info('Uploading video... This may take a few minutes');
    
    try {
      console.log('Starting file upload...');
      const videoUrl = await saveUploadedFile(file);
      console.log('Video uploaded successfully, URL:', videoUrl);
      
      // Generate a thumbnail placeholder
      const thumbnailUrl = '/placeholder.svg';
      
      const newVideo: Video = {
        id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: 'Newly uploaded video - Please update description and category',
        videoUrl,
        thumbnail: thumbnailUrl,
        category: 'wheat' // Default category
      };

      console.log('Creating new video object:', newVideo);
      const updatedVideos = [...videos, newVideo];
      saveVideos(updatedVideos);
      
      toast.success('Video uploaded successfully! You can now edit its details.');
      
      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Video upload failed:', error);
      toast.error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>, videoId: string) => {
    const file = event.target.files?.[0];
    console.log('Thumbnail upload for video:', videoId, 'file:', file);
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      console.log('Uploading thumbnail...');
      const thumbnailUrl = await saveUploadedFile(file);
      console.log('Thumbnail uploaded:', thumbnailUrl);
      
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, thumbnail: thumbnailUrl } : video
      );
      saveVideos(updatedVideos);
      toast.success('Thumbnail updated');
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      toast.error('Failed to upload thumbnail');
    }
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    console.log('Updating video:', videoId, 'with:', updates);
    const updatedVideos = videos.map(video => 
      video.id === videoId ? { ...video, ...updates } : video
    );
    saveVideos(updatedVideos);
  };

  const deleteVideo = (videoId: string) => {
    console.log('Deleting video:', videoId);
    const updatedVideos = videos.filter(video => video.id !== videoId);
    saveVideos(updatedVideos);
    toast.success('Video deleted');
  };

  const handleSaveEdit = (video: Video) => {
    updateVideo(video.id, video);
    setEditingVideo(null);
    toast.success('Video updated');
  };

  const handleCategoryChange = (videoId: string, category: 'wheat' | 'rice') => {
    updateVideo(videoId, { category });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <VideoUploadButton 
          uploading={uploading}
          onVideoUpload={handleVideoUpload}
        />
      </div>

      {videos.length === 0 && (
        <EmptyVideoState onVideoUpload={handleVideoUpload} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={setEditingVideo}
            onDelete={deleteVideo}
            onThumbnailUpload={handleThumbnailUpload}
            onCategoryChange={handleCategoryChange}
          />
        ))}
      </div>

      {editingVideo && (
        <VideoEditDialog
          video={editingVideo}
          onSave={handleSaveEdit}
          onCancel={() => setEditingVideo(null)}
          onChange={setEditingVideo}
        />
      )}
    </div>
  );
};

export default VideoManager;
