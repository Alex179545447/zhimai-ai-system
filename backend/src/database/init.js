/**
 * 数据库初始化脚本 - sql.js版本
 */

import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = process.env.DB_PATH || "./data/recruitment.db";

async function initDatabase() {
    console.log("正在初始化数据库...");
    const dbDir = path.dirname(path.resolve(DB_PATH));
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    
    const SQL = await initSqlJs();
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");
    
    let db;
    if (fs.existsSync(DB_PATH)) {
        db = new SQL.Database(fs.readFileSync(DB_PATH));
        const result = db.exec("SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"jobs\"");
        if (result.length > 0 && result[0].values.length > 0) {
            console.log("数据库已存在，跳过初始化");
            db.close();
            return;
        }
    } else {
        db = new SQL.Database();
    }
    
    db.run(schema);
    insertSampleData(db);
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
    db.close();
    console.log("数据库初始化完成！");
}

function insertSampleData(db) {
    console.log("正在插入示例数据...");
    const now = new Date().toISOString();
    
    const jobs = [
        { id: uuidv4(), title: "高级前端工程师", department: "技术部", location: "北京", employment_type: "full-time", salary_min: 30000, salary_max: 50000, description: "负责前端开发", requirements: "5年经验", responsibilities: "前端架构设计", skills_required: JSON.stringify(["React", "Vue", "TypeScript"]), experience_required: "5年", education_required: "本科", status: "active", priority: 1, headcount: 2 },
        { id: uuidv4(), title: "后端开发工程师", department: "技术部", location: "上海", employment_type: "full-time", salary_min: 25000, salary_max: 45000, description: "负责后端开发", requirements: "3年经验", responsibilities: "后端开发", skills_required: JSON.stringify(["Java", "Go", "Python"]), experience_required: "3年", education_required: "本科", status: "active", priority: 1, headcount: 3 }
    ];
    
    jobs.forEach(job => {
        db.run("INSERT INTO jobs (id, title, department, location, employment_type, salary_min, salary_max, description, requirements, responsibilities, skills_required, experience_required, education_required, status, priority, headcount, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [job.id, job.title, job.department, job.location, job.employment_type, job.salary_min, job.salary_max, job.description, job.requirements, job.responsibilities, job.skills_required, job.experience_required, job.education_required, job.status, job.priority, job.headcount, now, now]);
    });
    
    const candidates = [
        { id: uuidv4(), name: "张三", email: "zhangsan@example.com", phone: "13800138000", location: "北京", current_title: "前端工程师", current_company: "某互联网公司", years_of_experience: 6, education_level: "硕士", education_school: "清华大学", education_major: "计算机科学", skills: JSON.stringify(["React", "Vue", "TypeScript"]), expected_salary: 45000, current_salary: 38000, status: "new", source: "Boss直聘" },
        { id: uuidv4(), name: "李四", email: "lisi@example.com", phone: "13900139000", location: "上海", current_title: "Java开发", current_company: "某科技公司", years_of_experience: 4, education_level: "本科", education_school: "上海交通大学", education_major: "软件工程", skills: JSON.stringify(["Java", "Spring", "MySQL"]), expected_salary: 40000, current_salary: 32000, status: "interviewing", source: "猎聘" }
    ];
    
    candidates.forEach(c => {
        db.run("INSERT INTO candidates (id, name, email, phone, location, current_title, current_company, years_of_experience, education_level, education_school, education_major, skills, expected_salary, current_salary, status, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [c.id, c.name, c.email, c.phone, c.location, c.current_title, c.current_company, c.years_of_experience, c.education_level, c.education_school, c.education_major, c.skills, c.expected_salary, c.current_salary, c.status, c.source, now, now]);
    });
    
    console.log("示例数据插入完成！");
}

initDatabase().catch(console.error);