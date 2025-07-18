import React from 'react';
import { Car, DollarSign, AlertTriangle, Calendar, TrendingUp, Wrench, Package, Clock, Fuel } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { format, differenceInDays } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { records, incompleteItems, reminders, purchasedItems, fuelRecords } = useMaintenanceData();

  const totalActualCost = records.reduce((sum, record) => sum + record.totalActualCost, 0);
  const totalOriginalCost = records.reduce((sum, record) => sum + record.totalOriginalCost, 0);
  const totalSavings = totalOriginalCost - totalActualCost;
  
  const lastMaintenance = records[0];
  const activeIncompleteItems = incompleteItems.filter(item => !item.completed);
  const activeReminders = reminders.filter(r => !r.completed);
  
  // 加油记录统计
  const totalFuelCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const totalFuelAmount = fuelRecords.reduce((sum, record) => sum + record.fuelAmount, 0);
  const averageFuelPrice = totalFuelAmount > 0 ? totalFuelCost / totalFuelAmount : 0;
  
  // 计算油耗
  const fullTankRecords = fuelRecords.filter(record => record.isFullTank).sort((a, b) => a.mileage - b.mileage);
  let averageConsumption = 0;
  
  if (fullTankRecords.length >= 2) {
    const consumptions = [];
    for (let i = 1; i < fullTankRecords.length; i++) {
      const current = fullTankRecords[i];
      const previous = fullTankRecords[i - 1];
      const distance = current.mileage - previous.mileage;
      
      if (distance > 0) {
        const consumption = (current.fuelAmount / distance) * 100;
        consumptions.push(consumption);
      }
    }
    
    if (consumptions.length > 0) {
      averageConsumption = consumptions.reduce((sum, c) => sum + c, 0) / consumptions.length;
    }
  }
  
  // 过期和即将过期的购买项目
  const expiredItems = purchasedItems.filter(item => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) < new Date();
  });
  
  const expiringItems = purchasedItems.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = differenceInDays(new Date(item.expiryDate), new Date());
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  });

  const monthlyStats = React.useMemo(() => {
    const now = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === date.getMonth() && 
               recordDate.getFullYear() === date.getFullYear();
      });
      
      last6Months.push({
        month: format(date, 'MMM'),
        actualCost: monthRecords.reduce((sum, r) => sum + r.totalActualCost, 0),
        originalCost: monthRecords.reduce((sum, r) => sum + r.totalOriginalCost, 0),
        count: monthRecords.length
      });
    }
    
    return last6Months;
  }, [records]);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">车辆保养仪表板</h1>
        <p className="text-gray-600">管理您的车辆保养记录和提醒</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总保养记录</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
            <Car className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">保养花费</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalActualCost.toLocaleString()}</p>
              {totalSavings > 0 && (
                <p className="text-xs text-green-600">节省 ¥{totalSavings.toLocaleString()}</p>
              )}
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">加油花费</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalFuelCost.toLocaleString()}</p>
              <p className="text-xs text-gray-500">平均 ¥{averageFuelPrice.toFixed(2)}/L</p>
            </div>
            <Fuel className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均油耗</p>
              <p className="text-2xl font-bold text-gray-900">{averageConsumption.toFixed(1)}</p>
              <p className="text-xs text-gray-500">L/100km</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* 第二行统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">未完成项目</p>
              <p className="text-2xl font-bold text-gray-900">{activeIncompleteItems.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃提醒</p>
              <p className="text-2xl font-bold text-gray-900">{activeReminders.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已过期物品</p>
              <p className="text-2xl font-bold text-gray-900">{expiredItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-red-500" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近保养 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-blue-500" />
            最近保养记录
          </h2>
          {lastMaintenance ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">日期</span>
                <span className="font-medium">{format(new Date(lastMaintenance.date), 'yyyy年MM月dd日')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">里程</span>
                <span className="font-medium">{lastMaintenance.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">实际费用</span>
                <span className="font-medium text-green-600">¥{lastMaintenance.totalActualCost.toLocaleString()}</span>
              </div>
              {lastMaintenance.totalOriginalCost > lastMaintenance.totalActualCost && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">节省</span>
                  <span className="font-medium text-green-600">¥{(lastMaintenance.totalOriginalCost - lastMaintenance.totalActualCost).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">项目数</span>
                <span className="font-medium">{lastMaintenance.items.length} 项</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无保养记录</p>
          )}
        </div>

        {/* 最近加油 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Fuel className="h-5 w-5 mr-2 text-orange-500" />
            最近加油记录
          </h2>
          {fuelRecords.length > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">日期</span>
                <span className="font-medium">{format(new Date(fuelRecords[0].date), 'yyyy年MM月dd日')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">里程</span>
                <span className="font-medium">{fuelRecords[0].mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">加油量</span>
                <span className="font-medium">{fuelRecords[0].fuelAmount}L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">费用</span>
                <span className="font-medium text-orange-600">¥{fuelRecords[0].totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">优惠价</span>
                <span className="font-medium text-green-600">¥{fuelRecords[0].discountedPrice.toFixed(2)}/L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">油品</span>
                <span className="font-medium">{fuelRecords[0].fuelType}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无加油记录</p>
          )}
        </div>
      </div>

      {/* 月度费用趋势 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          近6个月保养费用趋势
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
                      width: `${Math.max((stat.actualCost / Math.max(...monthlyStats.map(s => s.actualCost))) * 100, 2)}%` 
                    }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-20 text-right">
                ¥{stat.actualCost.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 未完成项目和提醒 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 未完成项目 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            未完成项目
          </h2>
          {activeIncompleteItems.length > 0 ? (
            <div className="space-y-3">
              {activeIncompleteItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">发现于 {format(new Date(item.dateFound), 'MM-dd')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无未完成项目</p>
          )}
        </div>

        {/* 重要提醒 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-red-500" />
            活跃提醒
          </h2>
          {activeReminders.length > 0 ? (
            <div className="space-y-3">
              {activeReminders.slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900">{reminder.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  {reminder.dueDate && (
                    <p className="text-xs text-blue-600 mt-1">
                      到期时间: {format(new Date(reminder.dueDate), 'yyyy-MM-dd')}
                    </p>
                  )}
                  {reminder.items.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {reminder.items.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {item.name}
                          </span>
                        ))}
                        {reminder.items.length > 3 && (
                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{reminder.items.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无活跃提醒</p>
          )}
        </div>
      </div>

      {/* 库存警告 */}
      {(expiredItems.length > 0 || expiringItems.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-orange-500" />
            库存警告
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiredItems.length > 0 && (
              <div>
                <h3 className="font-medium text-red-700 mb-2">已过期物品</h3>
                <div className="space-y-1">
                  {expiredItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {expiringItems.length > 0 && (
              <div>
                <h3 className="font-medium text-orange-700 mb-2">即将过期</h3>
                <div className="space-y-1">
                  {expiringItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      {item.name}
                      {item.expiryDate && (
                        <div className="text-xs">
                          {differenceInDays(new Date(item.expiryDate), new Date())}天后过期
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};