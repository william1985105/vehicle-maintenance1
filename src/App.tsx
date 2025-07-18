import React, { useState, useEffect } from 'react';
import { Car, FileText, Clock, Bell, BarChart3, Menu, X, Package, Settings, Fuel, Database } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { MaintenanceForm } from './components/MaintenanceForm';
import { MaintenanceHistory } from './components/MaintenanceHistory';
import { IncompleteItems } from './components/IncompleteItems';
import { Reminders } from './components/Reminders';
import { PurchasedItems } from './components/PurchasedItems';
import { FuelRecords } from './components/FuelRecords';
import { Login } from './components/Login';
import { PasswordSettings } from './components/PasswordSettings';
import { DataManager } from './components/DataManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);

  // 检查是否已登录（从localStorage读取）
  useEffect(() => {
    const authStatus = localStorage.getItem('vehicle_maintenance_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('vehicle_maintenance_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vehicle_maintenance_auth');
  };

  // 如果未认证，显示登录页面
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', name: '仪表板', icon: BarChart3 },
    { id: 'new-record', name: '新增记录', icon: FileText },
    { id: 'history', name: '保养历史', icon: Car },
    { id: 'fuel-records', name: '加油记录', icon: Fuel },
    { id: 'incomplete', name: '未完成项目', icon: Clock },
    { id: 'reminders', name: '保养提醒', icon: Bell },
    { id: 'purchased', name: '购买记录', icon: Package },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-record':
        return <MaintenanceForm />;
      case 'history':
        return <MaintenanceHistory />;
      case 'fuel-records':
        return <FuelRecords />;
      case 'incomplete':
        return <IncompleteItems />;
      case 'reminders':
        return <Reminders />;
      case 'purchased':
        return <PurchasedItems />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 密码设置对话框 */}
      <PasswordSettings 
        isOpen={showPasswordSettings} 
        onClose={() => setShowPasswordSettings(false)} 
      />

      {/* 数据管理对话框 */}
      <DataManager 
        isOpen={showDataManager} 
        onClose={() => setShowDataManager(false)} 
      />

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">车辆保养</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            );
          })}
        </nav>

        {/* 底部设置和退出 */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <button
            onClick={() => setShowDataManager(true)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Database className="h-4 w-4 mr-2" />
            数据管理
          </button>
          <button
            onClick={() => setShowPasswordSettings(true)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            修改密码
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>
          </div>
          
          <div className="lg:hidden">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-blue-500" />
              <span className="ml-2 text-lg font-bold text-gray-900">车辆保养</span>
            </div>
          </div>
          
          <div className="w-10 lg:w-auto"></div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;