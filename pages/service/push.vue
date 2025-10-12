<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'声音推送'" :back="true"></nav-bar>
		
		<!-- 设置区域 -->
		<view class="section settings-section">
			<view class="setting-item">
				<view class="setting-label">首页订单提醒</view>
				<u-switch
					v-model="settings.orderNotify"
					@change="changeSetting('orderNotify')"
				></u-switch>
			</view>
		</view>
		
		<view class="divider"></view>
		
		<!-- 声音设置 -->
		<view class="section">
			<view class="setting-item with-arrow" @tap="goToSoundSelect">
				<view class="setting-label">首页订单提醒</view>
				<view class="setting-value">
					<text>选择提示音</text>
					<u-icon name="arrow-right" color="#999" size="28"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="divider"></view>
		
		<!-- 微信推送设置 -->
		<view class="section">
			<view class="setting-item with-arrow" @tap="goToWechatBind">
				<view class="setting-label">微信推送提醒</view>
				<view class="setting-value">
					<text>绑定微信公众号</text>
					<u-icon name="arrow-right" color="#999" size="28"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/nav-bar/nav-bar.vue'
	
	export default {
		components: {
			navBar
		},
		data() {
			return {
				settings: {
					orderNotify: true
				}
			}
		},
		
		onLoad() {
			this.loadSettings();
		},
		
		methods: {
			// 加载推送设置
			loadSettings() {
				// 这里应该调用API获取推送设置
				// 模拟API请求
				setTimeout(() => {
					// 从API获取的设置会在这里设置
				}, 500);
			},
			
			// 更改设置
			changeSetting(type) {
				uni.showLoading({
					title: '保存中...'
				});
				
				// 这里应该调用API保存设置
				// 模拟API请求
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '设置已保存',
						icon: 'success'
					});
				}, 500);
			},
			
			// 前往选择提示音页面
			goToSoundSelect() {
				uni.navigateTo({
					url: '/pages/service/sound-select'
				});
			},
			
			// 前往绑定微信公众号页面
			goToWechatBind() {
				uni.navigateTo({
					url: '/pages/service/wechat-bind'
				});
			}
		}
	}
</script>

<style>
.section {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 0 30rpx;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
	border-bottom: none;
}

.setting-label {
	font-size: 28rpx;
	color: #333;
}

.setting-item.with-arrow {
	padding: 30rpx 0;
}

.setting-value {
	display: flex;
	align-items: center;
}

.setting-value text {
	font-size: 28rpx;
	color: #999;
	margin-right: 10rpx;
}

.divider {
	height: 1px;
	background-color: #eee;
	margin: 0 30rpx;
}
</style> 