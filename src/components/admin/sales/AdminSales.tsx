
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data - would be replaced with real data in a production app
const data = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 1900 },
  { month: 'Mar', sales: 1500 },
  { month: 'Apr', sales: 1700 },
  { month: 'May', sales: 2300 },
  { month: 'Jun', sales: 2100 },
];

const AdminSales: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>All-time revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹58,450</div>
            <p className="text-sm text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Total completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">324</div>
            <p className="text-sm text-muted-foreground mt-1">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>Revenue per order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹180</div>
            <p className="text-sm text-muted-foreground mt-1">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trends</CardTitle>
          <CardDescription>Sales data for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales;
