<template>
  <view class="box">
    <!-- 导航栏 -->
    <nav-bar :title="'选择提示音'" :back="true"></nav-bar>
    
    <!-- 声音列表 -->
    <view class="sound-list">
      <view 
        class="sound-item" 
        v-for="(item, index) in soundList" 
        :key="index"
        @tap="selectSound(index)"
      >
        <text class="sound-name">{{item.name}}</text>
        <u-icon v-if="selectedIndex === index" name="checkmark" color="#4080FF" size="40"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import navBar from '@/components/nav-bar/nav-bar.vue'

export default {
  components: {
    navBar
  },
  data() {
    return {
      selectedIndex: 0,
      soundList: [
        { name: '系统女音', id: 'system_female' },
        { name: '百花怒放', id: 'flowers' },
        { name: '爆米花', id: 'popcorn' },
        { name: '玻璃声', id: 'glass' },
        { name: '风铃', id: 'wind_bell' },
        { name: '连击效果', id: 'combo' },
        { name: '乌鸣', id: 'crow' },
        { name: '申请魔咒', id: 'magic_spell' },
        { name: '新闻快讯', id: 'news_flash' },
        { name: '整点新闻', id: 'hourly_news' }
      ]
    }
  },
  
  onLoad(options) {
    // 获取当前已选择的声音
    this.loadCurrentSound();
  },
  
  methods: {
    // 加载当前声音设置
    loadCurrentSound() {
      // 模拟加载当前声音设置
      // 实际应用中，这里应该调用API获取保存的声音设置
      setTimeout(() => {
        // 假设从服务器获取到了保存的声音ID
        const savedSoundId = 'system_female';
        // 查找对应的索引
        const index = this.soundList.findIndex(item => item.id === savedSoundId);
        if (index !== -1) {
          this.selectedIndex = index;
        }
      }, 300);
    },
    
    // 选择声音
    selectSound(index) {
      this.selectedIndex = index;
      // 可以在这里播放声音预览
      this.playSound(this.soundList[index].id);
    },
    
    // 播放声音预览
    playSound(soundId) {
      // 实际应用中，这里应该播放对应的声音文件
      console.log('播放声音:', soundId);
    },
    
    // 保存设置
    saveSettings() {
      const selectedSound = this.soundList[this.selectedIndex];
      
      uni.showLoading({
        title: '保存中...'
      });
      
      // 模拟保存到服务器
      // 实际应用中，这里应该调用API保存声音设置
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '设置已保存',
          icon: 'success'
        });
        
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 500);
      }, 500);
    }
  }
}
</script>

<style>
.sound-list {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 0 30rpx;
}

.sound-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.sound-item:last-child {
  border-bottom: none;
}

.sound-name {
  font-size: 28rpx;
  color: #333;
}
</style> 