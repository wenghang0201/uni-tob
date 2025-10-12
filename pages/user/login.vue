<template>
	<view class="box">
		<view class="box-title">
			<view class="BT-title">{{ loginMode === 'owner' ? '店主登录' : '员工登录' }}</view>
			<view class="BT-text" v-if="false">为您打造专属的店铺品牌</view>
		</view>
		<view class="login-box">
			<image :src="shop.logo" mode='aspectFit' class="nx-logo"></image>
			<view class="nx-form">
				<input :maxlength="loginMode === 'owner' ? 11 : 100" class="nx-input" :placeholder="loginMode === 'owner' ? '请输入手机号' : '请输入账号'" v-model="login.username" />
				<input class="nx-input" password placeholder="请输入密码" v-model="login.password" />
				<!-- 记住密码勾选框 -->
				<view class="remember-row">
					<label class="remember-label">
						<checkbox v-model="rememberPwd" :checked="true" color="var(--themeColor)"/>
						<text>记住密码</text>
					</label>
				</view>
				<navigator hover-class="none" class="nx-label"></navigator>
				<button :disabled="btnDisabled" class="nx-btn" @tap="loginFunction">立即登录</button>
				<!-- 添加切换登录模式按钮 -->
				<view class="switch-mode" @click="switchLoginMode">
					{{ loginMode === 'owner' ? '选择员工登录' : '返回店主登录' }}
				</view>
				<navigator hover-class="none" class="nx-label"></navigator>
				<u-picker @cancel="show=false" @confirm="confirm" :show="show" closeOnClickOverlay :columns="columns"
					keyName="name" @close="show=false"></u-picker>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login,
		getUser
	} from '@/api/user.js'
	import {
		setAuthtoken,
		setadminUser,
		setUserInfo
	} from '@/util/auth.js'
	import {
		shopList
	} from '@/api/shop.js'
	import {
		loginEmployeeByUsername
	} from '@/api/employee.js'

	import sseService from '@/util/SSEService.js';
	export default {
		data() {
			return {
				shop: {},
				login: {
					username: '',
					password: '',
				},
				btnDisabled: false,
				show: false,
				columns: [],
				text: '',
				loginMode: 'owner', // 默认为店主登录模式
				rememberPwd: "true", // 记住密码，默认选中
			};
		},
		onLoad() {
			this.shop = uni.getStorageSync("shop");
			// 自动读取本地存储的账号密码
			let saved = uni.getStorageSync('loginUser'+this.loginMode);
			if (saved) {
				this.login.username = saved.username || '';
				this.login.password = saved.password || '';
			}else{
				saved = uni.getStorageSync('loginUser');
				if (saved) {
					this.login.username = saved.username || '';
					this.login.password = saved.password || '';
				}
			}
		},
		methods: {
			confirm(data) {
				this.text = data.value[0].name;
				this.show = false;
				this.shop = data.value[0];
			},
			inputBtn() {
				this.columns = [];
				if (this.login.username != "") {
					shopList(this.login).then(res => {
						this.columns.push(res.voList);
					});
					this.show = true;
				} else {
					uni.showToast({
						title: '请先输入账户',
						icon: 'none'
					});
					this.show = false;
				}
				uni.hideKeyboard();
			},
			// 切换登录模式
			switchLoginMode() {
				// 切换登录模式
				this.loginMode = this.loginMode === 'owner' ? 'staff' : 'owner';
				this.login.username = '';
				this.login.password = '';
				let saved = uni.getStorageSync('loginUser'+this.loginMode);
				if (saved) {
					console.log('saved',saved);
					this.login.username = saved.username || '';
					this.login.password = saved.password || '';
				}else if(this.loginMode === 'owner'){
					saved = uni.getStorageSync('loginUser');
					console.log('saved2',saved);
					if (saved) {
						this.login.username = saved.username || '';
						this.login.password = saved.password || '';
					}
				}
				console.log('login',this.login);
				// 显示切换提示
				uni.showToast({
					title: this.loginMode === 'owner' ? '已切换到店主登录' : '已切换到员工登录',
					icon: 'none'
				});
			},

			async loginFunction() {
				if (!this.login.username) {
					uni.showToast({
						title: '请输入账户',
						icon: 'none'
					});
					return;
				}
				if (!this.login.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}

				this.btnDisabled = true;
				uni.showLoading({
					title: '登录中...'
				});

				uni.setStorageSync("shop", this.shop);
				setadminUser(this.login.username);

				let params = this.loginMode === 'staff' ? {
					loginAccount: this.login.username,
					password: this.login.password
				} : {
					phone: this.login.username,
					password: this.login.password,
					userType: this.loginMode === 'owner' ? 1 : 3 // 店主=1，员工=3
				};

				try {
					const res = this.loginMode === 'staff' ? await loginEmployeeByUsername(params) : await login(params);
					if (res.success) {
						setAuthtoken(res.token);

						// 登录成功后获取用户信息
						try {
							const userInfo = await getUser();
							if (userInfo) {
								// 将用户信息存储到缓存中
								setUserInfo(userInfo);
								console.log('获取用户信息成功:', userInfo);
							}
						} catch (userErr) {
							console.error('获取用户信息失败:', userErr);
						}

						// 记住密码逻辑
						if (this.rememberPwd) {
							uni.setStorageSync('loginUser'+this.loginMode, {
								username: this.login.username,
								password: this.login.password
							});
						} else {
							uni.setStorageSync('loginUser'+this.loginMode, {
								username: this.login.username,
								password: ''
							});
						}

						// 登录成功后，App.vue会自动检测token并建立实时连接
						console.log('登录成功，App.vue将自动建立实时连接');
						// 建立SSE连接
						sseService.connect('/sse/connect');
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/order/lotteryOrder"
							});
							uni.hideLoading();
							this.btnDisabled = false;
						}, 100);
					} else {
						uni.hideLoading();
						this.btnDisabled = false;
					}
				} catch (err) {
					uni.hideLoading();
					this.btnDisabled = false;
				}
			},


		}
	}
</script>

<style scoped lang="scss">
	.box {
		width: 100%;
		height: 100%;
		background: linear-gradient(to top, #ffffff, var(--themeColor));
	}

	.box-title {
		text-align: center; /* 居中显示 */
		color: #ffffff;
		padding-top: 20px;
	}

	.BT-title {
		font-size: 25px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.BT-text {
		font-size: 16px;
	}

	.login-box {
		width: 80%;
		margin: auto;
	}

	.nx-logo {
		width: 100%;
		height: 250upx;
	}

	.nx-input {
		background: #e2f5fc;
		margin-top: 30upx;
		border-radius: 100upx;
		padding: 20upx 40upx;
		font-size: 32upx;
		box-sizing: content-box;
	}

	.nx-label {
		padding: 40upx 0;
		text-align: center;
		font-size: 30upx;
		color: #a7b6d0;
	}

	.nx-btn {
		color: #fff;
		border: 0;
		border-radius: 100upx;
		font-size: 32upx;
		background: var(--themeColor);
		margin-top: 40upx;
	}

	.nx-btn:after {
		border: 0;
	}

	.nx-btn.button-hover {
		transform: translate(1upx, 1upx);
	}

	/* 切换登录模式按钮样式 */
	.switch-mode {
		text-align: center;
		margin-top: 30upx;
		font-size: 28upx;
		color: #666;
		text-decoration: underline;
	}

	/* 记住密码勾选框样式 */
	.remember-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 20upx 0 0 0;
	}
	.remember-label {
		display: flex;
		align-items: center;
		font-size: 28upx;
		color: #666;
	}
	.remember-label checkbox {
		margin-left: 0;
		margin-right: 12upx;
	}
</style>