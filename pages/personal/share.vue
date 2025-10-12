<template>
	<view class="container">
		<!-- <cmd-nav-bar back title="" font-color="#fff" background-color="transparent"></cmd-nav-bar> -->
		<navigator open-type="navigateBack"  hover-class="none"
		style="position: fixed;top:var(--status-bar-height);padding:20rpx;z-index:99999999;">
			<u-icon name="arrow-left" color="#FFF" size="32" ></u-icon>
		</navigator>
		<view class="poster-bg" id="poster" @click="saveImage">
			<view style="position: absolute; right:auto; bottom: auto; background: white;" v-if="shareQrUrl">
				<SannQrcode ref="uqrcode" :canvasId="canvasId" size="160" :value="shareQrUrl"
					style="z-index:9999;position: relative;margin-top:-35px;" />
				<!-- <img class="w-330 h-330" style="z-index:9999;margin-top:-55rpx;"  :src="user.qrCode" v-if="user.qrCode"> -->
			</view>
		</view>

		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
	import {
		getUserInfo,
	} from "@/util/auth.js"
	import {
		domainQuery
	} from "@/api/domain.js"
	import SannQrcode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'
	export default {
		components: {
			SannQrcode
		},
		data() {
			return {
				shareBg: "/static/share-bg.png",
				user: {},
				shop: {},
				show: true,
				shareQrUrl: window.location.orgin +'/#/pages/user/register',
				canvasId: '1',
				posterPath: '',
				showBtn: false,
				params: {
					title: "默认主题",
					message: "截图保存立即分享",
					iconUrl: "https://uviewui.com/demo/toast/default.png",
					position: "bottom",
					duration:3000
				},
				loading:true
			}
		},
		onLoad(options) {
			this.tipsToast()
			
			if(options&&options.uid){
				let url = `/pages/user/register?uid=${options.id}&tenantId=${options.tenantId}`;
				this.shareQrUrl = `${window.location.orgin}` + url;
				setTimeout(() => {
					this.$refs.uqrcode.toTempFilePath({
						success: res => {
							this.user.qrCode = res.tempFilePath
							this.tipsToast()
						}
					});
				}, 0);
				return;
			}
			this.init()
		},
		methods: {
			tipsToast() {
				setTimeout(() => {
					this.$refs.uToast.show(this.params);
				}, 100)
			},
			// async 
			init() {
				let user ={
					uid:'',
					tenantId:""
				}
				let vue_userInfo  = uni.getStorageSync('vue_userInfo')
				if(vue_userInfo){
					user = vue_userInfo;
					this.user = vue_userInfo;
				}
				domainQuery().then(res => {
					let domain = res.voList[0]
					let url = `${domain.appUrl.slice(-1)=='/'?'':'/'}pages/user/register?uid=${user.id}&tenantId=${user.tenantId}`;
					this.shareQrUrl = `${domain.appUrl?domain.appUrl:window.location.orgin}` + url;
					setTimeout(() => {
						this.shareQrUrl&& this.$refs.uqrcode.toTempFilePath({
							success: res => {
								this.user.qrCode = res.tempFilePath
								setTimeout(() => {
									this.tipsToast()
								}, 100)

							}
						});
					}, 1);
				})
			},

			// 准备海报图片
			preparePoster() {
				// 在APP环境下，使用plus截图
				// #ifdef APP-PLUS
				setTimeout(() => {
					this.captureScreen();
				}, 500);
				// #endif
			},

			// 截取屏幕内容为图片
			captureScreen() {
				// #ifdef APP-PLUS
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let currentWebview = page.$getAppWebview();
				let bitmap = new plus.nativeObj.Bitmap('poster_img');

				// 获取海报DOM节点
				const query = uni.createSelectorQuery().in(this);
				query.select('#poster').boundingClientRect(rect => {
					// 将海报区域内容绘制到Bitmap对象中
					currentWebview.draw(
						bitmap,
						() => {
							// 生成随机文件名
							let rand = Math.floor(Math.random() * 10000);
							let saveUrl = "_doc/" + rand + "poster.jpg";
							console.log("rand", saveUrl)
							this.showBtn = true;
							bitmap.save(
								saveUrl, {},
								(i) => {
									this.posterPath = i.target;

									uni.showToast({
										title: '海报已生成',
										icon: 'none'
									});
								},
								(e) => {
									console.error('保存图片失败：', e);
									uni.showToast({
										title: '保存失败：' + e.message,
										icon: 'none'
									});
								}
							);
						},
						(e) => {
							console.error('截图失败：', e);
							uni.showToast({
								title: '截图失败：' + e.message,
								icon: 'none'
							});
						}
					);
				}).exec();
				// #endif
			},

			// 保存图片到相册
			saveImage() {
				this.tipsToast();
				return;
				// #ifdef APP-PLUS
				uni.showToast({
					title: "截图保存立即分享",
					icon: 'none'
				})
				return;
				if (this.posterPath) {
					uni.saveImageToPhotosAlbum({
						filePath: this.posterPath,
						success: () => {
							uni.showToast({
								title: '已保存到相册',
								icon: 'success',
								duration: 2000
							});
						},
						fail: (err) => {
							console.error('保存失败：', err);
							if (err.errMsg.indexOf('auth deny') !== -1) {
								uni.showModal({
									title: '提示',
									content: '保存失败，请授权访问相册',
									showCancel: false
								});
							} else {
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								});
							}
						}
					});
				} else {
					// 如果没有准备好海报，重新截图
					this.captureScreen();
					setTimeout(() => {
						this.saveImage();
					}, 500);
				}
				// #endif

				// #ifdef H5
				uni.showModal({
					title: '提示',
					content: 'H5环境下请长按图片保存',
					showCancel: false
				});
				// #endif

				// #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
				uni.showLoading({
					title: '正在保存...',
					mask: true
				});

				// 使用小程序的截图API
				uni.canvasToTempFilePath({
					canvasId: this.canvasId,
					success: (res) => {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.hideLoading();
								uni.showToast({
									title: '海报已保存到相册',
									icon: 'success',
									duration: 2000
								});
							},
							fail: (err) => {
								uni.hideLoading();
								if (err.errMsg.indexOf('auth deny') !== -1) {
									uni.showModal({
										title: '提示',
										content: '保存失败，请授权访问相册',
										showCancel: false
									});
								} else {
									uni.showToast({
										title: '保存失败',
										icon: 'none'
									});
								}
							}
						});
					},
					fail: () => {
						uni.hideLoading();
						uni.showToast({
							title: '生成海报失败',
							icon: 'none'
						});
					}
				}, this);
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		margin-top: -83rpx;
		// #ifdef APP-PLUS
		// margin-top: -190rpx;
		// #endif
	}

	.box {
		padding-bottom: 0px;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		z-index: 0;
		position: relative;
	}

	::v-deep.u-transition {
		z-index: -999 !important;
	}

	::v-deep.u-popup__content {
		width: 100%;
	}

	.poster-bg {
		width: 750rpx;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: url('/static/share-bg.png')no-repeat;
		background-size: 100% 100%;

		position: fixed;
		top: 0;
		left: 0;
	}

	.save-btn {
		position: fixed;
		bottom: 40px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		z-index: 999;

		.btn {
			background: linear-gradient(to right, var(--red1), var(--red0));
			color: #fff;
			font-size: 32rpx;
			padding: 20rpx 60rpx;
			border-radius: 100rpx;
			box-shadow: 0 5rpx 15rpx var(--red2);
			border: 1rpx solid #fff;
		}
	}

	/* 适配不同平台 */
	/* #ifdef H5 */
	.save-btn {
		bottom: 80px;
	}

	/* #endif */

	/* #ifdef MP */
	.save-btn {
		bottom: 60px;
	}

	/* #endif */
</style>