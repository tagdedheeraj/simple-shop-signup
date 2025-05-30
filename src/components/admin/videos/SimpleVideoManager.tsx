
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Save, X } from 'lucide-react';

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

  const convertGoogleDriveUrl = (url: string): string => {
    // Convert Google Drive share URL to embed URL
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.googleDriveUrl) {
      toast.error('कृपया title और Google Drive URL दोनों भरें');
      return;
    }

    const video: Video = {
      id: `video-${Date.now()}`,
      title: newVideo.title,
      description: newVideo.description,
      googleDriveUrl: newVideo.googleDriveUrl,
      embedUrl: convertGoogleDriveUrl(newVideo.googleDriveUrl),
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

    const updatedVideos = videos.map(video => 
      video.id === editingVideo.id 
        ? { ...editingVideo, embedUrl: convertGoogleDriveUrl(editingVideo.googleDriveUrl) }
        : video
    );
    saveVideos(updatedVideos);
    setEditingVideo(null);
    toast.success('Video update हो गया');
  };

  const cancelEdit = () => {
    setEditingVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
      </div>

      {/* Add New Video Form */}
      <Card>
        <CardHeader>
          <CardTitle>नया Video Add करें</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              placeholder="Video का title लिखें"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newVideo.description}
              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
              placeholder="Video का description लिखें"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="url">Google Drive Video URL</Label>
            <Input
              id="url"
              value={newVideo.googleDriveUrl}
              onChange={(e) => setNewVideo({ ...newVideo, googleDriveUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
            />
            <p className="text-sm text-gray-500 mt-1">
              Google Drive से video का share link paste करें
            </p>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={newVideo.category} 
              onValueChange={(value: 'wheat' | 'rice') => setNewVideo({ ...newVideo, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat (गेहूं)</SelectItem>
                <SelectItem value="rice">Rice (चावल)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addVideo} className="w-full">
            Video Add करें
          </Button>
        </CardContent>
      </Card>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(video)}
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
              {editingVideo?.id === video.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    placeholder="Title"
                  />
                  <Textarea
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                  />
                  <Input
                    value={editingVideo.googleDriveUrl}
                    onChange={(e) => setEditingVideo({ ...editingVideo, googleDriveUrl: e.target.value })}
                    placeholder="Google Drive URL"
                  />
                  <Select 
                    value={editingVideo.category} 
                    onValueChange={(value: 'wheat' | 'rice') => setEditingVideo({ ...editingVideo, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat (गेहूं)</SelectItem>
                      <SelectItem value="rice">Rice (चावल)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Video Preview */}
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                    <iframe
                      src={video.embedUrl}
                      width="100%"
                      height="100%"
                      allow="autoplay"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      video.category === 'wheat' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {video.category === 'wheat' ? 'गेहूं' : 'चावल'}
                    </span>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">कोई videos नहीं हैं</h3>
            <p className="text-gray-600">अपना पहला video add करने के लिए ऊपर form भरें</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleVideoManager;
