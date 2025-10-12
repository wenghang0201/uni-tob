<template>
	<!-- 购彩订单列表 -->
	<view class="flex flex-col min-h-100vh bgc-eee">

		<nav-bar :title="'待出票'" :back="true"></nav-bar>

		<view class="flex-1 overflow-y-auto">
			<view v-if="lotteryOrderList.length === 0" class="flex justify-center items-center h-full">
				<u-empty icon="/static/nodata.png" mode="order"
					text=" " />
			</view>
			<template v-else>
				<order-item
					v-for="(item, index) in lotteryOrderList"
					:key="index"
					:item="item"
					:currentTime="currentTime"
					@details="details"
					@accept-order="acceptOrder"
					@go-to-order-detail="goToOrderDetail"
					@paijiang="paijiang"
				/>

				<!-- 加载更多指示器 -->
				<view v-if="isLoadingMore" class="flex justify-center items-center py-8">
					<u-loading-icon mode="flower"></u-loading-icon>
					<text class="ml-4 c-999">加载更多...</text>
				</view>

				<!-- 没有更多数据提示 -->
				<view v-if="lotteryOrderList.length >= total && !isLoadingMore"
					  class="flex justify-center items-center py-8">
					<text class="c-aaa fs-24">没有更多数据了</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import {
		lotteryOrderList,
	} from '@/api/lotteryOrder.js'
	import {
		chupiaoOrder,
		paijiangOrder
	} from "@/api/user.js"
	import OrderItem from '@/components/order-item/index.vue'

	export default {
		components: {
			OrderItem
		},
		data() {
			return {
				currentTime: Date.now(), // 当前时间戳
				timerId: null, // 定时器ID
				isLoadingMore: false, // 是否正在加载更多
				//查询条件
				queryParam: {
					userId: "",
					stateList: ["0", "7"], // 待接单和待出票状态
					startTime: "",
					endTime: "",
					pageNo: 1,
					pageSize: 10
				},
				total: 0,
				//订单记录列表
				lotteryOrderList: []
			}
		},
		onPullDownRefresh() {
			this.queryParam.pageNo = 1; // 重置页码
			this.lotteryOrderList = []
			this.isLoadingMore = false; // 重置加载状态
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},

		onLoad(option) {
			if (option.uid != undefined) {
				this.queryParam.userId = option.uid;
			}
		},
		//滚动到底部进行分页事件
		onReachBottom() {
			// 防止重复加载
			if (this.isLoadingMore) {
				return;
			}

			// 检查是否还有更多数据
			if (this.lotteryOrderList.length >= this.total) {
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none',
					duration: 1500
				});
				return;
			}

			// 设置加载状态
			this.isLoadingMore = true;

			// 增加页码
			this.queryParam.pageNo++;

			// 显示加载提示
			uni.showLoading({ title: '加载更多...' });

			// 加载下一页数据
			this.loadMore();
		},
		onShow() {
			this.queryParam.pageNo = 1;
			this.lotteryOrderList = [];
			this.isLoadingMore = false; // 重置加载状态
			this.init();
		},
		onHide() {
			// 组件销毁前清除定时器
			this.clearTimer();
		},
		methods: {
			// 去订单详情页（用于接单按钮点击）- 保留此方法以兼容其他地方的调用
			goToOrderDetail(id, hasGroupPurchase) {
				console.log("goToOrderDetail",id, hasGroupPurchase)
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}` + "&fromAction=orderAccept",
					animationType: 'pop-in',
					animationDuration: 200
				})
			},

			// 直接接单（不跳转到详情页）
			acceptOrder(item) {
				// 用户点击确定，执行接单操作
				uni.showLoading({
					title: '接单中...'
				});

				// 调用接单API
				chupiaoOrder({
					'id': item.id,
					'state': "7"
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '接单成功！',
						icon: 'success'
					});

					this.goToOrderDetail(item.jointPurchaseId || item.id, item.hasGroupPurchase);
				}).catch(err => {
					console.error('接单失败:', err);
				});
			},

			paijiang(id){
				var str = '确认一键派奖?';
				if(id != 0){
					str = '确认派奖该订单: '+id+'?'
				}else{
					id = "";
				}
				uni.showModal({
				    title: '派奖',
				    content: str,
				    success: function (res) {
				        if (res.confirm) {
				            paijiangOrder({'id':id}).then(res => {
								if(res.success){
									uni.showToast({
										title: '操作成功！',
										icon: 'none'
									});
									setTimeout(function() {
										location.reload()
										}, 1000);
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				})
			},

			//点击卡片查询详情
			details(id, hasGroupPurchase) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},

			//初始化事件
			init() {
				uni.showLoading();
				lotteryOrderList(this.queryParam).then(res => {
					this.total = res.total;
					this.lotteryOrderList = [...this.lotteryOrderList, ...res.voList]
					uni.hideLoading();

					// 初始化加载完成后，检查是否需要启动定时器
					if (this.queryParam.stateList.includes('0')) {
						this.startTimer();
					} else {
						this.clearTimer();
					}
				})
			},

			// 加载更多数据
			loadMore() {
				lotteryOrderList(this.queryParam).then(res => {
					// 重置加载状态
					this.isLoadingMore = false;
					uni.hideLoading();

					if (res.success) {
						// 追加新数据到现有列表
						this.lotteryOrderList = [...this.lotteryOrderList, ...(res.voList || [])];

						// 更新总数（防止服务端数据变化）
						this.total = res.total;

						// 如果没有更多数据，显示提示
						if (res.voList && res.voList.length === 0) {
							uni.showToast({
								title: '没有更多数据了',
								icon: 'none',
								duration: 1500
							});
						} else {
							// 显示加载成功的反馈
							// uni.showToast({
							// 	title: `加载了 ${res.voList.length} 条数据`,
							// 	icon: 'none',
							// 	duration: 1000
							// });
						}
					} else {
						// 加载失败，页码回退
						this.queryParam.pageNo--;
						uni.showToast({
							title: `加载失败: ${res.errorMsg || '请重试'}`,
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(err => {
					// 网络错误，页码回退和重置状态
					this.isLoadingMore = false;
					this.queryParam.pageNo--;
					uni.hideLoading();
					console.error("加载更多出错:", err);
					uni.showToast({
						title: '网络错误，请重试',
						icon: 'none',
						duration: 2000
					});
				});
			},

			startTimer() {
				// 清除旧的定时器（以防万一）
				this.clearTimer();
				// 每秒更新一次当前时间
				this.timerId = setInterval(() => {
					this.currentTime = Date.now();
				}, 1000);
			},

			clearTimer() {
				if (this.timerId) {
					clearInterval(this.timerId);
					this.timerId = null;
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "@/style/tailwindcss.scss";

	::v-deep(.u-empty ){
		margin-top: 50% !important;
	}

	// 加载指示器样式
	.loading-indicator {
		padding: 20upx 0;
		text-align: center;
		color: #999;
		font-size: 28upx;
	}

	// 没有更多数据提示样式
	.no-more-data {
		padding: 20upx 0;
		text-align: center;
		color: #ccc;
		font-size: 24upx;
	}
</style>