import React, { useState, useMemo } from 'react';
import { Brain, Search, Filter, TrendingUp, ChevronRight, Check, X, Star, Sparkles, Target, Zap, ChevronDown, XCircle, ArrowUpDown } from 'lucide-react';
import useStore from '../store/useStore';

const MatchBadge = ({ score, large }) => {
  const getColor = (score) => {
    if (score >= 90) return { bg: 'bg-emerald-500', text: 'text-white', label: '极高匹配' };
    if (score >= 80) return { bg: 'bg-blue-500', text: 'text-white', label: '高匹配' };
    if (score >= 70) return { bg: 'bg-yellow-500', text: 'text-white', label: '中匹配' };
    return { bg: 'bg-red-500', text: 'text-white', label: '低匹配' };
  };
  const colors = getColor(score);
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} ${large ? 'text-2xl font-bold' : 'text-sm font-semibold'} shadow-lg`}>
      <Star className={`${large ? 'w-6 h-6' : 'w-4 h-4'} fill-current`} />
      <span>{score}%</span>
    </div>
  );
};

const MatchCard = ({ candidate, rank, onView }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group cursor-pointer" onClick={() => onView(candidate)}>
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
          <span className="text-xl font-bold text-white">{candidate.name.charAt(0)}</span>
        </div>
        <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
          <span className="text-xs font-bold text-white">{rank}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{candidate.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
          </div>
          <MatchBadge score={candidate.matchScore} />
        </div>
      </div>
    </div>
    <div className="mt-5 grid grid-cols-3 gap-3">
      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-center border border-blue-100 dark:border-blue-500/20">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">技能匹配</p>
        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{candidate.skillMatch}%</p>
      </div>
      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-center border border-emerald-100 dark:border-emerald-500/20">
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">经验匹配</p>
        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{candidate.expMatch}%</p>
      </div>
      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-center border border-purple-100 dark:border-purple-500/20">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">文化匹配</p>
        <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{candidate.cultureMatch}%</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className="badge text-sm">
        {candidate.status === '待联系' ? '待联系' : candidate.status === '待面试' ? '待面试' : '已处理'}
      </span>
      <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
        查看详情 <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MatchDetail = ({ candidate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{candidate.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MatchBadge score={candidate.matchScore} large />
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-brfrom-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  匹配度详情
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">技能匹配</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{candidate.skillMatch}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${candidate.skillMatch}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">经验匹配</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{candidate.expMatch}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${candidate.expMatch}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">文化匹配</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{candidate.cultureMatch}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all" style={{ width: `${candidate.cultureMatch}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">候选人信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">工作年限</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.experience}年</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">学历</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.education}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">当前状态</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{candidate.status}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400">期望薪资</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{candidate.salary}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-500/20 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI分析建议
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-500/20">
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">优势</p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> 技能与职位要求高度匹配</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> 有丰富的项目实战经验</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> 沟通表达能力出色</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-amber-500/20">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">建议</p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> 建议安排技术面试</li>
                      <li className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> 可考虑薪资谈判</li>
                    </ul>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    发起AI外呼面试
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIMatch = () => {
  const jobs = useStore((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('matchScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // 模拟匹配数据
  const matchedCandidates = [
    { id: '1', name: '张明', jobTitle: '高级前端工程师', matchScore: 96, skillMatch: 95, expMatch: 92, cultureMatch: 88, experience: 5, education: '硕士', status: '待联系', salary: '40K-50K' },
    { id: '2', name: '李娜', jobTitle: '高级前端工程师', matchScore: 88, skillMatch: 85, expMatch: 78, cultureMatch: 92, experience: 3, education: '本科', status: '待面试', salary: '30K-40K' },
    { id: '3', name: '王浩', jobTitle: '产品经理', matchScore: 94, skillMatch: 90, expMatch: 95, cultureMatch: 88, experience: 7, education: '硕士', status: '待联系', salary: '45K-55K' },
    { id: '4', name: '刘芳', jobTitle: 'UI/UX设计师', matchScore: 85, skillMatch: 88, expMatch: 75, cultureMatch: 90, experience: 4, education: '本科', status: '待面试', salary: '25K-35K' },
    { id: '5', name: '陈伟', jobTitle: '后端工程师', matchScore: 92, skillMatch: 90, expMatch: 88, cultureMatch: 85, experience: 6, education: '硕士', status: '待联系', salary: '35K-45K' },
    { id: '6', name: '赵雪', jobTitle: '高级前端工程师', matchScore: 98, skillMatch: 98, expMatch: 95, cultureMatch: 92, experience: 8, education: '博士', status: '待面试', salary: '50K-60K' },
  ];

  const filteredCandidates = useMemo(() => {
    let result = matchedCandidates;
    
    if (selectedJob !== 'all') {
      result = result.filter(c => c.jobTitle === selectedJob);
    }
    
    if (searchTerm) {
      result = result.filter(c => 
        c.name.includes(searchTerm) || 
        c.jobTitle.includes(searchTerm)
      );
    }
    
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    
    return result;
  }, [selectedJob, searchTerm, sortBy, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI智能匹配</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">基于多维度分析的智能人岗匹配系统</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/30 font-medium">
          <Sparkles className="w-5 h-5" />
          重新匹配
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{matchedCandidates.length}</span>
          </div>
          <p className="mt-2 text-blue-100 font-medium">匹配候选人</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">93%</span>
          </div>
          <p className="mt-2 text-emerald-100 font-medium">平均匹配度</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">4</span>
          </div>
          <p className="mt-2 text-purple-100 font-medium">高匹配候选人</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">12</span>
          </div>
          <p className="mt-2 text-amber-100 font-medium">待发起外呼</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select 
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部职位</option>
            {jobs.map(job => (
              <option key={job.id} value={job.title}>{job.title}</option>
            ))}
          </select>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索候选人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button 
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'desc' ? '从高到低' : '从低到高'}
        </button>
      </div>

      {/* Match List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate, index) => (
          <MatchCard 
            key={candidate.id} 
            candidate={candidate} 
            rank={index + 1}
            onView={setSelectedCandidate}
          />
        ))}
      </div>

      {/* Match Detail Modal */}
      {selectedCandidate && (
        <MatchDetail 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
};

export default AIMatch;
