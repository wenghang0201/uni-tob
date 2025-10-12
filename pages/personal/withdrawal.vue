<template>
	<view class="withdrawal-page">
		<!-- 顶部导航 -->
		<view class="nav-header">
					<view class="nav-left" @click="goBack">
			<u-icon name="arrow-left" size="16" color="#333"></u-icon>
		</view>
			<view class="nav-center">
				<text class="nav-title">提现</text>
			</view>
			<view class="nav-right" @click="goToWithdrawalRecords">
				<text class="nav-link">提现记录</text>
			</view>
		</view>

		<!-- 提现方式选择 -->
		<view class="withdrawal-methods">
			<view 
				class="method-item" 
				:class="{ active: selectedMethod === 'alipay' }"
				@click="selectMethod('alipay')"
			>
				<text class="method-text">提现到支付宝</text>
			</view>
			<view 
				class="method-item" 
				:class="{ active: selectedMethod === 'bank' }"
				@click="selectMethod('bank')"
			>
				<text class="method-text">提现到银行卡</text>
			</view>
		</view>

		<!-- 添加账户或显示已绑定账户 -->
		<view class="account-section">
			<!-- 支付宝账户 -->
			<view v-if="selectedMethod === 'alipay' && userInfo.zfbNumber" class="account-info">
				<view class="account-left">
					<view class="account-icon alipay">
						<image src="/static/pay/alipay.png" mode="aspectFit" class="icon-image"></image>
					</view>
					<view class="account-details">
						<text class="account-name">{{ userInfo.name || '未设置姓名' }}</text>
						<text class="account-number">支付宝账号:{{ userInfo.zfbNumber }}</text>
					</view>
				</view>
				<view class="account-right">
					<button class="modify-btn" @click="modifyAccount">修改绑定</button>
				</view>
			</view>
			
			<!-- 银行卡账户 -->
			<view v-else-if="selectedMethod === 'bank' && userInfo.bankNumber && userInfo.bankName" class="account-info">
				<view class="account-left">
					<view class="account-icon bank">
						<image src="/static/pay/bank.png" mode="aspectFit" class="icon-image"></image>
					</view>
					<view class="account-details">
						<text class="account-name">{{ userInfo.name || '未设置姓名' }}</text>
						<text class="account-bank">银行卡:{{ userInfo.bankName }}</text>
						<text class="account-number">银行卡号:{{ userInfo.bankNumber }}</text>
					</view>
				</view>
				<view class="account-right">
					<button class="modify-btn" @click="modifyAccount">修改绑定</button>
				</view>
			</view>
			
			<!-- 添加账户按钮 -->
			<view v-else class="add-account" @click="addAccount">
				<view class="account-left">
					<view class="account-icon">
						<u-icon name="plus" size="20" color="#fff"></u-icon>
					</view>
					<text class="account-text">{{ selectedMethod === 'alipay' ? '绑定提现支付宝' : '绑定提现银行卡' }}</text>
				</view>
				<view class="account-right">
					<u-icon name="arrow-right" size="14" color="#999"></u-icon>
				</view>
			</view>
		</view>

		<!-- 提现金额 -->
		<view class="withdrawal-amount">
			<view class="amount-header">
				<text class="amount-title">提现金额</text>
			</view>
			<view class="amount-input">
				<text class="currency-symbol">¥</text>
				<input 
					class="amount-field" 
					type="number" 
					v-model="withdrawalAmount"
					placeholder="请输入提现金额"
					@input="onAmountInput"
				/>
			</view>
			<view class="available-amount">
				<text class="available-text">可提现金额{{ availableAmount }}元</text>
			</view>
			<view class="daily-limit">
				<u-icon name="info-circle" size="12" color="#ff4757"></u-icon>
				<text class="limit-text">每日最高可提现{{ selectedMethod === 'alipay' ? '3次' : '1次' }}</text>
			</view>
		</view>

		<!-- 提现按钮 -->
		<view class="withdrawal-button">
			<button 
				class="submit-btn" 
				:class="{ disabled: !canSubmit }"
				@click="submitWithdrawal"
				:disabled="!canSubmit"
			>
				提现
			</button>
		</view>

		<!-- 说明文字 -->
		<view class="instructions">
			<text class="instruction-text" v-if="selectedMethod === 'alipay'">如支付宝提现异常，可选择银行卡提现</text>
			<text class="instruction-text" v-if="selectedMethod === 'bank'">1. 银行卡提现为手动打款，请您耐心等待</text>
			<text class="instruction-text" v-if="selectedMethod === 'bank'">2. 为了优化提现转账速度，每天最高可提现1次</text>
			<text class="instruction-text" v-if="selectedMethod === 'bank'">3. 如有提现问题，请联系客服处理</text>
			<text class="instruction-text" v-if="selectedMethod === 'alipay'">如有提现问题，请联系客服处理</text>
		</view>
	</view>
</template>

<script>
import {
	getCurrentStoreInfo,
	withdrawApply
} from "@/api/shop.js"
import {
	getUser
} from '@/api/user.js'
export default {
	data() {
		return {
			selectedMethod: 'alipay', // alipay 或 bank，默认选择银行卡
			withdrawalAmount: '',
			availableAmount: '0.00',
			userInfo: {
				name: '',
				zfbNumber: '',
				bankName: '',
				bankNumber: ''
			}
		}
	},
	computed: {
		canSubmit() {
			// 检查是否有对应的账户信息
			const hasAccount = this.selectedMethod === 'alipay' 
				? this.userInfo.zfbNumber 
				: (this.userInfo.bankNumber && this.userInfo.bankName);
			
			return this.withdrawalAmount && 
				   parseFloat(this.withdrawalAmount) > 0 && 
				   parseFloat(this.withdrawalAmount) <= parseFloat(this.availableAmount) &&
				   hasAccount;
		}
	},
	onLoad() {
		this.getBalanceInfo();
		this.getUserInfo();
	},
	onShow() {
		// 每次显示页面时刷新余额和用户信息
		this.getBalanceInfo();
		this.getUserInfo();
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		// 获取余额信息
		getBalanceInfo() {
			getCurrentStoreInfo().then(res => {
				// 更新可提现金额
				this.availableAmount = res.gold || 0;
				console.log('获取店铺余额成功:', res.gold);
			}).catch(err => {
				console.error('获取店铺余额失败:', err);
				this.availableAmount = '0.00';
			});
		},
		// 获取用户信息
		getUserInfo() {
			getUser().then(res => {
				if (res.success) {
					this.userInfo = {
						name: res.name,
						zfbNumber: res.zfbNumber || '',
						bankName: res.bankName || '',
						bankNumber: res.bankNumber || ''
					};
					console.log('获取用户信息成功:', this.userInfo);
				}
			}).catch(err => {
				console.error('获取用户信息失败:', err);
			});
		},
		goToWithdrawalRecords() {
			uni.navigateTo({
				url: '/pages/personal/transactionRecords?type=withdraw'
			})
		},
		selectMethod(method) {
			this.selectedMethod = method
		},
		addAccount() {
			if (this.selectedMethod === 'alipay') {
				uni.navigateTo({
					url: '/pages/personal/bindAlipay'
				})
			} else if (this.selectedMethod === 'bank') {
				uni.navigateTo({
					url: '/pages/personal/bindBankCard'
				})
			}
		},
		modifyAccount() {
			if (this.selectedMethod === 'alipay') {
				uni.navigateTo({
					url: '/pages/personal/bindAlipay'
				})
			} else if (this.selectedMethod === 'bank') {
				uni.navigateTo({
					url: '/pages/personal/bindBankCard'
				})
			}
		},
		onAmountInput(e) {
			this.withdrawalAmount = e.detail.value
		},
		submitWithdrawal() {
			if (!this.canSubmit) return
			
			uni.showLoading({
				title: '提交中...'
			})
			
			// 准备接口参数
			const params = {
				amount: parseFloat(this.withdrawalAmount),
				paymentType: this.selectedMethod === 'alipay' ? 0 : 4  // 0:支付宝, 4:银行卡
			};
			
			// 调用提现接口
			withdrawApply(params).then(res => {
				uni.hideLoading()
				if (res.success) {
					// 先返回上一页，然后在上一页显示成功提示
					uni.navigateBack({
						success: () => {
							// 延迟显示提示，确保页面跳转完成
							setTimeout(() => {
								uni.showToast({
									title: '提现申请提交成功',
									icon: 'success',
									duration: 2000
								})
							}, 200)
						}
					})
				} else {
					uni.showToast({
						title: res.errorMsg || '提现申请失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.error('提现申请失败:', err);
				uni.showToast({
					title: '提现申请失败，请重试',
					icon: 'none'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.withdrawal-page {
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 40rpx;
}

.nav-header {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	
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

.withdrawal-methods {
	display: flex;
	padding: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
	
	.method-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		position: relative;
		
		.method-text {
			font-size: 28rpx;
			color: #999;
		}
		
		&.active {
			.method-text {
				color: #007aff;
				font-weight: bold;
			}
			
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 4rpx;
				background-color: #007aff;
				border-radius: 2rpx;
			}
		}
	}
}

.account-section {
	border-bottom: 1rpx solid #f5f5f5;
}

.account-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	
	.account-left {
		display: flex;
		align-items: center;
		flex: 1;
		
		.account-icon {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;
			
			.icon-image {
				width: 80rpx;
				height: 80rpx;
			}
		}
		
		.account-details {
			display: flex;
			flex-direction: column;
			flex: 1;
			
			.account-name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 8rpx;
			}
			
			.account-bank {
				font-size: 26rpx;
				color: #666;
				margin-bottom: 4rpx;
			}
			
			.account-number {
				font-size: 28rpx;
				color: #999;
			}
		}
	}
	
	.account-right {
		.modify-btn {
			padding: 12rpx 24rpx;
			background-color: #007aff;
			color: #fff;
			border: none;
			border-radius: 8rpx;
			font-size: 24rpx;
			line-height: 1;
		}
	}
}

.add-account {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	
	.account-left {
		display: flex;
		align-items: center;
		
		.account-icon {
			width: 80rpx;
			height: 80rpx;
			background: linear-gradient(135deg, #007aff, #5ac8fa);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 20rpx;
		}
		
		.account-text {
			font-size: 32rpx;
			color: #333;
		}
	}
	
	.account-right {
		display: flex;
		align-items: center;
	}
}

.withdrawal-amount {
	padding: 30rpx;
	
	.amount-header {
		margin-bottom: 20rpx;
		
		.amount-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.amount-input {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f5f5f5;
		
		.currency-symbol {
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
			margin-right: 20rpx;
		}
		
		.amount-field {
			flex: 1;
			font-size: 48rpx;
			color: #333;
		}
	}
	
	.available-amount {
		margin: 20rpx 0;
		
		.available-text {
			font-size: 24rpx;
			color: #999;
		}
	}
	
	.daily-limit {
		display: flex;
		align-items: center;
		
		.limit-text {
			font-size: 24rpx;
			color: #ff4757;
			margin-left: 10rpx;
		}
	}
}

.withdrawal-button {
	padding: 60rpx 30rpx 40rpx;
	
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
			background: #ccc;
			color: #999;
		}
	}
}

.instructions {
	padding: 0 30rpx;
	
	.instruction-text {
		display: block;
		font-size: 24rpx;
		color: #999;
		line-height: 1.6;
		text-align: center;
	}
}
</style> 