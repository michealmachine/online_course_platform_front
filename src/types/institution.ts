export interface Institution {
  id: string;
  name: string;
  type: string;
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

export interface InstitutionStats {
  totalInstitutions: number;
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  monthlyGrowth: {
    institutions: number;
    revenue: number;
    students: number;
  };
} 