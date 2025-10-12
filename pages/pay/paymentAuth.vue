<template>
  <view class="min-h-100vh bgc-fff">
    <nav-bar :title="pageTitle" :back="true"></nav-bar>

    <view class="mt-20">
      <view class="form-item">
        <text class="form-label">联系人电话 <text class="required">*</text></text>
        <u-input
          ref="contactPhoneInput"
          v-model="formData.contactPhone"
          placeholder="请输入联系人电话"
          type="number"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item" v-if="paymentType === 'alipay'">
        <text class="form-label">支付宝账号 <text class="required">*</text></text>
        <u-input
          ref="alipayAccountInput"
          v-model="formData.alipayAccount"
          placeholder="请输入支付宝账号"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item" v-if="paymentType === 'wechat'">
        <text class="form-label">微信号 <text class="required">*</text></text>
        <u-input
          ref="wechatAccountInput"
          v-model="formData.wechatAccount"
          placeholder="请输入微信号"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item">
        <text class="form-label">真实姓名 <text class="required">*</text></text>
        <u-input
          ref="realNameInput"
          v-model="formData.realName"
          placeholder="请输入真实姓名"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item">
        <text class="form-label">联系人邮箱 <text class="required">*</text></text>
        <u-input
          ref="contactEmailInput"
          v-model="formData.contactEmail"
          placeholder="请输入联系人邮箱"
          type="email"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item">
        <text class="form-label">店铺地址 <text class="required">*</text></text>
        <u-input
          ref="shopAddressInput"
          v-model="formData.shopAddress"
          placeholder="请输入店铺地址"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item">
        <text class="form-label">代销证编号 <text class="required">*</text></text>
        <u-input
          ref="agentLicenseNumberInput"
          v-model="formData.agentLicenseNumber"
          placeholder="请输入代销证编号"
          border="bottom"
          clearable
          :disabled="isFormDisabled"
        ></u-input>
      </view>

      <view class="form-item">
        <text class="form-label">代销证截止日期 <text class="required">*</text></text>
        <view class="date-input-wrapper" @click="openDatePickerIfNeeded">
          <u-input
            ref="agentLicenseExpiryInput"
            v-model="formData.agentLicenseExpiry"
            placeholder="请选择代销证截止日期"
            border="bottom"
            readonly
            clearable
            :disabled="isFormDisabled"
          ></u-input>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="p-32">
      <u-button 
        type="primary"
        color="#007be6"
        @click="savePaymentInfo" 
        :loading="isLoading" 
        :disabled="alipayApplyStatus === 0" 
        :text="submitButtonText"
      ></u-button>
    </view>

    <!-- 日期选择器 -->
    <u-datetime-picker
      :show="showDatePicker"
      v-model="dateValue"
      mode="date"
      :min-date="Date.now()"
      @confirm="onDateConfirm"
      @cancel="showDatePicker = false"
    ></u-datetime-picker>
  </view>
</template>

<script>
import { addOrUpdateShopPayment, getShopPaymentList, addNewpayAlipayApply, getNewpayAlipayApply } from '@/api/shop.js'

export default {
  data() {
    return {
      paymentType: 'alipay', // 支付类型：alipay 或 wechat
      isLoading: false,
      showDatePicker: false,
      dateValue: Date.now(), // 日期选择器绑定的值
      formData: {
        contactPhone: '',
        alipayAccount: '',
        wechatAccount: '',
        realName: '',
        contactEmail: '',
        shopAddress: '',
        agentLicenseNumber: '',
        agentLicenseExpiry: ''
      },
      alipayApplyStatus: null, // 存储支付宝申请状态
      submitButtonText: '提交', // 动态提交按钮文本
      isFormDisabled: false // 控制整个表单是否禁用
    };
  },

  computed: {
    pageTitle() {
      return this.paymentType === 'alipay' ? '支付宝收款' : '微信收款';
    }
  },
  onLoad(options) {
    // 根据传入的 type 参数设置支付类型
    if (options.type !== undefined) {
      this.paymentType = options.type === '0' ? 'alipay' : 'wechat';
    }

    // 加载现有支付配置或申请状态
    this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      if (this.paymentType === 'alipay') {
        await this.loadAlipayApplyStatus();
      } else {
        await this.loadPaymentConfig();
      }
    },

    async loadAlipayApplyStatus() {
      uni.showLoading({
        title: '加载中...'
      });
      this.isLoading = true;
      this.submitButtonText = '加载中...'; // 初始加载时按钮文本
      this.disableFormInputs(true); // 默认加载时先禁用表单

      try {
        const res = await getNewpayAlipayApply();
        if (res && res.success) {
          if (typeof res.id !== 'undefined' && res.id !== null) {
            this.alipayApplyStatus = res.status;
            this.formData.contactPhone = res.contactPhone || '';
            this.formData.alipayAccount = res.alipayAccount || '';
            this.formData.realName = res.realName || '';
            this.formData.contactEmail = res.contactEmail || '';
            this.formData.shopAddress = res.shopAddress || '';
            this.formData.agentLicenseNumber = res.dealerCode || '';
            this.formData.agentLicenseExpiry = res.dealerExpire ? this.formatDate(new Date(res.dealerExpire)) : '';

            if (this.alipayApplyStatus === 1) { // 1-通过
              this.submitButtonText = '更新信息';
              this.disableFormInputs(false);
            } else if (this.alipayApplyStatus === 0) { // 0-待审核
              this.submitButtonText = '审核中';
              this.disableFormInputs(true);
            } else if (this.alipayApplyStatus === 2) { // 2-不通过
              this.submitButtonText = '审核不通过, 重新提交';
              this.disableFormInputs(false); // 允许编辑
            } else {
              this.submitButtonText = '提交'; // 其他未知状态
              this.disableFormInputs(false);
            }
          } else {
            this.submitButtonText = '提交';
            this.alipayApplyStatus = null; // 表示没有申请记录
            this.disableFormInputs(false);
          }
        } else {
          if (this.alipayApplyStatus === null && !this.formData.alipayAccount) { // 避免覆盖已填写的表单在加载状态时
             this.submitButtonText = '提交';
          } // else 保留 submitButtonText 为 '加载中...' 或其他状态，直到成功或用户操作
          uni.showToast({
            title: (res && res.errorMsg) || '获取申请状态失败',
            icon: 'none'
          });
          this.alipayApplyStatus = null;
          this.disableFormInputs(false); // 获取失败也允许编辑重试
        }
      } catch (e) {
        console.error('获取支付宝申请状态失败', e);
        if (this.alipayApplyStatus === null && !this.formData.alipayAccount) {
            this.submitButtonText = '提交';
        } // else 保留 submitButtonText
        uni.showToast({
          title: '获取申请状态异常',
          icon: 'none'
        });
        this.alipayApplyStatus = null;
        this.disableFormInputs(false); // 出现异常也允许编辑重试
      } finally {
        uni.hideLoading();
        this.isLoading = false;
      }
    },

    disableFormInputs(shouldDisable) {
      this.isFormDisabled = shouldDisable;
      // 如果u-input本身没有通过 :disabled 同步状态，或者需要更复杂的禁用逻辑，
      // 才需要通过 this.$refs 操作。
      // 例如，如果u-input的disabled prop不能直接响应isFormDisabled的变化，
      // 你可能需要这样做:
      // const refsToDisable = [
      //   'contactPhoneInput', 'alipayAccountInput', 'wechatAccountInput', 
      //   'realNameInput', 'contactEmailInput', 'shopAddressInput', 
      //   'agentLicenseNumberInput', 'agentLicenseExpiryInput'
      // ];
      // refsToDisable.forEach(refName => {
      //   if (this.$refs[refName] && this.$refs[refName].disabled !== undefined) {
      //     // uView的u-input可能通过props的disabled控制，vue会自动更新
      //     // 如果是element-ui等，可能是 this.$refs[refName].disabled = shouldDisable;
      //     // 或者调用特定的方法 this.$refs[refName].setDisabled(shouldDisable);
      //   }
      // });
    },

    // 加载支付配置
    async loadPaymentConfig() {
      uni.showLoading({
        title: '加载中...'
      });

      try {
        const res = await getShopPaymentList();

        if (res.success && res.voList && res.voList.length > 0) {
          // 查找对应支付类型的配置
          const paymentConfig = res.voList.find(item => item.qrcodeType === this.paymentType);

          if (paymentConfig) {
            // 填充表单数据
            this.formData = {
              contactPhone: paymentConfig.contactPhone || '',
              alipayAccount: paymentConfig.alipayAccount || '',
              wechatAccount: paymentConfig.wechatAccount || '',
              realName: paymentConfig.realName || '',
              contactEmail: paymentConfig.contactEmail || '',
              shopAddress: paymentConfig.shopAddress || '',
              agentLicenseNumber: paymentConfig.agentLicenseNumber || '',
              agentLicenseExpiry: paymentConfig.agentLicenseExpiry || ''
            };
          }
        }
      } catch (e) {
        console.error('加载支付配置失败', e);
        uni.showToast({
          title: '加载配置失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },

    // 打开日期选择器
    openDatePicker() {
      this.showDatePicker = true;
    },

    // 日期选择确认
    onDateConfirm(timestamp) {
      this.formData.agentLicenseExpiry = this.formatDate(timestamp.value);
      this.showDatePicker = false;
    },

    // 格式化日期
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    // 表单验证
    validateForm() {
      if (!this.formData.contactPhone) {
        uni.showToast({
          title: '请输入联系人电话',
          icon: 'none'
        });
        return false;
      }

      if (this.paymentType === 'alipay' && !this.formData.alipayAccount) {
        uni.showToast({
          title: '请输入支付宝账号',
          icon: 'none'
        });
        return false;
      }

      if (this.paymentType === 'wechat' && !this.formData.wechatAccount) {
        uni.showToast({
          title: '请输入微信号',
          icon: 'none'
        });
        return false;
      }

      if (!this.formData.realName) {
        uni.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        });
        return false;
      }

      if (!this.formData.contactEmail) {
        uni.showToast({
          title: '请输入联系人邮箱',
          icon: 'none'
        });
        return false;
      }

      if (!this.formData.shopAddress) {
        uni.showToast({
          title: '请输入店铺地址',
          icon: 'none'
        });
        return false;
      }

      if (!this.formData.agentLicenseNumber) {
        uni.showToast({
          title: '请输入代销证编号',
          icon: 'none'
        });
        return false;
      }

      if (!this.formData.agentLicenseExpiry) {
        uni.showToast({
          title: '请选择代销证截至日期',
          icon: 'none'
        });
        return false;
      }

      return true;
    },

    // 保存支付信息
    async savePaymentInfo() {
      if (this.isLoading) return;

      if (!this.validateForm()) return;

      this.isLoading = true;

      try {
        let res;
        if (this.paymentType === 'alipay') {
          const params = {
            alipayAccount: this.formData.alipayAccount,
            contactEmail: this.formData.contactEmail,
            contactPhone: this.formData.contactPhone,
            dealerCode: this.formData.agentLicenseNumber, // 映射到 dealerCode
            dealerExpire: this.formData.agentLicenseExpiry, // 映射到 dealerExpire
            realName: this.formData.realName,
            shopAddress: this.formData.shopAddress
          };
          res = await addNewpayAlipayApply(params); 
        } else {
          // 保持原有微信或其他支付方式的逻辑
          const data = {
            ...this.formData
          };
          res = await addOrUpdateShopPayment(data);
        }

        if (res.success) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });

          // 延迟返回上一页
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          throw new Error(res.errorMsg || '保存失败');
        }
      } catch (e) {
        console.error('保存支付信息失败', e);
        uni.showToast({
          title: e.message || '保存失败',
          icon: 'none'
        });
      } finally {
        this.isLoading = false;
      }
    },

    openDatePickerIfNeeded() {
      if (!this.isFormDisabled) {
        this.openDatePicker();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item {
  margin-bottom: 18rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
  padding: 0 20rpx;
}

.required {
  color: #ff4d4f;
}

.date-input-wrapper {
  cursor: pointer;
}

::v-deep(.u-input ){
  .u-input__content {
    .u-input__content__field-wrapper {
      .u-input__content__field-wrapper__field {
        font-size: 28rpx !important;
      }
    }
  }
}
</style>