/**
 * AI匹配服务 - 实现完整的人岗匹配算法
 */

const OVERALL_WEIGHTS = { skill: 0.40, experience: 0.30, education: 0.15, salary: 0.15 };
const SKILL_WEIGHTS = { core: 1.0, important: 0.8, bonus: 0.5, basic: 0.3 };
const SCHOOL_TIERS = { tier1: ["清华大学", "北京大学", "复旦大学", "上海交通大学", "浙江大学"], tier2: ["同济大学", "北京航空航天大学", "武汉大学", "南京大学"], tier3: ["南开大学", "厦门大学", "四川大学"] };
const EDUCATION_TIERS = { "博士": 5, "硕士": 4, "本科": 3, "大专": 2, "其他": 1 };

class AIMatchingService {
    calculateMatch(job, candidate) {
        const skillMatch = this.calculateSkillMatch(job, candidate);
        const experienceMatch = this.calculateExperienceMatch(job, candidate);
        const educationMatch = this.calculateEducationMatch(job, candidate);
        const salaryMatch = this.calculateSalaryMatch(job, candidate);
        
        const overallScore = Math.round(skillMatch.score * OVERALL_WEIGHTS.skill + experienceMatch.score * OVERALL_WEIGHTS.experience + educationMatch.score * OVERALL_WEIGHTS.education + salaryMatch.score * OVERALL_WEIGHTS.salary);
        const matchReport = this.generateMatchReport(job, candidate, skillMatch, experienceMatch, educationMatch, salaryMatch, overallScore);
        
        return { skill_match_score: skillMatch.score, experience_match_score: experienceMatch.score, education_match_score: educationMatch.score, salary_match_score: salaryMatch.score, overall_score: overallScore, skill_details: skillMatch.details, experience_details: experienceMatch.details, education_details: educationMatch.details, salary_details: salaryMatch.details, match_report: matchReport };
    }

    calculateSkillMatch(job, candidate) {
        const jobSkills = this.normalizeSkills(job.skills_required);
        const candidateSkills = this.normalizeSkills(candidate.skills);
        if (jobSkills.length === 0) return { score: candidateSkills.length > 0 ? 70 : 100, details: { matched_skills: [], missing_skills: [], bonus_skills: candidateSkills.map(s => s.name || s) } };
        
        let matchedScore = 0, totalWeight = 0;
        const matchedSkills = [], missingSkills = [], bonusSkills = [];
        
        jobSkills.forEach(skill => {
            totalWeight += skill.weight || SKILL_WEIGHTS.basic;
            const matched = this.findSkillMatch(skill.name, candidateSkills);
            if (matched) { matchedScore += (skill.weight || SKILL_WEIGHTS.basic) * matched.similarity; matchedSkills.push({ skill: skill.name, similarity: matched.similarity }); }
            else missingSkills.push(skill.name);
        });
        
        candidateSkills.forEach(cs => {
            const name = cs.name || cs;
            if (!jobSkills.some(js => this.fuzzyMatch(js.name.toLowerCase(), name.toLowerCase()))) bonusSkills.push(name);
        });
        
        const score = totalWeight > 0 ? Math.round((matchedScore / totalWeight) * 100) : 0;
        return { score, details: { required_skills: jobSkills.map(s => s.name), matched_skills: matchedSkills, missing_skills: missingSkills, bonus_skills: bonusSkills } };
    }

    calculateExperienceMatch(job, candidate) {
        const requiredYears = this.parseYears(job.experience_required);
        const candidateYears = candidate.years_of_experience || 0;
        let yearsScore = candidateYears >= requiredYears ? (candidateYears - requiredYears <= 2 ? 100 : 95) : Math.max(0, 100 - (requiredYears - candidateYears) * 15);
        const domainScore = this.calculateDomainMatch(job, candidate);
        const levelScore = this.calculateLevelMatch(candidate);
        const score = Math.round(yearsScore * 0.4 + domainScore * 0.3 + levelScore * 0.3);
        return { score, details: { required_years: requiredYears, candidate_years: candidateYears, years_match: yearsScore, domain_match: domainScore, level_match: levelScore } };
    }

    calculateEducationMatch(job, candidate) {
        const requiredLevel = this.parseEducationReq(job.education_required);
        const candidateLevel = candidate.education_level || "本科";
        const levelScore = this.calculateLevelMatchEdu(requiredLevel, candidateLevel);
        const schoolScore = this.calculateSchoolScore(candidate.education_school);
        const majorScore = this.calculateMajorMatch(job, candidate);
        const score = Math.round(levelScore * 0.6 + schoolScore * 0.2 + majorScore * 0.2);
        return { score, details: { required_level: requiredLevel, candidate_level: candidateLevel, level_match: levelScore, school: candidate.education_school, major: candidate.education_major, major_match: majorScore } };
    }

    calculateSalaryMatch(job, candidate) {
        const jobSalaryMin = job.salary_min || 0, jobSalaryMax = job.salary_max || jobSalaryMin * 2;
        const expectedSalary = candidate.expected_salary || 0, currentSalary = candidate.current_salary || 0;
        if (expectedSalary === 0 && currentSalary === 0) return { score: 70, details: { job_salary_range: [jobSalaryMin, jobSalaryMax], expected_salary: null } };
        
        let rangeScore = 100;
        if (expectedSalary > 0) {
            if (expectedSalary >= jobSalaryMin && expectedSalary <= jobSalaryMax) rangeScore = 100;
            else if (expectedSalary < jobSalaryMin) rangeScore = Math.max(60, 100 - ((jobSalaryMin - expectedSalary) / jobSalaryMin) * 20);
            else rangeScore = Math.max(30, 100 - ((expectedSalary - jobSalaryMax) / jobSalaryMax) * 40);
        }
        
        let gapScore = 100;
        if (expectedSalary > 0 && currentSalary > 0) {
            const gap = ((expectedSalary - currentSalary) / currentSalary) * 100;
            if (gap > 50) gapScore = Math.max(40, 100 - (gap - 50));
        }
        
        const score = Math.round(rangeScore * 0.5 + gapScore * 0.3 + 70 * 0.2);
        return { score, details: { job_salary_range: [jobSalaryMin, jobSalaryMax], expected_salary: expectedSalary, current_salary: currentSalary, range_match: rangeScore } };
    }

    normalizeSkills(skills) {
        if (!skills) return [];
        if (typeof skills === "string") {
            try { skills = JSON.parse(skills); } catch (e) { skills = skills.split(/[,，、;；]/).map(s => s.trim()).filter(s => s); }
        }
        if (!Array.isArray(skills)) return [];
        return skills.map(s => typeof s === "string" ? { name: s, weight: SKILL_WEIGHTS.basic } : { name: s.name || s, weight: s.weight || SKILL_WEIGHTS.basic });
    }

    findSkillMatch(required, candidateSkills) {
        const req = required.toLowerCase().trim();
        for (const cs of candidateSkills) {
            const cname = (cs.name || cs).toLowerCase().trim();
            if (cname === req) return { name: cs.name || cs, similarity: 1.0 };
            if (cname.includes(req) || req.includes(cname)) return { name: cs.name || cs, similarity: 0.85 };
            if (this.fuzzyMatch(req, cname)) return { name: cs.name || cs, similarity: 0.7 };
        }
        return null;
    }

    fuzzyMatch(str1, str2) {
        if (!str1 || !str2) return false;
        const keywords = ["react", "vue", "node", "python", "java", "javascript", "typescript", "sql", "mysql", "docker", "git"];
        for (const kw of keywords) { if (str1.includes(kw) && str2.includes(kw)) return true; }
        const minLen = Math.min(str1.length, str2.length);
        let matches = 0;
        for (let i = 0; i < minLen; i++) { if (str1[i] === str2[i]) matches++; }
        return matches / Math.max(str1.length, str2.length) > 0.7;
    }

    parseYears(requirement) { if (!requirement) return 0; const match = requirement.toString().match(/(\d+)/); return match ? parseInt(match[1]) : 0; }
    calculateDomainMatch(job, candidate) { const jobText = (job.description || "") + " " + (job.title || ""); const candidateText = (candidate.current_title || "") + " " + (candidate.current_company || ""); const jobWords = jobText.split(/[,，、;；.\s]+/).filter(w => w.length >= 2); const candidateWords = candidateText.split(/[,，、;；.\s]+/).filter(w => w.length >= 2); const overlap = jobWords.filter(w => candidateWords.some(cw => this.fuzzyMatch(w.toLowerCase(), cw.toLowerCase()))); return overlap.length === 0 ? 50 : Math.min(100, 50 + overlap.length * 15); }
    calculateLevelMatch(candidate) { const title = (candidate.current_title || "").toLowerCase(); if (title.includes("senior") || title.includes("高级") || title.includes("资深")) return 90; if (title.includes("lead") || title.includes("主管")) return 85; if (title.includes("manager") || title.includes("经理")) return 80; return 75; }
    parseEducationReq(req) { if (!req) return "本科"; const text = req.toString(); if (text.includes("博士")) return "博士"; if (text.includes("硕士")) return "硕士"; if (text.includes("本科")) return "本科"; if (text.includes("大专")) return "大专"; return "本科"; }
    calculateLevelMatchEdu(required, candidate) { const reqTier = EDUCATION_TIERS[required] || 3; const candTier = EDUCATION_TIERS[candidate] || 3; return candTier >= reqTier ? 100 : Math.max(0, 100 - (reqTier - candTier) * 25); }
    calculateSchoolScore(school) { if (!school) return 50; if (SCHOOL_TIERS.tier1.some(s => school.includes(s))) return 100; if (SCHOOL_TIERS.tier2.some(s => school.includes(s))) return 90; if (SCHOOL_TIERS.tier3.some(s => school.includes(s))) return 80; if (school.includes("985") || school.includes("211")) return 70; return 60; }
    calculateMajorMatch(job, candidate) { const major = candidate.education_major || ""; if (!major) return 50; return 50; }

    generateMatchReport(job, candidate, skillMatch, experienceMatch, educationMatch, salaryMatch, overallScore) {
        const strengths = [], weaknesses = [], suggestions = [];
        if (skillMatch.score >= 80) strengths.push("技能匹配度优秀");
        if (experienceMatch.score >= 85) strengths.push("工作经验满足要求");
        if (educationMatch.score >= 85) strengths.push("教育背景优秀");
        if (salaryMatch.score >= 85) strengths.push("薪资期望合理");
        if (skillMatch.score < 60) { weaknesses.push("技能匹配度不足"); suggestions.push("建议补充相关技能"); }
        return { summary: overallScore >= 80 ? "候选人高度匹配" : overallScore >= 65 ? "候选人基本匹配" : "候选人匹配度一般", overall_score: overallScore, recommendation: overallScore >= 85 ? "strongly_recommend" : overallScore >= 75 ? "recommend" : overallScore >= 65 ? "consider" : "not_recommend", strengths: strengths.length ? strengths : ["暂无明显优势"], weaknesses: weaknesses.length ? weaknesses : ["暂无明显劣势"], suggestions: suggestions.length ? suggestions : [], risk_factors: this.identifyRisks(candidate, overallScore) };
    }

    identifyRisks(candidate, overallScore) {
        const risks = [];
        if (candidate.years_of_experience < 1) risks.push({ factor: "经验较少", severity: "medium", description: "可能需要较长适应期" });
        if (overallScore < 65) risks.push({ factor: "综合匹配度低", severity: "high", description: "与职位要求存在较大差距" });
        return risks;
    }
}

export default new AIMatchingService();