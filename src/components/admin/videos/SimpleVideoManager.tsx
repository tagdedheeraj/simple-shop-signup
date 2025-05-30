
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import VideoForm from './VideoForm';
import VideoListItem from './VideoListItem';
import EmptyVideoList from './EmptyVideoList';
import { convertGoogleDriveUrl, validateGoogleDriveUrl } from '@/utils/videoUtils';

interface Video {
  id: string;
  title: string;
  description: string;
  googleDriveUrl: string;
  embedUrl: string;
  category: 'wheat' | 'rice';
}

const SimpleVideoManager: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    googleDriveUrl: '',
    category: 'wheat' as 'wheat' | 'rice'
  });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    console.log('🔄 Loading videos from localStorage...');
    try {
      const storedVideos = localStorage.getItem('admin-videos');
      if (storedVideos) {
        const parsedVideos = JSON.parse(storedVideos);
        console.log('✅ Videos loaded:', parsedVideos.length);
        setVideos(parsedVideos);
      }
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      setVideos([]);
    }
  };

  const saveVideos = (newVideos: Video[]) => {
    console.log('💾 Saving videos:', newVideos.length);
    try {
      localStorage.setItem('admin-videos', JSON.stringify(newVideos));
      setVideos(newVideos);
      toast.success('Videos updated successfully');
    } catch (error) {
      console.error('❌ Error saving videos:', error);
      toast.error('Failed to save videos');
    }
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.googleDriveUrl) {
      toast.error('कृपया title और Google Drive URL दोनों भरें');
      return;
    }

    const trimmedUrl = newVideo.googleDriveUrl.trim();
    
    if (!validateGoogleDriveUrl(trimmedUrl)) {
      toast.error('कृपया valid Google Drive URL दें। Example: https://drive.google.com/file/d/FILE_ID/view');
      return;
    }

    const video: Video = {
      id: `video-${Date.now()}`,
      title: newVideo.title,
      description: newVideo.description,
      googleDriveUrl: trimmedUrl,
      embedUrl: convertGoogleDriveUrl(trimmedUrl),
      category: newVideo.category
    };

    const updatedVideos = [...videos, video];
    saveVideos(updatedVideos);
    
    setNewVideo({
      title: '',
      description: '',
      googleDriveUrl: '',
      category: 'wheat'
    });

    toast.success('✅ Video successfully add हो गया!');
  };

  const deleteVideo = (videoId: string) => {
    const updatedVideos = videos.filter(video => video.id !== videoId);
    saveVideos(updatedVideos);
    toast.success('Video delete हो गया');
  };

  const startEdit = (video: Video) => {
    setEditingVideo({ ...video });
  };

  const saveEdit = () => {
    if (!editingVideo) return;

    const trimmedUrl = editingVideo.googleDriveUrl.trim();

    if (!validateGoogleDriveUrl(trimmedUrl)) {
      toast.error('कृपया valid Google Drive URL दें');
      return;
    }

    const updatedVideos = videos.map(video => 
      video.id === editingVideo.id 
        ? { ...editingVideo, googleDriveUrl: trimmedUrl, embedUrl: convertGoogleDriveUrl(trimmedUrl) }
        : video
    );
    saveVideos(updatedVideos);
    setEditingVideo(null);
    toast.success('Video update हो गया');
  };

  const cancelEdit = () => {
    setEditingVideo(null);
  };

  const openVideoInDrive = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
      </div>

      <VideoForm
        formData={newVideo}
        onFormChange={setNewVideo}
        onSubmit={addVideo}
      />

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            isEditing={editingVideo?.id === video.id}
            editingVideo={editingVideo}
            onEdit={startEdit}
            onDelete={deleteVideo}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onEditingVideoChange={setEditingVideo}
            onOpenInDrive={openVideoInDrive}
          />
        ))}
      </div>

      {videos.length === 0 && <EmptyVideoList />}
    </div>
  );
};

export default SimpleVideoManager;
