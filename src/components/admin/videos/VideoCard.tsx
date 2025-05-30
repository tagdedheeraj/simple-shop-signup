
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Trash2, Play, Edit2 } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: 'wheat' | 'rice';
}

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (videoId: string) => void;
  onThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>, videoId: string) => void;
  onCategoryChange: (videoId: string, category: 'wheat' | 'rice') => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onEdit,
  onDelete,
  onThumbnailUpload,
  onCategoryChange
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{video.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(video)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(video.id)}
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
            onChange={(e) => onThumbnailUpload(e, video.id)}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <select
            value={video.category}
            onChange={(e) => onCategoryChange(video.id, e.target.value as 'wheat' | 'rice')}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="wheat">Wheat (गेहूं)</option>
            <option value="rice">Rice (चावल)</option>
          </select>
        </div>

        <p className="text-sm text-gray-600">{video.description}</p>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
