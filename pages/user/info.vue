<template>
	<view class="bgc-eee min-h-100vh pb-120">
		<nav-bar :title="'用户信息'" :back="true"></nav-bar>

		<!-- 用户基本信息 -->
		<view class="bgc-fff m-20 p-30 rounded-10 flex flex-col relative">
			<view class="flex">
				<view class="relative w-120 h-120 mr-30">
					<image class="w-120 h-120 rounded bgc-eee"
						:src="user.avatar || '/static/images/personal/toxiang.png'"></image>
					<!-- <view class="absolute left-0 top-0 w-120 h-120 flex flex-col justify-center items-center">
					<text class="fs-40 fw-700 c-666" v-if="user.nickname">{{ user.nickname.substr(0, 1) }}</text>
					<image class="w-30 h-30 absolute right-0 bottom-0" src="/static/images/common/edit.png"></image>
				</view> -->
				</view>
				<view class="flex-1">
					<view class="flex items-center mb-16 fs-28">
						<text class="c-999 mr-10">昵称:</text>
						<text class="c-333">{{ user.nickname }}</text>
					</view>
					<view class="flex items-center mb-16 fs-28">
						<text class="c-999 mr-10">电话:</text>
						<text class="c-333">{{ user.phone }}</text>
						<view class="ml-20 c-fff bgc-999 px-16 py-4 rounded-6 fs-24" @click="copyPhone">复制</view>
					</view>
					<view class="flex items-center mb-16 fs-28">
						<text class="c-999 mr-10">注册:</text>
						<text class="c-333">{{ user.create_time }}</text>
					</view>
				</view>
				<view v-if="isShopOwner" class="absolute right-30 top-30" @click="handleStarSwitchChange(!isStarred)">
					<u-icon :name="isStarred ? 'star-fill' : 'star'" color="#FFA07A" size="50"></u-icon>
				</view>
			</view>
			<!-- 设置备注 -->
			<view class="flex justify-between items-center mt-20 pt-20 border-t" @click="showRemarkModal">
				<view class="fs-28">
					<text class="c-333 mr-10">备注:</text>
					<text class="c-999 mr-10">{{ userRemark || '设置备注' }}</text>
				</view>
				<view>
					<u-icon name="arrow-right" color="#333" size="36rpx" />
				</view>
			</view>
		</view>

		<!-- 账户余额 -->
		<view class="bgc-fff m-20 p-30 rounded-10">
			<view class="fs-28 c-666 text-left mb-20">账户余额 (元)</view>
			<view class="fs-60 c-2979ff fw-700 mb-30" style="color: #2979ff;">{{ balanceAmount }}</view>
			<view class="flex justify-between">
				<view class="flex-1 h-80 lh-80 text-center rounded-8 fs-28 border-b mr-20"
					style="border: 1rpx solid #ddd; color: #666;" @click="showDepositModal">加款</view>
				<view class="flex-1 h-80 lh-80 text-center rounded-8 fs-28 c-fff" style="background-color: #2979ff;"
					@click="showWithdrawModal">扣款</view>
			</view>
		</view>

		<!-- 操作列表 -->
		<view v-if="isShopOwner" class="bgc-fff m-20 rounded-10">
			<view class="flex justify-between items-center p-30" @click="goToAccountDetail">
				<text class="fs-28 c-333">账户明细</text>
				<u-icon name="arrow-right" color="#999" size="26"></u-icon>
			</view>
			<view class="flex justify-between items-center p-30 border-t" @click="navigateToBettingRecords">
				<text class="fs-28 c-333">投注记录</text>
				<u-icon name="arrow-right" color="#999" size="26"></u-icon>
			</view>
			<!-- <view class="flex justify-between items-center p-30 border-t" @click="goToPaymentManage">
				<text class="fs-28 c-333">支付管理</text>
				<u-icon name="arrow-right" color="#999" size="26"></u-icon>
			</view> -->
		</view>

		<!-- 设置开关项 -->
		<view v-if="isShopOwner" class="bgc-fff m-20 rounded-10">
			<view class="flex justify-between items-center p-30 border-b">
				<text class="fs-28 c-333">设为用户代理</text>
				<u-switch v-model="isAgent" @change="handleAgentSwitchChange" active-color="#2979ff"
					size="30"></u-switch>
			</view>
			<view class="flex justify-between items-center p-30">
				<text class="fs-28 c-333">设为专家</text>
				<u-switch v-model="isExpert" @change="handleExpertSwitchChange" active-color="#2979ff"
					size="30"></u-switch>
			</view>
		</view>

		<view v-if="isShopOwner" class="bgc-fff m-20 rounded-10">
			<!-- <view class="flex justify-between items-center p-30 border-b" @click="goToAgentData">
				<text class="fs-28 c-333">他的代理</text>
				<u-icon name="arrow-right" color="#999" size="26"></u-icon>
			</view> -->
			<view class="flex justify-between items-center p-30 border-b" @click="goToAgentData">
				<text class="fs-28 c-333">他的邀請</text>
				<u-icon name="arrow-right" color="#999" size="26"></u-icon>
			</view>
			<view class="flex justify-between items-center p-30">
				<text class="fs-28 c-333">他的上级</text>
				<text class="c-333">{{ parentName || user.pid }}</text>
				<view class="ml-20 c-fff px-16 py-4 rounded-6 fs-24" style="background-color: #2979ff;"
					@click="changeAgentUser">修改上级</view>
			</view>
		</view>

		<!-- 星标说明 -->
		<view v-if="isShopOwner" class="m-20 p-20 fs-26 c-999">
			<text>星标用户将在首页置顶</text>
		</view>

		<!-- 星标设置 -->
		<view v-if="isShopOwner" class="bgc-fff m-20 rounded-10">
			<view class="flex justify-between items-center p-30">
				<text class="fs-28 c-333">设为星标用户</text>
				<u-switch v-model="isStarred" @change="handleStarSwitchChange" active-color="#2979ff"
					size="30"></u-switch>
			</view>
		</view>

		<!-- 底部按钮区域 -->
		<view v-if="isShopOwner" class="fixed left-0 right-0 bottom-0 flex h-100 bgc-fff" style="border-top: 1rpx solid #eee;">
			<!-- <view class="flex-1 h-100 lh-100 text-center fs-28 bgc-eee c-333" @click="resetPassword">一键重置(登录密码)</view> -->
			<view class="flex-1 h-100 lh-100 text-center fs-28 c-fff" style="background-color: #2979ff;"
				@click="callUser">打电话</view>
		</view>

		<!-- 加款/扣款弹窗 -->
		<view class="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" v-show="showModal">
			<view class="absolute top-0 left-0 right-0 bottom-0 bgc-mask" @click="showModal = false"></view>
			<view class="w-650 bgc-fff rounded-20 p-30 z-50 relative">
				<view class="fs-36 fw-700 text-center mb-40 c-333">{{ operationType === 0 ? '加款' : '扣款' }}</view>

				<view class="mb-30 relative">
					<input type="text" inputmode="decimal" pattern="[0-9]*(\.[0-9]*)?" class="h-100 border-b rounded-12 px-20 fs-30 w-full box-border"
						style="border: 1rpx solid #e5e5e5;" v-model="operationAmount"
						:placeholder="operationType === 0 ? '请输入加款金额' : '请输入扣款金额'" />
				</view>

				<!-- <view class="mb-30 relative">
					<input :type="showPassword ? 'text' : 'password'"
						class="h-100 border-b rounded-12 px-20 fs-30 w-full box-border"
						style="border: 1rpx solid #e5e5e5;" v-model="payPassword" placeholder="请输入支付密码" />
					<view class="absolute right-20" style="top: 50%; transform: translateY(-50%);"
						@click="togglePasswordVisibility">
						<u-icon :name="showPassword ? 'eye-fill' : 'eye-off'" size="48rpx" color="#666"></u-icon>
					</view>
				</view> -->

				<view class="mb-30 relative">
					<input type="text" class="h-100 border-b rounded-12 px-20 fs-30 w-full box-border"
						style="border: 1rpx solid #e5e5e5;" v-model="remark" placeholder="请输入备注" />
					<view class="absolute right-20" style="top: 50%; transform: translateY(-50%);" @click="remark = ''"
						v-if="remark">
						<u-icon name="close" size="48rpx" color="#666"></u-icon>
					</view>
				</view>

				<view class="flex justify-between mt-50">
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 bgc-eee c-333 mr-20"
						@click="showModal = false">取消</view>
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 c-fff"
						style="background-color: #2979ff;" @click="confirmOperation">确认</view>
				</view>
			</view>
		</view>

		<!-- 备注弹窗 -->
		<view class="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" v-show="showRemarkInputModal">
			<view class="absolute top-0 left-0 right-0 bottom-0 bgc-mask" @click="showRemarkInputModal = false"></view>
			<view class="w-650 bgc-fff rounded-20 p-30 z-50 relative">
				<view class="fs-36 fw-700 text-center mb-40 c-333">设置备注</view>

				<view class="mb-30 relative">
					<input type="text" class="h-100 border-b rounded-12 px-20 fs-30 w-full box-border"
						style="border: 1rpx solid #e5e5e5;" v-model="tempRemark" placeholder="请输入备注" />
					<view class="absolute right-20" style="top: 50%; transform: translateY(-50%);" @click="tempRemark = ''"
						v-if="tempRemark">
						<u-icon name="close" size="48rpx" color="#666"></u-icon>
					</view>
				</view>

				<view class="flex justify-between mt-50">
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 bgc-eee c-333 mr-20"
						@click="showRemarkInputModal = false">取消</view>
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 c-fff"
						style="background-color: #2979ff;" @click="confirmSetRemark">确认</view>
				</view>
			</view>
		</view>

		<!-- 专家设置弹窗 -->
		<view class="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center" v-show="showExpertModal">
			<view class="absolute top-0 left-0 right-0 bottom-0 bgc-mask" @click="showExpertModal = false"></view>
			<view class="w-650 bgc-fff rounded-20 p-30 z-50 relative">
				<view class="fs-36 fw-700 text-center mb-40 c-333">设为专家</view>

				<view class="mb-30 relative">
					<view class="flex items-center gap-20">
						<text class="c-999 text-nowrap">排序:</text>
						<input type="text" inputmode="decimal" pattern="[0-9]*(\.[0-9]*)?" class="h-70 border-b rounded-12 px-20 fs-30 w-full box-border"
							style="border: 1rpx solid #e5e5e5;" v-model="tempExpertOrder" placeholder="数字越大优先展示" />
					</view>
					<view class="absolute right-20" style="top: 50%; transform: translateY(-50%);" @click="tempExpertOrder = ''"
						v-if="tempExpertOrder">
						<u-icon name="close" size="48rpx" color="#666"></u-icon>
					</view>
				</view>

				<view class="mb-30 fs-26 c-999">
					<text>在跟单大厅，推荐专家板块展示</text>
				</view>

				<view class="flex justify-between mt-50">
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 bgc-eee c-333 mr-20"
						@click="isExpert = showExpertModal = false">取消</view>
					<view class="flex-1 h-90 lh-90 text-center rounded-45 fs-32 c-fff"
						style="background-color: #2979ff;" @click="confirmSetExpert">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getStoreUserDetail,
	shopkeeperRecharge,
	setAsStarUserFlag,
	setAsUserAgent,
	cancelUserAgent,
	updateStoreUserInfo,
	shopOwnerModifiesExpertStatus,
} from '@/api/user.js'
import {
	getUserInfo
} from '@/util/auth.js'
export default {
	data() {
		return {
			user: {
				nickname: "彩店宝gd95C7a9",
				phone: "15871741201",
				create_time: "2024-12-20 18:28:11",
				avatar: "",
				gold: 0,
				price: 0,
				id: 0,
				isAgent: 0,
				pid: 0
			},
			balanceAmount: "99580.00",
			isShopOwner: false,
			isAgent: false,
			isExpert: false, // 是否为专家
			isStarred: false,
			parentName: "", // 上级用户昵称
			userRemark: "", // 用户备注
			expertOrder: "", // 专家排序

			// 操作相关
			showModal: false,
			operationType: 0, // 0-加款 1-扣款
			operationAmount: '',
			accountType: '0',
			form: {},
			showPassword: false,
			// payPassword: '',
			remark: '',

			// 备注相关
			showRemarkInputModal: false,
			tempRemark: '',

			// 专家设置相关
			showExpertModal: false,
			tempExpertOrder: "",

			radioList: [
				{
					value: '0',
					name: '彩金账户'
				},
				{
					value: '1',
					name: '奖金账户'
				}
			],
		};
	},
	onLoad(e) {
		if (!e.uid) {
			uni.showToast({
				title: "请选择用户",
				icon: 'none'
			})
			return false;
		}

		this.init(e.uid);
	},
	methods: {
		init(uid) {
			console.log('初始化用户信息，用户ID:', uid);
			uni.showLoading({
				title: '加载中...'
			});

			getUserInfo().then(res => {
				if (res) {
					this.isShopOwner = res.isAgent === '1';
					console.log('从API获取用户信息:', res, '是否店主:', this.isShopOwner);
				}
			}).catch(err => {
				console.error('获取当前用户信息失败:', err);
				// 默认为非店主
				this.isShopOwner = false;
			});

			getStoreUserDetail(uid).then(res => {
				uni.hideLoading();
				console.log('获取用户信息结果:', res);

				if (res) {
					this.user = {
						nickname: res.nickname,
						phone: res.phone,
						create_time: res.createTime,
						avatar: res.avatar,
						gold: res.gold || 0,
						price: 0,
						id: res.userId,
						isAgent: res.userType === '2' ? 2 : 0,
						tenantId: res.tenantId,
						source: res.source,
						balance: res.gold || 0,
						pid: res.pid
					};
					// 设置余额显示
					this.balanceAmount = Number(this.user.gold).toFixed(2);

					// 设置代理开关状态
					console.log('用户类型:', res.userType, '是否代理:', res.userType === '2');
					this.isAgent = res.userType === '2';

					// 设置星标状态
					console.log('星标状态:', res.starUserFlag, '是否星标:', res.starUserFlag === 1);
					this.isStarred = res.starUserFlag === 1;

					// 设置专家状态
					console.log('专家状态:', res.expertStatus, '是否专家:', res.expertStatus === 1);
					this.isExpert = res.expertStatus === 1;
					this.expertOrder = res.expertStatus === 1 ? (res.expertSort || "") : "";

					// 设置订单信息和来源
					this.orderInfo = res.lastOrderInfo || '';
					this.source = res.source || 'iOS';

					// 设置用户备注
					this.userRemark = res.storeRemark || '';

					// 获取上级用户昵称
					if (this.user.pid) {
						this.getParentName(this.user.pid);
					}
				} else {
					console.error('获取用户信息失败:', res);
					uni.showToast({
						title: '获取用户信息失败',
						icon: 'none'
					});
				}
			}).catch(err => {
			});
		},

		// 复制手机号
		copyPhone() {
			uni.setClipboardData({
				data: this.user.phone,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				}
			});
		},

		// 显示加款弹窗
		showDepositModal() {
			this.operationType = 0;
			this.operationAmount = '';
			this.accountType = '0';
			this.showModal = true;
		},

		// 显示扣款弹窗
		showWithdrawModal() {
			this.operationType = 1;
			this.operationAmount = '';
			this.accountType = '0';
			this.showModal = true;
		},

		// 确认操作
		confirmOperation() {
			if (!this.operationAmount || isNaN(this.operationAmount) || Number(this.operationAmount) <= 0) {
				uni.showToast({
					title: '请输入有效金额',
					icon: 'none'
				});
				return;
			}

			// if (!this.payPassword) {
			// 	uni.showToast({
			// 		title: '请输入支付密码',
			// 		icon: 'none'
			// 	});
			// 	return;
			// }

			// 关闭弹窗
			this.showModal = false;

			// 确认操作
			uni.showModal({
				title: this.operationType === 0 ? '加款' : '扣款',
				content: "确认操作吗？",
				success: (res) => {
					if (res.confirm) {
						uni.showLoading();
						// 调用API
						shopkeeperRecharge(this.user.id, {
							'price': Number(this.operationAmount),
							'type': String(this.operationType),
							"tenantId": this.user.tenantId
						}).then(res => {
							if (res.success) {
								uni.hideLoading();
								uni.showToast({
									title: '操作成功！',
									icon: 'success'
								});
								// 清空输入项
								this.operationAmount = '';
								// this.payPassword = '';
								this.storeRemark = '';

								setTimeout(() => {
									this.init(this.user.id);
								}, 1000);
							}
						})
					}
				}
			})
		},

		// 设置代理状态
		handleAgentSwitchChange(value) {
			console.log('设置代理状态:', value, '用户ID:', this.user.id);
			this.isAgent = value;

			uni.showLoading({
				title: '正在设置...'
			});

			// 根据开关状态决定调用哪个接口
			const apiCall = value ?
				setAsUserAgent({ userId: this.user.id }) :
				cancelUserAgent({ userId: this.user.id });

			apiCall.then(res => {
				uni.hideLoading();
				console.log('设置代理返回结果:', res);
				if (res.success) {
					uni.showToast({
						title: value ? '已设为用户代理' : '已取消用户代理',
						icon: 'success'
					});
				} else {
					this.isAgent = !value;
					uni.showToast({
						title: res.errorMsg || '操作失败',
						icon: 'none'
					});
				}
			}).catch((err) => {
				console.error('设置代理失败:', err);
				this.isAgent = !value;
			});
		},

		// 设置专家
		handleExpertSwitchChange(value) {
			console.log('设置专家状态:', value, '用户ID:', this.user.id);

			if (value) {
				// 如果是开启专家，显示设置排序弹窗
				this.tempExpertOrder = this.expertOrder || "";
				this.showExpertModal = true;
			} else {
				// 如果是关闭专家，直接调用接口
				this.confirmCancelExpert();
			}
		},

		// 确认设置专家
		confirmSetExpert() {
			// 验证输入
			if (!this.tempExpertOrder || isNaN(this.tempExpertOrder) || Number(this.tempExpertOrder) < 0) {
				uni.showToast({
					title: '请输入有效的排序数字',
					icon: 'none'
				});
				return;
			}

			// 关闭弹窗
			this.showExpertModal = false;

			// 显示加载中
			uni.showLoading({
				title: '正在设置...'
			});

			// 调用API设置专家
			shopOwnerModifiesExpertStatus({
				userId: this.user.id,
				expertStatus: 1,
				expertSort: Number(this.tempExpertOrder)
			}).then(res => {
				uni.hideLoading();
				console.log('设置专家返回结果:', res);
				// 更新本地数据
				this.isExpert = true;
				this.expertOrder = this.tempExpertOrder;

				uni.showToast({
					title: '已设为专家',
					icon: 'success'
				});
			}).catch((err) => {
				console.error('设置专家失败:', err);
				this.isExpert = false;
			});
		},

		// 确认取消专家
		confirmCancelExpert() {
			// 显示加载中
			uni.showLoading({
				title: '正在设置...'
			});

			// 调用API取消专家
			shopOwnerModifiesExpertStatus({
				userId: this.user.id,
				expertStatus: 0,
				expertSort: 0
			}).then(res => {
				uni.hideLoading();
				console.log('取消专家返回结果:', res);
				if (res.success) {
					// 更新本地数据
					this.isExpert = false;
					this.expertOrder = "";

					uni.showToast({
						title: '已取消专家',
						icon: 'success'
					});
				} else {
					this.isExpert = true;
					uni.showToast({
						title: res.errorMsg || '操作失败',
						icon: 'none'
					});
				}
			}).catch((err) => {
				uni.hideLoading();
				console.error('取消专家失败:', err);
				this.isExpert = true;
			});
		},

		// 一键重置密码
		resetPassword() {
			uni.showModal({
				title: '重置密码',
				content: "确定要重置该用户的登录密码吗？",
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '密码重置成功',
							icon: 'success'
						});
					}
				}
			})
		},

		// 拨打电话
		callUser() {
			uni.makePhoneCall({
				phoneNumber: this.user.phone,
				success: () => {
					console.log('拨打电话成功');
				},
				fail: () => {
					console.log('拨打电话失败');
				}
			});
		},

		// 跳转到账户明细
		goToAccountDetail() {
			uni.navigateTo({
				url: "/pages/order/counts?uid=" + this.user.id
			});
		},

		// 跳转到投注记录
		navigateToBettingRecords() {
			// 构建基本URL
			let url = `/pages/order/bettingRecords?uid=${this.user.id}`;

			// 只有当用户是销售(代理)时才传递salespersonId
			if (this.userType === '2') {
				url += `&salespersonId=${this.user.id}`;
			}

			// 添加param参数
			if (this.user.nickname) {
				url += `&param=${this.user.nickname}`;
			} else if (this.user.phone) {
				url += `&param=${this.user.phone}`;
			}

			uni.navigateTo({
				url: url
			});
		},

		// 跳转到支付管理
		goToPaymentManage() {
			uni.navigateTo({
				url: "/pages/pay/paymentManagement?uid=" + this.user.id
			});
		},

		// 跳转到代理数据
		goToAgentData() {
			// uni.navigateTo({
			// 	url: "/pages/user/myInviteList?userId=" + this.user.id
			// });
			uni.navigateTo({
				url: "/pages/personal/invitation?uid=" + this.user.id
			});
		},

		// 修改上级
		changeAgentUser() {
			uni.navigateTo({
				url: "/pages/user/chooseAgent?userId=" + this.user.id,
				events: {
					selectUser: (data) => {
						// 处理选中用户数据
						console.log('选中了用户:', data.user);
						if (data.user && data.user.id) {
							// 更新上级信息
							this.user.pid = data.user.id;
							this.parentName = data.user.storeRemark || data.user.nickname;
							// 刷新用户数据
							this.init(this.user.id);
						}
					}
				}
			});
		},

		// 获取上级用户昵称
		getParentName(pid) {
			getStoreUserDetail(pid).then(res => {
				if (res) {
					this.parentName = res.storeRemark || res.nickname;
				}
			}).catch(err => {
				console.error('获取上级用户信息失败:', err);
			});
		},

		// 切换密码显示
		togglePasswordVisibility() {
			this.showPassword = !this.showPassword;
		},

		// 处理星标状态切换
		handleStarSwitchChange(value) {
			console.log('设置星标状态:', value, '用户ID:', this.user.id);
			this.isStarred = value;

			uni.showLoading({
				title: '正在设置...'
			});

			setAsStarUserFlag({
				userId: this.user.id,
				starFlag: value ? 1 : 0
			}).then(res => {
				uni.hideLoading();
				console.log('设置星标返回结果:', res);
				if (res.success) {
					uni.showToast({
						title: value ? '已设为星标用户' : '已取消星标',
						icon: 'success'
					});
				} else {
					this.isStarred = !value;
					uni.showToast({
						title: res.errorMsg || '操作失败',
						icon: 'none'
					});
				}
			}).catch((err) => {
				console.error('设置星标失败:', err);
				this.isStarred = !value;
			});
		},

		// 显示备注弹窗
		showRemarkModal() {
			console.log("是否是店主",this.isShopOwner)
			if(this.isShopOwner){
				this.tempRemark = this.userRemark || '';
				this.showRemarkInputModal = true;
			}
		},

		// 确认设置备注
		confirmSetRemark() {
			// 关闭弹窗
			this.showRemarkInputModal = false;

			// 确认操作
			uni.showModal({
				title: '设置备注',
				content: "确认设置此备注吗？",
				success: (res) => {
					if (res.confirm) {
						// 显示加载中
						uni.showLoading({
							title: '保存中...'
						});

						// 调用API保存备注
						updateStoreUserInfo({
							userId: this.user.id,
							storeRemark: this.tempRemark
						}).then(res => {
							uni.hideLoading();

							if (res.success) {
								// 更新本地数据
								this.userRemark = this.tempRemark;

								uni.showToast({
									title: '设置备注成功',
									icon: 'success'
								});
							} else {
								uni.showToast({
									title: res.errorMsg || '设置备注失败',
									icon: 'none'
								});
							}
						}).catch(error => {
							uni.hideLoading();
							console.error('设置备注失败:', error);
							uni.showToast({
								title: '设置备注失败',
								icon: 'none'
							});
						});
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
/* 使用 tailwindcss 样式，无需额外样式 */
</style>
