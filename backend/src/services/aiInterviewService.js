/**
 * AI面试服务 - 包含面试问题生成和面试分析功能
 */

import { v4 as uuidv4 } from "uuid";

const BEHAVIORAL_QUESTIONS = {
    leadership: ["请描述一次你带领团队完成挑战性项目的经历", "讲述一个你处理团队冲突的情况"],
    problemSolving: ["描述一个你遇到的最复杂技术问题及解决方案", "请举例说明如何在压力下做出重要决策"],
    teamwork: ["请描述你理想中的团队合作模式", "讲述与团队成员意见不合的经历"],
    communication: ["请举例如何向非技术人员解释复杂技术概念"],
    growth: ["请分享你最重要的学习经历", "描述一次失败及从中得到的教训"]
};

class AIInterviewService {
    generateQuestions(options) {
        const { job, candidate, interviewType = "technical", count = 5 } = options;
        const questions = [];
        const jobSkills = this.normalizeSkills(job.skills_required || []);
        
        if (interviewType === "behavioral") {
            Object.keys(BEHAVIORAL_QUESTIONS).forEach(cat => {
                const qList = BEHAVIORAL_QUESTIONS[cat];
                if (qList.length > 0) questions.push({ text: qList[0], category: cat, purpose: this.getPurpose(cat), weight: 1 });
            });
        } else if (interviewType === "technical") {
            jobSkills.slice(0, 3).forEach(skill => {
                questions.push({ text: `请详细解释${skill.name}的核心概念和实际应用`, category: skill.name, purpose: `评估${skill.name}掌握深度`, weight: 2 });
            });
        } else {
            Object.keys(BEHAVIORAL_QUESTIONS).slice(0, 2).forEach(cat => {
                const qList = BEHAVIORAL_QUESTIONS[cat];
                if (qList.length > 0) questions.push({ text: qList[0], category: cat, purpose: this.getPurpose(cat), weight: 1 });
            });
            jobSkills.slice(0, 2).forEach(skill => {
                questions.push({ text: `请解释${skill.name}及其应用场景`, category: skill.name, purpose: `评估${skill.name}理解`, weight: 1.5 });
            });
        }
        
        return questions.slice(0, count).map(q => ({ id: uuidv4(), question_text: q.text, question_type: interviewType, category: q.category, purpose: q.purpose, weight: q.weight || 1, generated_from: "ai_generated" }));
    }

    analyzeInterview(interview, answers, job, candidate) {
        if (!answers || answers.length === 0) return { overall_score: 0, assessment: "无问答记录", risk_points: ["缺少数据"], recommendations: ["请完成面试问答"] };
        
        const scores = { technical: 0, communication: 0, problem_solving: 0, teamwork: 0 };
        answers.forEach(a => { if (a.question_type === "technical") scores.technical = a.score || 75; else { scores.communication += (a.score || 75) * 0.4; scores.teamwork += (a.score || 75) * 0.3; scores.problem_solving += (a.score || 75) * 0.3; } });
        
        const overall = Math.round(scores.technical * 0.35 + scores.communication * 0.2 + scores.problem_solving * 0.25 + scores.teamwork * 0.2);
        const risks = [];
        if (scores.technical < 60) risks.push({ type: "technical", severity: "high", description: "技术能力评分较低" });
        
        const recs = [];
        if (overall >= 85) recs.push({ action: "强烈推荐录用" });
        else if (overall >= 75) recs.push({ action: "建议录用" });
        else if (overall >= 65) recs.push({ action: "有条件录用" });
        else recs.push({ action: "暂不推荐" });
        
        return { overall_score: overall, overall_assessment: overall >= 75 ? "面试表现良好" : "面试表现一般", recommendation: overall >= 85 ? "strongly_recommend" : overall >= 75 ? "recommend" : "consider", capability_scores: scores, risk_points: risks, recommendations: recs };
    }

    normalizeSkills(skills) {
        if (!skills) return [];
        if (typeof skills === "string") { try { skills = JSON.parse(skills); } catch (e) { skills = skills.split(/[,，、;；]/); } }
        if (!Array.isArray(skills)) return [];
        return skills.map(s => typeof s === "string" ? { name: s } : { name: s.name || s });
    }
    getPurpose(cat) { return { leadership: "评估领导力", problemSolving: "评估问题解决能力", teamwork: "评估团队协作", communication: "评估沟通能力", growth: "评估学习能力" }[cat] || "评估综合素质"; }
}

export default new AIInterviewService();
