<template>
	<view class="qrcode-payment-page">
		<!-- 顶部导航 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="20" color="#333"></u-icon>
			</view>
			<view class="nav-center">
				<text class="nav-title">{{ title }}</text>
			</view>
			<view class="nav-right"></view>
		</view>

		<!-- 支付金额 -->
		<view class="amount-card">
			<view class="amount-content">
				<text class="amount-label">支付金额</text>
				<text class="amount-value">¥{{ paymentAmount }}</text>
			</view>
		</view>

		<!-- 支付渠道信息 -->
		<view class="payment-info-card" v-if="paymentInfo">
			<view class="card-title">
				<text class="title-text">支付渠道</text>
			</view>
			<view class="payment-info">
				<view class="payment-icon">
					<view class="icon-bg" :class="getPaymentIconClass(paymentInfo)">
						<text class="icon-text">{{ getPaymentIconText(paymentInfo) }}</text>
					</view>
				</view>
				<view class="payment-details">
					<text class="payment-name">{{ paymentInfo.description }}</text>
					<text class="payment-desc">{{ '快捷支付' }}</text>
				</view>
			</view>
		</view>

		<!-- 二维码显示 -->
		<view class="qrcode-card" v-if="paymentInfo && paymentInfo.content">
			<view class="card-title">
				<text class="title-text">请扫描二维码完成支付</text>
			</view>
			<view class="qrcode-container">
				<image 
					class="qrcode-image" 
					:src="paymentInfo.content" 
					mode="aspectFit"
					@error="onQrcodeError"
				></image>
			</view>
			<view class="qrcode-tips">
				<text class="tips-text">请使用{{ getPaymentAppName(paymentInfo) }}扫描二维码完成支付</text>
			</view>
		</view>

		<!-- 支付凭证上传 -->
		<view class="voucher-card">
			<view class="card-title">
				<text class="title-text">支付凭证</text>
			</view>
			<view class="upload-container">
				<view class="upload-area" @click="chooseImage" v-if="!voucherImage">
					<u-icon name="camera" size="40" color="#999"></u-icon>
					<text class="upload-text">点击上传支付凭证</text>
				</view>
				<view class="image-preview" v-else>
					<image 
						class="preview-image" 
						:src="voucherImage" 
						mode="aspectFit"
						@click="previewImage"
					></image>
					<view class="image-actions">
						<button class="action-btn" @click="chooseImage">重新上传</button>
						<button class="action-btn delete-btn" @click="deleteImage">删除</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-section">
			<button 
				class="submit-btn" 
				:class="{ disabled: !canSubmit }"
				@click="submitPayment"
				:disabled="!canSubmit"
			>
				提交支付凭证
			</button>
		</view>
	</view>
</template>

<script>
import { getPlatformShopPayment,storeQrcodeRecharge } from "@/api/shop.js"
import cfg from '@/util/environment.js';

export default {
	data() {
		return {
			paymentAmount: '0.00',
			paymentCode: '',
			paymentInfo: null,
			voucherImage: '', // 本地图片路径，用于显示
			voucherImageUrl: '', // 服务器返回的图片URL，用于提交
			isLoading: false,
			title:'二维码支付'
		}
	},
	computed: {
		canSubmit() {
			return this.paymentInfo && this.voucherImageUrl && !this.isLoading
		}
	},
	onLoad(options) {
		// 获取页面参数
		if (options.amount) {
			this.paymentAmount = options.amount
		}
		if (options.code) {
			this.paymentCode = options.code
			this.getPaymentInfo()
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		// 获取支付渠道信息
		getPaymentInfo() {
			if (!this.paymentCode) return
			
			uni.showLoading({
				title: '加载中...'
			})
			
			getPlatformShopPayment({id:-1,channel:this.paymentCode}).then(res => {
				uni.hideLoading()
				this.paymentInfo = res;
				if (!this.paymentInfo) {
					uni.showToast({
						title: '未找到支付渠道信息',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.error('获取支付渠道信息失败:', err)
				uni.showToast({
					title: '获取支付渠道信息失败',
					icon: 'none'
				})
			})
		},
		// 获取支付方式图标样式类
		getPaymentIconClass(item) {
			const name = (item.name || '').toLowerCase()
			const desc = (item.description || '').toLowerCase()
			
			if (name.includes('支付宝') || name.includes('alipay')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return 'qrcode-bg'
				}
				return 'alipay-bg'
			} else if (name.includes('微信') || name.includes('wechat')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return 'qrcode-bg'
				}
				return 'wechat-bg'
			} else if (name.includes('银行卡') || name.includes('bank')) {
				return 'bank-bg'
			} else if (desc.includes('二维码') || desc.includes('qr')) {
				return 'qrcode-bg'
			} else {
				return 'default-bg'
			}
		},
		// 获取支付方式图标文字
		getPaymentIconText(item) {
			const name = (item.name || '').toLowerCase()
			const desc = (item.description || '').toLowerCase()
			
			if (name.includes('支付宝') || name.includes('alipay')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return '码'
				}
				return '支'
			} else if (name.includes('微信') || name.includes('wechat')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return '码'
				}
				return '微'
			} else if (name.includes('银行卡') || name.includes('bank')) {
				return '银'
			} else if (desc.includes('二维码') || desc.includes('qr')) {
				return '码'
			} else {
				return '支'
			}
		},
		// 获取支付应用名称
		getPaymentAppName(item) {
			const name = (item.name || '').toLowerCase()
			if (name.includes('支付宝') || name.includes('alipay')) {
				return '支付宝'
			} else if (name.includes('微信') || name.includes('wechat')) {
				return '微信'
			} else {
				return '对应应用'
			}
		},
		// 二维码加载错误
		onQrcodeError() {
			uni.showToast({
				title: '二维码加载失败',
				icon: 'none'
			})
		},
		// 选择图片
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					// 先显示本地图片
					this.voucherImage = res.tempFilePaths[0]
					// 清空之前的服务器URL
					this.voucherImageUrl = ''
					// 上传图片到服务器
					this.uploadImage(res.tempFilePaths[0])
				},
				fail: (err) => {
					console.error('选择图片失败:', err)
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					})
				}
			})
		},
		// 上传图片到服务器
		uploadImage(filePath) {
			uni.showLoading({
				title: '上传中...'
			})
			
			uni.uploadFile({
				url: cfg.BASE_API + '/file/upload', // 根据实际的上传接口调整
				filePath: filePath,
				name: 'file',
				formData: {
					type: 'voucher'
				},
				success: (res) => {
					uni.hideLoading()
					try {
						const data = JSON.parse(res.data)
						if (data.success) {
							// 保存服务器返回的图片URL
							this.voucherImageUrl = data.url || data.filePath || data.fileUrl
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: data.errorMsg || '上传失败',
								icon: 'none'
							})
						}
					} catch (e) {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						})
					}
				},
				fail: (err) => {
					uni.hideLoading()
					console.error('上传图片失败:', err)
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					})
				}
			})
		},
		// 预览图片
		previewImage() {
			uni.previewImage({
				urls: [this.voucherImage],
				current: this.voucherImage
			})
		},
		// 删除图片
		deleteImage() {
			this.voucherImage = ''
			this.voucherImageUrl = ''
			uni.showToast({
				title: '已删除',
				icon: 'success'
			})
		},
		// 提交支付凭证
		submitPayment() {
			if (!this.canSubmit) return
			
			this.isLoading = true
			uni.showLoading({
				title: '提交中...'
			})
			
			// 调用storeQrcodeRecharge接口
			const params = {
				amount: this.paymentAmount,
				voucherImage: this.voucherImageUrl,
				channel: this.paymentCode
			}
			
			storeQrcodeRecharge(params).then(res => {
				uni.hideLoading()
				this.isLoading = false
				
				if (res.success) {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					})
					uni.navigateBack()
				} else {
					uni.showToast({
						title: res.errorMsg || '提交失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				this.isLoading = false
				console.error('提交支付凭证失败:', err)
				uni.showToast({
					title: '提交失败，请重试',
					icon: 'none'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.qrcode-payment-page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
}

.nav-header {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	
	.nav-left {
		width: 30%;
		display: flex;
		align-items: center;
		padding-left: 30rpx;
	}
	
	.nav-center {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.nav-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.nav-right {
		width: 30%;
	}
}

.amount-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.amount-content {
		text-align: center;
		
		.amount-label {
			font-size: 28rpx;
			color: #666;
			margin-bottom: 10rpx;
			display: block;
		}
		
		.amount-value {
			font-size: 48rpx;
			color: #333;
			font-weight: bold;
		}
	}
}

.payment-info-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.card-title {
		margin-bottom: 20rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.payment-info {
		display: flex;
		align-items: center;
		
		.payment-icon {
			margin-right: 30rpx;
			
			.icon-bg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				&.alipay-bg {
					background-color: #1677ff;
				}
				
				&.wechat-bg {
					background-color: #07c160;
				}
				
				&.bank-bg {
					background-color: #ff9500;
				}
				
				&.qrcode-bg {
					background-color: #ff6b35;
				}
				
				&.default-bg {
					background-color: #1677ff;
				}
				
				.icon-text {
					color: #fff;
					font-size: 32rpx;
					font-weight: bold;
				}
			}
		}
		
		.payment-details {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.payment-name {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
				margin-bottom: 4rpx;
				line-height: 1.2;
			}
			
			.payment-desc {
				font-size: 22rpx;
				color: #999;
				line-height: 1.2;
			}
		}
	}
}

.qrcode-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.card-title {
		margin-bottom: 30rpx;
		text-align: center;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.qrcode-container {
		display: flex;
		justify-content: center;
		margin-bottom: 30rpx;
		
		.qrcode-image {
			width: 400rpx;
			height: 400rpx;
			border-radius: 16rpx;
			background-color: #f8f8f8;
		}
	}
	
	.qrcode-tips {
		text-align: center;
		
		.tips-text {
			font-size: 24rpx;
			color: #666;
		}
	}
}

.voucher-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.card-title {
		margin-bottom: 20rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.upload-container {
		.upload-area {
			height: 200rpx;
			border: 2rpx dashed #ddd;
			border-radius: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #f8f8f8;
			
			.upload-text {
				font-size: 28rpx;
				color: #999;
				margin-top: 20rpx;
			}
		}
		
		.image-preview {
			.preview-image {
				width: 100%;
				height: 300rpx;
				border-radius: 12rpx;
				margin-bottom: 20rpx;
			}
			
			.image-actions {
				display: flex;
				gap: 20rpx;
				
				.action-btn {
					flex: 1;
					height: 60rpx;
					border-radius: 30rpx;
					border: 1rpx solid #007aff;
					background-color: #fff;
					color: #007aff;
					font-size: 28rpx;
					
					&.delete-btn {
						border-color: #ff4757;
						color: #ff4757;
					}
				}
			}
		}
	}
}

.submit-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 30rpx;
	background-color: #fff;
	border-top: 1rpx solid #f0f0f0;
	
	.submit-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #007aff, #5ac8fa);
		border-radius: 44rpx;
		border: none;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		
		&.disabled {
			background: linear-gradient(135deg, #ccc, #e0e0e0);
			color: #999;
		}
	}
}
</style> 