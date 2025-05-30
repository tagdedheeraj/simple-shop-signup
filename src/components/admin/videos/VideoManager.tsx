
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Upload, Trash2, Play, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { saveUploadedFile } from '@/utils/file-storage';

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
    const storedVideos = localStorage.getItem('admin-videos');
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  };

  const saveVideos = (newVideos: Video[]) => {
    localStorage.setItem('admin-videos', JSON.stringify(newVideos));
    setVideos(newVideos);
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast.error('Video size should be less than 50MB');
      return;
    }

    setUploading(true);
    try {
      const videoUrl = await saveUploadedFile(file);
      
      const newVideo: Video = {
        id: `video-${Date.now()}`,
        title: `New Video ${videos.length + 1}`,
        description: 'Video description',
        videoUrl,
        thumbnail: '/placeholder.svg',
        category: 'wheat'
      };

      const updatedVideos = [...videos, newVideo];
      saveVideos(updatedVideos);
      toast.success('Video uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>, videoId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const thumbnailUrl = await saveUploadedFile(file);
      const updatedVideos = videos.map(video => 
        video.id === videoId ? { ...video, thumbnail: thumbnailUrl } : video
      );
      saveVideos(updatedVideos);
      toast.success('Thumbnail updated');
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    }
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    const updatedVideos = videos.map(video => 
      video.id === videoId ? { ...video, ...updates } : video
    );
    saveVideos(updatedVideos);
  };

  const deleteVideo = (videoId: string) => {
    const updatedVideos = videos.filter(video => video.id !== videoId);
    saveVideos(updatedVideos);
    toast.success('Video deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="video-upload" className="cursor-pointer">
            <Button disabled={uploading} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </Label>
          <Input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingVideo(video)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteVideo(video.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <AspectRatio ratio={16/9}>
                <div className="relative w-full h-full bg-gray-100 rounded overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </AspectRatio>

              <div className="space-y-2">
                <Label htmlFor={`thumbnail-${video.id}`} className="text-sm font-medium">
                  Update Thumbnail
                </Label>
                <Input
                  id={`thumbnail-${video.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailUpload(e, video.id)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <select
                  value={video.category}
                  onChange={(e) => updateVideo(video.id, { category: e.target.value as 'wheat' | 'rice' })}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="wheat">Wheat (गेहूं)</option>
                  <option value="rice">Rice (चावल)</option>
                </select>
              </div>

              <p className="text-sm text-gray-600">{video.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingVideo && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Video: {editingVideo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingVideo.title}
                onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editingVideo.description}
                onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => {
                updateVideo(editingVideo.id, editingVideo);
                setEditingVideo(null);
                toast.success('Video updated');
              }}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingVideo(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoManager;
