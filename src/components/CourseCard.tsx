'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Course } from '@/services/api/types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 w-full">
        <Image 
          src={course.imageUrl} 
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {course.isFeatured && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            精选
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="outline" className="text-xs">{course.level}</Badge>
          {course.tags.slice(0, 2).map((tag) => (
            <Badge variant="outline" className="text-xs" key={tag}>{tag}</Badge>
          ))}
        </div>
        <h3 className="font-semibold leading-none tracking-tight line-clamp-1">{course.title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{course.instructor}</span>
          <span>·</span>
          <span>{course.studentsCount} 学员</span>
        </div>
        <span className="font-medium">¥{course.price}</span>
      </CardFooter>
    </Card>
  );
}; 