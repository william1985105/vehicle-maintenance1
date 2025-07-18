import { useState, useEffect } from 'react';
import { MaintenanceRecord, IncompleteItem, Reminder, PurchasedItem, FuelRecord, CustomCategories, DEFAULT_MAINTENANCE_CATEGORIES, FuelOptions, DEFAULT_FUEL_OPTIONS } from '../types';

const STORAGE_KEY = 'vehicle_maintenance_data';
const CATEGORIES_KEY = 'vehicle_maintenance_categories';
const FUEL_OPTIONS_KEY = 'vehicle_fuel_options';

interface MaintenanceData {
  records: MaintenanceRecord[];
  incompleteItems: IncompleteItem[];
  reminders: Reminder[];
  purchasedItems: PurchasedItem[];
  fuelRecords: FuelRecord[];
}

export const useMaintenanceData = () => {
  const [data, setData] = useState<MaintenanceData>({
    records: [],
    incompleteItems: [],
    reminders: [],
    purchasedItems: [],
    fuelRecords: []
  });

  const [categories, setCategories] = useState<CustomCategories>(DEFAULT_MAINTENANCE_CATEGORIES);
  const [fuelOptions, setFuelOptions] = useState<FuelOptions>(DEFAULT_FUEL_OPTIONS);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 确保 fuelRecords 字段存在，并为旧数据添加新字段
      const fuelRecords = (parsedData.fuelRecords || []).map((record: any) => ({
        ...record,
        preDiscountPrice: record.preDiscountPrice || record.originalPrice || 0,
        attachments: record.attachments || []
      }));
      
      setData({
        records: parsedData.records || [],
        incompleteItems: parsedData.incompleteItems || [],
        reminders: parsedData.reminders || [],
        purchasedItems: parsedData.purchasedItems || [],
        fuelRecords
      });
    }

    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    const savedFuelOptions = localStorage.getItem(FUEL_OPTIONS_KEY);
    if (savedFuelOptions) {
      const options = JSON.parse(savedFuelOptions);
      // 确保包含 locations 字段
      setFuelOptions({
        ...options,
        locations: options.locations || DEFAULT_FUEL_OPTIONS.locations
      });
    }
  }, []);

  const saveData = (newData: MaintenanceData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const saveCategories = (newCategories: CustomCategories) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
  };

  const saveFuelOptions = (newFuelOptions: FuelOptions) => {
    setFuelOptions(newFuelOptions);
    localStorage.setItem(FUEL_OPTIONS_KEY, JSON.stringify(newFuelOptions));
  };

  // 导入所有数据
  const importAllData = async (importedData: any) => {
    try {
      // 导入主要数据
      if (importedData.records || importedData.incompleteItems || importedData.reminders || 
          importedData.purchasedItems || importedData.fuelRecords) {
        const newData: MaintenanceData = {
          records: importedData.records || [],
          incompleteItems: importedData.incompleteItems || [],
          reminders: importedData.reminders || [],
          purchasedItems: importedData.purchasedItems || [],
          fuelRecords: (importedData.fuelRecords || []).map((record: any) => ({
            ...record,
            preDiscountPrice: record.preDiscountPrice || record.originalPrice || 0,
            attachments: record.attachments || []
          }))
        };
        saveData(newData);
      }

      // 导入类别数据
      if (importedData.categories) {
        saveCategories(importedData.categories);
      }

      // 导入加油选项
      if (importedData.fuelOptions) {
        const options = {
          ...importedData.fuelOptions,
          locations: importedData.fuelOptions.locations || DEFAULT_FUEL_OPTIONS.locations
        };
        saveFuelOptions(options);
      }

      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error('数据格式错误或导入失败');
    }
  };

  const addCategory = (categoryName: string) => {
    if (!categories[categoryName]) {
      const newCategories = { ...categories, [categoryName]: [] };
      saveCategories(newCategories);
    }
  };

  const removeCategory = (categoryName: string) => {
    const newCategories = { ...categories };
    delete newCategories[categoryName];
    saveCategories(newCategories);
  };

  const addItemToCategory = (categoryName: string, itemName: string) => {
    if (categories[categoryName] && !categories[categoryName].includes(itemName)) {
      const newCategories = {
        ...categories,
        [categoryName]: [...categories[categoryName], itemName]
      };
      saveCategories(newCategories);
    }
  };

  const removeItemFromCategory = (categoryName: string, itemName: string) => {
    if (categories[categoryName]) {
      const newCategories = {
        ...categories,
        [categoryName]: categories[categoryName].filter(item => item !== itemName)
      };
      saveCategories(newCategories);
    }
  };

  // 加油选项管理
  const addFuelType = (fuelType: string) => {
    if (!fuelOptions.fuelTypes.includes(fuelType)) {
      const newFuelOptions = {
        ...fuelOptions,
        fuelTypes: [...fuelOptions.fuelTypes, fuelType]
      };
      saveFuelOptions(newFuelOptions);
    }
  };

  const removeFuelType = (fuelType: string) => {
    const newFuelOptions = {
      ...fuelOptions,
      fuelTypes: fuelOptions.fuelTypes.filter(type => type !== fuelType)
    };
    saveFuelOptions(newFuelOptions);
  };

  const addPaymentMethod = (paymentMethod: string) => {
    if (!fuelOptions.paymentMethods.includes(paymentMethod)) {
      const newFuelOptions = {
        ...fuelOptions,
        paymentMethods: [...fuelOptions.paymentMethods, paymentMethod]
      };
      saveFuelOptions(newFuelOptions);
    }
  };

  const removePaymentMethod = (paymentMethod: string) => {
    const newFuelOptions = {
      ...fuelOptions,
      paymentMethods: fuelOptions.paymentMethods.filter(method => method !== paymentMethod)
    };
    saveFuelOptions(newFuelOptions);
  };

  const addGasStation = (gasStation: string) => {
    if (!fuelOptions.gasStations.includes(gasStation)) {
      const newFuelOptions = {
        ...fuelOptions,
        gasStations: [...fuelOptions.gasStations, gasStation]
      };
      saveFuelOptions(newFuelOptions);
    }
  };

  const removeGasStation = (gasStation: string) => {
    const newFuelOptions = {
      ...fuelOptions,
      gasStations: fuelOptions.gasStations.filter(station => station !== gasStation)
    };
    saveFuelOptions(newFuelOptions);
  };

  const addLocation = (location: string) => {
    if (!fuelOptions.locations.includes(location)) {
      const newFuelOptions = {
        ...fuelOptions,
        locations: [...fuelOptions.locations, location]
      };
      saveFuelOptions(newFuelOptions);
    }
  };

  const removeLocation = (location: string) => {
    const newFuelOptions = {
      ...fuelOptions,
      locations: fuelOptions.locations.filter(loc => loc !== location)
    };
    saveFuelOptions(newFuelOptions);
  };

  const addRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: Date.now().toString()
    };
    
    // 更新提醒状态
    const updatedReminders = data.reminders.map(reminder => {
      if (record.completedReminders.includes(reminder.id)) {
        return { ...reminder, completed: true };
      }
      return reminder;
    });

    // 更新购买项目的剩余数量
    const updatedPurchasedItems = data.purchasedItems.map(item => {
      const usedInRecord = record.items.find(recordItem => 
        recordItem.name === item.name && recordItem.category === item.category
      );
      if (usedInRecord && item.isMultiUse) {
        return {
          ...item,
          remainingQuantity: Math.max(0, item.remainingQuantity - 1)
        };
      }
      return item;
    });
    
    const newData = {
      ...data,
      records: [newRecord, ...data.records],
      incompleteItems: [...data.incompleteItems, ...record.incompleteItems],
      reminders: updatedReminders,
      purchasedItems: updatedPurchasedItems
    };
    
    saveData(newData);
    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<MaintenanceRecord>) => {
    const updatedRecords = data.records.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    
    saveData({
      ...data,
      records: updatedRecords
    });
  };

  const updateIncompleteItem = (id: string, updates: Partial<IncompleteItem>) => {
    const updatedItems = data.incompleteItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    
    saveData({
      ...data,
      incompleteItems: updatedItems
    });
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      completed: false
    };
    
    saveData({
      ...data,
      reminders: [...data.reminders, newReminder]
    });
  };

  const removeReminder = (id: string) => {
    const filteredReminders = data.reminders.filter(r => r.id !== id);
    saveData({
      ...data,
      reminders: filteredReminders
    });
  };

  const addPurchasedItem = (item: Omit<PurchasedItem, 'id'>) => {
    const newItem: PurchasedItem = {
      ...item,
      id: Date.now().toString()
    };
    
    saveData({
      ...data,
      purchasedItems: [...data.purchasedItems, newItem]
    });
  };

  const updatePurchasedItem = (id: string, updates: Partial<PurchasedItem>) => {
    const updatedItems = data.purchasedItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    
    saveData({
      ...data,
      purchasedItems: updatedItems
    });
  };

  const removePurchasedItem = (id: string) => {
    const filteredItems = data.purchasedItems.filter(item => item.id !== id);
    saveData({
      ...data,
      purchasedItems: filteredItems
    });
  };

  // 加油记录相关方法
  const addFuelRecord = (record: Omit<FuelRecord, 'id'>) => {
    const newRecord: FuelRecord = {
      ...record,
      id: Date.now().toString()
    };
    
    const newData = {
      ...data,
      fuelRecords: [newRecord, ...data.fuelRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())]
    };
    
    saveData(newData);
    return newRecord;
  };

  const updateFuelRecord = (id: string, updates: Partial<FuelRecord>) => {
    const updatedRecords = data.fuelRecords.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    
    saveData({
      ...data,
      fuelRecords: updatedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });
  };

  const removeFuelRecord = (id: string) => {
    const filteredRecords = data.fuelRecords.filter(record => record.id !== id);
    saveData({
      ...data,
      fuelRecords: filteredRecords
    });
  };

  return {
    ...data,
    categories,
    fuelOptions,
    addRecord,
    updateRecord,
    updateIncompleteItem,
    addReminder,
    removeReminder,
    addPurchasedItem,
    updatePurchasedItem,
    removePurchasedItem,
    addFuelRecord,
    updateFuelRecord,
    removeFuelRecord,
    addCategory,
    removeCategory,
    addItemToCategory,
    removeItemFromCategory,
    addFuelType,
    removeFuelType,
    addPaymentMethod,
    removePaymentMethod,
    addGasStation,
    removeGasStation,
    addLocation,
    removeLocation,
    importAllData
  };
};