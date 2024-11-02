export interface OverviewStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
  institutionCount: number;
  institutionGrowth: number;
  dailyActiveUsers: Array<{
    date: string;
    count: number;
  }>;
  courseEnrollments: Array<{
    courseName: string;
    count: number;
  }>;
  institutionTrend: Array<{
    month: string;
    count: number;
  }>;
  institutionTypes: Array<{
    type: string;
    count: number;
  }>;
}

export interface SalesStats {
  institutions: Institution[];
  totalStats: InstitutionStats;
} 