# 在线课程平台开发进度文档

## 1. 已完成功能

### 1.1 课程管理模块
- [x] 课程列表展示
  - 课程基本信息展示
  - 状态筛选
  - 搜索功能
- [x] 课程创建/编辑
  - 基本信息设置
  - 收费设置
  - 分类设置
- [x] 章节管理
  - 章节列表展示
  - 章节添加/编辑/删除
  - 小节添加/编辑/删除
  - 小节顺序调整
  - 媒资文件关联（基础功能）

### 1.2 用户界面组件
- [x] 课程对话框 (CourseDialog)
- [x] 章节对话框 (ChapterDialog)
- [x] 小节对话框 (SectionDialog)
- [x] 删除确认对话框 (DeleteConfirmDialog)
- [x] 章节列表组件 (ChapterList)

### 1.3 Mock 数据
- [x] 课程数据
- [x] 章节数据
- [x] 统计数据
- [x] API 接口

## 2. 待开发功能

### 2.1 课程管理模块
- [ ] 媒资管理
  - [ ] 文件上传
  - [ ] 文件列表
  - [ ] 文件预览
- [ ] 课程发布
  - [ ] 发布流程
  - [ ] 审核状态管理
- [ ] 课程统计
  - [ ] 学习数据
  - [ ] 收入统计
  - [ ] 评价管理

### 2.2 用户界面优化
- [ ] 加载状态优化
- [ ] 错误处理优化
- [ ] 表单验证完善
- [ ] 响应式布局优化

### 2.3 功能优化
- [ ] 批量操作功能
- [ ] 导入导出功能
- [ ] 数据缓存优化
- [ ] 性能优化

## 3. 技术栈

### 3.1 前端框架
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### 3.2 UI 组件库
- shadcn/ui
- Radix UI
- Lucide Icons

### 3.3 状态管理
- React Hooks
- Context API

### 3.4 Mock 服务
- MSW (Mock Service Worker)

## 4. 项目结构
src/
├── app/ # 页面目录
│ └── institution/ # 机构管理相关页面
├── components/ # 组件目录
│ ├── ui/ # 基础UI组件
│ └── institution/ # 机构相关组件
├── contexts/ # Context相关
├── hooks/ # 自定义Hooks
├── lib/ # 工具函数
├── mocks/ # Mock数据和处理器
└── services/ # API服务

## 5. 开发指南

### 5.1 组件初始化规范

#### 5.1.1 Legacy 模式说明
在使用 shadcn/ui 组件时，必须使用 Legacy 模式进行初始化，具体步骤如下：

1. 创建配置文件
```bash
npx shadcn-ui@latest init
```

2. 选择配置选项
- Style: Default
- Base color: Slate
- CSS Framework: Tailwind CSS
- Location of CSS variables: tailwind.config.js
- ✨ 重要：Components location 选择 `src/components/ui`
- ✨ 重要：React Server Components 选择 `no` (Legacy mode)
- Tailwind CSS config: tailwind.config.js
- CSS variables: globals.css

#### 5.1.2 组件安装
```bash
# 正确的安装方式
npx shadcn-ui@latest add [component-name]

# 常用组件安装示例
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert-dialog
```

#### 5.1.3 组件依赖关系
- form 组件依赖：
  - 需要安装 label 组件
  - 需要安装 react-hook-form
  - 需要安装 @hookform/resolvers/zod
  - 需要安装 zod
- toast 组件：
  - 需要在 layout.tsx 中添加 <Toaster />
  - 需要创建 hooks/use-toast.ts
- alert-dialog：独立组件，无其他依赖

#### 5.1.4 组件导入规范
```typescript
# ✅ 正确的导入方式
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

# ❌ 错误的导入方式
import { Button } from "shadcn/ui"
import Button from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
```

### 5.2 Mock 服务开发规范

#### 5.2.1 handlers.ts 文件结构
```typescript
# 1. 定义 mock 数据类型
interface MockData {
  id: number;
  name: string;
  # ... 其他属性
}

# 2. 创建 mock 数据
const mockData: MockData[] = [
  {
    id: 1,
    name: "示例数据",
    # ... 其他属性
  }
];

# 3. 处理请求的正确方式
http.post('/api/endpoint', async ({ request }) => {
  # ✅ 正确的请求数据处理
  const body = await request.json();
  const newData = {
    id: Date.now(),
    name: '',
    status: 'draft',
  };
  # 使用 Object.assign 而不是展开运算符
  Object.assign(newData, body);
  return HttpResponse.json({
    code: 0,
    message: "success",
    data: newData
  });
});
```

#### 5.2.2 错误处理规范
```typescript
# 成功响应
return HttpResponse.json({
  code: 0,
  message: "success",
  data: result
});

# 错误响应
return new HttpResponse(null, {
  status: 404,
  statusText: 'Not Found',
});
```