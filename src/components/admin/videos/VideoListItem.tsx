
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, ExternalLink } from 'lucide-react';
import VideoEditForm from './VideoEditForm';

interface Video {
  id: string;
  title: string;
  description: string;
  googleDriveUrl: string;
  embedUrl: string;
  category: 'wheat' | 'rice';
}

interface VideoListItemProps {
  video: Video;
  isEditing: boolean;
  editingVideo: Video | null;
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditingVideoChange: (video: Video) => void;
  onOpenInDrive: (url: string) => void;
}

const VideoListItem: React.FC<VideoListItemProps> = ({
  video,
  isEditing,
  editingVideo,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onEditingVideoChange,
  onOpenInDrive
}) => {
  return (
    <Card key={video.id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{video.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenInDrive(video.googleDriveUrl)}
              title="Open in Google Drive"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
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
        {isEditing && editingVideo ? (
          <VideoEditForm
            video={editingVideo}
            onVideoChange={onEditingVideoChange}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            {/* Video Preview */}
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              <iframe
                src={video.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
                title={video.title}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  video.category === 'wheat' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {video.category === 'wheat' ? 'गेहूं' : 'चावल'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenInDrive(video.googleDriveUrl)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in Drive
                </Button>
              </div>
              <p className="text-sm text-gray-600">{video.description}</p>
              <p className="text-xs text-gray-400 break-all">URL: {video.googleDriveUrl}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoListItem;
