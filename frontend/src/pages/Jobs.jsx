import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, MapPin, DollarSign, Users,
  Eye, Edit2, Trash2, CheckCircle, XCircle, Briefcase, TrendingUp,
  ChevronDown, X, Sparkles
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
      <div className="bg-dark-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{job ? '编辑职位' : '创建新职位'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">职位名称</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="例如：高级前端工程师" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">部门</label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">工作地点</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="例如：北京" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">薪资范围</label>
            <input type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="input-field" placeholder="例如：25K-40K" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">技能要求</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">状态</label>
            <div className="flex gap-3">
              {['active', 'paused', 'closed'].map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status" value={status} checked={formData.status === status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm text-gray-300">
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

const JobCard = ({ job, onEdit, onDelete, onView }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge-success">招聘中</span>;
      case 'paused': return <span className="badge-warning">暂停</span>;
      case 'closed': return <span className="badge-error">已关闭</span>;
      default: return null;
    }
  };

  return (
    <div className="card-hover group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{job.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{job.department}</p>
        </div>
        {getStatusBadge(job.status)}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {job.applicants} 投递</span>
          <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-4 h-4" /> {job.matched} 匹配</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.slice(0, 4).map(skill => (
          <span key={skill} className="text-xs px-2 py-1 rounded-md bg-dark-300 text-gray-300">{skill}</span>
        ))}
        {job.skills.length > 4 && (
          <span className="text-xs px-2 py-1 rounded-md bg-dark-300 text-gray-400">+{job.skills.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dark-100">
        <span className="text-xs text-gray-500">创建于 {job.createdAt}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onView(job)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(job)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(job.id)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const JobProfile = ({ job, onClose }) => {
  const skillData = [
    { skill: 'React', value: 95, candidate: 85 },
    { skill: 'TypeScript', value: 88, candidate: 72 },
    { skill: 'Node.js', value: 82, candidate: 68 },
    { skill: 'GraphQL', value: 75, candidate: 60 },
    { skill: 'CSS3', value: 90, candidate: 88 },
    { skill: '团队协作', value: 85, candidate: 80 },
  ];

  const maxValue = 100;
  const cx = 120, cy = 120, r = 80;

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{job.title}</h2>
            <p className="text-sm text-gray-400">{job.department} - {job.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Info */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">职位信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">薪资范围</span>
                    <span className="text-white font-medium">{job.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">工作地点</span>
                    <span className="text-white">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">投递人数</span>
                    <span className="text-white">{job.applicants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI匹配</span>
                    <span className="text-emerald-400">{job.matched}人</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  技能要求
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">人才画像对比</h3>
              <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
                {/* Background circles */}
                {[25, 50, 75, 100].map(pct => (
                  <circle key={pct} cx={cx} cy={cy} r={r * pct / 100} fill="none" stroke="#374151" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4, 5].map(i => {
                  const angle = i * 60;
                  const point = polarToCartesian(cx, cy, r, angle);
                  return <line key={i} x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#374151" strokeWidth="1" />;
                })}
                
                {/* Requirement polygon */}
                <polygon
                  points={skillData.map((d, i) => {
                    const point = polarToCartesian(cx, cy, r * d.value / maxValue, i * 60);
                    return `${point.x},${point.y}`;
                  }).join(' ')}
                  fill="rgba(99, 102, 241, 0.3)"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                
                {/* Candidate average polygon */}
                <polygon
                  points={skillData.map((d, i) => {
                    const point = polarToCartesian(cx, cy, r * d.candidate / maxValue, i * 60);
                    return `${point.x},${point.y}`;
                  }).join(' ')}
                  fill="rgba(34, 197, 94, 0.2)"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="4"
                />

                {/* Labels */}
                {skillData.map((d, i) => {
                  const point = polarToCartesian(cx, cy, r + 25, i * 60);
                  return (
                    <text key={d.skill} x={point.x} y={point.y} textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="500">
                      {d.skill}
                    </text>
                  );
                })}
              </svg>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <span className="text-sm text-gray-400">职位要求</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 border border-dashed border-emerald-400" />
                  <span className="text-sm text-gray-400">候选人均值</span>
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
          <h1 className="text-2xl font-bold text-white">职位管理</h1>
          <p className="text-gray-400 mt-1">管理所有招聘信息，查看职位详情和投递情况</p>
        </div>
        <button onClick={() => { setEditingJob(null); setShowModal(true); }} className="btn-gradient flex items-center gap-2">
          <Plus className="w-5 h-5" />
          发布新职位
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-dark-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索职位名称或部门..." className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-gradient-outline flex items-center gap-2 ${showFilters ? 'bg-primary-500/20' : ''}`}>
            <Filter className="w-4 h-4" />
            筛选
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-dark-100 flex flex-wrap gap-4 animate-slide-down">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">状态:</span>
              {['all', 'active', 'paused', 'closed'].map(status => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 rounded-full text-sm transition-colors ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>
                  {status === 'all' ? '全部' : status === 'active' ? '招聘中' : status === 'paused' ? '暂停' : '已关闭'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <Briefcase className="w-8 h-8 mx-auto mb-2 text-primary-400" />
          <p className="text-2xl font-bold text-white">{jobs.length}</p>
          <p className="text-sm text-gray-400">全部职位</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'active').length}</p>
          <p className="text-sm text-gray-400">招聘中</p>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
          <p className="text-2xl font-bold text-white">{jobs.reduce((acc, j) => acc + j.applicants, 0)}</p>
          <p className="text-sm text-gray-400">总投递数</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold text-white">{jobs.reduce((acc, j) => acc + j.matched, 0)}</p>
          <p className="text-sm text-gray-400">AI匹配数</p>
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
        <div className="card text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">未找到符合条件的职位</p>
        </div>
      )}

      {/* Modals */}
      {showModal && <JobModal job={editingJob} onClose={() => { setShowModal(false); setEditingJob(null); }} onSave={handleSave} />}
      {viewingJob && <JobProfile job={viewingJob} onClose={() => setViewingJob(null)} />}
    </div>
  );
};

export default Jobs;
