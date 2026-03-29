-- AI智能招聘系统数据库初始化脚本

-- =====================================================
-- 职位表 (Job)
-- =====================================================
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    employment_type TEXT DEFAULT 'full-time',
    salary_min REAL,
    salary_max REAL,
    description TEXT,
    requirements TEXT,
    responsibilities TEXT,
    skills_required TEXT,
    experience_required TEXT,
    education_required TEXT,
    status TEXT DEFAULT 'active',
    priority INTEGER DEFAULT 0,
    headcount INTEGER DEFAULT 1,
    hiring_manager_id TEXT,
    profile_analysis TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 候选人表 (Candidate)
-- =====================================================
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    location TEXT,
    current_title TEXT,
    current_company TEXT,
    years_of_experience REAL DEFAULT 0,
    education_level TEXT,
    education_school TEXT,
    education_major TEXT,
    skills TEXT,
    expected_salary REAL,
    current_salary REAL,
    status TEXT DEFAULT 'new',
    source TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    notes TEXT,
    tags TEXT,
    email_history TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 简历表 (Resume)
-- =====================================================
CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size INTEGER,
    raw_text TEXT,
    parsed_data TEXT,
    parsed_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- =====================================================
-- 匹配记录表 (Match)
-- =====================================================
CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL,
    skill_match_score REAL DEFAULT 0,
    experience_match_score REAL DEFAULT 0,
    education_match_score REAL DEFAULT 0,
    salary_match_score REAL DEFAULT 0,
    overall_score REAL DEFAULT 0,
    skill_details TEXT,
    experience_details TEXT,
    education_details TEXT,
    salary_details TEXT,
    match_report TEXT,
    rank INTEGER,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE(job_id, candidate_id)
);

-- =====================================================
-- 面试表 (Interview)
-- =====================================================
CREATE TABLE IF NOT EXISTS interviews (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL,
    interviewer_id TEXT,
    interviewer_name TEXT,
    scheduled_at TEXT,
    duration INTEGER DEFAULT 60,
    interview_type TEXT DEFAULT 'technical',
    location TEXT,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled',
    overall_score REAL,
    overall_assessment TEXT,
    recommendation TEXT,
    risk_points TEXT,
    analysis_report TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- =====================================================
-- 面试问题表 (Question)
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL,
    question_type TEXT NOT NULL,
    category TEXT,
    question_text TEXT NOT NULL,
    purpose TEXT,
    weight INTEGER DEFAULT 1,
    generated_from TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);

-- =====================================================
-- 问答记录表 (Answer)
-- =====================================================
CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer_text TEXT,
    audio_url TEXT,
    score REAL,
    feedback TEXT,
    key_points TEXT,
    concerns TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- =====================================================
-- 外呼记录表 (Call)
-- =====================================================
CREATE TABLE IF NOT EXISTS calls (
    id TEXT PRIMARY KEY,
    candidate_id TEXT,
    job_id TEXT,
    phone_number TEXT NOT NULL,
    call_type TEXT DEFAULT 'outbound',
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    scheduled_at TEXT,
    started_at TEXT,
    ended_at TEXT,
    duration INTEGER DEFAULT 0,
    outcome TEXT,
    notes TEXT,
    recording_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE SET NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- =====================================================
-- 入职流程表 (Onboarding)
-- =====================================================
CREATE TABLE IF NOT EXISTS onboarding (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    start_date TEXT,
    status TEXT DEFAULT 'pending',
    current_step TEXT,
    progress INTEGER DEFAULT 0,
    steps_completed TEXT,
    documents TEXT,
    equipment TEXT,
    accounts TEXT,
    training TEXT,
    buddy_id TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- =====================================================
-- 入职步骤详情表 (OnboardingStep)
-- =====================================================
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id TEXT PRIMARY KEY,
    onboarding_id TEXT NOT NULL,
    step_name TEXT NOT NULL,
    step_order INTEGER,
    status TEXT DEFAULT 'pending',
    due_date TEXT,
    completed_at TEXT,
    assignee_id TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (onboarding_id) REFERENCES onboarding(id) ON DELETE CASCADE
);

-- =====================================================
-- 创建索引以提升查询性能
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_matches_job ON matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_candidate ON matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_job ON interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_questions_interview ON questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_answers_interview ON answers(interview_id);
CREATE INDEX IF NOT EXISTS idx_calls_candidate ON calls(candidate_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_candidate ON onboarding(candidate_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding(status);
