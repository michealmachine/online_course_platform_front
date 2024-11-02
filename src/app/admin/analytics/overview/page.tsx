'use client';

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/analytics/StatCard";
import { LineChart } from "@/components/admin/analytics/LineChart";
import { BarChart } from "@/components/admin/analytics/BarChart";
import { Card } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  Building2,
} from "lucide-react";

interface OverviewStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
  institutionCount: number;
  institutionGrowth: number;
  dailyActiveUsers: {
    date: string;
    count: number;
  }[];
  courseEnrollments: {
    courseName: string;
    count: number;
  }[];
  institutionTrend: {
    month: string;
    count: number;
  }[];
}

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics/overview');
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <AdminLayout title="平台概况">加载中...</AdminLayout>;
  }

  return (
    <AdminLayout title="平台概况">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            title="总用户数"
            value={stats.totalUsers}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: stats.userGrowth, isPositive: stats.userGrowth > 0 }}
          />
          <StatCard
            title="总课程数"
            value={stats.totalCourses}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="总报名数"
            value={stats.totalEnrollments}
            icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="总收入"
            value={`¥${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: stats.revenueGrowth, isPositive: stats.revenueGrowth > 0 }}
          />
          <StatCard
            title="机构数量"
            value={stats.institutionCount}
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: stats.institutionGrowth, isPositive: stats.institutionGrowth > 0 }}
          />
        </div>

        {/* 图表 */}
        <div className="grid gap-6 md:grid-cols-2">
          <LineChart
            data={stats.dailyActiveUsers}
            xField="date"
            yField="count"
            title="日活跃用户"
          />
          <BarChart
            data={stats.courseEnrollments}
            xField="courseName"
            yField="count"
            title="课程报名TOP10"
          />
        </div>

        {/* 机构趋势 */}
        <div className="grid gap-6 md:grid-cols-2">
          <LineChart
            data={stats.institutionTrend}
            xField="month"
            yField="count"
            title="机构增长趋势"
          />
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">机构分布</h3>
            {/* 这里可以添加机构类型分布的饼图 */}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 