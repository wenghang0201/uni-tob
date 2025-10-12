import cfg from '@/util/environment.js';

class SSEServiceNative {
  constructor() {
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 50000;
    this.reconnectInterval = 3000; // 3秒重连间隔
    this.listeners = new Map();
    this.nativeSSEConnected = false;
    if (window.NativeBridge)
    {
		// 调试：检查方法是否存在
		setTimeout(() => {
		  this.debugMethods();
		}, 100);
		// 设置原生SSE回调
		this.setupNativeSSECallbacks();
    }
  }

  /**
   * 设置原生SSE回调函数
   */
  setupNativeSSECallbacks() {
    console.log('设置原生SSE回调函数');
    
    // 连接成功回调
    window.onNativeSSEConnected = () => {
      console.log('原生SSE连接成功');
      this.isConnected = true;
      this.nativeSSEConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected', { type: 'native' });
    };
    
    // 连接断开回调
    window.onNativeSSEDisconnected = () => {
      console.log('原生SSE连接断开');
      this.isConnected = false;
      this.nativeSSEConnected = false;
      this.emit('disconnected', { type: 'native' });
    };
    
    // 消息接收回调
    window.onNativeSSEMessage = (jsondata) => {
      try {
        console.log('收到原生SSE消息:', jsondata);
        
        // 尝试解析JSON数据
        let parsedData;
        try {
          parsedData = JSON.parse(jsondata);
        } catch (e) {
          // 如果不是JSON，直接使用原始数据
          parsedData = { data: jsondata };
        }
        
        console.log('解析后的SSE消息:', parsedData);
        
        // 触发通用消息事件
        this.emit('message', parsedData);
        
        // 根据消息类型分发事件
        if (parsedData.type) {
          this.emit(parsedData.type, parsedData);
          
          // 当type为2的时候，原生端已经处理了音效播放，这里只需要记录日志
          if (parsedData.type === 2) {
            console.log('收到订单通知，音效播放由原生端处理');
          }
        }
        
      } catch (error) {
        console.error('处理原生SSE消息失败:', error);
        console.error('原始消息内容:', jsondata);
      }
    };
    
    // 连接错误回调
    window.onNativeSSEError = (error) => {
      console.error('原生SSE连接错误:', error);
      this.isConnected = false;
      this.nativeSSEConnected = false;
      this.emit('error', { type: 'native', error: error });
    };
	
    
    console.log('原生SSE回调函数设置完成');
  }

  /**
   * 连接到SSE服务器
   * @param {string} endpoint - SSE端点路径，默认为 /sse/connect
   * @param {Object} options - 连接选项
   */
  connect(endpoint = '/sse/connect', options = {}) {
    if (this.isConnected) {
      console.log('SSE连接已存在');
      return;
    }

    try {
      // 构建完整的SSE URL
      const baseUrl = cfg.BASE_API;
      let vue_userInfo = uni.getStorageSync('vue_userInfo');
      let tenantId = vue_userInfo.tenantId;
      let userId = vue_userInfo.id;
      console.log('SSE连接参数:', {
        baseUrl,
        tenantId,
        userId,
        endpoint
      });
      if(!tenantId || !userId){
		return;
      }
      // 将token作为URL参数传递
      const urlParams = new URLSearchParams();
      urlParams.append('tenantId', tenantId);
      urlParams.append('userId', userId);
      
      const sseUrl = `${baseUrl}${endpoint}?${urlParams.toString()}`;
      console.log('尝试建立原生SSE连接:', sseUrl);
      
      // 检查是否已有原生SSE连接
      if (window.NativeBridge.isNativeSSEConnected()) {
        console.log('检测到已有原生SSE连接，先断开');
        window.NativeBridge.stopNativeSSE();
      }
      
      // 配置重连参数
      window.NativeBridge.setNativeSSEReconnectConfig(
        this.reconnectInterval,
        10000, // 最大重连延迟30秒
        this.maxReconnectAttempts
      );
      
      // 获取音频文件URL
      const orderAudioUrl = options.orderAudioUrl || 'https://a.kull.fun/audio/new_order.mp3';
      
      // 启动原生SSE连接
      window.NativeBridge.startNativeSSE(sseUrl, orderAudioUrl);
      
      console.log('原生SSE连接请求已发送');
      
    } catch (error) {
      console.error('原生SSE连接失败:', error);
      this.emit('error', { type: 'native', error: error });
    }
  }

  /**
   * 断开SSE连接
   */
  disconnect() {
    if (this.nativeSSEConnected) {
      console.log('断开原生SSE连接');
      window.NativeBridge.stopNativeSSE();
      this.nativeSSEConnected = false;
    }
    
    this.isConnected = false;
    console.log('原生SSE连接已断开');
    this.emit('disconnected');
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
          console.error('SSE事件回调执行失败:', error);
        }
      });
    }
  }

  /**
   * 调试方法：检查所有必要方法是否存在
   */
  debugMethods() {
    const methods = [
      'emit',
      'on',
      'off',
      'connect',
      'disconnect'
    ];
    
    console.log('=== 原生SSE服务方法检查 ===');
    methods.forEach(method => {
      const exists = typeof this[method] === 'function';
      console.log(`${method}: ${exists ? '✓' : '✗'}`);
    });
    
    // 检查原生方法
    console.log('=== 原生方法检查 ===');
    const nativeMethods = [
      'startNativeSSE',
      'stopNativeSSE',
      'isNativeSSEConnected',
      'setNativeSSEReconnectConfig',
      'playMusic'
    ];
    
    nativeMethods.forEach(method => {
      const exists = typeof window.NativeBridge[method] === 'function';
      console.log(`NativeBridge.${method}: ${exists ? '✓' : '✗'}`);
    });
    console.log('=======================');
  }

  /**
   * 获取连接状态
   * @returns {boolean}
   */
  getConnectionStatus() {
    try {
      const nativeConnected = window.NativeBridge.isNativeSSEConnected();
      // 同步状态
      if (nativeConnected !== this.isConnected) {
        this.isConnected = nativeConnected;
        this.nativeSSEConnected = nativeConnected;
      }
      return nativeConnected;
    } catch (error) {
      console.error('检查原生SSE连接状态失败:', error);
      return this.isConnected;
    }
  }

  /**
   * 强制同步连接状态
   */
  syncConnectionStatus() {
    try {
      const nativeConnected = window.NativeBridge.isNativeSSEConnected();
      if (nativeConnected !== this.isConnected) {
        console.log('同步连接状态:', this.isConnected, '->', nativeConnected);
        this.isConnected = nativeConnected;
        this.nativeSSEConnected = nativeConnected;
        
        // 触发相应事件
        if (nativeConnected) {
          this.emit('connected', { type: 'sync' });
        } else {
          this.emit('disconnected', { type: 'sync' });
        }
      }
    } catch (error) {
      console.error('同步连接状态失败:', error);
    }
  }
}

// 创建单例实例
const sseServiceNative = new SSEServiceNative();

export default sseServiceNative; 