import React, { useState, useMemo, useEffect } from 'react';
import { Brain, Search, Filter, TrendingUp, ChevronRight, Check, X, Star, Sparkles, Target, Zap, ChevronDown, XCircle, ArrowUpDown, Phone, Video, Calendar, Clock, User, Loader2, CheckCircle, Settings, Edit3, Trash2, Plus, MessageSquare, Layers, Shuffle, GripVertical, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

// 问题类别配置
const questionCategories = [
  { id: 'tech', name: '技术能力', icon: '💻', color: 'from-blue-500 to-cyan-500', description: '考察候选人的技术栈和编码能力' },
  { id: 'project', name: '项目经验', icon: '📁', color: 'from-purple-500 to-pink-500', description: '了解候选人过往项目经历' },
  { id: 'communication', name: '沟通表达', icon: '💬', color: 'from-emerald-500 to-teal-500', description: '评估候选人的表达和沟通能力' },
  { id: 'teamwork', name: '团队协作', icon: '👥', color: 'from-amber-500 to-orange-500', description: '考察团队合作和冲突处理' },
  { id: 'problem', name: '问题解决', icon: '🧩', color: 'from-red-500 to-rose-500', description: '评估分析和解决问题的能力' },
  { id: 'learning', name: '学习能力', icon: '📚', color: 'from-indigo-500 to-purple-500', description: '了解学习方法和成长潜力' },
  { id: 'career', name: '职业规划', icon: '🎯', color: 'from-cyan-500 to-blue-500', description: '探讨职业发展和价值观' },
  { id: 'culture', name: '文化匹配', icon: '🏢', color: 'from-pink-500 to-rose-500', description: '评估与公司文化的契合度' },
];

// 默认问题模板
const defaultQuestions = [
  // 技术能力
  { id: 1, category: 'tech', question: '请介绍一下您最擅长的技术栈，以及在项目中如何应用的？', required: true, weight: 1.2 },
  { id: 2, category: 'tech', question: '遇到技术难题时，您通常采用什么方式来解决？请举例说明', required: true, weight: 1.0 },
  { id: 3, category: 'tech', question: '能否描述一下您最近学习的一项新技术，以及是如何掌握的？', required: false, weight: 0.8 },
  { id: 4, category: 'tech', question: '在代码审查中，您更关注哪些方面？', required: false, weight: 0.7 },
  // 项目经验
  { id: 5, category: 'project', question: '请分享一个您参与过最有挑战性的项目，它解决了什么问题？', required: true, weight: 1.2 },
  { id: 6, category: 'project', question: '在项目中如果您和同事出现技术分歧，您会怎么处理？', required: true, weight: 1.0 },
  { id: 7, category: 'project', question: '您认为一个成功的项目最关键的因素是什么？', required: false, weight: 0.8 },
  { id: 8, category: 'project', question: '请介绍一下您在项目中承担的角色和主要贡献', required: true, weight: 1.0 },
  // 沟通表达
  { id: 9, category: 'communication', question: '如何向非技术人员解释一个复杂的技术概念？请示范一下', required: true, weight: 1.1 },
  { id: 10, category: 'communication', question: '您通常如何准备一次重要的演讲或汇报？', required: false, weight: 0.7 },
  { id: 11, category: 'communication', question: '如果客户的需求不明确，您会如何沟通确认？', required: true, weight: 1.0 },
  // 团队协作
  {id: 12, category: 'teamwork', question: '请描述一个您与团队成员紧密合作完成的任务', required: true, weight: 1.0 },
  { id: 13, category: 'teamwork', question: '如何处理团队中表现不佳的成员？', required: false, weight: 0.8 },
  { id: 14, category: 'teamwork', question: '您喜欢什么样的工作环境和管理风格？', required: true, weight: 1.0 },
  // 问题解决
  { id: 15, category: 'problem', question: '请分享一个您独立解决的复杂技术问题，过程是怎样的？', required: true, weight: 1.2 },
  { id: 16, category: 'problem', question: '如果项目进度落后，您会采取什么措施来追赶？', required: true, weight: 1.0 },
  { id: 17, category: 'problem', question: '面对一个完全陌生的技术领域，您会如何快速上手？', required: false, weight: 0.8 },
  // 学习能力
  { id: 18, category: 'learning', question: '您是通过什么方式保持技术更新的？', required: true, weight: 1.0 },
  { id: 19, category: 'learning', question: '能否分享一个您从失败中学到重要教训的经历？', required: false, weight: 0.7 },
  { id: 20, category: 'learning', question: '您认为自己还需要在哪些方面提升？有什么计划？', required: true, weight: 0.9 },
  // 职业规划
  { id: 21, category: 'career', question: '您为什么对我们公司这个职位感兴趣？', required: true, weight: 1.2 },
  { id: 22, category: 'career', question: '未来3-5年，您希望达到什么样的职业高度？', required: true, weight: 1.0 },
  { id: 23, category: 'career', question: '您对薪资有什么期望？有什么考量因素？', required: false, weight: 0.8 },
  // 文化匹配
  { id: 24, category: 'culture', question: '什么样的工作氛围能让您发挥最佳状态？', required: true, weight: 0.9 },
  { id: 25, category: 'culture', question: '您期望在入职后多久能够融入团队并产生价值？', required: false, weight: 0.7 },
];

// AI问题管理器组件
const QuestionManagerModal = ({ onClose }) => {
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('aiInterviewQuestions');
    return saved ? JSON.parse(saved) : defaultQuestions;
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: 'tech',
    question: '',
    required: true,
    weight: 1.0
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);

  // 保存到localStorage
  const saveQuestions = (updatedQuestions) => {
    localStorage.setItem('aiInterviewQuestions', JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);
  };

  // 添加问题
  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert('请输入问题内容');
      return;
    }
    const updated = [...questions, { ...newQuestion, id: Date.now() }];
    saveQuestions(updated);
    setNewQuestion({ category: 'tech', question: '', required: true, weight: 1.0 });
    setShowAddForm(false);
  };

  // 更新问题
  const handleUpdateQuestion = () => {
    if (!editingQuestion.question.trim()) {
      alert('请输入问题内容');
      return;
    }
    const updated = questions.map(q => q.id === editingQuestion.id ? editingQuestion : q);
    saveQuestions(updated);
    setEditingQuestion(null);
  };

  // 删除问题
  const handleDeleteQuestion = (id) => {
    if (confirm('确定要删除这个问题吗？')) {
      const updated = questions.filter(q => q.id !== id);
      saveQuestions(updated);
    }
  };

  // 切换必问状态
  const toggleRequired = (id) => {
    const updated = questions.map(q => 
      q.id === id ? { ...q, required: !q.required } : q
    );
    saveQuestions(updated);
  };

  // AI随机生成预览
  const generatePreview = (category) => {
    const categoryQuestions = questions.filter(q => 
      (selectedCategory === 'all' || q.category === selectedCategory) && 
      q.required
    );
    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    setPreviewQuestions(shuffled.slice(0, 5));
    setPreviewMode(true);
  };

  // 获取类别的颜色
  const getCategoryStyle = (catId) => {
    const cat = questionCategories.find(c => c.id === catId);
    return cat?.color || 'from-gray-500 to-gray-600';
  };

  // 获取类别的图标
  const getCategoryIcon = (catId) => {
    const cat = questionCategories.find(c => c.id === catId);
    return cat?.icon || '📝';
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI面试题库管理</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">管理面试问题，自定义考察重点</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">问题类别</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              全部 ({questions.length})
            </button>
            {questionCategories.map(cat => {
              const count = questions.filter(q => q.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewMode ? (
            // 预览模式
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-indigo-500" />
                  AI随机生成预览
                </h3>
                <button 
                  onClick={() => setPreviewMode(false)}
                  className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  返回编辑模式
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                以下是AI将从题库中随机选取的问题（每次面试会从各类别中随机抽取）：
              </p>
              {previewQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm px-2 py-0.5 rounded bg-gradient-to-r ${getCategoryStyle(q.category)} text-white`}>
                          {getCategoryIcon(q.category)} {questionCategories.find(c => c.id === q.category)?.name}
                        </span>
                        {q.required && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                            必问
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">{q.question}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => generatePreview()}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                重新随机生成
              </button>
            </div>
          ) : (
            // 编辑模式
            <div className="space-y-4">
              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => generatePreview()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2 font-medium"
                  >
                    <Shuffle className="w-4 h-4" />
                    AI预览生成
                  </button>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    添加问题
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  共 {filteredQuestions.length} 个问题，其中 {filteredQuestions.filter(q => q.required).length} 个必问
                </div>
              </div>

              {/* 添加表单 */}
              {showAddForm && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">添加新问题</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">问题类别</label>
                      <select 
                        value={newQuestion.category}
                        onChange={e => setNewQuestion({...newQuestion, category: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        {questionCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">问题内容</label>
                      <textarea
                        value={newQuestion.question}
                        onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                        placeholder="输入面试问题..."
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newQuestion.required}
                          onChange={e => setNewQuestion({...newQuestion, required: e.target.checked})}
                          className="w-4 h-4 rounded accent-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">设为必问题</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">权重:</span>
                        <select
                          value={newQuestion.weight}
                          onChange={e => setNewQuestion({...newQuestion, weight: parseFloat(e.target.value)})}
                          className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="0.8">0.8x</option>
                          <option value="1.0">1.0x</option>
                          <option value="1.2">1.2x</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 问题列表 */}
              {filteredQuestions.map(q => (
                <div key={q.id} className="p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all">
                  {editingQuestion?.id === q.id ? (
                    // 编辑模式
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">问题内容</label>
                        <textarea
                          value={editingQuestion.question}
                          onChange={e => setEditingQuestion({...editingQuestion, question: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingQuestion.required}
                            onChange={e => setEditingQuestion({...editingQuestion, required: e.target.checked})}
                            className="w-4 h-4 rounded accent-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">必问题</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">权重:</span>
                          <select
                            value={editingQuestion.weight}
                            onChange={e => setEditingQuestion({...editingQuestion, weight: parseFloat(e.target.value)})}
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                          >
                            <option value="0.5">0.5x</option>
                            <option value="0.8">0.8x</option>
                            <option value="1.0">1.0x</option>
                            <option value="1.2">1.2x</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingQuestion(null)}
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                        >
                          取消
                        </button>
                        <button 
                          onClick={handleUpdateQuestion}
                          className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                        >
                          保存修改
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 显示模式
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-1 cursor-grab flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-sm px-2 py-0.5 rounded bg-gradient-to-r ${getCategoryStyle(q.category)} text-white`}>
                            {getCategoryIcon(q.category)} {questionCategories.find(c => c.id === q.category)?.name}
                          </span>
                          {q.required && (
                            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-medium">
                              必问
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400">
                            权重: {q.weight}x
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white">{q.question}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button 
                          onClick={() => toggleRequired(q.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            q.required 
                              ? 'bg-red-100 dark:bg-red-500/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30' 
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                          }`}
                          title={q.required ? '取消必问' : '设为必问'}
                        >
                          {q.required ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setEditingQuestion(q)}
                          className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-500 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{questions.length}</span> 个问题 | 
            <span className="font-medium text-indigo-500"> {questions.filter(q => q.required).length}</span> 个必问
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (confirm('确定要恢复默认题库吗？当前修改将被覆盖。')) {
                  localStorage.removeItem('aiInterviewQuestions');
                  setQuestions(defaultQuestions);
                }
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              恢复默认
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              完成保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI外呼面试弹窗
const AIInterviewModal = ({ candidate, onClose, onStart }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interviewType: '初试',
    questionCount: 5,
    duration: 15,
    difficulty: '中等',
    focusAreas: ['技术能力', '项目经验', '沟通表达'],
    sendNotification: true
  });
  const [isStarting, setIsStarting] = useState(false);

  const focusOptions = ['技术能力', '项目经验', '沟通表达', '团队协作', '问题解决', '学习能力', '职业规划'];

  const handleStartInterview = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      onStart(candidate, formData);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">发起AI外呼面试</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">为 {candidate.name} 安排AI面试</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 候选人信息 */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">{candidate.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.jobTitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">{candidate.matchScore}%匹配</span>
                <span className="text-xs text-gray-400">{candidate.experience}年经验</span>
              </div>
            </div>
          </div>

          {/* 面试类型 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Video className="w-4 h-4 inline mr-1" />
              面试类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormData({...formData, interviewType: '初试'})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.interviewType === '初试' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <Brain className={`w-6 h-6 mx-auto mb-1 ${formData.interviewType === '初试' ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${formData.interviewType === '初试' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>AI初试</p>
                <p className="text-xs text-gray-400 mt-1">机器人自动面试</p>
              </button>
              <button
                onClick={() => setFormData({...formData, interviewType: '复试'})}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.interviewType === '复试' 
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                }`}
              >
                <User className={`w-6 h-6 mx-auto mb-1 ${formData.interviewType === '复试' ? 'text-amber-500' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${formData.interviewType === '复试' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}`}>人工复试</p>
                <p className="text-xs text-gray-400 mt-1">HR或部门面试</p>
              </button>
            </div>
          </div>

          {/* 问题数量和时长 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                问题数量
              </label>
              <select 
                value={formData.questionCount}
                onChange={e => setFormData({...formData, questionCount: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
              >
                <option value={3}>3道题</option>
                <option value={5}>5道题</option>
                <option value={8}>8道题</option>
                <option value={10}>10道题</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                面试时长
              </label>
              <select 
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
              >
                <option value={10}>10分钟</option>
                <option value={15}>15分钟</option>
                <option value={20}>20分钟</option>
                <option value={30}>30分钟</option>
              </select>
            </div>
          </div>

          {/* 考察重点 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              考察重点（可多选）
            </label>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map(area => (
                <button
                  key={area}
                  onClick={() => {
                    const newAreas = formData.focusAreas.includes(area)
                      ? formData.focusAreas.filter(a => a !== area)
                      : [...formData.focusAreas, area];
                    setFormData({...formData, focusAreas: newAreas});
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    formData.focusAreas.includes(area)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* 通知候选人 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">发送面试通知</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">通过短信/邮件通知候选人</p>
              </div>
            </div>
            <button
              onClick={() => setFormData({...formData, sendNotification: !formData.sendNotification})}
              className={`relative w-12 h-6 rounded-full transition-colors ${formData.sendNotification ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.sendNotification ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            取消
          </button>
          <button 
            onClick={handleStartInterview}
            disabled={isStarting}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                启动中...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                启动AI面试
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

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
                  <button 
                    onClick={() => { onClose(); setShowAIModal(true); setInterviewCandidate(candidate); }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
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
  const location = useLocation();
  const jobs = useStore((state) => state.jobs);
  const candidates = useStore((state) => state.candidates);
  const updateCandidate = useStore((state) => state.updateCandidate);
  const addInterview = useStore((state) => state.addInterview);
  const addActivity = useStore((state) => state.addActivity);
  const [selectedJob, setSelectedJob] = useState('all');
  const [sortBy, setSortBy] = useState('matchScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  // Check if navigated from Candidates page with a candidate
  useEffect(() => {
    if (location.state?.candidate) {
      const candidate = location.state.candidate;
      // Find matching candidate in matchedCandidates or create one
      const matchedCandidate = matchedCandidates.find(c => c.name === candidate.name) || {
        id: candidate.id,
        name: candidate.name,
        jobTitle: candidate.jobTitle || jobs.find(j => j.id === candidate.jobId)?.title || '未知职位',
        matchScore: candidate.matchScore || 85,
        skillMatch: candidate.matchScore || 85,
        expMatch: 80,
        cultureMatch: 85,
        experience: candidate.experience || 3,
        education: candidate.education || '本科',
        status: '待联系',
        salary: '面议'
      };
      setInterviewCandidate(matchedCandidate);
      setShowAIModal(true);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, jobs]);

  const handleStartAIInterview = (candidate, formData) => {
    // 1. 更新候选人状态为面试中
    updateCandidate(candidate.id, { status: 'interview' });
    
    // 2. 添加面试记录
    const newInterview = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobTitle: candidate.jobTitle,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: formData.interviewType === '初试' ? 'ai_initial' : 'ai_review',
      interviewType: formData.interviewType,
      status: 'in_progress',
      questionCount: formData.questionCount,
      duration: formData.duration,
      focusAreas: formData.focusAreas,
      questions: []
    };
    addInterview(newInterview);
    
    // 3. 添加活动记录
    addActivity({
      type: 'interview',
      content: `为 ${candidate.name} 启动了${formData.interviewType}，预计${formData.duration}分钟`,
      icon: 'phone'
    });
    
    // 4. 显示成功提示
    alert(`✅ AI面试已启动！\n\n候选人: ${candidate.name}\n面试类型: ${formData.interviewType}\n问题数量: ${formData.questionCount}道\n预计时长: ${formData.duration}分钟\n考察重点: ${formData.focusAreas.join(', ')}\n\n💡 AI将从题库中随机选取问题进行面试`);
  };

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
        <button 
          onClick={() => setShowQuestionManager(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/30 font-medium"
        >
          <Settings className="w-5 h-5" />
          题库管理
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

      {/* AI Interview Modal */}
      {showAIModal && interviewCandidate && (
        <AIInterviewModal
          candidate={interviewCandidate}
          onClose={() => { setShowAIModal(false); setInterviewCandidate(null); }}
          onStart={handleStartAIInterview}
        />
      )}

      {/* Question Manager Modal */}
      {showQuestionManager && (
        <QuestionManagerModal onClose={() => setShowQuestionManager(false)} />
      )}
    </div>
  );
};

export default AIMatch;
