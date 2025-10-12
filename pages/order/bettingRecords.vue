<template>
	<view class="box" style="padding-bottom: 0;">
		<nav-bar :title="'投注记录'" :back="true"></nav-bar>

		<u-sticky bgColor="#fff">
			<!-- 页签切换 -->
			<u-tabs
				:list="tabList"
				:current="currentTab"
				@click="onTabChange"
				:scrollable="false"
			/>

			<!-- 日期选择器 -->
			<uni-datetime-picker
				type="daterange"
				:value="dateRange"
				@change="onDateRangeChange"
				:clear-icon="false"
				class="p-20 pb-0"
				style="box-sizing: border-box;"
			/>
		</u-sticky>

		<!-- 投注记录列表 -->
		<u-list
			@scrolltolower="loadMore"
			@refresh="onRefresh"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			class="betting-list"
		>
			<u-list-item v-for="(item, index) in list" :key="index">
				<view class="record-item"
					:style="[
						{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' },
						{ 'box-shadow': '1px 4px 10px rgba(0, 0, 0, 0.1)' }
					]"
					@click="goToOrderDetail(item)">

					<!-- Left Section: Icon + Name -->
					<view class="left-section">
						<image :src="getGameIcon(item)" mode="aspectFit" class="game-icon"></image>
						<text class="ball-name">{{ item.ballName }}</text>
					</view>

					<!-- Right Section: Details -->
					<view class="right-section">
						<!-- Top Row: Status + Tags -->
						<view class="top-row">
							<text :class="getStatusClass(item.state)" class="status-text">
								{{ getStatusText(item) }}
								<text v-if="item.winPrice > 0" class="win-price">￥{{ item.winPrice }}元</text>
							</text>
							<!-- Tags Container -->
							<view class="tags-container">
								<u-tag v-if="item.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
								<u-tag v-if="item.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
								<u-tag v-if="item.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
							</view>
						</view>

						<!-- Middle Row: Time + Amount -->
						<view class="middle-row">
							<text class="create-time">{{ item.createTime }}</text>
							<text v-if="item.price" class="order-amount">
								订单<text class="amount-value">{{ item.price }}</text>元
							</text>
						</view>

						<!-- Bottom Row: Order ID + User Info -->
						<view class="bottom-row">
							<text class="order-id">订单编号: {{ item.orderId }}</text>
							<text v-if="item.storeRemark || item.nickname" class="user-name">
								{{ item.storeRemark || item.nickname }}
							</text>
						</view>
					</view>
				</view>
			</u-list-item>

			<!-- 空状态 -->
			<u-empty v-if="list.length === 0" mode="list" icon="/static/nodata.png"></u-empty>
		</u-list>
	</view>
</template>

<script>
import { lotteryOrderList } from '@/api/lotteryOrder.js'

export default {
	data() {
		return {
			uid: '',
			salespersonId: '',
			param: '',
			list: [],
			dateRange: [],
			isRefreshing: false,
			loading: false,
			pageNo: 1,
			pageSize: 10,
			total: 0,
			// 页签相关
			currentTab: 0,
			tabList: [
				{ name: '全部' },
				{ name: '合买' }
			]
		}
	},
	onLoad(options) {
		if (options.uid) {
			this.uid = options.uid
		}
		if (options.salespersonId) {
			this.salespersonId = options.salespersonId
		}
		if (options.param) {
			this.param = options.param
		}
		this.loadData()
	},
	methods: {
		loadData() {
			if (this.loading) return
			this.loading = true

			// 根据新API接口构建参数
			const params = {
				pageNo: this.pageNo,
				pageSize: this.pageSize
			}

			// 添加日期范围
			if (this.dateRange.length === 2) {
				params.startTime = `${this.dateRange[0]} 00:00:00`
				params.endTime = `${this.dateRange[1]} 23:59:59`
				params.timeFilterType = 1 // 1-创建时间
			}

			// 添加用户信息
			if (this.uid) {
				params.userId = parseInt(this.uid)
			}

			// 添加 specialType 参数
			// 0: 全部, 1: 跟单, 2: 合买
			if (this.currentTab === 0) {
				params.specialType = 0 // 全部
			} else if (this.currentTab === 1) {
				params.specialType = 2 // 合买
			}

			console.log('当前页签:', this.currentTab, '参数:', params)

			this.fetchBettingList(params)
		},

		fetchBettingList(params) {
			console.log('请求投注记录参数:', params)
			params.sortRules = "desc";
			lotteryOrderList(params).then(res => {
				this.loading = false
				this.isRefreshing = false
				console.log('投注记录返回:', res)
				if (res.success) {
					if (this.pageNo === 1) {
						this.list = res.voList || []
					} else {
						this.list = [...this.list, ...(res.voList || [])]
					}
					this.total = res.total || 0
				} else {
					uni.showToast({
						title: res.errorMsg || '获取数据失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				this.loading = false
				this.isRefreshing = false
				console.error('获取投注记录失败:', err)
				uni.showToast({
					title: '网络异常，请稍后重试',
					icon: 'none'
				})
			})
		},

		onDateRangeChange(option) {
			this.dateRange = option
			this.list = []
			this.pageNo = 1
			this.loadData()
		},

		onRefresh() {
			this.isRefreshing = true
			this.pageNo = 1
			this.loadData()
		},

		// 页签切换
		onTabChange(item) {
			// u-tabs 的 @click 事件传递的是一个对象，包含 index 属性
			console.log('页签切换:', item)
			this.currentTab = item.index
			this.list = []
			this.pageNo = 1
			this.loadData()
		},

		// 加载更多数据
		loadMore() {
			if (this.loading || this.list.length >= this.total) return
			this.pageNo++
			this.loadData()
		},

		// 获取游戏图标
		getGameIcon(item) {
			return item.ballUrl;
		},

		// 获取状态样式类
		getStatusClass(state) {
			switch (state) {
				case 0: return 'status-waiting'     // 待接单
				case 1: return 'status-pending'     // 待开奖
				case 2: return 'status-pending'     // 未中奖
				case 3: return 'status-to-award'    // 待派奖
				case 4: return 'status-awarded'     // 已派奖
				case 5: return 'status-cancelled'   // 拒绝
				case 6: return 'status-cancelled'   // 退票
				case 7: return 'status-pending'     // 待出票
				default: return 'status-pending'
			}
		},

		// 获取状态文本
		getStatusText(item) {
			// 优先使用 stateStr，如果没有则使用 statusDesc
			return item.stateStr || item.statusDesc || '未知状态'
		},

		// 跳转到订单详情
		goToOrderDetail(item) {
			if (item.id) {
				uni.navigateTo({
					url: `/pages/order/lotteryOrderDetails?id=${item.jointPurchaseId || item.id}&hasGroupPurchase=${item.hasGroupPurchase || 0}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.betting-list {
	// 移除固定高度设置
	height: auto !important;
}

.record-item {
	background-color: #ffffff;
	border-radius: 15rpx;
	margin-top: 20rpx;
	padding: 25rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-height: 185rpx;
	width: 700rpx;
	margin-left: auto;
	margin-right: auto;
}

/* Left Section: Icon + Name */
.left-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 20rpx;
	width: 88rpx;
	text-align: center;
}

.game-icon {
	width: 67rpx;
	height: 67rpx;
}

.ball-name {
	font-size: 22rpx;
	color: #3b3b3b;
	font-weight: 600;
	margin-top: 8rpx;
}

/* Right Section: Details */
.right-section {
	flex: 1;
	display: flex;
	flex-direction: column;
}

/* Top Row: Status + Tags */
.top-row {
	display: flex;
	align-items: center;
	margin-bottom: 11rpx;
}

.status-text {
	font-size: 30rpx;
	font-weight: 600;
	line-height: 42rpx;
}

.win-price {
	color: #E83529;
}

.tags-container {
	display: flex;
	align-items: center;
	margin-left: 10rpx;
}

.tag {
	border-radius: 30rpx;
	width: 75rpx;
	height: 35rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 10rpx;
}

.tag-follow {
	background-color: #944ffa;
}

.tag-initiate {
	background-color: #FF6B6B;
}

.tag-text {
	font-size: 25rpx;
	color: #ffffff;
	font-weight: 600;
}

/* Middle Row: Time + Amount */
.middle-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 11rpx;
}

.create-time {
	font-size: 22rpx;
	color: #999999;
	font-weight: 400;
	line-height: 31rpx;
}

.order-amount {
	font-size: 22rpx;
	color: #999999;
	font-weight: 400;
	line-height: 31rpx;
}

.amount-value {
	color: var(--red1, #E83529);
}

/* Bottom Row: Order ID + User Info */
.bottom-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-id {
	font-size: 22rpx;
	color: #999999;
	font-weight: 400;
	line-height: 31rpx;
}

.user-name {
	font-size: 22rpx;
	color: #666666;
	font-weight: 400;
	line-height: 31rpx;
}

/* 状态样式 */
.status-pending {
	/* 未中奖、未开奖、待接单样式 */
	color: #3B3B3B;
}

.status-waiting {
	/* 待接单样式 */
	color: #3B3B3B;
}

.status-cancelled {
	/* 撤销样式 */
	color: #BDBFC0;
}

.status-to-award {
	/* 待派奖样式 */
	color: #E83529;
}

.status-awarded {
	/* 已派奖样式 */
	color: #E83529;
}

.status-buying {
	/* 认购中样式 */
	color: #FFA041;
}

/* 动画效果 */
@keyframes show {
	0% {
		opacity: 0;
		transform: translateY(20rpx);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 深度选择器样式 */
::v-deep.u-empty {
	margin-top: 30% !important;
}

::v-deep.uni-datetime-picker--btn,
::v-deep.uni-calendar-item--after-checked,
::v-deep.uni-calendar-item--before-checked {
	background: var(--themeColor) !important;
}
</style>