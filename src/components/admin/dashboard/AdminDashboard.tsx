
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: 'Total Products',
      value: '125',
      description: 'Manage your product inventory',
      icon: Package,
      link: '/admin/products',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Total Users',
      value: '2,340',
      description: 'Active user accounts',
      icon: Users, 
      link: '/admin/users',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Total Sales',
      value: '₹43,594',
      description: 'Monthly revenue',
      icon: BarChart3,
      link: '/admin/sales',
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Growth',
      value: '+28%',
      description: 'Compared to last month',
      icon: TrendingUp,
      link: '/admin/sales',
      color: 'bg-orange-50 text-orange-700',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your website's performance and management tools.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(stat.link)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Overview of the latest customer orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent orders to display.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Your best-selling products this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No product statistics to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
