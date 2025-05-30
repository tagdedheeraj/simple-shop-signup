
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  googleDriveUrl: string;
  embedUrl: string;
  category: 'wheat' | 'rice';
}

interface VideoEditFormProps {
  video: Video;
  onVideoChange: (video: Video) => void;
  onSave: () => void;
  onCancel: () => void;
}

const VideoEditForm: React.FC<VideoEditFormProps> = ({
  video,
  onVideoChange,
  onSave,
  onCancel
}) => {
  const handleUrlChange = (url: string) => {
    console.log('📝 Edit URL change detected:', url);
    onVideoChange({ ...video, googleDriveUrl: url });
  };

  return (
    <div className="space-y-4">
      <Input
        value={video.title}
        onChange={(e) => onVideoChange({ ...video, title: e.target.value })}
        placeholder="Title"
      />
      <Textarea
        value={video.description}
        onChange={(e) => onVideoChange({ ...video, description: e.target.value })}
        placeholder="Description"
        rows={3}
      />
      <Input
        value={video.googleDriveUrl}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="Google Drive URL"
      />
      <Select 
        value={video.category} 
        onValueChange={(value: 'wheat' | 'rice') => onVideoChange({ ...video, category: value })}
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
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default VideoEditForm;
