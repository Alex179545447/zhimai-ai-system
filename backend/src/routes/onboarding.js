/**
 * 入职管理API路由
 */

import express from "express";
import { body, param, validationResult } from "express-validator";
import { onboarding, onboardingSteps, candidates, jobs } from "../database/db.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/onboarding - 创建入职流程
router.post("/", validate, async (req, res) => {
    try {
        const { candidate_id, job_id, start_date, buddy_id, notes } = req.body;
        const candidate = await candidates.findById(candidate_id);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        const job = await jobs.findById(job_id);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        
        const existing = await onboarding.findByCandidateId(candidate_id);
        if (existing && existing.status !== "completed") return res.status(409).json({ success: false, message: "已有进行中的入职流程" });
        
        const startDate = start_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const newOnboarding = await onboarding.create({ candidate_id, job_id, start_date: startDate, status: "pending", current_step: "发送入职邀请函", progress: 0, buddy_id, notes });
        await onboardingSteps.createDefaultSteps(newOnboarding.id);
        
        res.status(201).json({ success: true, message: "入职流程创建成功", data: { onboarding: newOnboarding, candidate: { id: candidate.id, name: candidate.name }, job: { id: job.id, title: job.title } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "创建入职流程失败", error: error.message });
    }
});

// GET /api/onboarding/:candidateId - 获取入职进度
router.get("/:candidateId", validate, async (req, res) => {
    try {
        const candidate = await candidates.findById(req.params.candidateId);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        
        const onboardingData = await onboarding.findByCandidateId(req.params.candidateId);
        if (!onboardingData) return res.status(404).json({ success: false, message: "暂无入职流程" });
        
        const steps = await onboardingSteps.findByOnboardingId(onboardingData.id);
        const job = await jobs.findById(onboardingData.job_id);
        res.json({ success: true, data: { onboarding: onboardingData, candidate: { id: candidate.id, name: candidate.name }, job: job ? { id: job.id, title: job.title } : null, steps } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取入职进度失败", error: error.message });
    }
});

// PUT /api/onboarding/:id - 更新入职状态
router.put("/:id", validate, async (req, res) => {
    try {
        const existing = await onboarding.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "入职流程不存在" });
        
        const updateData = { ...req.body };
        if (updateData.status === "completed") updateData.progress = 100;
        const updated = await onboarding.update(req.params.id, updateData);
        res.json({ success: true, message: "入职状态更新成功", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新入职状态失败", error: error.message });
    }
});

// PUT /api/onboarding/:id/steps/:stepId - 更新步骤状态
router.put("/:id/steps/:stepId", validate, async (req, res) => {
    try {
        const steps = await onboardingSteps.findByOnboardingId(req.params.id);
        const step = steps.find(s => s.id === req.params.stepId);
        if (!step) return res.status(404).json({ success: false, message: "步骤不存在" });
        
        const updateData = { status: req.body.status };
        if (req.body.status === "completed") updateData.completed_at = new Date().toISOString();
        const updatedStep = await onboardingSteps.update(req.params.stepId, updateData);
        
        // 重新计算进度
        const updatedSteps = await onboardingSteps.findByOnboardingId(req.params.id);
        const completedCount = updatedSteps.filter(s => s.status === "completed").length;
        const progress = Math.round((completedCount / updatedSteps.length) * 100);
        const nextStep = updatedSteps.find(s => s.status === "pending");
        await onboarding.update(req.params.id, { progress, current_step: nextStep ? nextStep.step_name : "已完成" });
        
        res.json({ success: true, message: "步骤状态更新成功", data: { step: updatedStep, progress } });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新步骤状态失败", error: error.message });
    }
});

export default router;