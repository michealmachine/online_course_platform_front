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
    level: '入门',
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
const mockUserDetails: Record<string, UserDetails> = {
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
      { type: '高校机构', count: 28 },
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
    courseName: 'Vue 门实战',
    courseType: 'free',
    userId: '2',
    userName: '李四',
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

// 添加更多试题的 mock 数据
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
      { id: 'o3', content: '以上都是' },
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
      { id: 'o2', content: '回调函数' },
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
    content: 'TypeScript 相比 JavaScript 的主要优势是什么？',
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
    return HttpResponse.json({
      data: {
        id: Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      },
      status: 200,
      message: 'success',
    });
  }),

  http.put('/api/admin/users/:id', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: {
        id: params.id,
        ...body,
      },
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

  // 添加批量操作 handler
  http.post('/api/admin/users/batch', async ({ request }) => {
    const body = await request.json();
    const { operation, userIds } = body;

    // 在实际用中，这里会更新数据库
    // 这里只是模拟成功响应
    return HttpResponse.json({
      data: {
        updatedIds: userIds,
        operation,
      },
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

  // 创建新试题
  http.post('/api/institution/questions', async ({ request }) => {
    const body = await request.json();
    const newQuestion = {
      id: `q${mockQuestions.length + 1}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    mockQuestions.push(newQuestion);
    return HttpResponse.json({
      data: newQuestion,
      status: 200,
      message: 'success',
    });
  }),

  // 更新试题
  http.put('/api/institution/questions/:id', async ({ request, params }) => {
    const body = await request.json();
    const questionIndex = mockQuestions.findIndex(q => q.id === params.id);
    if (questionIndex !== -1) {
      mockQuestions[questionIndex] = {
        ...mockQuestions[questionIndex],
        ...body,
      };
      return HttpResponse.json({
        data: mockQuestions[questionIndex],
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
]; 