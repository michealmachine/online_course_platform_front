import { http, HttpResponse } from 'msw';
import { Course, Category, UserAuth } from '@/services/api/types';

const mockCategories: Category[] = [
  { id: '1', name: '前端开发', icon: '💻' },
  { id: '2', name: '后端开发', icon: '⚙️' },
  { id: '3', name: '人工智能', icon: '🤖' },
  { id: '4', name: '数据分析', icon: '📊' },
  { id: '5', name: '产品设计', icon: '🎨' },
  { id: '6', name: '运维开发', icon: '🛠' },
];

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React 18 完全指南',
    description: '从入门到精通，掌握 React 18 新特性和高级开发技巧',
    instructor: '张教授',
    price: 299,
    imageUrl: 'https://picsum.photos/seed/react18/400/300',
    category: '1',
    level: '进阶',
    studentsCount: 1234,
    rating: 4.8,
    tags: ['React', 'Hooks', 'TypeScript'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'TypeScript 实战课程',
    description: '系统学习 TypeScript，构建类型安全的应用',
    instructor: '李老师',
    price: 199,
    imageUrl: 'https://picsum.photos/seed/typescript/400/300',
    category: '1',
    level: '入',
    studentsCount: 890,
    rating: 4.6,
    tags: ['TypeScript', 'JavaScript'],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Python AI 开发',
    description: '深度学习和机器学习实战课程',
    instructor: '王教授',
    price: 399,
    imageUrl: 'https://picsum.photos/seed/python/400/300',
    category: '3',
    level: '高级',
    studentsCount: 560,
    rating: 4.9,
    tags: ['Python', 'AI', 'Machine Learning'],
    isFeatured: true,
  },
];

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const mockUsers = {
  'admin': {
    id: '1',
    username: 'admin',
    name: '管理员',
    role: 'ADMIN' as const,
  },
  'institution': {
    id: '2',
    username: 'institution',
    name: '机构管理员',
    role: 'INSTITUTION' as const,
  },
  'student': {
    id: '3',
    username: 'student',
    name: '学生用户',
    role: 'STUDENT' as const,
  },
};

// 添加用户管理相关的 mock 数据
const mockUserList = [
  {
    id: "1",
    username: "john_doe",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    username: "jane_smith",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    createdAt: "2024-01-02",
  },
  // ... 添加更多测试数据
];

// 添加机构用户 mock 数据
const mockInstitutionUsers = [
  {
    id: "1",
    username: "edu_tech",
    name: "张三",
    email: "contact@edutech.com",
    phone: "13800138000",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-03-15",
    institutionName: "智慧教育科技",
    institutionType: "教育科技",
    verificationStatus: "verified",
  },
  {
    id: "2",
    username: "training_center",
    name: "李四",
    email: "info@training.com",
    phone: "13900139000",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-03-14",
    institutionName: "职业培训中心",
    institutionType: "培训机构",
    verificationStatus: "pending",
  },
  // ... 可以添加更多测试数据
];

// 添加用户详情的 mock 数据
const mockUserDetails = {
  "1": {
    ...mockUserList[0],
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  },
  "2": {
    ...mockUserList[1],
    role: "user",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  },
};

// 加统计数据的 mock
const mockAnalyticsData = {
  overview: {
    totalUsers: 12345,
    totalCourses: 567,
    totalEnrollments: 34567,
    totalRevenue: 1234567,
    userGrowth: 12.5,
    revenueGrowth: 15.8,
    dailyActiveUsers: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 1000) + 500,
    })),
    courseEnrollments: [
      { courseName: "React 完全指南", count: 234 },
      { courseName: "TypeScript 实战", count: 189 },
      { courseName: "Python AI 开发", count: 167 },
      { courseName: "Vue.js 高级教程", count: 145 },
      { courseName: "Node.js 后端开发", count: 123 },
      { courseName: "Flutter 移动开发", count: 112 },
      { courseName: "Java Spring Boot", count: 98 },
      { courseName: "Go 语言入门", count: 87 },
      { courseName: "Docker 容器化", count: 76 },
      { courseName: "Kubernetes 入门", count: 65 },
    ].sort((a, b) => b.count - a.count),
    institutionCount: 156,
    institutionGrowth: 8.5,
    institutionTrend: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('zh-CN', { month: 'short' }),
      count: Math.floor(Math.random() * 20) + 10,
    })),
    institutionTypes: [
      { type: '教育科技', count: 45 },
      { type: '培训机构', count: 38 },
      { type: '高校机', count: 28 },
      { type: '企业培训', count: 25 },
      { type: '其他', count: 20 },
    ],
  },
  sales: {
    institutions: [
      {
        id: '1',
        name: '智慧教育科技',
        courseCount: 45,
        studentCount: 1234,
        totalRevenue: 234567,
        monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('zh-CN', { month: 'short' }),
          revenue: Math.floor(Math.random() * 50000) + 10000,
        })),
        popularCourses: [
          { name: 'React高级教程', sales: 234 },
          { name: 'Vue实战课程', sales: 189 },
          { name: 'TypeScript入门到精通', sales: 156 },
        ],
      },
      {
        id: '2',
        name: '职业培训中心',
        courseCount: 38,
        studentCount: 986,
        totalRevenue: 198765,
        monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('zh-CN', { month: 'short' }),
          revenue: Math.floor(Math.random() * 40000) + 8000,
        })),
        popularCourses: [
          { name: 'Java工程师培训', sales: 178 },
          { name: 'Python数据分析', sales: 145 },
          { name: 'Web全栈开发', sales: 134 },
        ],
      },
      {
        id: '3',
        name: '优学教育',
        courseCount: 32,
        studentCount: 876,
        totalRevenue: 167890,
        monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toLocaleDateString('zh-CN', { month: 'short' }),
          revenue: Math.floor(Math.random() * 35000) + 7000,
        })),
        popularCourses: [
          { name: '算法与数据结构', sales: 156 },
          { name: '前端工程化实践', sales: 134 },
          { name: '微服务架构', sales: 123 },
        ],
      },
    ],
    totalStats: {
      totalInstitutions: 156,
      totalRevenue: 3456789,
      totalStudents: 23456,
      totalCourses: 789,
      monthlyGrowth: {
        institutions: 12.5,
        revenue: 15.8,
        students: 18.2,
      },
    },
  },
};

// 添加机构订单的 mock 数据
const mockOrders = [
  {
    id: '1',
    courseId: '1',
    courseName: 'React 高级教程',
    courseType: 'paid',
    userId: '1',
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    amount: 299,
    status: 'completed',
    purchaseDate: '2024-03-15 14:30:00',
  },
  {
    id: '2',
    courseId: '2',
    courseName: 'Vue 战',
    courseType: 'free',
    userId: '2',
    userName: '',
    userEmail: 'lisi@example.com',
    amount: 0,
    status: 'completed',
    purchaseDate: '2024-03-14 10:15:00',
  },
  // ... 可以添加更多测试数据
];

// 添加课程和章节的 mock 数据
const mockInstitutionCourses = [
  {
    id: '1',
    title: 'React 高级教程',
    chapters: [
      { id: 'c1', courseId: '1', title: '第一章：React 基础回顾', order: 1 },
      { id: 'c2', courseId: '1', title: '第二章：Hooks 深入', order: 2 },
      { id: 'c3', courseId: '1', title: '第三章：状态管理', order: 3 },
    ],
    questionCount: 15,
  },
  {
    id: '2',
    title: 'Vue.js 实战课程',
    chapters: [
      { id: 'c4', courseId: '2', title: '第一章：Vue3 基础', order: 1 },
      { id: 'c5', courseId: '2', title: '第二章：组合式 API', order: 2 },
      { id: 'c6', courseId: '2', title: '第三章：性能优化', order: 3 },
    ],
    questionCount: 12,
  },
  {
    id: '3',
    title: 'TypeScript 入门到精通',
    chapters: [
      { id: 'c7', courseId: '3', title: '第一章：TypeScript 基础', order: 1 },
      { id: 'c8', courseId: '3', title: '第二章：高级类型', order: 2 },
      { id: 'c9', courseId: '3', title: '第三章：工程实践', order: 3 },
    ],
    questionCount: 20,
  },
];

// 添加更试题的 mock 数据
const mockQuestions = [
  // React 课程的试题
  {
    id: 'q1',
    courseId: '1',
    chapterId: 'c1',
    content: 'React 中的虚拟 DOM 主要用于什么？',
    options: [
      { id: 'o1', content: '提高渲染性能' },
      { id: 'o2', content: '简化 DOM 操作' },
      { id: 'o3', content: '实现跨平台' },
    ],
    correctOptionId: 'o1',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'q2',
    courseId: '1',
    chapterId: 'c1',
    content: '以下哪个不是 React 的核心特性？',
    options: [
      { id: 'o1', content: '组件化' },
      { id: 'o2', content: '双向数据绑定' },
      { id: 'o3', content: '单向数据流' },
    ],
    correctOptionId: 'o2',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'q3',
    courseId: '1',
    chapterId: 'c2',
    content: 'React Hooks 不能在哪些地方使用？',
    options: [
      { id: 'o1', content: '条件语句中' },
      { id: 'o2', content: '循环中' },
      { id: 'o3', content: '以上都' },
    ],
    correctOptionId: 'o3',
    createdAt: '2024-03-15T11:00:00Z',
  },
  {
    id: 'q4',
    courseId: '1',
    chapterId: 'c2',
    content: 'useEffect 的第二个参数是什么？',
    options: [
      { id: 'o1', content: '依赖数组' },
      { id: 'o2', content: '回调函' },
      { id: 'o3', content: '配置对象' },
    ],
    correctOptionId: 'o1',
    createdAt: '2024-03-15T11:30:00Z',
  },
  // Vue 课程的试题
  {
    id: 'q5',
    courseId: '2',
    chapterId: 'c4',
    content: 'Vue3 的响应式系统使用了什么API？',
    options: [
      { id: 'o1', content: 'Object.defineProperty' },
      { id: 'o2', content: 'Proxy' },
      { id: 'o3', content: 'getter/setter' },
    ],
    correctOptionId: 'o2',
    createdAt: '2024-03-15T12:00:00Z',
  },
  {
    id: 'q6',
    courseId: '2',
    chapterId: 'c4',
    content: 'Vue3 中如何定义响应式数据？',
    options: [
      { id: 'o1', content: 'data()' },
      { id: 'o2', content: 'ref/reactive' },
      { id: 'o3', content: 'useState' },
    ],
    correctOptionId: 'o2',
    createdAt: '2024-03-15T12:30:00Z',
  },
  {
    id: 'q7',
    courseId: '2',
    chapterId: 'c5',
    content: '组合式 API 的优势是什么？',
    options: [
      { id: 'o1', content: '更好的代码组织' },
      { id: 'o2', content: '更快的运行速度' },
      { id: 'o3', content: '更小的打包体积' },
    ],
    correctOptionId: 'o1',
    createdAt: '2024-03-15T13:00:00Z',
  },
  // TypeScript 课程的试题
  {
    id: 'q8',
    courseId: '3',
    chapterId: 'c7',
    content: 'TypeScript 比 JavaScript 的主要优势是什么？',
    options: [
      { id: 'o1', content: '类型安全' },
      { id: 'o2', content: '运行速度快' },
      { id: 'o3', content: '代码量少' },
    ],
    correctOptionId: 'o1',
    createdAt: '2024-03-15T14:00:00Z',
  },
  {
    id: 'q9',
    courseId: '3',
    chapterId: 'c7',
    content: '什么是泛型？',
    options: [
      { id: 'o1', content: '特殊的类型' },
      { id: 'o2', content: '可重用的类型' },
      { id: 'o3', content: '基本数据类型' },
    ],
    correctOptionId: 'o2',
    createdAt: '2024-03-15T14:30:00Z',
  },
];

// 添加机构课程相关的 mock 数据
const mockInstitutionContentCourses = [
  {
    id: '1',
    title: 'React 高级教程',
    chaptersCount: 12,
    price: 299,
    status: 'published',
    studentsCount: 234,
    rating: 4.8,
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'Vue.js 实战课程',
    chaptersCount: 10,
    price: 199,
    status: 'draft',
    studentsCount: 0,
    rating: 0,
    updatedAt: '2024-03-14',
  },
  {
    id: '3',
    title: 'TypeScript 入门到精通',
    chaptersCount: 15,
    price: 259,
    status: 'reviewing',
    studentsCount: 0,
    rating: 0,
    updatedAt: '2024-03-13',
  },
  {
    id: '4',
    title: 'Node.js 后端开发',
    chaptersCount: 18,
    price: 359,
    status: 'published',
    studentsCount: 156,
    rating: 4.6,
    updatedAt: '2024-03-12',
  },
  {
    id: '5',
    title: 'Python 数据分析',
    chaptersCount: 20,
    price: 399,
    status: 'rejected',
    studentsCount: 0,
    rating: 0,
    updatedAt: '2024-03-11',
  }
];

const mockInstitutionContentCourseStats = {
  totalCourses: 24,
  newCoursesThisMonth: 3,
  totalStudents: 1234,
  studentGrowth: 15.3,
  totalRevenue: 123456,
  revenueGrowth: 23.4,
  averageRating: 4.8,
  totalReviews: 345,
};

// 课程相关的 mock 数据
const mockCourseList = [
  {
    id: 1,
    name: "React 高级教程",
    brief: "从入门到精通，掌握 React 18 新特性和高级开发技巧",
    mtName: "前端开发",
    stName: "React开发",
    mt: 1,
    st: 1,
    charge: "201001",
    price: 299.00,
    status: "202001", // 未提交
    teacherName: "张教授",
    validDays: 365,
    studentsCount: 1234,
    rating: 4.8,
    updatedAt: '2024-03-15',
  },
  {
    id: 2,
    name: "Vue.js 实战课程",
    brief: "系统学习 Vue.js，构建现代化前端应用",
    mtName: "前端开发",
    stName: "Vue开发",
    mt: 1,
    st: 2,
    charge: "201001",
    price: 199.00,
    status: "202003", // 已发布
    teacherName: "李老师",
    validDays: 365,
    studentsCount: 890,
    rating: 4.6,
    updatedAt: '2024-03-14',
  },
];

// 课程统计数据
const mockCourseStats = {
  totalCourses: 24,
  newCoursesThisMonth: 3,
  totalStudents: 1234,
  studentGrowth: 15.3,
  totalRevenue: 123456,
  revenueGrowth: 23.4,
  averageRating: 4.8,
  totalReviews: 345,
};

// 课程计划树的 mock 数据
const mockTeachplanTree = {
  1: [
    {
      id: 1,
      name: "第一章：React 基础",
      level: 1,
      orderBy: 1,
      teachPlanTreeNodes: [
        {
          id: 2,
          name: "1.1 React 简介",
          level: 2,
          orderBy: 1,
          mediaType: "video",
          mediaFileName: "1.1-intro.mp4"
        },
        {
          id: 3,
          name: "1.2 JSX 语法",
          level: 2,
          orderBy: 2,
          mediaType: "video",
          mediaFileName: "1.2-jsx.mp4"
        }
      ]
    },
    {
      id: 4,
      name: "第二章：React Hooks",
      level: 1,
      orderBy: 2,
      teachPlanTreeNodes: [
        {
          id: 5,
          name: "2.1 useState",
          level: 2,
          orderBy: 1,
          mediaType: "video",
          mediaFileName: "2.1-usestate.mp4"
        }
      ]
    }
  ]
};

// 课程教师相关的 mock 数据
const mockTeachers = {
  1: [
    {
      id: 1,
      courseId: 1,
      name: "张教授",
      position: "高级讲师",
      description: "资深前端开发专家，具有10年以上开发经验"
    }
  ]
};

// 课程章节的 mock 数据
const mockChapters: Record<string, Array<{
  id: number;
  name: string;
  level: number;
  orderBy: number;
  teachPlanTreeNodes: Array<{
    id: number;
    name: string;
    level: number;
    orderBy: number;
    mediaType?: string;
    mediaFileName?: string;
  }>;
}>> = {
  '1': [
    {
      id: 1,
      name: "第一章：React 基础",
      level: 1,
      orderBy: 1,
      teachPlanTreeNodes: [
        {
          id: 2,
          name: "1.1 React 简介",
          level: 2,
          orderBy: 1,
          mediaType: "video",
          mediaFileName: "1.1-intro.mp4"
        },
        {
          id: 3,
          name: "1.2 JSX 语法",
          level: 2,
          orderBy: 2,
          mediaType: "video",
          mediaFileName: "1.2-jsx.mp4"
        }
      ]
    },
    {
      id: 4,
      name: "第二章：React Hooks",
      level: 1,
      orderBy: 2,
      teachPlanTreeNodes: [
        {
          id: 5,
          name: "2.1 useState",
          level: 2,
          orderBy: 1,
          mediaType: "video",
          mediaFileName: "2.1-usestate.mp4"
        }
      ]
    }
  ]
};

export const handlers = [
  http.get('/api/courses', () => {
    return HttpResponse.json({
      data: mockCourses,
      status: 200,
      message: 'success',
    });
  }),

  http.get('/api/categories', () => {
    return HttpResponse.json({
      data: mockCategories,
      status: 200,
      message: 'success',
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    const user = mockUsers[body.username as keyof typeof mockUsers];
    
    if (user && body.password === 'password') {
      const tokenResponse: TokenResponse = {
        access_token: 'mock-jwt-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        scope: 'read write'
      };

      return HttpResponse.json({
        data: {
          token: tokenResponse,
          user: user
        },
        status: 200,
        message: 'success',
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const body = await request.json() as { refresh_token: string };
    
    if (body.refresh_token === 'mock-refresh-token') {
      const tokenResponse: TokenResponse = {
        access_token: 'new-mock-jwt-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'new-mock-refresh-token',
        scope: 'read write'
      };

      return HttpResponse.json({
        data: tokenResponse,
        status: 200,
        message: 'success',
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Invalid refresh token',
    });
  }),

  // 添加用户管理相关的 handlers
  http.get('/api/admin/users', () => {
    return HttpResponse.json({
      data: mockUserList,
      status: 200,
      message: 'success',
    });
  }),

  http.post('/api/admin/users', async ({ request }) => {
    const body = await request.json();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    Object.assign(newUser, body);

    return HttpResponse.json({
      data: newUser,
      status: 200,
      message: 'success',
    });
  }),

  http.put('/api/admin/users/:id', async ({ request, params }) => {
    const body = await request.json();
    const updatedUser = {
      id: params.id,
    };
    Object.assign(updatedUser, body);

    return HttpResponse.json({
      data: updatedUser,
      status: 200,
      message: 'success',
    });
  }),

  http.delete('/api/admin/users/:id', () => {
    return HttpResponse.json({
      status: 200,
      message: 'success',
    });
  }),

  // 添加机构用户相关的 handler
  http.get('/api/admin/users/institutions', () => {
    return HttpResponse.json({
      data: mockInstitutionUsers,
      status: 200,
      message: 'success',
    });
  }),

  // 添加获取用户详情的 handler
  http.get('/api/admin/users/:id/details', ({ params }) => {
    const userDetails = mockUserDetails[params.id as string];
    if (userDetails) {
      return HttpResponse.json({
        data: userDetails,
        status: 200,
        message: 'success',
      });
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'User not found',
    });
  }),

  // 更新用户信息的 handler
  http.put('/api/admin/users/:id', async ({ request, params }) => {
    const body = await request.json();
    const user = mockUserList.find(u => u.id === params.id);
    if (user) {
      Object.assign(user, body);
      return HttpResponse.json({
        data: user,
        status: 200,
        message: 'success',
      });
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'User not found',
    });
  }),

  // 修改量操作 handler
  http.post('/api/admin/users/batch', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: body,
      status: 200,
      message: 'success',
    });
  }),

  // 修改统计数据的 handlers
  http.get('/api/admin/analytics/overview', () => {
    return HttpResponse.json({
      data: mockAnalyticsData.overview,
      status: 200,
      message: 'success',
    });
  }),

  http.get('/api/admin/analytics/sales', () => {
    return HttpResponse.json({
      data: mockAnalyticsData.sales,
      status: 200,
      message: 'success',
    });
  }),

  // 添加机构类型统计的 handler
  http.get('/api/admin/analytics/institution-types', () => {
    return HttpResponse.json({
      data: mockAnalyticsData.overview.institutionTypes,
      status: 200,
      message: 'success',
    });
  }),

  // 添加机构销售排行的 handler
  http.get('/api/admin/analytics/top-institutions', () => {
    return HttpResponse.json({
      data: mockAnalyticsData.sales.institutions
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5),
      status: 200,
      message: 'success',
    });
  }),

  // 添加机构增长趋势的 handler
  http.get('/api/admin/analytics/institution-growth', () => {
    return HttpResponse.json({
      data: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleDateString('zh-CN', { month: 'short' }),
        count: Math.floor(Math.random() * 20) + 10,
      })),
      status: 200,
      message: 'success',
    });
  }),

  // 添加机构订单的 handler
  http.get('/api/institution/orders', () => {
    return HttpResponse.json({
      data: mockOrders,
      status: 200,
      message: 'success',
    });
  }),

  // 获取机构课程列表
  http.get('/api/institution/courses', () => {
    return HttpResponse.json({
      data: mockInstitutionCourses,
      status: 200,
      message: 'success',
    });
  }),

  // 获取课程的试题列表
  http.get('/api/institution/courses/:courseId/questions', ({ params }) => {
    const questions = mockQuestions.filter(q => q.courseId === params.courseId);
    return HttpResponse.json({
      data: questions,
      status: 200,
      message: 'success',
    });
  }),

  // 修改创建试题 handler
  http.post('/api/institution/questions', async ({ request }) => {
    const body = await request.json();
    const newQuestion = {
      id: `q${mockQuestions.length + 1}`,
      courseId: '',
      chapterId: '',
      content: '',
      options: [],
      correctOptionId: '',
      createdAt: new Date().toISOString(),
    };
    Object.assign(newQuestion, body);
    mockQuestions.push(newQuestion);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: newQuestion
    });
  }),

  // 更新试题
  http.put('/api/institution/questions/:id', async ({ request, params }) => {
    const body = await request.json();
    const questionIndex = mockQuestions.findIndex(q => q.id === params.id);
    if (questionIndex !== -1) {
      const updatedQuestion = Object.assign({}, mockQuestions[questionIndex], body);
      mockQuestions[questionIndex] = updatedQuestion;
      return HttpResponse.json({
        data: updatedQuestion,
        status: 200,
        message: 'success',
      });
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Question not found',
    });
  }),

  // 删除试题
  http.delete('/api/institution/questions/:id', ({ params }) => {
    const questionIndex = mockQuestions.findIndex(q => q.id === params.id);
    if (questionIndex !== -1) {
      mockQuestions.splice(questionIndex, 1);
      return HttpResponse.json({
        status: 200,
        message: 'success',
      });
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Question not found',
    });
  }),

  // 添加机构课程相关的新 handlers
  http.get('/api/institution/content/courses', () => {
    return HttpResponse.json({
      data: mockInstitutionContentCourses,
      status: 200,
      message: 'success',
    });
  }),

  http.get('/api/institution/content/courses/stats', () => {
    return HttpResponse.json({
      data: mockInstitutionContentCourseStats,
      status: 200,
      message: 'success',
    });
  }),

  // 修改创建课程 handler
  http.post('/api/institution/content/courses', async ({ request }) => {
    const body = await request.json();
    const newCourse = {
      id: String(mockInstitutionContentCourses.length + 1),
      title: '',
      chaptersCount: 0,
      price: 0,
      status: 'draft',
      studentsCount: 0,
      rating: 0,
      updatedAt: new Date().toISOString(),
    };
    mockInstitutionContentCourses.push(newCourse);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: newCourse
    });
  }),

  // 归档课程
  http.put('/api/institution/content/courses/:id/archive', ({ params }) => {
    const course = mockInstitutionContentCourses.find(c => c.id === params.id);
    if (course) {
      course.status = 'archived';
      return HttpResponse.json({
        status: 200,
        message: 'success',
      });
    }
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Course not found',
    });
  }),

  // 课程列表查询
  http.get('/course/list', ({ request }) => {
    const url = new URL(request.url);
    const pageNo = Number(url.searchParams.get('pageNo')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const courseName = url.searchParams.get('courseName');
    const status = url.searchParams.get('status');
    const mt = url.searchParams.get('mt');
    const st = url.searchParams.get('st');

    let filteredCourses = mockCourseList;

    if (courseName) {
      filteredCourses = filteredCourses.filter(course => 
        course.name && course.name.toLowerCase().includes(courseName.toLowerCase())
      );
    }

    if (status) {
      filteredCourses = filteredCourses.filter(course => 
        course.status === status
      );
    }

    if (mt) {
      filteredCourses = filteredCourses.filter(course => 
        course.mt === Number(mt)
      );
    }

    if (st) {
      filteredCourses = filteredCourses.filter(course => 
        course.st === Number(st)
      );
    }

    const start = (pageNo - 1) * pageSize;
    const end = start + pageSize;
    const items = filteredCourses.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: {
        items,
        counts: filteredCourses.length,
        page: pageNo,
        pageSize
      }
    });
  }),

  // 获取课程统计数据
  http.get('/course/stats', () => {
    return HttpResponse.json({
      code: 0,
      message: "success",
      data: mockCourseStats
    });
  }),

  // 创建课程
  http.post('/course', async ({ request }) => {
    const body = await request.json();
    const newCourse = {
      id: mockCourseList.length + 1,
      name: '',
      brief: '',
      mt: 1,
      st: 1,
      mtName: "前端开发",
      stName: "React开发",
      charge: "201001",
      price: 0,
      status: "202001",
      teacherName: "",
      validDays: 365,
      studentsCount: 0,
      rating: 0,
      updatedAt: new Date().toISOString(),
    };
    Object.assign(newCourse, body);
    mockCourseList.push(newCourse);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: newCourse.id
    });
  }),

  // 查询课程计划树
  http.get('/teachplan/tree/:courseId', ({ params }) => {
    const courseId = Number(params.courseId);
    const teachplanData = mockTeachplanTree[courseId] || [];

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: teachplanData
    });
  }),

  // 查询课程教师列表
  http.get('/course-teacher/list/:courseId', ({ params }) => {
    const courseId = Number(params.courseId);
    const teacherData = mockTeachers[courseId];

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: teacherData ? teacherData : []
    });
  }),

  // 提交课程审核
  http.post('/course/:courseId/audit/submit', ({ params }) => {
    const courseId = Number(params.courseId);
    const course = mockCourseList.find(c => c.id === courseId);
    if (course) {
      course.status = "202002"; // 审核中
    }
    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 保存课程计划
  http.post('/teachplan', async ({ request }) => {
    const body = await request.json();
    const newTeachPlan = {
      id: Date.now(),
      name: '',
      level: 1,
      orderBy: 1,
      teachPlanTreeNodes: [],
    };

    // 创建一个新的课程计划树节点
    mockTeachplanTree[1] = mockTeachplanTree[1] || [];
    mockTeachplanTree[1].push(newTeachPlan);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 章节向上移动
  http.post('/teachplan/:teachplanId/moveup', ({ params }) => {
    const teachplanId = Number(params.teachplanId);
    const courseId = 1; // 简化处理，固定使用课程ID 1
    const chapters = mockTeachplanTree[courseId];
    
    if (chapters) {
      const currentIndex = chapters.findIndex(chapter => chapter.id === teachplanId);
      if (currentIndex > 0) {
        // 交换当前章节和上一个章节的位置
        const temp = chapters[currentIndex];
        chapters[currentIndex] = chapters[currentIndex - 1];
        chapters[currentIndex - 1] = temp;
        
        // 更新排序号
        chapters[currentIndex].orderBy = currentIndex + 1;
        chapters[currentIndex - 1].orderBy = currentIndex;
      }
    }

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 章节向下移动
  http.post('/teachplan/:teachplanId/movedown', ({ params }) => {
    const teachplanId = Number(params.teachplanId);
    const courseId = 1; // 简化处理，实际应该从请求中获取
    const chapters = mockTeachplanTree[courseId];
    
    if (chapters) {
      const currentIndex = chapters.findIndex(chapter => chapter.id === teachplanId);
      if (currentIndex < chapters.length - 1) {
        // 交换当前章节和下一个章节的位置
        const temp = chapters[currentIndex];
        chapters[currentIndex] = chapters[currentIndex + 1];
        chapters[currentIndex + 1] = temp;
        
        // 更新排序号
        chapters[currentIndex].orderBy = currentIndex + 1;
        chapters[currentIndex + 1].orderBy = currentIndex + 2;
      }
    }

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 创建机构课程
  http.post('/api/institution/content/courses', async ({ request }) => {
    const body = await request.json();
    const newCourse = {
      id: String(mockInstitutionContentCourses.length + 1),
      title: '',
      chaptersCount: 0,
      price: 0,
      status: 'draft',
      studentsCount: 0,
      rating: 0,
      updatedAt: new Date().toISOString(),
    };
    mockInstitutionContentCourses.push(newCourse);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: newCourse
    });
  }),

  // 获取课程章节树
  http.get('/teachplan/tree/:courseId', ({ params }) => {
    const courseId = String(params.courseId);
    return HttpResponse.json({
      code: 0,
      message: "success",
      data: mockChapters[courseId] || []
    });
  }),

  // 创建/更新章节
  http.post('/teachplan', async ({ request }) => {
    const newNode = {
      id: Date.now(),
      name: '',
      level: 1,
      orderBy: 1,
      teachPlanTreeNodes: []
    };

    const courseId = '1'; // 简化处理，使用固定值
    if (!mockChapters[courseId]) {
      mockChapters[courseId] = [];
    }

    // 添加到章节列表
    newNode.orderBy = mockChapters[courseId].length + 1;
    mockChapters[courseId].push(newNode);

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 创建小节
  http.post('/teachplan/section', async ({ request }) => {
    const courseId = '1'; // 简化处理，使用固定值
    const chapter = mockChapters[courseId][0]; // 简化处理，使用第一个章节

    if (chapter) {
      const newSection = {
        id: Date.now(),
        name: '新小节',
        level: 2,
        orderBy: chapter.teachPlanTreeNodes.length + 1,
        mediaType: 'video',
        mediaFileName: 'example.mp4'
      };

      chapter.teachPlanTreeNodes.push(newSection);
    }

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 小节上移
  http.post('/teachplan/:teachplanId/moveup', ({ params }) => {
    const teachplanId = Number(params.teachplanId);
    
    // 遍历所有课程的章节
    Object.values(mockChapters).forEach(chapters => {
      chapters.forEach(chapter => {
        const sections = chapter.teachPlanTreeNodes;
        const index = sections.findIndex(s => s.id === teachplanId);
        if (index > 0) {
          // 交换位置
          [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
          // 更新排序号
          sections[index].orderBy = index + 1;
          sections[index - 1].orderBy = index;
        }
      });
    });

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 小节下移
  http.post('/teachplan/:teachplanId/movedown', ({ params }) => {
    const teachplanId = Number(params.teachplanId);
    
    Object.values(mockChapters).forEach(chapters => {
      chapters.forEach(chapter => {
        const sections = chapter.teachPlanTreeNodes;
        const index = sections.findIndex(s => s.id === teachplanId);
        if (index >= 0 && index < sections.length - 1) {
          // 交换位置
          [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
          // 更新排序号
          sections[index].orderBy = index + 1;
          sections[index + 1].orderBy = index + 2;
        }
      });
    });

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 删除章节或小节
  http.delete('/teachplan/:teachplanId', ({ params }) => {
    const teachplanId = Number(params.teachplanId);
    
    Object.values(mockChapters).forEach(chapters => {
      // 删除章节
      const chapterIndex = chapters.findIndex(c => c.id === teachplanId);
      if (chapterIndex >= 0) {
        chapters.splice(chapterIndex, 1);
        return;
      }
      
      // 删除小节
      chapters.forEach(chapter => {
        const sections = chapter.teachPlanTreeNodes;
        const sectionIndex = sections.findIndex(s => s.id === teachplanId);
        if (sectionIndex >= 0) {
          sections.splice(sectionIndex, 1);
        }
      });
    });

    return HttpResponse.json({
      code: 0,
      message: "success",
      data: null
    });
  }),

  // 上传媒资文件（模拟）
  http.post('/media/upload', async ({ request }) => {
    // 模拟文件上传
    return HttpResponse.json({
      code: 0,
      message: "success",
      data: {
        fileName: "uploaded-video.mp4",
        fileUrl: "https://example.com/videos/uploaded-video.mp4"
      }
    });
  }),
]; 