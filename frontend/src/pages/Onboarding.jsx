import React, { useState } from 'react';
import { 
  UserCheck, Calendar, Check, Clock, ChevronRight, AlertCircle,
  FileText, Users, Briefcase, ArrowRight, Plus, Search, Filter,
  Sparkles, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingItem = ({ candidate, status, progress, checklist, onUpdate }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-500 to-teal-500';
      case 'in_progress': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'pending': return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{candidate.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">入职日期: {candidate.startDate}</span>
            <span className={`badge ${
              status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
              status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
            }`}>
              {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '待处理'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">完成进度</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${getStatusColor()} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {checklist.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.status === 'completed' ? 'bg-emerald-500 text-white' :
                item.status === 'in_progress' ? 'bg-blue-500 text-white' :
                'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {item.status === 'completed' ? <Check className="w-4 h-4" /> :
                 <Clock className="w-4 h-4" />}
              </div>
              <span className={`text-sm ${
                item.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 
                'text-gray-700 dark:text-gray-200'
              }`}>
                {item.task}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.assignee}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button className="btn-gradient-outline text-sm px-3 py-1.5 flex items-center gap-1">
          查看详情 <ChevronRight className="w-4 h-4" />
        </button>
        {status !== 'completed' && (
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            快速完成
          </button>
        )}
      </div>
    </div>
  );
};

const ReInterviewSchedule = () => {
  const navigate = useNavigate();
  const schedules = [
    { id: 1, name: '李娜', jobTitle: '高级前端工程师', date: '2024-03-28', time: '14:00', type: '技术面试', interviewer: '张经理' },
    { id: 2, name: '陈伟', jobTitle: '后端工程师', date: '2024-03-28', time: '10:00', type: '综合面试', interviewer: '王总监' },
    { id: 3, name: '刘芳', jobTitle: 'UI/UX设计师', date: '2024-03-29', time: '15:00', type: '设计面试', interviewer: '李总监' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          复试安排
        </h3>
        <button onClick={() => navigate('/interviews')} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1">
          查看全部 <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{schedule.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{schedule.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{schedule.jobTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{schedule.date} {schedule.time}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{schedule.type} · {schedule.interviewer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusFlow = () => {
  const stages = [
    { name: 'offer', label: '发放Offer', count: 5, color: 'from-purple-500 to-pink-500' },
    { name: 'accepted', label: '已接受', count: 3, color: 'from-blue-500 to-indigo-500' },
    { name: 'onboarding', label: '入职流程', count: 2, color: 'from-cyan-500 to-teal-500' },
    { name: 'hired', label: '已入职', count: 3, color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        候选人状态流转
      </h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.name}>
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg`}>
                <span className="text-lg font-bold text-white">{stage.count}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{stage.label}</p>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 flex items-center justify-center px-2">
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('onboarding');

  const candidates = [
    {
      id: 1,
      name: '赵雪',
      jobTitle: '高级前端工程师',
      startDate: '2024-04-01',
      status: 'in_progress',
      progress: 75,
      checklist: [
        { id: 1, task: '发送入职邀请函', status: 'completed', assignee: 'HR小王' },
        { id: 2, task: '背景调查', status: 'completed', assignee: 'HR小李' },
        { id: 3, task: '发送入职材料清单', status: 'completed', assignee: 'HR小王' },
        { id: 4, task: '签署劳动合同', status: 'in_progress', assignee: '候选人' },
        { id: 5, task: '准备工位和设备', status: 'pending', assignee: 'IT部门' },
        { id: 6, task: '安排入职培训', status: 'pending', assignee: '培训部' },
        { id: 7, task: '分配导师', status: 'pending', assignee: '部门经理' },
      ],
    },
    {
      id: 2,
      name: '王浩',
      jobTitle: '产品经理',
      startDate: '2024-04-05',
      status: 'in_progress',
      progress: 40,
      checklist: [
        { id: 1, task: '发送入职邀请函', status: 'completed', assignee: 'HR小王' },
        { id: 2, task: '背景调查', status: 'in_progress', assignee: 'HR小李' },
        { id: 3, task: '发送入职材料清单', status: 'pending', assignee: 'HR小王' },
        { id: 4, task: '签署劳动合同', status: 'pending', assignee: '候选人' },
      ],
    },
    {
      id: 3,
      name: '张明',
      jobTitle: '高级前端工程师',
      startDate: '2024-03-15',
      status: 'completed',
      progress: 100,
      checklist: [
        { id: 1, task: '发送入职邀请函', status: 'completed', assignee: 'HR小王' },
        { id: 2, task: '背景调查', status: 'completed', assignee: 'HR小李' },
        { id: 3, task: '入职培训', status: 'completed', assignee: '培训部' },
      ],
    },
  ];

  const onboardingCandidates = candidates.filter(c => c.status !== 'completed');
  const completedCandidates = candidates.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">复试与入职</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理复试安排和入职流程</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-gradient-outline flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            安排复试
          </button>
          <button className="btn-gradient flex items-center gap-2">
            <Plus className="w-5 h-5" />
            新增入职
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button onClick={() => navigate('/candidates')} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white text-center hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30">
          <FileText className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{candidates.length}</p>
          <p className="text-purple-100 text-sm font-medium mt-1">总候选人</p>
        </button>
        <button onClick={() => navigate('/candidates')} className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-5 text-white text-center hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/30">
          <UserCheck className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{onboardingCandidates.length}</p>
          <p className="text-blue-100 text-sm font-medium mt-1">入职流程中</p>
        </button>
        <button onClick={() => navigate('/candidates')} className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{completedCandidates.length}</p>
          <p className="text-amber-100 text-sm font-medium mt-1">已完成入职</p>
        </button>
        <button className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30">
          <Sparkles className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">100%</p>
          <p className="text-emerald-100 text-sm font-medium mt-1">完成率</p>
        </button>
      </div>

      {/* Status Flow */}
      <StatusFlow />

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl px-2">
        <button
          onClick={() => setTab('onboarding')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            tab === 'onboarding' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          入职流程 ({onboardingCandidates.length})
          {tab === 'onboarding' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
            tab === 'completed' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          已完成 ({completedCandidates.length})
          {tab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {(tab === 'onboarding' ? onboardingCandidates : completedCandidates).map((candidate, index) => (
            <div key={candidate.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <OnboardingItem candidate={candidate} status={candidate.status} progress={candidate.progress} checklist={candidate.checklist} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <ReInterviewSchedule />
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              入职清单模板
            </h3>
            <div className="space-y-2">
              {['发送入职邀请函', '背景调查', '发送入职材料清单', '签署劳动合同', '准备工位和设备', '安排入职培训', '分配导师'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
