/**
 * 数据库操作层 - sql.js实现
 */

import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || './data/recruitment.db';

// 确保data目录存在
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db = null;
let SQL = null;

// 初始化SQL.js
async function initSql() {
    if (!SQL) {
        SQL = await initSqlJs();
    }
    return SQL;
}

// 获取数据库连接
async function getDb() {
    if (!db) {
        await initSql();
        
        // 尝试加载现有数据库
        if (fs.existsSync(DB_PATH)) {
            const buffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(buffer);
        } else {
            db = new SQL.Database();
            // 初始化schema
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            db.run(schema);
            saveDb();
        }
        
        db.run('PRAGMA foreign_keys = ON');
    }
    return db;
}

// 保存数据库到文件
function saveDb() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// 关闭数据库
function closeDb() {
    if (db) {
        saveDb();
        db.close();
        db = null;
    }
}

// 通用CRUD操作
const dbOperations = {
    async create(table, data) {
        const database = await getDb();
        const id = data.id || uuidv4();
        const now = new Date().toISOString();
        
        const record = {
            id,
            ...data,
            created_at: data.created_at || now,
            updated_at: now
        };
        
        const columns = Object.keys(record);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(record);
        
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
        database.run(sql, values);
        saveDb();
        
        return record;
    },
    
    async findById(table, id) {
        const database = await getDb();
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        const result = database.exec(sql, [id]);
        if (result.length === 0 || result[0].values.length === 0) return null;
        return rowToObject(result[0].columns, result[0].values[0]);
    },
    
    async findAll(table, options = {}) {
        const database = await getDb();
        const { where = {}, orderBy = 'created_at DESC', limit, offset = 0, columns = '*' } = options;
        
        let sql = `SELECT ${columns} FROM ${table}`;
        const params = [];
        
        if (Object.keys(where).length > 0) {
            const whereClauses = Object.keys(where).map(key => {
                params.push(where[key]);
                return `${key} = ?`;
            });
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        sql += ` ORDER BY ${orderBy}`;
        
        if (limit) {
            sql += ` LIMIT ? OFFSET ?`;
            params.push(limit, offset);
        }
        
        const result = database.exec(sql, params);
        if (result.length === 0) return [];
        return result[0].values.map(row => rowToObject(result[0].columns, row));
    },
    
    async update(table, id, data) {
        const database = await getDb();
        const now = new Date().toISOString();
        
        const record = { ...data, updated_at: now };
        const columns = Object.keys(record);
        const setClause = columns.map(col => `${col} = ?`).join(', ');
        const values = [...Object.values(record), id];
        
        const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
        database.run(sql, values);
        saveDb();
        
        return this.findById(table, id);
    },
    
    async delete(table, id) {
        const database = await getDb();
        const sql = `DELETE FROM ${table} WHERE id = ?`;
        database.run(sql, [id]);
        saveDb();
        return true;
    },
    
    async count(table, where = {}) {
        const database = await getDb();
        let sql = `SELECT COUNT(*) as count FROM ${table}`;
        const params = [];
        
        if (Object.keys(where).length > 0) {
            const whereClauses = Object.keys(where).map(key => {
                params.push(where[key]);
                return `${key} = ?`;
            });
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        
        const result = database.exec(sql, params);
        return result.length > 0 ? result[0].values[0][0] : 0;
    }
};

// 辅助函数：将数据库行转换为对象
function rowToObject(columns, row) {
    const obj = {};
    columns.forEach((col, i) => {
        obj[col] = row[i];
    });
    return obj;
}

// 职位相关操作
const jobOperations = {
    async create(jobData) { return dbOperations.create('jobs', jobData); },
    async findById(id) {
        const job = await dbOperations.findById('jobs', id);
        if (job?.skills_required) {
            try { job.skills_required = JSON.parse(job.skills_required); } catch (e) { job.skills_required = []; }
        }
        return job;
    },
    async findAll(options = {}) {
        const jobs = await dbOperations.findAll('jobs', options);
        return jobs.map(job => {
            if (job?.skills_required) {
                try { job.skills_required = JSON.parse(job.skills_required); } catch (e) { job.skills_required = []; }
            }
            return job;
        });
    },
    async update(id, data) {
        if (data.skills_required && Array.isArray(data.skills_required)) data.skills_required = JSON.stringify(data.skills_required);
        return dbOperations.update('jobs', id, data);
    },
    async delete(id) { return dbOperations.delete('jobs', id); },
    async count(where = {}) { return dbOperations.count('jobs', where); }
};

// 候选人相关操作
const candidateOperations = {
    async create(candidateData) { return dbOperations.create('candidates', candidateData); },
    async findById(id) {
        const c = await dbOperations.findById('candidates', id);
        if (c) this._parseJsonFields(c);
        return c;
    },
    async findAll(options = {}) {
        const list = await dbOperations.findAll('candidates', options);
        list.forEach(c => this._parseJsonFields(c));
        return list;
    },
    async update(id, data) {
        if (data.skills && Array.isArray(data.skills)) data.skills = JSON.stringify(data.skills);
        if (data.tags && Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
        return dbOperations.update('candidates', id, data);
    },
    async delete(id) { return dbOperations.delete('candidates', id); },
    async count(where = {}) { return dbOperations.count('candidates', where); },
    async findByEmail(email) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM candidates WHERE email = ?`, [email]);
        if (result.length === 0 || result[0].values.length === 0) return null;
        const c = rowToObject(result[0].columns, result[0].values[0]);
        this._parseJsonFields(c);
        return c;
    },
    _parseJsonFields(candidate) {
        ['skills', 'tags', 'email_history'].forEach(field => {
            if (candidate[field]) {
                try { candidate[field] = JSON.parse(candidate[field]); } catch (e) { candidate[field] = []; }
            } else { candidate[field] = []; }
        });
    }
};

// 简历相关操作
const resumeOperations = {
    async create(data) { return dbOperations.create('resumes', data); },
    async findById(id) {
        const r = await dbOperations.findById('resumes', id);
        if (r?.parsed_data) { try { r.parsed_data = JSON.parse(r.parsed_data); } catch (e) { r.parsed_data = {}; } }
        return r;
    },
    async findByCandidateId(candidateId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM resumes WHERE candidate_id = ? ORDER BY created_at DESC`, [candidateId]);
        if (result.length === 0) return [];
        return result[0].values.map(row => {
            const r = rowToObject(result[0].columns, row);
            if (r.parsed_data) { try { r.parsed_data = JSON.parse(r.parsed_data); } catch (e) { r.parsed_data = {}; } }
            return r;
        });
    },
    async update(id, data) {
        if (data.parsed_data && typeof data.parsed_data === 'object') data.parsed_data = JSON.stringify(data.parsed_data);
        return dbOperations.update('resumes', id, data);
    },
    async delete(id) { return dbOperations.delete('resumes', id); }
};

// 匹配相关操作
const matchOperations = {
    async create(data) {
        ['skill_details', 'experience_details', 'education_details', 'salary_details', 'match_report'].forEach(f => {
            if (data[f] && typeof data[f] === 'object') data[f] = JSON.stringify(data[f]);
        });
        return dbOperations.create('matches', data);
    },
    async findById(id) {
        const m = await dbOperations.findById('matches', id);
        if (m) this._parseJsonFields(m);
        return m;
    },
    async findByJobAndCandidate(jobId, candidateId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM matches WHERE job_id = ? AND candidate_id = ?`, [jobId, candidateId]);
        if (result.length === 0 || result[0].values.length === 0) return null;
        const m = rowToObject(result[0].columns, result[0].values[0]);
        this._parseJsonFields(m);
        return m;
    },
    async findByJobId(jobId, options = {}) {
        const list = await dbOperations.findAll('matches', { where: { job_id: jobId }, ...options });
        list.forEach(m => this._parseJsonFields(m));
        return list;
    },
    async findByCandidateId(candidateId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM matches WHERE candidate_id = ? ORDER BY overall_score DESC`, [candidateId]);
        if (result.length === 0) return [];
        return result[0].values.map(row => {
            const m = rowToObject(result[0].columns, row);
            this._parseJsonFields(m);
            return m;
        });
    },
    async update(id, data) {
        ['skill_details', 'experience_details', 'education_details', 'salary_details', 'match_report'].forEach(f => {
            if (data[f] && typeof data[f] === 'object') data[f] = JSON.stringify(data[f]);
        });
        return dbOperations.update('matches', id, data);
    },
    async updateRank(jobId) {
        const matches = await this.findByJobId(jobId);
        matches.forEach((m, index) => {
            dbOperations.update('matches', m.id, { rank: index + 1 });
        });
        return matches.length;
    },
    async delete(id) { return dbOperations.delete('matches', id); },
    _parseJsonFields(match) {
        ['skill_details', 'experience_details', 'education_details', 'salary_details'].forEach(f => {
            if (match[f]) { try { match[f] = JSON.parse(match[f]); } catch (e) { match[f] = {}; } }
            else { match[f] = {}; }
        });
        if (match.match_report) { try { match.match_report = JSON.parse(match.match_report); } catch (e) { match.match_report = {}; } }
    }
};

// 面试相关操作
const interviewOperations = {
    async create(data) {
        if (data.risk_points && Array.isArray(data.risk_points)) data.risk_points = JSON.stringify(data.risk_points);
        return dbOperations.create('interviews', data);
    },
    async findById(id) {
        const i = await dbOperations.findById('interviews', id);
        if (i) this._parseJsonFields(i);
        return i;
    },
    async findAll(options = {}) {
        const list = await dbOperations.findAll('interviews', options);
        list.forEach(i => this._parseJsonFields(i));
        return list;
    },
    async findByJobId(jobId) { return this.findAll({ where: { job_id: jobId } }); },
    async findByCandidateId(candidateId) { return this.findAll({ where: { candidate_id: candidateId } }); },
    async update(id, data) {
        if (data.risk_points && Array.isArray(data.risk_points)) data.risk_points = JSON.stringify(data.risk_points);
        if (data.analysis_report && typeof data.analysis_report === 'object') data.analysis_report = JSON.stringify(data.analysis_report);
        return dbOperations.update('interviews', id, data);
    },
    async delete(id) { return dbOperations.delete('interviews', id); },
    _parseJsonFields(interview) {
        if (interview.risk_points) { try { interview.risk_points = JSON.parse(interview.risk_points); } catch (e) { interview.risk_points = []; } }
        if (interview.analysis_report) { try { interview.analysis_report = JSON.parse(interview.analysis_report); } catch (e) { interview.analysis_report = {}; } }
    }
};

// 问题相关操作
const questionOperations = {
    async create(data) { return dbOperations.create('questions', data); },
    async createBatch(questions) {
        const database = await getDb();
        questions.forEach(q => {
            const id = q.id || uuidv4();
            database.run(`INSERT INTO questions (id, interview_id, question_type, category, question_text, purpose, weight, generated_from) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, q.interview_id, q.question_type, q.category || '', q.question_text, q.purpose || '', q.weight || 1, q.generated_from || '']);
        });
        saveDb();
        return questions;
    },
    async findByInterviewId(interviewId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM questions WHERE interview_id = ? ORDER BY question_type, id`, [interviewId]);
        if (result.length === 0) return [];
        return result[0].values.map(row => rowToObject(result[0].columns, row));
    },
    async delete(id) { return dbOperations.delete('questions', id); },
    async deleteByInterviewId(interviewId) {
        const database = await getDb();
        database.run(`DELETE FROM questions WHERE interview_id = ?`, [interviewId]);
        saveDb();
        return true;
    }
};

// 回答相关操作
const answerOperations = {
    async create(data) { return dbOperations.create('answers', data); },
    async findById(id) { return dbOperations.findById('answers', id); },
    async findByInterviewId(interviewId) {
        const db = await getDb();
        const result = db.exec(`SELECT a.*, q.question_text, q.question_type, q.category, q.weight FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.interview_id = ? ORDER BY q.question_type, a.created_at`, [interviewId]);
        if (result.length === 0) return [];
        return result[0].values.map(row => rowToObject(result[0].columns, row));
    },
    async update(id, data) { return dbOperations.update('answers', id, data); }
};

// 外呼相关操作
const callOperations = {
    async create(data) { return dbOperations.create('calls', data); },
    async findById(id) { return dbOperations.findById('calls', id); },
    async findAll(options = {}) { return dbOperations.findAll('calls', options); },
    async findByCandidateId(candidateId) { return this.findAll({ where: { candidate_id: candidateId } }); },
    async update(id, data) { return dbOperations.update('calls', id, data); },
    async updateStatus(id, status, additionalData = {}) {
        const data = { status, ...additionalData };
        if (status === 'completed') data.ended_at = new Date().toISOString();
        return this.update(id, data);
    },
    async delete(id) { return dbOperations.delete('calls', id); }
};

// 入职相关操作
const onboardingOperations = {
    async create(data) {
        if (data.steps_completed && Array.isArray(data.steps_completed)) data.steps_completed = JSON.stringify(data.steps_completed);
        if (data.documents && typeof data.documents === 'object') data.documents = JSON.stringify(data.documents);
        return dbOperations.create('onboarding', data);
    },
    async findById(id) {
        const o = await dbOperations.findById('onboarding', id);
        if (o) this._parseJsonFields(o);
        return o;
    },
    async findByCandidateId(candidateId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM onboarding WHERE candidate_id = ? ORDER BY created_at DESC LIMIT 1`, [candidateId]);
        if (result.length === 0 || result[0].values.length === 0) return null;
        const o = rowToObject(result[0].columns, result[0].values[0]);
        this._parseJsonFields(o);
        return o;
    },
    async update(id, data) {
        ['steps_completed', 'documents', 'equipment', 'accounts', 'training'].forEach(f => {
            if (data[f] && typeof data[f] === 'object') data[f] = JSON.stringify(data[f]);
        });
        return dbOperations.update('onboarding', id, data);
    },
    async updateStatus(id, status, progress) { return this.update(id, { status, progress: progress || 0 }); },
    _parseJsonFields(o) {
        ['steps_completed', 'documents', 'equipment', 'accounts', 'training'].forEach(f => {
            if (o[f]) { try { o[f] = JSON.parse(o[f]); } catch (e) { o[f] = f === 'steps_completed' ? [] : {}; } }
            else { o[f] = f === 'steps_completed' ? [] : {}; }
        });
    }
};

// 入职步骤相关操作
const onboardingStepOperations = {
    async create(data) { return dbOperations.create('onboarding_steps', data); },
    async createDefaultSteps(onboardingId) {
        const defaults = [
            { step_name: '发送入职邀请函', step_order: 1, assignee_id: 'hr' },
            { step_name: '收集入职材料', step_order: 2, assignee_id: 'hr' },
            { step_name: '背景调查', step_order: 3, assignee_id: 'hr' },
            { step_name: '准备办公设备', step_order: 4, assignee_id: 'it' },
            { step_name: '开通系统账号', step_order: 5, assignee_id: 'it' },
            { step_name: '安排工位', step_order: 6, assignee_id: 'admin' },
            { step_name: '新人培训计划', step_order: 7, assignee_id: 'hr' },
            { step_name: '分配导师', step_order: 8, assignee_id: 'manager' }
        ];
        return defaults.map(step => this.create({ ...step, onboarding_id: onboardingId, status: 'pending' }));
    },
    async findByOnboardingId(onboardingId) {
        const db = await getDb();
        const result = db.exec(`SELECT * FROM onboarding_steps WHERE onboarding_id = ? ORDER BY step_order`, [onboardingId]);
        if (result.length === 0) return [];
        return result[0].values.map(row => rowToObject(result[0].columns, row));
    },
    async update(id, data) {
        if (data.status === 'completed') data.completed_at = new Date().toISOString();
        return dbOperations.update('onboarding_steps', id, data);
    }
};

export { getDb, closeDb, saveDb, dbOperations, jobs as jobs, candidates as candidates, resumes as resumes, matches as matches, interviews as interviews, questions as questions, answers as answers, calls as calls, onboarding as onboarding, onboardingSteps as onboardingSteps };
