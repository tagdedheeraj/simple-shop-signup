
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Sample hero banner data - in a real app, this would come from your database
const initialHeroBanners = [
  {
    id: '1',
    title: 'Fresh & Healthy Organic Products',
    subtitle: 'Discover locally-sourced organic fruits, vegetables, and agricultural products for a healthier lifestyle',
    imageUrl: '/lovable-uploads/2a6a68af-beec-4906-b6e9-5eb249505820.png',
    isActive: true
  }
];

const HeroBannerManager: React.FC = () => {
  const [banners, setBanners] = useState(initialHeroBanners);
  const [currentBanner, setCurrentBanner] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleSaveEdit = () => {
    if (!currentBanner) return;
    
    // Update the banner in the list
    setBanners(prev => 
      prev.map(banner => 
        banner.id === currentBanner.id ? currentBanner : banner
      )
    );
    
    toast.success('Banner updated successfully');
    setIsEditDialogOpen(false);
  };
  
  const handleDelete = () => {
    if (!currentBanner) return;
    
    // Remove the banner from the list
    setBanners(prev => prev.filter(banner => banner.id !== currentBanner.id));
    
    toast.success('Banner deleted successfully');
    setIsDeleteDialogOpen(false);
  };
  
  const handleAdd = () => {
    if (!currentBanner?.title || !currentBanner?.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Add the new banner to the list
    const newBanner = {
      ...currentBanner,
      id: Date.now().toString()
    };
    
    setBanners(prev => [...prev, newBanner]);
    
    toast.success('Banner added successfully');
    setIsAddDialogOpen(false);
    setCurrentBanner(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hero Banners</h2>
          <p className="text-muted-foreground">
            Manage your website's hero section banners.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setCurrentBanner({
                title: '',
                subtitle: '',
                imageUrl: '',
                isActive: true
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Hero Banner</DialogTitle>
              <DialogDescription>
                Create a new banner for your website's hero section.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentBanner?.title || ''}
                  onChange={(e) => setCurrentBanner({...currentBanner, title: e.target.value})}
                  placeholder="Enter banner title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={currentBanner?.subtitle || ''}
                  onChange={(e) => setCurrentBanner({...currentBanner, subtitle: e.target.value})}
                  placeholder="Enter banner subtitle"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={currentBanner?.imageUrl || ''}
                  onChange={(e) => setCurrentBanner({...currentBanner, imageUrl: e.target.value})}
                  placeholder="Enter image URL"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a full URL or upload path to an image
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Banner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={16/9}>
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              
              <div className="absolute top-2 right-2 flex space-x-2">
                <Dialog open={isEditDialogOpen && currentBanner?.id === banner.id} onOpenChange={(open) => {
                  setIsEditDialogOpen(open);
                  if (open) setCurrentBanner(banner);
                }}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Edit Hero Banner</DialogTitle>
                      <DialogDescription>
                        Make changes to the hero banner.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          value={currentBanner?.title || ''}
                          onChange={(e) => setCurrentBanner({...currentBanner, title: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-subtitle">Subtitle</Label>
                        <Textarea
                          id="edit-subtitle"
                          value={currentBanner?.subtitle || ''}
                          onChange={(e) => setCurrentBanner({...currentBanner, subtitle: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                          id="edit-image"
                          value={currentBanner?.imageUrl || ''}
                          onChange={(e) => setCurrentBanner({...currentBanner, imageUrl: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-active"
                          checked={currentBanner?.isActive || false}
                          onChange={(e) => setCurrentBanner({...currentBanner, isActive: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="edit-active">Active</Label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSaveEdit}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isDeleteDialogOpen && currentBanner?.id === banner.id} onOpenChange={(open) => {
                  setIsDeleteDialogOpen(open);
                  if (open) setCurrentBanner(banner);
                }}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="destructive" className="rounded-full">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Banner</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this banner? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg truncate">{banner.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {banner.subtitle}
              </p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeroBannerManager;
