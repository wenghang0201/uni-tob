<template>
  <view>
    <u-popup :show="show" mode="center" :round="10" @close="close" closeable>
      <view class="popup-content">
        <view class="popup-title">修改派奖金额</view>
        
        <view class="form-item">
          <view class="label">原始中奖金额：</view>
          <view class="value">{{originalAmount}}元</view>
        </view>
        
        <view class="form-item">
          <view class="label">修改后金额：</view>
          <view class="input-container">
            <u-input 
              v-model="editedAmount" 
              type="number" 
              border="1"
              :clearable="true"
              placeholder="请输入新的派奖金额" 
            />
          </view>
        </view>
        
        <view class="action-buttons">
          <view class="btn cancel-btn" @click="close">取消</view>
          <view class="btn confirm-btn" @click="confirmEdit">确认修改</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    lotteryOrder: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      editedAmount: ''
    }
  },
  computed: {
    originalAmount() {
      return Number(this.lotteryOrder.winPrice) + Number(this.lotteryOrder.commissionPrice);
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // 当弹窗显示时，初始化编辑金额为原始金额
        this.editedAmount = (this.originalAmount >= 10000 ? this.originalAmount : this.lotteryOrder.winPrice) + '';
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirmEdit() {
      if (!this.editedAmount) {
        uni.showToast({
          title: '请输入金额',
          icon: 'none'
        });
        return;
      }
      
      if (isNaN(Number(this.editedAmount)) || Number(this.editedAmount) < 0) {
        uni.showToast({
          title: '请输入有效金额',
          icon: 'none'
        });
        return;
      }
      
      this.$emit('confirm', {
        originalAmount: this.originalAmount,
        editedAmount: Number(this.editedAmount)
      });
    }
  }
}
</script>

<style scoped lang="scss">
.popup-content {
  width: 600rpx;
  padding: 40rpx 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}

.label {
  font-size: 28rpx;
  color: #333;
  width: 220rpx;
}

.value {
  font-size: 28rpx;
  color: #FF3F43;
  font-weight: bold;
}

.input-container {
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.btn {
  width: 45%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: var(--themeColor);
  color: #ffffff;
}
</style> 