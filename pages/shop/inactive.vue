<template>
	<view class="inactive-container">
		<nav-bar :title="'店铺状态'" :back="false"></nav-bar> <!-- No back button -->
		<view class="content">
			<text class="message-title">店铺审核中</text>
			<text class="message-text">您的店铺信息已提交，正在等待管理员审核上架。</text>
			<text class="message-text">请耐心等待或联系管理员咨询进度。</text>
			<!-- Optional: Add contact info or button if needed -->
			<!-- <button class="contact-admin-btn">联系管理员</button> -->
		</view>
	</view>
</template>

<script>
// import { getCurrentStoreInfo } from '@/api/shop.js' // 导入获取店铺信息的API
import { getUser } from '@/api/user.js' // 导入获取用户信息的API

export default {
	data() {
		return {

		};
	},
	onPullDownRefresh() {
		console.log('触发下拉刷新');
		this.checkShopStatus();
	},
	onShow() {
		this.checkShopStatus();
	},
	methods: {
		// 检查店铺状态 (通过获取用户信息)
		checkShopStatus() {
			// 调用获取用户信息API
			getUser().then(res => {
				// 检查是否成功且没有错误码，或者错误码不是E085
				if (res.success && (!res.errorCode || res.errorCode !== 'E085')) {
					console.log('用户信息获取成功或状态已改变，跳转到首页');
					uni.showToast({
						title: '店铺状态已更新',
						icon: 'success',
						duration: 1500
					});
					// 延迟跳转，让用户看到提示
					setTimeout(() => {
						// 跳转到首页 (假设首页是/pages/tabs/home)
						uni.reLaunch({
							url: '/pages/personal/personal'
						});
					}, 1500);
				} else {
					// 其他非E085的失败情况（理论上应该由拦截器处理，但保留以防万一）
					console.log('获取用户信息时遇到非E085错误', res);
					uni.showToast({
						title: res.errorMsg || '刷新失败',
						icon: 'none'
					});
					uni.stopPullDownRefresh(); // 停止下拉刷新动画
				}
			}).catch(err => {
				// 检查是否是由E085错误码reject的
				if (err === 'E085') {
					console.log('店铺仍未上架 (E085) - catch处理');
					uni.showToast({
						title: '店铺仍在审核中',
						icon: 'none'
					});
				} else {
					// 网络错误或其他异常
					console.error('检查用户状态异常:', err);
					uni.showToast({
						title: '刷新失败，请稍后重试',
						icon: 'none'
					});
				}
				uni.stopPullDownRefresh(); // 停止下拉刷新动画
			});
		}
		// If a contact button is added, implement its method here
		// contactAdmin() {
		// 	// Logic to contact admin
		// }
	}
}
</script>

<style lang="scss" scoped>
.inactive-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 40rpx;
	text-align: center;
}

.status-icon {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 40rpx;
}

.message-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.message-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 15rpx;
}

.contact-admin-btn {
	margin-top: 50rpx;
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
</style>