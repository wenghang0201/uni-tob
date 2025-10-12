<template>
	<view class="personal-box">
		<!-- uview 弹出框组件 -->
		<u-modal :show="showLogoutModal" :show-cancel-button="true" title="退出登录" content="确定要退出当前账号吗？"
			confirm-color="#007AFF" cancel-color="#999999" @confirm="confirmLogout"
			@cancel="showLogoutModal = false"></u-modal>

		<view class="PB-head">
			<view class="PBH-top">
				<view class="PBHT-mag">
					<view class="PBHT-right">
						<view class="m-img" @click="navClick('/pages/personal/means')">
							<image v-if="user.avatar" style="border-radius: 50%;" :src="user.avatar" mode="scaleToFill">
							</image>
							<image v-else src="/static/images/personal/toxiang.png" mode="scaleToFill"></image>
							<view class="flex flex-col justify-end items-end w-full h-0">
								<u-icon name="edit-pen" color="var(--themeColor)" size="20"></u-icon>
							</view>
						</view>
						<view class="m-mag">
							<view class="mm-name">{{ storeInfo.name }}</view>
							<view class="mm-n">{{ user.nickname }} (ID.{{ user.id }})</view>
							<view class="mm-n">账号 {{ user.phone }}</view>
							<view class="mm-allow">
								<view class="mma-text">店铺支持：</view>
								<view class="mma-img">
									<image style="width: 20px;height: 20px;" src="/static/images/personal/zhifubao.png"
										mode="scaleToFill"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="PBHT-left">

					</view>
				</view>
				<!-- 只有店主账号才显示余额信息 -->
				<view class="PBHT-money" v-if="isShopOwner">
					<view class="m-shopMoney" @click="navClick('/pages/personal/storeBalance')">
						<view class="ms-money">{{ storeInfo.gold }}</view>
						<view class="ms-text">
							<view class="mst-t">店铺余额</view>
						</view>
					</view>
					<view class="m-shopMoney" @click="navClick('/pages/balance/trustee')">
						<view class="ms-money">{{ storeInfo.trusteeBalance }}</view>
						<view class="ms-text">
							<view class="mst-t">托管余额</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 只有店主账号才显示订单管理 -->
		<view v-if="isShopOwner" class="flex justify-evenly items-center w-full bgc-fff py-40">
			<view class="flex flex-col" @click="navClick('/pages/order/waitTicket')">
				<view class="flex justify-end" style="width: 90%;height: 0px;z-index: 1;">
					<u-badge style="height: fit-content;" :value="orderStatistics.pendingTicketOrderCount" />
				</view>
				<view class="flex flex-col justify-center items-center">
					<image class="w-60 h-60" src="/static/images/personal/dengdaichupiao.png" mode="aspectFit" />
					<span class="fs-28">等待出票</span>
				</view>
			</view>
			<view class="flex flex-col" @click="navClick('/pages/order/printedOrders')">
				<view class="flex justify-end" style="width: 80%;height: 0px;z-index: 1;">
					<!-- <u-badge style="height: fit-content;" :value="123" /> -->
				</view>
				<view class="flex flex-col justify-center items-center">
					<image class="w-60 h-60" src="/static/images/personal/dingdanchaxun.png" mode="aspectFit" />
					<span class="fs-28">订单查询</span>
				</view>
			</view>
			<view class="flex flex-col" @click="navClick('/pages/pay/withdrawal')">
				<view class="flex justify-end" style="width: 80%;height: 0px;z-index: 1;">
					<u-badge style="height: fit-content;" :value="orderStatistics.withdrawalOrderCount" />
				</view>
				<view class="flex flex-col justify-center items-center">
					<image class="w-60 h-60" src="/static/images/personal/tixianguanli.png" mode="aspectFit" />
					<span class="fs-28">提现管理</span>
				</view>
			</view>
			<view class="flex flex-col" @click="navClick('/pages/order/waitAward')">
				<view class="flex justify-end" style="width: 90%;height: 0px;z-index: 1;">
					<u-badge style="height: fit-content;" :value="orderStatistics.prizeDistributionOrderCount" />
				</view>
				<view class="flex flex-col justify-center items-center">
					<image class="w-60 h-60" src="/static/images/personal/paijiangguanli.png" mode="aspectFit" />
					<span class="fs-28">派奖管理</span>
				</view>
			</view>
		</view>
		<!-- 店主账号显示完整的店铺管理菜单 -->
		<view class="PB-foolter" v-if="isShopOwner">
			<view class="PBF-body">
				<view class="PBFB-top">
					<view class="top-text">店铺管理</view>
				</view>
				<view class="PBFB-center">
					<view class="c-marnger" v-on:click="navClick('/pages/order/counts?id=' + user.id)">
						<view class="cm-img">
							<image src="/static/images/personal/zhanghumingxi.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							账户明细
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/pay/paymentManagement')">
						<view class="cm-img">
							<image src="/static/images/personal/shoukuanguanli.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							收款管理
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/service/contact')">
						<view class="cm-img">
							<image src="/static/images/personal/lianxikefu.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							店铺客服
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/lottery/manage')">
						<view class="cm-img">
							<image src="/static/images/personal/caizhoguanli.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							彩种管理
						</view>
					</view>
					<view class="c-marnger" v-on:click="navClick('/pages/staff/manage')">
						<view class="cm-img">
							<image src="/static/images/personal/yuangoguanli.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							员工管理
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/shop/invite')">
						<view class="cm-img">
							<image src="/static/images/personal/yaoqingdiazhu.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							邀请店主
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/payment/offline')">
						<view class="flex justify-end" style="width: 90%;height: 0px;z-index: 1;">
							<u-badge style="height: fit-content;" :value="orderStatistics.pendingVoucherPaymentCount" />
						</view>
						<view class="cm-img">
							<image src="/static/images/personal/xainxiashoukuan.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							线下收款
						</view>
					</view>

					<view class="c-marnger" v-on:click="navClick('/pages/station/general')">
						<view class="cm-img">
							<image src="/static/images/personal/shezhizhoxin.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							设置中心
						</view>
					</view>

					<view class="c-marnger" v-on:click="invitePopupShow = true">
						<view class="cm-img">
							<image src="/static/images/personal/tuiguanhaibao.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							推广海报
						</view>
					</view>
					<view class="c-marnger" v-on:click="navClick('/pages/service/system')">
						<view class="cm-img">
							<image src="/static/images/personal/lianxikefu.png" mode="scaleToFill"></image>
						</view>
						<view class="cm-text">
							系统客服
						</view>
					</view>

				</view>
			</view>
		</view>

		<!-- 非店主账号显示简化的菜单列表 -->
		<view class="PB-foolter" style="margin-top: 0;" v-if="!isShopOwner">
			<view class="PBF-body">
				<view class="menu-list">
					<!-- 订单查询 -->
					<view class="menu-item" v-on:click="navClick('/pages/order/printedOrders')">
						<view class="menu-left">
							<view class="menu-icon">
								<image src="/static/images/personal/dingdanchaxun.png" mode="scaleToFill"></image>
							</view>
							<view class="menu-name">订单查询</view>
						</view>
						<view class="menu-right">
							<view class="menu-arrow">
								<u-icon name="arrow-right" color="#999" size="20"></u-icon>
							</view>
						</view>
					</view>

					<!-- 派奖管理 -->
					<view class="menu-item" v-on:click="navClick('/pages/order/waitAward')" v-if="awardManagePermission">
						<view class="menu-left">
							<view class="menu-icon">
								<image src="/static/images/personal/paijiangguanli.png" mode="scaleToFill"></image>
							</view>
							<view class="menu-name">派奖管理</view>
						</view>
						<view class="menu-right">
							<view class="menu-arrow">
								<u-icon name="arrow-right" color="#999" size="20"></u-icon>
							</view>
						</view>
					</view>

					<!-- 用户管理 -->
					<view class="menu-item" v-on:click="navClick('/pages/user/person')" v-if="viewAllUserPermission">
						<view class="menu-left">
							<view class="menu-icon">
								<image src="/static/images/personal/yuangoguanli.png" mode="scaleToFill"></image>
							</view>
							<view class="menu-name">用户管理</view>
						</view>
						<view class="menu-right">
							<view class="menu-arrow">
								<u-icon name="arrow-right" color="#999" size="20"></u-icon>
							</view>
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
					<!-- 退出登录 -->
					<view class="menu-item" @click="logout">
						<view class="menu-left">
							<view class="menu-icon">
								<image src="/static/images/personal/logout.png" mode="scaleToFill"></image>
							</view>
							<view class="menu-name">退出登录</view>
						</view>
						<view class="menu-right">
							<view class="menu-arrow">
								<u-icon name="arrow-right" color="#999" size="20"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<nav-bottom :current="3"></nav-bottom>

		<invite-poster :show="invitePopupShow" @close="invitePopupShow = false" />
	</view>
</template>


<script>
import {
	logout,
	getUser
} from "@/api/user.js"
import {
	getUserInfo,
	setUserInfo,
	removeAuthtoken,
	removeUserInfo,
	removeExternalLogintoken
} from "@/util/auth.js"
import {
	getCurrentStoreInfo
} from "@/api/shop.js"
import {
	getPersonalCenterOrderStatistics
} from "@/api/user.js"
import {
	getPaymentOrderList
} from "@/api/payment.js"
import { getEmployeePermissions } from "@/api/employee.js"
export default {
	data() {
		return {
			user: {
				gold: 0,
				price: 0,
				isAgent: '1', // 默认为店主
				isAgentStr: '店主', // 默认为店主
				storeName: '',
			},
			storeInfo: {
				gold: 0,
				trusteeBalance: 0,
				name: '',
			},
			isShopOwner: false, // 是否店主账号
			isShow: false,
			showLogoutModal: false, // 控制退出登录弹窗的显示
			orderStatistics: {
				pendingTicketOrderCount: 0,//待出票订单数
				prizeDistributionOrderCount: 0,//派奖订单条数
				withdrawalOrderCount: 0,//提现订单条数
				pendingVoucherPaymentCount: 0,//未审核凭证支付数量
			},
			invitePopupShow: false,
			viewAllUserPermission: false,
			awardManagePermission: false,
			orderSoundEnabled: true, // 订单声音通知开关
		}
	},
	computed: {
		// 根据用户类型返回对应的文本
		getUserTypeText() {
			if (this.user.storeName) {
				return this.user.storeName
			}
			// 直接使用 isAgentStr 字段
			if (this.user.isAgentStr) {
				return this.user.isAgentStr;
			}

			// 如果 isAgentStr 不存在，则使用 isAgent 字段
			// isAgent: 0=普通用户, 1=店主, 2=销售
			switch (this.user.isAgent) {
				case '0':
					return '普通用户';
				case '1':
					return '店主';
				case '2':
					return '销售';
				case '3':
					return '店員';
				default:
					return '普通用户';
			}
		}
	},
	onShow() {
		this.init();
		// 从本地存储读取声音设置
		const savedSoundEnabled = uni.getStorageSync('orderSoundEnabled');
		if (savedSoundEnabled !== '') {
			this.orderSoundEnabled = savedSoundEnabled;
		}
	},
	methods: {
		// 获取个人中心订单统计
		getPersonalCenterOrderStatistics() {
			getPersonalCenterOrderStatistics().then(res => {
				this.orderStatistics.pendingTicketOrderCount = res.pendingTicketOrderCount;
				this.orderStatistics.prizeDistributionOrderCount = res.prizeDistributionOrderCount;
				this.orderStatistics.withdrawalOrderCount = res.withdrawalOrderCount;
			})
		},
		// 获取未审核凭证支付数量
		getPendingVoucherPaymentCount() {
			// 查询参数：只获取待审核(auditStatus=0)的凭证支付(payType=3)
			const queryParams = {
				pageNo: 1,
				pageSize: 10,
				payType: '3', // 凭证支付
				auditStatus: '0' // 待审核
			};

			getPaymentOrderList(queryParams).then(res => {
				// 更新未审核凭证支付数量
				this.orderStatistics.pendingVoucherPaymentCount = res.voList.reduce((prev, curr) => {
					return prev + Number(curr.auditStatus === "0")
				}, 0)
			}).catch(err => {
				console.error('获取未审核凭证支付数量失败:', err);
				this.orderStatistics.pendingVoucherPaymentCount = 0;
			});
		},
		// 处理用户信息
		processUserInfo() {
			// 根据用户类型设置是否为店主账号
			// isAgent: 0=普通用户, 1=店主, 2=销售
			this.isShopOwner = this.user.isAgent === '1';
		},
		rightText() {
			this.isShow = true;
		},
		init() {
			getUser().then(res => {
				if (res.status == "1") {
					this.logout();
				}
				setUserInfo(res);
				this.user = {
					...res,
					storeName: ''
				};

				// 处理用户信息，设置 isShopOwner
				this.processUserInfo();

				// 获取店铺信息
				getCurrentStoreInfo().then(storeRes => {
					this.storeInfo = storeRes;
					// // 更新店铺余额
					// this.user.gold = storeRes.gold || 0;
					// this.user.price = storeRes.trusteeBalance || 0;
					// this.user.storeName = storeRes.name;
					// console.log(storeRes.name)
				}).catch(err => {
					console.error('获取店铺信息失败:', err);
				});

				// 获取个人中心订单统计
				this.getPersonalCenterOrderStatistics();

				// 获取未审核凭证支付数量
				this.getPendingVoucherPaymentCount();

				if (this.user.isAgent == '3') {
					getEmployeePermissions().then(res => {
						this.viewAllUserPermission = res.viewAllUserPermission
						this.awardManagePermission = res.awardManagePermission
						console.log('xxx', res)
					})
				}
			})
		},
		navClick(url) {
			uni.navigateTo({
				url: url,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		navTap(url, type) {
			var obj = {};
			if (type == "0") {
				obj.title = "我的关注"
			} else {
				obj.title = "我的粉丝"
			}
			obj.type = type;
			uni.navigateTo({
				url: url + "?obj=" + encodeURIComponent(JSON.stringify(obj)),
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		// 显示退出登录弹窗
		logout() {
			this.showLogoutModal = true;
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
						this.btnDisabled = false;
						uni.hideLoading();
					}, 100)
				}
			}).catch(err => {
				console.error('退出登录失败:', err);
			})
		}
	}

}
</script>

<style lang="scss" scoped>
html,
body,
#app {
	height: 100%;
	width: 100%;
}

page-body,
#app {
	height: 100%;
}
.settings-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0rpx;
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
.personal-box {
	width: 100%;
	height: 100vh;
	padding-bottom: 100px;
	background: #eeeeee;

	.PB-head {
		width: 92%;
		padding-top: 40px;
		margin: auto;

		.PBH-top {
			font-size: 14px;
			color: #ffffff;
			padding: 15px 0;
			background-image: url(/static/images/personal/topbejin.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.PBHT-mag {
				display: flex;
				justify-content: space-between;

				.PBHT-right {
					display: flex;
					margin-left: 10px;

					.m-img {
						image {
							width: 50px;
							height: 50px;
							border-radius: 10px;
						}

					}

					.m-mag {
						margin-left: 10px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.mm-name {
							font-size: 18px;
							font-weight: bold;
						}

						.mm-n {
							color: #eeeeee;
						}

						.mm-allow {
							display: flex;
							color: #eeeeee;

							.mma-text {}

							.mma-img {}

						}

					}

				}

				.PBHT-left {}
			}

			.PBHT-money {
				margin-top: 10px;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.m-shopMoney {
					display: flex;
					flex-direction: column;
					align-items: center;

					.ms-money {
						font-size: 22px;
						font-weight: bold;
					}

					.ms-text {
						margin-top: 5px;
						display: flex;

						.mst-t {
							color: #eeeeee;
						}

						.mst-i {}

					}
				}

			}

		}

	}

	.PB-body {
		width: 100%;
		padding: 10px 0;
		font-size: 14px;
		background: #fff;

		.PBB-order {
			width: 100%;
			display: flex;
			justify-content: space-around;

			.PBBO-o {
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				.o-img {
					position: relative;

					image {
						width: 30px;
						height: 30px;
					}

					.badge {
						position: absolute;
						top: -8px;
						right: -8px;
						background-color: #ff0000;
						color: #ffffff;
						border-radius: 50%;
						width: 18px;
						height: 18px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						line-height: 1;
						padding: 0;
					}
				}

				.o-text {
					margin-top: 5px;
				}
			}

		}

	}

	.PB-foolter {
		width: 100%;
		margin-top: 10px;
		background: #ffffff;
		padding: 20rpx 0;

		.PBF-body {
			width: 90%;
			margin: auto;

			.PBFB-top {
				.top-text {
					font-size: 18px;
					font-weight: bold;
					color: #4a4a4a;
				}

			}

			.PBFB-center {
				display: flex;
				flex-wrap: wrap;
				align-content: space-between;

				.c-marnger {
					width: 25%;
					margin-top: 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
					position: relative;

					.cm-img {

						image {
							width: 25px;
							height: 25px;
						}

					}

					.cm-text {
						font-size: 14px;
					}

					.cm-switch {
						position: absolute;
						top: 50%;
						right: 10px;
						transform: translateY(-50%);
					}
				}

			}

			/* 非店主账号菜单样式 */
			.menu-list {
				width: 100%;

				.menu-item {
					height: 50px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1px solid #f5f5f5;

					.menu-left {
						display: flex;
						align-items: center;

						.menu-icon {
							width: 25px;
							height: 25px;
							margin-right: 10px;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.menu-name {
							font-size: 16px;
							color: #333;
						}
					}

					.menu-right {
						.menu-arrow {
							width: 15px;
							height: 15px;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}

		}

	}

}
</style>