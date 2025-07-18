import React, { useState } from 'react';
import { Search, Calendar, MapPin, DollarSign, Eye, FileText, Image, Edit2, Save, X } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { MaintenanceRecord } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const MaintenanceHistory: React.FC = () => {
  const { records, updateRecord, categories } = useMaintenanceData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editData, setEditData] = useState<MaintenanceRecord | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'mileage' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredRecords = records
    .filter(record => 
      record.items.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || 
      record.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'mileage':
          aValue = a.mileage;
          bValue = b.mileage;
          break;
        case 'cost':
          aValue = a.totalActualCost;
          bValue = b.totalActualCost;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record.id);
    setEditData({ ...record });
  };

  const handleSave = () => {
    if (editData) {
      updateRecord(editData.id, editData);
      setEditingRecord(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setEditData(null);
  };

  const updateEditItem = (index: number, field: string, value: any) => {
    if (!editData) return;
    
    const updatedItems = [...editData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // 当类别改变时，重置项目名称
    if (field === 'category') {
      updatedItems[index].name = '';
    }
    
    const totalOriginalCost = updatedItems.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalActualCost = updatedItems.reduce((sum, item) => sum + item.actualPrice, 0);
    
    setEditData({
      ...editData,
      items: updatedItems,
      totalOriginalCost,
      totalActualCost
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      '发动机': 'bg-red-100 text-red-800',
      '刹车系统': 'bg-orange-100 text-orange-800',
      '轮胎': 'bg-blue-100 text-blue-800',
      '油液': 'bg-green-100 text-green-800',
      '电气系统': 'bg-purple-100 text-purple-800',
      '空调系统': 'bg-cyan-100 text-cyan-800',
      '底盘': 'bg-yellow-100 text-yellow-800',
      '其他': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['其他'];
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">保养历史</h1>
        <p className="text-gray-600">查看和编辑所有保养记录</p>
      </div>

      {/* 搜索和排序 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索保养项目或备注..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'mileage' | 'cost')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">按日期排序</option>
              <option value="mileage">按里程排序</option>
              <option value="cost">按费用排序</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>
      </div>

      {/* 记录列表 */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    {editingRecord === record.id && editData ? (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <input
                            type="number"
                            value={editData.mileage}
                            onChange={(e) => setEditData({ ...editData, mileage: parseInt(e.target.value) || 0 })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                          />
                          <span className="ml-1">km</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{format(new Date(record.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{record.mileage.toLocaleString()} km</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>¥{(editingRecord === record.id && editData ? editData.totalActualCost : record.totalActualCost).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingRecord === record.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          保存
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 mr-1" />
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(record)}
                          className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          编辑
                        </button>
                        <button
                          onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                          className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {selectedRecord === record.id ? '收起' : '详情'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingRecord === record.id && editData ? (
                  // 编辑模式
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">保养项目</h3>
                      <div className="space-y-3">
                        {editData.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded">
                            <select
                              value={item.category}
                              onChange={(e) => updateEditItem(index, 'category', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {Object.keys(categories).map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                            <select
                              value={item.name}
                              onChange={(e) => updateEditItem(index, 'name', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">选择项目</option>
                              {categories[item.category as keyof typeof categories]?.map(name => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              value={item.originalPrice}
                              onChange={(e) => updateEditItem(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="原价"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={item.actualPrice}
                              onChange={(e) => updateEditItem(index, 'actualPrice', parseFloat(e.target.value) || 0)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="实付"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {record.items.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}
                        >
                          {item.name}
                        </span>
                      ))}
                      {record.items.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{record.items.length - 3} 项
                        </span>
                      )}
                    </div>

                    {record.incompleteItems.length > 0 && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {record.incompleteItems.length} 个未完成项目
                        </span>
                      </div>
                    )}
                  </>
                )}

                {selectedRecord === record.id && editingRecord !== record.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {/* 详细项目列表 */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">保养项目详情</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {record.items.map((item, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                  {item.category}
                                </span>
                                {item.originalPrice !== item.actualPrice && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    原价: ¥{item.originalPrice.toLocaleString()}
                                  </div>
                                )}
                              </div>
                              <span className="text-green-600 font-semibold">¥{item.actualPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* 费用汇总 */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>原价总计:</span>
                            <span className="text-gray-600">¥{record.totalOriginalCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>实付总计:</span>
                            <span className="text-green-600 font-semibold">¥{record.totalActualCost.toLocaleString()}</span>
                          </div>
                        </div>
                        {record.totalOriginalCost > record.totalActualCost && (
                          <div className="mt-2 text-center">
                            <span className="text-sm text-green-600">
                              节省: ¥{(record.totalOriginalCost - record.totalActualCost).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 未完成项目 */}
                    {record.incompleteItems.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">未完成项目</h3>
                        <div className="space-y-2">
                          {record.incompleteItems.map((item, index) => (
                            <div key={index} className="p-3 bg-orange-50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  item.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 附件 */}
                    {record.attachments.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">附件</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {record.attachments.map((attachment, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center">
                                {attachment.type.startsWith('image/') ? (
                                  <Image className="h-5 w-5 text-blue-500 mr-2" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
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
                      </div>
                    )}

                    {/* 备注 */}
                    {record.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">备注</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{record.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无保养记录</h3>
          <p className="text-gray-600">开始记录您的第一次保养吧！</p>
        </div>
      )}
    </div>
  );
};