import SSEServiceNative from './SSEService_native.js';
import SSEServiceH5 from './SSEService_h5.js';

/**
 * 统一的SSE服务入口
 * 根据运行环境自动选择合适的实现
 */
class SSEService {
  constructor() {
    // 检查是否在原生环境中
    this.isNativeEnvironment = typeof window !== 'undefined' && window.NativeBridge;
    
    // 根据环境选择合适的实现
    if (this.isNativeEnvironment) {
      console.log('检测到原生环境，使用原生SSE服务');
      this.implementation = SSEServiceNative;
    } else {
      console.log('检测到H5环境，使用H5 SSE服务');
      this.implementation = SSEServiceH5;
    }
  }

  /**
   * 连接到SSE服务器
   * @param {string} endpoint - SSE端点路径
   * @param {Object} options - 连接选项
   */
  connect(endpoint, options) {
    return this.implementation.connect(endpoint, options);
  }

  /**
   * 断开SSE连接
   */
  disconnect() {
    return this.implementation.disconnect();
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    return this.implementation.on(event, callback);
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  off(event, callback) {
    return this.implementation.off(event, callback);
  }

  /**
   * 获取连接状态
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.implementation.getConnectionStatus();
  }

  /**
   * 强制同步连接状态
   */
  syncConnectionStatus() {
    return this.implementation.syncConnectionStatus();
  }

  /**
   * 用户交互后初始化音频（仅H5环境需要）
   */
  initAudioOnUserInteraction() {
    if (this.implementation.initAudioOnUserInteraction) {
      return this.implementation.initAudioOnUserInteraction();
    }
  }

  /**
   * 检查服务器SSE响应格式（仅H5环境需要）
   */
  checkServerResponse() {
    if (this.implementation.checkServerResponse) {
      return this.implementation.checkServerResponse();
    }
  }

  /**
   * 获取当前环境类型
   * @returns {string} 'native' | 'h5'
   */
  getEnvironmentType() {
    return this.isNativeEnvironment ? 'native' : 'h5';
  }

  /**
   * 获取底层实现实例
   * @returns {SSEServiceNative | SSEServiceH5}
   */
  getImplementation() {
    return this.implementation;
  }
  
  playOrderSound() {
	if (this.implementation.playOrderSound) {
		return this.implementation.playOrderSound();
	}
  }
}

// 创建单例实例
const sseService = new SSEService();

export default sseService; 