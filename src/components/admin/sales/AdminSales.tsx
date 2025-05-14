
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SaleData {
  id: string;
  customerName: string;
  productName: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'refunded';
}

const mockSalesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

const mockRecentSales: SaleData[] = [
  { 
    id: 'sale-1', 
    customerName: 'Rahul Mehta', 
    productName: 'Premium Basmati Rice (5kg)',
    date: '2025-05-10T12:30:00',
    amount: 450,
    status: 'completed'
  },
  { 
    id: 'sale-2', 
    customerName: 'Priya Singh', 
    productName: 'Fresh Pomegranate (1kg)',
    date: '2025-05-09T14:45:00',
    amount: 180,
    status: 'completed'
  },
  { 
    id: 'sale-3', 
    customerName: 'Vikram Patel', 
    productName: 'Organic Wheat Flour (10kg)',
    date: '2025-05-08T09:15:00',
    amount: 520,
    status: 'processing'
  },
  { 
    id: 'sale-4', 
    customerName: 'Smita Joshi', 
    productName: 'Yellow Onions (3kg)',
    date: '2025-05-07T16:20:00',
    amount: 120,
    status: 'completed'
  },
  { 
    id: 'sale-5', 
    customerName: 'Arjun Kumar', 
    productName: 'Mixed Vegetables Basket',
    date: '2025-05-06T11:10:00',
    amount: 350,
    status: 'refunded'
  },
];

const AdminSales: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          Track your sales performance and revenue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>For all time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹43,594</div>
            <p className="text-xs text-green-600 mt-1">+28% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>For current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹12,450</div>
            <p className="text-xs text-green-600 mt-1">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>For all time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">248</div>
            <p className="text-xs text-green-600 mt-1">+32% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Overview</CardTitle>
          <CardDescription>View your sales performance over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Your most recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.customerName}</TableCell>
                  <TableCell className="hidden md:table-cell">{sale.productName}</TableCell>
                  <TableCell>₹{sale.amount}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(sale.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      sale.status === 'completed' 
                        ? 'bg-green-50 text-green-700' 
                        : sale.status === 'processing'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSales;
