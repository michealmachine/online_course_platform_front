// 试题类型
export interface Question {
  id: string;
  courseId: string;
  chapterId: string;
  content: string;  // 题目内容
  options: Option[];
  correctOptionId: string;
  createdAt: string;
}

// 选项类型
export interface Option {
  id: string;
  content: string;  // 选项内容
}

// 课程章节类型
export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

// 课程基本信息类型（用于试题管理）
export interface CourseBasic {
  id: string;
  title: string;
  chapters: Chapter[];
  questionCount: number;
} 