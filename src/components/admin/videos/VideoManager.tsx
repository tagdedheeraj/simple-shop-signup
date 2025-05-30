
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

    // More lenient video type check
    const isVideoFile = file.type.startsWith('video/') || 
                       file.name.toLowerCase().endsWith('.mp4') ||
                       file.name.toLowerCase().endsWith('.webm') ||
                       file.name.toLowerCase().endsWith('.ogg') ||
                       file.name.toLowerCase().endsWith('.avi') ||
                       file.name.toLowerCase().endsWith('.mov');

    if (!isVideoFile) {
      console.log('Invalid file type:', file.type);
      toast.error('Please select a valid video file (MP4, WebM, OGG, AVI, MOV)');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // Increased to 100MB limit
      console.log('File too large:', file.size);
      toast.error('Video size should be less than 100MB');
      return;
    }

    setUploading(true);
    toast.info('Uploading video... Please wait');
    
    try {
      console.log('Starting file upload...');
      const videoUrl = await saveUploadedFile(file);
      console.log('Video uploaded successfully, URL:', videoUrl);
      
      const newVideo: Video = {
        id: `video-${Date.now()}`,
        title: `${file.name.split('.')[0]} - Video ${videos.length + 1}`,
        description: 'Uploaded video - Please update description',
        videoUrl,
        thumbnail: '/placeholder.svg',
        category: 'wheat'
      };

      console.log('Creating new video object:', newVideo);
      const updatedVideos = [...videos, newVideo];
      saveVideos(updatedVideos);
      
      toast.success('Video uploaded successfully!');
      
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
