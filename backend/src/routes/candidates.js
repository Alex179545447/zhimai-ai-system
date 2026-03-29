/**
 * 候选人管理API路由
 */

import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { body, param, query, validationResult } from "express-validator";
import { candidates, resumes } from "../database/db.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads/resumes"),
    filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/candidates
router.post("/", validate, async (req, res) => {
    try {
        if (req.body.email) {
            const existing = await candidates.findByEmail(req.body.email);
            if (existing) return res.status(409).json({ success: false, message: "邮箱已被使用", data: { existing_id: existing.id } });
        }
        const data = { ...req.body, status: req.body.status || "new" };
        if (data.skills && !Array.isArray(data.skills)) data.skills = [data.skills];
        if (data.tags && !Array.isArray(data.tags)) data.tags = [data.tags];
        const candidate = await candidates.create(data);
        res.status(201).json({ success: true, message: "候选人创建成功", data: candidate });
    } catch (error) {
        res.status(500).json({ success: false, message: "创建候选人失败", error: error.message });
    }
});

// GET /api/candidates
router.get("/", validate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = status ? { status } : {};
        const items = await candidates.findAll({ where, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        const total = await candidates.count(where);
        res.json({ success: true, data: { items, pagination: { page: parseInt(page), limit: parseInt(limit), total } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取候选人列表失败", error: error.message });
    }
});

// GET /api/candidates/:id
router.get("/:id", validate, async (req, res) => {
    try {
        const candidate = await candidates.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        const resumeList = await resumes.findByCandidateId(req.params.id);
        res.json({ success: true, data: { ...candidate, resumes: resumeList } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取候选人详情失败", error: error.message });
    }
});

// PUT /api/candidates/:id
router.put("/:id", validate, async (req, res) => {
    try {
        const existing = await candidates.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "候选人不存在" });
        const updateData = { ...req.body };
        if (updateData.skills && !Array.isArray(updateData.skills)) updateData.skills = [updateData.skills];
        const updated = await candidates.update(req.params.id, updateData);
        res.json({ success: true, message: "候选人更新成功", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新候选人失败", error: error.message });
    }
});

// POST /api/candidates/import
router.post("/import", upload.single("resume"), async (req, res) => {
    try {
        const results = { success: [], failed: [] };
        if (req.file) {
            const candidateId = req.body.candidate_id;
            if (candidateId) {
                const candidate = await candidates.findById(candidateId);
                if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
                const resume = await resumes.create({ candidate_id: candidateId, file_name: req.file.originalname, file_path: req.file.path, file_type: path.extname(req.file.originalname), file_size: req.file.size });
                results.success.push({ candidate_id: candidateId, resume_id: resume.id });
            }
        }
        res.status(201).json({ success: true, message: `导入完成`, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: "批量导入失败", error: error.message });
    }
});

// POST /api/candidates/:id/attach-email
router.post("/:id/attach-email", validate, async (req, res) => {
    try {
        const candidate = await candidates.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        const { email, subject, action = "add" } = req.body;
        let emailHistory = candidate.email_history || [];
        if (!Array.isArray(emailHistory)) emailHistory = [];
        emailHistory.push({ id: uuidv4(), email, subject: subject || "", action, timestamp: new Date().toISOString() });
        const updated = await candidates.update(req.params.id, { email: candidate.email || email, email_history: emailHistory });
        res.json({ success: true, message: "邮箱关联成功", data: { candidate_id: updated.id } });
    } catch (error) {
        res.status(500).json({ success: false, message: "关联邮箱失败", error: error.message });
    }
});

export default router;