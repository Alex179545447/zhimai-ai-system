import React, { useState, useEffect } from 'react';
import { 
  Settings, Building, Sliders, Phone, FileText, Bell, Shield,
  Save, Plus, Trash2, Edit2, Check, X, Globe, Users,
  Mail, RefreshCw, Loader2, AlertCircle, CheckCircle, Inbox,
  ExternalLink, Trash, Download, Eye, Zap, ChevronRight, Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('email');

  const tabs = [
    { id: 'email', label: '邮箱设置', icon: Mail },
    { id: 'company', label: '公司信息', icon: Building },
    { id: 'templates', label: '职位模板', icon: FileText },
    { id: 'ai', label: 'AI匹配规则', icon: Sliders },
    { id: 'outbound', label: '外呼设置', icon: Phone },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">配置公司信息和系统参数</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-800 rounded-t-xl px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeTab === tab.id 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'email' && <EmailSettings />}
      {activeTab === 'company' && <CompanySettings />}
      {activeTab === 'templates' && <TemplatesSettings />}
      {activeTab === 'ai' && <AISettings />}
      {activeTab === 'outbound' && <OutboundSettings />}
    </div>
  );
};

// 邮箱设置组件
const EmailSettings = () => {
  const navigate = useNavigate();
  const [emailConfig, setEmailConfig] = useState({
    provider: 'custom',
    email: localStorage.getItem('resumeEmail') || '',
    password: '',
    server: '',
    port: '993',
    useSSL: true,
    syncInterval: '30',
    autoParse: true,
    filterKeywords: '简历,CV,resume,应聘,求职',
  });
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('resumeEmail'));
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncedResumes, setSyncedResumes] = useState([]);

  // 邮箱提供商配置
  const emailProviders = [
    { 
      id: 'custom', 
      name: '自定义邮箱服务器', 
      icon: Server,
      description: '支持公司自建邮箱服务器',
      fields: ['server', 'port']
    },
    { 
      id: 'gmail', 
      name: 'Gmail (谷歌邮箱)', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>,
      server: 'imap.gmail.com',
      port: '993'
    },
    { 
      id: 'qq', 
      name: 'QQ邮箱', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#12B7F5" d="M10.28 17.12c-1.54-.23-2.91-.84-4.05-1.77-.8-.64-1.44-1.45-1.94-2.38-.1-.17-.18-.35-.26-.53-.08-.18-.16-.36-.25-.54-.09-.18-.18-.36-.28-.53-.1-.18-.2-.35-.31-.52-.11-.17-.23-.34-.35-.5-.12-.16-.25-.32-.39-.47-.14-.15-.28-.3-.44-.44-.15-.14-.31-.27-.48-.4-.17-.12-.34-.24-.52-.35-.18-.11-.36-.21-.55-.3-.19-.09-.38-.17-.58-.24-.2-.07-.4-.13-.61-.18-.21-.05-.42-.09-.64-.12-.22-.03-.44-.05-.66-.06-.22-.01-.44-.01-.66 0-.22.01-.43.03-.64.06-.21.03-.42.07-.62.12-.2.05-.4.11-.59.18-.19.07-.38.15-.56.24-.18.09-.36.19-.53.3-.17.11-.34.23-.5.35-.16.13-.32.26-.47.4-.15.14-.29.28-.42.43-.13.15-.26.31-.38.47-.12.16-.23.33-.34.5-.11.17-.21.35-.3.53-.09.18-.18.36-.26.54-.08.18-.16.36-.25.54-.09.18-.17.35-.25.53-.5.93-.94 1.73-1.3 2.37-1.14.93-2.51 1.54-4.05 1.77C.5 17.5 0 14.25 0 12c0-.53.07-1.07.2-1.6.14-.53.33-1.04.6-1.53.26-.49.58-.95.96-1.37.38-.42.81-.8 1.29-1.13.48-.33 1-.6 1.58-.81C5.27 5.17 6.23 4.5 7.3 4c1.07-.5 2.26-.82 3.5-.93 1.24-.11 2.54.03 3.8.4 1.26.37 2.45.97 3.5 1.73 1.05.76 1.92 1.67 2.56 2.68.64 1.01 1.07 2.13 1.24 3.3.17 1.17.13 2.39-.12 3.58-.25 1.19-.68 2.33-1.26 3.37-.58 1.04-1.32 1.98-2.18 2.77-.86.79-1.86 1.45-2.94 1.94-1.08.49-2.24.83-3.42 1.01v-.57z"/></svg>,
      server: 'imap.qq.com',
      port: '993'
    },
    { 
      id: '163', 
      name: '163邮箱 (网易)', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#C20C0C" d="M2 6.5L12 13l10-6.5v11L12 22 2 17.5V6.5z"/></svg>,
      server: 'imap.163.com',
      port: '993'
    },
    { 
      id: 'company', 
      name: '企业邮箱', 
      icon: Building,
      description: '支持腾讯企业邮箱、阿里企业邮箱等',
      fields: ['server', 'port']
    },
    { 
      id: 'feishu', 
      name: '飞书邮箱', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#147AFF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path fill="#147AFF" d="M8 12l4 4 4-4-4-4z"/></svg>,
      server: 'imap.feishu.cn',
      port: '993'
    },
    { 
      id: 'dingtalk', 
      name: '钉钉邮箱', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#1677FF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-.67-4.5-1.5V8h9v7c0 .83-2.01 1.5-4.5 1.5z"/></svg>,
      server: 'imap.dingtalk.com',
      port: '993'
    },
    { 
      id: 'outlook', 
      name: 'Outlook (微软)', 
      icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#0078D4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>,
      server: 'outlook.office365.com',
      port: '993'
    },
  ];

  const handleProviderChange = (providerId) => {
    const provider = emailProviders.find(p => p.id === providerId);
    setEmailConfig({
      ...emailConfig,
      provider: providerId,
      server: provider?.server || '',
      port: provider?.port || '993'
    });
  };

  const handleTest = async () => {
    if (!emailConfig.email || !emailConfig.password) {
      setTestResult({ success: false, message: '请填写邮箱和密码' });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    // 模拟测试连接
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({ success: true, message: '连接成功！已找到 3 份新简历' });
      setIsConnected(true);
      localStorage.setItem('resumeEmail', emailConfig.email);
    }, 2000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    // 模拟同步简历
    setTimeout(() => {
      const newResumes = [
        { id: 1, from: 'zhangsan@company.com', subject: '应聘前端工程师 - 张三', date: '2024-01-20', parsed: true, name: '张三', phone: '138****5678', email: 'zhangsan@company.com' },
        { id: 2, from: 'lisi@company.com', subject: '简历投递 - 李四', date: '2024-01-19', parsed: true, name: '李四', phone: '139****1234', email: 'lisi@company.com' },
        { id: 3, from: 'wangwu@company.com', subject: '求职申请 - 王五', date: '2024-01-18', parsed: false, name: '王五', phone: '137****9012', email: 'wangwu@company.com' },
      ];
      setSyncedResumes(newResumes);
      setIsSyncing(false);
    }, 3000);
  };

  const handleImportResume = (resume) => {
    alert(`简历 "${resume.name}" 已导入系统`);
    setSyncedResumes(syncedResumes.filter(r => r.id !== resume.id));
  };

  const handleDisconnect = () => {
    localStorage.removeItem('resumeEmail');
    localStorage.removeItem('emailPassword');
    setIsConnected(false);
    setEmailConfig({ ...emailConfig, email: '', password: '' });
    setSyncedResumes([]);
  };

  const selectedProvider = emailProviders.find(p => p.id === emailConfig.provider);

  return (
    <div className="space-y-6">
      {/* 连接状态卡片 */}
      {isConnected && (
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">邮箱已连接</h3>
                <p className="text-gray-600 dark:text-gray-400">{localStorage.getItem('resumeEmail')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isSyncing ? '同步中...' : '立即同步'}
              </button>
              <button 
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                断开连接
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 邮箱配置表单 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">简历邮箱配置</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">绑定邮箱后，系统将自动收取简历并解析</p>
          </div>
        </div>

        {/* 选择邮箱类型 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            选择邮箱服务商
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emailProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  emailConfig.provider === provider.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {typeof provider.icon === 'function' ? <provider.icon /> : <provider.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{provider.name}</span>
                </div>
                {provider.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{provider.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 邮箱配置 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                邮箱地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={emailConfig.email}
                onChange={(e) => setEmailConfig({...emailConfig, email: e.target.value})}
                placeholder="hr@company.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                密码/授权码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                placeholder={emailConfig.provider === 'gmail' ? '请使用应用专用密码' : '输入密码或授权码'}
                className="input-field"
              />
            </div>
          </div>

          {emailConfig.provider === 'custom' || emailConfig.provider === 'company' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  IMAP 服务器
                </label>
                <input
                  type="text"
                  value={emailConfig.server}
                  onChange={(e) => setEmailConfig({...emailConfig, server: e.target.value})}
                  placeholder="imap.company.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  端口
                </label>
                <input
                  type="text"
                  value={emailConfig.port}
                  onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
                  placeholder="993"
                  className="input-field"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>服务器: {emailConfig.server}</span>
                <span className="mx-2">|</span>
                <span>端口: {emailConfig.port}</span>
                <span className="mx-2">|</span>
                <span>SSL: 启用</span>
              </div>
            </div>
          )}

          {/* 高级设置 */}
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-blue-600 dark:text-blue-400 font-medium">
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              高级设置
            </summary>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    自动同步间隔
                  </label>
                  <select
                    value={emailConfig.syncInterval}
                    onChange={(e) => setEmailConfig({...emailConfig, syncInterval: e.target.value})}
                    className="select-field"
                  >
                    <option value="5">每 5 分钟</option>
                    <option value="15">每 15 分钟</option>
                    <option value="30">每 30 分钟</option>
                    <option value="60">每 1 小时</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    简历筛选关键词
                  </label>
                  <input
                    type="text"
                    value={emailConfig.filterKeywords}
                    onChange={(e) => setEmailConfig({...emailConfig, filterKeywords: e.target.value})}
                    placeholder="简历,CV,resume,应聘"
                    className="input-field"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailConfig.autoParse}
                  onChange={(e) => setEmailConfig({...emailConfig, autoParse: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 accent-blue-500"
                />
                <div>
                  <span className="text-gray-700 dark:text-gray-300">自动解析简历</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">收到邮件后自动解析附件中的简历内容</p>
                </div>
              </label>
            </div>
          </details>
        </div>

        {/* 测试结果 */}
        {testResult && (
          <div className={`mt-4 p-4 rounded-xl ${testResult.success ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30'}`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={testResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleTest}
            disabled={isTesting || isConnected}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg shadow-blue-500/30 font-medium disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                测试连接中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                测试连接
              </>
            )}
          </button>
          {!isConnected && (
            <button
              onClick={handleTest}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-medium"
            >
              <Check className="w-4 h-4" />
              保存并连接
            </button>
          )}
        </div>
      </div>

      {/* 同步简历列表 */}
      {syncedResumes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Inbox className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">待导入简历</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm">
                {syncedResumes.length}
              </span>
            </div>
            <button
              onClick={() => syncedResumes.forEach(r => handleImportResume(r))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              全部导入
            </button>
          </div>

          <div className="space-y-3">
            {syncedResumes.map((resume) => (
              <div key={resume.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{resume.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{resume.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{resume.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resume.parsed ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                        已解析
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                        待解析
                      </span>
                    )}
                    <button
                      onClick={() => handleImportResume(resume)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Download className="w-3 h-3" />
                      导入
                    </button>
                  </div>
                </div>
                {resume.parsed && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">姓名:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{resume.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">电话:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{resume.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">邮箱:</span>
                      <span className="ml-1 text-gray-900 dark:text-white">{resume.email}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          使用说明
        </h3>
        <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>请确保邮箱开启了 <strong>IMAP 服务</strong>，否则无法收取邮件</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Gmail 用户需要使用 <strong>应用专用密码</strong>，请前往 Google 账户设置生成</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>系统会自动筛选包含"简历"、"CV"、"resume"等关键词的邮件</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>自动解析支持 PDF、Word、图片格式的简历文件</span>
          </li>
        </ul>
      </div>
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
