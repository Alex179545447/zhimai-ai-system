/**
 * AI智能招聘系统 - 主入口文件
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import jobsRouter from "./routes/jobs.js";
import candidatesRouter from "./routes/candidates.js";
import matchingRouter from "./routes/matching.js";
import interviewsRouter from "./routes/interviews.js";
import callsRouter from "./routes/calls.js";
import onboardingRouter from "./routes/onboarding.js";
import { getDb } from "./database/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan(process.env.LOG_LEVEL || "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 确保目录存在
const uploadsDir = path.join(__dirname, "../uploads");
const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.use("/uploads", express.static(uploadsDir));

// API路由
app.use("/api/jobs", jobsRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/match", matchingRouter);
app.use("/api/interviews", interviewsRouter);
app.use("/api/calls", callsRouter);
app.use("/api/onboarding", onboardingRouter);

// 健康检查
app.get("/api/health", async (req, res) => {
    try {
        await getDb();
        res.json({ success: true, status: "healthy", timestamp: new Date().toISOString(), database: "connected" });
    } catch (error) {
        res.status(500).json({ success: false, status: "unhealthy", error: error.message });
    }
});

// API信息
app.get("/api", (req, res) => {
    res.json({
        success: true,
        name: "AI智能招聘系统后端API",
        version: "1.0.0",
        endpoints: { jobs: "/api/jobs", candidates: "/api/candidates", matching: "/api/match", interviews: "/api/interviews", calls: "/api/calls", onboarding: "/api/onboarding" }
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ success: false, message: `路由 ${req.method} ${req.path} 不存在` });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error("全局错误:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "文件大小超过限制" });
    }
    res.status(err.status || 500).json({ success: false, message: err.message || "服务器内部错误" });
});

const server = app.listen(PORT, async () => {
    await getDb(); // 初始化数据库
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║           AI智能招聘系统后端服务启动成功                   ║
╠═══════════════════════════════════════════════════════════╣
║  服务地址: http://localhost:${PORT}                          ║
║  API文档:  http://localhost:${PORT}/api                      ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

process.on("SIGTERM", () => { server.close(() => { console.log("服务器已关闭"); process.exit(0); }); });
process.on("SIGINT", () => { server.close(() => { console.log("服务器已关闭"); process.exit(0); }); });

export default app;