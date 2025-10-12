<template>
	<!-- 底部导航栏 -->
	<view>
		<view>
			<cmd-bottom-nav background-color="#fff"
				font-color="#6a6a6a" active-font-color="var(--themeColor)" :current="actualCurrent" :list="tabBarList" text-auto
				@click="router">
			</cmd-bottom-nav>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBarList: [],
				isShopOwner: false, // 是否店主账号
				fullTabBarList: [{
					"pagePath": "pages/order/lotteryOrder",
					"text": "订单",
					"src": "../../static/tabbar/orders.png",
					"srcSelect": "../../static/tabbar/orders_active.png"
				},
				{
					"pagePath": "pages/user/users",
					"text": "用户",
					"src": "../../static/tabbar/users.png",
					"srcSelect": "../../static/tabbar/users_active.png"
				},
				{
					"pagePath": "pages/counts/statisticsMain",
					"text": "统计",
					"src": "../../static/tabbar/counts.png",
					"srcSelect": "../../static/tabbar/counts_active.png"
				}
				, {
					"pagePath": "pages/personal/personal",
					"text": "管理",
					"src": "../../static/tabbar/admin.png",
					"srcSelect": "../../static/tabbar/admin_active.png"
				}],
				// 非店主账号的索引映射表
				indexMap: {
					0: 0, // 订单 -> 订单
					1: -1, // 用户 -> 不存在
					2: 1, // 统计 -> 统计
					3: 2  // 管理 -> 管理
				}
			}
		},
		computed: {
			// 根据用户类型和当前索引计算实际的选中索引
			actualCurrent() {
				if (this.isShopOwner) {
					// 店主账号直接使用传入的索引
					return this.current;
				} else {
					// 非店主账号需要映射索引
					return this.indexMap[this.current] >= 0 ? this.indexMap[this.current] : 0;
				}
			}
		},
		created() {
			// 获取用户信息
			const userInfo = uni.getStorageSync("vue_userInfo");
			if (userInfo) {
				// 根据用户类型决定是否显示"用户"选项
				// isAgent: 0=普通用户, 1=店主, 2=销售
				this.isShopOwner = userInfo.isAgent === '1';

				if (this.isShopOwner) {
					// 店主账号显示全部选项
					this.tabBarList = this.fullTabBarList;
				} else {
					// 非店主账号不显示"用户"选项
					this.tabBarList = [
						this.fullTabBarList[0], // 订单
						this.fullTabBarList[2], // 统计
						this.fullTabBarList[3]  // 管理
					];
				}
			} else {
				// 默认显示全部选项
				this.tabBarList = this.fullTabBarList;
			}
		},
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		methods: {
			router(e) {
				uni.navigateTo({
					url: e.item.pagePath
				})
			}
		}
	}
</script>

<style>
</style>
