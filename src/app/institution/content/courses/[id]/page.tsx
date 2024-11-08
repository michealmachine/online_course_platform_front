'use client';

import { useState, useEffect } from "react";
import InstitutionLayout from "@/components/institution/InstitutionLayout";
import { ChapterList } from "@/components/institution/content/courses/ChapterList";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchChapters = async () => {
    try {
      const response = await fetch(`/teachplan/tree/${params.id}`);
      const result = await response.json();
      if (result.code === 0) {
        setChapters(result.data);
      }
    } catch (error) {
      toast({
        title: "获取章节失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [params.id]);

  if (loading) {
    return <InstitutionLayout title="课程详情">加载中...</InstitutionLayout>;
  }

  return (
    <InstitutionLayout title="课程详情">
      <div className="space-y-6">
        <ChapterList
          courseId={Number(params.id)}
          chapters={chapters}
          onRefresh={fetchChapters}
        />
      </div>
    </InstitutionLayout>
  );
} 