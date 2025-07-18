import React, { useState } from 'react';
import { Plus, Fuel, Calendar, MapPin, DollarSign, TrendingUp, Edit2, Trash2, BarChart3, Settings, X, Upload, FileText, Image } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { FuelRecord, FileAttachment } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FuelOptionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FuelOptionsManager: React.FC<FuelOptionsManagerProps> = ({ isOpen, onClose }) => {
  const { fuelOptions, addFuelType, removeFuelType, addPaymentMethod, removePaymentMethod, addGasStation, removeGasStation, addLocation, removeLocation } = useMaintenanceData();
  const [newFuelType, setNewFuelType] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newGasStation, setNewGasStation] = useState('');
  const [newLocation, setNewLocation] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">管理加油选项</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* 油品类型管理 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">油品类型</h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={newFuelType}
                onChange={(e) => setNewFuelType(e.target.value)}
                placeholder="输入新油品类型"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && newFuelType.trim() && (addFuelType(newFuelType.trim()), setNewFuelType(''))}
              />
              <button
                onClick={() => {
                  if (newFuelType.trim()) {
                    addFuelType(newFuelType.trim());
                    setNewFuelType('');
                  }
                }}
                disabled={!newFuelType.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fuelOptions.fuelTypes.map((type) => (
                <div key={type} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-900">{type}</span>
                  <button
                    onClick={() => removeFuelType(type)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 支付方式管理 */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">支付方式</h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                placeholder="输入新支付方式"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && newPaymentMethod.trim() && (addPaymentMethod(newPaymentMethod.trim()), setNewPaymentMethod(''))}
              />
              <button
                onClick={() => {
                  if (newPaymentMethod.trim()) {
                    addPaymentMethod(newPaymentMethod.trim());
                    setNewPaymentMethod('');
                  }
                }}
                disabled={!newPaymentMethod.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fuelOptions.paymentMethods.map((method) => (
                <div key={method} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-900">{method}</span>
                  <button
                    onClick={() => removePaymentMethod(method)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 加油站管理 */}
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">加油站</h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={newGasStation}
                onChange={(e) => setNewGasStation(e.target.value)}
                placeholder="输入新加油站"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && newGasStation.trim() && (addGasStation(newGasStation.trim()), setNewGasStation(''))}
              />
              <button
                onClick={() => {
                  if (newGasStation.trim()) {
                    addGasStation(newGasStation.trim());
                    setNewGasStation('');
                  }
                }}
                disabled={!newGasStation.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fuelOptions.gasStations.map((station) => (
                <div key={station} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-900">{station}</span>
                  <button
                    onClick={() => removeGasStation(station)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 地点管理 */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">地点</h3>
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="输入新地点"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && newLocation.trim() && (addLocation(newLocation.trim()), setNewLocation(''))}
              />
              <button
                onClick={() => {
                  if (newLocation.trim()) {
                    addLocation(newLocation.trim());
                    setNewLocation('');
                  }
                }}
                disabled={!newLocation.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fuelOptions.locations.map((location) => (
                <div key={location} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-900">{location}</span>
                  <button
                    onClick={() => removeLocation(location)}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

export const FuelRecords: React.FC = () => {
  const { fuelRecords, addFuelRecord, updateFuelRecord, removeFuelRecord, fuelOptions } = useMaintenanceData();
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [showOptionsManager, setShowOptionsManager] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [formData, setFormData] = useState<Omit<FuelRecord, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    mileage: 0,
    fuelAmount: 0,
    originalPrice: 0,
    totalCost: 0,
    discountedPrice: 0,
    gasStation: fuelOptions.gasStations[0] || '',
    fuelType: fuelOptions.fuelTypes[0] || '95号汽油',
    isFullTank: true,
    notes: '',
    location: fuelOptions.locations[0] || '武汉',
    paymentMethod: fuelOptions.paymentMethods[0] || '微信',
    attachments: []
  });

  // 计算统计数据
  const totalFuelCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const totalFuelAmount = fuelRecords.reduce((sum, record) => sum + record.fuelAmount, 0);
  const averageFuelPrice = totalFuelAmount > 0 ? totalFuelCost / totalFuelAmount : 0;

  // 计算油耗（仅计算加满的记录）
  const fullTankRecords = fuelRecords.filter(record => record.isFullTank).sort((a, b) => a.mileage - b.mileage);
  const fuelConsumptions = [];
  
  for (let i = 1; i < fullTankRecords.length; i++) {
    const current = fullTankRecords[i];
    const previous = fullTankRecords[i - 1];
    const distance = current.mileage - previous.mileage;
    
    if (distance > 0) {
      const consumption = (current.fuelAmount / distance) * 100; // 百公里油耗
      fuelConsumptions.push({
        date: current.date,
        consumption,
        distance,
        fuelAmount: current.fuelAmount
      });
    }
  }

  const averageConsumption = fuelConsumptions.length > 0 
    ? fuelConsumptions.reduce((sum, item) => sum + item.consumption, 0) / fuelConsumptions.length 
    : 0;

  // 月度统计
  const monthlyStats = React.useMemo(() => {
    const now = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthRecords = fuelRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === date.getMonth() && 
               recordDate.getFullYear() === date.getFullYear();
      });
      
      last6Months.push({
        month: format(date, 'MMM'),
        cost: monthRecords.reduce((sum, r) => sum + r.totalCost, 0),
        amount: monthRecords.reduce((sum, r) => sum + r.fuelAmount, 0),
        count: monthRecords.length
      });
    }
    
    return last6Months;
  }, [fuelRecords]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      ...formData,
      discountedPrice: formData.fuelAmount > 0 ? formData.totalCost / formData.fuelAmount : 0,
      attachments
    };

    if (editingRecord) {
      updateFuelRecord(editingRecord.id, recordData);
      setEditingRecord(null);
    } else {
      addFuelRecord(recordData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mileage: 0,
      fuelAmount: 0,
      originalPrice: 0,
      totalCost: 0,
      discountedPrice: 0,
      gasStation: fuelOptions.gasStations[0] || '',
      fuelType: fuelOptions.fuelTypes[0] || '95号汽油',
      isFullTank: true,
      notes: '',
      location: fuelOptions.locations[0] || '武汉',
      paymentMethod: fuelOptions.paymentMethods[0] || '微信',
      attachments: []
    });
    setAttachments([]);
    setShowForm(false);
  };

  const handleEdit = (record: FuelRecord) => {
    setFormData({
      date: record.date,
      mileage: record.mileage,
      fuelAmount: record.fuelAmount,
      originalPrice: record.originalPrice,
      totalCost: record.totalCost,
      discountedPrice: record.discountedPrice,
      gasStation: record.gasStation,
      fuelType: record.fuelType,
      isFullTank: record.isFullTank,
      notes: record.notes || '',
      location: record.location || fuelOptions.locations[0] || '武汉',
      paymentMethod: record.paymentMethod || '微信',
      attachments: record.attachments || []
    });
    setAttachments(record.attachments || []);
    setEditingRecord(record);
    setShowForm(true);
  };

  // 自动计算优惠前单价和优惠后单价
  const preDiscountPrice = formData.fuelAmount > 0 ? formData.originalPrice / formData.fuelAmount : 0;
  const discountedPrice = formData.fuelAmount > 0 ? formData.totalCost / formData.fuelAmount : 0;

  React.useEffect(() => {
    if (formData.fuelAmount > 0 && formData.totalCost > 0) {
      setFormData(prev => ({
        ...prev,
        discountedPrice: prev.totalCost / prev.fuelAmount
      }));
    }
  }, [formData.fuelAmount, formData.totalCost]);

  return (
    <div className="p-6">
      {/* 选项管理器 */}
      <FuelOptionsManager 
        isOpen={showOptionsManager} 
        onClose={() => setShowOptionsManager(false)} 
      />

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">加油记录</h1>
            <p className="text-gray-600">管理车辆加油记录和油耗分析</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOptionsManager(true)}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              管理选项
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              新增加油记录
            </button>
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总加油次数</p>
              <p className="text-2xl font-bold text-gray-900">{fuelRecords.length}</p>
            </div>
            <Fuel className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总花费</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalFuelCost.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均油价</p>
              <p className="text-2xl font-bold text-gray-900">¥{averageFuelPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500">/升</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均油耗</p>
              <p className="text-2xl font-bold text-gray-900">{averageConsumption.toFixed(1)}</p>
              <p className="text-xs text-gray-500">L/100km</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* 新增/编辑表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingRecord ? '编辑加油记录' : '新增加油记录'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    加油日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前里程 (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    加油量 (升) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuelAmount}
                    onChange={(e) => setFormData({ ...formData, fuelAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    原价（元） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    实际总费用 (元) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({ ...formData, totalCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优惠前单价 (元/升)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={preDiscountPrice.toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优惠后单价 (元/升)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountedPrice.toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              {preDiscountPrice > 0 && discountedPrice > 0 && preDiscountPrice > discountedPrice && (
                <div className="text-center">
                  <p className="text-sm text-green-600">
                    优惠: ¥{(preDiscountPrice - discountedPrice).toFixed(2)}/升
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    油品类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {fuelOptions.fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    支付方式
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fuelOptions.paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    加油站 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gasStation}
                    onChange={(e) => setFormData({ ...formData, gasStation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {fuelOptions.gasStations.map(station => (
                      <option key={station} value={station}>{station}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地点
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fuelOptions.locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isFullTank"
                  checked={formData.isFullTank}
                  onChange={(e) => setFormData({ ...formData, isFullTank: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isFullTank" className="text-sm font-medium text-gray-700">
                  加满油箱（用于油耗计算）
                </label>
              </div>

              {/* 附件上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  附件
                </label>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fuel-file-upload"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="fuel-file-upload"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="记录其他信息"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
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
                  {editingRecord ? '更新' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 月度趋势图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            近6个月费用趋势
          </h2>
          <div className="space-y-3">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{stat.month}</span>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.max((stat.cost / Math.max(...monthlyStats.map(s => s.cost))) * 100, 2)}%` 
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  ¥{stat.cost.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
            油耗趋势
          </h2>
          {fuelConsumptions.length > 0 ? (
            <div className="space-y-3">
              {fuelConsumptions.slice(-6).map((consumption, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {format(new Date(consumption.date), 'MM-dd')}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((consumption.consumption / 15) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {consumption.consumption.toFixed(1)}L
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">需要至少两次加满记录才能计算油耗</p>
          )}
        </div>
      </div>

      {/* 加油记录列表 */}
      {fuelRecords.length > 0 ? (
        <div className="space-y-4">
          {fuelRecords.map((record) => {
            const recordPreDiscountPrice = record.fuelAmount > 0 ? record.originalPrice / record.fuelAmount : 0;
            return (
              <div key={record.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{format(new Date(record.date), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{record.mileage.toLocaleString()} km</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {record.fuelType}
                      </span>
                      {record.isFullTank && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          加满
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">加油量:</span>
                        <br />
                        <span className="text-blue-600 font-semibold">{record.fuelAmount}L</span>
                      </div>
                      <div>
                        <span className="font-medium">原价:</span>
                        <br />
                        <span>¥{record.originalPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">优惠前单价:</span>
                        <br />
                        <span>¥{recordPreDiscountPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">优惠后单价:</span>
                        <br />
                        <span className="text-green-600">¥{record.discountedPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">总费用:</span>
                        <br />
                        <span className="text-green-600 font-semibold">¥{record.totalCost}</span>
                      </div>
                      <div>
                        <span className="font-medium">加油站:</span>
                        <br />
                        {record.gasStation}
                      </div>
                    </div>
                    
                    {(record.location || record.notes) && (
                      <div className="mt-3 text-sm text-gray-600">
                        {record.location && (
                          <div>地点: {record.location}</div>
                        )}
                        {record.notes && (
                          <div className="mt-1 bg-gray-50 p-2 rounded">
                            {record.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 附件显示 */}
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">附件:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {record.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                              {attachment.type.startsWith('image/') ? (
                                <Image className="h-4 w-4 text-blue-500 mr-2" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              )}
                              <span className="text-xs text-gray-600 truncate">
                                {attachment.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFuelRecord(record.id)}
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
          <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无加油记录</h3>
          <p className="text-gray-600 mb-4">开始记录您的第一次加油</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            添加第一条记录
          </button>
        </div>
      )}
    </div>
  );
};