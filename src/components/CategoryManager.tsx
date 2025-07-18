import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useMaintenanceData } from '../hooks/useMaintenanceData';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, removeCategory, addItemToCategory, removeItemFromCategory } = useMaintenanceData();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ category: string; item: string } | null>(null);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddItem = () => {
    if (selectedCategory && newItemName.trim()) {
      addItemToCategory(selectedCategory, newItemName.trim());
      setNewItemName('');
    }
  };

  const handleRemoveCategory = (categoryName: string) => {
    if (confirm(`确定要删除类别"${categoryName}"吗？这将删除该类别下的所有项目。`)) {
      removeCategory(categoryName);
    }
  };

  const handleRemoveItem = (categoryName: string, itemName: string) => {
    if (confirm(`确定要删除项目"${itemName}"吗？`)) {
      removeItemFromCategory(categoryName, itemName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">管理项目类别</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 添加新类别 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">添加新类别</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入类别名称"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 添加新项目 */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">添加新项目</h3>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">选择类别</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="输入项目名称"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <button
                onClick={handleAddItem}
                disabled={!selectedCategory || !newItemName.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 类别和项目列表 */}
          <div className="space-y-6">
            {Object.entries(categories).map(([categoryName, items]) => (
              <div key={categoryName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{categoryName}</h3>
                  <button
                    onClick={() => handleRemoveCategory(categoryName)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((item) => (
                    <div key={item} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{item}</span>
                      <button
                        onClick={() => handleRemoveItem(categoryName, item)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-full">该类别下暂无项目</p>
                  )}
                </div>
              </div>
            ))}
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