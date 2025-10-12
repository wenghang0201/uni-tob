<template>
	<!-- 购彩订单列表 -->
	<view class="box bgc-eee min-h-100vh">
		<nav-bar :title="'待派奖'" :back="true"></nav-bar>

		<view class="px-10 pt-10 pb-120">
			<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length <= 0"
				mode="order" text="没有订单记录"></u-empty>

			<uni-card v-for="(item, index) in lotteryOrderList" :key="index" :border="false" class="card-animate"
				:extra="'订单' + item.price + '元'">
				<template slot="title">
					<view class="flex flex-row justify-between items-center pt-20">
						<view class="flex flex-row items-center">
							<u-checkbox v-if="item.winPrice + item.commissionPrice >= 10000" checked disabled shape="circle" />
							<u-checkbox v-else :checked="selectedOrders.includes(item.id)"
								@change="(value) => toggleSelect(item, value)" shape="circle" active-color="#FF3F43"
								class="mr-10"/>
							<u-icon :name="item.ballUrl" size="80rpx" class="mr-10"></u-icon>
							<view class="flex flex-col">
								<view class="flex flex-row items-center">
									<text class="fs-28 fw-500 mr-10">{{ item.ballName }}</text>
									<u-tag v-if="item.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
									<u-tag v-if="item.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
									<u-tag v-if="item.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
								</view>
								<text class="fs-24 c-666 mt-5">{{ item.createTime }}</text>
							</view>
						</view>
						<view class="flex flex-col text-right">
							<view class="flex items-center">
								<text class="fs-26 c-666">中奖金额：</text>
								<text class="fs-28 fw-600 c-theme">{{ item.winPrice }}</text>
							</view>
							<text class="fs-24 c-666 mt-5">{{ item.createTime }}</text>
						</view>
					</view>
				</template>
				<view class="flex flex-col gap-10">
					<view class="flex items-center">
						<text class="fs-26">订单编号：</text>
						<text class="c-666 fs-26">{{ item.orderId }}</text>
					</view>

					<view class="flex flex-row gap-10 justify-end">
						<u-tag v-if="item.winPrice + item.commissionPrice < 10000" plain text="派奖" size="medium" @click="paijiang(item.id, item.winPrice)" />
						<u-tag plain text="修改金额" size="medium" @click="details(item)" />
					</view>
				</view>
			</uni-card>

			<view class="fixed bottom-0 left-0 w-full h-100 bgc-fff" v-if="lotteryOrderList.length > 0">
				<view class="flex flex-row justify-between items-center px-20 py-10 border-t">
					<u-checkbox label="全选" :checked="isAllSelected" @change="toggleAllSelect" shape="circle"
						active-color="#FF3F43" />

					<view class="flex flex-row items-center">
						<view class="flex flex-row items-center text-nowrap mr-20">
							<text class="fs-28 c-666 mr-5">合计：</text>
							<text class="fs-32 fw-600 c-theme">{{ totalAmount }}元</text>
						</view>
						<u-button type="primary" text="派奖" :disabled="selectedOrders.length === 0"
							@click="batchPaijiang"></u-button>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import {
	lotteryOrderList,
} from '@/api/lotteryOrder.js'
import {
	deleteOrder,
	chupiaoOrder,
	paijiangOrderBatch,
	getUser
} from "@/api/user.js"
export default {
	data() {
		return {
			user: {},
			that: this,
			stating: 3,
			lassificationcList: [{
				name: '待出票',
				state: "0"
			}, {
				name: '待开奖',
				state: "1"
			}, {
				name: '未中奖',
				state: "2"
			}, {
				name: '待派奖',
				state: "3"
			}, {
				name: '已派奖',
				state: "4"
			}],
			//查询条件
			queryParam: {
				userId: "",
				state: "3",
				startTime: "",
				endTime: "",
				pageNo: 1,
				pageSize: 10
			},
			total: 0,
			//订单记录列表
			lotteryOrderList: [],
			// 多选相关
			selectedOrders: [], // 已选中的订单ID
			isAllSelected: false, // 是否全选
		}
	},
	onPullDownRefresh() {
		this.lotteryOrderList = []
		this.init();
		setTimeout(function () {
			uni.stopPullDownRefresh()
		}, 500);
	},
	filters: {
		//格式化日期
		formatDate(data, that) {
			return data
			// return that.globalUtil.dateTimeFormat(data)
		},
		//格式化状态
		formatState(data) {
			if (data == 0) {
				return "待出票";
			} else if (data == 1) {
				return "待开奖";
			} else if (data == 2) {
				return "未中奖";
			} else if (data == 3) {
				return "待派奖";
			} else if (data == 4) {
				return "已派奖";
			} else if (data == 5) {
				return "已拒绝";
			} else if (data == 6) {
				return "已退票";
			}
		}
	},
	onLoad(option) {
		if (option.uid != undefined) {
			this.queryParam.userId = option.uid;
		}
	},
	onShow() {
		// 页面显示时刷新数据
		this.lotteryOrderList = [];
		this.queryParam.pageNo = 1;
		this.init();
	},
	//滚动到底部进行分页事件
	onReachBottom() {
		if (this.lotteryOrderList.length < this.queryParam.pageNo * 10) {
			return;
		}
		this.queryParam.pageNo++;
		this.init();
	},
	computed: {
		// 计算选中订单的总金额
		totalAmount() {
			let total = 0;
			this.selectedOrders.forEach(id => {
				const order = this.lotteryOrderList.find(item => item.id === id);
				if (order) {
					total += parseFloat(order.winPrice) || 0;
				}
			});
			return total.toFixed(2);
		}
	},
	methods: {
		delOrder(id) {
			uni.showModal({
				title: '删除',
				content: '确认删除订单 : ' + id + ' ? ',
				success: function (res) {
					if (res.confirm) {
						deleteOrder({ 'orderId': id }).then(res => {
							if (res.success) {
								uni.showToast({
									title: '操作成功！',
									icon: 'none'
								});
								setTimeout(function () {
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

		paijiang(id, price) {
			var str = '确认一键派奖?';
			var title = '派奖';
			if (id != 0) {
				str = `派奖金额: ${price}元`
				title = '确认派奖金额';
			} else {
				id = "";
			}
			uni.showModal({
				title: title,
				content: str,
				success: function (res) {
					if (res.confirm) {
						// 支持多选派奖，id和winPrice都改为数组
						paijiangOrderBatch({
							awardList: [{
								'id': id,
								'winPrice': price
							}]
						}).then(res => {
							if (res.success) {
								uni.showToast({
									title: '操作成功！',
									icon: 'none'
								});
								setTimeout(function () {
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


		chupiao(id) {
			var str = '确认一键出票?';
			var state = "1";
			if (id != 0) {
				str = '确认出票该订单: ' + id + '?'
			} else {
				id = "";
				state = "";
			}
			uni.showModal({
				title: '出票',
				content: str,
				success: function (res) {
					if (res.confirm) {
						chupiaoOrder({ 'id': id, 'state': state }).then(res => {
							if (res.success) {
								uni.showToast({
									title: '操作成功！',
									icon: 'none'
								});
								setTimeout(function () {
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

		change(option) {
			this.queryParam.startTime = option[0];
			this.queryParam.endTime = option[1];
			this.lotteryOrderList = []
			this.init()
		},
		// tab切换事件
		changeSelectBall(item) {
			this.queryParam.pageNo = 1;
			this.lotteryOrderList = []
			this.queryParam.state = item.state
			this.stating = item.state
			this.init();
		},
		//点击卡片查询详情
		details(item) {
			uni.navigateTo({
				url: `/pages/order/lotteryOrderDetails?id=${item.jointPurchaseId || item.id}&hasGroupPurchase=${item.hasGroupPurchase || 0}`,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		// 切换单个订单的选中状态
		toggleSelect(item, value) {
			if (value) {
				// 添加到选中列表
				if (!this.selectedOrders.includes(item.id)) {
					this.selectedOrders.push(item.id);
				}
			} else {
				// 从选中列表移除
				const index = this.selectedOrders.indexOf(item.id);
				if (index !== -1) {
					this.selectedOrders.splice(index, 1);
				}
			}
			// 更新全选状态（只考虑奖励小于 10000 的订单）
			const selectableOrders = this.lotteryOrderList.filter(item => parseFloat(item.winPrice + item.commissionPrice) < 10000);
			this.isAllSelected = selectableOrders.length > 0 &&
				this.selectedOrders.length === selectableOrders.length;
		},

		// 切换全选状态
		toggleAllSelect(value) {
			this.isAllSelected = value;
			if (value) {
				// 全选，但过滤掉奖励大于等于 10000 的订单
				const allOrders = this.lotteryOrderList;
				const selectableOrders = allOrders.filter(item => parseFloat(item.winPrice + item.commissionPrice) < 10000);
				const filteredOrders = allOrders.filter(item => parseFloat(item.winPrice + item.commissionPrice) >= 10000);

				this.selectedOrders = selectableOrders.map(item => item.id);

				// 如果有被过滤的订单，显示提示
				if (filteredOrders.length > 0) {
					uni.showToast({
						title: `已过滤票面奖金金额 ≥ 10000 的订单`,
						icon: 'none',
						duration: 2000
					});
				}
			} else {
				// 取消全选
				this.selectedOrders = [];
			}
		},

		// 批量派奖
		batchPaijiang() {
			if (this.selectedOrders.length === 0) {
				uni.showToast({
					title: '请选择要派奖的订单',
					icon: 'none'
				});
				return;
			}

			// 获取选中订单的金额
			const selectedOrdersData = this.selectedOrders.map(id => {
				const order = this.lotteryOrderList.find(item => item.id === id);
				return {
					id: id,
					winPrice: order ? order.winPrice : 0
				};
			});

			uni.showModal({
				title: '批量派奖',
				content: `确认派奖 ${this.selectedOrders.length} 个订单，总金额: ${this.totalAmount}元?`,
				success: (res) => {
					if (res.confirm) {
						// 调用派奖接口
						paijiangOrderBatch({
							awardList: selectedOrdersData.map(item => ({
								id: item.id,
								winPrice: item.winPrice
							}))
						}).then(res => {
							if (res.success) {
								uni.showToast({
									title: '派奖成功！',
									icon: 'none'
								});
								// 重置选中状态
								this.selectedOrders = [];
								this.isAllSelected = false;
								// 刷新数据
								setTimeout(() => {
									this.lotteryOrderList = [];
									this.queryParam.pageNo = 1;
									this.init();
								}, 1000);
							}
						})
					}
				}
			});
		},

		//初始化事件
		init() {
			uni.showLoading();
			// getUser().then(res => {
			// 	if(res.status=="1"){
			// 		this.logout();
			// 	}
			// 	this.user = res
			// })
			lotteryOrderList(this.queryParam).then(res => {
				this.total = res.total;
				this.lotteryOrderList = [...this.lotteryOrderList, ...res.voList];
				// 重置选中状态
				this.selectedOrders = [];
				this.isAllSelected = false;
				uni.hideLoading();
			})
		}
	}
}
</script>

<style scoped lang="scss">
/* 主题色变量 */
:root {
	--theme-color: #FF3F43;
}

/* 主题色类 */
.c-theme {
	color: var(--theme-color);
}

.bgc-theme {
	background-color: var(--theme-color);
}

/* 卡片样式优化 */
::v-deep(.uni-card ){
	margin: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

::v-deep(.uni-card__header-extra-text ){
	font-size: 28rpx !important;
	color: var(--theme-color) !important;
	font-weight: 600;
}

/* 空状态优化 */
::v-deep(.u-empty ){
	margin-top: 40% !important;
}

/* 日期选择器主题色 */
::v-deep(.uni-datetime-picker--btn,)
::v-deep(.uni-calendar-item--after-checked,)
::v-deep(.uni-calendar-item--before-checked ){
	background: var(--theme-color) !important;
}

/* 卡片动画 */
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

.card-animate {
	animation: show 0.5s ease-out forwards;
}

/* 为每个卡片设置不同的延迟，创建级联效果 */
@for $i from 1 through 10 {
	.uni-card:nth-child(#{$i}) {
		animation-delay: #{$i * 0.1}s;
	}
}
</style>