<template>
	<view class="recharge-page">
		<!-- 顶部导航 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="20" color="#333"></u-icon>
			</view>
			<view class="nav-center">
				<text class="nav-title">充值</text>
			</view>
			<view class="nav-right" @click="goToRechargeRecords">
				<text class="nav-link">充值记录</text>
			</view>
		</view>

		<!-- 当前余额 -->
		<view class="balance-card">
			<view class="balance-content">
				<text class="balance-label">当前余额：</text>
				<text class="balance-amount">{{ currentBalance }}</text>
			</view>
		</view>

		<!-- 选择充值金额 -->
		<view class="amount-card">
			<view class="card-title">
				<text class="title-text">请选择充值金额</text>
			</view>
			<view class="amount-grid">
				<view 
					class="amount-item" 
					:class="{ active: selectedAmount === item.value }"
					v-for="item in amountOptions" 
					:key="item.value"
					@click="selectAmount(item.value)"
				>
					<text class="amount-text">¥{{ item.value }}</text>
				</view>
			</view>
			<view class="custom-amount">
				<view class="custom-input">
					<text class="currency-symbol">¥</text>
					<input 
						class="amount-field" 
						type="number" 
						v-model="customAmount"
						placeholder="请输入充值金额"
						@input="onCustomAmountInput"
						@focus="onCustomAmountFocus"
					/>
				</view>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="payment-card">
			<view class="card-title">
				<text class="title-text">支付方式</text>
			</view>
			<view class="payment-warning" v-if="!paymentEnabled">
				<text class="warning-text">暂无充值渠道</text>
			</view>
			<view class="payment-list" v-if="paymentEnabled && paymentList.length > 0">
				<view 
					class="payment-item" 
					v-for="item in paymentList" 
					:key="item.id"
					@click="selectPayment(item)"
				>
					<view class="payment-icon">
						<view class="icon-bg" :class="getPaymentIconClass(item)">
							<text class="icon-text">{{ getPaymentIconText(item) }}</text>
						</view>
					</view>
					<view class="payment-info">
						<text class="payment-name">{{ item.description }}</text>
						<text class="payment-desc">{{ '快捷支付' }}</text>
					</view>
					<view class="payment-status">
						<view 
							class="status-circle" 
							:class="{ active: selectedPayment && selectedPayment.id === item.id }"
						></view>
					</view>
				</view>
			</view>
			<view class="recharge-button">
				<button 
					class="submit-btn" 
					:class="{ disabled: !canSubmit }"
					@click="submitRecharge"
					:disabled="!canSubmit"
				>
					充值
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getCurrentStoreInfo,
	getPlatformPaymentList,
	createAlipayOrder
} from "@/api/shop.js"

export default {
	data() {
		return {
			currentBalance: '0.00',
			selectedAmount: '',
			customAmount: '',
			amountOptions: [
				{ value: '11' },
				{ value: '52' },
				{ value: '101' },
				{ value: '202' },
				{ value: '501' },
				{ value: '1001' }
			],
			paymentEnabled: false, // 模拟店主未开通充值渠道
			useCustomAmount: false,
			paymentList: [], // 新增：存储支付方式列表
			selectedPayment: null // 新增：存储选中的支付方式
		}
	},
	computed: {
		canSubmit() {
			const amount = this.useCustomAmount ? this.customAmount : this.selectedAmount
			return this.paymentEnabled && amount && parseFloat(amount) > 0 && this.selectedPayment
		}
	},
	onLoad() {
		this.getBalanceInfo();
		this.getPaymentList();
	},
	onShow() {
		// 每次显示页面时刷新余额和支付方式
		this.getBalanceInfo();
		this.getPaymentList();
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		// 获取余额信息
		getBalanceInfo() {
			getCurrentStoreInfo().then(res => {
				// 更新当前余额
				this.currentBalance = res.gold || 0;
				console.log('获取店铺余额成功:', res.gold);
			}).catch(err => {
				console.error('获取店铺余额失败:', err);
				this.currentBalance = '0.00';
			});
		},
		goToRechargeRecords() {
			uni.navigateTo({
				url: '/pages/personal/transactionRecords?type=recharge'
			})
		},
		selectAmount(value) {
			this.selectedAmount = value
			this.useCustomAmount = false
			this.customAmount = ''
		},
		onCustomAmountInput(e) {
			this.customAmount = e.detail.value
		},
		onCustomAmountFocus() {
			this.selectedAmount = ''
			this.useCustomAmount = true
		},
		// 获取支付方式列表
		getPaymentList() {
			getPlatformPaymentList({ id: -1 }).then(res => {
				// 过滤状态为1的支付方式，并按channel倒序排列
				this.paymentList = res.voList
					.filter(item => item.status === 1)
					.sort((a, b) => (b.channel || 0) - (a.channel || 0));
				
				this.paymentEnabled = this.paymentList.length > 0;
				
				// 如果有可用支付方式，默认选中第一个
				if (this.paymentList.length > 0) {
					this.selectedPayment = this.paymentList[0];
				}
				
				console.log('获取支付方式列表成功:', this.paymentList);
			}).catch(err => {
				console.error('获取支付方式列表失败:', err);
				this.paymentEnabled = false;
				this.paymentList = [];
			});
		},
		// 选择支付方式
		selectPayment(item) {
			this.selectedPayment = item;
		},
		// 获取支付方式图标样式类
		getPaymentIconClass(item) {
			const name = (item.name || '').toLowerCase();
			const desc = (item.description || '').toLowerCase();
			
			if (name.includes('支付宝') || name.includes('alipay')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return 'qrcode-bg';
				}
				return 'alipay-bg';
			} else if (name.includes('微信') || name.includes('wechat')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return 'qrcode-bg';
				}
				return 'wechat-bg';
			} else if (name.includes('银行卡') || name.includes('bank')) {
				return 'bank-bg';
			} else if (desc.includes('二维码') || desc.includes('qr')) {
				return 'qrcode-bg';
			} else {
				return 'default-bg';
			}
		},
		// 获取支付方式图标文字
		getPaymentIconText(item) {
			const name = (item.name || '').toLowerCase();
			const desc = (item.description || '').toLowerCase();
			
			if (name.includes('支付宝') || name.includes('alipay')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return '码';
				}
				return '支';
			} else if (name.includes('微信') || name.includes('wechat')) {
				if (desc.includes('二维码') || desc.includes('qr')) {
					return '码';
				}
				return '微';
			} else if (name.includes('银行卡') || name.includes('bank')) {
				return '银';
			} else if (desc.includes('二维码') || desc.includes('qr')) {
				return '码';
			} else {
				return '支';
			}
		},
		submitRecharge() {
			if (!this.canSubmit) return
			
			const amount = this.useCustomAmount ? this.customAmount : this.selectedAmount
			const channel = this.selectedPayment.channel
			
			// 根据channel范围判断支付类型
			const isQrcodePayment = channel > 1000 && channel < 2000
			const isAlipayPayment = channel > 2000
			
			if (isQrcodePayment) {
				// 跳转到二维码支付页面
				uni.navigateTo({
					url: `/pages/personal/qrcodePayment?amount=${amount}&code=${channel}`
				})
			} else if (isAlipayPayment) {
				// 支付宝支付
				this.handleAlipayPayment(amount, channel)
			} else {
				// 其他支付方式的处理逻辑
				uni.showLoading({
					title: '充值中...'
				})
				
				// 这里可以调用实际的充值API，传入选中的支付方式信息
				console.log('充值信息:', {
					amount: amount,
					paymentMethod: this.selectedPayment
				})
				
				// 模拟充值
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '充值成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 2000)
			}
		},
		// 判断是否为iOS设备
		isIOSPlatform() {
		    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
		},
		openAlipay(alipayUrl) {
		    if (this.isIOSPlatform()) {
				console.log("创建打开支付宝a标签");
		        // 创建a标签
		        var a = document.createElement('a');
		        a.href = alipayUrl;
		        a.style.display = 'none';
		        document.body.appendChild(a);
		        a.click();
		        // 移除a标签
		        document.body.removeChild(a);
		    } else {
		        // 其他平台可以直接跳转
				window.open(alipayUrl)
		    }
		},
		// 处理支付宝支付
		handleAlipayPayment(amount, channel) {
			uni.showLoading({
				title: '正在验证参数...'
			})
			
			const params = {
				price: parseFloat(amount), // 金额
				payType: 0, // 支付方式：0 支付宝
				channelId: channel // 对应的channel
			}
			
			createAlipayOrder(params).then(res => {
				uni.hideLoading()
				console.log("res",res)
				if (res.success && res.url) {
					let payTips = "正在唤起支付...";
					uni.showToast({
						title:payTips,icon:"none"
					})
					const defPay = ()=>{
						this.openAlipay(res.url);
					}
					if (window.NativeBridge) {
						try {
							window.NativeBridge.openWithBrowser(res.url);
						} catch (error) {
							defPay()
						}
						return;
					}
					defPay();
				} else {
					uni.showToast({
						title: res.errorMsg || '支付宝参数验证失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.error('支付宝参数验证失败:', err)
				uni.showToast({
					title: '支付宝参数验证失败，请重试',
					icon: 'none'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.recharge-page {
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
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 30rpx;
		
		.nav-link {
			font-size: 28rpx;
			color: #007aff;
		}
	}
}

.balance-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.balance-content {
		display: flex;
		align-items: center;
		
		.balance-label {
			font-size: 32rpx;
			color: #333;
		}
		
		.balance-amount {
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
		}
	}
}

.amount-card {
	margin: 20rpx 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	
	.card-title {
		margin-bottom: 30rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.amount-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		margin-bottom: 30rpx;
		
		.amount-item {
			height: 80rpx;
			border: 2rpx solid #e0e0e0;
			border-radius: 12rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			
			.amount-text {
				font-size: 28rpx;
				color: #333;
			}
			
			&.active {
				border-color: #007aff;
				background-color: #f0f8ff;
				
				.amount-text {
					color: #007aff;
					font-weight: bold;
				}
			}
		}
	}
	
	.custom-amount {
		.custom-input {
			display: flex;
			align-items: center;
			border: 2rpx solid #e0e0e0;
			border-radius: 12rpx;
			padding: 20rpx;
			background-color: #fff;
			
			.currency-symbol {
				font-size: 32rpx;
				color: #333;
				margin-right: 20rpx;
			}
			
			.amount-field {
				flex: 1;
				font-size: 32rpx;
				color: #333;
			}
		}
	}
}

.payment-card {
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
	
	.payment-warning {
		margin-bottom: 30rpx;
		
		.warning-text {
			font-size: 28rpx;
			color: #ff4757;
		}
	}
	
	.payment-list {
		margin-bottom: 30rpx;
		
		.payment-item {
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.payment-icon {
				margin-right: 30rpx;
				display: flex;
				align-items: center;
				
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
			
			.payment-info {
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
			
			.payment-status {
				.status-circle {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					border: 2rpx solid #007aff;
					background-color: transparent;
					
					&.active {
						background-color: #007aff;
					}
				}
			}
		}
	}
	
	.recharge-button {
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
}
</style> 