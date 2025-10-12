<template>
	<view class="contact-container">
		<nav-bar :title="'联系客服'" :back="true"></nav-bar>
		<view class="content">
			<view class="qr-section">
				<view class="qr-wrapper">
					<!-- 直接显示图片 -->
					<image v-if="qrText" :src="qrText" style="width: 300px; height: 300px;" mode="aspectFit"></image>
					<!-- <canvas id="qrcode" canvas-id="qrcode" style="width: 200px; height: 200px;"></canvas> -->
				</view>
				
				<view class="logout-button">
					<button class="logout-btn" @click="uploadContact">上传客服二维码</button>
				</view>
				<!-- <view class="qr-tips" v-if="qrText">扫描二维码添加客服微信</view> -->
				<!-- 移除下载按钮 -->
				<!-- <button 
					class="download-btn" 
					@click="saveQrcode"
				>下载二维码</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	// 移除 UQRCode 导入
	// import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'
	import { getCurrentStoreInfo,updateStoreSetting } from '@/api/shop.js'
	import { compressImage } from '@/util/image-tool.js';
	import cfg from '@/util/environment.js'
	export default {
		data() {
			return {
				qrText: '', // 客服二维码图片URL
				loading: false,
				errorMsg: '' // 错误信息
			}
		},
		onLoad() {
			this.getShopInfo();
		},
		methods: {
			// 获取店铺信息
			getShopInfo() {
				console.log('获取店铺信息');
				this.loading = true;
				this.errorMsg = ''; // 清空错误信息
				
				getCurrentStoreInfo().then(res => {
					console.log('店铺信息返回:', res);
					
					if (res.success && res.customerServiceQrCode) {
						// 直接使用返回的二维码图片URL
						this.qrText = res.customerServiceQrCode;
						console.log('客服二维码图片URL:', this.qrText);
						// 不再需要生成二维码
						// this.generateQrCode();
					} else {
						console.error('获取客服二维码失败:', res.errorMsg);
						this.errorMsg = res.errorMsg || '获取客服信息失败';
						// 不再使用默认值和生成
						// this.qrText = 'wx123456';
						// this.generateQrCode();
					}
					
					this.loading = false;
				}).catch(err => {
					console.error('获取店铺信息异常:', err);
					this.errorMsg = '网络异常，请重试';
					// 不再使用默认值和生成
					// this.qrText = 'wx123456';
					// this.generateQrCode();
					this.loading = false;
				});
			},
			// 更新店铺设置
			updateStoreSettings() {
				const params = {
					customerServiceQrCode: this.qrText
				};
				
				updateStoreSetting(params).then(res => {
					console.log('更新店铺客服二维码返回:', res);
					
					if (res.success) {
						uni.showToast({
							title: '客服二维码已更新',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.errorMsg || '更新客服二维码失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('更新店铺客服二维码失败:', err);
				});
			},
			uploadContact() {
				uni.chooseImage({
					count: 9, // 更改为可选择多张图片
					sourceType: ['camera', 'album'], //拍照或相册
					sizeType: ['compressed'], //压缩
					success: (res) => {
						// this.uploadImages(res.tempFilePaths);
						compressImage(res.tempFilePaths, {
			                maxSize: 200,
			                maxWidth: 800,
			                maxHeight: 800,
			                quality: 0.7
			            }).then(compressedImage => {
			                // 上传压缩后的图片
			                console.log("compressedImage", compressedImage)
			                this.uploadImages([compressedImage]);
			            });
					}
				})
			},
			
			// 上传多个图片的方法
			uploadImages(tempFilePaths) {
				if (!tempFilePaths || tempFilePaths.length === 0) return;
			
				uni.showLoading({
					title: '上传中...'
				});
			
				// 处理单张图片上传，后续可扩展为批量上传
				var tempPath = tempFilePaths[0];
				uni.uploadFile({
					url: cfg.BASE_API + "/file/upload",
					filePath: tempPath,
					name: 'file',
					header: {
						'x-access-token': uni.getStorageSync("vue_authtoken"),
						'X-Sys': 1,
						'X-User': uni.getStorageSync("admin_user"),
					},
					success: (uploadFileRes) => {
						if (uploadFileRes.statusCode == 200) {
							const imageUrl = (JSON.parse(uploadFileRes.data)).url;
							this.qrText = imageUrl;
							uni.hideLoading();
							this.updateStoreSettings();
							
							// uni.showToast({
							// 	title: "上传成功",
							// 	icon: "success"
							// });
						}
					},
					fail: (res) => {
						uni.hideLoading();
						console.log("上传失败==" + JSON.stringify(res));
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.contact-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		
		.content {
			padding-top: 88rpx; // 调整单位为rpx
			display: flex;      // 添加flex布局使内容居中
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
				width: calc(100% - 30px); // 使宽度适应屏幕
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
				/* 按钮文本垂直居中 */
				.btn-text-center {
					vertical-align: middle;
					line-height: 100rpx;
				}
				.logout-button {
					padding: 60rpx 30rpx;
					
					.logout-btn {
						width: 100%;
						height: 90rpx;
						line-height: 90rpx;
						text-align: center;
						color: #fff;
						font-size: 30rpx;
						background-color: #2979ff;
						border-radius: 8rpx;
					}
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
					
					&:active {
						opacity: 0.8;
					}
				}
				*/
			}
		}
	}
</style> 