
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface VideoUploadButtonProps {
  uploading: boolean;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VideoUploadButton: React.FC<VideoUploadButtonProps> = ({
  uploading,
  onVideoUpload
}) => {
  return (
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
        accept="video/*,.mp4,.webm,.ogg,.avi,.mov"
        onChange={onVideoUpload}
        className="hidden"
      />
    </div>
  );
};

export default VideoUploadButton;
