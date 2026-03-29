# AI智能招聘系统后端

基于Node.js + Express的AI智能招聘系统后端服务。

## 技术栈

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (可选扩展)
- **Validation**: express-validator

## 项目结构

```
backend/
├── src/
│   ├── database/          # 数据库相关
│   │   ├── db.js          # 数据库操作层
│   │   ├── init.js        # 数据库初始化
│   │   └── schema.sql     # 数据库schema
│   ├── routes/            # API路由
│   │   ├── jobs.js        # 职位管理
│   │   ├── candidates.js   # 候选人管理
│   │   ├── matching.js     # AI匹配
│   │   ├── interviews.js   # 面试管理
│   │   ├── calls.js        # 外呼管理
│   │   └── onboarding.js   # 入职管理
│   ├── services/           # 业务服务
│   │   ├── aiMatchingService.js   # AI匹配算法
│   │   └── aiInterviewService.js  # AI面试服务
│   └── index.js            # 入口文件
├── uploads/                # 上传文件目录
├── data/                   # 数据库文件目录
├── package.json
├── .env
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 初始化数据库

```bash
npm run init-db
```

### 3. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务将在 http://localhost:3000 启动

## API端点

### 职位管理 (/api/jobs)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/jobs | 创建职位 |
| GET | /api/jobs | 获取职位列表 |
| GET | /api/jobs/:id | 获取职位详情 |
| PUT | /api/jobs/:id | 更新职位 |
| DELETE | /api/jobs/:id | 删除职位 |
| POST | /api/jobs/:id/analyze | AI分析职位画像 |

### 候选人管理 (/api/candidates)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/candidates | 创建候选人 |
| GET | /api/candidates | 获取候选人列表 |
| GET | /api/candidates/:id | 获取候选人详情 |
| PUT | /api/candidates/:id | 更新候选人 |
| POST | /api/candidates/import | 批量导入简历 |
| POST | /api/candidates/:id/attach-email | 关联邮箱 |

### AI匹配 (/api/match)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/match | 计算人岗匹配度 |
| GET | /api/match/:jobId/:candidateId | 获取匹配详情 |
| GET | /api/match/:jobId | 获取职位所有匹配候选人 |
| POST | /api/match/batch | 批量匹配 |

### 面试管理 (/api/interviews)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/interviews | 创建面试 |
| GET | /api/interviews | 获取面试列表 |
| GET | /api/interviews/:id | 获取面试详情 |
| PUT | /api/interviews/:id | 更新面试状态 |
| POST | /api/interviews/:id/questions | AI生成面试问题 |
| POST | /api/interviews/:id/record | 记录面试问答 |
| POST | /api/interviews/:id/analyze | AI分析面试 |

### 外呼管理 (/api/calls)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/calls/outbound | 创建外呼任务 |
| GET | /api/calls | 获取外呼记录 |
| PUT | /api/calls/:id/status | 更新外呼状态 |

### 入职管理 (/api/onboarding)

| 方法 | 端点 | 描述 |
|------|------|------|
| POST | /api/onboarding | 创建入职流程 |
| GET | /api/onboarding/:candidateId | 获取入职进度 |
| PUT | /api/onboarding/:id | 更新入职状态 |

## AI匹配算法

匹配度计算基于以下维度:

- **技能匹配 (40%)**: 关键词匹配、同义词匹配、模糊匹配
- **经验匹配 (30%)**: 年限匹配、领域匹配、职级匹配
- **教育匹配 (15%)**: 学历匹配、学校层次、专业相关性
- **薪资匹配 (15%)**: 期望薪资与职位范围匹配度

## AI面试服务

### 问题生成
- 行为面试问题: STAR法则导向
- 技术面试问题: 基于职位技能要求
- 情景面试问题: 情境模拟

### 面试分析
- 回答质量评分
- 能力评估
- 风险点识别
- 综合建议

## 环境变量

```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/recruitment.db
CORS_ORIGIN=*
LOG_LEVEL=info
```

## 数据库

SQLite数据库文件位于 `./data/recruitment.db`

## License

MIT
