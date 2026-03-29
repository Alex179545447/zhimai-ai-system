import React, { useState } from 'react';
import { 
  UserCheck, Calendar, Check, Clock, ChevronRight, AlertCircle,
  FileText, Users, Briefcase, ArrowRight, Plus, Search, Filter,
  Sparkles, TrendingUp, ArrowUpRight, X, Video, MapPin, DollarSign,
  User, Mail, Phone, FileText as FileTextIcon, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const OnboardingItem = ({ candidate, status, progress, checklist, onUpdate, onViewDetail }) => {
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
        <button 
          onClick={() => onViewDetail(candidate)}
          className="btn-gradient-outline text-sm px-3 py-1.5 flex items-center gap-1"
        >
          查看详情 <ChevronRight className="w-4 h-4" />
        </button>
        {status !== 'completed' && (
          <button 
            onClick={() => onUpdate(candidate.id)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            快速完成
          </button>
        )}
      </div>
    </div>
  );
};

// 入职详情弹窗
const OnboardingDetailModal = ({ candidate, status, progress, checklist, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{candidate.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">入职日期: {candidate.startDate}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {status === 'completed' ? '已完成' : status === 'in_progress' ? '进行中' : '待处理'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">完成进度</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                'bg-gradient-to-r from-gray-400 to-gray-500'
              }`} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">入职清单</h3>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-emerald-500 text-white' :
                    item.status === 'in_progress' ? 'bg-blue-500 text-white' :
                    'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.status === 'completed' ? <Check className="w-5 h-5" /> :
                     item.status === 'in_progress' ? <Clock className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      item.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 
                      'text-gray-900 dark:text-white'
                    }`}>
                      {item.task}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">负责人: {item.assignee}</p>
                  </div>
                </div>
                {item.status !== 'completed' && (
                  <button 
                    onClick={() => onUpdate(item.id)}
                    className="px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    完成
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            关闭
          </button>
        </div>
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

// 安排复试弹窗
const ScheduleReInterviewModal = ({ onClose, candidates }) => {
  const [formData, setFormData] = useState({
    candidateId: '',
    date: '',
    time: '',
    type: '技术面试',
    interviewer: '',
    location: '线上会议',
    meetingLink: 'https://meeting.example.com/room/123',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interviewTypes = ['技术面试', '综合面试', 'HR面试', '终面', '压力面试', '行为面试'];
  const interviewers = ['张经理', '王总监', '李总监', '陈总', '刘经理', '赵主管'];

  const selectedCandidate = candidates.find(c => c.id === parseInt(formData.candidateId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateId || !formData.date || !formData.time || !formData.interviewer) {
      alert('请填写完整信息');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert('复试安排成功！已发送面试通知给候选人');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">安排复试</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">为候选人安排面试时间</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              选择候选人
            </label>
            <select 
              value={formData.candidateId} 
              onChange={e => setFormData({...formData, candidateId: e.target.value})}
              className="select-field"
              required
            >
              <option value="">请选择候选人</option>
              {candidates.filter(c => c.status === 'interview' || c.status === 'screening').map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.jobTitle}</option>
              ))}
            </select>
            {selectedCandidate && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{selectedCandidate.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCandidate.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCandidate.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                面试日期
              </label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                面试时间
              </label>
              <input 
                type="time" 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                面试类型
              </label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="select-field"
              >
                {interviewTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                面试官
              </label>
              <select 
                value={formData.interviewer}
                onChange={e => setFormData({...formData, interviewer: e.target.value})}
                className="select-field"
                required
              >
                <option value="">选择面试官</option>
                {interviewers.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              面试方式
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, location: '线上会议'})}
                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  formData.location === '线上会议' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Video className="w-5 h-5" />
                线上会议
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, location: '到场面试'})}
                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  formData.location === '到场面试' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <MapPin className="w-5 h-5" />
                到场面试
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              备注信息
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="添加面试注意事项..."
              className="input-field min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-gradient-outline">取消</button>
            <button type="submit" disabled={isSubmitting} className="btn-gradient flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  安排中...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  确认安排
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 新增入职弹窗
const AddOnboardingModal = ({ onClose, candidates }) => {
  const [formData, setFormData] = useState({
    candidateId: '',
    startDate: '',
    dept: '',
    position: '',
    salary: '',
    probationSalary: '',
    contractPeriod: '3年',
    reporterTo: '',
    mentor: '',
    workstation: '',
    equipment: ['笔记本电脑', '显示器', '工牌'],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['技术部', '产品部', '设计部', '市场部', '运营部', '人力资源部', '财务部'];
  const reporters = ['张经理', '王总监', '李总监', '陈总', '刘经理'];
  const mentors = ['资深员工A', '资深员工B', '资深员工C', '技术专家D'];

  const selectedCandidate = candidates.find(c => c.id === parseInt(formData.candidateId));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateId || !formData.startDate || !formData.dept) {
      alert('请填写完整信息');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert('入职流程已创建！系统将自动发送入职通知给候选人');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">新增入职</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">创建新员工入职流程</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              选择候选人
            </label>
            <select 
              value={formData.candidateId} 
              onChange={e => setFormData({...formData, candidateId: e.target.value})}
              className="select-field"
              required
            >
              <option value="">请选择候选人</option>
              {candidates.filter(c => c.status === 'offer').map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.jobTitle}</option>
              ))}
            </select>
            {selectedCandidate && (
              <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{selectedCandidate.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCandidate.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedCandidate.email} · {selectedCandidate.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                入职日期
              </label>
              <input 
                type="date" 
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                入职部门
              </label>
              <select 
                value={formData.dept}
                onChange={e => setFormData({...formData, dept: e.target.value})}
                className="select-field"
                required
              >
                <option value="">选择部门</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                岗位
              </label>
              <input 
                type="text" 
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                placeholder="如：高级前端工程师"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                直属上级
              </label>
              <select 
                value={formData.reporterTo}
                onChange={e => setFormData({...formData, reporterTo: e.target.value})}
                className="select-field"
              >
                <option value="">选择上级</option>
                {reporters.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                转正月薪
              </label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
                placeholder="如：30K"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                试用期月薪
              </label>
              <input 
                type="text" 
                value={formData.probationSalary}
                onChange={e => setFormData({...formData, probationSalary: e.target.value})}
                placeholder="如：24K（80%）"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              分配导师
            </label>
            <select 
              value={formData.mentor}
              onChange={e => setFormData({...formData, mentor: e.target.value})}
              className="select-field"
            >
              <option value="">选择导师（可选）</option>
              {mentors.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              工位安排
            </label>
            <input 
              type="text" 
              value={formData.workstation}
              onChange={e => setFormData({...formData, workstation: e.target.value})}
              placeholder="如：A区-03号工位"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileTextIcon className="w-4 h-4 inline mr-1" />
              入职准备清单
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['笔记本电脑', '显示器', '工牌', '门禁卡', '邮箱账号', '企业微信'].map(item => (
                <label key={item} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.equipment.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, equipment: [...formData.equipment, item]});
                      } else {
                        setFormData({...formData, equipment: formData.equipment.filter(i => i !== item)});
                      }
                    }}
                    className="w-4 h-4 rounded accent-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              备注
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="其他入职注意事项..."
              className="input-field min-h-[60px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-gradient-outline">取消</button>
            <button type="submit" disabled={isSubmitting} className="btn-gradient flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  创建入职流程
                </>
              )}
            </button>
          </div>
        </form>
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewingDetail, setViewingDetail] = useState(null);
  const [onboardingList, setOnboardingList] = useState([
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
  ]);

  const handleViewDetail = (candidate) => {
    const latestCandidate = onboardingList.find(c => c.id === candidate.id) || candidate;
    setViewingDetail(latestCandidate);
  };

  const handleUpdateTask = (candidateId, taskId) => {
    setOnboardingList(prev => prev.map(c => {
      if (c.id === candidateId) {
        const updatedChecklist = c.checklist.map(item => {
          if (item.id === taskId) {
            return { ...item, status: 'completed' };
          }
          return item;
        });
        const completedCount = updatedChecklist.filter(item => item.status === 'completed').length;
        const newProgress = Math.round((completedCount / updatedChecklist.length) * 100);
        const updated = {
          ...c,
          checklist: updatedChecklist,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress'
        };
        // Update viewingDetail if open
        if (viewingDetail && viewingDetail.id === candidateId) {
          setViewingDetail(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  // Use onboardingList state instead of local candidates for the main list
  const candidates = useStore(state => state.candidates) || [];
  const onboardingCandidates = onboardingList.filter(c => c.status !== 'completed');
  const completedCandidates = onboardingList.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">复试与入职</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理复试安排和入职流程</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowScheduleModal(true)} className="btn-gradient-outline flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            安排复试
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-gradient flex items-center gap-2">
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
              <OnboardingItem 
                candidate={candidate} 
                status={candidate.status} 
                progress={candidate.progress} 
                checklist={candidate.checklist}
                onUpdate={(taskId) => handleUpdateTask(candidate.id, taskId)}
                onViewDetail={handleViewDetail}
              />
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

      {/* Modal Renderings */}
      {showAddModal && (
        <AddOnboardingModal 
          onClose={() => setShowAddModal(false)} 
          candidates={candidates}
        />
      )}
      {showScheduleModal && (
        <ScheduleReInterviewModal 
          onClose={() => setShowScheduleModal(false)} 
          candidates={candidates}
        />
      )}
      {viewingDetail && (
        <OnboardingDetailModal 
          candidate={viewingDetail}
          status={viewingDetail.status}
          progress={viewingDetail.progress}
          checklist={viewingDetail.checklist}
          onClose={() => setViewingDetail(null)}
          onUpdate={(taskId) => handleUpdateTask(viewingDetail.id, taskId)}
        />
      )}
    </div>
  );
};

export default Onboarding;
