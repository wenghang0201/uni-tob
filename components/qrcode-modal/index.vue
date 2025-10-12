<template>
  <view class="qrcode-modal" v-if="visible" @click="closeModal">
    <view class="modal-content" @click.stop>
      <view class="qrcode-container">
        <view class="qrcode-title">请使用支付宝扫描二维码</view>
        <view class="qrcode-wrapper">
          <canvas
            class="qrcode-canvas"
            canvas-id="qrcodeCanvas"
            width="260"
            height="260"
            :style="{ width: '260px', height: '260px' }"
          ></canvas>
        </view>
        <view class="qrcode-tip">点击二维码区域外关闭</view>
      </view>
    </view>
  </view>
</template>

<script>
import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'

export default {
  name: 'QRCodeModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    qrcodeUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      canvasSize: 260, // px单位
    }
  },
  onReady() {
    if (this.visible && this.qrcodeUrl) {
      setTimeout(() => {
        this.generateQRCode();
      }, 200);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.qrcodeUrl) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateQRCode();
          }, 100);
        });
      }
    },
    qrcodeUrl(newVal) {
      if (newVal && this.visible) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.generateQRCode();
          }, 100);
        });
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    generateQRCode() {
      if (!this.qrcodeUrl) {
        uni.showToast({
          title: '二维码内容为空',
          icon: 'none'
        });
        return;
      }
      try {
        const qr = new UQRCode();
        qr.data = this.qrcodeUrl;
        qr.size = this.canvasSize;
        qr.make();
        const canvasContext = uni.createCanvasContext('qrcodeCanvas', this);
        qr.canvasContext = canvasContext;
        canvasContext.setFillStyle('#ffffff');
        canvasContext.fillRect(0, 0, this.canvasSize, this.canvasSize);
        qr.drawCanvas();
        canvasContext.draw(true);
      } catch (error) {
        uni.showToast({
          title: '二维码生成失败',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-content {
    background-color: #FFFFFF;
    border-radius: 16px;
    padding: 20px 8px;
    margin: 0 8px;
    max-width: 95vw;
    width: 100%;
    box-sizing: border-box;
    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      .qrcode-title {
        font-size: 22px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 18px;
        text-align: center;
      }
      .qrcode-wrapper {
        width: 280px;
        height: 280px;
        max-width: 320px;
        height: auto;
        background-color: #F8F8F8;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 18px auto;
        border: 2px solid #E5E5E5;
        .qrcode-canvas {
          width: 260px;
          height: 260px;
          margin: 10px;
          border-radius: 8px;
          display: block;
        }
      }
      .qrcode-tip {
        font-size: 16px;
        color: #999999;
        text-align: center;
      }
    }
  }
}
</style> 