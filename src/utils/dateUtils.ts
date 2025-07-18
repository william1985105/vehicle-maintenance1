import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr: string = 'yyyy年MM月dd日') => {
  return format(new Date(date), formatStr, { locale: zhCN });
};

export const isDateExpired = (date: string | Date) => {
  return new Date(date) < new Date();
};

export const getDaysUntil = (date: string | Date) => {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};