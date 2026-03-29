/**
 * 面试管理API路由
 */

import express from "express";
import { body, param, validationResult } from "express-validator";
import { jobs, candidates, interviews, questions, answers } from "../database/db.js";
import aiInterviewService from "../services/aiInterviewService.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/interviews - 创建面试
router.post("/", validate, async (req, res) => {
    try {
        const { job_id, candidate_id } = req.body;
        const job = await jobs.findById(job_id);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        const candidate = await candidates.findById(candidate_id);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        
        const interviewData = { ...req.body, status: req.body.status || "scheduled", duration: req.body.duration || 60, interview_type: req.body.interview_type || "technical" };
        const interview = await interviews.create(interviewData);
        res.status(201).json({ success: true, message: "面试创建成功", data: { interview, job: { id: job.id, title: job.title }, candidate: { id: candidate.id, name: candidate.name } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "创建面试失败", error: error.message });
    }
});

// GET /api/interviews - 获取面试列表
router.get("/", validate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const where = status ? { status } : {};
        const items = await interviews.findAll({ where, limit: parseInt(limit), offset: (parseInt(page) - 1) * parseInt(limit) });
        const enrichedList = await Promise.all(items.map(async (i) => {
            const job = await jobs.findById(i.job_id);
            const candidate = await candidates.findById(i.candidate_id);
            return { ...i, job: job ? { id: job.id, title: job.title } : null, candidate: candidate ? { id: candidate.id, name: candidate.name } : null };
        }));
        res.json({ success: true, data: { items: enrichedList, pagination: { page: parseInt(page), limit: parseInt(limit), total: items.length } } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取面试列表失败", error: error.message });
    }
});

// GET /api/interviews/:id - 获取面试详情
router.get("/:id", validate, async (req, res) => {
    try {
        const interview = await interviews.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: "面试不存在" });
        const job = await jobs.findById(interview.job_id);
        const candidate = await candidates.findById(interview.candidate_id);
        const questionList = await questions.findByInterviewId(interview.id);
        const answerList = await answers.findByInterviewId(interview.id);
        res.json({ success: true, data: { interview, job, candidate, questions: questionList, answers: answerList } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取面试详情失败", error: error.message });
    }
});

// PUT /api/interviews/:id - 更新面试状态
router.put("/:id", validate, async (req, res) => {
    try {
        const existing = await interviews.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "面试不存在" });
        const updateData = { ...req.body };
        if (updateData.status === "completed" && existing.status !== "completed") updateData.completed_at = new Date().toISOString();
        const updated = await interviews.update(req.params.id, updateData);
        res.json({ success: true, message: "面试更新成功", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "更新面试失败", error: error.message });
    }
});

// POST /api/interviews/:id/questions - AI生成面试问题
router.post("/:id/questions", validate, async (req, res) => {
    try {
        const interview = await interviews.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: "面试不存在" });
        const job = await jobs.findById(interview.job_id);
        const candidate = await candidates.findById(interview.candidate_id);
        if (!job || !candidate) return res.status(404).json({ success: false, message: "职位或候选人信息不完整" });
        
        await questions.deleteByInterviewId(interview.id);
        const generatedQuestions = aiInterviewService.generateQuestions({ job, candidate, interviewType: req.body.interview_type || interview.interview_type || "technical", count: req.body.count || 5 });
        const savedQuestions = await questions.createBatch(generatedQuestions.map(q => ({ ...q, interview_id: interview.id })));
        res.status(201).json({ success: true, message: `成功生成${savedQuestions.length}个面试问题`, data: { interview_id: interview.id, questions: savedQuestions } });
    } catch (error) {
        res.status(500).json({ success: false, message: "生成面试问题失败", error: error.message });
    }
});

// POST /api/interviews/:id/record - 记录面试问答
router.post("/:id/record", validate, async (req, res) => {
    try {
        const interview = await interviews.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: "面试不存在" });
        const answer = await answers.create({ interview_id: interview.id, question_id: req.body.question_id, answer_text: req.body.answer_text, audio_url: req.body.audio_url, score: req.body.score, feedback: req.body.feedback });
        res.status(201).json({ success: true, message: "问答记录成功", data: answer });
    } catch (error) {
        res.status(500).json({ success: false, message: "记录问答失败", error: error.message });
    }
});

// POST /api/interviews/:id/analyze - AI分析面试
router.post("/:id/analyze", validate, async (req, res) => {
    try {
        const interview = await interviews.findById(req.params.id);
        if (!interview) return res.status(404).json({ success: false, message: "面试不存在" });
        const answerList = await answers.findByInterviewId(interview.id);
        if (answerList.length === 0) return res.status(400).json({ success: false, message: "暂无问答记录" });
        
        const job = await jobs.findById(interview.job_id);
        const candidate = await candidates.findById(interview.candidate_id);
        const analysisResult = aiInterviewService.analyzeInterview(interview, answerList, job, candidate);
        
        const updated = await interviews.update(interview.id, { overall_score: analysisResult.overall_score, overall_assessment: analysisResult.overall_assessment, recommendation: analysisResult.recommendation, risk_points: analysisResult.risk_points, analysis_report: analysisResult, status: "completed" });
        res.json({ success: true, message: "面试分析完成", data: { interview_id: interview.id, analysis: analysisResult } });
    } catch (error) {
        res.status(500).json({ success: false, message: "面试分析失败", error: error.message });
    }
});

export default router;