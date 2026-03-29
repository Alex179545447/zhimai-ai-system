/**
 * AI匹配API路由
 */

import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { jobs, candidates, matches } from "../database/db.js";
import aiMatchingService from "../services/aiMatchingService.js";

const router = express.Router();

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// POST /api/match - 计算人岗匹配度
router.post("/", validate, async (req, res) => {
    try {
        const { job_id, candidate_id } = req.body;
        const job = await jobs.findById(job_id);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        const candidate = await candidates.findById(candidate_id);
        if (!candidate) return res.status(404).json({ success: false, message: "候选人不存在" });
        
        const matchResult = aiMatchingService.calculateMatch(job, candidate);
        let existingMatch = await matches.findByJobAndCandidate(job_id, candidate_id);
        
        if (existingMatch) {
            const updated = await matches.update(existingMatch.id, { skill_match_score: matchResult.skill_match_score, experience_match_score: matchResult.experience_match_score, education_match_score: matchResult.education_match_score, salary_match_score: matchResult.salary_match_score, overall_score: matchResult.overall_score, skill_details: matchResult.skill_details, experience_details: matchResult.experience_details, education_details: matchResult.education_details, salary_details: matchResult.salary_details, match_report: matchResult.match_report, status: "completed" });
            res.json({ success: true, message: "匹配度已更新", data: { match_id: updated.id, ...matchResult } });
        } else {
            const newMatch = await matches.create({ job_id, candidate_id, skill_match_score: matchResult.skill_match_score, experience_match_score: matchResult.experience_match_score, education_match_score: matchResult.education_match_score, salary_match_score: matchResult.salary_match_score, overall_score: matchResult.overall_score, skill_details: matchResult.skill_details, experience_details: matchResult.experience_details, education_details: matchResult.education_details, salary_details: matchResult.salary_details, match_report: matchResult.match_report, status: "completed" });
            await matches.updateRank(job_id);
            res.status(201).json({ success: true, message: "匹配度计算完成", data: { match_id: newMatch.id, ...matchResult } });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "计算匹配度失败", error: error.message });
    }
});

// GET /api/match/:jobId/:candidateId - 获取匹配详情
router.get("/:jobId/:candidateId", validate, async (req, res) => {
    try {
        const match = await matches.findByJobAndCandidate(req.params.jobId, req.params.candidateId);
        if (!match) return res.status(404).json({ success: false, message: "匹配记录不存在" });
        const job = await jobs.findById(req.params.jobId);
        const candidate = await candidates.findById(req.params.candidateId);
        res.json({ success: true, data: { match, job: job ? { id: job.id, title: job.title } : null, candidate: candidate ? { id: candidate.id, name: candidate.name } : null } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取匹配详情失败", error: error.message });
    }
});

// GET /api/match/:jobId - 获取职位所有匹配候选人
router.get("/:jobId", validate, async (req, res) => {
    try {
        const job = await jobs.findById(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: "职位不存在" });
        
        let matchList = await matches.findByJobId(req.params.jobId);
        if (req.query.min_score) matchList = matchList.filter(m => m.overall_score >= parseFloat(req.query.min_score));
        matchList.sort((a, b) => b.overall_score - a.overall_score);
        matchList = matchList.slice(0, parseInt(req.query.max_results) || 50);
        
        const enrichedList = await Promise.all(matchList.map(async (match) => {
            const candidate = await candidates.findById(match.candidate_id);
            return { ...match, candidate: candidate ? { id: candidate.id, name: candidate.name, current_title: candidate.current_title } : null };
        }));
        
        const stats = { total: matchList.length, average_score: matchList.length > 0 ? Math.round(matchList.reduce((sum, m) => sum + m.overall_score, 0) / matchList.length) : 0 };
        res.json({ success: true, data: { job: { id: job.id, title: job.title }, matches: enrichedList.filter(m => m.candidate), statistics: stats } });
    } catch (error) {
        res.status(500).json({ success: false, message: "获取匹配列表失败", error: error.message });
    }
});

// POST /api/match/batch - 批量匹配
router.post("/batch", validate, async (req, res) => {
    try {
        const { job_ids, candidate_ids } = req.body;
        const targetJobs = job_ids ? await Promise.all(job_ids.map(async (id) => await jobs.findById(id))) : [];
        let targetCandidates = candidate_ids ? await Promise.all(candidate_ids.map(async (id) => await candidates.findById(id))) : await candidates.findAll({ limit: 100 });
        
        targetJobs.filter(j => j).forEach(async (job) => {
            targetCandidates.filter(c => c).forEach(async (candidate) => {
                try {
                    const matchResult = aiMatchingService.calculateMatch(job, candidate);
                    const existing = await matches.findByJobAndCandidate(job.id, candidate.id);
                    if (existing) await matches.update(existing.id, { skill_match_score: matchResult.skill_match_score, experience_match_score: matchResult.experience_match_score, education_match_score: matchResult.education_match_score, salary_match_score: matchResult.salary_match_score, overall_score: matchResult.overall_score, skill_details: matchResult.skill_details, experience_details: matchResult.experience_details, education_details: matchResult.education_details, salary_details: matchResult.salary_details, match_report: matchResult.match_report, status: "completed" });
                    else await matches.create({ job_id: job.id, candidate_id: candidate.id, skill_match_score: matchResult.skill_match_score, experience_match_score: matchResult.experience_match_score, education_match_score: matchResult.education_match_score, salary_match_score: matchResult.salary_match_score, overall_score: matchResult.overall_score, skill_details: matchResult.skill_details, experience_details: matchResult.experience_details, education_details: matchResult.education_details, salary_details: matchResult.salary_details, match_report: matchResult.match_report, status: "completed" });
                    await matches.updateRank(job.id);
                } catch (e) { console.error("匹配错误:", e); }
            });
        });
        
        res.json({ success: true, message: "批量匹配任务已提交" });
    } catch (error) {
        res.status(500).json({ success: false, message: "批量匹配失败", error: error.message });
    }
});

export default router;