import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Brain, Video, FileSearch, 
  UserCheck, Settings, Menu, X, Bell, Search
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import AIMatch from './pages/AIMatch';
import Interviews from './pages/Interviews';
import InterviewAnalysis from './pages/InterviewAnalysis';
import Onboarding from './pages/Onboarding';
import SettingsPage from './pages/Settings';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '仪表盘' },
    { path: '/jobs', icon: Briefcase, label: '职位管理' },
    { path: '/candidates', icon: Users, label: '候选人' },
    { path: '/ai-match', icon: Brain, label: 'AI匹配' },
    { path: '/interviews', icon: Video, label: '面试安排' },
    { path: '/interview-analysis', icon: FileSearch, label: '面试分析' },
    { path: '/onboarding', icon: UserCheck, label: '复试入职' },
    { path: '/settings', icon: Settings, label: '系统设置' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-dark-300 border-r border-dark-100 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">智脉AI</h1>
              <p className="text-xs text-gray-400">智能招聘系统</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-500' : 'text-gray-400 hover:bg-dark-200 hover:text-gray-200'}`} onClick={() => setIsOpen(false)}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-6">
          <div className="text-xs text-gray-500">v1.0.0</div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ isOpen, setIsOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, title: '新简历投递', desc: '陈伟投递了后端工程师职位', time: '3小时前' },
    { id: 2, title: '面试提醒', desc: '张明的面试将在1小时后开始', time: '1小时前' },
    { id: 3, title: 'AI匹配完成', desc: '找到5位高匹配度候选人', time: '5小时前' },
  ];

  return (
    <header className="h-16 bg-dark-300 border-b border-dark-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-dark-200 rounded-lg">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-dark-200 rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索候选人、职位..." className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-dark-200 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-dark-200 border border-dark-100 rounded-xl shadow-xl animate-slide-down z-50">
              <div className="p-4 border-b border-dark-100">
                <h3 className="font-semibold text-white">通知中心</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-dark-100 border-b border-dark-100 last:border-0 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 pl-3 border-l border-dark-100">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-400">管理员</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-dark-500 flex">
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
              <Route path="/interview-analysis" element={<InterviewAnalysis />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
