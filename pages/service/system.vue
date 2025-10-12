<template>
	<view class="contact-container">
		<nav-bar :title="'联系客服'" :back="true"></nav-bar>
		<view class="content">
			<!-- 加载状态 -->
			<view class="loading-container" v-if="loading">
				<uni-load-more status="loading" :showText="false"></uni-load-more>
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 错误状态 -->
			<view class="error-container" v-else-if="errorMsg">
				<image class="error-icon" src="/static/images/common/error.png" mode="aspectFit"></image>
				<text class="error-text">{{ errorMsg }}</text>
				<button class="retry-btn" @click="getAppConfigData">重试</button>
			</view>
			
			<!-- 正常显示内容 -->
			<view class="qr-section" v-else>
				<view class="qr-wrapper">
					<!-- 直接显示图片 -->
					<image v-if="qrText" :src="qrText" style="width: 100%; height: 100%;" mode="aspectFit"></image>
					<!-- <canvas id="qrcode" canvas-id="qrcode" style="width: 200px; height: 200px;"></canvas> -->
				</view>
				<view class="qr-tips" v-if="qrText">扫描二维码添加客服微信</view>
				<!-- 移除下载按钮 -->
				<!-- <button 
					class="download-btn" 
					@click="saveQrcode"
					v-if="qrText"
				>下载二维码</button> -->
				
				<!-- 客服电话 -->
				<!-- <view class="phone-section" v-if="customerServicePhone">
					<view class="phone-label">客服电话:</view>
					<view class="phone-number" @click="callPhoneNumber">{{ customerServicePhone }}</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	// 移除 UQRCode 导入
	// import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'
	import request from '@/util/ajax'
	
	export default {
		data() {
			return {
				qrText: '', // 客服二维码链接 (现在是图片URL)
				customerServicePhone: '', // 客服电话
				loading: false,
				errorMsg: '' // 错误信息
			}
		},
		onLoad() {
			this.getAppConfigData();
		},
		methods: {
			// 获取应用配置信息
			getAppConfigData() {
				console.log('获取应用配置信息');
				this.loading = true;
				this.errorMsg = '';
				
				request({
					url: '/app/base/getAppConfig',
					method: 'get'
				}).then(res => {
					console.log('应用配置返回:', res);
					
					if (res.success) {
						// 直接使用返回的二维码图片URL
						this.qrText = res.customerServiceQRCode || '';
						this.customerServicePhone = res.customerServicePhone || '';
						console.log('客服二维码图片URL:', this.qrText);
						console.log('客服电话:', this.customerServicePhone);
						
						// 如果都没有，显示错误信息
						if (!this.qrText && !this.customerServicePhone) {
							this.errorMsg = '未获取到客服联系方式';
						}
					} else {
						console.error('获取应用配置失败:', res.errorMsg);
						this.errorMsg = res.errorMsg || '获取客服信息失败';
					}
					
					this.loading = false;
				}).catch(err => {
					console.error('获取应用配置异常:', err);
					this.errorMsg = '网络异常，请重试';
					this.loading = false;
				});
			},
			
			// 移除 generateQrCode 方法
			/*
			generateQrCode() {
				if (!this.qrText) return;
				
				console.log('开始生成二维码');
				const qr = new UQRCode();
				qr.data = this.qrText;
				qr.size = 200;
				qr.make();
				const canvasContext = uni.createCanvasContext('qrcode', this);
				qr.canvasContext = canvasContext;
				qr.drawCanvas();
			},
			*/
			
			// 移除 saveQrcode 方法
			/*
			saveQrcode() {
				uni.canvasToTempFilePath({
					canvasId: 'qrcode',
					success: (res) => {
						// #ifdef H5
						const a = document.createElement('a');
						a.href = res.tempFilePath;
						a.download = '客服二维码.png';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						// #endif
						
						// #ifdef MP || APP-PLUS
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '保存成功',
									icon: 'success'
								});
							},
							fail: (err) => {
								console.error('保存图片失败', err);
								// 处理权限问题
								if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
									uni.showModal({
										title: '授权提示',
										content: '需要相册权限才能保存图片',
										success: (modalRes) => {
											if (modalRes.confirm) {
												uni.openSetting();
											}
										}
									});
								} else {
									uni.showToast({
										title: '保存失败',
										icon: 'none'
									});
								}
							}
						});
						// #endif
					},
					fail: () => {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
					});
				}
			}, this);
			},
			*/
			
			// 拨打电话
			callPhoneNumber() {
				if (this.customerServicePhone) {
					uni.makePhoneCall({
						phoneNumber: this.customerServicePhone
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contact-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		
		.content {
			padding-top: 88rpx; // nav-bar高度 + 一点间距
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.loading-container,
			.error-container {
				width: 100%;
				padding-top: 100rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.loading-text,
				.error-text {
					margin-top: 20rpx;
					color: #999;
					font-size: 28rpx;
				}
				
				.error-icon {
					width: 150rpx;
					height: 150rpx;
					margin-bottom: 20rpx;
				}
				
				.retry-btn {
					margin-top: 40rpx;
					background-color: #007AFF;
					color: #fff;
					border: none;
					padding: 8px 20px;
					border-radius: 20px;
					font-size: 14px;
				}
			}
			
			.qr-section {
				background-color: #fff;
				border-radius: 12px;
				padding: 30px;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 15px;
				width: calc(100% - 30px);
				box-sizing: border-box;
				
				.qr-wrapper {
					width: 300px;
					height: 300px;
					margin-bottom: 20px;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #fff;
					border-radius: 8px;
					overflow: hidden;
				}
				
				.qr-tips {
					font-size: 16px;
					color: #333;
					margin-bottom: 30px;
				}
				
				/* 移除下载按钮样式 */
				/*
				.download-btn {
					background-color: #007AFF;
					color: #fff;
					border: none;
					padding: 10px 30px;
					border-radius: 25px;
					font-size: 16px;
					margin-bottom: 20px; // 与电话部分间隔
					
					&:active {
						opacity: 0.8;
					}
				}
				*/
				
				.phone-section {
					display: flex;
					align-items: center;
					margin-top: 20px;
					
					.phone-label {
						color: #666;
						font-size: 16px;
						margin-right: 10px;
					}
					
					.phone-number {
						color: #007AFF;
						font-size: 16px;
						font-weight: bold;
						text-decoration: underline;
					}
				}
			}
		}
	}
</style> 