import React, { useState } from 'react';
import { 
  Settings, Building, Sliders, Phone, FileText, Bell, Shield,
  Save, Plus, Trash2, Edit2, Check, X, Globe, Users
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: '公司信息', icon: Building },
    { id: 'templates', label: '职位模板', icon: FileText },
    { id: 'ai', label: 'AI匹配规则', icon: Sliders },
    { id: 'outbound', label: '外呼设置', icon: Phone },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="text-gray-400 mt-1">配置公司信息和系统参数</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeTab === tab.id ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'company' && <CompanySettings />}
      {activeTab === 'templates' && <TemplatesSettings />}
      {activeTab === 'ai' && <AISettings />}
      {activeTab === 'outbound' && <OutboundSettings />}
    </div>
  );
};

const CompanySettings = () => {
  const [formData, setFormData] = useState({
    name: '智脉AI科技有限公司',
    industry: '人工智能',
    size: '200-500人',
    website: 'www.zhimaiai.com',
    description: '专注于AI驱动的企业智能化解决方案',
    email: 'hr@zhimaiai.com',
    phone: '400-888-8888',
    address: '北京市海淀区中关村科技园',
  });

  return (
    <div className="card max-w-3xl">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Building className="w-5 h-5 text-primary-400" />
        公司信息配置
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">公司名称</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">所属行业</label>
            <select value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="select-field">
              <option value="人工智能">人工智能</option>
              <option value="互联网">互联网</option>
              <option value="金融科技">金融科技</option>
              <option value="电子商务">电子商务</option>
              <option value="企业服务">企业服务</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">公司规模</label>
            <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="select-field">
              <option value="50人以下">50人以下</option>
              <option value="50-200人">50-200人</option>
              <option value="200-500人">200-500人</option>
              <option value="500-1000人">500-1000人</option>
              <option value="1000人以上">1000人以上</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">官方网站</label>
            <input type="text" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">HR邮箱</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">联系电话</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">公司地址</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">公司简介</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div className="pt-4 border-t border-dark-100">
          <div className="flex items-center gap-4">
            <button className="btn-gradient flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存修改
            </button>
            <button className="btn-gradient-outline">取消</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplatesSettings = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: '技术岗位通用模板', category: '技术', skills: ['沟通能力', '技术学习', '问题解决'], status: 'active' },
    { id: 2, name: '产品经理模板', category: '产品', skills: ['需求分析', '项目管理', '数据分析'], status: 'active' },
    { id: 3, name: '设计师模板', category: '设计', skills: ['创意能力', '审美素养', '用户思维'], status: 'active' },
    { id: 4, name: '运营岗位模板', category: '运营', skills: ['数据分析', '活动策划', '用户运营'], status: 'inactive' },
  ]);

  return (
    <div className="space-y-6">
      <div className="card max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-400" />
            职位模板管理
          </h2>
          <button className="btn-gradient flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建模板
          </button>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="p-4 rounded-lg bg-dark-300 hover:bg-dark-100 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-medium">{template.name}</h3>
                    <span className={`badge ${template.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {template.status === 'active' ? '启用' : '停用'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">分类: {template.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-dark-200 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-dark-200 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {template.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-dark-200 text-gray-400">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card max-w-3xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary-400" />
          新建模板
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">模板名称</label>
              <input type="text" placeholder="输入模板名称" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">模板分类</label>
              <select className="select-field">
                <option value="">选择分类</option>
                <option value="技术">技术</option>
                <option value="产品">产品</option>
                <option value="设计">设计</option>
                <option value="运营">运营</option>
                <option value="市场">市场</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">核心技能</label>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="badge-primary">沟通能力 <X className="w-3 h-3 inline ml-1 cursor-pointer" /></span>
              <span className="badge-primary">技术学习 <X className="w-3 h-3 inline ml-1 cursor-pointer" /></span>
            </div>
            <input type="text" placeholder="输入技能并按回车添加" className="input-field" />
          </div>
          <button className="btn-gradient">创建模板</button>
        </div>
      </div>
    </div>
  );
};

const AISettings = () => {
  const [weights, setWeights] = useState({
    skill: 40,
    experience: 30,
    culture: 20,
    growth: 10,
  });

  return (
    <div className="card max-w-3xl">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-primary-400" />
        AI匹配规则配置
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-4">匹配维度权重</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">技能匹配权重</span>
                <span className="text-primary-400 font-medium">{weights.skill}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.skill}
                onChange={(e) => setWeights({...weights, skill: parseInt(e.target.value)})}
                className="w-full accent-primary-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">经验匹配权重</span>
                <span className="text-emerald-400 font-medium">{weights.experience}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.experience}
                onChange={(e) => setWeights({...weights, experience: parseInt(e.target.value)})}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">文化匹配权重</span>
                <span className="text-purple-400 font-medium">{weights.culture}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.culture}
                onChange={(e) => setWeights({...weights, culture: parseInt(e.target.value)})}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">成长潜力权重</span>
                <span className="text-yellow-400 font-medium">{weights.growth}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weights.growth}
                onChange={(e) => setWeights({...weights, growth: parseInt(e.target.value)})}
                className="w-full accent-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-100">
          <h3 className="text-sm font-medium text-gray-300 mb-4">匹配阈值</h3>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              defaultValue={75}
              min="0"
              max="100"
              className="input-field w-32"
            />
            <span className="text-gray-400">%</span>
            <span className="text-sm text-gray-500">匹配度高于此值的候选人将被标记为高匹配</span>
          </div>
        </div>

        <div className="pt-6 border-t border-dark-100">
          <div className="flex items-center gap-4">
            <button className="btn-gradient flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存配置
            </button>
            <button className="btn-gradient-outline">重置默认</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OutboundSettings = () => {
  const [settings, setSettings] = useState({
    provider: '腾讯云呼叫中心',
    maxDaily: 100,
    workingHours: '09:00-18:00',
    autoRetry: true,
    retryTimes: 3,
    voiceMail: true,
  });

  return (
    <div className="card max-w-3xl">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Phone className="w-5 h-5 text-primary-400" />
        外呼设置
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">外呼服务商</label>
            <select value={settings.provider} onChange={(e) => setSettings({...settings, provider: e.target.value})} className="select-field">
              <option value="腾讯云呼叫中心">腾讯云呼叫中心</option>
              <option value="阿里云呼叫中心">阿里云呼叫中心</option>
              <option value="容联云">容联云</option>
              <option value="自建系统">自建系统</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">每日最大外呼量</label>
            <input type="number" value={settings.maxDaily} onChange={(e) => setSettings({...settings, maxDaily: parseInt(e.target.value)})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">工作时间</label>
            <input type="text" value={settings.workingHours} onChange={(e) => setSettings({...settings, workingHours: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">自动重试次数</label>
            <input type="number" value={settings.retryTimes} onChange={(e) => setSettings({...settings, retryTimes: parseInt(e.target.value)})} className="input-field" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.autoRetry}
              onChange={(e) => setSettings({...settings, autoRetry: e.target.checked})}
              className="w-5 h-5 rounded border-gray-600 bg-dark-300 accent-primary-500"
            />
            <div>
              <span className="text-gray-200">未接听自动重试</span>
              <p className="text-xs text-gray-500">当候选人未接听时，系统将在设定时间后自动重试</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.voiceMail}
              onChange={(e) => setSettings({...settings, voiceMail: e.target.checked})}
              className="w-5 h-5 rounded border-gray-600 bg-dark-300 accent-primary-500"
            />
            <div>
              <span className="text-gray-200">启用语音信箱</span>
              <p className="text-xs text-gray-500">当无法接通时，自动播放留言并记录</p>
            </div>
          </label>
        </div>

        <div className="pt-6 border-t border-dark-100">
          <div className="flex items-center gap-4">
            <button className="btn-gradient flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存设置
            </button>
            <button className="btn-gradient-outline">测试外呼</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
