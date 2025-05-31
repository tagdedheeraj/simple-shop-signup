
import { Video } from '@/types/video';
import { db } from '@/services/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const VIDEOS_COLLECTION = 'admin-videos';

export const loadVideosFromStorage = async (): Promise<Video[]> => {
  try {
    const isCapacitor = !!(window as any).Capacitor;
    
    console.log(`📱 ${isCapacitor ? 'Mobile' : 'Web'} app - loading videos from Firebase`);
    
    // Get videos from Firebase instead of localStorage
    const videosSnapshot = await getDocs(collection(db, VIDEOS_COLLECTION));
    const adminVideos = videosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('📺 Found admin videos in Firebase:', adminVideos.length, adminVideos);
    
    // Return all videos without strict validation to see what we have
    return adminVideos.map((video: any, index: number) => {
      console.log(`Processing video ${index}:`, video);
      
      const cleanVideo: Video = {
        id: String(video.id || index),
        title: String(video.title || 'Untitled Video'),
        description: String(video.description || ''),
        category: (video.category === 'rice' ? 'rice' : 'wheat') as 'wheat' | 'rice'
      };

      if (video.googleDriveUrl) {
        cleanVideo.googleDriveUrl = video.googleDriveUrl;
      }
      
      if (video.embedUrl) {
        cleanVideo.embedUrl = video.embedUrl;
      }
      
      if (video.videoUrl) {
        cleanVideo.videoUrl = video.videoUrl;
      }
      
      if (video.thumbnail) {
        cleanVideo.thumbnail = video.thumbnail;
      }

      console.log('✅ Processed video:', cleanVideo);
      return cleanVideo;
    });
    
  } catch (error) {
    console.error('❌ Error loading videos from Firebase:', error);
    return [];
  }
};

export const saveVideosToFirebase = async (videos: Video[]): Promise<void> => {
  try {
    console.log('💾 Saving videos to Firebase:', videos.length);
    
    for (const video of videos) {
      await setDoc(doc(db, VIDEOS_COLLECTION, video.id), video);
    }
    
    console.log('✅ Videos saved to Firebase successfully');
  } catch (error) {
    console.error('❌ Error saving videos to Firebase:', error);
    throw error;
  }
};
