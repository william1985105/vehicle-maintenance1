import React, { useState } from 'react';
import { Plus, Package, Calendar, AlertTriangle, Edit2, Trash2, Clock, Settings } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { PurchasedItem } from '../types';
import { format, isAfter, differenceInDays } from 'date-fns';
import { CategoryManager } from './CategoryManager';

export const PurchasedItems: React.FC = () => {
  const { purchasedItems, addPurchasedItem, updatePurchasedItem, removePurchasedItem, categories } = useMaintenanceData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PurchasedItem | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [formData, setFormData] = useState<Omit<PurchasedItem, 'id'>>({
    name: '',
    category: Object.keys(categories)[0] || '发动机',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    totalQuantity: 1,
    remainingQuantity: 1,
    price: 0,
    supplier: '',
    notes: '',
    isMultiUse: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updatePurchasedItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addPurchasedItem({
        ...formData,
        remainingQuantity: formData.isMultiUse ? formData.totalQuantity : formData.quantity
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: Object.keys(categories)[0] || '发动机',
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: 1,
      totalQuantity: 1,
      remainingQuantity: 1,
      price: 0,
      supplier: '',
      notes: '',
      isMultiUse: false
    });
    setShowForm(false);
  };

  const handleEdit = (item: PurchasedItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      quantity: item.quantity,
      totalQuantity: item.totalQuantity,
      remainingQuantity: item.remainingQuantity,
      price: item.price,
      supplier: item.supplier || '',
      notes: item.notes || '',
      isMultiUse: item.isMultiUse
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const getExpiryStatus = (item: PurchasedItem) => {
    if (!item.expiryDate) return null;
    
    const today = new Date();
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = differenceInDays(expiryDate, today);
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', message: '已过期', color: 'text-red-600 bg-red-50' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', message: `${daysUntilExpiry}天后过期`, color: 'text-orange-600 bg-orange-50' };
    } else {
      return { status: 'normal', message: `${daysUntilExpiry}天后过期`, color: 'text-green-600 bg-green-50' };
    }
  };

  const expiredItems = purchasedItems.filter(item => {
    const status = getExpiryStatus(item);
    return status?.status === 'expired';
  });

  const expiringItems = purchasedItems.filter(item => {
    const status = getExpiryStatus(item);
    return status?.status === 'warning';
  });

  const multiUseItems = purchasedItems.filter(item => item.isMultiUse);

  return (
    <div className="p-6">
      {/* 类别管理器 */}
      <CategoryManager 
        isOpen={showCategoryManager} 
        onClose={() => setShowCategoryManager(false)} 
      />

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">购买记录</h1>
            <p className="text-gray-600">管理购买的保养用品和配件</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              管理类别
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增购买记录
            </button>
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总购买项目</p>
              <p className="text-2xl font-bold text-gray-900">{purchasedItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已过期</p>
              <p className="text-2xl font-bold text-gray-900">{expiredItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">即将过期</p>
              <p className="text-2xl font-bold text-gray-900">{expiringItems.length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* 新增/编辑表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? '编辑购买记录' : '新增购买记录'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    项目类别 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, name: '' })}
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
                    项目名称 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">请选择项目</option>
                    {categories[formData.category]?.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    购买日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    过期日期
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isMultiUse"
                  checked={formData.isMultiUse}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    isMultiUse: e.target.checked,
                    totalQuantity: e.target.checked ? formData.totalQuantity : formData.quantity,
                    remainingQuantity: e.target.checked ? formData.totalQuantity : formData.quantity
                  })}
                  className="mr-2"
                />
                <label htmlFor="isMultiUse" className="text-sm font-medium text-gray-700">
                  多次使用项目（如机油等可分多次使用的物品）
                </label>
              </div>

              {formData.isMultiUse ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      总数量/容量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.totalQuantity}
                      onChange={(e) => {
                        const total = parseInt(e.target.value) || 1;
                        setFormData({ 
                          ...formData, 
                          totalQuantity: total,
                          remainingQuantity: editingItem ? formData.remainingQuantity : total
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="如：4（升）"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      剩余数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.totalQuantity}
                      value={formData.remainingQuantity}
                      onChange={(e) => setFormData({ ...formData, remainingQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      购买价格 (¥) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      数量 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        setFormData({ 
                          ...formData, 
                          quantity: qty,
                          totalQuantity: qty,
                          remainingQuantity: qty
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      购买价格 (¥) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  供应商
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="如：4S店、汽配城等"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="记录品牌、规格等信息"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editingItem ? '更新' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 购买记录列表 */}
      {purchasedItems.length > 0 ? (
        <div className="space-y-4">
          {purchasedItems.map((item) => {
            const expiryStatus = getExpiryStatus(item);
            return (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {item.category}
                      </span>
                      {item.isMultiUse && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          多次使用
                        </span>
                      )}
                      {expiryStatus && (
                        <span className={`px-2 py-1 text-xs rounded-full ${expiryStatus.color}`}>
                          {expiryStatus.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">购买日期:</span>
                        <br />
                        {format(new Date(item.purchaseDate), 'yyyy-MM-dd')}
                      </div>
                      {item.isMultiUse ? (
                        <div>
                          <span className="font-medium">剩余/总量:</span>
                          <br />
                          <span className="font-semibold text-blue-600">
                            {item.remainingQuantity}/{item.totalQuantity}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">数量:</span>
                          <br />
                          {item.quantity}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">价格:</span>
                        <br />
                        <span className="text-green-600 font-semibold">¥{item.price}</span>
                      </div>
                      {item.supplier && (
                        <div>
                          <span className="font-medium">供应商:</span>
                          <br />
                          {item.supplier}
                        </div>
                      )}
                    </div>
                    
                    {item.notes && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removePurchasedItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无购买记录</h3>
          <p className="text-gray-600 mb-4">开始记录您购买的保养用品和配件</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            添加第一个记录
          </button>
        </div>
      )}
    </div>
  );
};