
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail, User as UserIcon } from 'lucide-react';
import useFirebase from '@/hooks/useFirebase';

interface UserData {
  id: string;
  uid?: string;
  email?: string;
  displayName?: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  photoUrl?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllUsers } = useFirebase();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        setUsers(allUsers as UserData[]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [getAllUsers]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getUserInitials = (name?: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage registered users in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.photoUrl} alt={user.displayName} />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {getUserInitials(user.displayName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.displayName || 'Unnamed User'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            user.role === 'admin' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}>
                            {user.role || 'user'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          {formatDate(user.lastLogin)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center p-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <UserIcon className="h-10 w-10 text-gray-300" />
                          <p>No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
