import React, { useState } from 'react';
import { Plus, Calendar, MapPin, AlertTriangle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { Reminder, ReminderItem } from '../types';
import { format } from 'date-fns';

export const Reminders: React.FC = () => {
  const { reminders, addReminder, removeReminder, categories } = useMaintenanceData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Reminder, 'id' | 'completed'>>({
    title: '',
    description: '',
    items: [],
    type: 'time',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder(formData);
    setFormData({
      title: '',
      description: '',
      items: [],
      type: 'time',
      priority: 'medium'
    });
    setShowForm(false);
  };

  const addReminderItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        id: Date.now().toString(),
        category: '发动机',
        name: '',
        estimatedPrice: 0
      }]
    });
  };

  const updateReminderItem = (index: number, field: keyof ReminderItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // 当类别改变时，重置项目名称
    if (field === 'category') {
      updatedItems[index].name = '';
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const removeReminderItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time':
        return <Calendar className="h-4 w-4" />;
      case 'mileage':
        return <MapPin className="h-4 w-4" />;
      case 'both':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'time':
        return '时间提醒';
      case 'mileage':
        return '里程提醒';
      case 'both':
        return '综合提醒';
      default:
        return '时间提醒';
    }
  };

  const activeReminders = reminders.filter(reminder => !reminder.completed);
  const completedReminders = reminders.filter(reminder => reminder.completed);

  const expiredReminders = activeReminders.filter(reminder => {
    if (reminder.dueDate) {
      return new Date(reminder.dueDate) < new Date();
    }
    return false;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">保养提醒</h1>
            <p className="text-gray-600">设置和管理保养提醒事项</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            新增提醒
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总提醒数</p>
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃提醒</p>
              <p className="text-2xl font-bold text-gray-900">{activeReminders.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已过期</p>
              <p className="text-2xl font-bold text-gray-900">{expiredReminders.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-gray-900">{completedReminders.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* 新增提醒表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">新增保养提醒</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  提醒标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="如：5万公里保养"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  详细描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="描述保养内容和注意事项"
                />
              </div>

              {/* 保养项目 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    保养项目
                  </label>
                  <button
                    type="button"
                    onClick={addReminderItem}
                    className="flex items-center px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    添加项目
                  </button>
                </div>
                
                {formData.items.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {formData.items.map((item, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <select
                              value={item.category}
                              onChange={(e) => updateReminderItem(index, 'category', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Object.keys(categories).map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <select
                              value={item.name}
                              onChange={(e) => updateReminderItem(index, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">选择项目</option>
                              {categories[item.category as keyof typeof categories]?.map(name => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <input
                              type="number"
                              step="0.01"
                              value={item.estimatedPrice || ''}
                              onChange={(e) => updateReminderItem(index, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="预估价格"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => removeReminderItem(index)}
                              className="w-full p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-2">暂无保养项目</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  提醒类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'time' | 'mileage' | 'both' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="time">时间提醒</option>
                  <option value="mileage">里程提醒</option>
                  <option value="both">时间+里程</option>
                </select>
              </div>

              {(formData.type === 'time' || formData.type === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    到期日期
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {(formData.type === 'mileage' || formData.type === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    到期里程 (km)
                  </label>
                  <input
                    type="number"
                    value={formData.dueMileage || ''}
                    onChange={(e) => setFormData({ ...formData, dueMileage: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="如：50000"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优先级
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 活跃提醒 */}
      {activeReminders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">活跃提醒</h2>
          <div className="space-y-4">
            {activeReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{reminder.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority === 'high' ? '高' : reminder.priority === 'medium' ? '中' : '低'}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeIcon(reminder.type)}
                        <span className="ml-1">{getTypeName(reminder.type)}</span>
                      </span>
                    </div>
                    
                    {reminder.description && (
                      <p className="text-gray-600 mb-3">{reminder.description}</p>
                    )}

                    {/* 保养项目列表 */}
                    {reminder.items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">包含项目:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {reminder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-900">{item.name}</span>
                              {item.estimatedPrice && item.estimatedPrice > 0 && (
                                <span className="text-sm text-green-600">¥{item.estimatedPrice}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {reminder.items.some(item => item.estimatedPrice && item.estimatedPrice > 0) && (
                          <div className="mt-2 text-right">
                            <span className="text-sm font-medium text-green-600">
                              预估总计: ¥{reminder.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {reminder.dueDate && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          到期时间: {format(new Date(reminder.dueDate), 'yyyy-MM-dd')}
                        </span>
                      )}
                      {reminder.dueMileage && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          到期里程: {reminder.dueMileage.toLocaleString()} km
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeReminder(reminder.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已过期提醒 */}
      {expiredReminders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">已过期提醒</h2>
          <div className="space-y-4">
            {expiredReminders.map((reminder) => (
              <div key={reminder.id} className="bg-red-50 p-6 rounded-lg border border-red-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-red-900">{reminder.title}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        已过期
                      </span>
                    </div>
                    
                    {reminder.description && (
                      <p className="text-red-700 mb-3">{reminder.description}</p>
                    )}

                    {reminder.items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-700 mb-2">包含项目:</p>
                        <div className="flex flex-wrap gap-1">
                          {reminder.items.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {item.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-red-600">
                      {reminder.dueDate && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          应完成时间: {format(new Date(reminder.dueDate), 'yyyy-MM-dd')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeReminder(reminder.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无保养提醒</h3>
          <p className="text-gray-600 mb-4">设置提醒，不错过任何重要的保养时间</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            创建第一个提醒
          </button>
        </div>
      )}
    </div>
  );
};