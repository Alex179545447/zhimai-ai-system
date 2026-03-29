/**
 * 职位管理API路由
 */

import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { jobs, matches } from "../database/db.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/jobs - 创建职位
router.post("/", validate, async (req, res) => {
    try {
        const jobData = { ...req.body, status: req.body.status || "active", priority: req.body.priority || 0, headcount: req.body.headcount || 1 };
        if (jobData.skills_required && !Array.isArray(jobData.skills_required)) jobData.skills_required = [jobData.skills_required];
        const job = await jobs.create(jobData);
        res.status(201).json({ success: true, message: "职位创建成功", data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: "创建职位失败", error: error.message });
    }
});

// GET /api/jobs - 获取职位列表
router.get("/", validate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20, sort = "created_at", order = "DESC" } = req.query;
        const where = status ? { status } : {};
        const orderBy = `${sort} ${order}`;
        const items = await jobs.findAll({ where, orderBy, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        const total = await jobs.count(where);
        res.json({ success: true, data: { items, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取职位列表失败", error: error.message });
    }
});

// GET /api/jobs/:id - 获取职位详情
router.get("/:id", validate, async (req, res) => {
    try {
        const job = await jobs.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        const matchList = await matches.findByJobId(req.params.id);
        res.json({ success: true, data: { ...job, match_count: matchList.length, top_matches: matchList.slice(0, 5) } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取职位详情失败", error: error.message });
    }
});

// PUT /api/jobs/:id - 更新职位
router.put("/:id", validate, async (req, res) => {
    try {
        const existing = await jobs.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "职位不存在" });
        const updateData = { ...req.body };
        if (updateData.skills_required && !Array.isArray(updateData.skills_required)) updateData.skills_required = [updateData.skills_required];
        const updated = await jobs.update(req.params.id, updateData);
        res.json({ success: true, message: "职位更新成功", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新职位失败", error: error.message });
    }
});

// DELETE /api/jobs/:id - 删除职位
router.delete("/:id", validate, async (req, res) => {
    try {
        const existing = await jobs.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "职位不存在" });
        await jobs.delete(req.params.id);
        res.json({ success: true, message: "职位删除成功" });
    } catch (error) {
        res.status(500).json({ success: false, message: "删除职位失败", error: error.message });
    }
});

// POST /api/jobs/:id/analyze - AI分析职位画像
router.post("/:id/analyze", validate, async (req, res) => {
    try {
        const job = await jobs.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        
        const profileAnalysis = {
            overview: `${job.title}职位属于${job.department || ""}部门`,
            key_requirements: { skills: job.skills_required || [], experience: job.experience_required, education: job.education_required },
            candidate_persona: { ideal_experience: job.experience_required, must_have_skills: (job.skills_required || []).slice(0, 3) },
            recommendations: [{ priority: "高", suggestion: "优先筛选具有相关项目经验的候选人" }]
        };
        
        const updated = await jobs.update(req.params.id, { profile_analysis: JSON.stringify(profileAnalysis) });
        res.json({ success: true, message: "职位画像分析完成", data: profileAnalysis });
    } catch (error) {
        res.status(500).json({ success: false, message: "职位画像分析失败", error: error.message });
    }
});

export default router;