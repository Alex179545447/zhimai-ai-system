import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialJobs = [
  { id: '1', title: '高级前端工程师', department: '技术部', location: '北京', salary: '35K-50K', status: 'active', applicants: 128, matched: 45, skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], createdAt: '2024-03-01' },
  { id: '2', title: '产品经理', department: '产品部', location: '上海', salary: '30K-45K', status: 'active', applicants: 86, matched: 32, skills: ['产品设计', '数据分析', '用户研究', 'Axure'], createdAt: '2024-03-05' },
  { id: '3', title: 'UI/UX设计师', department: '设计部', location: '深圳', salary: '25K-40K', status: 'active', applicants: 64, matched: 28, skills: ['Figma', 'Sketch', '用户研究', '动效设计'], createdAt: '2024-03-08' },
  { id: '4', title: '后端工程师', department: '技术部', location: '杭州', salary: '30K-48K', status: 'active', applicants: 95, matched: 38, skills: ['Python', 'Go', 'PostgreSQL', 'Redis'], createdAt: '2024-03-10' },
  { id: '5', title: '数据分析师', department: '数据部', location: '北京', salary: '28K-42K', status: 'paused', applicants: 42, matched: 18, skills: ['Python', 'SQL', 'Tableau', '机器学习'], createdAt: '2024-03-12' },
];

const initialCandidates = [
  { id: '1', name: '张明', avatar: '', email: 'zhangming@email.com', phone: '138****1234', jobId: '1', status: 'interview', matchScore: 92, skills: ['React', 'TypeScript', 'Node.js', 'Vue'], experience: 5, education: '硕士', appliedAt: '2024-03-15', source: 'BOSS直聘' },
  { id: '2', name: '李娜', avatar: '', email: 'lina@email.com', phone: '139****5678', jobId: '1', status: 'screening', matchScore: 88, skills: ['React', 'JavaScript', 'CSS3', 'Webpack'], experience: 3, education: '本科', appliedAt: '2024-03-16', source: '猎聘网' },
  { id: '3', name: '王浩', avatar: '', email: 'wanghao@email.com', phone: '137****9012', jobId: '2', status: 'offer', matchScore: 95, skills: ['产品设计', '数据分析', 'Axure', '用户研究'], experience: 7, education: '硕士', appliedAt: '2024-03-10', source: '内部推荐' },
  { id: '4', name: '刘芳', avatar: '', email: 'liufang@email.com', phone: '136****3456', jobId: '3', status: 'interview', matchScore: 85, skills: ['Figma', 'Sketch', 'UI设计', '交互设计'], experience: 4, education: '本科', appliedAt: '2024-03-18', source: '拉勾网' },
  { id: '5', name: '陈伟', avatar: '', email: 'chenwei@email.com', phone: '135****7890', jobId: '4', status: 'screening', matchScore: 90, skills: ['Python', 'Go', 'PostgreSQL', 'Docker'], experience: 6, education: '硕士', appliedAt: '2024-03-19', source: '脉脉' },
  { id: '6', name: '赵雪', avatar: '', email: 'zhaoxue@email.com', phone: '134****2345', jobId: '1', status: 'hired', matchScore: 96, skills: ['React', 'TypeScript', 'GraphQL', 'Next.js'], experience: 8, education: '博士', appliedAt: '2024-03-01', source: '内部推荐' },
];

const initialInterviews = [
  { id: '1', candidateId: '1', candidateName: '张明', jobTitle: '高级前端工程师', date: '2024-03-25', time: '10:00', type: 'video', status: 'scheduled', questions: ['自我介绍', '项目经验', '技术挑战'] },
  { id: '2', candidateId: '4', candidateName: '刘芳', jobTitle: 'UI/UX设计师', date: '2024-03-25', time: '14:00', type: 'phone', status: 'scheduled', questions: ['设计理念', '作品集讲解'] },
  { id: '3', candidateId: '3', candidateName: '王浩', jobTitle: '产品经理', date: '2024-03-24', time: '09:00', type: 'onsite', status: 'completed', questions: ['产品案例', '团队管理'], feedback: '表现优秀，适合团队管理岗位' },
];

const initialActivities = [
  { id: '1', type: 'interview', content: '王浩面试完成，等待评估', time: '2小时前', icon: 'check' },
  { id: '2', type: 'apply', content: '陈伟投递了后端工程师职位', time: '3小时前', icon: 'user-plus' },
  { id: '3', type: 'match', content: 'AI匹配到5位高匹配度候选人', time: '5小时前', icon: 'sparkles' },
  { id: '4', type: 'message', content: '赵雪入职流程已启动', time: '1天前', icon: 'file-check' },
  { id: '5', type: 'interview', content: '张明面试预约成功', time: '1天前', icon: 'calendar' },
];

const initialMetrics = {
  pendingResumes: 24,
  aiMatchRate: 87,
  todayInterviews: 5,
  activeJobs: 4,
  totalCandidates: 186,
  interviewsThisWeek: 18,
  hiredThisMonth: 3,
  avgHiringCycle: 18,
};

const useStore = create(
  persist(
    (set, get) => ({
      // 状态数据
      jobs: initialJobs,
      candidates: initialCandidates,
      interviews: initialInterviews,
      activities: initialActivities,
      metrics: initialMetrics,

      // 当前选中
      selectedJob: null,
      selectedCandidate: null,
      currentView: 'dashboard',

      // 职位管理
      setSelectedJob: (job) => set({ selectedJob: job }),
      addJob: (job) => set((state) => ({ jobs: [...state.jobs, { ...job, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }] })),
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map((j) => j.id === id ? { ...j, ...updates } : j)
      })),
      deleteJob: (id) => set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      // 候选人管理
      setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),
      addCandidate: (candidate) => set((state) => ({
        candidates: [...state.candidates, { ...candidate, id: Date.now().toString(), appliedAt: new Date().toISOString().split('T')[0] }]
      })),
      updateCandidate: (id, updates) => set((state) => ({
        candidates: state.candidates.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCandidate: (id) => set((state) => ({ candidates: state.candidates.filter((c) => c.id !== id) })),

      // 面试管理
      addInterview: (interview) => set((state) => ({
        interviews: [...state.interviews, { ...interview, id: Date.now().toString() }]
      })),
      updateInterview: (id, updates) => set((state) => ({
        interviews: state.interviews.map((i) => i.id === id ? { ...i, ...updates } : i)
      })),

      // 活动记录
      addActivity: (activity) => set((state) => ({
        activities: [{ ...activity, id: Date.now().toString(), time: '刚刚' }, ...state.activities]
      })),

      // 视图切换
      setCurrentView: (view) => set({ currentView: view }),

      // 获取候选人对应的职位
      getJobForCandidate: (candidateId) => {
        const candidate = get().candidates.find((c) => c.id === candidateId);
        if (!candidate) return null;
        return get().jobs.find((j) => j.id === candidate.jobId);
      },
    }),
    {
      name: 'ai-recruitment-storage',
    }
  )
);

export default useStore;
