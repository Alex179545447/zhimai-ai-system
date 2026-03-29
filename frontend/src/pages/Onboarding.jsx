import React, { useState } from 'react';
import { 
  UserCheck, Calendar, Check, Clock, ChevronRight, AlertCircle,
  FileText, Users, Briefcase, ArrowRight, Plus, Search, Filter
} from 'lucide-react';

const OnboardingItem = ({ candidate, status, progress, checklist, onUpdate }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in_progress': return 'bg-primary-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="card-hover">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{candidate.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
          <p className="text-sm text-gray-400">{candidate.jobTitle}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500">入职日期: {candidate.startDate}</span>
            <span className={`badge ${status === 'completed' ? 'badge-success' : status === 'in_progress' ? 'badge-primary' : 'badge-warning'}`}>
              {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '待处理'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{progress}%</p>
          <p className="text-xs text-gray-400">完成进度</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
          <div className={`h-full ${getStatusColor()} rounded-full transition-all`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {checklist.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-dark-300">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.status === 'completed' ? 'bg-emerald-500 text-white' :
                item.status === 'in_progress' ? 'bg-primary-500 text-white' :
                'bg-gray-600 text-gray-300'
              }`}>
                {item.status === 'completed' ? <Check className="w-4 h-4" /> :
                 item.status === 'in_progress' ? <Clock className="w-4 h-4" /> :
                 <Clock className="w-4 h-4" />}
              </div>
              <span className={`text-sm ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                {item.task}
              </span>
            </div>
            <span className="text-xs text-gray-500">{item.assignee}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-100 flex items-center justify-between">
        <button className="btn-gradient-outline text-sm px-3 py-1.5 flex items-center gap-1">
          查看详情 <ChevronRight className="w-4 h-4" />
        </button>
        {status !== 'completed' && (
          <button className="text-sm text-primary-400 hover:text-primary-300">
            快速完成
          </button>
        )}
      </div>
    </div>
  );
};

const ReInterviewSchedule = () => {
  const schedules = [
    { id: 1, name: '李娜', jobTitle: '高级前端工程师', date: '2024-03-28', time: '14:00', type: '技术面试', interviewer: '张经理' },
    { id: 2, name: '陈伟', jobTitle: '后端工程师', date: '2024-03-28', time: '10:00', type: '综合面试', interviewer: '王总监' },
    { id: 3, name: '刘芳', jobTitle: 'UI/UX设计师', date: '2024-03-29', time: '15:00', type: '设计面试', interviewer: '李总监' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-400" />
        复试安排
      </h3>
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-300 hover:bg-dark-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{schedule.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{schedule.name}</p>
                <p className="text-xs text-gray-400">{schedule.jobTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-400">{schedule.date} {schedule.time}</p>
              <p className="text-xs text-gray-400">{schedule.type} · {schedule.interviewer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusFlow = () => {
  const stages = [
    { name: 'offer', label: '发放Offer', count: 5, color: 'bg-purple-500' },
    { name: 'accepted', label: '已接受', count: 3, color: 'bg-blue-500' },
    { name: 'onboarding', label: '入职流程', count: 2, color: 'bg-cyan-500' },
    { name: 'hired', label: '已入职', count: 3, color: 'bg-emerald-500' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary-400" />
        候选人状态流转
      </h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.name}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center`}>
                <span className="text-lg font-bold text-white">{stage.count}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{stage.label}</p>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 flex items-center justify-center px-2">
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Onboarding = () => {
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
          <h1 className="text-2xl font-bold text-white">复试与入职</h1>
          <p className="text-gray-400 mt-1">管理复试安排和入职流程</p>
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
        <div className="card text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold text-white">{candidates.length}</p>
          <p className="text-sm text-gray-400">总候选人</p>
        </div>
        <div className="card text-center">
          <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary-400" />
          <p className="text-2xl font-bold text-white">{onboardingCandidates.length}</p>
          <p className="text-sm text-gray-400">入职流程中</p>
        </div>
        <div className="card text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold text-white">{completedCandidates.length}</p>
          <p className="text-sm text-gray-400">已完成入职</p>
        </div>
        <div className="card text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold text-emerald-400">100%</p>
          <p className="text-sm text-gray-400">完成率</p>
        </div>
      </div>

      {/* Status Flow */}
      <StatusFlow />

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-dark-100">
        <button
          onClick={() => setTab('onboarding')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            tab === 'onboarding' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          入职流程 ({onboardingCandidates.length})
          {tab === 'onboarding' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
            tab === 'completed' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          已完成 ({completedCandidates.length})
          {tab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
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
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-400" />
              入职清单模板
            </h3>
            <div className="space-y-2">
              {['发送入职邀请函', '背景调查', '发送入职材料清单', '签署劳动合同', '准备工位和设备', '安排入职培训', '分配导师'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-primary-400" />
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
