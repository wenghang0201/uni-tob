<template>
  <view class="box">
    <nav-bar :title="'用户充值设置'" :back="true"></nav-bar>
    
    <view class="content">
      <view class="setting-card">
        <view class="setting-title">充值资金分配比例</view>
        <view class="setting-desc">设置用户充值后资金的使用限制比例</view>
        
        <view class="slider-section">
          <view class="slider-labels">
            <text>可提现比例</text>
            <text>{{withdrawableRatio}}%</text>
          </view>
          <u-slider
            v-model="withdrawableRatio"
            :min="0"
            :max="100"
            :step="5"
            activeColor="#3B7CFF"
            block-color="#3B7CFF"
            @change="onSliderChange"
          ></u-slider>
          
          <view class="slider-labels">
            <text>仅可下单比例</text>
            <text>{{100 - withdrawableRatio}}%</text>
          </view>
        </view>
        
        <view class="tips">
          <u-icon name="info-circle" color="#FF9500" size="28"></u-icon>
          <text class="tips-text">可提现部分用户可自由使用，仅可下单部分只能用于投注，不可提现</text>
        </view>
      </view>
      
      <view class="preset-ratios">
        <view class="preset-title">快速设置比例</view>
        <view class="preset-buttons">
          <view 
            class="preset-button" 
            :class="{'active': withdrawableRatio === 70}"
            @click="setRatio(70)"
          >
            70% / 30%
          </view>
          <view 
            class="preset-button" 
            :class="{'active': withdrawableRatio === 50}"
            @click="setRatio(50)"
          >
            50% / 50%
          </view>
          <view 
            class="preset-button" 
            :class="{'active': withdrawableRatio === 30}"
            @click="setRatio(30)"
          >
            30% / 70%
          </view>
          <view 
            class="preset-button" 
            :class="{'active': withdrawableRatio === 0}"
            @click="setRatio(0)"
          >
            0% / 100%
          </view>
        </view>
      </view>
      
      <view class="submit-btn" @click="saveSettings">
        保存设置
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      withdrawableRatio: 70,
      originalRatio: 70
    };
  },
  onLoad() {
    // 获取当前设置
    this.getSettings();
  },
  methods: {
    getSettings() {
      // 模拟从API获取设置
      // 实际应用中应该从服务器获取
      setTimeout(() => {
        this.withdrawableRatio = 70;
        this.originalRatio = 70;
      }, 500);
    },
    onSliderChange(value) {
      this.withdrawableRatio = value;
    },
    setRatio(ratio) {
      this.withdrawableRatio = ratio;
    },
    saveSettings() {
      if (this.withdrawableRatio === this.originalRatio) {
        uni.showToast({
          title: '设置未变更',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '保存中...'
      });
      
      // 调用API保存设置
      const settings = {
        withdrawableRatio: this.withdrawableRatio,
        orderOnlyRatio: 100 - this.withdrawableRatio
      };
      
      // 模拟API调用
      setTimeout(() => {
        uni.hideLoading();
        this.originalRatio = this.withdrawableRatio;
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        // 返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  background-color: #F5F5F5;
  min-height: 100vh;
}

.content {
  padding: 30rpx;
}

.setting-card {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .setting-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10rpx;
  }
  
  .setting-desc {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 40rpx;
  }
  
  .slider-section {
    margin-bottom: 30rpx;
    
    .slider-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      margin-top: 30rpx;
      
      text {
        font-size: 28rpx;
        color: #666666;
        
        &:last-child {
          color: #3B7CFF;
          font-weight: 500;
        }
      }
    }
  }
  
  .tips {
    display: flex;
    align-items: flex-start;
    background-color: #FFF9EC;
    padding: 20rpx;
    border-radius: 8rpx;
    
    .tips-text {
      flex: 1;
      margin-left: 10rpx;
      font-size: 24rpx;
      color: #FF9500;
      line-height: 1.5;
    }
  }
}

.preset-ratios {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 50rpx;
  
  .preset-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 30rpx;
  }
  
  .preset-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .preset-button {
      width: 48%;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #F5F5F5;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #666666;
      margin-bottom: 20rpx;
      
      &.active {
        background-color: #E6EFFF;
        color: #3B7CFF;
        font-weight: 500;
      }
    }
  }
}

.submit-btn {
  height: 90rpx;
  background-color: #3B7CFF;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 45rpx;
}
</style> 