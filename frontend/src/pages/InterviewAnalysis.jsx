import React, { useState } from 'react';
import { FileSearch, ThumbsUp, TrendingUp, MessageSquare, Brain, ChevronRight, Clock, Minus, XCircle, Calendar, Sparkles, Target, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnalysisCard = ({ candidate, onView }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group cursor-pointer" onClick={() => onView(candidate)}>
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{candidate.name?.charAt(0) || '?'}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{candidate.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{candidate.score}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">综合评分</p>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <div>
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600 dark:text-gray-400 font-medium">技术能力</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{candidate.technical}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${candidate.technical}%` }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600 dark:text-gray-400 font-medium">沟通表达</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{candidate.communication}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${candidate.communication}%` }} />
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
      <span className={`badge ${
        candidate.recommendation === '强烈推荐' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
        candidate.recommendation === '推荐' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
      }`}>
        {candidate.recommendation}
      </span>
      <button className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
        查看详情 <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const InterviewAnalysis = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const candidates = [
    { id: 1, name: '张明', jobTitle: '高级前端工程师', score: 87, technical: 88, communication: 82, problemSolving: 85, recommendation: '推荐', date: '2024-03-24' },
    { id: 2, name: '李娜', jobTitle: '高级前端工程师', score: 78, technical: 75, communication: 80, problemSolving: 78, recommendation: '待定', date: '2024-03-23' },
    { id: 3, name: '王浩', jobTitle: '产品经理', score: 92, technical: 85, communication: 95, problemSolving: 90, recommendation: '强烈推荐', date: '2024-03-22' },
    { id: 4, name: '刘芳', jobTitle: 'UI/UX设计师', score: 85, technical: 82, communication: 88, problemSolving: 80, recommendation: '推荐', date: '2024-03-21' },
    { id: 5, name: '陈伟', jobTitle: '后端工程师', score: 80, technical: 85, communication: 75, problemSolving: 82, recommendation: '待定', date: '2024-03-20' },
  ];
  
  const filteredCandidates = filterStatus === 'all' ? candidates : candidates.filter(c => c.recommendation === filterStatus);
  const avgScore = Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">面试分析</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI智能分析面试表现，生成候选人评估报告</p>
        </div>
        <button className="btn-gradient flex items-center gap-2">
          <Brain className="w-5 h-5" />
          生成新报告
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button onClick={() => navigate('/candidates')} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white text-center hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30">
          <FileSearch className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{candidates.length}</p>
          <p className="text-blue-100 text-sm font-medium mt-1">面试记录</p>
        </button>
        <button onClick={() => setFilterStatus('强烈推荐')} className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{candidates.filter(c => c.recommendation === '强烈推荐').length}</p>
          <p className="text-emerald-100 text-sm font-medium mt-1">强烈推荐</p>
        </button>
        <button className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 text-white text-center hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{avgScore}%</p>
          <p className="text-purple-100 text-sm font-medium mt-1">平均评分</p>
        </button>
        <button onClick={() => setFilterStatus('待定')} className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-3xl font-bold">{candidates.filter(c => c.recommendation === '待定').length}</p>
          <p className="text-amber-100 text-sm font-medium mt-1">待定</p>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>全部</button>
          <button onClick={() => setFilterStatus('强烈推荐')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === '强烈推荐' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>强烈推荐</button>
          <button onClick={() => setFilterStatus('推荐')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === '推荐' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>推荐</button>
          <button onClick={() => setFilterStatus('待定')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === '待定' ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>待定</button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate) => (
          <AnalysisCard key={candidate.id} candidate={candidate} onView={(c) => setSelectedCandidate(c)} />
        ))}
      </div>
    </div>
  );
};

export default InterviewAnalysis;
