'use client';

import { useEffect, useState } from 'react';
import { CourseCard } from '@/components/CourseCard';
import { CategoryNav } from '@/components/CategoryNav';
import { Course, Category, ApiResponse } from '@/services/api/types';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/categories')
        ]);
        
        const coursesData: ApiResponse<Course[]> = await coursesRes.json();
        const categoriesData: ApiResponse<Category[]> = await categoriesRes.json();
        
        setCourses(coursesData.data);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = selectedCategory
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  const featuredCourses = courses.filter(course => course.isFeatured);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              探索学习的无限可能
            </h1>
            <p className="text-xl text-muted-foreground">
              精选优质课程，助你实现职业理想
            </p>
            <div className="mt-8">
              <Button size="lg">
                开始学习
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Courses */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              精选课程
            </h2>
            <Button variant="ghost" size="sm">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* All Courses */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              所有课程
            </h2>
          </div>
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
