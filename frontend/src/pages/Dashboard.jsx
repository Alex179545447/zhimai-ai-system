import React from 'react';
import { 
  FileText, Brain, Calendar, Briefcase, Users, TrendingUp, 
  Clock, CheckCircle, Sparkles, UserPlus, CalendarCheck, ArrowRight,
  ChevronRight, Zap
} from 'lucide-react';
import useStore from '../store/useStore';

const MetricCard = ({ icon: Icon, label, value, change, trend, color }) => (
  <div className="card-hover group">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  </div>
);

const FunnelChart = () => {
  const stages = [
    { name: '发布职位', count: 5, width: '100%', color: 'from-primary-600 to-primary-500' },
    { name: '简历投递', count: 415, width: '85%', color: 'from-primary-500 to-cyan-500' },
    { name: '简历筛选', count: 186, width: '65%', color: 'from-cyan-500 to-teal-400' },
    { name: '面试邀约', count: 62, width: '40%', color: 'from-teal-400 to-emerald-400' },
    { name: '最终面试', count: 28, width: '25%', color: 'from-emerald-400 to-yellow-400' },
    { name: '发放offer', count: 8, width: '12%', color: 'from-yellow-400 to-orange-400' },
    { name: '入职', count: 3, width: '5%', color: 'from-orange-400 to-red-400' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-400" />
        招聘漏斗
      </h3>
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">{stage.name}</span>
              <span className="text-sm font-medium text-white">{stage.count}</span>
            </div>
            <div className="h-8 bg-dark-300 rounded-lg overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${stage.color} rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                style={{ width: stage.width }}
              >
                {stage.count > 20 && (
                  <span className="text-xs font-medium text-white/90">{Math.round(stage.count)}</span>
                )}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                <ChevronRight className="w-4 h-4 text-gray-600 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityTimeline = () => {
  const activities = useStore((state) => state.activities);
  
  const getIcon = (icon) => {
    switch (icon) {
      case 'check': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'user-plus': return <UserPlus className="w-4 h-4 text-primary-400" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'file-check': return <CalendarCheck className="w-4 h-4 text-cyan-400" />;
      case 'calendar': return <Calendar className="w-4 h-4 text-purple-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBgColor = (icon) => {
    switch (icon) {
      case 'check': return 'bg-emerald-500/20';
      case 'user-plus': return 'bg-primary-500/20';
      case 'sparkles': return 'bg-yellow-500/20';
      case 'file-check': return 'bg-cyan-500/20';
      case 'calendar': return 'bg-purple-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary-400" />
        最近活动
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`w-8 h-8 rounded-full ${getBgColor(activity.icon)} flex items-center justify-center flex-shrink-0`}>
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200">{activity.content}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    { icon: Briefcase, label: '发布职位', color: 'bg-blue-500/20 text-blue-400', desc: '创建新职位' },
    { icon: Users, label: '添加候选人', color: 'bg-purple-500/20 text-purple-400', desc: '录入候选人信息' },
    { icon: Calendar, label: '安排面试', color: 'bg-cyan-500/20 text-cyan-400', desc: '预约面试时间' },
    { icon: Brain, label: 'AI匹配', color: 'bg-yellow-500/20 text-yellow-400', desc: '启动智能匹配' },
    { icon: FileText, label: '查看报告', color: 'bg-emerald-500/20 text-emerald-400', desc: '数据分析报告' },
    { icon: Zap, label: '批量操作', color: 'bg-orange-500/20 text-orange-400', desc: '批量处理简历' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        快捷操作
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button 
            key={action.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-300 hover:bg-dark-100 border border-transparent hover:border-primary-500/30 transition-all animate-fade-in group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-white">{action.label}</span>
            <span className="text-xs text-gray-500">{action.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const WeeklyTrend = () => {
  const data = [
    { day: '周一', apps: 45, interviews: 8 },
    { day: '周二', apps: 62, interviews: 12 },
    { day: '周三', apps: 38, interviews: 15 },
    { day: '周四', apps: 55, interviews: 10 },
    { day: '周五', apps: 42, interviews: 8 },
    { day: '周六', apps: 15, interviews: 2 },
    { day: '周日', apps: 8, interviews: 1 },
  ];
  const maxApps = Math.max(...data.map(d => d.apps));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-400" />
        本周趋势
      </h3>
      <div className="h-40 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center gap-1 h-32">
              <div 
                className="w-6 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all hover:from-primary-500 hover:to-primary-300"
                style={{ height: `${(item.apps / maxApps) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs text-gray-400">投递数</span>
        </div>
      </div>
    </div>
  );
};

const UpcomingInterviews = () => {
  const interviews = useStore((state) => state.interviews);
  const candidates = useStore((state) => state.candidates);
  
  const getCandidate = (candidateId) => candidates.find(c => c.id === candidateId);
  
  const today = new Date().toISOString().split('T')[0];
  const upcoming = interviews.filter(i => i.date >= today).slice(0, 3);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-400" />
          今日面试
        </h3>
        <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
          查看全部 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {upcoming.length > 0 ? upcoming.map((interview) => {
          const candidate = getCandidate(interview.candidateId);
          return (
            <div key={interview.id} className="flex items-center gap-4 p-3 rounded-lg bg-dark-300 hover:bg-dark-100 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">{candidate?.name?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{interview.candidateName}</p>
                <p className="text-xs text-gray-400 truncate">{interview.jobTitle}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary-400">{interview.time}</p>
                <p className="text-xs text-gray-500">{interview.type === 'video' ? '视频面试' : interview.type === 'phone' ? '电话面试' : '现场面试'}</p>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无面试安排</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const metrics = useStore((state) => state.metrics);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">仪表盘</h1>
          <p className="text-gray-400 mt-1">欢迎回来！以下是您的招聘数据概览</p>
        </div>
        <div className="text-sm text-gray-500">
          数据更新于 {new Date().toLocaleDateString('zh-CN')}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={FileText} label="待处理简历" value={metrics.pendingResumes} trend={12} color="bg-blue-500/20 text-blue-400" />
        <MetricCard icon={Brain} label="AI匹配率" value={`${metrics.aiMatchRate}%`} trend={5} color="bg-purple-500/20 text-purple-400" />
        <MetricCard icon={Calendar} label="今日面试" value={metrics.todayInterviews} trend={-8} color="bg-cyan-500/20 text-cyan-400" />
        <MetricCard icon={Briefcase} label="活跃职位" value={metrics.activeJobs} color="bg-emerald-500/20 text-emerald-400" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FunnelChart />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeeklyTrend />
            <UpcomingInterviews />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityTimeline />
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            核心指标
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-dark-300">
              <p className="text-2xl font-bold text-white">{metrics.totalCandidates}</p>
              <p className="text-sm text-gray-400">候选人总数</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-300">
              <p className="text-2xl font-bold text-white">{metrics.interviewsThisWeek}</p>
              <p className="text-sm text-gray-400">本周面试</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-300">
              <p className="text-2xl font-bold text-emerald-400">{metrics.hiredThisMonth}</p>
              <p className="text-sm text-gray-400">本月入职</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-300">
              <p className="text-2xl font-bold text-white">{metrics.avgHiringCycle}<span className="text-sm">天</span></p>
              <p className="text-sm text-gray-400">平均招聘周期</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
