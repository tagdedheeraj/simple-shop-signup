
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useFirebase from '@/hooks/useFirebase';

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt?: string;
  lastLogin?: string;
  role?: string;
  phone?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllUsers } = useFirebase();

  useEffect(() => {
    // Load users from Firebase
    const loadUsers = async () => {
      setLoading(true);
      try {
        const firebaseUsers = await getAllUsers();
        setUsers(firebaseUsers as User[]);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Failed to load users');
        // Fall back to mock data if Firebase fails
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [getAllUsers]);

  const handleViewUser = (userId: string) => {
    toast.info(`View user ${userId}`);
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Edit user ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    toast.success(`User ${userId} deleted`);
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user =>
    (user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserName = (user: User) => {
    return user.displayName || user.email?.split('@')[0] || 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Registered</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Loading users...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">No users found</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getUserName(user).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserName(user)}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.phone || '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
