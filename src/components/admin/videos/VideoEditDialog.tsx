
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: 'wheat' | 'rice';
}

interface VideoEditDialogProps {
  video: Video;
  onSave: (video: Video) => void;
  onCancel: () => void;
  onChange: (video: Video) => void;
}

const VideoEditDialog: React.FC<VideoEditDialogProps> = ({
  video,
  onSave,
  onCancel,
  onChange
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Edit Video: {video.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            value={video.title}
            onChange={(e) => onChange({ ...video, title: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="edit-description">Description</Label>
          <Input
            id="edit-description"
            value={video.description}
            onChange={(e) => onChange({ ...video, description: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onSave(video)}>
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoEditDialog;
