import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const IncompleteItems: React.FC = () => {
  const { incompleteItems, updateIncompleteItem } = useMaintenanceData();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredItems = incompleteItems.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !item.completed) ||
      (filter === 'completed' && item.completed);
    
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    
    return matchesFilter && matchesPriority;
  });

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateIncompleteItem(id, {
      completed,
      completedDate: completed ? new Date().toISOString() : undefined
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const activeCount = incompleteItems.filter(item => !item.completed).length;
  const completedCount = incompleteItems.filter(item => item.completed).length;
  const highPriorityCount = incompleteItems.filter(item => !item.completed && item.priority === 'high').length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">未完成项目管理</h1>
        <p className="text-gray-600">跟踪和管理需要后续处理的保养项目</p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待完成项目</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成项目</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">高优先级</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({incompleteItems.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'active'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              待完成 ({activeCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已完成 ({completedCount})
            </button>
          </div>
          
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">所有优先级</option>
            <option value="high">高优先级</option>
            <option value="medium">中优先级</option>
            <option value="low">低优先级</option>
          </select>
        </div>
      </div>

      {/* 项目列表 */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-6 rounded-lg shadow-md transition-all duration-200 ${
                item.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => handleToggleComplete(item.id, !item.completed)}
                    className={`mt-1 p-1 rounded-full transition-colors ${
                      item.completed
                        ? 'text-green-500 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {getPriorityIcon(item.priority)}
                        <span className="ml-1">
                          {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                        </span>
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className={`text-gray-600 mb-3 ${item.completed ? 'line-through' : ''}`}>
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>发现于: {format(new Date(item.dateFound), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                      {item.completed && item.completedDate && (
                        <span className="text-green-600">
                          完成于: {format(new Date(item.completedDate), 'yyyy年MM月dd日', { locale: zhCN })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'active' ? '太棒了！没有待完成的项目' : '暂无项目'}
          </h3>
          <p className="text-gray-600">
            {filter === 'active' 
              ? '您已经完成了所有的保养项目，继续保持！' 
              : '根据当前筛选条件，没有找到相关项目。'
            }
          </p>
        </div>
      )}
    </div>
  );
};