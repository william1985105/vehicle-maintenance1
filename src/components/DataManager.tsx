import React, { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, X, Database, Calendar, Fuel, Package, Bell, Clock, Eye, Archive } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';
import { AttachmentViewer } from './AttachmentViewer';
import { format } from 'date-fns';

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const { 
    records, 
    incompleteItems, 
    reminders, 
    purchasedItems, 
    fuelRecords,
    categories,
    fuelOptions,
    importAllData 
  } = useMaintenanceData();
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showAttachmentViewer, setShowAttachmentViewer] = useState(false);
  const [viewerAttachments, setViewerAttachments] = useState<any[]>([]);
  const [viewerTitle, setViewerTitle] = useState('');
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    records: true,
    fuelRecords: true,
    incompleteItems: true,
    reminders: true,
    purchasedItems: true,
    categories: true,
    fuelOptions: true
  });

  if (!isOpen) return null;

  const dataStats = {
    records: records.length,
    fuelRecords: fuelRecords.length,
    incompleteItems: incompleteItems.length,
    reminders: reminders.length,
    purchasedItems: purchasedItems.length,
    categories: Object.keys(categories).length,
    fuelOptions: Object.keys(fuelOptions).reduce((sum, key) => sum + fuelOptions[key as keyof typeof fuelOptions].length, 0)
  };

  // 统计附件数量
  const attachmentStats = {
    recordAttachments: records.reduce((sum, record) => sum + (record.attachments?.length || 0), 0),
    fuelAttachments: fuelRecords.reduce((sum, record) => sum + (record.attachments?.length || 0), 0)
  };

  const exportData = () => {
    const dataToExport: any = {};
    
    if (selectedDataTypes.records) dataToExport.records = records;
    if (selectedDataTypes.fuelRecords) dataToExport.fuelRecords = fuelRecords;
    if (selectedDataTypes.incompleteItems) dataToExport.incompleteItems = incompleteItems;
    if (selectedDataTypes.reminders) dataToExport.reminders = reminders;
    if (selectedDataTypes.purchasedItems) dataToExport.purchasedItems = purchasedItems;
    if (selectedDataTypes.categories) dataToExport.categories = categories;
    if (selectedDataTypes.fuelOptions) dataToExport.fuelOptions = fuelOptions;

    // 添加导出元数据，包含附件统计
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.1',
        appName: '车辆保养记录系统',
        dataTypes: Object.keys(selectedDataTypes).filter(key => selectedDataTypes[key as keyof typeof selectedDataTypes]),
        attachmentStats: {
          totalRecordAttachments: attachmentStats.recordAttachments,
          totalFuelAttachments: attachmentStats.fuelAttachments,
          totalAttachments: attachmentStats.recordAttachments + attachmentStats.fuelAttachments
        }
      },
      data: dataToExport
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicle_maintenance_backup_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAttachmentsOnly = () => {
    const allAttachments: any[] = [];
    
    // 收集保养记录的附件
    records.forEach(record => {
      if (record.attachments && record.attachments.length > 0) {
        record.attachments.forEach(attachment => {
          allAttachments.push({
            ...attachment,
            source: 'maintenance',
            recordDate: record.date,
            recordId: record.id
          });
        });
      }
    });

    // 收集加油记录的附件
    fuelRecords.forEach(record => {
      if (record.attachments && record.attachments.length > 0) {
        record.attachments.forEach(attachment => {
          allAttachments.push({
            ...attachment,
            source: 'fuel',
            recordDate: record.date,
            recordId: record.id
          });
        });
      }
    });

    if (allAttachments.length === 0) {
      alert('没有找到任何附件');
      return;
    }

    const attachmentData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        appName: '车辆保养记录系统 - 附件导出',
        totalAttachments: allAttachments.length
      },
      attachments: allAttachments
    };

    const blob = new Blob([JSON.stringify(attachmentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicle_maintenance_attachments_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const viewAllAttachments = () => {
    const allAttachments: any[] = [];
    
    // 收集保养记录的附件
    records.forEach(record => {
      if (record.attachments && record.attachments.length > 0) {
        record.attachments.forEach(attachment => {
          allAttachments.push({
            ...attachment,
            source: '保养记录',
            recordDate: record.date,
            recordId: record.id
          });
        });
      }
    });

    // 收集加油记录的附件
    fuelRecords.forEach(record => {
      if (record.attachments && record.attachments.length > 0) {
        record.attachments.forEach(attachment => {
          allAttachments.push({
            ...attachment,
            source: '加油记录',
            recordDate: record.date,
            recordId: record.id
          });
        });
      }
    });

    if (allAttachments.length === 0) {
      alert('没有找到任何附件');
      return;
    }

    setViewerAttachments(allAttachments);
    setViewerTitle(`所有附件 (${allAttachments.length}个)`);
    setShowAttachmentViewer(true);
  };

  const exportCSV = (dataType: string) => {
    let csvContent = '';
    let filename = '';

    switch (dataType) {
      case 'records':
        csvContent = generateRecordsCSV();
        filename = `maintenance_records_${format(new Date(), 'yyyyMMdd')}.csv`;
        break;
      case 'fuelRecords':
        csvContent = generateFuelRecordsCSV();
        filename = `fuel_records_${format(new Date(), 'yyyyMMdd')}.csv`;
        break;
      case 'purchasedItems':
        csvContent = generatePurchasedItemsCSV();
        filename = `purchased_items_${format(new Date(), 'yyyyMMdd')}.csv`;
        break;
      default:
        return;
    }

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateRecordsCSV = () => {
    const headers = ['日期', '里程(km)', '项目类别', '项目名称', '原价(元)', '实付(元)', '备注', '总原价(元)', '总实付(元)', '附件数量', '附件列表'];
    let csv = headers.join(',') + '\n';

    records.forEach(record => {
      const attachmentList = record.attachments?.map(att => att.name).join(';') || '';
      record.items.forEach((item, index) => {
        const row = [
          record.date,
          index === 0 ? record.mileage : '',
          item.category,
          item.name,
          item.originalPrice,
          item.actualPrice,
          item.notes || '',
          index === 0 ? record.totalOriginalCost : '',
          index === 0 ? record.totalActualCost : '',
          index === 0 ? (record.attachments?.length || 0) : '',
          index === 0 ? attachmentList : ''
        ];
        csv += row.map(field => `"${field}"`).join(',') + '\n';
      });
    });

    return csv;
  };

  const generateFuelRecordsCSV = () => {
    const headers = ['日期', '里程(km)', '加油量(L)', '原价(元)', '总费用(元)', '优惠后单价(元/L)', '油品类型', '加油站', '地点', '支付方式', '是否加满', '备注', '附件数量', '附件列表'];
    let csv = headers.join(',') + '\n';

    fuelRecords.forEach(record => {
      const attachmentList = record.attachments?.map(att => att.name).join(';') || '';
      const row = [
        record.date,
        record.mileage,
        record.fuelAmount,
        record.originalPrice,
        record.totalCost,
        record.discountedPrice.toFixed(2),
        record.fuelType,
        record.gasStation,
        record.location || '',
        record.paymentMethod || '',
        record.isFullTank ? '是' : '否',
        record.notes || '',
        record.attachments?.length || 0,
        attachmentList
      ];
      csv += row.map(field => `"${field}"`).join(',') + '\n';
    });

    return csv;
  };

  const generatePurchasedItemsCSV = () => {
    const headers = ['项目名称', '类别', '购买日期', '过期日期', '数量', '价格(元)', '供应商', '是否多次使用', '剩余数量', '备注'];
    let csv = headers.join(',') + '\n';

    purchasedItems.forEach(item => {
      const row = [
        item.name,
        item.category,
        item.purchaseDate,
        item.expiryDate || '',
        item.quantity,
        item.price,
        item.supplier || '',
        item.isMultiUse ? '是' : '否',
        item.remainingQuantity,
        item.notes || ''
      ];
      csv += row.map(field => `"${field}"`).join(',') + '\n';
    });

    return csv;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportStatus('idle');
      setImportMessage('');
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setImportStatus('loading');
    setImportMessage('正在导入数据...');

    try {
      const text = await importFile.text();
      const importedData = JSON.parse(text);

      // 验证数据格式
      if (!importedData.data && !importedData.records) {
        throw new Error('无效的数据格式');
      }

      // 兼容旧格式和新格式
      const dataToImport = importedData.data || importedData;

      // 验证附件数据完整性
      let attachmentWarning = '';
      if (importedData.metadata?.attachmentStats) {
        const { totalAttachments } = importedData.metadata.attachmentStats;
        if (totalAttachments > 0) {
          attachmentWarning = `\n注意：导入的数据包含 ${totalAttachments} 个附件，附件数据已包含在内。`;
        }
      }

      // 导入数据
      await importAllData(dataToImport);

      setImportStatus('success');
      setImportMessage(`数据导入成功！${attachmentWarning}`);
      
      // 3秒后关闭对话框
      setTimeout(() => {
        onClose();
        setImportStatus('idle');
        setImportMessage('');
        setImportFile(null);
      }, 3000);

    } catch (error) {
      console.error('导入失败:', error);
      setImportStatus('error');
      setImportMessage(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const dataTypeOptions = [
    { key: 'records', label: '保养记录', icon: Database, count: dataStats.records, extra: `(${attachmentStats.recordAttachments}个附件)` },
    { key: 'fuelRecords', label: '加油记录', icon: Fuel, count: dataStats.fuelRecords, extra: `(${attachmentStats.fuelAttachments}个附件)` },
    { key: 'incompleteItems', label: '未完成项目', icon: Clock, count: dataStats.incompleteItems },
    { key: 'reminders', label: '保养提醒', icon: Bell, count: dataStats.reminders },
    { key: 'purchasedItems', label: '购买记录', icon: Package, count: dataStats.purchasedItems },
    { key: 'categories', label: '项目类别', icon: FileText, count: dataStats.categories },
    { key: 'fuelOptions', label: '加油选项', icon: Calendar, count: dataStats.fuelOptions }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 附件查看器 */}
      <AttachmentViewer
        isOpen={showAttachmentViewer}
        onClose={() => setShowAttachmentViewer(false)}
        attachments={viewerAttachments}
        title={viewerTitle}
      />

      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-500" />
            数据管理
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 数据统计 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">数据统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dataTypeOptions.map(option => {
                const Icon = option.icon;
                return (
                  <div key={option.key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-600">{option.label}</p>
                        <p className="text-xl font-bold text-gray-900">{option.count}</p>
                      </div>
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    {option.extra && (
                      <p className="text-xs text-gray-500">{option.extra}</p>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 附件统计汇总 */}
            {(attachmentStats.recordAttachments > 0 || attachmentStats.fuelAttachments > 0) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">附件统计</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">保养记录附件:</span>
                        <span className="font-semibold ml-1">{attachmentStats.recordAttachments}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">加油记录附件:</span>
                        <span className="font-semibold ml-1">{attachmentStats.fuelAttachments}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">总附件数:</span>
                        <span className="font-semibold ml-1">{attachmentStats.recordAttachments + attachmentStats.fuelAttachments}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={viewAllAttachments}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    查看附件
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 导出功能 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">导出数据</h3>
            
            {/* 选择导出数据类型 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">选择要导出的数据类型:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dataTypeOptions.map(option => (
                  <label key={option.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDataTypes[option.key as keyof typeof selectedDataTypes]}
                      onChange={(e) => setSelectedDataTypes({
                        ...selectedDataTypes,
                        [option.key]: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportData}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                导出完整数据 (JSON)
              </button>
              
              {(attachmentStats.recordAttachments > 0 || attachmentStats.fuelAttachments > 0) && (
                <button
                  onClick={exportAttachmentsOnly}
                  className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  仅导出附件 (JSON)
                </button>
              )}
              
              <button
                onClick={() => exportCSV('records')}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                导出保养记录 (CSV)
              </button>
              
              <button
                onClick={() => exportCSV('fuelRecords')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <Fuel className="h-4 w-4 mr-2" />
                导出加油记录 (CSV)
              </button>
              
              <button
                onClick={() => exportCSV('purchasedItems')}
                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                导出购买记录 (CSV)
              </button>
            </div>

            {/* 导出说明 */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-800 mb-1">导出说明</h4>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• JSON格式包含完整数据，包括所有附件的Base64编码</li>
                    <li>• CSV格式包含附件列表和数量统计</li>
                    <li>• 附件数据会完整保存在JSON文件中，导入时可完全恢复</li>
                    <li>• 可单独导出附件文件，便于查看和管理</li>
                    <li>• 建议定期备份JSON格式以保证数据完整性</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 导入功能 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">导入数据</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {importStatus === 'success' ? (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-green-900 mb-2">导入成功！</h4>
                  <p className="text-green-600 whitespace-pre-line">{importMessage}</p>
                </div>
              ) : importStatus === 'error' ? (
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-red-900 mb-2">导入失败</h4>
                  <p className="text-red-600">{importMessage}</p>
                  <button
                    onClick={() => {
                      setImportStatus('idle');
                      setImportMessage('');
                      setImportFile(null);
                    }}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    重新尝试
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">选择备份文件</h4>
                    <p className="text-gray-600 mb-4">支持 JSON 格式的备份文件（包含附件数据）</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="import-file"
                    />
                    <label
                      htmlFor="import-file"
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      选择文件
                    </label>
                  </div>
                  
                  {importFile && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        已选择文件: {importFile.name}
                      </p>
                      <p className="text-xs text-blue-600 mb-3">
                        文件大小: {(importFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={handleImport}
                        disabled={importStatus === 'loading'}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {importStatus === 'loading' ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            导入中...
                          </div>
                        ) : (
                          '开始导入'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 导入说明 */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">导入说明</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 导入会覆盖现有数据，请确保已备份重要数据</li>
                    <li>• 仅支持本系统导出的 JSON 格式文件</li>
                    <li>• 附件数据会完整恢复，包括图片和文档</li>
                    <li>• 导入过程中请勿关闭页面</li>
                    <li>• 建议在导入前先导出当前数据作为备份</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};