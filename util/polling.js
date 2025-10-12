import cfg from '@/util/environment.js';
import request from '@/util/ajax';

class PollingService {
  constructor() {
    this.isPolling = false;
    this.pollingInterval = null;
    this.pollInterval = 5000; // 5秒轮询间隔
    this.lastMessageId = null;
    this.listeners = new Map();
    this.maxRetries = 3;
    this.retryCount = 0;
  }

  /**
   * 开始轮询
   * @param {string} endpoint - 轮询端点
   * @param {Object} options - 轮询选项
   */
  startPolling(endpoint = '/sse/connect', options = {}) {
    if (this.isPolling) {
      console.log('轮询已在进行中');
      return;
    }

    this.isPolling = true;
    this.pollingEndpoint = endpoint;
    this.pollingOptions = options;
    
    console.log('开始轮询:', endpoint);
    this.poll();
  }

  /**
   * 执行轮询
   */
  async poll() {
    if (!this.isPolling) return;

    try {
      const response = await request({
        url: this.pollingEndpoint,
        method: 'GET',
        params: {
          lastMessageId: this.lastMessageId,
          timestamp: Date.now()
        }
      });

      if (response && response.success) {
        this.retryCount = 0; // 重置重试计数
        
        if (response.data && Array.isArray(response.data)) {
          // 处理消息数组
          response.data.forEach(message => {
            this.handleMessage(message);
          });
        } else if (response.data) {
          // 处理单个消息
          this.handleMessage(response.data);
        }
      }
    } catch (error) {
      console.error('轮询请求失败:', error);
      this.retryCount++;
      
      if (this.retryCount >= this.maxRetries) {
        console.error('轮询重试次数已达上限，停止轮询');
        this.stopPolling();
        this.emit('polling_failed', error);
        return;
      }
    }

    // 设置下次轮询
    if (this.isPolling) {
      this.pollingInterval = setTimeout(() => {
        this.poll();
      }, this.pollInterval);
    }
  }

  /**
   * 处理轮询消息
   * @param {Object} message - 消息数据
   */
  handleMessage(message) {
    console.log('收到轮询消息:', message);
    
    // 更新最后消息ID
    if (message.id) {
      this.lastMessageId = message.id;
    }
    
    // 触发消息事件
    this.emit('message', message);
    
    // 根据消息类型分发事件
    if (message.type) {
      this.emit(message.type, message);
    }
  }

  /**
   * 停止轮询
   */
  stopPolling() {
    this.isPolling = false;
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
    console.log('轮询已停止');
    this.emit('polling_stopped');
  }

  /**
   * 设置轮询间隔
   * @param {number} interval - 轮询间隔（毫秒）
   */
  setPollInterval(interval) {
    this.pollInterval = interval;
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名称
   * @param {*} data - 事件数据
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('轮询事件回调执行失败:', error);
        }
      });
    }
  }

  /**
   * 获取轮询状态
   * @returns {boolean}
   */
  getPollingStatus() {
    return this.isPolling;
  }
}

// 创建单例实例
const pollingService = new PollingService();

export default pollingService; 