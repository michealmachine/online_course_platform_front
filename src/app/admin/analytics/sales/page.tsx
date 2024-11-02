'use client';

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/admin/analytics/LineChart";
import { BarChart } from "@/components/admin/analytics/BarChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/admin/analytics/StatCard";
import { Users, BookOpen, DollarSign } from "lucide-react";

interface InstitutionSales {
  id: string;
  name: string;
  courseCount: number;
  studentCount: number;
  totalRevenue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  popularCourses: Array<{
    name: string;
    sales: number;
  }>;
}

interface SalesData {
  institutions: InstitutionSales[];
}

export default function SalesPage() {
  const [data, setData] = useState<SalesData | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/analytics/sales');
        const result = await response.json();
        if (result.data) {
          setData(result.data);
          if (result.data.institutions.length > 0) {
            setSelectedInstitution(result.data.institutions[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return <AdminLayout title="销售统计">加载中...</AdminLayout>;
  }

  const selectedData = selectedInstitution === 'all' 
    ? data.institutions
    : data.institutions.filter(inst => inst.id === selectedInstitution);

  const totalRevenue = selectedData.reduce((sum, inst) => sum + inst.totalRevenue, 0);
  const totalStudents = selectedData.reduce((sum, inst) => sum + inst.studentCount, 0);
  const totalCourses = selectedData.reduce((sum, inst) => sum + inst.courseCount, 0);

  return (
    <AdminLayout title="销售统计">
      <div className="space-y-6">
        {/* 总体统计 */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="总收入"
            value={`¥${totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="总学员数"
            value={totalStudents.toLocaleString()}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="总课程数"
            value={totalCourses.toLocaleString()}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* 机构选择器 */}
        <div className="flex justify-end">
          <Select
            value={selectedInstitution}
            onValueChange={setSelectedInstitution}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择机构" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部机构</SelectItem>
              {data.institutions.map((inst) => (
                <SelectItem key={inst.id} value={inst.id}>
                  {inst.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 机构数据表格 */}
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>机构名称</TableHead>
                <TableHead className="text-right">课程数量</TableHead>
                <TableHead className="text-right">学员数量</TableHead>
                <TableHead className="text-right">总收入</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedData.map((inst) => (
                <TableRow key={inst.id}>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell className="text-right">{inst.courseCount}</TableCell>
                  <TableCell className="text-right">{inst.studentCount}</TableCell>
                  <TableCell className="text-right">¥{inst.totalRevenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 图表 */}
        <div className="grid gap-6 md:grid-cols-2">
          <LineChart
            data={selectedData[0].monthlyRevenue}
            xField="month"
            yField="revenue"
            title="月度收入趋势"
          />
          <BarChart
            data={selectedData[0].popularCourses}
            xField="name"
            yField="sales"
            title="热门课程销量"
          />
        </div>
      </div>
    </AdminLayout>
  );
} 