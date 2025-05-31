import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { saveUploadedFile } from '@/utils/file-storage';
import { loadVideosFromStorage, saveVideosToFirebase } from '@/utils/videoLoader';
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

  const loadVideos = async () => {
    console.log('🔄 Loading videos from Firebase...');
    try {
      const loadedVideos = await loadVideosFromStorage();
      console.log('✅ Videos loaded successfully:', loadedVideos.length, 'videos found');
      // Map the loaded videos to match our local Video interface
      const mappedVideos: Video[] = loadedVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl || video.embedUrl || video.googleDriveUrl || '',
        thumbnail: video.thumbnail || '/placeholder.svg',
        category: video.category
      }));
      setVideos(mappedVideos);
    } catch (error) {
      console.error('❌ Error loading videos:', error);
      setVideos([]);
    }
  };

  const saveVideos = async (newVideos: Video[]) => {
    console.log('💾 Saving videos to Firebase:', newVideos.length, 'videos');
    try {
      await saveVideosToFirebase(newVideos);
      setVideos(newVideos);
      console.log('✅ Videos saved successfully');
      toast.success('Videos updated successfully');
    } catch (error) {
      console.error('❌ Error saving videos:', error);
      toast.error('Failed to save videos');
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🚀 Video upload process started');
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('⚠️ No file selected');
      return;
    }

    console.log('📁 File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });

    const videoExtensions = /\.(mp4|webm|ogg|avi|mov|mkv|flv|wmv|m4v|3gp)$/i;
    const isVideoFile = file.type.startsWith('video/') || videoExtensions.test(file.name);

    if (!isVideoFile) {
      console.log('❌ Invalid file type:', file.type);
      toast.error('कृपया एक valid video file select करें (MP4, WebM, AVI, MOV, etc.)');
      return;
    }

    const maxSizeInBytes = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSizeInBytes) {
      console.log('❌ File too large:', file.size, 'bytes, limit:', maxSizeInBytes);
      toast.error(`Video का size 200MB से कम होना चाहिए। Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setUploading(true);
    console.log('⏳ Starting upload process...');
    toast.info('Video upload हो रहा है... कृपया wait करें');
    
    try {
      console.log('📤 Calling saveUploadedFile...');
      const videoUrl = await saveUploadedFile(file);
      console.log('✅ Video uploaded successfully, URL:', videoUrl);
      
      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const videoTitle = file.name.replace(/\.[^/.]+$/, "");
      
      const newVideo: Video = {
        id: videoId,
        title: videoTitle,
        description: 'नया upload किया गया video - कृपया description और category update करें',
        videoUrl,
        thumbnail: '/placeholder.svg',
        category: 'wheat'
      };

      console.log('🎬 Creating new video object:', newVideo);
      const updatedVideos = [...videos, newVideo];
      await saveVideos(updatedVideos);
      
      toast.success('✅ Video successfully upload हो गया! अब आप इसकी details edit कर सकते हैं।');
      
      event.target.value = '';
      
    } catch (error) {
      console.error('❌ Video upload failed with error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error details:', errorMessage);
      toast.error(`Video upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      console.log('🏁 Upload process completed');
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>, videoId: string) => {
    const file = event.target.files?.[0];
    console.log('🖼️ Thumbnail upload for video:', videoId, 'file:', file);
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया एक image file select करें');
      return;
    }

    try {
      console.log('📤 Uploading thumbnail...');
      const thumbnailUrl = await saveUploadedFile(file);
      console.log('✅ Thumbnail uploaded:', thumbnailUrl);
      
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, thumbnail: thumbnailUrl } : video
      );
      await saveVideos(updatedVideos);
      toast.success('Thumbnail update हो गया');
    } catch (error) {
      console.error('❌ Thumbnail upload failed:', error);
      toast.error('Thumbnail upload नहीं हो सका');
    }
  };

  const updateVideo = async (videoId: string, updates: Partial<Video>) => {
    console.log('📝 Updating video:', videoId, 'with:', updates);
    const updatedVideos = videos.map(video => 
      video.id === videoId ? { ...video, ...updates } : video
    );
    await saveVideos(updatedVideos);
  };

  const deleteVideo = async (videoId: string) => {
    console.log('🗑️ Deleting video:', videoId);
    const updatedVideos = videos.filter(video => video.id !== videoId);
    await saveVideos(updatedVideos);
    toast.success('Video delete हो गया');
  };

  const handleSaveEdit = async (video: Video) => {
    await updateVideo(video.id, video);
    setEditingVideo(null);
    toast.success('Video update हो गया');
  };

  const handleCategoryChange = async (videoId: string, category: 'wheat' | 'rice') => {
    await updateVideo(videoId, { category });
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

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800">Video upload हो रहा है... कृपया wait करें</span>
          </div>
        </div>
      )}

      {videos.length === 0 && !uploading && (
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
