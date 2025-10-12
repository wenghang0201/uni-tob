<template>
	<view class="box">
		<image class="background-image" src="/static/dianzhu_bg.png" mode="widthFix"></image>

		<view class="register-box">
			<view class="nx-form">
				<view class="nx-inputs">
					<view class="flex items-center h-66 bgc-59BBFF rounded-20 mb-10 px-25">
						<text class="c-fff fs-24 fw-600 w-120 text-nowrap">手机号</text>
						<input maxlength="11" class="c-CEEBFF fs-24 fw-400 bg-transparent border-0 flex-1" placeholder="请输入手机号" v-model="registerForm.phone" />
					</view>
					<view class="flex items-center h-66 bgc-59BBFF rounded-20 mb-10 px-25">
						<text class="c-fff fs-24 fw-600 w-120 text-nowrap">密码</text>
						<input class="c-CEEBFF fs-24 fw-400 bg-transparent border-0 flex-1" password placeholder="请输入密码" v-model="registerForm.password" />
					</view>
					<view class="flex items-center h-66 bgc-59BBFF rounded-20 mb-10 px-25">
						<text class="c-fff fs-24 fw-600 w-120 text-nowrap">确认密码</text>
						<input class="c-CEEBFF fs-24 fw-400 bg-transparent border-0 flex-1" password placeholder="请确认密码" v-model="registerForm.confirmPassword" />
					</view>
					<view class="flex items-center h-66 bgc-59BBFF rounded-20 mb-10 px-25">
						<text class="c-fff fs-24 fw-600 w-120 text-nowrap">店铺名称</text>
						<input class="c-CEEBFF fs-24 fw-400 bg-transparent border-0 flex-1" placeholder="请输入店铺名称" v-model="registerForm.shopName" />
					</view>
					<!-- <input class="nx-input" password placeholder="请设置支付密码（6位数字）" v-model="registerForm.payPassword"
					maxlength="6" type="number" />
				<input class="nx-input" placeholder="邀请码（选填）" v-model="registerForm.inviteCode"
					:disabled="hasInviteCode" /> -->
					<view class="flex items-center justify-center bgc-59BBFF rounded-20 mb-10 p-10">
						<view class="logo-upload" @tap="chooseImage">
							<view class="logo-container" v-if="logoPath">
								<image :src="logoPath" mode='aspectFill' class="nx-logo"></image>
								<view class="logo-overlay">
									<view class="logo-actions">
										<view class="action-btn preview-btn" @tap.stop="previewImage">
											<u-icon name="eye" color="#fff" size="20"></u-icon>
										</view>
										<view class="action-btn delete-btn" @tap.stop="removeLogo">
											<u-icon name="trash" color="#fff" size="20"></u-icon>
										</view>
									</view>
								</view>
							</view>
							<view class="upload-placeholder" v-else>
								<u-icon name="plus" size="15" color="#999"></u-icon>
								<text class="upload-text">店铺logo</text>
							</view>
						</view>
					</view>
				</view>
				<button :disabled="btnDisabled" class="nx-btn" :class="{ 'btn-disabled': btnDisabled }"
					@tap="registerFunction">注册彩店宝</button>
				<view class="text-center" style="cursor: pointer;">
					<text class="download-link" @tap="goToDownload">已经注册，立即下载</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { registerStoreOwner } from '@/api/shop.js'
import { login } from '@/api/user.js'
import { setAuthtoken, setadminUser } from '@/util/auth.js'
import cfg from '@/util/environment.js'
import { compressImage } from '@/util/image-tool.js'

export default {
	data() {
		return {
			logoPath: '',
			registerForm: {
				phone: '',
				password: '',
				confirmPassword: '',
				inviteCode: '',
				shopName: '',
				payPassword: '',
				userType: 1
			},
			btnDisabled: false,
			hasInviteCode: false
		};
	},
	onLoad(options) {
		if (options && options.inviteCode) {
			this.registerForm.inviteCode = options.inviteCode;
			this.hasInviteCode = true;
		}
	},
	methods: {
		// 选择并上传店铺logo
		chooseImage() {
			if (this.logoPath && this.btnDisabled) return;

			uni.chooseImage({
				count: 1,
				sourceType: ['camera', 'album'],
				sizeType: ['compressed'],
				success: (res) => {
					uni.showLoading({
						title: '上传中...'
					});
					compressImage(res.tempFilePaths, {
						maxSize: 200,
						maxWidth: 800,
						maxHeight: 800,
						quality: 0.7
					}).then(compressedImage => {
						// 上传压缩后的图片
						console.log("compressedImage", compressedImage)
						uni.uploadFile({
							url: cfg.BASE_API + "/file/upload",
							filePath: compressedImage,
							name: 'file',
							header: {
								'x-access-token': uni.getStorageSync("vue_authtoken"),
								'X-Sys': 1,
								'X-User': uni.getStorageSync("admin_user"),
							},
							success: (uploadFileRes) => {
								if (uploadFileRes.statusCode == 200) {
									try {
										const data = JSON.parse(uploadFileRes.data);
										this.logoPath = data.url;
										uni.hideLoading();
										uni.showToast({
											title: "上传成功",
											icon: "success"
										});
									} catch (e) {
										this.handleUploadFail();
									}
								} else {
									this.handleUploadFail();
								}
							},
							fail: () => {
								this.handleUploadFail();
							}
						});
					});
				}
			});
		},

		// 预览图片
		previewImage() {
			if (this.logoPath) {
				uni.previewImage({
					urls: [this.logoPath],
					current: this.logoPath
				});
			}
		},

		// 删除LOGO
		removeLogo() {
			uni.showModal({
				title: '提示',
				content: '确定要删除已上传的店铺LOGO吗？',
				success: (res) => {
					if (res.confirm) {
						this.logoPath = '';
						uni.showToast({
							title: '已删除',
							icon: 'success'
						});
					}
				}
			});
		},

		// 处理上传失败
		handleUploadFail() {
			this.logoPath = '';
			uni.hideLoading();
			uni.showToast({
				title: '上传失败，请重试',
				icon: 'none'
			});
		},

		// 注册店主
		async registerFunction() {
			// 表单验证
			if (!this.logoPath) {
				this.showToastError('请上传店铺logo');
				return;
			}
			if (!this.registerForm.phone) {
				this.showToastError('请输入手机号');
				return;
			}
			if (!/^1\d{10}$/.test(this.registerForm.phone)) {
				this.showToastError('手机号格式不正确');
				return;
			}
			if (!this.registerForm.password) {
				this.showToastError('请输入密码');
				return;
			}
			if (this.registerForm.password.length < 6) {
				this.showToastError('密码长度不能少于6位');
				return;
			}
			if (!this.registerForm.confirmPassword) {
				this.showToastError('请确认密码');
				return;
			}
			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				this.showToastError('两次密码输入不一致');
				return;
			}
			if (!this.registerForm.shopName) {
				this.showToastError('请输入店铺名称');
				return;
			}
			// if (!this.registerForm.payPassword) {
			// 	this.showToastError('请设置支付密码');
			// 	return;
			// }
			// if (!/^\d{6}$/.test(this.registerForm.payPassword)) {
			// 	this.showToastError('支付密码必须为6位数字');
			// 	return;
			// }

			this.btnDisabled = true;
			uni.showLoading({
				title: '注册中...'
			});

			// 构建注册参数
			const params = {
				appPhone: this.registerForm.phone,
				appPassword: this.registerForm.password,
				name: this.registerForm.shopName,
				logo: this.logoPath,
				payPwd: this.registerForm.payPassword,
				uid: this.registerForm.inviteCode ? parseInt(this.registerForm.inviteCode) : undefined
			};

			// 调用注册API
			try {
				await registerStoreOwner(params);

				uni.showToast({
					title: '注册成功',
					icon: 'success'
				});

				// **修改**: 移除自动登录逻辑，直接跳转到下载引导页
				uni.hideLoading(); // 隐藏加载提示
				this.btnDisabled = false; // 恢复按钮状态

				// 延迟跳转，让用户看到成功提示
				setTimeout(() => {
					// **修改**: 跳转到 App 下载引导页 (请确认路径是否正确)
					uni.redirectTo({
						url: "/pages/user/downloadApp"
					});
				}, 1500); // 延迟 1.5 秒
			} catch (error) {
				uni.hideLoading();
				this.btnDisabled = false;
			}
		},

		// 显示错误提示
		showToastError(message) {
			uni.showToast({
				title: message,
				icon: 'none'
			});
		},

		// 跳转到下载页面
		goToDownload() {
			uni.navigateTo({
				url: "/pages/user/downloadApp"
			});
		}
	}
}
</script>

<style scoped lang="scss">
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
	z-index: -1;
}

.box-title {
	margin-left: 40px;
	color: #ffffff;
	padding-top: 40px;
}

.BT-title {
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 10px;
}

.BT-text {
	font-size: 16px;
}

.register-box {
	width: 80%;
	margin: auto;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-top: 740rpx;
}

.logo-upload-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10rpx 0 0;
}

.logo-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	align-self: flex-start;
}

.logo-tips {
	font-size: 24rpx;
	color: #999;
	margin-top: 16rpx;
	align-self: flex-start;
}

.logo-upload {
	width: 130rpx;
	height: 130rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	position: relative;
}

.logo-container {
	position: relative;
	width: 100%;
	height: 100%;
}

.nx-logo {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
	object-fit: cover;
}

.logo-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	opacity: 0;
	transition: opacity 0.3s;
}

.logo-container:hover .logo-overlay,
.logo-container:active .logo-overlay {
	opacity: 1;
}

.logo-actions {
	display: flex;
	justify-content: space-around;
	width: 100%;
}

.action-btn {
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
}

.upload-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	background-color: #f8f8f8;
	border-radius: 20rpx;
	border: 2rpx dashed #ddd;
}

.upload-text {
	color: #999;
	font-size: 22rpx;
	margin-top: 16rpx;
}

.nx-form {
	margin-top: 30rpx;
	scale: 0.95;
}

/* 输入框特定样式 */
.bgc-59BBFF {
    background-color: #59BBFF;
}

.c-CEEBFF {
    color: #CEEBFF;
}

::v-deep(.uni-input-placeholder ){
    color: unset;
}

.bg-transparent {
    background: transparent;
}

.border-0 {
    border: 0;
}

.nx-label {
	padding: 40upx 0;
	text-align: center;
	font-size: 30upx;
	color: #a7b6d0;
}

.nx-btn {
	/* 文本样式 - 根据参考更新 */
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

.download-link {
	color: #029AFF;
	font-size: 26rpx;
	font-family: 'PingFang SC', sans-serif;
	font-weight: 600;
	text-decoration: underline;
}

/* 移除: 不再需要 hover 效果或根据需要调整 */
/* .nx-btn.button-hover {
	transform: translate(1upx, 1upx);
} */
</style>