export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  imageUrl: string;
  category: string;
  level: string;
  studentsCount: number;
  rating: number;
  tags: string[];
  isFeatured?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface UserAuth {
  id: string;
  username: string;
  name: string;
  role: 'STUDENT' | 'INSTITUTION' | 'ADMIN';
  token: string;
} 