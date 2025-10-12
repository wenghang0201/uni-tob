<template>
    <view>
     <!-- 邀请好友弹窗 -->
        <u-popup :show="invitePopupShow" mode="center" @close="closeInvitePopup" :overlay-opacity="0.5" width="100%" bgColor="transparent"
       >
        <view class="relative flex flex-col items-center w-full">
            <view class="relative flex justify-center items-center" id="poster"  @click="closeInvitePopup">
            <image src="/static/images/personal/share-poster.png" mode="widthFix" class="w-663 rounded-32" />
            <view class="absolute bgc-fff rounded-8 p-10" v-if="shareQrUrl" style="left:auto;bottom:auto;margin-top: 250rpx;">
				    <view class="text-center flex items-center justify-center fs-26 fw-500 " style="margin-top: -10rpx;color:var(--blue1)">{{shopName}}</view>
                <SannQrcode ref="uqrcode" :canvasId="canvasId" :size="inviteQrCodeSize" :value="shareQrUrl" class="z-50" />
            </view>
            </view>
            <text class="mt-30 c-fff fs-32 fw-600" @click="closeInvitePopup">
            截图保存
            </text>
        </view>
        </u-popup>
    </view>
</template>
<script>
import SannQrcode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'
import { domainQuery } from "@/api/shop.js"

export default {
    components: {
        SannQrcode
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show(val) {
            if (val) {
                this.showInvitePopup();
            } else {
                this.closeInvitePopup();
            }
        }
    },
    data() {
        return {
            invitePopupShow: false,
            shareQrUrl: '',
            canvasId: 'inviteQrCodeCanvas',
            qrCodeSize: 200, // 默认二维码大小（px）
            inviteQrCodeSize: 120, // 邀请好友弹窗中的二维码大小（px）
			shopName:uni.getStorageSync('shop').name
        }
    },
    created() {
        // this.generateQrCode();
        // this.showInvitePopup();
    },
    methods: {
        closeInvitePopup(){
            this.invitePopupShow = false;
            this.$emit('close')
        },
    // 显示邀请好友弹窗
    showInvitePopup() {
      // 设置邀请好友弹窗中的二维码大小
      this.calculateQrCodeSize('invite');

      this.invitePopupShow = true;
      this.generateQrCode();

      // 等待二维码组件渲染完成
      this.$nextTick(() => {
        if (this.$refs.uqrcode) {
          this.$refs.uqrcode.toTempFilePath({
            success: res => {
              console.log('邀请好友二维码生成成功');
            }
          });
        }
      });
    },
        
    // 生成二维码
    generateQrCode() {
      let user = {
        id: '',
        tenantId: ''
      };
      let vue_userInfo = uni.getStorageSync('vue_userInfo');
      if (vue_userInfo) {
        user = vue_userInfo;
      }

      domainQuery().then(res => {
        if (res && res.voList && res.voList.length > 0) {
          let domain = res.voList[0];
          let uid = (user.isAgent==2 ? user.id : user.pid)||user.id;
          let url = `${domain.appUrl ? domain.appUrl : window.location.origin}${domain.appUrl && domain.appUrl.slice(-1) == '/' ? '' : '/'}`;
          let inv =  `pages/user/register?uid=${uid}&tenantId=${user.tenantId}&actUid=${user.id}`;
          this.shareQrUrl = url + inv;
          // 等待二维码组件渲染完成
          this.$nextTick(() => {
            if (this.$refs.uqrcode) {
              this.$refs.uqrcode.toTempFilePath({
                success: res => {
                  console.log('二维码生成成功');
                }
              });
            }
          });
        }
      }).catch(err => {
        console.error('获取域名失败：', err);
        // 使用默认URL
        this.shareQrUrl = window.location.origin + '/#/pages/user/register?uid=' + (user.id || '') + '&tenantId=' + (user.tenantId || '');
      });
    },


     // 计算二维码大小 - 通用方法
     calculateQrCodeSize(type = 'card') {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync();

      // 计算 rpx 到 px 的转换比例
      const rpxToPxRatio = systemInfo.windowWidth / 750;

      // 根据类型设置不同的 rpx 值
      let sizeRpx, logPrefix;

      if (type === 'card') {
        // 二维码邀请卡弹窗
        sizeRpx = 410;
        logPrefix = '二维码邀请卡弹窗';
        this.qrCodeSize = Math.round(sizeRpx * rpxToPxRatio);
      } else if (type === 'invite') {
        // 邀请好友弹窗
        sizeRpx = 220;
        logPrefix = '邀请好友弹窗';
        this.inviteQrCodeSize = Math.round(sizeRpx * rpxToPxRatio);
      }

      // 输出日志
      console.log(`${logPrefix} - rpx 到 px 的转换比例:`, rpxToPxRatio);
      console.log(`${logPrefix} - 二维码大小 (rpx):`, sizeRpx);
      console.log(`${logPrefix} - 二维码大小 (px):`, type === 'card' ? this.qrCodeSize : this.inviteQrCodeSize);

      // 返回计算后的 px 值
      return type === 'card' ? this.qrCodeSize : this.inviteQrCodeSize;
    },


    },
}
</script>