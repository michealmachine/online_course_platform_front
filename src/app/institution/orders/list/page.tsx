'use client';

import { useState, useEffect } from "react";
import InstitutionLayout from "@/components/institution/InstitutionLayout";
import { DataTable } from "@/components/admin/users/DataTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Order {
  id: string;
  courseId: string;
  courseName: string;
  courseType: 'free' | 'paid';
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'completed' | 'refunded' | 'pending';
  purchaseDate: string;
}

export default function OrderListPage() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/institution/orders');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "courseName",
      header: "课程名称",
      cell: ({ row }) => {
        const courseType = row.original.courseType;
        return (
          <div className="flex items-center gap-2">
            {row.getValue("courseName")}
            <Badge variant={courseType === 'free' ? "secondary" : "default"}>
              {courseType === 'free' ? '免费' : '付费'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "用户名称",
    },
    {
      accessorKey: "userEmail",
      header: "用户邮箱",
    },
    {
      accessorKey: "amount",
      header: "金额",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return amount === 0 ? '免费' : `¥${amount.toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusMap = {
          completed: { label: "已完成", variant: "default" },
          refunded: { label: "已退款", variant: "destructive" },
          pending: { label: "待处理", variant: "warning" },
        };
        const { label, variant } = statusMap[status as keyof typeof statusMap];
        return <Badge variant={variant as any}>{label}</Badge>;
      },
    },
    {
      accessorKey: "purchaseDate",
      header: "购买时间",
    },
  ];

  if (loading) {
    return <InstitutionLayout title="订单管理">加载中...</InstitutionLayout>;
  }

  const totalRevenue = data.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = data.length;
  const paidOrders = data.filter(order => order.courseType === 'paid').length;
  const freeOrders = data.filter(order => order.courseType === 'free').length;

  return (
    <InstitutionLayout title="订单管理">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">总收入</h3>
            <p className="text-2xl font-bold">¥{totalRevenue.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">总订单数</h3>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">付费订单</h3>
            <p className="text-2xl font-bold">{paidOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">免费订单</h3>
            <p className="text-2xl font-bold">{freeOrders}</p>
          </Card>
        </div>

        {/* 筛选工具栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="搜索课程或用户..."
              className="w-[300px]"
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="课程类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部课程</SelectItem>
                <SelectItem value="paid">付费课程</SelectItem>
                <SelectItem value="free">免费课程</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="refunded">已退款</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出数据
          </Button>
        </div>

        {/* 数据表格 */}
        <DataTable columns={columns} data={data} />
      </div>
    </InstitutionLayout>
  );
} 