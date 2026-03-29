/**
 * 外呼管理API路由
 */

import express from "express";
import { body, param, validationResult } from "express-validator";
import { calls, candidates, jobs } from "../database/db.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/calls/outbound - 创建外呼任务
router.post("/outbound", validate, async (req, res) => {
    try {
        const { candidate_id, job_id, phone_number, call_type, priority, scheduled_at, notes } = req.body;
        if (!phone_number) return res.status(400).json({ success: false, message: "电话号码不能为空" });
        const callData = { candidate_id, job_id, phone_number, call_type: call_type || "outbound", status: "pending", priority: priority || 0, scheduled_at, notes };
        const call = await calls.create(callData);
        res.status(201).json({ success: true, message: "外呼任务创建成功", data: call });
    } catch (error) {
        res.status(500).json({ success: false, message: "创建外呼任务失败", error: error.message });
    }
});

// GET /api/calls - 获取外呼记录
router.get("/", validate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = status ? { status } : {};
        const items = await calls.findAll({ where, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        const enrichedList = await Promise.all(items.map(async (c) => {
            const candidate = c.candidate_id ? await candidates.findById(c.candidate_id) : null;
            const job = c.job_id ? await jobs.findById(c.job_id) : null;
            return { ...c, candidate: candidate ? { id: candidate.id, name: candidate.name } : null, job: job ? { id: job.id, title: job.title } : null };
        }));
        res.json({ success: true, data: { items: enrichedList, pagination: { page: parseInt(page), limit: parseInt(limit), total: items.length } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取外呼记录失败", error: error.message });
    }
});

// PUT /api/calls/:id/status - 更新外呼状态
router.put("/:id/status", validate, async (req, res) => {
    try {
        const existing = await calls.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "外呼记录不存在" });
        const { status, outcome, notes, duration } = req.body;
        const updateData = { status, outcome, notes };
        if (status === "in_progress" && existing.status === "pending") updateData.started_at = new Date().toISOString();
        if (["completed", "failed", "no_answer"].includes(status)) { updateData.ended_at = new Date().toISOString(); if (existing.started_at && !duration) updateData.duration = Math.round((new Date(updateData.ended_at) - new Date(existing.started_at)) / 1000); }
        if (duration) updateData.duration = duration;
        const updated = await calls.update(req.params.id, updateData);
        res.json({ success: true, message: "外呼状态更新成功", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新外呼状态失败", error: error.message });
    }
});

export default router;