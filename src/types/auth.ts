export type UserRole = 'STUDENT' | 'INSTITUTION' | 'ADMIN';

export interface UserAuth {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  token: string;
}

interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: Omit<NavItem, 'children'>[];
}

// 修改公共导航项
const PUBLIC_NAV_ITEMS: NavItem[] = [
  { title: '首页', href: '/' },
  { title: '课程中心', href: '/courses' },
  { title: '讲师团队', href: '/teachers' },
  { title: '关于我们', href: '/about' },
];

// 学生专属导航项
const STUDENT_NAV_ITEMS: NavItem[] = [
  {
    title: '学习中心',
    href: '/learning',
    children: [
      { title: '我的课程', href: '/learning/courses' },
      { title: '视频学习', href: '/learning/videos' },
      { title: '学习记录', href: '/learning/history' },
    ]
  },
  {
    title: '考试中心',
    href: '/exams',
    children: [
      { title: '我的考试', href: '/exams/my' },
      { title: '考试记录', href: '/exams/history' },
    ]
  },
  {
    title: '个人中心',
    href: '/account',
    children: [
      { title: '我的订单', href: '/account/orders' },
      { title: '我的收藏', href: '/account/favorites' },
      { title: '个人信息', href: '/account/profile' },
    ]
  },
];

// 机构专属导航项
const INSTITUTION_NAV_ITEMS: NavItem[] = [
  {
    title: '内容管理',
    href: '/institution/content',
    children: [
      { title: '课程管理', href: '/institution/content/courses' },
      { title: '视频管理', href: '/institution/content/videos' },
      { title: '资料管理', href: '/institution/content/materials' },
    ]
  },
  {
    title: '考试管理',
    href: '/institution/exams',
    children: [
      { title: '试题管理', href: '/institution/exams/questions' },
      { title: '考试管理', href: '/institution/exams/manage' },
      { title: '成绩管理', href: '/institution/exams/scores' },
    ]
  },
  {
    title: '订单管理',
    href: '/institution/orders',
    children: [
      { title: '订单列表', href: '/institution/orders/list' },
      { title: '退款管理', href: '/institution/orders/refunds' },
    ]
  },
  {
    title: '统计分析',
    href: '/institution/analytics',
    children: [
      { title: '销售统计', href: '/institution/analytics/sales' },
      { title: '学习统计', href: '/institution/analytics/learning' },
      { title: '考试统计', href: '/institution/analytics/exams' },
    ]
  },
];

// 修改管理员导航项
const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: '用户管理',
    href: '/admin/users',
    children: [
      { title: '普通用户', href: '/admin/users/list' },
      { title: '机构用户', href: '/admin/users/institutions' },
    ]
  },
  {
    title: '审核管理',
    href: '/admin/review',
    children: [
      { title: '课程审核', href: '/admin/review/courses' },
      { title: '视频审核', href: '/admin/review/videos' },
      { title: '机构审核', href: '/admin/review/institutions' },
    ]
  },
  {
    title: '内容管理',
    href: '/admin/content',
    children: [
      { title: '分类管理', href: '/admin/content/categories' },
      { title: '标签管理', href: '/admin/content/tags' },
    ]
  },
  {
    title: '统计分析',
    href: '/admin/analytics',
    children: [
      { title: '平台概况', href: '/admin/analytics/overview' },
      { title: '销售统计', href: '/admin/analytics/sales' },
      { title: '用户分析', href: '/admin/analytics/users' },
    ]
  },
];

export const DEFAULT_NAV_ITEMS = {
  PUBLIC: PUBLIC_NAV_ITEMS,
  STUDENT: [...PUBLIC_NAV_ITEMS, ...STUDENT_NAV_ITEMS],
  INSTITUTION: [...PUBLIC_NAV_ITEMS, ...INSTITUTION_NAV_ITEMS],
  ADMIN: [...PUBLIC_NAV_ITEMS, ...ADMIN_NAV_ITEMS],
} as const; 