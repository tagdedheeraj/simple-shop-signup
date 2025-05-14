
import React from 'react';
import AdminUsers from '@/components/admin/users/AdminUsers';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminUsersPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminUsers />
    </AdminLayout>
  );
};

export default AdminUsersPage;
