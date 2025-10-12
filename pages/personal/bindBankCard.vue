<template>
	<view class="bind-bankcard-page">
		<!-- 顶部导航 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="16" color="#333"></u-icon>
			</view>
			<view class="nav-center">
				<text class="nav-title">绑定提现银行卡</text>
			</view>
			<view class="nav-right">
				<!-- 右侧留空 -->
			</view>
		</view>

		<!-- 主要内容区域 -->
		<view class="content-area">
			<!-- 标题区域 -->
			<view class="title-section">
				<view class="title-bar"></view>
				<text class="title-text">绑定提现银行卡</text>
			</view>

			<!-- 表单输入区域 -->
			<view class="form-section">
				<!-- 姓名 -->
				<view class="input-row">
					<text class="input-label">姓名</text>
					<text class="input-value">{{ name }}</text>
				</view>

				<!-- 银行名称 -->
				<view class="input-row">
					<text class="input-label">银行名称</text>
					<input 
						class="input-field" 
						type="text"
						v-model="bankName"
						placeholder="输入您的银行名称"
						@input="onBankNameInput"
					/>
				</view>

				<!-- 银行卡账号 -->
				<view class="input-row">
					<text class="input-label">银行卡账号</text>
					<input 
						class="input-field" 
						type="number"
						v-model="bankNumber"
						placeholder="输入您的银行账号"
						@input="onBankAccountInput"
					/>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-section">
				<button 
					class="submit-btn" 
					:class="{ disabled: !canSubmit }"
					@click="submitBind"
					:disabled="!canSubmit"
				>
					提交
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import {
		binding,
		getUser
	} from '@/api/user.js'
export default {
	data() {
		return {
			name: '', // 预填充的用户姓名
			bankName: '',
			bankNumber: ''
		}
	},
	computed: {
		canSubmit() {
			return this.bankName.trim() !== '' && this.bankNumber.trim() !== ''
		}
	},
	onLoad() {
		// 获取用户信息
		this.getUserInfo();
	},
	onShow() {
		// 页面显示时重新检查用户信息（从实名认证页面返回时）
		this.getUserInfo();
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		// 获取用户信息
		getUserInfo() {
			getUser().then(res => {
				if (res.success) {
					// 检查用户是否有真实姓名
					if (res.name && res.name.trim() !== '') {
						// 显示用户真实姓名，可以选择性遮挡
						this.name = res.name;
						this.bankName = res.bankName;
						this.bankNumber = res.bankNumber;
					} else {
						// 没有实名信息，跳转到实名认证页面
						uni.showModal({
							title: '提示',
							content: '账号未实名，请先去实名',
							showCancel: true,
							cancelText: '取消',
							confirmText: '去实名',
							success: (modalRes) => {
								if (modalRes.confirm) {
									uni.navigateTo({
										url: '/pages/personal/real'
									});
								} else {
									// 用户取消，返回上一页
									uni.navigateBack();
								}
							}
						});
						return;
					}
				} else {
					// 获取用户信息失败，也跳转到实名认证
					uni.showModal({
						title: '提示',
						content: '账号未实名，请先去实名',
						showCancel: true,
						cancelText: '取消',
						confirmText: '去实名',
						success: (modalRes) => {
							if (modalRes.confirm) {
								uni.navigateTo({
									url: '/pages/personal/real'
								});
							} else {
								uni.navigateBack();
							}
						}
					});
				}
			}).catch(err => {
				console.error('获取用户信息失败:', err);
				// 网络错误等情况，也提示去实名认证
				uni.showModal({
					title: '提示',
					content: '账号未实名，请先去实名',
					showCancel: true,
					cancelText: '取消',
					confirmText: '去实名',
					success: (modalRes) => {
						if (modalRes.confirm) {
							uni.navigateTo({
								url: '/pages/personal/real'
							});
						} else {
							uni.navigateBack();
						}
					}
				});
			});
		},
		onBankNameInput(e) {
			this.bankName = e.detail.value
		},
		onBankAccountInput(e) {
			this.bankNumber = e.detail.value
		},
		submitBind() {
			if (!this.canSubmit) return
			
			uni.showLoading({
				title: '绑定中...'
			})
			
			// 调用binding接口
			const params = {
				bankName: this.bankName,
				bankNumber: this.bankNumber
			};
			
			binding(params).then(res => {
				uni.hideLoading()
				if (res.success) {
					uni.showToast({
						title: '绑定成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} else {
					uni.showToast({
						title: res.errorMsg || '绑定失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.error('绑定银行卡失败:', err);
				uni.showToast({
					title: '绑定失败，请重试',
					icon: 'none'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.bind-bankcard-page {
	min-height: 100vh;
	background-color: #f5f5f5;
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
	}
}

.content-area {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
	
	.title-section {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
		
		.title-bar {
			width: 8rpx;
			height: 32rpx;
			background-color: #007aff;
			border-radius: 4rpx;
			margin-right: 20rpx;
		}
		
		.title-text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.form-section {
		margin-bottom: 60rpx;
		
		.input-row {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			
			.input-label {
				width: 200rpx;
				font-size: 28rpx;
				color: #333;
			}
			
			.input-value {
				flex: 1;
				font-size: 28rpx;
				color: #333;
			}
			
			.input-field {
				flex: 1;
				font-size: 28rpx;
				color: #333;
				
				&::placeholder {
					color: #999;
				}
			}
		}
	}
	
	.submit-section {
		.submit-btn {
			width: 100%;
			height: 88rpx;
			background-color: #007aff;
			border-radius: 12rpx;
			border: none;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			
			&.disabled {
				background-color: #ccc;
				color: #999;
			}
		}
	}
}
</style> 