import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, Phone, MapPin, Plus, ChevronLeft, ChevronRight,
  User, FileText, Check, X, PhoneCall, Bell, MoreVertical, XCircle, Eye,
  Brain, Sparkles, TrendingUp, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const statusConfig = {
  scheduled: { label: '已预约', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', icon: Calendar },
  in_progress: { label: '进行中', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400', icon: Clock },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', icon: Check },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400', icon: X },
};

const InterviewCard = ({ interview, onView }) => {
  const candidates = useStore((state) => state.candidates);
  const candidate = candidates.find(c => c.id === interview.candidateId);
  const StatusIcon = statusConfig[interview.status]?.icon || Clock;
  
  const getTypeIcon = () => {
    switch (interview.type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'onsite': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (interview.type) {
      case 'video': return '视频面试';
      case 'phone': return '电话面试';
      case 'onsite': return '现场面试';
      default: return interview.type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{interview.candidateName?.charAt(0) || '?'}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{interview.candidateName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{interview.jobTitle}</p>
          </div>
        </div>
        <span className={`badge ${statusConfig[interview.status]?.color}`}>
          {statusConfig[interview.status]?.label}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-blue-500" /> {interview.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {interview.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {getTypeIcon()}
          <span>{getTypeLabel()}</span>
        </div>
      </div>

      {interview.questions && interview.questions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">AI生成问题 ({interview.questions.length})</p>
          <div className="flex flex-wrap gap-1">
            {interview.questions.slice(0, 2).map((q, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{q}</span>
            ))}
            {interview.questions.length > 2 && (
              <span className="text-xs px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">+{interview.questions.length - 2}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {interview.type === 'video' && (
            <button className="btn-gradient text-sm px-3 py-1.5 flex items-center gap-1">
              <Video className="w-4 h-4" /> 加入面试
            </button>
          )}
          {interview.type === 'phone' && (
            <button className="btn-gradient text-sm px-3 py-1.5 flex items-center gap-1">
              <PhoneCall className="w-4 h-4" /> 开始外呼
            </button>
          )}
        </div>
        <button onClick={() => onView(interview)} className="btn-gradient-outline text-sm px-3 py-1.5 flex items-center gap-1">
          <Eye className="w-4 h-4" /> 查看详情
        </button>
      </div>
    </div>
  );
};

const ScheduleView = ({ interviews, currentDate, onPrev, onNext }) => {
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  const weekDays = [];
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    weekDays.push(day);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrev} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
        </h3>
        <button onClick={onNext} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-1" />
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{day.toLocaleDateString('zh-CN', { weekday: 'short' })}</p>
            <p className={`text-lg font-bold ${day.toDateString() === new Date().toDateString() ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
              {day.getDate()}
            </p>
          </div>
        ))}

        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="text-xs text-gray-500 dark:text-gray-400 py-2 text-right pr-2">{time}</div>
            {weekDays.map((day, dayIndex) => {
              return (
                <div key={dayIndex} className="py-1 min-h-[40px]">
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CallRecords = () => {
  const callRecords = [
    { id: 1, candidateName: '张明', phone: '138****1234', duration: '12分钟', result: '确认参加面试', time: '10:30', status: 'success' },
    { id: 2, candidateName: '李娜', phone: '139****5678', duration: '8分钟', result: '需调整时间', time: '11:15', status: 'pending' },
    { id: 3, candidateName: '刘芳', phone: '136****3456', duration: '15分钟', result: '确认参加面试', time: '14:00', status: 'success' },
    { id: 4, candidateName: '陈伟', phone: '135****7890', duration: '未接听', result: '稍后重试', time: '15:30', status: 'failed' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <PhoneCall className="w-5 h-5 text-blue-500" />
        外呼记录
      </h3>
      <div className="space-y-3">
        {callRecords.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                record.status === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                record.status === 'pending' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' :
                'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
              }`}>
                {record.status === 'success' ? <Check className="w-4 h-4" /> :
                 record.status === 'pending' ? <Clock className="w-4 h-4" /> :
                 <X className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{record.candidateName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{record.phone} · {record.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700 dark:text-gray-200">{record.duration}</p>
              <p className={`text-xs ${
                record.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                record.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>{record.result}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Interviews = () => {
  const navigate = useNavigate();
  const interviews = useStore((state) => state.interviews);
  const [viewMode, setViewMode] = useState('card');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDetail, setShowDetail] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todayInterviews = interviews.filter(i => i.date === today);
  const upcomingInterviews = interviews.filter(i => i.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const statusCounts = {
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    in_progress: interviews.filter(i => i.status === 'in_progress').length,
    completed: interviews.filter(i => i.status === 'completed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">面试安排</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理面试日程，AI生成面试问题</p>
        </div>
        <button className="btn-gradient flex items-center gap-2">
          <Plus className="w-5 h-5" />
          安排面试
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button onClick={() => navigate('/call-records')} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30">
          <Calendar className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{statusCounts.scheduled}</p>
          <p className="text-blue-100 text-sm font-medium mt-1">待面试</p>
        </button>
        <button onClick={() => navigate('/call-records')} className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white text-center hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg shadow-yellow-500/30">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{statusCounts.in_progress}</p>
          <p className="text-yellow-100 text-sm font-medium mt-1">进行中</p>
        </button>
        <button onClick={() => navigate('/interview-analysis')} className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30">
          <Check className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{statusCounts.completed}</p>
          <p className="text-emerald-100 text-sm font-medium mt-1">已完成</p>
        </button>
        <button onClick={() => navigate('/call-records')} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white text-center hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30">
          <PhoneCall className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{todayInterviews.length}</p>
          <p className="text-purple-100 text-sm font-medium mt-1">今日面试</p>
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('card')} className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            卡片视图
          </button>
          <button onClick={() => setViewMode('schedule')} className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${viewMode === 'schedule' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            日程视图
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              即将到来的面试
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingInterviews.slice(0, 6).map((interview, index) => (
                <div key={interview.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <InterviewCard interview={interview} onView={(i) => setShowDetail(i)} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <CallRecords />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ScheduleView 
            interviews={interviews} 
            currentDate={currentDate}
            onPrev={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentDate(newDate);
            }}
            onNext={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentDate(newDate);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Interviews;
