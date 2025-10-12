<template>
	<view class="real-name-page">
		<!-- 顶部导航 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="16" color="#333"></u-icon>
			</view>
			<view class="nav-center">
				<text class="nav-title">实名认证</text>
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
				<text class="title-text">实名认证</text>
			</view>

			<!-- 提示信息 -->
			<view class="tip-section">
				<text class="tip-text">*为了您的资金安全，请提交以下信息进行身份核实</text>
			</view>

			<!-- 表单输入区域 -->
			<view class="form-section">
				<!-- 姓名 -->
				<view class="input-row">
					<text class="input-label">姓名</text>
					<input 
						class="input-field" 
						type="text"
						v-model="user.name"
						:disabled="user.isReal=='1'"
						placeholder="请输入姓名"
					/>
				</view>

				<!-- 身份证号码 -->
				<view class="input-row">
					<text class="input-label">身份证号码</text>
					<input 
						class="input-field" 
						type="text"
						v-model="user.idCard"
						:disabled="user.isReal=='1'"
						placeholder="请填写身份证号码"
					/>
				</view>
			</view>

			<!-- 温馨提醒 -->
			<view v-show="user.isReal=='0'" class="warning-section">
				<text class="warning-text">温馨提醒，请使用真实姓名和身份证，不然将会影响提现</text>
			</view>

			<!-- 提交按钮 -->
			<view v-show="user.isReal=='0'" class="submit-section">
				<button 
					class="submit-btn" 
					:class="{ disabled: !canSubmit }"
					@click="btSubmit"
					:disabled="!canSubmit"
				>
					确认
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserInfo,
		setUserInfo
	} from "@/util/auth.js"
	import {
		real,
		getUser
	} from '@/api/user.js'
	export default {
		data() {
			return {
				user: {
					name: "",
					idCard: "",
					isReal: ""
				},
			}
		},
		computed: {
			canSubmit() {
				return (this.user.name || '').trim() !== '' && (this.user.idCard || '').trim() !== ''
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			async init() {
				let user = await getUserInfo();
				this.user = user;
			},
			btSubmit() {
				if (!this.canSubmit) return;
				
				if (!this.user.name || this.user.name.trim() === '') {
					uni.showToast({
						title: '姓名不能为空',
						icon: 'none'
					});
					return;
				} else {
					var reg = /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/;
					if (!reg.test(this.user.name)) {
						uni.showToast({
							title: '姓名有误',
							icon: 'none'
						});
						return;
					}
				}

				if (!this.user.idCard || this.user.idCard.trim() === '') {
					uni.showToast({
						title: '身份证号不能为空',
						icon: 'none'
					});
					return;
				} else {
					if (!this.globalUtil.checkIdCard(this.user.idCard)) {
						uni.showToast({
							title: '身份证号不正确',
							icon: 'none'
						});
						return;
					}
				}
				real(this.user).then(res => {
					if (res.success) {
						uni.showToast({
							title: '实名认证成功',
							icon: 'success'
						});
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.real-name-page {
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
	
	.tip-section {
		margin-bottom: 40rpx;
		
		.tip-text {
			font-size: 26rpx;
			color: #666;
			line-height: 1.5;
		}
	}
	
	.form-section {
		margin-bottom: 40rpx;
		
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
			
			.input-field {
				flex: 1;
				font-size: 28rpx;
				color: #333;
				
				&::placeholder {
					color: #999;
				}
				
				&:disabled {
					background-color: #f5f5f5;
					color: #999;
				}
			}
		}
	}
	
	.warning-section {
		margin-bottom: 40rpx;
		
		.warning-text {
			font-size: 24rpx;
			color: #FF3F43;
			text-align: center;
			line-height: 1.5;
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
