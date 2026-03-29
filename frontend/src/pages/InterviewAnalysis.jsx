import React, { useState } from 'react';
import { FileSearch, ThumbsUp, TrendingUp, MessageSquare, Brain, ChevronRight, Clock, Minus, XCircle, Calendar, Sparkles, Target, TrendingDown, CheckCircle, X, User, CalendarCheck, AlertCircle, ArrowRight, FileText, Mail, Phone, MapPin, Briefcase, GraduationCap, Clock as ClockIcon, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 面试分析详情弹窗 - 全屏左右分布
const AnalysisDetailModal = ({ candidate, onClose, onScheduleReinterview, onReject, onHire }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 模拟的面试问答数据
  const interviewData = {
    qaRecords: [
      { question: '请做一个简短的自我介绍', answer: '我叫张明，有5年前端开发经验，目前在一家互联网公司担任高级前端工程师，曾主导过多个大型项目...', score: 88, analysis: '表达清晰，语言组织能力强' },
      { question: '您在前端开发中最擅长的技术栈是什么？', answer: '我最擅长React技术栈，包括React18、TypeScript、Redux等，对Vue也有项目经验...', score: 92, analysis: '技术深度较好，回答有条理' },
      { question: '请描述一个您解决过的技术挑战', answer: '我曾经优化过一个大型后台系统的打包速度，从30分钟降低到5分钟，通过代码分割、懒加载等方案...', score: 85, analysis: '有实际解决问题的经验' },
      { question: '您对React和Vue有什么看法？', answer: '两个框架各有优势，React更灵活，Vue更易上手。我个人更倾向于React，因为它生态更丰富...', score: 80, analysis: '对框架有独立思考' },
      { question: '您未来的职业规划是什么？', answer: '我希望在前端领域深耕，未来2-3年成为技术专家或技术管理者...', score: 78, analysis: '职业规划清晰但不够具体' },
    ],
    competencyAnalysis: [
      { name: '技术能力', jobRequirement: 85, candidateScore: 88, status: 'exceed', comment: '超出岗位要求' },
      { name: '项目经验', jobRequirement: 80, candidateScore: 82, status: 'exceed', comment: '略高于要求' },
      { name: '沟通表达', jobRequirement: 75, candidateScore: 80, status: 'exceed', comment: '表达清晰有条理' },
      { name: '团队协作', jobRequirement: 80, candidateScore: 85, status: 'exceed', comment: '有良好的协作意识' },
      { name: '学习能力', jobRequirement: 75, candidateScore: 78, status: 'good', comment: '能快速学习新技术' },
      { name: '文化匹配', jobRequirement: 70, candidateScore: 88, status: 'exceed', comment: '与公司文化高度契合' },
    ],
    aiDecision: {
      overallScore: 87,
      decision: '推荐进入复试',
      decisionLevel: 'positive',
      reasons: [
        '技术能力超出岗位要求，能快速胜任工作',
        '沟通表达能力良好，面试表现自信',
        '职业规划与公司发展方向一致',
        '文化匹配度高，有团队协作经验'
      ],
      risks: [
        '薪资期望略高于岗位范围'
      ],
      suggestions: [
        '建议安排技术复试，深入考察架构能力',
        '可考虑根据能力适当提高薪资待遇'
      ]
    }
  };

  // 候选人完整简历信息
  const resumeInfo = {
    basicInfo: {
      name: candidate.name,
      gender: '男',
      age: '28岁',
      phone: '138****1234',
      email: 'zhangming@email.com',
      location: '北京市朝阳区',
      education: '硕士 - 清华大学',
      experience: '5年',
      currentCompany: '字节跳动',
      currentPosition: '高级前端工程师',
      expectedSalary: '45K-55K'
    },
    skills: ['React', 'Vue', 'TypeScript', 'Node.js', 'Webpack', 'GraphQL', 'CSS3', 'Git'],
    workExperience: [
      { company: '字节跳动', position: '高级前端工程师', period: '2021-至今', description: '负责公司核心业务前端架构设计与开发，带领团队完成多个重要项目' },
      { company: '阿里巴巴', position: '前端开发工程师', period: '2019-2021', description: '参与电商平台前端开发，负责页面性能优化' },
      { company: '腾讯', position: 'Web前端实习生', period: '2018-2019', description: '参与小程序开发，积累前端开发经验' }
    ],
    education: [
      { school: '清华大学', major: '计算机科学与技术', degree: '硕士', period: '2017-2019' },
      { school: '北京航空航天大学', major: '软件工程', degree: '学士', period: '2013-2017' }
    ],
    projects: [
      { name: '企业级中台系统', role: '技术负责人', description: '基于React+TypeScript构建的企业级中台系统，服务10000+用户' },
      { name: '移动端性能优化', role: '核心开发者', description: '优化首屏加载时间从8s降至2s，提升用户体验' }
    ],
    selfEvaluation: '热爱技术，关注前端新技术发展，有良好的代码规范意识和团队协作能力。'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'exceed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'ok': return <Minus className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`fixed inset-0 bg-gray-900 z-50 flex flex-col ${isFullscreen ? '' : 'p-4'}`} onClick={onClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up ${isFullscreen ? 'flex-1' : 'max-h-[95vh]'}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{candidate.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  candidate.recommendation === '强烈推荐' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300' :
                  candidate.recommendation === '推荐' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-300' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300'
                }`}>
                  {candidate.recommendation}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{candidate.jobTitle} · 综合评分: {candidate.score}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-gray-500" /> : <Maximize2 className="w-5 h-5 text-gray-500" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Content - 左右分布 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧 - 完整简历 */}
          <div className="w-1/2 border-r border-gray-100 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-900">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                候选人完整简历
              </h3>
              
              {/* 基本信息 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{candidate.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{resumeInfo.basicInfo.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{resumeInfo.basicInfo.currentPosition}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4" /> {resumeInfo.basicInfo.gender} · {resumeInfo.basicInfo.age}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4" /> {resumeInfo.basicInfo.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4" /> {resumeInfo.basicInfo.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4" /> {resumeInfo.basicInfo.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4" /> {resumeInfo.basicInfo.education}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Briefcase className="w-4 h-4" /> {resumeInfo.basicInfo.experience}经验
                  </div>
                </div>
              </div>

              {/* 技能标签 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">专业技能</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeInfo.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>

              {/* 工作经历 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">工作经历</h4>
                <div className="space-y-3">
                  {resumeInfo.workExperience.map((exp, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">{exp.company}</p>
                        <span className="text-xs text-gray-400">{exp.period}</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{exp.position}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 教育经历 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">教育经历</h4>
                <div className="space-y-2">
                  {resumeInfo.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{edu.school}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{edu.major} · {edu.degree}</p>
                      </div>
                      <span className="text-xs text-gray-400">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 项目经历 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">项目经历</h4>
                <div className="space-y-3">
                  {resumeInfo.projects.map((proj, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">{proj.name}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{proj.role}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 自我评价 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">自我评价</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  {resumeInfo.selfEvaluation}
                </p>
              </div>
            </div>
          </div>

          {/* 右侧 - AI分析 */}
          <div className="w-1/2 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <div className="p-6 space-y-6">
              {/* AI决策 */}
              <div className={`rounded-xl p-5 border ${
                interviewData.aiDecision.decisionLevel === 'positive' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                  : 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    interviewData.aiDecision.decisionLevel === 'positive' ? 'bg-emerald-500' : 'bg-yellow-500'
                  }`}>
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{interviewData.aiDecision.decision}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">综合评分: {interviewData.aiDecision.overallScore}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">推荐理由</p>
                    <ul className="space-y-1">
                      {interviewData.aiDecision.reasons.map((reason, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {interviewData.aiDecision.risks.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">潜在风险</p>
                      <ul className="space-y-1">
                        {interviewData.aiDecision.risks.map((risk, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* 胜任力模型分析 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  胜任力模型分析
                </h3>
                <div className="space-y-4">
                  {interviewData.competencyAnalysis.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.comment}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>岗位要求</span>
                            <span>{item.jobRequirement}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${item.jobRequirement}%` }} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>候选人得分</span>
                            <span className={item.candidateScore >= item.jobRequirement ? 'text-emerald-500' : 'text-red-500'}>{item.candidateScore}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.candidateScore >= item.jobRequirement ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${item.candidateScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI问答记录 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  AI面试问答记录
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {interviewData.qaRecords.map((qa, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{qa.question}</p>
                          <p className="text-xs text-blue-500 mt-1">AI评分: {qa.score}%</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-200">{qa.answer}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">"{qa.analysis}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => onScheduleReinterview(candidate)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg"
                >
                  <CalendarCheck className="w-5 h-5" />
                  安排复试
                </button>
                <button 
                  onClick={() => onHire(candidate)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  <User className="w-5 h-5" />
                  直接入职
                </button>
                <button 
                  onClick={() => onReject(candidate)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                  淘汰
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const handleScheduleReinterview = (candidate) => {
    alert(`正在为 ${candidate.name} 安排复试...`);
    setSelectedCandidate(null);
    navigate('/onboarding');
  };

  const handleHire = (candidate) => {
    alert(`${candidate.name} 已进入入职流程`);
    setSelectedCandidate(null);
    navigate('/onboarding');
  };

  const handleReject = (candidate) => {
    if (confirm(`确定要淘汰 ${candidate.name} 吗？`)) {
      alert(`${candidate.name} 已标记为淘汰`);
      setSelectedCandidate(null);
    }
  };

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

      {/* 详情弹窗 */}
      {selectedCandidate && (
        <AnalysisDetailModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)}
          onScheduleReinterview={handleScheduleReinterview}
          onReject={handleReject}
          onHire={handleHire}
        />
      )}
    </div>
  );
};

export default InterviewAnalysis;
