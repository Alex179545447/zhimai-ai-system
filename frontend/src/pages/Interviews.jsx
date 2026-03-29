import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, Phone, MapPin, Plus, ChevronLeft, ChevronRight,
  User, FileText, Check, X, PhoneCall, Bell, MoreVertical, XCircle, Eye,
  Brain, Sparkles, TrendingUp, Users, Settings, Edit2, Trash2, Shuffle, Loader2, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

// 面试问题配置弹窗
const QuestionConfigModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // 问题类别配置
  const [categories, setCategories] = useState([
    { id: 'tech', name: '技术能力', icon: '💻', color: 'from-blue-500 to-blue-600', essential: true },
    { id: 'experience', name: '项目经验', icon: '📁', color: 'from-purple-500 to-purple-600', essential: true },
    { id: 'communication', name: '沟通表达', icon: '💬', color: 'from-emerald-500 to-emerald-600', essential: false },
    { id: 'teamwork', name: '团队协作', icon: '👥', color: 'from-amber-500 to-amber-600', essential: false },
    { id: 'problem', name: '问题解决', icon: '🧩', color: 'from-rose-500 to-rose-600', essential: false },
    { id: 'career', name: '职业规划', icon: '🎯', color: 'from-cyan-500 to-cyan-600', essential: false },
    { id: 'culture', name: '文化匹配', icon: '🌟', color: 'from-pink-500 to-pink-600', essential: false },
    { id: 'salary', name: '薪资期望', icon: '💰', color: 'from-indigo-500 to-indigo-600', essential: false },
  ]);

  // 问题模板配置
  const [questionTemplates, setQuestionTemplates] = useState({
    tech: [
      { id: 't1', template: '请介绍一下你最擅长的{skill}技术栈，以及在项目中如何应用的？', enabled: true },
      { id: 't2', template: '遇到过哪些{skill}相关的技术难题？你是如何解决的？', enabled: true },
      { id: 't3', template: '对比一下{skill}和{alternative}，你会如何选择？', enabled: false },
    ],
    experience: [
      { id: 'e1', template: '请描述一个让你最有成就感的{projectType}项目，你在其中的角色是什么？', enabled: true },
      { id: 'e2', template: '在项目开发中遇到过最大的挑战是什么？你是如何克服的？', enabled: true },
      { id: 'e3', template: '你觉得做{projectType}项目最重要的能力是什么？', enabled: false },
    ],
    communication: [
      { id: 'c1', template: '如何向非技术人员解释复杂的技术问题？请举例说明', enabled: true },
      { id: 'c2', template: '当和同事出现技术方案分歧时，你会如何处理？', enabled: false },
    ],
    teamwork: [
      { id: 'tw1', template: '在团队中你通常扮演什么角色？如何与团队成员配合？', enabled: true },
      { id: 'tw2', template: '如何处理团队中表现不佳的成员？', enabled: false },
    ],
    problem: [
      { id: 'p1', template: '面对复杂问题时，你的分析思路和解决步骤是什么？', enabled: true },
      { id: 'p2', template: '请描述一次你需要在有限时间内做出关键决策的经历', enabled: false },
    ],
    career: [
      { id: 'ca1', template: '你为什么对这个{position}岗位感兴趣？', enabled: true },
      { id: 'ca2', template: '未来3-5年，你的职业发展规划是什么？', enabled: false },
    ],
    culture: [
      { id: 'cu1', template: '你期望的工作氛围是什么样的？', enabled: true },
      { id: 'cu2', template: '什么样的管理风格最能够激发你的工作热情？', enabled: false },
    ],
    salary: [
      { id: 's1', template: '你对薪资的期望范围是多少？目前薪资结构是怎样的？', enabled: true },
    ],
  });

  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCatForAdd, setSelectedCatForAdd] = useState('tech');
  const [isSaving, setIsSaving] = useState(false);

  // 随机生成问题（模拟AI生成）
  const generateRandomQuestion = (template) => {
    const question = template
      .replace('{skill}', 'React/Vue')
      .replace('{alternative}', 'Angular')
      .replace('{projectType}', '电商/社交/企业级')
      .replace('{position}', '前端工程师');
    return question;
  };

  const handleToggleQuestion = (catId, qId) => {
    setQuestionTemplates(prev => ({
      ...prev,
      [catId]: prev[catId].map(q => 
        q.id === qId ? { ...q, enabled: !q.enabled } : q
      )
    }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestionTemplates(prev => ({
      ...prev,
      [selectedCatForAdd]: [
        ...prev[selectedCatForAdd],
        { id: `custom_${Date.now()}`, template: newQuestion, enabled: true, custom: true }
      ]
    }));
    setNewQuestion('');
  };

  const handleDeleteQuestion = (catId, qId) => {
    setQuestionTemplates(prev => ({
      ...prev,
      [catId]: prev[catId].filter(q => q.id !== qId)
    }));
  };

  const handleToggleEssential = (catId) => {
    setCategories(prev => prev.map(c => 
      c.id === catId ? { ...c, essential: !c.essential } : c
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('面试问题配置已保存！');
      onClose();
    }, 1000);
  };

  const getEnabledCount = (catId) => {
    return questionTemplates[catId]?.filter(q => q.enabled).length || 0;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">面试问题配置</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">自定义AI面试问题，随机生成问法</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'categories' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            问题类别
            {activeTab === 'categories' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'templates' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            问题模板
            {activeTab === 'templates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'preview' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            预览生成
            {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                选择面试考察的类别，必选项会始终包含在AI面试中，可选项可选择启用
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => handleToggleEssential(cat.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      cat.essential 
                        ? `border-blue-500 bg-gradient-to-br ${cat.color} text-white shadow-lg` 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{cat.icon}</span>
                      {cat.essential ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <p className={`font-medium ${cat.essential ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {cat.name}
                    </p>
                    <p className={`text-xs mt-1 ${cat.essential ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      {getEnabledCount(cat.id)}个问题
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* 添加新问题 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <select 
                    value={selectedCatForAdd}
                    onChange={e => setSelectedCatForAdd(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">类别</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    placeholder="输入自定义问题模板，使用{变量}定义占位符..."
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                  />
                  <button 
                    onClick={handleAddQuestion}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    添加
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  可用占位符: {"{skill}"} {"{projectType}"} {"{position}"} 等，AI会随机替换
                </p>
              </div>

              {/* 问题模板列表 */}
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className={`px-4 py-3 bg-gradient-to-r ${cat.color} text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                          {cat.essential && (
                            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">必选项</span>
                          )}
                        </div>
                        <span className="text-sm">{getEnabledCount(cat.id)}/{questionTemplates[cat.id]?.length || 0}</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                      {questionTemplates[cat.id]?.map((q) => (
                        <div key={q.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <button 
                            onClick={() => handleToggleQuestion(cat.id, q.id)}
                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              q.enabled 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {q.enabled && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${q.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                              {q.template}
                            </p>
                            {q.custom && (
                              <span className="text-xs text-blue-500">自定义</span>
                            )}
                          </div>
                          {q.custom && (
                            <button 
                              onClick={() => handleDeleteQuestion(cat.id, q.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                点击下方按钮，预览AI随机生成的面试问题
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 font-medium">
                <Shuffle className="w-5 h-5" />
                随机生成5道面试题
              </button>
              <div className="space-y-3">
                {['自我介绍与背景', '技术能力考察 - React应用', '项目经验分享', '问题解决能力', '薪资期望沟通'].map((q, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{q}</p>
                        <p className="text-xs text-gray-400 mt-1">随机生成 · 每次不同</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">AI智能生成原理</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      系统会根据你配置的问题模板和类别，结合候选人的简历信息，随机组合生成不同的问法。
                      相同的问题会以不同方式表达，确保面试的自然流畅。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                保存配置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showQuestionConfig, setShowQuestionConfig] = useState(false);

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
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowQuestionConfig(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            问题配置
          </button>
          <button className="btn-gradient flex items-center gap-2">
            <Plus className="w-5 h-5" />
            安排面试
          </button>
        </div>
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
      
      {/* 问题配置弹窗 */}
      {showQuestionConfig && <QuestionConfigModal onClose={() => setShowQuestionConfig(false)} />}
    </div>
  );
};

export default Interviews;
