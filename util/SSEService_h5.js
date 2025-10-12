import cfg from '@/util/environment.js';

class SSEServiceH5 {
  constructor() {
    this.eventSource = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 50000;
    this.reconnectInterval = 3000; // 3秒重连间隔
    this.listeners = new Map();
    
    // 音频相关
    this.audioContext = null;
    this.audioInitialized = false;
    this.pendingPlayQueue = []; // 待播放队列
    
    // 调试：检查方法是否存在
    setTimeout(() => {
      this.debugMethods();
    }, 100);
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
	  if(!tenantId || !userId){
		  this.handleConnectionError();
		  return;
	  }
      console.log('SSE连接参数:', {
        baseUrl,
        tenantId,
        userId,
        endpoint
      });
      
      // 将token作为URL参数传递
      const urlParams = new URLSearchParams();
      urlParams.append('tenantId', tenantId);
      urlParams.append('userId', userId);
      
      const sseUrl = `${baseUrl}${endpoint}?${urlParams.toString()}`;
      console.log('尝试建立H5 SSE连接:', sseUrl);
      
      // 使用EventSource连接
      this.connectWithEventSource(sseUrl);
      
    } catch (error) {
      console.error('H5 SSE连接失败:', error);
      this.handleConnectionError();
    }
  }

  /**
   * 使用EventSource连接
   */
  connectWithEventSource(sseUrl) {
    // 检查EventSource是否可用
    if (typeof EventSource === 'undefined') {
      throw new Error('EventSource不支持');
    }
    
    // 创建EventSource实例
    this.eventSource = new EventSource(sseUrl);
    console.log('EventSource实例已创建:', this.eventSource);
    
    // 立即检查连接状态
    console.log('EventSource readyState:', this.eventSource.readyState);
    console.log('EventSource URL:', this.eventSource.url);

    this.setupEventListeners();
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    console.log('H5 SSE连接已建立:', sseUrl);
    
    // 设置页面可见性变化监听，确保后台也能保持连接
    this.setupVisibilityListener();
  }

  /**
   * 设置事件监听器（EventSource）
   */
  setupEventListeners() {
    if (!this.eventSource) {
      console.error('SSE连接不存在');
      return;
    }

    console.log('开始设置H5 SSE事件监听器');
    console.log('EventSource状态:', this.eventSource.readyState);

    // 连接打开事件
    this.eventSource.onopen = (event) => {
      console.log('H5 SSE连接已打开 - onopen事件触发');
      console.log('onopen事件详情:', event);
      console.log('连接状态变化: CONNECTING -> OPEN');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected', event);
    };

    // 消息接收事件
    this.eventSource.onmessage = (event) => {
      try {
        console.log('收到H5 SSE原始消息:', event.data);
        const data = JSON.parse(event.data);
        console.log('解析后的H5 SSE消息:', data);
        
        this.emit('message', data);
        
        // 根据消息类型分发事件
        if (data.type) {
          this.emit(data.type, data);
          this.handleSSEMessage(data);
        }
      } catch (error) {
        console.error('解析H5 SSE消息失败:', error);
        console.error('原始消息内容:', event.data);
      }
    };

    // 错误处理
    this.eventSource.onerror = (event) => {
      console.error('H5 SSE连接错误 - onerror事件触发');
      console.error('错误事件详情:', event);
      console.error('EventSource状态:', {
        readyState: this.eventSource.readyState,
        url: this.eventSource.url,
        CONNECTING: EventSource.CONNECTING,
        OPEN: EventSource.OPEN,
        CLOSED: EventSource.CLOSED
      });
      
      // 检查是否是MIME类型错误
      if (event.target && event.target.readyState === EventSource.CLOSED) {
        console.error('H5 SSE连接被关闭，可能是MIME类型错误');
        uni.showToast({
          title: 'SSE连接失败，请检查服务器配置',
          icon: 'none'
        });
      }
      
      this.isConnected = false;
      this.emit('error', event);
      this.handleConnectionError();
    };
  }

  /**
   * 处理连接错误和重连
   */
  handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`H5 SSE重连尝试 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.disconnect();
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('H5 SSE重连失败，已达到最大重试次数');
      this.emit('reconnect_failed');
    }
  }

  /**
   * 断开SSE连接
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.isConnected = false;
    console.log('H5 SSE连接已断开');
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
          console.error('H5 SSE事件回调执行失败:', error);
        }
      });
    }
  }

  /**
   * 设置页面可见性监听器
   */
  setupVisibilityListener() {
    // 监听页面可见性变化
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.log('页面进入后台，保持H5 SSE连接');
        } else {
          console.log('页面回到前台，H5 SSE连接状态:', this.isConnected);
        }
      });
    }
  }

  /**
   * 初始化音频上下文
   */
  initAudioContext() {
    try {
      // 检查是否支持音频API
      if (typeof uni !== 'undefined' && uni.createInnerAudioContext) {
        this.audioContext = uni.createInnerAudioContext();
        this.audioContext.autoplay = false; // 不自动播放，避免浏览器限制
        this.audioContext.loop = false;
        
        this.audioContext.src = '/static/audio/new_order.mp3';
        
        // 设置事件监听
        this.audioContext.onPlay(() => {
          console.log('H5订单音效开始播放');
        });
        
        this.audioContext.onError((res) => {
          console.error('H5音频播放错误:', res.errMsg, res.errCode);
          // 如果是用户交互限制，记录但不报错
          if (res.errCode === 10001) {
            console.log('H5音频播放被浏览器限制，需要用户交互');
          }
        });
        
        this.audioContext.onEnded(() => {
          console.log('H5订单音效播放结束');
        });
        
        this.audioInitialized = true;
        console.log('H5音频上下文初始化成功');
        
        // 处理待播放队列
        this.processPendingPlayQueue();
      } else {
        console.warn('当前环境不支持音频播放');
      }
    } catch (error) {
      console.error('初始化H5音频上下文失败:', error);
    }
  }

  /**
   * 处理待播放队列
   */
  processPendingPlayQueue() {
    if (this.pendingPlayQueue.length > 0) {
      console.log(`处理H5待播放队列，共 ${this.pendingPlayQueue.length} 个待播放`);
      this.pendingPlayQueue.forEach(() => {
        this.playOrderSound();
      });
      this.pendingPlayQueue = [];
    }
  }
	/**
	 * 处理SSE消息
	 * @param {Object} data - 消息数据
	 */
	handleSSEMessage(data) {
		// 根据消息类型处理不同的业务逻辑
		switch (data.type) {
			case 2:
				// 处理新订单
				this.handleNewOrder(data);
				break;
			case 4:
				// 定时
				this.handleOrderStatusChange(data);
				break;
			case 1:
				// 处理通知消息
				this.handleNotification(data);
				break;
			case 3:
				// 处理系统警告
				this.handleSystemAlert(data);
				break;
			default:
				console.log('未处理的SSE消息类型:', data.type);
		}
	}
	/**
	 * 处理新订单消息
	 * @param {Object} data - 新订单数据
	 */
	handleNewOrder(data) {
		console.log('新订单:', data);
		console.log('播放订单音效');
		// 从本地存储读取声音设置
		const savedSoundEnabled = uni.getStorageSync('orderSoundEnabled');
		let orderSoundEnabled = savedSoundEnabled !== '' ? savedSoundEnabled : true;
		if(orderSoundEnabled){
			// 确保playOrderSound方法被调用
			if (typeof this.playOrderSound === 'function') {
				this.playOrderSound();
			} else {
				console.error('playOrderSound方法不存在');
			}
		}
		// // 显示通知
		// uni.showToast({
		// 	title: '收到新订单',
		// 	icon: 'success'
		// });
	}
	/**
	 * 处理订单状态变更消息
	 * @param {Object} data - 状态变更数据
	 */
	handleOrderStatusChange(data) {
		console.log('订单状态变更:', data);
		
		// 显示通知
		uni.showToast({
			title: '订单状态已变更',
			icon: 'success'
		});
	}
	
	/**
	 * 处理通知消息
	 * @param {Object} data - 通知数据
	 */
	handleNotification(data) {
		console.log('收到通知:', data);
		
		// 显示通知
		uni.showToast({
			title: data.message || '收到新通知',
			icon: 'none'
		});
	}
	
	/**
	 * 处理系统警告消息
	 * @param {Object} data - 警告数据
	 */
	handleSystemAlert(data) {
		console.log('系统警告:', data);
		
		// 显示警告弹窗
		uni.showModal({
			title: '系统提示',
			content: data.message || '系统维护通知',
			showCancel: false
		});
	}
  /**
   * 播放订单音效
   */
  playOrderSound() {
    try {
      // 如果音频未初始化，先初始化
      if (!this.audioContext && !this.audioInitialized) {
        console.log('H5音频未初始化，添加到待播放队列');
        this.pendingPlayQueue.push(true);
        this.initAudioContext();
        return;
      }
      
      // 如果音频上下文存在且已初始化
      if (this.audioContext && this.audioInitialized) {
        console.log('播放H5订单音效');
        this.audioContext.play();
      } else {
        // 如果还在初始化中，添加到待播放队列
        console.log('H5音频正在初始化，添加到待播放队列');
        this.pendingPlayQueue.push(true);
      }
    } catch (error) {
      console.error('播放H5音效失败:', error);
      // 如果是用户交互限制，添加到待播放队列
      if (error.message && error.message.includes('user didn\'t interact')) {
        console.log('H5播放被浏览器限制，添加到待播放队列');
        this.pendingPlayQueue.push(true);
      }
    }
  }

  /**
   * 检查服务器SSE响应格式
   */
  checkServerResponse() {
    if (!this.eventSource) {
      console.log('EventSource不存在，无法检查服务器响应');
      return;
    }

    console.log('检查服务器H5 SSE响应格式...');
    
    // 尝试发送一个测试请求来检查服务器响应
    const testUrl = this.eventSource.url;
    console.log('测试URL:', testUrl);
    
    // 使用fetch检查响应头
    fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      console.log('服务器响应状态:', response.status);
      console.log('响应头:', {
        'content-type': response.headers.get('content-type'),
        'cache-control': response.headers.get('cache-control'),
        'connection': response.headers.get('connection')
      });
      
      if (response.headers.get('content-type') !== 'text/event-stream') {
        console.error('服务器响应Content-Type不正确，应该是text/event-stream');
      }
      
      if (response.status !== 200) {
        console.error('服务器响应状态码不正确，应该是200');
      }
    }).catch(error => {
      console.error('检查服务器响应失败:', error);
    });
  }

  /**
   * 用户交互后初始化音频（需要在用户点击等交互后调用）
   */
  initAudioOnUserInteraction() {
    console.log('用户交互触发H5音频初始化');
    if (!this.audioInitialized) {
      this.initAudioContext();
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
      'disconnect',
      'handleConnectionError',
      'playOrderSound',
      'initAudioContext',
      'initAudioOnUserInteraction'
    ];
    
    console.log('=== H5 SSE服务方法检查 ===');
    methods.forEach(method => {
      const exists = typeof this[method] === 'function';
      console.log(`${method}: ${exists ? '✓' : '✗'}`);
    });
    console.log('=======================');
  }

  /**
   * 获取连接状态
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * 强制同步连接状态
   */
  syncConnectionStatus() {
    // H5环境中，状态已经是同步的
    console.log('H5环境中，连接状态已同步:', this.isConnected);
  }
}

// 创建单例实例
const sseServiceH5 = new SSEServiceH5();

export default sseServiceH5; 