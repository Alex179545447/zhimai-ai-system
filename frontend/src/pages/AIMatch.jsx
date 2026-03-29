import React, { useState } from 'react';
import { Brain, Search, Filter, TrendingUp, ChevronRight, Check, X, Star, Sparkles, Target, Zap, ChevronDown, XCircle } from 'lucide-react';

const MatchBadge = ({ score }) => {
  const getColor = (score) => {
    if (score >= 90) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500' };
    if (score >= 75) return { bg: 'bg-primary-500/20', text: 'text-primary-400', ring: 'ring-primary-500' };
    if (score >= 60) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500' };
    return { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500' };
  };
  const colors = getColor(score);
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${colors.bg} ring-1 ${colors.ring}`}>
      <Star className="w-3 h-3" />
      <span className={`text-sm font-bold ${colors.text}`}>{score}%</span>
    </div>
  );
};

const MatchCard = ({ candidate, rank, onView }) => (
  <div className="card-hover group">
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{candidate.name.charAt(0)}</span>
        </div>
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-dark-300 border-2 border-primary-500 flex items-center justify-center">
          <span className="text-xs font-bold text-primary-400">{rank}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{candidate.name}</h3>
            <p className="text-sm text-gray-400">{candidate.jobTitle}</p>
          </div>
          <MatchBadge score={candidate.matchScore} />
        </div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-3">
      <div className="p-3 rounded-lg bg-dark-300 text-center">
        <p className="text-xs text-gray-400">技能匹配</p>
        <p className="text-lg font-bold text-primary-400">{candidate.skillMatch}%</p>
      </div>
      <div className="p-3 rounded-lg bg-dark-300 text-center">
        <p className="text-xs text-gray-400">经验匹配</p>
        <p className="text-lg font-bold text-emerald-400">{candidate.expMatch}%</p>
      </div>
      <div className="p-3 rounded-lg bg-dark-300 text-center">
        <p className="text-xs text-gray-400">文化匹配</p>
        <p className="text-lg font-bold text-purple-400">{candidate.cultureMatch}%</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className={`badge ${candidate.status === '待联系' ? 'bg-blue-500/20 text-blue-400' : candidate.status === '待面试' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
        {candidate.status}
      </span>
      <button onClick={() => onView(candidate)} className="btn-gradient-outline text-sm px-3 py-1.5 flex items-center gap-1">
        查看详情 <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MatchDetail = ({ candidate, onClose }) => {
  const cx = 150, cy = 150, r = 100;
  const dimensions = [{ name: '技术能力', value: 88 }, { name: '项目经验', value: 85 }, { name: '沟通表达', value: 78 }, { name: '学习能力', value: 92 }, { name: '团队协作', value: 86 }];
  const polarToCartesian = (cx, cy, r, angle) => { const rad = (angle - 90) * Math.PI / 180; return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }; };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
              <p className="text-gray-400">{candidate.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MatchBadge score={candidate.matchScore} />
            <button onClick={onClose} className="p-2 hover:bg-dark-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary-400" />匹配度详情</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-sm text-gray-400">技能匹配</span><span className="text-sm font-medium text-primary-400">{candidate.skillMatch}%</span></div>
                    <div className="h-3 bg-dark-300 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: `${candidate.skillMatch}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-sm text-gray-400">经验匹配</span><span className="text-sm font-medium text-emerald-400">{candidate.expMatch}%</span></div>
                    <div className="h-3 bg-dark-300 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${candidate.expMatch}%` }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-sm text-gray-400">文化匹配</span><span className="text-sm font-medium text-purple-400">{candidate.cultureMatch}%</span></div>
                    <div className="h-3 bg-dark-300 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${candidate.cultureMatch}%` }} /></div>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-400" />AI分析摘要</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-medium text-emerald-400">核心技能高度匹配</p><p className="text-xs text-gray-400 mt-1">候选人掌握的核心技能与职位要求匹配度达到95%以上</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-5h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div><p className="text-sm font-medium text-emerald-400">经验符合预期</p><p className="text-xs text-gray-400 mt-1">6年+前端开发经验，具备大型项目开发能力</p></div>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">快速操作</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-gradient text-sm px-4 py-2 flex items-center gap-2"><Check className="w-4 h-4" />邀请面试</button>
                  <button className="btn-gradient-outline text-sm px-4 py-2">查看简历</button>
                  <button className="btn-gradient-outline text-sm px-4 py-2"><X className="w-4 h-4" />标记不合适</button>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">候选人评估雷达图</h3>
              <svg width="320" height="320" viewBox="0 0 320 320" className="mx-auto">
                {[25, 50, 75, 100].map(pct => (<circle key={pct} cx={cx} cy={cy} r={r * pct / 100} fill="none" stroke="#374151" strokeWidth="1" />))}
                {[0, 1, 2, 3, 4].map(i => { const angle = i * 72; const point = polarToCartesian(cx, cy, r, angle); return <line key={i} x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#374151" strokeWidth="1" />; })}
                <polygon points={dimensions.map((d, i) => { const point = polarToCartesian(cx, cy, r * d.value / 100, i * 72); return `${point.x},${point.y}`; }).join(' ')} fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" strokeWidth="2" />
                {dimensions.map((d, i) => { const point = polarToCartesian(cx, cy, r + 25, i * 72); return <text key={d.name} x={point.x} y={point.y} textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="500">{d.name}</text>; })}
                {dimensions.map((d, i) => { const point = polarToCartesian(cx, cy, r * d.value / 100, i * 72); return <circle key={i} cx={point.x} cy={point.y} r="4" fill="#6366f1" />; })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIMatch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('matchScore');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const ranking = [
    { id: 1, name: '赵雪', jobTitle: '高级前端工程师', matchScore: 96, skillMatch: 98, expMatch: 95, cultureMatch: 94, status: '待联系' },
    { id: 2, name: '王浩', jobTitle: '产品经理', matchScore: 95, skillMatch: 92, expMatch: 98, cultureMatch: 95, status: '待面试' },
    { id: 3, name: '张明', jobTitle: '高级前端工程师', matchScore: 92, skillMatch: 90, expMatch: 88, cultureMatch: 98, status: '待面试' },
    { id: 4, name: '陈伟', jobTitle: '后端工程师', matchScore: 90, skillMatch: 95, expMatch: 92, cultureMatch: 82, status: '待筛选' },
    { id: 5, name: '李娜', jobTitle: '高级前端工程师', matchScore: 88, skillMatch: 85, expMatch: 82, cultureMatch: 96, status: '待筛选' },
    { id: 6, name: '刘芳', jobTitle: 'UI/UX设计师', matchScore: 85, skillMatch: 88, expMatch: 80, cultureMatch: 88, status: '待面试' },
  ];
  const filteredRanking = ranking.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => b[sortBy] - a[sortBy]);
  const highMatchCount = ranking.filter(c => c.matchScore >= 85).length;
  const avgMatchScore = Math.round(ranking.reduce((acc, c) => acc + c.matchScore, 0) / ranking.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">AI简历匹配</h1><p className="text-gray-400 mt-1">智能分析人岗匹配度，发现最适合的候选人</p></div>
        <button className="btn-gradient flex items-center gap-2"><Brain className="w-5 h-5" />重新匹配</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-400" /><p className="text-3xl font-bold text-white">{highMatchCount}</p><p className="text-sm text-gray-400">高匹配候选人</p></div>
        <div className="card text-center"><Target className="w-8 h-8 mx-auto mb-2 text-primary-400" /><p className="text-3xl font-bold text-white">{avgMatchScore}%</p><p className="text-sm text-gray-400">平均匹配度</p></div>
        <div className="card text-center"><Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" /><p className="text-3xl font-bold text-white">{ranking.length}</p><p className="text-sm text-gray-400">已分析候选人</p></div>
        <div className="card text-center"><Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" /><p className="text-3xl font-bold text-white">92%</p><p className="text-sm text-gray-400">AI准确率</p></div>
      </div>
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-dark-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索候选人或职位..." className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">排序:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select-field w-auto">
              <option value="matchScore">综合匹配度</option>
              <option value="skillMatch">技能匹配</option>
              <option value="expMatch">经验匹配</option>
              <option value="cultureMatch">文化匹配</option>
            </select>
          </div>
          <button className="btn-gradient-outline flex items-center gap-2"><Filter className="w-4 h-4" />高级筛选</button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-white flex items-center gap-2"><Brain className="w-5 h-5 text-primary-400" />候选人排名</h2><div className="flex items-center gap-2"><span className="text-xs text-gray-500">匹配度 &ge; 85%</span><div className="w-3 h-3 rounded-full bg-emerald-500" /></div></div>
        {filteredRanking.map((candidate, index) => (<div key={candidate.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}><MatchCard candidate={candidate} rank={index + 1} onView={(c) => setSelectedCandidate(c)} /></div>))}
      </div>
      {selectedCandidate && <MatchDetail candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
    </div>
  );
};

export default AIMatch;
