
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoFormData {
  title: string;
  description: string;
  googleDriveUrl: string;
  category: 'wheat' | 'rice';
}

interface VideoFormProps {
  formData: VideoFormData;
  onFormChange: (data: VideoFormData) => void;
  onSubmit: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ formData, onFormChange, onSubmit }) => {
  const handleUrlChange = (url: string) => {
    console.log('📝 URL change detected:', url);
    onFormChange({ ...formData, googleDriveUrl: url });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>नया Video Add करें</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Video Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            placeholder="Video का title लिखें"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            placeholder="Video का description लिखें"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="url">Google Drive Video URL</Label>
          <Input
            id="url"
            value={formData.googleDriveUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
          />
          <div className="text-sm text-gray-500 mt-2 space-y-1">
            <p>📋 Supported formats:</p>
            <p>• https://drive.google.com/file/d/FILE_ID/view</p>
            <p>• https://drive.google.com/open?id=FILE_ID</p>
            <p>• Make sure video is set to "Anyone with link can view"</p>
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: 'wheat' | 'rice') => onFormChange({ ...formData, category: value })}
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

        <Button onClick={onSubmit} className="w-full">
          Video Add करें
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoForm;
