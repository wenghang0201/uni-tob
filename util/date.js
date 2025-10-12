/**
 * 日期格式化
 * @param {Date} date 日期对象
 * @param {String} fmt 格式化模式 例如：yyyy-MM-dd HH:mm:ss
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, fmt) {
  if (!date) {
    return '';
  }
  
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }
  
  if (typeof date === 'number') {
    date = new Date(date);
  }
  
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'H+': date.getHours(), // 24小时制
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  
  return fmt;
}

/**
 * 获取一周前的日期
 * @returns {String} 格式为 yyyy-MM-dd 的日期字符串
 */
export function getOneWeekAgo() {
  const date = new Date();
  date.setTime(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * 获取今天的日期
 * @returns {String} 格式为 yyyy-MM-dd 的日期字符串
 */
export function getToday() {
  return formatDate(new Date(), 'yyyy-MM-dd');
}

/**
 * 获取日期范围
 * @param {Number} days 天数
 * @returns {Object} 日期范围对象，包含 startDate 和 endDate
 */
export function getDateRange(days = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setTime(startDate.getTime() - days * 24 * 60 * 60 * 1000);
  
  return {
    startDate: formatDate(startDate, 'yyyy-MM-dd'),
    endDate: formatDate(endDate, 'yyyy-MM-dd')
  };
}

/**
 * 计算两个日期之间的天数
 * @param {Date|String} startDate 开始日期
 * @param {Date|String} endDate 结束日期
 * @returns {Number} 天数
 */
export function getDaysBetween(startDate, endDate) {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate.replace(/-/g, '/'));
  }
  
  if (typeof endDate === 'string') {
    endDate = new Date(endDate.replace(/-/g, '/'));
  }
  
  // 将时间调整为当天的0点0分0秒
  startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  // 计算天数差值
  return Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
} 