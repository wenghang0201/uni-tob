<template>
  <view class="box">
    <nav-bar :title="'收款管理'" :back="true"></nav-bar>
    
    <view class="notice-bar">
      <u-icon name="volume" color="#FF9500" size="28"></u-icon>
      <text class="notice-text">开通后用户即可通过以下支付方式进行充值</text>
    </view>
    
    <u-collapse :value="activeCollapse" :accordion="true" @change="collapseChange">
      <!-- 二维码收款设置 -->
      <u-collapse-item title="二维码收款" name="qrcode" :title-style="collapseItemStyle">
        <view slot="title" class="custom-title">
          <view class="payment-icon">
            <u-icon name="scan" color="#3B7CFF" size="36"></u-icon>
          </view>
          <text class="payment-title">二维码收款</text>
        </view>

        <view v-if="qrcodePayList.length > 0">
          <view v-for="(item, key) in qrcodePayList" :key="key" class="qrcode-channel-item">
            <view class="qrcode-info">
              <view class="channel-header">
                <u-icon :name="item.channel == 1001 ? 'weixin-fill' : (item.channel == 1002 ? 'zhifubao-circle-fill' : 'scan')" :color="item.channel == 1001 ? '#09BB07' : (item.channel == 1002 ? '#1296DB' : '#3B7CFF')" size="28"></u-icon>
                <text class="channel-title">{{ item.channel == 1001 ? '微信' : (item.channel == 1002 ? '支付宝' : '其他') }}</text>
              </view>
            </view>
            <view class="qrcode-preview">
              <view class="qrcode-image" @click="uploadQRCode(item.channel)">
                <image :src="item.content"></image>
              </view>
              <view  class="change-tip">点击更换</view>
            </view>
          </view>
          <!-- <view class="save-btn-container">
            <u-button type="primary" color="#007be6" @click="saveSettings">保存设置</u-button>
          </view> -->
        </view>
        <view v-else style="color:#999;font-size:26rpx;padding:20rpx 0;">暂无二维码收款渠道</view>
      </u-collapse-item>
      <u-collapse-item title="支付宝收款" name="alipay" :title-style="collapseItemStyle">
        <view slot="title" class="custom-title">
          <view class="payment-icon">
            <u-icon name="/static/alipay.png" color="#3B7CFF" size="36"></u-icon>
          </view>
          <text class="payment-title">支付宝收款</text>
        </view>

        <!-- 支付宝收款列表 -->
        <view class="alipay-list" v-if="alipayList.length > 0">
          <view 
            class="alipay-item" 
            v-for="(item, index) in alipayList" 
            :key="item.id"
          >
            <view class="alipay-item-left">
              <view class="alipay-name">{{ item.description || '支付宝收款' }}</view>
              <view v-if="item.channel>7000 && item.channel<7100">
                <view class="alipay-desc">支付宝姓名：{{ item.zfbName }}</view>
                <view class="alipay-desc">支付宝账号：{{ item.zfbNumber }}</view>
              </view>
              <view v-else-if="item.channel>7100 && item.channel<8000">
                <view class="alipay-desc">商户号：{{ item.member }}</view>
                <view class="alipay-desc">APIKEY：{{ item.apiKey }}</view>
              </view>
              <view v-else>
                <view class="alipay-desc">{{ item.delayTime || '支付宝在线收款服务' }}</view>
              </view>
            </view>
            <view class="alipay-item-right">
              <u-switch 
                :value="item.status === 1" 
                @change="(value) => toggleAlipayStatus(item, value)"
                active-color="#007be6"
              ></u-switch>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-state" v-else>
          <text class="empty-text">暂未开启支付宝收款渠道</text>
          <!-- <navigator :url="'/pages/pay/paymentAuth?type='+'0'" hover-class="navigator-hover">
            <u-button type="primary" color="#007be6" size="small">去开通</u-button>
          </navigator> -->
        </view>

      </u-collapse-item>
    </u-collapse>

    <!-- 二维码弹窗组件 -->
    <qrcode-modal 
      :visible="showQRCodeModal" 
      :qrcode-url="currentQRCodeUrl"
      @close="closeQRCodeModal"
    ></qrcode-modal>

    <!-- 有密付支付宝信息输入弹窗 -->
    <u-modal 
      :show="showYoumiModal" 
      title="开启有密付收款"
      :show-cancel-button="true"
      :show-confirm-button="true"
      confirm-text="确定开启"
      @confirm="confirmYoumiPayment"
      @cancel="cancelYoumiPayment"
    >
      <view class="youmi-form">
        <view class="form-item">
          <text class="form-label">支付宝账号</text>
          <input 
            class="form-input" 
            v-model="youmiForm.zfbNumber" 
            placeholder="请输入支付宝账号"
            type="text"
          />
        </view>
        <view class="form-item">
          <text class="form-label">支付宝姓名</text>
          <input 
            class="form-input" 
            v-model="youmiForm.zfbName" 
            placeholder="请输入支付宝真实姓名"
            type="text"
          />
        </view>
      </view>
    </u-modal>

    <!-- 乐刷支付信息输入弹窗 -->
    <u-modal 
      :show="showLeshuaModal" 
      title="开启乐刷支付收款"
      :show-cancel-button="true"
      :show-confirm-button="true"
      confirm-text="确定开启"
      @confirm="confirmLeshuaPayment"
      @cancel="cancelLeshuaPayment"
    >
      <view class="leshua-form">
        <view class="form-item">
          <text class="form-label">商户号</text>
          <input 
            class="form-input" 
            v-model="leshuaForm.member" 
            placeholder="请输入商户号"
            type="text"
          />
        </view>
        <view class="form-item">
          <text class="form-label">API密钥</text>
          <input 
            class="form-input" 
            v-model="leshuaForm.apiKey" 
            placeholder="请输入API密钥"
            type="text"
          />
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { closeShopPayment, getShopPaymentList,modifyPayment,authAlipay,appOpenPayment,appOpenYoumiPayment } from '@/api/shop.js'
import { upload } from '@/api/upload.js'
import cfg from '@/util/environment.js'
import { compressImage } from '@/util/image-tool.js'
import QRCodeModal from '@/components/qrcode-modal/index.vue'

export default {
  components: {
    'qrcode-modal': QRCodeModal
  },
  data() {
    return {
      activeCollapse: ['qrcode'],
      collapseItemStyle: {
        fontWeight: '500',
        fontSize: '32rpx',
        color: '#333333'
      },
      isLoading: false,
      qrcodePayList: [], // 只存1000-2000区间的channel
      alipayList: [],
      showQRCodeModal: false,
      currentQRCodeUrl: '',
      showYoumiModal: false,
      youmiForm: {
        zfbNumber: '',
        zfbName: ''
      },
      currentYoumiChannel: null,
      showLeshuaModal: false,
      leshuaForm: {
        member: '',
        apiKey: ''
      },
      currentLeshuaChannel: null,
    };
  },
  onLoad() {
    // 页面加载时获取现有支付方式
    this.getPaymentSettings();
  },
  methods: {
    // 获取现有支付方式设置
    async getPaymentSettings() {
      uni.showLoading({
        title: '加载中...'
      });
      
      try {
        const res = await getShopPaymentList();
        
        if (res.success && res.voList && res.voList.length > 0) {
          const paymentList = res.voList;
          this.qrcodePayList = [];
          this.alipayList = [];
          paymentList.forEach(payment => {
            if (payment.type == 3) {
              this.qrcodePayList.push(payment);
            }else {
              if (payment.type == 0) {
                this.alipayList.push(payment);
              }
              if(payment.content){
                try {
                  const content = JSON.parse(payment.content);
                  //把content的key和value赋值给payment
                  Object.keys(content).forEach(key => {
                    payment[key] = content[key];
                  });
                } catch (e) {
                  console.error('解析支付内容失败', e);
                }
              }
            }
          });
        } else {
          this.qrcodePayList = [];
          this.alipayList = [];
        }
      } catch (e) {
        this.qrcodePayList = [];
        this.alipayList = [];
      } finally {
        uni.hideLoading();
      }
    },
    
    uploadQRCode(channel) {
      // 判断平台类型
      const platform = uni.getSystemInfoSync().platform;
      console.log("当前平台：", platform);
      
      // Android webview 下使用表单上传方式
      if (platform === 'android' && uni.getSystemInfoSync().AppPlatform === 'android-webview') {
        // 创建隐藏的文件选择输入框
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = 'image/*';
        
        // 点击选择文件
        inputEl.onchange = (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // 将文件转为临时路径显示
            const reader = new FileReader();
            reader.onload = (event) => {
              this.qrcodeUrl = event.target.result;
              
              // 上传文件到服务器
              this.uploadFileForAndroid(file, channel);
            };
            reader.readAsDataURL(file);
          }
        };
        
        // 触发文件选择
        inputEl.click();
      } else {
        // 其他平台使用原生方法
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            // 上传前显示本地临时图片
            const tempFilePaths = res.tempFilePaths;
            this.qrcodeUrl = tempFilePaths[0];
            
            // 上传图片到服务器
            // this.uploadFile(tempFilePaths[0]);
            compressImage(tempFilePaths[0], {
                maxSize: 200,
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.7
            }).then(compressedImage => {
                // 上传压缩后的图片
                console.log("compressedImage", compressedImage)
                this.uploadFile(compressedImage, channel);
            });
          }
        });
      }
    },
    
    // 针对Android webview环境下的文件上传
    uploadFileForAndroid(file, channel) {
      if (this.isLoading) return;
      this.isLoading = true;
      uni.showLoading({
        title: '上传中...'
      });
      const token = uni.getStorageSync('vue_authtoken') || '';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'qrcode');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', cfg.BASE_API + '/file/upload', true);
      xhr.setRequestHeader('x-access-token', token);
      xhr.onload = () => {
        uni.hideLoading();
        this.isLoading = false;
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              const url = response.url || response.filePath || response.fileUrl || '';
              if (!url) {
                uni.showToast({ title: '上传成功但获取图片地址失败', icon: 'none' });
                return;
              }
              // 赋值给对应channel的content和qrcodeImage
              const idx = this.qrcodePayList.findIndex(item => item.channel === channel);
              console.log("上传成功", idx,this.qrcodePayList,channel)
              if (idx !== -1) {
                this.$set(this.qrcodePayList[idx], 'content', url);
                // 自动保存设置
                this.saveSettings(this.qrcodePayList[idx]);
              }
              uni.showToast({ title: '上传成功', icon: 'success' });
            } else {
              uni.showToast({ title: response.errorMsg || '上传失败', icon: 'none' });
            }
          } catch (e) {
            uni.showToast({ title: '解析响应失败', icon: 'none' });
          }
        } else {
          uni.showToast({ title: '上传失败: 状态码 ' + xhr.status, icon: 'none' });
        }
      };
      xhr.onerror = () => {
        uni.hideLoading();
        this.isLoading = false;
        uni.showToast({ title: '网络错误，上传失败', icon: 'none' });
      };
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.floor((e.loaded / e.total) * 100);
          console.log('上传进度：', percent + '%');
        }
      };
      xhr.send(formData);
    },
    uploadFile(filePath, channel) {
      if (this.isLoading) return;
      this.isLoading = true;
      
      uni.showLoading({
        title: '上传中...'
      });
      
      // 获取token
      const token = uni.getStorageSync('vue_authtoken') || '';
      
      // 直接使用uni.uploadFile上传文件
      uni.uploadFile({
        url: cfg.BASE_API + '/file/upload', // 使用环境配置中的BASE_API
        filePath: filePath,
        name: 'file',
        header: {
          'x-access-token': token
        },
        formData: {
          'type': 'qrcode'
        },
        success: (uploadRes) => {
          try {
            const data = JSON.parse(uploadRes.data);
            if (data.success) {
              // 上传成功后更新二维码URL
              const url = data.url || data.filePath || data.fileUrl || '';
              
              if (!url) {
                console.error('上传成功但未返回有效的文件URL', data);
                uni.showToast({
                  title: '上传成功但获取图片地址失败',
                  icon: 'none'
                });
                return;
              }
              
              uni.showToast({
                title: '上传成功',
                icon: 'success'
              });
              
              // 更新渠道数据
              const idx = this.qrcodePayList.findIndex(item => item.channel === channel);
              console.log("上传成功", idx,this.qrcodePayList,channel)
              if (idx !== -1) {
                this.$set(this.qrcodePayList[idx], 'content', url);
                // 自动保存设置
                this.saveSettings(this.qrcodePayList[idx]);
              }
              
            } else {
              uni.showToast({
                title: data.errorMsg || '上传失败',
                icon: 'none'
              });
            }
          } catch (e) {
            console.error('解析上传响应失败', e, uploadRes);
            uni.showToast({
              title: '解析响应失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('上传失败', err);
          uni.showToast({
            title: '上传失败: ' + (err.errMsg || '未知错误'),
            icon: 'none'
          });
        },
        complete: () => {
          uni.hideLoading();
          this.isLoading = false;
        }
      });
    },
    async saveSettings(data) {
      if (!data) {
        uni.showToast({
          title: '请求参数为空',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '保存中...'
      });
      
      try {
        const res = await modifyPayment(data);
        if (res.success) {

          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: res.errorMsg || '保存失败',
            icon: 'none'
          });
        }
      } catch (e) {
        console.error('保存设置失败', e);
        uni.showToast({
          title: '保存失败，请稍后再试',
          icon: 'none'
        });
      } finally {

      }
    },
    collapseChange(name) {
      console.log('折叠面板状态变化:', name);
    },
    toggleAlipayStatus(item, value) {
      console.log("toggleAlipayStatus",item, value)
      // 如果是开启操作，先显示二维码弹窗
      if (value) {
        if(item.channel > 2000 && item.channel < 3000){
          this.showQRCode(item.channel);
        }else if(item.channel>5000 && item.channel < 6000){
          //深圳付渠道 直接调用开启
          // 显示加载状态
          uni.showLoading({
            title: '更新中...'
          });
          
          // 准备更新数据
          const updateData = {
            channel: item.channel,
          };
          
          // 调用API更新状态
          appOpenPayment(updateData).then(res => {
            uni.hideLoading();
            
            if (res.success) {
              // 更新本地数据
              const index = this.alipayList.findIndex(payment => payment.id === item.id);
              if (index !== -1) {
                this.alipayList[index].status = value ? 1 : 0;
              }
              
              uni.showToast({
                title: value ? '已开启' : '已关闭',
                icon: 'success'
              });
            } else {
              uni.showToast({
                title: res.errorMsg || '更新失败',
                icon: 'none'
              });
            }
          }).catch(e => {
            uni.hideLoading();
            console.error('更新支付宝收款状态失败', e);
            uni.showToast({
              title: '更新失败，请稍后再试',
              icon: 'none'
            });
          });
        }else if(item.channel>7000 && item.channel < 7100){
          //有米渠道 显示弹窗输入支付宝信息
          this.showYoumiInputModal(item.channel);
        }else if(item.channel>7100 && item.channel < 8000){
          //乐刷渠道 显示弹窗输入商户号和apiKey
          this.showLeshuaInputModal(item.channel);
        }else{
          uni.showToast({
            title: '渠道暂不支持开启',
            icon: 'none'
          });
        }
      }else{
        // 实现切换支付宝收款状态的逻辑
        console.log('切换支付宝收款状态:', item, value);
        // 显示加载状态
        uni.showLoading({
          title: '更新中...'
        });
        
        // 准备更新数据
        const updateData = {
          channel: item.channel,
        };
        
        // 调用API更新状态
        closeShopPayment(updateData).then(res => {
          uni.hideLoading();
          
          if (res.success) {
            // 更新本地数据
            const index = this.alipayList.findIndex(payment => payment.id === item.id);
            if (index !== -1) {
              this.alipayList[index].status = value ? 1 : 0;
            }
            
            uni.showToast({
              title: value ? '已开启' : '已关闭',
              icon: 'success'
            });
          } else {
            uni.showToast({
              title: res.errorMsg || '更新失败',
              icon: 'none'
            });
          }
        }).catch(e => {
          uni.hideLoading();
          console.error('更新支付宝收款状态失败', e);
          uni.showToast({
            title: '更新失败，请稍后再试',
            icon: 'none'
          });
        });
      }
      
    },
    async showQRCode(channel) {
      uni.showLoading({
        title: '二维码生成中...'
      });
      try{
        const res = await authAlipay({channel:channel});
        uni.hideLoading();
        if (res.success) {
          this.showQRCodeModal = true;
          this.currentQRCodeUrl = res.authUrl;
          console.log('二维码生成成功', res.authUrl);
        } else {
          uni.showToast({
            title: res.errorMsg || '二维码生成失败',
            icon: 'none'
          });
        }
      }catch(e){
        uni.hideLoading();
        console.error('二维码生成失败', e);
        uni.showToast({
          title: '二维码生成失败',
          icon: 'none'
        });
      }
    },
    closeQRCodeModal() {
      this.showQRCodeModal = false;
      this.currentQRCodeUrl = '';
      // 关闭弹窗时刷新列表
      this.getPaymentSettings();
    },
    saveQrcodeImage(qrcodeImage) {
      // 实现保存二维码图片的逻辑
      console.log('保存二维码图片:', qrcodeImage);
    },
    // 显示有密付输入弹窗
    showYoumiInputModal(channel) {
      this.currentYoumiChannel = channel;
      this.youmiForm.zfbNumber = '';
      this.youmiForm.zfbName = '';
      this.showYoumiModal = true;
    },
    // 确认有密付开启
    confirmYoumiPayment() {
      // 验证输入
      if (!this.youmiForm.zfbNumber.trim()) {
        uni.showToast({
          title: '请输入支付宝账号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.youmiForm.zfbName.trim()) {
        uni.showToast({
          title: '请输入支付宝姓名',
          icon: 'none'
        });
        return;
      }
      
      // 关闭弹窗
      this.showYoumiModal = false;
      
      // 显示加载状态
      uni.showLoading({
        title: '开启中...'
      });
      
      // 准备更新数据
      const content = JSON.stringify({
        zfbName: this.youmiForm.zfbName.trim(),
        zfbNumber: this.youmiForm.zfbNumber.trim()
      });
      
      const updateData = {
        channel: this.currentYoumiChannel,
        content: content
      };
      
      // 调用API更新状态
      appOpenYoumiPayment(updateData).then(res => {
        uni.hideLoading();
        
        if (res.success) {
          // 更新本地数据
          const index = this.alipayList.findIndex(payment => payment.channel === this.currentYoumiChannel);
          if (index !== -1) {
            this.alipayList[index].status = 1;
          }
          
          uni.showToast({
            title: '有密付收款已开启',
            icon: 'success'
          });
          
          // 重新获取支付设置
          this.getPaymentSettings();
        } else {
          uni.showToast({
            title: res.errorMsg || '开启失败',
            icon: 'none'
          });
        }
      }).catch(e => {
        uni.hideLoading();
        console.error('开启有密付收款失败', e);
        uni.showToast({
          title: '开启失败，请稍后再试',
          icon: 'none'
        });
      });
    },
    // 取消有密付开启
    cancelYoumiPayment() {
      this.showYoumiModal = false;
      this.youmiForm.zfbNumber = '';
      this.youmiForm.zfbName = '';
      this.currentYoumiChannel = null;
    },

    // 显示乐刷支付输入弹窗
    showLeshuaInputModal(channel) {
      this.currentLeshuaChannel = channel;
      this.leshuaForm.member = '';
      this.leshuaForm.apiKey = '';
      this.showLeshuaModal = true;
    },

    // 确认乐刷支付开启
    confirmLeshuaPayment() {
      // 验证输入
      if (!this.leshuaForm.member.trim()) {
        uni.showToast({
          title: '请输入商户号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.leshuaForm.apiKey.trim()) {
        uni.showToast({
          title: '请输入API密钥',
          icon: 'none'
        });
        return;
      }
      
      // 关闭弹窗
      this.showLeshuaModal = false;
      
      // 显示加载状态
      uni.showLoading({
        title: '开启中...'
      });
      
      // 准备更新数据
      const content = JSON.stringify({
        member: this.leshuaForm.member.trim(),
        apiKey: this.leshuaForm.apiKey.trim()
      });
      
      const updateData = {
        channel: this.currentLeshuaChannel,
        content: content
      };
      
      // 调用API更新状态
      appOpenYoumiPayment(updateData).then(res => {
        uni.hideLoading();
        
        if (res.success) {
          // 更新本地数据
          const index = this.alipayList.findIndex(payment => payment.channel === this.currentLeshuaChannel);
          if (index !== -1) {
            this.alipayList[index].status = 1;
          }
          
          uni.showToast({
            title: '乐刷支付收款已开启',
            icon: 'success'
          });
          
          // 重新获取支付设置
          this.getPaymentSettings();
        } else {
          uni.showToast({
            title: res.errorMsg || '开启失败',
            icon: 'none'
          });
        }
      }).catch(e => {
        uni.hideLoading();
        console.error('开启乐刷支付收款失败', e);
        uni.showToast({
          title: '开启失败，请稍后再试',
          icon: 'none'
        });
      });
    },

    // 取消乐刷支付开启
    cancelLeshuaPayment() {
      this.showLeshuaModal = false;
      this.leshuaForm.member = '';
      this.leshuaForm.apiKey = '';
      this.currentLeshuaChannel = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  background-color: #F5F5F5;
  min-height: 100vh;
  padding-bottom: 30rpx;
}

.notice-bar {
  display: flex;
  align-items: center;
  background-color: #FFF9EC;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  
  .notice-text {
    margin-left: 10rpx;
    font-size: 28rpx;
    color: #FF9500;
  }
}

.custom-title {
  display: flex;
  align-items: center;
  
  .payment-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    image {
      width: 50rpx;
      height: 50rpx;
    }
    
    .unionpay-icon {
      background-color: #E60012;
      color: #FFFFFF;
      font-size: 24rpx;
      padding: 6rpx 10rpx;
      border-radius: 6rpx;
    }
  }
  
  .payment-title {
    font-size: 32rpx;
    font-weight: 500;
    margin-left: 20rpx;
  }
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #F5F5F5;
  
  .payment-item-left {
    font-size: 28rpx;
    color: #333333;
  }
  
  .payment-item-right {
    display: flex;
    align-items: center;
    
    text {
      font-size: 28rpx;
      color: #999999;
      margin-right: 10rpx;
    }
  }
}

.payment-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #F5F5F5;
  
  text {
    font-size: 28rpx;
    color: #333333;
  }
}

.qrcode-upload-section {
  padding: 30rpx;
  border-bottom: 1px solid #F5F5F5;
  
  text {
    font-size: 28rpx;
    color: #666666;
  }
  
  .section-title {
    display: block;
    margin: 20rpx 0 10rpx;
    font-weight: 500;
  }
  
  .channel-selection {
    margin-top: 20rpx;
    
    .channel-options {
      display: flex;
      margin-top: 10rpx;
      
      .channel-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 30rpx;
        padding: 20rpx;
        border-radius: 10rpx;
        background-color: #F9F9F9;
        
        text {
          margin-top: 10rpx;
          font-size: 24rpx;
        }
        
        &.active {
          background-color: #ECF5FF;
          border: 1px solid #3B7CFF;
        }
      }
    }
  }
  
  .qrcode-preview {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    
    .qrcode-image {
      width: 160rpx;
      height: 160rpx;
      border: 1px dashed #CCCCCC;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background: #f9f9f9;
      border-radius: 8rpx;
      image {
        width: 100%;
        height: 100%;
      }
      &::after {
        content: '点击更换';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.35);
        color: #fff;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }
      &:hover::after {
        opacity: 1;
      }
    }
    
    .upload-btn {
      width: 200rpx;
      height: 200rpx;
      border: 1px dashed #CCCCCC;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #F9F9F9;
    }
  }
}

.save-btn-container {
  padding: 30rpx;
  
  .save-btn {
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
}

.alipay-list {
  padding: 20rpx;
  
  .alipay-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;
    margin-bottom: 20rpx;
    background-color: #FFFFFF;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    
    .alipay-item-left {
      flex: 1;
      margin-right: 20rpx;
      
      .alipay-name {
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;
        margin-bottom: 8rpx;
      }
      
      .alipay-desc {
        font-size: 26rpx;
        color: #999999;
        line-height: 1.4;
      }
    }
    
    .alipay-item-right {
      flex-shrink: 0;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
  
  .empty-text {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 30rpx;
  }
}

.qrcode-channel-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
  padding: 20rpx 0;

  .qrcode-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .channel-header {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      margin-left: 30rpx;
      .channel-title {
        font-size: 32rpx;
        font-weight: 500;
        margin-left: 10rpx;
      }
    }
  }
  .qrcode-preview {
    margin: 0 20rpx 0 10rpx;
    .qrcode-image, .upload-btn {
      width: 160rpx;
      height: 160rpx;
      border: 1px dashed #CCCCCC;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background: #f9f9f9;
      border-radius: 8rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.change-tip {
  text-align: center;
  color: #888;
  font-size: 24rpx;
  margin-top: 8rpx;
}

.youmi-form, .leshua-form {
  padding: 20rpx 0;
  
  .form-item {
    margin-bottom: 30rpx;
    
    .form-label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .form-input {
      width: 100%;
      height: 80rpx;
      border: 1px solid #e0e0e0;
      border-radius: 8rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background-color: #fff;
      
      &::placeholder {
        color: #999;
      }
      
      &:focus {
        border-color: #007be6;
      }
    }
  }
}
</style> 