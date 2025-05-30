
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface EmptyVideoStateProps {
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmptyVideoState: React.FC<EmptyVideoStateProps> = ({ onVideoUpload }) => {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No videos uploaded</h3>
        <p className="text-gray-600 mb-4">Upload your first video to get started</p>
        <Label htmlFor="video-upload-empty" className="cursor-pointer">
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </Button>
        </Label>
        <Input
          id="video-upload-empty"
          type="file"
          accept="video/*,.mp4,.webm,.ogg,.avi,.mov"
          onChange={onVideoUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default EmptyVideoState;
