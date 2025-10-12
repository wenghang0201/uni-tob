<template>
	<!-- 购彩订单列表 -->
	<view class="box">

		<nav-bar :title="'账户明细'" :back="true"></nav-bar>

		<u-sticky bgColor="#fff">
			<u-tabs :list="lassificationcList" lineColor="#FF3F43"
				:activeStyle="{ color: '#FF3F43', fontWeight: 'bold', transform: 'scale(1.05)' }"
				@click="changeSelectBall">
			</u-tabs>
			<uni-datetime-picker type="daterange" @change="change" :value="[queryParam.startTime, queryParam.endTime]"/>
			<view class="statistics-line" :style="{ color: sum > 0 ? 'blue' : (sum < 0 ? 'red' : '#333') }">
				统计：
				<text v-if="sum > 0">￥+{{ sum }}</text>
				<text v-else-if="sum < 0">￥-{{ Math.abs(sum) }}</text>
				<text v-else>￥{{ sum }}</text>
				元
			</view>
		</u-sticky>

		<view>
			<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length <= 0"
				mode="order" text="没有订单记录"></u-empty>

			<uni-card v-for="(item, index) in lotteryOrderList" :key="index" :border="false" :title="item.ballName"
				:style="[{ animation: 'show ' + ((index + 1) * 0.2 + 1) + 's 1' }]"
				:sub-title="item.createTime">

				<!-- 使用 Flexbox 优化布局 -->
				<view class="flex flex-col">
					<view class="flex justify-between gap-20">
						<span>{{ item.orderId }}</span>
						<span class="text-ellipsis text-right">{{ item.storeRemark || item.nickname }}</span>
					</view>
					<view class="flex justify-between gap-20">
						<span>{{
							item.typeStr
						}}</span>
						<span :style="{ color: item.price >= 0 ? 'blue' : 'red' }">￥{{ formatPrice(item.price) }}</span>
					</view>
					<view class="flex justify-between gap-20">
						<span>{{
							item.createTime
						}}</span>
						<div>
							<span v-if="item.afterValue != null" class="balance-info">余额: {{
								item.afterValue | formatBalance
							}}</span>
						</div>
					</view>
				</view>

			</uni-card>
		</view>
	</view>
</template>

<script>
import {
	getLotteryOrderPage,
	getMingXiOrders
} from '@/api/lotteryOrder.js'
import {
	deleteOrder,
	getUser
} from "@/api/user.js"
export default {
	data() {
		return {
			// 添加交易类型映射
			transactionTypeMap: {
				// 投注
				1: '下单竞彩足球', 2: '下单竞彩篮球', 3: '下单北京单场', 4: '下单排列3', 15: '下单排列5', 18: '下单七星彩', 21: '下单胜负彩', 24: '下单任选九', 27: '下单大乐透', 31: '下单双色球', 34: '下单福彩3D', 37: '下单快乐8', 40: '下单七乐彩',
				// 充值
				0: '充值', 99: '自动充值', 96: '手工加款',
				// 系统
				10: '竞彩足球退票', 11: '竞彩篮球退票', 12: '北京单场退票', 13: '排列3退票', 17: '排列5退票', 20: '七星彩退票', 23: '胜负彩退票', 26: '任选九退票', 29: '大乐透退票', 33: '双色球退票', 36: '福彩3D退票', 39: '快乐8退票', 42: '七乐彩退票', 97: '手工扣款',
				// 奖金
				6: '竞彩足球派奖', 7: '竞彩篮球派奖', 8: '北京单场派奖', 9: '排列3派奖', 16: '排列5派奖', 19: '七星彩派奖', 22: '胜负彩派奖', 25: '任选九派奖', 28: '大乐透派奖', 32: '双色球派奖', 35: '福彩3D派奖', 38: '快乐8派奖', 41: '七乐彩派奖',
				// 佣金
				14: '发单返佣金', 30: '销售返佣金',
				// 提现
				5: '提现', 98: '用户提现', 95: '提现失败退款',
				// 其他
				100: '合买失败退款'
			},
			sum: 0,
			user: {},
			that: this,
			lassificationcList: [
				{ name: '投注', state: "1" },
				{ name: '充值', state: "2" },
				{ name: '系统', state: "3" },
				{ name: '奖金', state: "4" },
				{ name: '加款', state: "7" },
				{ name: '扣款', state: "8" },
				{ name: '发单佣金', state: "9" },
				{ name: '代理佣金', state: "10" },
				// { name: '佣金', state: "5" },
				{ name: '提现', state: "6" },
			],
			stating: 1, // 仍然用于tab控制API查询类型
			//查询条件
			queryParam: {
				userId: "",
				type: "1", // API查询时仍按大类查询
				startTime: Date.now(),
				endTime: Date.now(),
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
		this.lotteryOrderList = []; // 清空列表
		this.sum = 0; // 重置总和
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
		// 添加格式化余额的过滤器
		formatBalance(value) {
			const num = parseFloat(value);
			return isNaN(num) ? '--' : num.toFixed(2);
		}
	},
	onLoad(option) {
		if (option.uid != undefined) {
			this.queryParam.userId = option.uid;
		}
		this.init();
	},
	//滚动到底部进行分页事件
	onReachBottom() {
		// 使用 total 判断是否还有更多数据
		if (this.lotteryOrderList.length >= this.total) {
			uni.showToast({ title: '没有更多数据了', icon: 'none' });
			return;
		}
		this.queryParam.pageNo++;
		this.init();
	},
	methods: {
		// 添加格式化交易类型的方法
		formatTransactionType(type) {
			return this.transactionTypeMap[type] || '未知类型'; // 如果映射中没有，显示'未知类型'
		},
		// 添加格式化价格显示的方法
		formatPrice(price) {
			const num = parseFloat(price) || 0;
			const fixedPrice = num.toFixed(2);
			return num > 0 ? `+${fixedPrice}` : fixedPrice;
		},
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
		change(option) {
			this.queryParam.startTime = option[0];
			this.queryParam.endTime = option[1];
			this.queryParam.pageNo = 1; // 重置页码
			this.lotteryOrderList = []; // 清空列表
			this.sum = 0; // 重置总和
			this.init()
		},
		// tab切换事件
		changeSelectBall(item) {
			this.queryParam.pageNo = 1; // 重置页码
			this.lotteryOrderList = []; // 清空列表
			this.sum = 0; // 重置总和
			this.queryParam.type = item.state
			this.stating = item.state
			this.init();
		},
		//点击卡片查询详情
		details(id) {
			uni.navigateTo({
				url: "/pages/order/lotteryOrderDetails?id=" + id,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//初始化事件
		init() {
			uni.showLoading();
			getMingXiOrders(this.queryParam).then(res => {
				this.total = res.total;

				// 更新列表数据
				// 如果是第一页，直接覆盖；否则追加
				if (this.queryParam.pageNo === 1) {
					this.lotteryOrderList = res.voList || [];
				} else {
					this.lotteryOrderList = [...this.lotteryOrderList, ...(res.voList || [])];
				}

				// 直接使用API返回的sumPrice作为总统计金额
				this.sum = parseFloat(res.sumPrice || 0).toFixed(2);

				uni.hideLoading();
			}).catch(err => {
				console.error("获取明细订单失败:", err);
			});
		}
	}
}
</script>

<style scoped lang="scss">
::v-deep(.uni-card__header-extra-text ){
	font-size: 14px !important;
	color: #FF3F43 !important;
}

.uni-body {
	color: #909399;
}

::v-deep(.u-empty ){
	margin-top: 50% !important;
}

::v-deep(.uni-datetime-picker--btn,)
::v-deep(.uni-calendar-item--after-checked,)
::v-deep(.uni-calendar-item--before-checked ){
	background: #FF3F43 !important;
}


.left {
	float: left;
}

/* 修改 .right 样式 */
.right {
	float: right;
	padding: 15upx;
	text-align: right;
	/* 右对齐 */
}

/* Flexbox 布局样式 */
.card-content {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	/* 顶部对齐，可以根据需要改为 center */
	padding: 10upx 0;
	/* 可选：给容器一些垂直内边距 */
}

.info-left {
	/* 左侧样式可以根据需要添加，例如限制宽度 */
	line-height: 1.4;
	/* 调整行高 */
}

.info-right {
	text-align: right;
	/* 确保右侧文本右对齐 */
	line-height: 1.4;
	/* 调整行高 */
	/* 移除 float 和旧的 padding */
}

.statistics-line {
	padding: 10upx;
	font-size: 28rpx; // 调整字体大小
}

/* 修改 .balance-info 样式 */
.balance-info {
	/* display: block; 移除 */
	font-size: 24rpx;
	/* 稍小字体 */
	color: #909399;
	/* 灰色 */
	/* margin-top: 5rpx; 移除，由父级行高控制 */
}

.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	/* 必须指定宽度 */
}
</style>