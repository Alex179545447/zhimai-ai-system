import React, { useState, useCallback } from 'react';
import { 
  Plus, Search, Filter, Grid, List, MoreVertical, Mail, Phone,
  MapPin, Calendar, Briefcase, Eye, Edit2, Trash2, Upload, X,
  Star, Clock, ChevronDown, User, FileText, Sparkles, CheckCircle,
  AlertCircle, XCircle, ArrowRight, RefreshCw, Settings,
  Link2, Check, Loader2, Inbox, File, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const statusConfig = {
  screening: { label: '筛选中', color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
  interview: { label: '面试中', color: 'bg-blue-500/20 text-blue-400', icon: Calendar },
  offer: { label: '待入职', color: 'bg-purple-500/20 text-purple-400', icon: Star },
  hired: { label: '已入职', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

// 邮箱关联设置弹窗
const EmailSettingsModal = ({ onClose }) => {
  const [email, setEmail] = useState(localStorage.getItem('resumeEmail') || '');
  const [password, setPassword] = useState('');
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('resumeEmail'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [syncInterval, setSyncInterval] = useState('30'); // 分钟
  const [autoParse, setAutoParse] = useState(true);

  const handleConnect = async () => {
    if (!email || !password) {
      setError('请填写完整的邮箱信息');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // 模拟连接邮箱服务器
    setTimeout(() => {
      localStorage.setItem('resumeEmail', email);
      localStorage.setItem('emailPassword', password);
      localStorage.setItem('syncInterval', syncInterval);
      localStorage.setItem('autoParse', autoParse);
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('resumeEmail');
    localStorage.removeItem('emailPassword');
    localStorage.removeItem('syncInterval');
    localStorage.removeItem('autoParse');
    setEmail('');
    setPassword('');
    setIsConnected(false);
  };

  const handleSyncNow = () => {
    setIsLoading(true);
    // 模拟同步简历
    setTimeout(() => {
      setIsLoading(false);
      alert('简历同步完成！找到 3 份新简历');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-xl animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <MailBox className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">邮箱关联设置</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">绑定邮箱，自动收集简历</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* 连接状态 */}
          {isConnected && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">已成功连接邮箱</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500/70">{email}</p>
                </div>
              </div>
            </div>
          )}

          {/* 邮箱设置表单 */}
          {!isConnected && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  邮箱地址
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="例如：hr@company.com"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">支持 Gmail、QQ邮箱、企业邮箱等</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Settings className="w-4 h-4 inline mr-1" />
                  邮箱密码/授权码
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入密码或授权码"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  如使用Gmail，建议使用<a href="#" className="text-blue-500 hover:underline">应用专用密码</a>
                </p>
              </div>
            </>
          )}

          {/* 同步设置 */}
          {isConnected && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  自动同步间隔
                </label>
                <select 
                  value={syncInterval} 
                  onChange={e => setSyncInterval(e.target.value)}
                  className="select-field"
                >
                  <option value="5">每 5 分钟</option>
                  <option value="15">每 15 分钟</option>
                  <option value="30">每 30 分钟</option>
                  <option value="60">每 1 小时</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">自动解析简历</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">收到邮件后自动解析附件简历</p>
                </div>
                <button 
                  onClick={() => setAutoParse(!autoParse)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${autoParse ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoParse ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          {isConnected ? (
            <>
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium"
              >
                断开连接
              </button>
              <button 
                onClick={handleSyncNow}
                disabled={isLoading}
                className="btn-gradient-outline flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    同步中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    立即同步
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="btn-gradient-outline">取消</button>
              <button 
                onClick={handleConnect}
                disabled={isLoading}
                className="btn-gradient flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    连接中...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    连接邮箱
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 邮箱简历列表弹窗
const EmailResumesModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([
    { id: 1, from: 'zhangsan@email.com', subject: '应聘前端工程师 - 张三', date: '2024-01-15', attachments: ['张三_简历.pdf'], parsed: true },
    { id: 2, from: 'lisi@email.com', subject: '简历投递 - 李四', date: '2024-01-15', attachments: ['李四简历.docx'], parsed: false },
    { id: 3, from: 'wangwu@email.com', subject: '求职申请 - 王五', date: '2024-01-14', attachments: ['王五_CV.pdf', '作品集.pdf'], parsed: true },
  ]);
  const [selectedResumes, setSelectedResumes] = useState([]);

  const toggleSelection = (id) => {
    setSelectedResumes(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleImport = () => {
    alert(`成功导入 ${selectedResumes.length} 份简历到系统`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">邮箱简历</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">从关联邮箱中导入简历</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div 
                key={resume.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedResumes.includes(resume.id) 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
                onClick={() => toggleSelection(resume.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selectedResumes.includes(resume.id) 
                      ? 'border-emerald-500 bg-emerald-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedResumes.includes(resume.id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{resume.subject}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{resume.from}</p>
                      </div>
                      <span className="text-xs text-gray-400">{resume.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <File className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {resume.attachments.join(', ')}
                      </span>
                    </div>
                    {resume.parsed && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="w-3 h-3" />
                        已解析
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="btn-gradient-outline">取消</button>
          <button 
            onClick={handleImport}
            disabled={selectedResumes.length === 0}
            className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
          >
            导入选中简历 ({selectedResumes.length})
          </button>
        </div>
      </div>
    </div>
  );
};

const CandidateCard = ({ candidate, onView, onEdit, onDelete }) => {
  const jobs = useStore((state) => state.jobs);
  const job = jobs.find(j => j.id === candidate.jobId);
  const StatusIcon = statusConfig[candidate.status]?.icon || Clock;
  
  return (
    <div className="card-hover group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-white">{candidate.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{candidate.name}</h3>
              <p className="text-sm text-gray-400">{job?.title || '未知职位'}</p>
            </div>
            <span className={`badge ${statusConfig[candidate.status]?.color}`}>
              {statusConfig[candidate.status]?.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {candidate.email}</span>
          <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {candidate.phone}</span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {candidate.experience}年经验</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {candidate.education}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-dark-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" style={{ width: `${candidate.matchScore}%` }} />
            </div>
            <span className="text-sm font-medium text-primary-400">{candidate.matchScore}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">AI匹配度</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, 3).map(skill => (
          <span key={skill} className="text-xs px-2 py-1 rounded-md bg-dark-300 text-gray-300">{skill}</span>
        ))}
        {candidate.skills.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-md bg-dark-300 text-gray-400">+{candidate.skills.length - 3}</span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">投递于 {candidate.appliedAt}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onView(candidate)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(candidate)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(candidate.id)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CandidateTableRow = ({ candidate, onView, onEdit, onDelete }) => {
  const jobs = useStore((state) => state.jobs);
  const job = jobs.find(j => j.id === candidate.jobId);
  
  return (
    <tr className="border-b border-dark-100 hover:bg-dark-200/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{candidate.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-white">{candidate.name}</p>
            <p className="text-xs text-gray-400">{candidate.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-white">{job?.title || '-'}</p>
      </td>
      <td className="py-4 px-4">
        <span className={`badge ${statusConfig[candidate.status]?.color}`}>
          {statusConfig[candidate.status]?.label}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-dark-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" style={{ width: `${candidate.matchScore}%` }} />
          </div>
          <span className="text-sm font-medium text-primary-400">{candidate.matchScore}%</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-gray-400">{candidate.experience}年</p>
      </td>
      <td className="py-4 px-4">
        <p className="text-gray-400 text-sm">{candidate.source}</p>
      </td>
      <td className="py-4 px-4">
        <p className="text-gray-400 text-sm">{candidate.appliedAt}</p>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => onView(candidate)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(candidate)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(candidate.id)} className="p-2 hover:bg-dark-100 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const CandidateDetail = ({ candidate, onClose }) => {
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

  const experienceData = [
    { range: '0-2年', count: 35 },
    { range: '3-5年', count: 48 },
    { range: '6-8年', count: 28 },
    { range: '9-10年', count: 15 },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-200 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
              <p className="text-gray-400">高级前端工程师 · {candidate.experience}年经验</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">基本信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300">
                    <Mail className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-xs text-gray-400">邮箱</p>
                      <p className="text-sm text-white">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300">
                    <Phone className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-xs text-gray-400">电话</p>
                      <p className="text-sm text-white">{candidate.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300">
                    <MapPin className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-xs text-gray-400">学历</p>
                      <p className="text-sm text-white">{candidate.education}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-300">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-xs text-gray-400">投递时间</p>
                      <p className="text-sm text-white">{candidate.appliedAt}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  技能分析
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="badge-primary">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">经验分布</h3>
                <div className="flex items-end justify-around h-40 gap-4">
                  {experienceData.map((item, index) => (
                    <div key={item.range} className="flex flex-col items-center gap-2">
                      <div className="w-12 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md" style={{ height: `${item.count * 2}px` }} />
                      <span className="text-xs text-gray-400">{item.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Radar Chart */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">技能雷达图</h3>
                <svg width="280" height="280" viewBox="0 0 280 280" className="mx-auto">
                  {[25, 50, 75, 100].map(pct => (
                    <circle key={pct} cx={cx} cy={cy} r={r * pct / 100} fill="none" stroke="#374151" strokeWidth="1" />
                  ))}
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const angle = i * 60;
                    const point = polarToCartesian(cx, cy, r, angle);
                    return <line key={i} x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#374151" strokeWidth="1" />;
                  })}
                  
                  <polygon
                    points={skillData.map((d, i) => {
                      const point = polarToCartesian(cx, cy, r * d.value / maxValue, i * 60);
                      return `${point.x},${point.y}`;
                    }).join(' ')}
                    fill="rgba(99, 102, 241, 0.3)"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  
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
                    <span className="text-sm text-gray-400">候选人</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">匹配度评估</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">技能匹配</span>
                      <span className="text-sm font-medium text-primary-400">92%</span>
                    </div>
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">经验匹配</span>
                      <span className="text-sm font-medium text-emerald-400">88%</span>
                    </div>
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">文化匹配</span>
                      <span className="text-sm font-medium text-purple-400">85%</span>
                    </div>
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-dark-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">综合评分</span>
                      <span className="text-2xl font-bold text-white">{candidate.matchScore}%</span>
                    </div>
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

const UploadModal = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  }, [files]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(files);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-200 rounded-2xl w-full max-w-xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">上传简历</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-dark-100 hover:border-primary-500/50'}`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-400' : 'text-gray-400'}`} />
            <p className="text-white mb-2">拖拽简历文件到此处</p>
            <p className="text-sm text-gray-400 mb-4">支持 PDF、Word、图片格式，单个文件不超过10MB</p>
            <label className="btn-gradient-outline cursor-pointer inline-block">
              选择文件
              <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dark-300">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className="text-sm text-white">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="p-1 hover:bg-dark-100 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-dark-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-gradient-outline">取消</button>
          <button onClick={handleUpload} className="btn-gradient" disabled={files.length === 0}>上传并解析</button>
        </div>
      </div>
    </div>
  );
};

const Candidates = () => {
  const navigate = useNavigate();
  const candidates = useStore((state) => state.candidates);
  const deleteCandidate = useStore((state) => state.deleteCandidate);
  const jobs = useStore((state) => state.jobs);

  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showEmailResumes, setShowEmailResumes] = useState(false);
  
  const isEmailConnected = !!localStorage.getItem('resumeEmail');

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    if (confirm('确定要删除这个候选人吗？')) {
      deleteCandidate(id);
    }
  };

  const statusCounts = {
    screening: candidates.filter(c => c.status === 'screening').length,
    interview: candidates.filter(c => c.status === 'interview').length,
    offer: candidates.filter(c => c.status === 'offer').length,
    hired: candidates.filter(c => c.status === 'hired').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">候选人管理</h1>
          <p className="text-gray-400 mt-1">管理所有候选人信息，查看简历和匹配度</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/settings')} 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium ${
              isEmailConnected 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            {isEmailConnected ? <CheckCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            {isEmailConnected ? '邮箱已连接' : '关联邮箱'}
            <ExternalLink className="w-4 h-4" />
          </button>
          {isEmailConnected && (
            <button 
              onClick={() => setShowEmailResumes(true)} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium"
            >
              <Inbox className="w-5 h-5" />
              邮箱简历
            </button>
          )}
          <button onClick={() => setShowUpload(true)} className="btn-gradient-outline flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传简历
          </button>
          <button className="btn-gradient flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加候选人
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button key={status} onClick={() => setStatusFilter(status === 'screening' && statusFilter === status ? 'all' : status)} className={`card text-center transition-all ${statusFilter === status ? 'ring-2 ring-primary-500' : ''}`}>
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className={`text-sm ${statusFilter === status ? 'text-primary-400' : 'text-gray-400'}`}>{statusConfig[status]?.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-dark-300 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索候选人姓名或邮箱..." className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>
              全部
            </button>
            {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => (
              <button key={key} onClick={() => setStatusFilter(key)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === key ? 'bg-primary-500 text-white' : 'bg-dark-300 text-gray-400 hover:text-white'}`}>
                {config.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-dark-300 rounded-lg p-1">
            <button onClick={() => setViewMode('card')} className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredCandidates.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CandidateCard candidate={candidate} onView={(c) => setViewingCandidate(c)} onDelete={handleDelete} onEdit={() => {}} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">候选人</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">应聘职位</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">匹配度</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">经验</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">来源</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">投递时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <CandidateTableRow key={candidate.id} candidate={candidate} onView={(c) => setViewingCandidate(c)} onDelete={handleDelete} onEdit={() => {}} />
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="card text-center py-12">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">未找到符合条件的候选人</p>
        </div>
      )}

      {viewingCandidate && <CandidateDetail candidate={viewingCandidate} onClose={() => setViewingCandidate(null)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={(files) => console.log('Uploaded:', files)} />}
      {showEmailSettings && <EmailSettingsModal onClose={() => setShowEmailSettings(false)} />}
      {showEmailResumes && <EmailResumesModal onClose={() => setShowEmailResumes(false)} />}
    </div>
  );
};

export default Candidates;
