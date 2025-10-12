<template>
	<view class="box">
		<nav-bar :title="'设置中心'" :back="true"></nav-bar>

		<!-- uview 弹出框组件 -->
		<u-modal :show="showLogoutModal" :show-cancel-button="true"
			title="退出登录" content="确定要退出当前账号吗？"
			confirm-color="#007AFF" cancel-color="#999999"
			@confirm="confirmLogout" @cancel="showLogoutModal = false"></u-modal>

		<!-- 应用信息 -->
		<view class="app-info">
			<view class="app-name">彩店宝助手</view>
			<view class="app-version">当前版本：{{ VERSION }}</view>
		</view>

		<!-- 设置列表 -->
		<view class="settings-list">
			<!-- 开关项 -->
			<!-- <view class="settings-item">
				<view class="item-left">
					<u-icon name="account" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">新用户注册</text>
				</view>
				<view class="item-right">
					<u-switch v-model="settings.newUserRegister" active-color="#2979ff" size="28" @change="(value) => onSwitchChange('newUserRegister', value)"></u-switch>
				</view>
			</view> -->
			
			<!-- <view class="settings-item">
				<view class="item-left">
					<u-icon name="bell" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">首页播报海报开关</text>
				</view>
				<view class="item-right">
					<u-switch v-model="settings.homePoster" active-color="#2979ff" size="28" @change="(value) => onSwitchChange('homePoster', value)"></u-switch>
				</view>
			</view> -->
			
			<!-- 点击项 -->
			<!-- <view class="settings-item" @click="navTo('/pages/station/index')">
				<view class="item-left">
					<u-icon name="setting" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">通用</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view> -->
			
			<view class="settings-item" @click="checkUpdate">
				<view class="item-left">
					<u-icon name="reload" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">版本更新</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view>
			
			<view class="settings-item" @click="clearCache">
				<view class="item-left">
					<u-icon name="trash" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">清除缓存</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view>
			
			<view class="settings-item" @click="navTo('/pages/help/center')">
				<view class="item-left">
					<u-icon name="question-circle" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">帮助中心</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view>
			
			<view class="settings-item" @click="navTo('/pages/about/us')">
				<view class="item-left">
					<u-icon name="info-circle" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">关于我们</text>
				</view>
				<view class="item-right">
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view>
			<view class="settings-item">
				<view class="item-left">
					<u-icon name="bell" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">订单声音通知</text>
				</view>
				<view class="item-right">
					<u-switch v-model="orderSoundEnabled" @change="toggleOrderSound"></u-switch>
				</view>
			</view>
			<!-- 带值显示项 -->
			<!-- <view class="settings-item" @click="setWithdrawTimes">
				<view class="item-left">
					<u-icon name="calendar" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">每日提款次数</text>
				</view>
				<view class="item-right">
					<text class="item-value">{{withdrawTimes}}次</text>
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view>
			
			<view class="settings-item" @click="setMinWithdraw">
				<view class="item-left">
					<u-icon name="rmb-circle" color="#333" size="22" class="item-icon"></u-icon>
					<text class="item-label">最低提现金额</text>
				</view>
				<view class="item-right">
					<text class="item-value">{{minWithdraw}}元</text>
					<u-icon name="arrow-right" color="#999" size="26"></u-icon>
				</view>
			</view> -->
		</view>
		
		<!-- 退出按钮 -->
		<view class="logout-button">
			<button class="logout-btn" @click="logout">退出当前账号</button>
		</view>
		
		<!-- 每日提款次数弹窗 -->
		<view class="custom-popup" v-if="showWithdrawTimesPopup">
			<view class="custom-popup-mask" @click="showWithdrawTimesPopup = false"></view>
			<view class="custom-popup-content">
				<view class="popup-container">
					<view class="popup-close" @click="showWithdrawTimesPopup = false">
						<u-icon name="close" color="#999" size="24"></u-icon>
					</view>
					<view class="popup-title">每日提款次数</view>
					<view class="popup-input-wrap">
						<input class="popup-input" type="number" v-model="inputWithdrawTimes" />
						<text class="popup-unit">次</text>
						<view class="popup-clear" @click="inputWithdrawTimes = ''">
							<u-icon name="close-circle-fill" color="#C8C9CC" size="18"></u-icon>
						</view>
					</view>
					<view class="popup-button" @click="confirmWithdrawTimes">确定</view>
				</view>
			</view>
		</view>
		
		<!-- 最低提现金额弹窗 -->
		<view class="custom-popup" v-if="showMinWithdrawPopup">
			<view class="custom-popup-mask" @click="showMinWithdrawPopup = false"></view>
			<view class="custom-popup-content">
				<view class="popup-container">
					<view class="popup-close" @click="showMinWithdrawPopup = false">
						<u-icon name="close" color="#999" size="24"></u-icon>
					</view>
					<view class="popup-title">最低提现金额</view>
					<view class="popup-input-wrap">
						<input class="popup-input" type="number" v-model="inputMinWithdraw" />
						<text class="popup-unit">元</text>
						<view class="popup-clear" @click="inputMinWithdraw = ''">
							<u-icon name="close-circle-fill" color="#C8C9CC" size="18"></u-icon>
						</view>
					</view>
					<view class="popup-button" @click="confirmMinWithdraw">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getCurrentStoreInfo, updateStoreSetting } from '@/api/shop.js'
	import { logout } from '@/api/user.js'
	import { removeAuthtoken, removeUserInfo, removeExternalLogintoken } from '@/util/auth.js'
	import cfg from '@/util/environment.js';
	import sseService from '@/util/SSEService.js';
	export default {
		data() {
			return {
				settings: {
					newUserRegister: false,
					homePoster: false
				},
				withdrawTimes: 1,
				minWithdraw: 20,
				showWithdrawTimesPopup: false,
				inputWithdrawTimes: '1',
				showMinWithdrawPopup: false,
				inputMinWithdraw: '20',
				VERSION: cfg.VERSION,
				showLogoutModal: false, // 控制退出登录弹窗的显示
				orderSoundEnabled: true // 订单声音通知开关
			}
		},
		mounted() {
			// 获取店铺信息
			this.getStoreInfo();
			
			// 从本地存储读取声音设置
			const savedSoundEnabled = uni.getStorageSync('orderSoundEnabled');
			if (savedSoundEnabled !== '') {
				this.orderSoundEnabled = savedSoundEnabled;
			}
		},
		methods: {
			// 获取店铺信息
			getStoreInfo() {
				getCurrentStoreInfo().then(res => {
					console.log('店铺信息返回:', res);
					
					if (res.success) {
						// 更新开关状态
						this.settings = {
							newUserRegister: res.newUserRegisterSwitch === 1,
							homePoster: res.homeBroadcastSwitch === 1
						};
						// 更新提款设置
						this.withdrawTimes = res.dailyWithdrawalLimit || 1;
						this.minWithdraw = res.maxReminderAmount || 20;
					} else {
						uni.showToast({
							title: res.errorMsg || '获取店铺信息失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('获取店铺信息失败:', err);
				});
			},
			
			// 更新店铺设置
			updateStoreSettings() {
				const params = {
					newUserRegisterSwitch: this.settings.newUserRegister ? 1 : 0,
					homeBroadcastSwitch: this.settings.homePoster ? 1 : 0,
					dailyWithdrawalLimit: this.withdrawTimes,
					maxReminderAmount: this.minWithdraw
				};
				
				updateStoreSetting(params).then(res => {
					console.log('更新店铺设置返回:', res);
					
					if (res.success) {
						uni.showToast({
							title: '设置已更新',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.errorMsg || '更新设置失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					console.error('更新店铺设置失败:', err);
				});
			},
			
			// 监听开关变化
			onSwitchChange(type, value) {
				this.settings[type] = value;
				this.updateStoreSettings();
			},
			
			navTo(url) {
				uni.navigateTo({
					url: url,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			checkUpdate() {
				uni.showLoading({
					title: '检查更新中...'
				});
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '已是最新版本',
						icon: 'none'
					});
				}, 800);
			},
			clearCache() {
				uni.showModal({
					title: '提示',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '清除中...'
							});
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: '清除成功',
									icon: 'success'
								});
							}, 800);
						}
					}
				});
			},
			setWithdrawTimes() {
				console.log('点击了每日提款次数');
				this.inputWithdrawTimes = String(this.withdrawTimes);
				this.showWithdrawTimesPopup = true;
			},
			setMinWithdraw() {
				console.log('点击了最低提现金额');
				this.inputMinWithdraw = String(this.minWithdraw);
				this.showMinWithdrawPopup = true;
			},
			// 显示退出登录弹窗
			logout() {
				this.showLogoutModal = true;
			},

			// 确认退出登录
			confirmLogout() {
				// 用户点击确定，执行退出操作
				uni.showLoading({
					title: '退出中...'
				});
				logout().then(res => {
					if (res.success) {
						removeAuthtoken();
						removeExternalLogintoken();
						removeUserInfo();
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/user/login"
							});
							uni.hideLoading();
						}, 100)
						sseService.disconnect();
					}
				}).catch(err => {
					console.error('退出登录失败:', err);
					uni.hideLoading();
					uni.showToast({
						title: '退出失败，请重试',
						icon: 'none'
					});
				})
			},
			confirmWithdrawTimes() {
				const times = parseInt(this.inputWithdrawTimes);
				if (isNaN(times) || times < 1) {
					uni.showToast({
						title: '请输入有效数字',
						icon: 'none'
					});
					return;
				}
				
				this.withdrawTimes = times;
				this.showWithdrawTimesPopup = false;
				
				// 更新店铺设置
				this.updateStoreSettings();
			},
			confirmMinWithdraw() {
				const amount = parseInt(this.inputMinWithdraw);
				if (isNaN(amount) || amount < 1) {
					uni.showToast({
						title: '请输入有效金额',
						icon: 'none'
					});
					return;
				}
				
				this.minWithdraw = amount;
				this.showMinWithdrawPopup = false;
				
				// 更新店铺设置
				this.updateStoreSettings();
			},
			
			// 切换订单声音通知
			toggleOrderSound(value) {
				console.log('订单声音通知开关:', value);
				this.orderSoundEnabled = value;
				
				// 保存到本地存储
				uni.setStorageSync('orderSoundEnabled', value);
				
				// 显示提示
				uni.showToast({
					title: value ? '已开启声音通知' : '已关闭声音通知',
					icon: 'success'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.box {
	padding-bottom: 50rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.app-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 0;
	
	.app-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.app-version {
		font-size: 28rpx;
		color: #999;
	}
}

.settings-list {
	background-color: #fff;
}

.settings-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 30rpx;
	border-bottom: 1px solid #f5f5f5;
	
	&:last-child {
		border-bottom: none;
	}
	
	.item-left {
		display: flex;
		align-items: center;
		
		.item-icon {
			margin-right: 20rpx;
		}
		
		.item-label {
			font-size: 28rpx;
			color: #333;
		}
	}
	
	.item-right {
		display: flex;
		align-items: center;
		
		.item-value {
			font-size: 28rpx;
			color: #999;
			margin-right: 16rpx;
		}
	}
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

.popup-container {
	padding: 30rpx;
	position: relative;
	background-color: #fff;
	width: 600rpx;
	border-radius: 8rpx;
}

.popup-close {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	text-align: center;
}

.popup-input-wrap {
	display: flex;
	align-items: center;
	position: relative;
	margin-bottom: 30rpx;
	border: 1px solid #e5e5e5;
	border-radius: 8rpx;
	padding: 0 20rpx;
}

.popup-input {
	flex: 1;
	height: 90rpx;
	font-size: 32rpx;
	padding-right: 80rpx;
}

.popup-unit {
	position: absolute;
	right: 60rpx;
	font-size: 32rpx;
	color: #333;
}

.popup-clear {
	position: absolute;
	right: 20rpx;
}

.popup-button {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	color: #fff;
	font-size: 32rpx;
	background-color: #2979ff;
	border-radius: 0;
}

.custom-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}

.custom-popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
}

.custom-popup-content {
	position: relative;
	z-index: 10000;
}
</style> 