<template>
	<view class="box">
		<!-- Background Image (same as register page) -->
		<image class="background-image" src="/static/dianzhu_bg 1.png" mode="widthFix"></image>

		<view class="register-box">
			<!-- **修改**: 移除文字提示，替换为笑脸图片 -->
			<image class="smile-image" src="/static/smile.png" mode="aspectFit"></image>

			<!-- Download Button -->
			<button :disabled="btnDisabled" class="nx-btn" :class="{ 'btn-disabled': btnDisabled }"
				@tap="downloadAppFunction">下载彩店宝</button>

			<!-- **新增**: 技术支持文字 -->
			<view class="tech-support-text">彩店宝提供技术支持></view>
		</view>
	</view>
</template>

<script>
// **修改**: 从 shop.js 导入 domainQuery 函数，而不是 domain.js
import { domainQuery } from '@/api/shop.js';

export default {
	data() {
		return {
			btnDisabled: false, // To prevent multiple download clicks
			// **新增**: 存储下载链接配置
			downloadUrls: {
				ios: '',
				android: ''
			},
			isLoading: true // 配置是否加载中
		};
	},
	// **新增**: 组件挂载时获取下载配置
	async mounted() {
		await this.loadDownloadConfig();
	},
	methods: {
		// **新增**: 加载下载配置的方法
		async loadDownloadConfig() {
			try {
				this.isLoading = true;
				const res = await domainQuery();
				// 查找 type 为 2 的配置项
				const downloadConfig = res.voList.find(item => item.type === 2);

				if (downloadConfig) {
					console.log('下载域名配置:', downloadConfig);
					// 设置下载链接，拼接路径
					this.downloadUrls.ios = downloadConfig.iosDownloadUrl || '';
					this.downloadUrls.android = downloadConfig.downloadUrl || '';
					console.log('下载链接已设置:', this.downloadUrls);
				} else {
					console.error('未找到 type 为 2 的配置项');
				}
			} catch (error) {
				console.error('获取下载配置出错:', error);
			} finally {
				this.isLoading = false;
			}
		},

		// Function to handle app download
		async downloadAppFunction() {
			// 如果配置还在加载中，提示用户等待
			if (this.isLoading) {
				uni.showToast({
					title: '配置加载中，请稍候...',
					icon: 'none'
				});
				return;
			}

			this.btnDisabled = true;
			uni.showLoading({
				title: '准备启动...'
			});

			// --- Actual Download Logic ---
			try {
				// #ifdef APP-PLUS
				// App 环境逻辑
				const systemInfoApp = uni.getSystemInfoSync();
				const platformApp = systemInfoApp.platform;
				console.log('APP Platform:', platformApp);

				if (platformApp === 'ios') {
					console.log('Opening iOS download URL via plus...');
					if (this.downloadUrls.ios === '') {
						uni.showToast({
							title: '下载链接获取失败，请稍后再试',
							icon: 'none'
						});
						return;
					} else {
						// **修改**: 使用从配置中获取的 iOS URL
						plus.runtime.openURL(this.downloadUrls.ios, (res) => {
							console.error("Failed to open URL (APP): " + res.message);
							this.showToastError('打开链接失败');
							uni.hideLoading();
							this.btnDisabled = false;
						});
					}
					setTimeout(() => { uni.hideLoading(); this.btnDisabled = false; }, 3000);
				} else if (platformApp === 'android') {
					console.log('Opening Android download URL via plus...');
					if (this.downloadUrls.android === '') {
						uni.showToast({
							title: '下载链接获取失败，请稍后再试',
							icon: 'none'
						});
					} else {
						// **修改**: 使用从配置中获取的 Android URL
						plus.runtime.openURL(this.downloadUrls.android, (res) => {
							console.error("Failed to open URL (APP): " + res.message);
							this.showToastError('打开链接失败');
							uni.hideLoading();
							this.btnDisabled = false;
						});
					}
					setTimeout(() => { uni.hideLoading(); this.btnDisabled = false; }, 3000);
				} else {
					console.log('Platform not iOS/Android App, showing info.');
					uni.showModal({ title: '下载提示', content: '当前App环境不支持此操作。', showCancel: false });
					uni.hideLoading();
					this.btnDisabled = false;
				}
				// #endif

				// #ifndef APP-PLUS
				// H5 环境逻辑
				const systemInfoH5 = uni.getSystemInfoSync();
				const platformH5 = systemInfoH5.platform;
				console.log('H5 Platform:', platformH5);

				if (platformH5 === 'ios') {
					console.log('Redirecting H5 to iOS URL...');
					if (this.downloadUrls.ios === '') {
						uni.showToast({
							title: '下载链接获取失败，请稍后再试',
							icon: 'none'
						});
						return;
					} else {
						uni.showToast({ title: '正在跳转...', icon: 'none', duration: 2000 });
						// **修改**: 使用从配置中获取的 iOS URL
						window.location.href = this.downloadUrls.ios;
					}
					// 延迟恢复按钮，以防跳转失败
					setTimeout(() => { uni.hideLoading(); this.btnDisabled = false; }, 2500);
				} else if (platformH5 === 'android') {
					console.log('Redirecting H5 to Android URL...');
					if (this.downloadUrls.android === '') {
						uni.showToast({
							title: '下载链接获取失败，请稍后再试',
							icon: 'none'
						});
					} else {
						uni.showToast({ title: '正在跳转或下载...', icon: 'none', duration: 2000 });
						// **修改**: 使用从配置中获取的 Android URL
						window.location.href = this.downloadUrls.android;
					}
					// 延迟恢复按钮
					setTimeout(() => { uni.hideLoading(); this.btnDisabled = false; }, 2500);
				} else {
					// 其他 H5 平台 (例如桌面)
					console.log('Platform not iOS/Android H5, showing info.');
					uni.showModal({
						title: '下载提示',
						content: '请使用手机浏览器访问此页面以下载应用。',
						showCancel: false
					});
					uni.hideLoading();
					this.btnDisabled = false;
				}
				// #endif

			} catch (error) {
				console.error('Download initiation failed:', error);
				uni.hideLoading();
				this.showToastError('启动下载失败，请稍后重试');
				this.btnDisabled = false;
			}
			// --- End Actual Logic ---
		},

		// Helper to show error messages
		showToastError(message) {
			uni.showToast({
				title: message,
				icon: 'none'
			});
		}
	}
}
</script>

<style scoped lang="scss">
/* Copy styles from register.vue and adapt */
.box {
	width: 100%;
	height: 100vh;
	position: relative;
	overflow-y: auto;
}

.background-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: auto;
	/* Keep widthFix behavior */
	z-index: -1;
}

.register-box {
	/* Reusing class name, maybe rename later if needed */
	width: 80%;
	margin: auto;
	/* Removed background-color: rgba(255, 255, 255, 0.8); */
	padding: 30rpx;
	border-radius: 20rpx;
	margin-top: 850rpx;
	/* Keep positioning similar to register */
	display: flex;
	/* Center content */
	flex-direction: column;
	align-items: center;
	/* **新增**: 增加一点底部内边距给技术支持文字留空间 */
	padding-bottom: 40rpx;
}

/* **移除**: 不再需要的下载提示样式 */
/* .download-prompt { ... } */
/* .dp-title { ... } */
/* .dp-text { ... } */

/* **新增**: 笑脸图片样式 */
.smile-image {
	width: 300rpx;
	/* 根据需要调整大小 */
	height: 300rpx;
	/* 根据需要调整大小 */
}

/* Optional App Icon Style */
/* .app-icon {
		width: 150rpx;
		height: 150rpx;
		margin-top: 30rpx;
	} */

/* Button styles (updated to match register.vue) */
.nx-btn {
	/* 文本样式 */
	color: white;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 600;
	font-size: 34rpx;
	line-height: 100rpx; /* 使文本垂直居中 */
	text-align: center;

	/* 按钮样式 - 使用背景图片 */
	background-image: url('/static/btn_zhuce1 1.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: center;
	border: none;

	/* 尺寸设置 */
	width: 552rpx;
	height: 100rpx;

	/* 外边距 */
	margin-top: 30rpx;
}

.btn-disabled {
	opacity: 0.6;
}

.nx-btn:after {
	border: 0;
}

/* 技术支持文字样式 - 根据参考更新 */
.tech-support-text {
	margin-top: 30rpx;
	font-size: 30rpx;
	color: #979797;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 400;
	text-align: center;
}
</style>