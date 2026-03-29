import React, { useState } from 'react';
import { 
  Phone, PhoneIncoming, PhoneOutgoing, Clock, User, Briefcase,
  CheckCircle, XCircle, AlertCircle, Play, Pause, MoreVertical,
  Filter, Search, Calendar, MessageSquare, TrendingUp, ArrowRight,
  Mic, MicOff, Volume2, RefreshCw, Send
} from 'lucide-react';
import useStore from '../store/useStore';

const CallRecords = () => {
  const { candidates, jobs } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 外呼面试记录数据
  const callRecords = [
    {
      id: '1',
      candidateId: '1',
      candidateName: '张明',
      phone: '138****1234',
      jobTitle: '高级前端工程师',
      callType: 'outgoing',
      status: 'completed',
      duration: '15:32',
      date: '2024-03-25',
      time: '10:00',
      aiQuestions: [
        '请做一个简短的自我介绍',
        '您在前端开发中最擅长的技术栈是什么？',
        '请描述一个您解决过的技术挑战',
        '您对React和Vue有什么看法？'
      ],
      answers: [
        '我叫张明，有5年前端开发经验...',
        '我擅长React技术栈，包括React18、TypeScript等',
        '我曾经优化过一个大型项目的打包速度...',
        '两个框架各有优势，我更倾向于React...'
      ],
      matchScore: 92,
      matchAnalysis: '技能匹配度较高，沟通表达能力良好，但薪资预期略高于岗位范围',
      recommendation: '建议进入人工复试',
      interviewFeedback: '候选人技术基础扎实，项目经验丰富，适合技术团队'
    },
    {
      id: '2',
      candidateId: '2',
      candidateName: '李娜',
      phone: '139****5678',
      jobTitle: '高级前端工程师',
      callType: 'outgoing',
      status: 'completed',
      duration: '12:45',
      date: '2024-03-25',
      time: '14:30',
      aiQuestions: [
        '请介绍一下您的开发经验',
        '您对TypeScript的掌握程度如何？',
        '有没有大型项目的开发经验？'
      ],
      answers: [
        '我有3年前端经验，主要使用Vue技术栈',
        '我能够熟练使用TypeScript进行开发',
        '参与过中型电商项目的开发'
      ],
      matchScore: 78,
      matchAnalysis: '技能基本匹配，但经验年限略低于岗位要求',
      recommendation: '可考虑其他更适合的岗位或降低薪资期望',
      interviewFeedback: '候选人态度积极，但技术深度有待提升'
    },
    {
      id: '3',
      candidateId: '4',
      candidateName: '刘芳',
      phone: '136****3456',
      jobTitle: 'UI/UX设计师',
      callType: 'outgoing',
      status: 'in_progress',
      duration: '05:23',
      date: '2024-03-25',
      time: '16:00',
      aiQuestions: [],
      answers: [],
      matchScore: 85,
      matchAnalysis: '设计经验与岗位要求匹配',
      recommendation: '面试进行中',
      interviewFeedback: ''
    },
    {
      id: '4',
      candidateId: '5',
      candidateName: '陈伟',
      phone: '135****7890',
      jobTitle: '后端工程师',
      callType: 'missed',
      status: 'failed',
      duration: '00:00',
      date: '2024-03-25',
      time: '09:30',
      aiQuestions: [],
      answers: [],
      matchScore: 90,
      matchAnalysis: '技术背景优秀，AI面试未能接通',
      recommendation: '建议重新预约面试',
      interviewFeedback: '呼叫未接通，需人工跟进'
    },
    {
      id: '5',
      candidateId: '6',
      candidateName: '赵雪',
      phone: '134****2345',
      jobTitle: '高级前端工程师',
      callType: 'incoming',
      status: 'completed',
      duration: '08:15',
      date: '2024-03-24',
      time: '11:20',
      aiQuestions: [
        '感谢您的来电，请问有什么可以帮您？'
      ],
      answers: [
        '我想咨询一下高级前端工程师岗位的面试安排'
      ],
      matchScore: 96,
      matchAnalysis: '主动咨询面试安排，意向强烈',
      recommendation: '优先安排面试',
      interviewFeedback: '候选人主动性强，对岗位兴趣度高'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '已完成' },
      in_progress: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '进行中' },
      failed: { bg: 'bg-red-500/20', text: 'text-red-400', label: '未接通' },
      scheduled: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '已预约' }
    };
    return badges[status] || badges.scheduled;
  };

  const getCallTypeIcon = (type) => {
    switch(type) {
      case 'outgoing': return <PhoneOutgoing className="w-4 h-4" />;
      case 'incoming': return <PhoneIncoming className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredRecords = callRecords.filter(record => {
    const matchesSearch = record.candidateName.includes(searchTerm) || 
                          record.jobTitle.includes(searchTerm);
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'completed') return matchesSearch && record.status === 'completed';
    if (activeTab === 'in_progress') return matchesSearch && record.status === 'in_progress';
    if (activeTab === 'failed') return matchesSearch && record.status === 'failed';
    return matchesSearch;
  });

  const stats = {
    total: callRecords.length,
    completed: callRecords.filter(r => r.status === 'completed').length,
    inProgress: callRecords.filter(r => r.status === 'in_progress').length,
    avgDuration: '12:18'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">外呼面试记录</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理AI外呼面试通话记录和面试结果</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30">
          <RefreshCw className="w-4 h-4" />
          <span>发起新外呼</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="mt-2 text-blue-100">总通话数</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{stats.completed}</span>
          </div>
          <p className="mt-2 text-emerald-100">已完成</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{stats.inProgress}</span>
          </div>
          <p className="mt-2 text-yellow-100">进行中</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{stats.avgDuration}</span>
          </div>
          <p className="mt-2 text-purple-100">平均时长</p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { key: 'all', label: '全部' },
            { key: 'completed', label: '已完成' },
            { key: 'in_progress', label: '进行中' },
            { key: 'failed', label: '未接通' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索候选人或职位..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Records Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">候选人</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">通话类型</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">匹配度</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">时长</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredRecords.map(record => (
                  <tr 
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${selectedRecord?.id === record.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{record.candidateName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{record.candidateName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{record.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        {getCallTypeIcon(record.callType)}
                        <span className="text-sm">
                          {record.callType === 'outgoing' ? '外呼' : record.callType === 'incoming' ? '来电' : '呼叫'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status).bg} ${getStatusBadge(record.status).text}`}>
                        {record.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {record.status === 'in_progress' && <Clock className="w-3 h-3" />}
                        {record.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {getStatusBadge(record.status).label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getMatchColor(record.matchScore)}`}>{record.matchScore}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${record.matchScore >= 90 ? 'bg-emerald-500' : record.matchScore >= 80 ? 'bg-blue-500' : record.matchScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${record.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{record.duration}</td>
                    <td className="px-4 py-4">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedRecord ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sticky top-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{selectedRecord.candidateName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedRecord.candidateName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRecord.jobTitle}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">匹配度</p>
                  <p className={`text-xl font-bold ${getMatchColor(selectedRecord.matchScore)}`}>{selectedRecord.matchScore}%</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">通话时长</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedRecord.duration}</p>
                </div>
              </div>

              {/* AI Questions & Answers */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  AI问答记录
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedRecord.aiQuestions.map((q, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Mic className="w-3 h-3 text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-xl rounded-tl-none px-3 py-2">
                          {q}
                        </p>
                      </div>
                      {selectedRecord.answers[i] && (
                        <div className="flex items-start gap-2 justify-end">
                          <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl rounded-tr-none px-3 py-2">
                            {selectedRecord.answers[i]}
                          </p>
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-emerald-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Analysis */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  匹配度分析
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  {selectedRecord.matchAnalysis}
                </p>
              </div>

              {/* Recommendation */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  AI建议
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                  {selectedRecord.recommendation}
                </p>
              </div>

              {/* Interview Feedback */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  面试反馈
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRecord.interviewFeedback || '暂无反馈'}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                  <Send className="w-4 h-4" />
                  安排人工复试
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <Phone className="w-4 h-4" />
                  重新外呼
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">点击左侧记录查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallRecords;
