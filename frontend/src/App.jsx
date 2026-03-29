import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Brain, Video, FileSearch, 
  UserCheck, Settings, Menu, X, Bell, Search, Phone, LogOut,
  Moon, Sun, UserCog, RefreshCw
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import AIMatch from './pages/AIMatch';
import Interviews from './pages/Interviews';
import InterviewAnalysis from './pages/InterviewAnalysis';
import Onboarding from './pages/Onboarding';
import SettingsPage from './pages/Settings';
import CallRecords from './pages/CallRecords';
import Login from './pages/Login';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '仪表盘' },
    { path: '/jobs', icon: Briefcase, label: '职位管理' },
    { path: '/candidates', icon: Users, label: '候选人' },
    { path: '/ai-match', icon: Brain, label: 'AI匹配' },
    { path: '/interviews', icon: Video, label: '面试安排' },
    { path: '/call-records', icon: Phone, label: '外呼记录' },
    { path: '/interview-analysis', icon: FileSearch, label: '面试分析' },
    { path: '/onboarding', icon: UserCheck, label: '复试入职' },
    { path: '/settings', icon: Settings, label: '系统设置' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="智脉AI" className="w-10 h-10 rounded-lg object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">智脉AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">智能招聘系统</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`} onClick={() => setIsOpen(false)}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
          <div className="mt-2 text-xs text-gray-400 text-center">v1.0.0</div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    
    // 检查深色模式
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSwitchAccount = () => {
    setShowUserMenu(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleLogout = () => {
    setShowUserMenu(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const notifications = [
    { id: 1, title: '新简历投递', desc: '陈伟投递了后端工程师职位', time: '3小时前' },
    { id: 2, title: '面试提醒', desc: '张明的面试将在1小时后开始', time: '1小时前' },
    { id: 3, title: 'AI匹配完成', desc: '找到5位高匹配度候选人', time: '5小时前' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          {isOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2.5 w-72">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索候选人、职位..." className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl animate-slide-down z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">通知中心</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.desc}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* 用户头像菜单 */}
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)} 
            className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-2 py-1.5 transition-colors"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || '试用用户'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'trial' ? '试用账户' : '管理员'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold text-white">{(user?.name || '试').charAt(0)}</span>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl animate-slide-down z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || '试用用户'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'trial@zhimai-ai.cn'}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <UserCog className="w-4 h-4" />
                  <span className="text-sm">系统设置</span>
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-sm">{isDarkMode ? '浅色模式' : '深色模式'}</span>
                </button>
                <button 
                  onClick={handleSwitchAccount}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">切换账号</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">退出登录</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      setIsAuthenticated(loggedIn === 'true');
    };
    checkAuth();
    // 监听storage变化
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [forceUpdate]);

  // 登录成功后调用此函数刷新状态
  useEffect(() => {
    window.loginSuccess = () => {
      setIsAuthenticated(true);
      setForceUpdate(prev => prev + 1);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
              <div className="flex-1 lg:ml-64">
                <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <main className="p-4 lg:p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/candidates" element={<Candidates />} />
                    <Route path="/ai-match" element={<AIMatch />} />
                    <Route path="/interviews" element={<Interviews />} />
                    <Route path="/call-records" element={<CallRecords />} />
                    <Route path="/interview-analysis" element={<InterviewAnalysis />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Login />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
