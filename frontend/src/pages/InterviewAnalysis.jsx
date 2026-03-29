import React, { useState } from 'react';
import { FileSearch, ThumbsUp, TrendingUp, MessageSquare, Brain, ChevronRight, Clock, Minus, XCircle, Calendar } from 'lucide-react';

const AnalysisCard = ({ candidate, onView }) => (
  <div className="card-hover group cursor-pointer" onClick={() => onView(candidate)}>
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{candidate.name?.charAt(0) || '?'}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{candidate.name}</h3>
            <p className="text-sm text-gray-400">{candidate.jobTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-400">{candidate.score}%</p>
            <p className="text-xs text-gray-400">综合评分</p>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <div><div className="flex justify-between mb-1 text-sm"><span className="text-gray-400">技术能力</span><span className="text-primary-400">{candidate.technical}%</span></div><div className="h-2 bg-dark-300 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: `${candidate.technical}%` }} /></div></div>
      <div><div className="flex justify-between mb-1 text-sm"><span className="text-gray-400">沟通表达</span><span className="text-emerald-400">{candidate.communication}%</span></div><div className="h-2 bg-dark-300 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${candidate.communication}%` }} /></div></div>
    </div>
    <div className="mt-4 pt-4 border-t border-dark-100 flex items-center justify-between">
      <span className={`badge ${candidate.recommendation === '强烈推荐' ? 'bg-emerald-500/20 text-emerald-400' : candidate.recommendation === '推荐' ? 'bg-primary-500/20 text-primary-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{candidate.recommendation}</span>
      <button className="text-sm text-primary-400 flex items-center gap-1">查看详情 <ChevronRight className="w-4 h-4" /></button>
    </div>
  </div>
);

const InterviewAnalysis = () => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 className="text-2xl font-bold text-white">面试分析</h1><p className="text-gray-400 mt-1">AI智能分析面试表现，生成候选人评估报告</p></div><button className="btn-gradient flex items-center gap-2"><Brain className="w-5 h-5" />生成新报告</button></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center"><FileSearch className="w-8 h-8 mx-auto mb-2 text-primary-400" /><p className="text-2xl font-bold text-white">{candidates.length}</p><p className="text-sm text-gray-400">面试记录</p></div>
        <div className="card text-center"><ThumbsUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" /><p className="text-2xl font-bold text-emerald-400">{candidates.filter(c => c.recommendation === '强烈推荐').length}</p><p className="text-sm text-gray-400">强烈推荐</p></div>
        <div className="card text-center"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary-400" /><p className="text-2xl font-bold text-white">{Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)}%</p><p className="text-sm text-gray-400">平均评分</p></div>
        <div className="card text-center"><Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" /><p className="text-2xl font-bold text-yellow-400">{candidates.filter(c => c.recommendation === '待定').length}</p><p className="text-sm text-gray-400">待定</p></div>
      </div>
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg text-sm ${filterStatus === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>全部</button>
          <button onClick={() => setFilterStatus('强烈推荐')} className={`px-4 py-2 rounded-lg text-sm ${filterStatus === '强烈推荐' ? 'bg-emerald-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>强烈推荐</button>
          <button onClick={() => setFilterStatus('推荐')} className={`px-4 py-2 rounded-lg text-sm ${filterStatus === '推荐' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>推荐</button>
          <button onClick={() => setFilterStatus('待定')} className={`px-4 py-2 rounded-lg text-sm ${filterStatus === '待定' ? 'bg-yellow-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>待定</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{filteredCandidates.map((candidate) => (<AnalysisCard key={candidate.id} candidate={candidate} onView={(c) => setSelectedCandidate(c)} />))}</div>
    </div>
  );
};

export default InterviewAnalysis;
