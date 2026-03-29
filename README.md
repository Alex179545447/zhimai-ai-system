# Zhimai AI招聘系统 (zhimai-ai-system)

<div align="center">

![Logo](https://img.shields.io/badge/AI-Recruitment%20System-6366f1?style=for-the-badge&logo=robot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**颠覆传统SaaS的AI全自动化招聘系统**

[功能演示](https://ka1estf7igep.space.minimaxi.com) • [功能介绍](#功能模块) • [快速部署](#快速部署) • [开发文档](#开发指南)

</div>

---

## 🌟 系统介绍

zhimai-ai-system 是一款**颠覆传统SaaS人力招聘系统**的全自动化解决方案，采用先进的人工智能技术，实现从职位发布到入职管理的全流程智能化。

### 核心优势

- **🚀 全自动化流程**：从简历筛选到面试安排，全部由AI驱动
- **🧠 智能人岗匹配**：基于多维度分析的高精度匹配算法
- **📞 自动电话外呼**：智能外呼系统自动联系候选人
- **💬 AI线上面试**：自动生成面试问题并记录分析
- **📊 数据驱动决策**：实时可视化数据看板

---

## ✨ 功能模块

### 1️⃣ 智能仪表盘
- 招聘漏斗可视化（7个阶段完整追踪）
- 核心指标实时监控
- 本周趋势分析
- 快捷操作入口

### 2️⃣ 职位管理
- 职位创建与发布
- 职位画像自动生成
- 多维度筛选与搜索
- 技能要求可视化

### 3️⃣ 候选人管理
- 简历批量导入（支持拖拽上传）
- 候选人画像分析
- 邮箱关联功能
- 多视图切换（卡片/表格）

### 4️⃣ AI简历匹配
- **智能匹配算法**：
  - 技能匹配度 (40%)
  - 经验匹配度 (30%)
  - 教育背景 (15%)
  - 薪资期望 (15%)
- 候选人排名
- 匹配详情雷达图

### 5️⃣ 自动化面试系统
- AI生成面试问题
- 日程智能安排
- 视频/电话/现场面试
- 外呼记录追踪

### 6️⃣ 面试分析
- 问答记录分析
- AI评估报告
- 优势/风险点识别
- 录用建议生成

### 7️⃣ 复试与入职
- 入职流程管理
- 状态自动流转
- 进度追踪

### 8️⃣ 系统设置
- 公司信息配置
- 职位模板管理
- AI匹配规则
- 外呼系统设置

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 (React + TailwindCSS)             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ 仪表盘  │ │ 职位管理 │ │ 候选人  │ │ AI匹配  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ 面试安排│ │ 面试分析│ │ 入职管理│ │ 系统设置│           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      后端 (Node.js + Express)               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  AI匹配引擎  │ │ 面试问题生成 │ │  面试分析引擎 │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  职位管理API │ │ 候选人管理API │ │  外呼管理API │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (SQLite)                        │
│  职位 | 候选人 | 简历 | 匹配记录 | 面试 | 问答 | 外呼 | 入职   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速部署

### 方式一：Vercel一键部署（推荐前端）

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 进入前端目录
cd frontend

# 3. 部署
vercel

# 4. 按提示完成配置
```

### 方式二：本地运行

#### 前端
```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

#### 后端
```bash
cd backend
npm install
npm run init-db  # 初始化数据库
npm start
# 服务运行在 http://localhost:3000
```

### 方式三：Docker部署

```bash
# 构建并运行
docker-compose up -d

# 访问 http://localhost:3000
```

---

## 📁 项目结构

```
AI智能招聘系统/
├── frontend/                    # React前端应用
│   ├── src/
│   │   ├── pages/              # 页面组件
│   │   │   ├── Dashboard.jsx   # 仪表盘
│   │   │   ├── Jobs.jsx        # 职位管理
│   │   │   ├── Candidates.jsx   # 候选人管理
│   │   │   ├── AIMatch.jsx     # AI匹配
│   │   │   ├── Interviews.jsx  # 面试安排
│   │   │   ├── InterviewAnalysis.jsx  # 面试分析
│   │   │   ├── Onboarding.jsx  # 入职管理
│   │   │   └── Settings.jsx    # 系统设置
│   │   ├── store/
│   │   │   └── useStore.js     # Zustand状态管理
│   │   ├── App.jsx             # 主应用
│   │   └── main.jsx            # 入口文件
│   ├── public/                 # 静态资源
│   ├── dist/                   # 构建输出
│   └── package.json
│
├── backend/                     # Node.js后端
│   ├── src/
│   │   ├── routes/             # API路由
│   │   │   ├── jobs.js         # 职位管理API
│   │   │   ├── candidates.js    # 候选人API
│   │   │   ├── matching.js     # AI匹配API
│   │   │   ├── interviews.js   # 面试管理API
│   │   │   ├── calls.js        # 外呼API
│   │   │   └── onboarding.js   # 入职API
│   │   ├── services/           # 业务逻辑
│   │   │   ├── aiMatchingService.js   # AI匹配算法
│   │   │   └── aiInterviewService.js  # AI面试服务
│   │   ├── database/           # 数据库
│   │   │   ├── db.js           # 数据库操作
│   │   │   ├── init.js         # 初始化
│   │   │   └── schema.sql      # 表结构
│   │   └── index.js            # 入口文件
│   └── package.json
│
├── docker-compose.yml          # Docker配置
├── Dockerfile.frontend          # 前端Dockerfile
├── Dockerfile.backend           # 后端Dockerfile
└── README.md                   # 项目文档
```

---

## 🔧 开发指南

### 环境要求
- Node.js 18+
- npm 9+
- Git

### API接口文档

#### 职位管理
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/jobs` | 创建职位 |
| GET | `/api/jobs` | 获取职位列表 |
| GET | `/api/jobs/:id` | 获取职位详情 |
| PUT | `/api/jobs/:id` | 更新职位 |
| DELETE | `/api/jobs/:id` | 删除职位 |
| POST | `/api/jobs/:id/analyze` | AI分析职位 |

#### 候选人管理
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/candidates` | 创建候选人 |
| GET | `/api/candidates` | 获取候选人列表 |
| POST | `/api/candidates/import` | 批量导入简历 |
| POST | `/api/candidates/:id/attach-email` | 关联邮箱 |

#### AI匹配
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/match` | 计算匹配度 |
| GET | `/api/match/:jobId` | 获取职位匹配候选人 |
| POST | `/api/match/batch` | 批量匹配 |

#### 面试管理
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/interviews` | 创建面试 |
| POST | `/api/interviews/:id/questions` | 生成面试问题 |
| POST | `/api/interviews/:id/record` | 记录问答 |
| POST | `/api/interviews/:id/analyze` | AI分析面试 |

---

## 🎨 AI算法说明

### 人岗匹配算法

```javascript
综合匹配度 = 技能匹配×40% + 经验匹配×30% + 教育匹配×15% + 薪资匹配×15%
```

#### 技能匹配计算
- 核心技能重合度
- 技能深度评估
- 技术栈兼容性

#### 经验匹配计算
- 工作年限匹配度
- 行业经验相关性
- 项目规模匹配

### AI面试问题生成

基于候选人画像和职位要求，自动生成：
- **行为面试问题**：STAR法则设计
- **技术面试问题**：针对性技能考核
- **情景面试问题**：解决实际问题

### 面试分析评估维度

| 维度 | 权重 | 评估内容 |
|------|------|----------|
| 技术能力 | 35% | 专业技能掌握程度 |
| 沟通表达 | 25% | 逻辑清晰度、表达能力 |
| 问题解决 | 25% | 思维敏捷度、解决方案 |
| 文化契合 | 15% | 价值观匹配度 |

---

## 📝 更新日志

### v1.0.0 (2024-03-29)
- ✨ 首发版本
- ✅ 8大功能模块完整实现
- ✅ AI匹配算法
- ✅ AI面试问题生成
- ✅ 面试分析报告

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

## 📞 联系方式

- **项目维护者**：Matrix Agent
- **技术支持**：智脉AI团队

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️**

</div>
