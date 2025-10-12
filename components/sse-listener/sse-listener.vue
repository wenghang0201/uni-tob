<template>
  <view class="sse-listener">
    <!-- 这是一个无UI的组件，仅用于监听SSE事件 -->
  </view>
</template>

<script>
export default {
  name: 'SSEListener',
  data() {
    return {
      listeners: []
    };
  },
  mounted() {
    this.setupGlobalListeners();
  },
  beforeDestroy() {
    this.removeGlobalListeners();
  },
  methods: {
    /**
     * 设置全局SSE事件监听器
     */
    setupGlobalListeners() {
      // 监听订单更新事件
      const orderUpdateListener = (data) => {
        console.log('全局收到订单更新:', data);
        this.handleOrderUpdate(data);
      };
      uni.$on('order-updated', orderUpdateListener);
      this.listeners.push({ event: 'order-updated', callback: orderUpdateListener });

      // 监听新订单事件
      const newOrderListener = (data) => {
        console.log('全局收到新订单:', data);
        this.handleNewOrder(data);
      };
      uni.$on('new-order-received', newOrderListener);
      this.listeners.push({ event: 'new-order-received', callback: newOrderListener });

      // 监听订单状态变更事件
      const orderStatusChangeListener = (data) => {
        console.log('全局收到订单状态变更:', data);
        this.handleOrderStatusChange(data);
      };
      uni.$on('order-status-changed', orderStatusChangeListener);
      this.listeners.push({ event: 'order-status-changed', callback: orderStatusChangeListener });

      // 监听通知事件
      const notificationListener = (data) => {
        console.log('全局收到通知:', data);
        this.handleNotification(data);
      };
      uni.$on('notification-received', notificationListener);
      this.listeners.push({ event: 'notification-received', callback: notificationListener });

      // 监听系统警告事件
      const systemAlertListener = (data) => {
        console.log('全局收到系统警告:', data);
        this.handleSystemAlert(data);
      };
      uni.$on('system-alert-received', systemAlertListener);
      this.listeners.push({ event: 'system-alert-received', callback: systemAlertListener });
    },

    /**
     * 移除全局SSE事件监听器
     */
    removeGlobalListeners() {
      this.listeners.forEach(({ event, callback }) => {
        uni.$off(event, callback);
      });
      this.listeners = [];
    },

    /**
     * 处理订单更新
     */
    handleOrderUpdate(data) {
      // 可以在这里添加全局的订单更新处理逻辑
      // 例如：更新本地缓存、显示通知等
      console.log('处理订单更新:', data);
    },

    /**
     * 处理新订单
     */
    handleNewOrder(data) {
      // 可以在这里添加全局的新订单处理逻辑
      console.log('处理新订单:', data);
    },

    /**
     * 处理订单状态变更
     */
    handleOrderStatusChange(data) {
      // 可以在这里添加全局的订单状态变更处理逻辑
      console.log('处理订单状态变更:', data);
    },

    /**
     * 处理通知
     */
    handleNotification(data) {
      // 可以在这里添加全局的通知处理逻辑
      console.log('处理通知:', data);
    },

    /**
     * 处理系统警告
     */
    handleSystemAlert(data) {
      // 可以在这里添加全局的系统警告处理逻辑
      console.log('处理系统警告:', data);
    }
  }
};
</script>

<style scoped>
.sse-listener {
  /* 这是一个无UI的组件，不需要样式 */
  display: none;
}
</style> 