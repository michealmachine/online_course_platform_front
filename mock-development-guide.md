# Mock 数据和页面开发指南

## Mock 数据开发注意事项

### 1. 常见的 Lint 错误和解决方案

#### 1.1 spread 类型错误
typescript
// 1. 先定义 mock 数据
const mockData = [
{
id: '1',
title: '示例数据',
// ... 其他字段
}
];
// 2. 在 handlers 数组中添加对应的处理器
export const handlers = [
http.get('/api/endpoint', () => {
return HttpResponse.json({
data: mockData,
status: 200,
message: 'success',
});
}),
];

### 2. 常见问题和解决方案

#### 2.1 类型错误问题
在使用 MSW 进行 mock 时，经常会遇到以下类型错误：
typescript
// ❌ 常见错误
http.post('/api/endpoint', async ({ request }) => {
const body = await request.json();
return HttpResponse.json({
data: {
...body, // Error: spread 类型只能从对象类型创建
}
});
});
// ✅ 正确做法：避免使用展开运算符
http.post('/api/endpoint', async ({ request }) => {
const body = await request.json();
return HttpResponse.json({
data: body // 直接使用 body
});
});

#### 2.2 DefaultBodyType 错误
typescript
// ❌ 常见错误
http.post('/api/batch', async ({ request }) => {
const body = await request.json();
return HttpResponse.json({
data: {
userIds: body.userIds, // Error: 类型"DefaultBodyType"上不存在属性"userIds"
operation: body.operation,
}
});
});
// ✅ 正确做法：直接使用请求数据
http.post('/api/batch', async ({ request }) => {
const body = await request.json();
return HttpResponse.json({
data: body
});
});

### 3. Mock 数据最佳实践

#### 3.1 数据组织
typescript
// 相关的 mock 数据放在一起
const mockCourses = [/ 课程数据 /];
const mockCourseStats = {/ 统计数据 /};
// 对应的 handlers 也放在一起
http.get('/api/courses', () => {
return HttpResponse.json({
data: mockCourses,
status: 200,
message: 'success',
});
}),
http.get('/api/courses/stats', () => {
return HttpResponse.json({
data: mockCourseStats,
status: 200,
message: 'success',
});
}),

#### 3.2 避免类型错误的策略
1. 不使用展开运算符（...）处理请求数据
2. 直接使用请求数据而不进行类型断言
3. 使用 Object.assign() 合并对象
4. 保持数据结构简单明确

### 4. API 路径规范

#### 4.1 路径命名规则
- 使用小写字母
- 使用连字符分隔单词
- 遵循 RESTful 风格
typescript
/api/institution/content/courses // 获取课程列表
/api/institution/content/courses/stats // 获取课程统计
typescript
{
data: any, // 实际数据
status: number, // 状态码
message: string // 状态信息
}

### 5. 实际案例

#### 5.1 课程管理模块
typescript
// 1. Mock 数据定义
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
// ... 更多数据
];
// 2. Handler 定义
http.get('/api/institution/content/courses', () => {
return HttpResponse.json({
data: mockInstitutionContentCourses,
status: 200,
message: 'success',
});
}),

### 6. 调试技巧

1. 使用浏览器开发者工具的 Network 面板检查请求
2. 在 handler 中添加 console.log 调试数据
3. 确保 API 路径完全匹配
4. 检查响应数据结构

### 7. 注意事项总结

1. 保持数据结构简单清晰
2. 避免使用可能导致类型错误的语法
3. 保持命名规范统一
4. 确保 API 路径正确
5. 保持响应格式一致
6. 添加适当的错误处理
7. 模拟真实的数据场景