<script>
	import request from '@/util/ajax'
	import cfg from '@/util/environment.js';
	import globalUtil from "@/util/face.js";
	import sseService from '@/util/SSEService.js';
	import pollingService from '@/util/polling.js';

	export default {
		onLaunch: function(optios) {
			console.log("NODE_ENV",process.env.NODE_ENV);

			// #ifdef H5
			const meta = document.querySelector('meta[name="build-date"]');
			if (meta) {
				console.log('本次H5打包时间：', meta.getAttribute('content'));
			}
			// 检测是否在微信内置浏览器中
			if (globalUtil && globalUtil.isWeixinBrowser && globalUtil.isWeixinBrowser()) {
				console.log('检测到微信内置浏览器');
				// 如果当前页面不是微信提示页，则跳转到微信提示页
				if (optios.path !== 'pages/user/weixinTip') {
					// 将当前路径编码后作为参数传递，以便用户选择继续访问时能够回到原页面
					const redirectPath = encodeURIComponent('/' + optios.path);
					uni.redirectTo({
						url: `/pages/user/weixinTip?redirect=${redirectPath}`
					});
					return; // 中断后续执行
				}
			} else if (optios.path === 'pages/user/weixinTip') {
				uni.reLaunch({
					url: optios.query.redirect ? decodeURIComponent(optios.query.redirect) : '/'
				})
				return;
			}
			
			// 设置用户交互监听，用于初始化音频
			this.setupUserInteractionListener();
			// #endif

			//token判断存在跳转至首页 不存在跳转登录页
			let token = uni.getStorageSync("vue_authtoken");
			// #ifdef APP-PLUS
			if (token) {
				//存在则关闭启动页进入首页
				plus.navigator.closeSplashscreen();
			} else {
				//不存在则跳转至登录页
				uni.reLaunch({
					url: "/pages/user/login",
					success: () => {
						plus.navigator.closeSplashscreen();
					}
				})
			}
			// #endif

			// #ifdef H5
			if (token) {
				if (optios.path === 'pages/user/login') {
					//存在则关闭启动页进入首页
					uni.redirectTo({
						url: "/pages/order/lotteryOrder"
					})
				}
			} else {
				if (optios.path.startsWith('pages/') && ![
					'pages/user/register',
					'pages/user/downloadApp',
					'pages/user/weixinTip', // 添加微信提示页到白名单
				].includes(optios.path)) {
					//不存在则跳转至登录页
					//存在则关闭启动页进入首页
					uni.redirectTo({
						url: "/pages/user/login"
					})
				}
			}
			// #endif

			// 应用启动时初始化SSE连接（如果有token）
			this.initSSEConnection();
		},
		onShow: function () {
			// 检查店主端版本
			this.checkStoreVersion();
		},
		onHide: function() {
			// 应用切换到后台时保持SSE连接，不断开
			console.log('应用切换到后台，保持SSE连接');
		},

		methods: {
			/**
			 * 检查店主端版本
			 * 通过 getConfigByParamCode 接口获取最新版本号，与当前版本比较
			 * 如果版本不一致，则显示更新提示弹窗
			 */
			checkStoreVersion() {
				// 获取店主端版本参数
				request({
					url: '/app/base/getConfigByParamCode/shop_app_version',
					method: 'get'
				}).then(res => {
					if (res.success && res.paramValue) {
						console.log('获取店主端版本成功:', res.paramValue);

						this.compareVersions(cfg.VERSION, res.paramValue);
					} else {
						console.error('获取店主端版本失败:', res.errorMsg);
					}
				}).catch(err => {
					console.error('获取店主端版本异常:', err);
				});
			},

			/**
			 * 比较版本号
			 * @param {String} currentVersion 当前版本
			 * @param {String} serverVersion 服务器版本
			 */
			compareVersions(currentVersion, serverVersion) {
				console.log('版本比较 - 当前版本:', currentVersion, '服务器版本:', serverVersion);

				if (currentVersion !== serverVersion) {
					// 版本不一致，显示更新提示
					uni.showModal({
						title: '版本更新提示',
						content: `发现新版本(${serverVersion})，请更新到最新版本以获得更好的体验。`,
						confirmText: '立即更新',
						cancelText: '稍后再说',
						success: (res) => {
							if (res.confirm) {
								// 用户点击了更新按钮
								this.goToDownloadPage();
							}
						}
					});
				}
			},

			/**
			 * 初始化SSE连接
			 */
			initSSEConnection() {
				// 检查是否有有效的token
				// const token = uni.getStorageSync("vue_authtoken");
				// if (!token) {
				// 	console.log('未找到有效token，跳过SSE连接');
				// 	return;
				// }
				// 尝试建立SSE连接
				this.trySSEConnection();
			},

			/**
			 * 尝试SSE连接，失败时自动切换到轮询
			 */
			trySSEConnection() {
				console.log('尝试建立SSE连接...');
				
				// 监听SSE连接错误
				const errorHandler = (error) => {
					console.error('SSE连接失败，切换到轮询模式');
					sseService.off('error', errorHandler);
					// this.switchToPolling();
				};
				
				sseService.on('error', errorHandler);
				
				// 监听SSE连接成功
				const successHandler = () => {
					console.log('SSE连接成功');
					sseService.off('connected', successHandler);
					sseService.off('error', errorHandler);
				};
				
				sseService.on('connected', successHandler);
				
				// 建立SSE连接
				sseService.connect('/sse/connect');
				
				// // 设置超时，如果5秒内没有连接成功，切换到轮询
				// setTimeout(() => {
				// 	if (!sseService.getConnectionStatus()) {
				// 		console.log('SSE连接超时，切换到轮询模式');
				// 		sseService.off('error', errorHandler);
				// 		sseService.off('connected', successHandler);
				// 		this.switchToPolling();
				// 	}
				// }, 5000);
			},

			/**
			 * 切换到轮询模式
			 */
			switchToPolling() {
				console.log('切换到轮询模式');
				
				// 断开SSE连接
				sseService.disconnect();
				
				// 开始轮询
				pollingService.startPolling('/sse/connect');
				
				// 显示提示
				uni.showToast({
					title: '已切换到轮询模式',
					icon: 'none'
				});
			},
			/**
			 * 设置用户交互监听器
			 */
			setupUserInteractionListener() {
				// #ifdef H5
				// 监听用户交互事件，用于初始化音频
				const initAudioOnInteraction = () => {
					console.log('用户交互触发音频初始化');
					sseService.initAudioOnUserInteraction();
					// 移除监听器，避免重复触发
					document.removeEventListener('click', initAudioOnInteraction);
					document.removeEventListener('touchstart', initAudioOnInteraction);
					document.removeEventListener('keydown', initAudioOnInteraction);
				};
				
				// 添加多种交互事件监听
				document.addEventListener('click', initAudioOnInteraction);
				document.addEventListener('touchstart', initAudioOnInteraction);
				document.addEventListener('keydown', initAudioOnInteraction);
				// #endif
			},

			/**
			 * 刷新当前页面
			 * 统一使用 uni.reLaunch 方法，不区分环境
			 */
			goToDownloadPage() {
				// 生成时间戳，避免缓存
				const timestamp = new Date().getTime();

				// 获取当前页面路径
				let currentPath = '/pages/personal/personal'; // 默认首页

				try {
					const pages = getCurrentPages();
					if (pages && pages.length > 0) {
						const currentPage = pages[pages.length - 1];
						currentPath = '/' + currentPage.route;

						// 获取当前页面参数
						const options = currentPage.options || {};
						let paramStr = '';

						// 构建参数字符串（保留原有参数）
						for (const key in options) {
							if (key !== '_t') { // 排除旧的时间戳参数
								if (paramStr) {
									paramStr += '&';
								} else {
									paramStr += '?';
								}
								paramStr += `${key}=${options[key]}`;
							}
						}

						// 添加时间戳参数
						if (paramStr) {
							paramStr += `&_t=${timestamp}`;
						} else {
							paramStr += `?_t=${timestamp}`;
						}

						currentPath += paramStr;
					}
				} catch (e) {
					console.error('获取当前页面路径失败:', e);
					// 失败时使用默认路径
					currentPath = `/pages/personal/personal?_t=${timestamp}`;
				}

				// 使用 uni.reLaunch 刷新到当前页面
				uni.reLaunch({
					url: currentPath
				});
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import 'style/tailwindcss.scss';

	// .box {
	// 	//font-family: PingFangSC-Semibold;
	// 	font-family: PingFangSC-Regular;
	// 	/*  #ifndef   H5 */
	// 	padding-bottom: 140upx;
	// 	padding-top: 170upx;
	// 	top: var(--status-bar-height);
	// 	/*  #endif */
	// }

	// .box {
	// 	//font-family: PingFangSC-Semibold;
	// 	font-family: PingFangSC-Regular;
	// 	/*  #ifndef   APP-PLUS */
	// 	padding-bottom: 140upx;
	// 	padding-top: 88upx;
	// 	top: var(--status-bar-height);
	// 	/*  #endif */
	// }
	//全局动画
	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}
	.mp0{
		margin: 0 !important;
		padding: 0 !important
	}
</style>
