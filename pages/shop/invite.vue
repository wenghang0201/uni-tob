<template>
	<view class="flex flex-col invite-container" :style="containerStyle">
		<div class="w-0 h-0">
			<image class="w-100vw" src="/static/images/share/invite.png" mode="widthFix" @load="onImageLoad"></image>
		</div>

		<!-- 返回按钮 -->
		<view class="flex justify-center align-center w-80 h-80" @click="goBack" :class="[
			!isCapturing ? 'opacity-1' : 'opacity-0'
		]">
			<u-icon name="arrow-left" color="#000" size="40rpx" />
		</view>

		<view class="flex justify-center align-center pt-905">
			<!-- 使用图片显示二维码 -->
			<image class="w-230 h-230" :src="qrcodeImageUrl" v-if="qrcodeImageUrl"></image>
			<!-- 可见的canvas (初始化时使用) -->
			<view class="w-230 h-230" v-else>
				<canvas id="inviteQrcode" canvas-id="inviteQrcode"></canvas>
			</view>
		</view>

		<view class="flex flex-row justify-between align-center p-20 pt-180" :class="[
			!isCapturing ? 'opacity-1' : 'opacity-0'
		]">
			<div @click="saveQrcode">
				<image src="/static/images/share/btn1.png" style="width: 360rpx;height: 154rpx;" mode="aspectFit" />
			</div>
			<div @click="shareInvite">
				<image src="/static/images/share/btn2.png" style="width: 360rpx;height: 154rpx;" mode="aspectFit" />
			</div>
		</view>

		<!-- 小程序中需要的隐藏canvas -->
		<!-- #ifdef MP -->
		<canvas canvas-id="invite-canvas"
			style="position:fixed; top:-9999px; left:-9999px; width:100px; height:100px;"></canvas>
		<!-- #endif -->
	</view>
</template>

<script>
import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'
import html2canvas from 'html2canvas'
import cmdIcon from '@/components/cmd-icon/cmd-icon.vue'
import cfg from '@/util/environment.js'
import { domainQuery } from "@/api/domain.js"

export default {
	components: {
		cmdIcon
	},
	data() {
		return {
			inviteLink: '',
			userId: '',
			tenantId: '',
			imageHeight: 0,
			containerStyle: {},
			isCapturing: false,
			qrcodeImageUrl: '', // 存储二维码图片的URL
			qrcodeSize: 140,
		}
	},
	onLoad() {
		// 获取当前用户信息
		this.getUserInfo();
	},
	methods: {
		onImageLoad(e) {
			// 获取图片加载完成后的尺寸
			uni.getImageInfo({
				src: '/static/images/share/invite.png',
				success: (res) => {
					// 计算屏幕宽度下的图片高度
					const screenWidth = uni.getSystemInfoSync().windowWidth;
					const ratio = res.height / res.width;
					this.imageHeight = screenWidth * ratio;

					// 更新容器样式
					this.containerStyle = {
						height: this.imageHeight + 'px'
					};
				}
			});
		},
		getUserInfo() {
			// 获取用户信息，这里用模拟数据
			const userInfo = uni.getStorageSync('vue_userInfo');

			domainQuery().then(res => {
				let domain = res.voList[1]
				let url = (domain.appUrl || window.location.origin).replace(/\/$/, '');

				if (userInfo) {
					this.userId = userInfo.id;
					this.tenantId = userInfo.tenantId;

					// 生成邀请链接 - 使用当前域名 + /pages/user/register + 邀请码参数
					this.inviteLink = `${url}/pages/user/register?inviteCode=${this.userId}`;
				} else {
					// 默认邀请链接不带邀请码
					this.inviteLink = `${url}/pages/user/register`;
				}
				this.calculateQrcodeSize()
				this.generateQRCode()
			})
		},
		// 计算二维码大小
		calculateQrcodeSize() {
			// 获取系统信息
			const systemInfo = uni.getSystemInfoSync();

			// 计算 rpx 到 px 的转换比例
			const rpxToPxRatio = systemInfo.windowWidth / 750;

			// 设置二维码大小（230rpx）
			const sizeRpx = 230;
			this.qrcodeSize = Math.round(sizeRpx * rpxToPxRatio);

			console.log('二维码大小 (rpx):', sizeRpx);
			console.log('二维码大小 (px):', this.qrcodeSize);
		},
		// 生成二维码
		generateQRCode() {
			// 获取uQRCode实例
			const qr = new UQRCode();
			// 设置二维码内容
			qr.data = this.inviteLink;
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = this.qrcodeSize;
			// 设置背景色为白色
			qr.backgroundColor = '#ffffff';
			// 设置前景色为黑色
			qr.foregroundColor = '#000000';
			// 调用制作二维码方法
			qr.make();

			// 获取canvas上下文
			const canvasContext = uni.createCanvasContext('inviteQrcode', this);

			// 先清空canvas
			canvasContext.clearRect(0, 0, this.qrcodeSize, this.qrcodeSize);
			canvasContext.fillStyle = '#ffffff';
			canvasContext.fillRect(0, 0, this.qrcodeSize, this.qrcodeSize);

			// 设置uQRCode实例的canvas上下文
			qr.canvasContext = canvasContext;

			// 调用绘制方法将二维码图案绘制到canvas上
			qr.drawCanvas();

			// 确保二维码绘制完成后再转为图片
			canvasContext.draw(true, () => {
				// 延迟一下再转换为图片，确保canvas绘制完成
				setTimeout(() => {
					this.convertCanvasToImage();
				}, 1000);
			});
		},
		// 将canvas转换为图片
		convertCanvasToImage() {
			// #ifdef APP-PLUS || MP || H5
			uni.canvasToTempFilePath({
				canvasId: 'inviteQrcode',
				// x, y, width, height表示裁剪canvas的区域
				x: 0,
				y: 0,
				width: this.qrcodeSize,
				height: this.qrcodeSize,
				// 输出的图片宽高
				destWidth: this.qrcodeSize,
				destHeight: this.qrcodeSize,
				fileType: 'png',
				quality: 1,
				success: (res) => {
					// 设置二维码图片URL
					this.qrcodeImageUrl = res.tempFilePath;
				},
				fail: (err) => {
					// 使用备用方案
					this.useBackupQRCode();
				}
			}, this);
			// #endif
		},
		// 备用方案：使用UQRCode直接生成二维码数据URL (仅在H5环境)
		useBackupQRCode() {
			// #ifdef H5
			try {
				const qr = new UQRCode();
				qr.data = this.inviteLink;
				qr.size = this.qrcodeSize;
				qr.margin = 10;
				qr.backgroundColor = '#ffffff';
				qr.foregroundColor = '#000000';
				qr.make();

				// 直接获取二维码的Data URL
				const dataURL = qr.toDataURL('image/png');
				if (dataURL) {
					this.qrcodeImageUrl = dataURL;
				}
			} catch (e) {
				// 出错时尝试下一个方案
			}
			// #endif

			// 在非H5环境下，尝试再次生成
			// #ifndef H5
			setTimeout(() => {
				// 最后尝试：直接使用黑白方块绘制
				this.drawSimpleQRCode();
			}, 500);
			// #endif
		},
		// 最后备用方案：简单绘制一个黑白方块图案模拟二维码
		drawSimpleQRCode() {
			const ctx = uni.createCanvasContext('inviteQrcode', this);

			// 白色背景
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, this.qrcodeSize, this.qrcodeSize);

			// 黑色边框
			ctx.fillStyle = '#000000';
			ctx.fillRect(10, 10, this.qrcodeSize-20, this.qrcodeSize-20);

			// 白色中心
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(20, 20, this.qrcodeSize-40, this.qrcodeSize-40);

			// 黑色定位点
			ctx.fillStyle = '#000000';
			// 左上角
			ctx.fillRect(30, 30, 30, 30);
			// 右上角
			ctx.fillRect(80, 30, 30, 30);
			// 左下角
			ctx.fillRect(30, 80, 30, 30);

			// 中心小方块
			ctx.fillRect(60, 60, 20, 20);

			ctx.draw(true, () => {
				setTimeout(() => {
					uni.canvasToTempFilePath({
						canvasId: 'inviteQrcode',
						success: (res) => {
							this.qrcodeImageUrl = res.tempFilePath;
						},
						fail: (err) => {
							// 忽略失败
						}
					}, this);
				}, 300);
			});
		},
		async saveQrcode() {
			// 显示加载提示
			this.isCapturing = true;

			// 等待DOM更新，确保按钮已经隐藏
			await this.$nextTick();
			// 再增加一点延迟确保渲染完成
			await new Promise(resolve => setTimeout(resolve, 300));

			uni.showLoading({
				title: '正在生成图片...'
			});

			try {
				// 确认已经有图片URL
				if (!this.qrcodeImageUrl) {
					// 如果没有，等待生成
					await new Promise((resolve, reject) => {
						// 尝试重新生成二维码
						this.generateQRCode();

						// 等待最多5秒钟
						let attempts = 0;
						const maxAttempts = 10;
						const checkImage = () => {
							attempts++;
							if (this.qrcodeImageUrl) {
								resolve();
							} else if (attempts >= maxAttempts) {
								reject(new Error('二维码生成超时'));
							} else {
								setTimeout(checkImage, 500);
							}
						};
						setTimeout(checkImage, 1000);
					});
				}

				// #ifdef H5
				// 在H5环境下使用html2canvas
				const container = document.querySelector('.invite-container');

				// 使用html2canvas捕获页面
				const canvas = await html2canvas(container, {
					useCORS: true,
					scale: 2, // 提高分辨率
					backgroundColor: null, // 透明背景
					logging: false // 关闭日志
				});

				// 转换为图片URL
				const imgUrl = canvas.toDataURL('image/png');

				// 恢复按钮显示
				this.isCapturing = false;

				// 创建下载链接
				const a = document.createElement('a');
				a.href = imgUrl;
				a.download = '邀请店主.png';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);

				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});
				// #endif

				// #ifdef MP || APP-PLUS
				// 在小程序或APP环境下使用原生截图API
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];

				// 获取当前页面的webview对象
				const currentWebview = page.$getAppWebview();

				// 获取容器位置和尺寸
				const query = uni.createSelectorQuery();
				query.select('.invite-container').boundingClientRect(data => {
					// 获取容器位置和尺寸
					const x = data.left;
					const y = data.top;
					const width = data.width;
					const height = data.height;

					// #ifdef APP-PLUS
					const bitmap = new plus.nativeObj.Bitmap();
					bitmap.loadBase64Data(currentWebview.draw());

					// 裁剪指定区域
					bitmap.save(
						'_doc/invite_shop.png',
						{
							quality: 100,
							clip: {
								top: y,
								left: x,
								width: width,
								height: height
							}
						},
						saved => {
							// 恢复按钮显示
							this.isCapturing = false;

							uni.saveImageToPhotosAlbum({
								filePath: saved.target,
								success: () => {
									bitmap.clear();
									uni.hideLoading();
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: () => {
									bitmap.clear();
									uni.hideLoading();
									uni.showToast({
										title: '保存失败',
										icon: 'none'
									});
								}
							});
						},
						error => {
							bitmap.clear();
							// 恢复按钮显示
							this.isCapturing = false;
							uni.hideLoading();
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						}
					);
					// #endif

					// #ifdef MP
					// 小程序截屏API
					uni.canvasToTempFilePath({
						canvasId: 'invite-canvas', // 需要在页面上添加一个隐藏的canvas元素
						x: x,
						y: y,
						width: width,
						height: height,
						destWidth: width * 2, // 提高清晰度
						destHeight: height * 2, // 提高清晰度
						success: res => {
							// 恢复按钮显示
							this.isCapturing = false;

							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存失败',
										icon: 'none'
									});
								}
							});
						},
						fail: () => {
							// 恢复按钮显示
							this.isCapturing = false;
							uni.hideLoading();
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						}
					}, this);
					// #endif
				}).exec();
				// #endif
			} catch (error) {
				// 恢复按钮显示
				this.isCapturing = false;
				uni.hideLoading();
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			}
		},
		shareInvite() {
			// 分享功能
			uni.showActionSheet({
				itemList: ['微信好友', '朋友圈', '复制链接'],
				success: (res) => {
					if (res.tapIndex === 2) {
						uni.setClipboardData({
							data: this.inviteLink,
							success: () => {
								uni.showToast({
									title: '链接已复制',
									icon: 'success'
								});
							}
						});
					} else {
						uni.showToast({
							title: '分享功能开发中',
							icon: 'none'
						});
					}
				}
			});
		},
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>