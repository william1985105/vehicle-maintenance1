export interface MaintenanceItem {
  id: string;
  category: string;
  name: string;
  originalPrice: number;
  actualPrice: number;
  completed: boolean;
  notes?: string; // 新增备注字段
}

export interface IncompleteItem {
  id: string;
  name: string;
  description: string;
  dateFound: string;
  completed: boolean;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  items: MaintenanceItem[];
  totalOriginalCost: number;
  totalActualCost: number;
  attachments: FileAttachment[];
  incompleteItems: IncompleteItem[];
  notes: string;
  completedReminders: string[]; // 本次完成的提醒ID
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  items: ReminderItem[];
  dueDate?: string;
  dueMileage?: number;
  type: 'time' | 'mileage' | 'both';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface ReminderItem {
  id: string;
  category: string;
  name: string;
  estimatedPrice?: number;
}

export interface PurchasedItem {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  expiryDate?: string;
  quantity: number;
  totalQuantity: number; // 总数量（用于多次使用的项目）
  remainingQuantity: number; // 剩余数量
  price: number;
  supplier?: string;
  notes?: string;
  isMultiUse: boolean; // 是否为多次使用项目
}

// 修改：加油记录接口
export interface FuelRecord {
  id: string;
  date: string;
  mileage: number;
  fuelAmount: number; // 加油量（升）
  preDiscountPrice: number; // 优惠前单价（每升）
  originalPrice: number; // 原价（每升）
  totalCost: number; // 实际总费用
  discountedPrice: number; // 优惠后单价（自动计算）
  gasStation: string; // 加油站
  fuelType: string; // 油品类型（可自定义）
  isFullTank: boolean; // 是否加满
  notes?: string;
  location: string; // 地点，默认武汉
  paymentMethod: string; // 支付方式（可自定义）
  attachments: FileAttachment[]; // 附件
}

// 自定义类别和项目管理
export interface CustomCategories {
  [category: string]: string[];
}

// 加油相关的自定义选项
export interface FuelOptions {
  fuelTypes: string[];
  paymentMethods: string[];
  gasStations: string[];
  locations: string[]; // 新增地点选项
}

// 预定义的保养类别和项目（可编辑）
export const DEFAULT_MAINTENANCE_CATEGORIES: CustomCategories = {
  '发动机': [
    '更换机油',
    '更换机油滤清器',
    '更换空气滤清器',
    '更换火花塞',
    '清洗节气门',
    '更换正时皮带',
    '检查发动机皮带'
  ],
  '刹车系统': [
    '更换刹车片',
    '更换刹车盘',
    '更换刹车油',
    '检查刹车管路',
    '调整手刹'
  ],
  '轮胎': [
    '更换轮胎',
    '轮胎换位',
    '四轮定位',
    '动平衡',
    '补胎'
  ],
  '油液': [
    '更换变速箱油',
    '更换冷却液',
    '更换助力转向油',
    '更换玻璃水',
    '更换防冻液'
  ],
  '电气系统': [
    '更换电瓶',
    '检查发电机',
    '更换保险丝',
    '检查线路',
    '更换灯泡'
  ],
  '空调系统': [
    '更换空调滤清器',
    '空调清洗',
    '添加制冷剂',
    '检查空调管路'
  ],
  '底盘': [
    '更换减震器',
    '检查悬挂',
    '更换球头',
    '检查传动轴',
    '底盘防锈'
  ],
  '其他': [
    '年检',
    '保险',
    '洗车',
    '打蜡',
    '内饰清洁'
  ]
};

// 默认加油选项
export const DEFAULT_FUEL_OPTIONS: FuelOptions = {
  fuelTypes: ['92号汽油', '95号汽油', '98号汽油', '0号柴油', '-10号柴油', '-20号柴油'],
  paymentMethods: ['现金', '银行卡', '微信', '支付宝', '油卡'],
  gasStations: ['中石化', '中石油', '中海油', '壳牌', '道达尔', 'BP', '加德士'],
  locations: ['武汉', '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆', '西安']
};