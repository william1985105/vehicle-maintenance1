import React, { useState } from 'react';
import { Plus, Trash2, Upload, X, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { MaintenanceItem, IncompleteItem, FileAttachment } from '../types';
import { CategoryManager } from './CategoryManager';

export const MaintenanceForm: React.FC = () => {
  const { addRecord, incompleteItems, reminders, categories } = useMaintenanceData();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [items, setItems] = useState<Omit<MaintenanceItem, 'id'>[]>([
    { category: Object.keys(categories)[0] || '发动机', name: '', originalPrice: 0, actualPrice: 0, completed: true, notes: '' }
  ]);
  const [newIncompleteItems, setNewIncompleteItems] = useState<Omit<IncompleteItem, 'id'>[]>([]);
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const activeIncompleteItems = incompleteItems.filter(item => !item.completed);
  const activeReminders = reminders.filter(reminder => !reminder.completed);

  React.useEffect(() => {
    if (activeIncompleteItems.length > 0 || activeReminders.length > 0) {
      setShowReminderDialog(true);
    }
  }, []);

  const addItem = () => {
    setItems([...items, { 
      category: Object.keys(categories)[0] || '发动机', 
      name: '', 
      originalPrice: 0, 
      actualPrice: 0, 
      completed: true,
      notes: ''
    }]);
  };

  const updateItem = (index: number, field: keyof Omit<MaintenanceItem, 'id'>, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // 当类别改变时，重置项目名称
    if (field === 'category') {
      updatedItems[index].name = '';
    }
    
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addIncompleteItem = () => {
    setNewIncompleteItems([...newIncompleteItems, {
      name: '',
      description: '',
      dateFound: date,
      completed: false,
      priority: 'medium'
    }]);
  };

  const updateIncompleteItem = (index: number, field: keyof Omit<IncompleteItem, 'id'>, value: any) => {
    const updated = [...newIncompleteItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewIncompleteItems(updated);
  };

  const removeIncompleteItem = (index: number) => {
    setNewIncompleteItems(newIncompleteItems.filter((_, i) => i !== index));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const attachment: FileAttachment = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            url: e.target?.result as string
          };
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleReminderSelection = (reminderId: string, selected: boolean) => {
    if (selected) {
      setSelectedReminders([...selectedReminders, reminderId]);
      // 将提醒的项目添加到保养项目中
      const reminder = activeReminders.find(r => r.id === reminderId);
      if (reminder) {
        const reminderItems = reminder.items.map(item => ({
          category: item.category,
          name: item.name,
          originalPrice: item.estimatedPrice || 0,
          actualPrice: item.estimatedPrice || 0,
          completed: true,
          notes: ''
        }));
        setItems([...items, ...reminderItems]);
      }
    } else {
      setSelectedReminders(selectedReminders.filter(id => id !== reminderId));
      // 移除相关的保养项目
      const reminder = activeReminders.find(r => r.id === reminderId);
      if (reminder) {
        const reminderItemNames = reminder.items.map(item => item.name);
        setItems(items.filter(item => !reminderItemNames.includes(item.name)));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const record = {
      date,
      mileage: parseInt(mileage),
      items: items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      })),
      totalOriginalCost: items.reduce((sum, item) => sum + item.originalPrice, 0),
      totalActualCost: items.reduce((sum, item) => sum + item.actualPrice, 0),
      attachments,
      incompleteItems: newIncompleteItems.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      })),
      notes,
      completedReminders: selectedReminders
    };

    addRecord(record);
    
    // 重置表单
    setDate(new Date().toISOString().split('T')[0]);
    setMileage('');
    setItems([{ 
      category: Object.keys(categories)[0] || '发动机', 
      name: '', 
      originalPrice: 0, 
      actualPrice: 0, 
      completed: true,
      notes: ''
    }]);
    setNewIncompleteItems([]);
    setNotes('');
    setAttachments([]);
    setSelectedReminders([]);
    
    alert('保养记录已保存！');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 类别管理器 */}
      <CategoryManager 
        isOpen={showCategoryManager} 
        onClose={() => setShowCategoryManager(false)} 
      />

      {/* 提醒和未完成项目对话框 */}
      {showReminderDialog && (activeIncompleteItems.length > 0 || activeReminders.length > 0) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold">待处理项目</h3>
            </div>
            
            {/* 保养提醒 */}
            {activeReminders.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">保养提醒</h4>
                <div className="space-y-3">
                  {activeReminders.map((reminder) => (
                    <div key={reminder.id} className="p-3 bg-blue-50 rounded border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedReminders.includes(reminder.id)}
                              onChange={(e) => handleReminderSelection(reminder.id, e.target.checked)}
                              className="mr-2"
                            />
                            <p className="font-medium">{reminder.title}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">包含项目:</p>
                            <div className="flex flex-wrap gap-1">
                              {reminder.items.map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {item.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 未完成项目 */}
            {activeIncompleteItems.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">未完成项目</h4>
                <div className="space-y-2">
                  {activeIncompleteItems.map((item) => (
                    <div key={item.id} className="p-3 bg-orange-50 rounded">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                稍后处理
              </button>
              <button
                onClick={() => setShowReminderDialog(false)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">新增保养记录</h1>
            <p className="text-gray-600">记录您的车辆保养详情</p>
          </div>
          <button
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            管理类别
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保养日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前里程 (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入里程数"
                required
              />
            </div>
          </div>
        </div>

        {/* 保养项目 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">保养项目</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加项目
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      项目类别 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {Object.keys(categories).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      具体项目 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">请选择项目</option>
                      {categories[item.category]?.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      原价 (¥)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.originalPrice}
                      onChange={(e) => updateItem(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      实付 (¥)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.actualPrice}
                      onChange={(e) => updateItem(index, 'actualPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      备注
                    </label>
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="备注信息"
                    />
                  </div>
                  <div className="flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-lg font-semibold">
              <div className="flex justify-between items-center">
                <span>原价总计:</span>
                <span className="text-gray-600">¥{items.reduce((sum, item) => sum + item.originalPrice, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>实付总计:</span>
                <span className="text-green-600">¥{items.reduce((sum, item) => sum + item.actualPrice, 0).toFixed(2)}</span>
              </div>
            </div>
            {items.reduce((sum, item) => sum + item.originalPrice, 0) > items.reduce((sum, item) => sum + item.actualPrice, 0) && (
              <div className="mt-2 text-center">
                <span className="text-sm text-green-600">
                  节省: ¥{(items.reduce((sum, item) => sum + item.originalPrice, 0) - items.reduce((sum, item) => sum + item.actualPrice, 0)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 未完成项目 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">发现的未完成项目</h2>
            <button
              type="button"
              onClick={addIncompleteItem}
              className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加未完成项目
            </button>
          </div>
          
          {newIncompleteItems.length > 0 ? (
            <div className="space-y-4">
              {newIncompleteItems.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        项目名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateIncompleteItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="项目名称"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        优先级
                      </label>
                      <select
                        value={item.priority}
                        onChange={(e) => updateIncompleteItem(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeIncompleteItem(index)}
                        className="w-full p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      详细描述
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateIncompleteItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="详细描述问题或需要注意的事项"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无未完成项目</p>
          )}
        </div>

        {/* 附件上传 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">附件</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传图片或文档
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  选择文件
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持图片、PDF、Word文档，单个文件最大10MB
              </p>
            </div>
            
            {attachments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="relative p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {attachment.type.startsWith('image/') && (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="mt-2 w-full h-20 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 备注 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">备注</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="记录保养过程中的其他信息、注意事项等..."
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            保存记录
          </button>
        </div>
      </form>
    </div>
  );
};