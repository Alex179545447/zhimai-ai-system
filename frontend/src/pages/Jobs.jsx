import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, MapPin, DollarSign, Users,
  Eye, Edit2, Trash2, CheckCircle, XCircle, Briefcase, TrendingUp,
  ChevronDown, X, Sparkles, Globe, Loader2, Link2, Check
} from 'lucide-react';
import useStore from '../store/useStore';

const JobModal = ({ job, onClose, onSave }) => {
  const [formData, setFormData] = useState(job || {
    title: '', department: '', location: '', salary: '', skills: [], status: 'active'
  });
  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job ? '编辑职位' : '创建新职位'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">职位名称</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="例如：高级前端工程师" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">部门</label>
              <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="select-field">
                <option value="">选择部门</option>
                <option value="技术部">技术部</option>
                <option value="产品部">产品部</option>
                <option value="设计部">设计部</option>
                <option value="市场部">市场部</option>
                <option value="运营部">运营部</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">工作地点</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="例如：北京" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">薪资范围</label>
            <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="input-field" placeholder="例如：25K-40K" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">技能要求</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input-field flex-1" placeholder="输入技能并按回车添加" />
              <button type="button" onClick={addSkill} className="btn-gradient-outline px-4">添加</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span key={skill} className="badge-primary flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">状态</label>
            <div className="flex gap-3">
              {['active', 'paused', 'closed'].map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={status} checked={formData.status === status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {status === 'active' ? '招聘中' : status === 'paused' ? '暂停' : '已关闭'}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-gradient-outline">取消</button>
            <button type="submit" className="btn-gradient">{job ? '保存修改' : '创建职位'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 网站抓取职位弹窗
const WebScrapeModal = ({ onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('请输入有效的招聘网站URL');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // 模拟网站抓取（实际项目中需要调用后端API）
    setTimeout(() => {
      // 模拟抓取到的职位数据
      const mockJobs = [
        { id: 'scraped-1', title: '高级前端工程师', company: '示例公司A', location: '北京', salary: '30K-50K', skills: ['React', 'TypeScript', 'Vue'], match: 92 },
        { id: 'scraped-2', title: 'React开发工程师', company: '示例公司B', location: '上海', salary: '25K-40K', skills: ['React', 'Redux', 'Node.js'], match: 88 },
        { id: 'scraped-3', title: '前端架构师', company: '示例公司C', location: '深圳', salary: '40K-60K', skills: ['React', '微前端', '性能优化'], match: 85 },
        { id: 'scraped-4', title: '全栈工程师', company: '示例公司D', location: '杭州', salary: '28K-45K', skills: ['React', 'Node.js', 'MongoDB'], match: 82 },
      ];
      setScrapedJobs(mockJobs);
      setIsLoading(false);
    }, 2000);
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleImport = () => {
    const jobsToImport = scrapedJobs.filter(job => selectedJobs.includes(job.id));
    onImport(jobsToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">从网站抓取职位</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">粘贴招聘网站URL，自动解析职位信息</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="url" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
                placeholder="粘贴招聘网站URL，如 https://www.zhipin.com/..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button 
              onClick={handleScrape}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  抓取中...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  抓取职位
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {scrapedJobs.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  找到 {scrapedJobs.length} 个职位，勾选要导入的职位
                </p>
                <button 
                  onClick={() => setSelectedJobs(selectedJobs.length === scrapedJobs.length ? [] : scrapedJobs.map(j => j.id))}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {selectedJobs.length === scrapedJobs.length ? '取消全选' : '全选'}
                </button>
              </div>
              {scrapedJobs.map((job) => (
                <div 
                  key={job.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedJobs.includes(job.id) 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                  }`}
                  onClick={() => toggleJobSelection(job.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      selectedJobs.includes(job.id) 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedJobs.includes(job.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} · {job.location}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                          {job.salary}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {isLoading ? '正在从网站抓取职位...' : '输入招聘网站URL，点击抓取按钮开始'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                支持Boss直聘、智联招聘、前程无忧、拉勾网等主流招聘平台
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="btn-gradient-outline">取消</button>
          <button 
            onClick={handleImport}
            disabled={selectedJobs.length === 0}
            className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          >
            导入选中职位 ({selectedJobs.length})
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job, onEdit, onDelete, onView }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">招聘中</span>;
      case 'paused': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">暂停</span>;
      case 'closed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400">已关闭</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => onView(job)}>{job.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{job.department}</p>
        </div>
        {getStatusBadge(job.status)}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> {job.location}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-emerald-500" /> {job.salary}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Users className="w-4 h-4 text-purple-500" /> {job.applicants} 投递</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold"><TrendingUp className="w-4 h-4" /> {job.matched} 匹配</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.slice(0, 4).map(skill => (
          <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">{skill}</span>
        ))}
        {job.skills.length > 4 && (
          <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">+{job.skills.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">创建于 {job.createdAt}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(job)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="查看详情">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(job)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" title="编辑">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(job.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="删除">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const JobProfile = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{job.department} - {job.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">职位信息</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">薪资范围</span>
                    <span className="text-gray-900 dark:text-white font-bold">{job.salary}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">工作地点</span>
                    <span className="text-gray-900 dark:text-white font-bold">{job.location}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">投递人数</span>
                    <span className="text-gray-900 dark:text-white font-bold">{job.applicants}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">AI匹配</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{job.matched}人</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-2xl p-6 border border-purple-100 dark:border-purple-500/20">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  技能要求
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium text-sm border border-purple-100 dark:border-purple-500/20">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 h-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">投递统计</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">简历筛选通过率</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">45%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">面试邀约率</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">15%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">最终入职率</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">2%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Jobs = () => {
  const jobs = useStore((state) => state.jobs);
  const addJob = useStore((state) => state.addJob);
  const updateJob = useStore((state) => state.updateJob);
  const deleteJob = useStore((state) => state.deleteJob);

  const [showModal, setShowModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (formData) => {
    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob(formData);
    }
  };

  const handleScrapeImport = (scrapedJobs) => {
    // 将抓取的职位导入到系统
    scrapedJobs.forEach(job => {
      addJob({
        title: job.title,
        department: '技术部',
        location: job.location,
        salary: job.salary,
        skills: job.skills,
        status: 'active'
      });
    });
  };

  const handleDelete = (id) => {
    if (confirm('确定要删除这个职位吗？')) {
      deleteJob(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">职位管理</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">管理所有招聘信息，查看职位详情和投递情况</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowScrapeModal(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 font-medium"
          >
            <Globe className="w-5 h-5" />
            网站抓取
          </button>
          <button onClick={() => { setEditingJob(null); setShowModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/30 font-medium">
            <Plus className="w-5 h-5" />
            发布新职位
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索职位名称或部门..." className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder-gray-400" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium ${showFilters ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
            <Filter className="w-4 h-4" />
            筛选
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 animate-slide-down">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium self-center">状态:</span>
            {['all', 'active', 'paused', 'closed'].map(status => (
              <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {status === 'all' ? '全部' : status === 'active' ? '招聘中' : status === 'paused' ? '暂停' : '已关闭'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{jobs.length}</span>
          </div>
          <p className="mt-2 text-blue-100 font-medium">全部职位</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{jobs.filter(j => j.status === 'active').length}</span>
          </div>
          <p className="mt-2 text-emerald-100 font-medium">招聘中</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{jobs.reduce((acc, j) => acc + j.applicants, 0)}</span>
          </div>
          <p className="mt-2 text-purple-100 font-medium">总投递数</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{jobs.reduce((acc, j) => acc + j.matched, 0)}</span>
          </div>
          <p className="mt-2 text-amber-100 font-medium">AI匹配数</p>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job, index) => (
            <div key={job.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <JobCard job={job} onEdit={(j) => { setEditingJob(j); setShowModal(true); }} onDelete={handleDelete} onView={(j) => setViewingJob(j)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">未找到符合条件的职位</p>
        </div>
      )}

      {/* Modals */}
      {showModal && <JobModal job={editingJob} onClose={() => { setShowModal(false); setEditingJob(null); }} onSave={handleSave} />}
      {showScrapeModal && <WebScrapeModal onClose={() => setShowScrapeModal(false)} onImport={handleScrapeImport} />}
      {viewingJob && <JobProfile job={viewingJob} onClose={() => setViewingJob(null)} />}
    </div>
  );
};

export default Jobs;
