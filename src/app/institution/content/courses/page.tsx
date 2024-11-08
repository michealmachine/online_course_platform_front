'use client';

import { useState, useEffect } from "react";
import InstitutionLayout from "@/components/institution/InstitutionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { CourseDialog } from "@/components/institution/content/courses/CourseDialog";
import { useRouter } from "next/navigation";
import { ChapterList } from "@/components/institution/content/courses/ChapterList";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function InstitutionCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    newCoursesThisMonth: 0,
    totalStudents: 0,
    studentGrowth: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [courseChapters, setCourseChapters] = useState<Record<string, any>>({});

  const fetchData = async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        fetch('/course/list?' + new URLSearchParams({
          pageNo: '1',
          pageSize: '10',
          ...(searchQuery && { courseName: searchQuery }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
        })),
        fetch('/course/stats')
      ]);

      const coursesData = await coursesRes.json();
      const statsData = await statsRes.json();

      if (coursesData.code === 0 && Array.isArray(coursesData.data.items)) {
        setCourses(coursesData.data.items);
      }
      if (statsData.code === 0) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter]);

  // 过滤课程列表
  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      (course.name && course.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const fetchCourseChapters = async (courseId: string) => {
    try {
      const response = await fetch(`/teachplan/tree/${courseId}`);
      const result = await response.json();
      if (result.code === 0) {
        setCourseChapters(prev => ({
          ...prev,
          [courseId]: result.data
        }));
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleExpandCourse = async (courseId: string) => {
    if (expandedCourse !== courseId) {
      setExpandedCourse(courseId);
      // 只在展开时获取章节数据
      if (!courseChapters[courseId]) {
        await fetchCourseChapters(courseId);
      }
    } else {
      setExpandedCourse(null);
    }
  };

  if (loading) {
    return <InstitutionLayout title="课程管理">加载中...</InstitutionLayout>;
  }

  return (
    <InstitutionLayout title="课程管理">
      <div className="space-y-6">
        {/* 顶部操作栏 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课程..."
                className="pl-8 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="课程状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="202001">未提交</SelectItem>
                <SelectItem value="202002">审核中</SelectItem>
                <SelectItem value="202003">已发布</SelectItem>
                <SelectItem value="202004">已下线</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2 h-4 w-4" />
            创建课程
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">课程总数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                本月新增 {stats.newCoursesThisMonth} 门课程
              </p>
            </CardContent>
          </Card>
          {/* ... 其他统计卡片 ... */}
        </div>

        {/* 课程列表 */}
        <Card>
          <CardHeader>
            <CardTitle>课程列表</CardTitle>
            <CardDescription>管理您的所有课程内容</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <Collapsible
                  key={course.id}
                  open={expandedCourse === course.id}
                  onOpenChange={() => handleExpandCourse(course.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.studentsCount} 学员 · {course.rating} 评分
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={course.status === '202003' ? 'default' : 'secondary'}>
                            {course.status === '202001' ? '未提交' :
                             course.status === '202002' ? '审核中' :
                             course.status === '202003' ? '已发布' : '已下线'}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCourse(course);
                            }}
                          >
                            编辑
                          </Button>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 border-t">
                        <ChapterList
                          courseId={Number(course.id)}
                          chapters={courseChapters[course.id] || []}
                          onRefresh={() => fetchCourseChapters(course.id)}
                        />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>

        <CourseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          course={selectedCourse}
          onSuccess={fetchData}
        />
      </div>
    </InstitutionLayout>
  );
} 