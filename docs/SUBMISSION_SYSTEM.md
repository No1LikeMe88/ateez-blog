# 访客投稿系统部署指南

## 系统概述

本系统允许访客自由提交文章，并需要站长审核后才能发布。

## 技术架构

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages + Workers

## 部署步骤

### 1. 创建 D1 数据库

```bash
# 使用 Wrangler CLI 创建 D1 数据库
npx wrangler d1 create ateez-blog-submissions

# 记录返回的 database_id，填入 api/wrangler.toml
```

### 2. 初始化数据库

```bash
# 执行 schema.sql 创建表结构
npx wrangler d1 execute ateez-blog-submissions --file=./database/schema.sql
```

### 3. 配置环境变量

在 Cloudflare Dashboard 中为 Worker 设置环境变量：

```bash
# 设置管理密码
ADMIN_PASSWORD=your_secure_password_here
```

### 4. 更新 API 配置

编辑 `api/wrangler.toml`，将 `YOUR_DATABASE_ID_HERE` 替换为实际的 database_id。

### 5. 更新前端 API 地址

编辑以下文件，将 API 地址替换为你的 Worker 实际地址：

- `src/pages/SubmitArticle.tsx`
- `src/pages/AdminPanel.tsx`

```typescript
const API_URL = 'https://ateez-blog-api.your-account.workers.dev';
```

### 6. 部署 Worker

```bash
cd api
npx wrangler deploy
```

### 7. 部署前端

推送到 GitHub，Cloudflare Pages 会自动部署。

## 功能说明

### 访客投稿

- 访问 `/submit` 页面
- 填写标题、内容、作者信息
- 可选标记18+内容
- 提交后进入待审核状态

### 管理后台

- 访问 `/admin` 页面
- 输入管理密码登录
- 查看所有待审核投稿
- 可执行：通过、拒绝、删除操作

## 安全建议

1. 使用强密码作为管理密码
2. 定期检查审核列表
3. 及时处理违规投稿
4. 考虑添加IP黑名单机制

## API 接口

### 提交文章
```
POST /api/submit
Body: { title, content, summary, author_name, author_contact, is_adult }
```

### 获取待审核列表（需密码）
```
GET /api/drafts?password=xxx
```

### 通过审核
```
POST /api/approve/{id}?password=xxx
```

### 拒绝投稿
```
POST /api/reject/{id}?password=xxx&reason=xxx
```

### 删除投稿
```
DELETE /api/delete/{id}?password=xxx
```

## 费用说明

- Cloudflare Pages: 免费
- Cloudflare Workers: 免费（每日10万次请求）
- Cloudflare D1: 免费（1GB存储，1000万次读操作/月）

预计月费用：$0
