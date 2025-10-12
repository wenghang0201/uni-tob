<template>
	<view class="box">
		<nav-bar :title="pageTitle" :back="true"></nav-bar>

		<view class="container">
			<!-- 筛选区域 -->
			<view class="filter-section">
				<view class="date-filter">
					<uni-datetime-picker
						type="daterange"
						@change="dateChange"
						:max-date="maxDate"
						:value="[startDate, endDate]"
					/>
				</view>
			</view>

			<!-- 统计 -->
			<view class="stats-section" v-if="lotteryTypeList.length > 0">
				<view class="stats-item">
					<view class="stats-label">总金额</view>
					<view class="stats-value" v-if="state === '1'">￥{{ totalAmount }}</view>
					<view class="stats-value" v-if="state === '4'">￥{{ totalWinPrice }}</view>
				</view>
				<view class="stats-item">
					<view class="stats-label">总订单</view>
					<view class="stats-value">{{ totalOrders }}单</view>
				</view>
				<view class="stats-item">
					<view class="stats-label">彩种数</view>
					<view class="stats-value">{{ totalTypes }}种</view>
				</view>
			</view>

			<!-- 列表区域 -->
			<view class="list-section">
				<u-empty v-if="lotteryTypeList.length === 0" mode="data" icon="/static/nodata.png" text=" " />

				<view class="lottery-type-item" v-for="(item, index) in lotteryTypeList" :key="index" @click="goToOrderList(item.type)">
					<view class="lottery-info">
						<view class="lottery-name">
							<view class="lottery-icon">
								<u-icon :name="item.ballUrl || 'photo'" size="36" color="#2979ff"></u-icon>
							</view>
							<text>{{item.ballName}}</text>
						</view>
						<view class="lottery-stats">
							<view class="stat-item">
								<view class="stat-value">{{item.count}}单</view>
							</view>
							<view class="stat-item">
								<view class="stat-value" v-if="state === '1'">{{item.amount}}元</view>
								<view class="stat-value" v-if="state === '4'">{{item.winPrice}}元</view>
							</view>
							<view class="arrow-right">
								<u-icon name="arrow-right" color="#999" size="24"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<u-loadmore v-if="lotteryTypeList.length > 0" :status="loadStatus" />
		</view>
	</view>
</template>

<script>
import { lotteryOrderList } from '@/api/lotteryOrder';
import { formatDate } from '@/util/date';

export default {
	data() {
		return {
			// 日期筛选
			startDate: formatDate(new Date(), 'yyyy-MM-dd'),
			endDate: formatDate(new Date(), 'yyyy-MM-dd'),
			maxDate: formatDate(new Date(), 'yyyy-MM-dd'),

			// 分页参数
			queryParam: {
				pageNo: 1,
				pageSize: 10,
				startTime: '',
				endTime: '',
				stateList: []
			},

			// 订单状态
			state: '',

			// 彩种列表
			ballTypes: [
				{ name: '竞彩足球', type: '0' },
				{ name: '竞彩篮球', type: '1' },
				{ name: '北京单场', type: '2' },
				{ name: '排列三', type: '3' },
				{ name: '排列五', type: '4' },
				{ name: '七星彩', type: '5' },
				{ name: '胜负彩', type: '6' },
				{ name: '任选九', type: '7' },
				{ name: '大乐透', type: '8' },
				{ name: '双色球', type: '9' },
				{ name: '福彩3D', type: '10' },
				{ name: '快乐8', type: '11' },
				{ name: '七乐彩', type: '12' },
				{ name: '胜负过关', type: '13' },
			],

			// 数据列表
			lotteryTypeList: [],
			total: 0,
			loadStatus: 'loadmore',
			loading: false
		};
	},
	computed: {
		// 根据state参数设置页面标题
		pageTitle() {
			if (this.state === '1') {
				return '出票详情';
			} else if (this.state === '4') {
				return '派奖详情';
			} else {
				return '订单详情';
			}
		},
		// 计算总订单数
		totalOrders() {
			return this.lotteryTypeList.reduce((sum, item) => sum + parseInt(item.count || 0), 0);
		},
		// 计算总金额
		totalAmount() {
			return this.lotteryTypeList.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2);
		},
		// 计算总派奖金额
		totalWinPrice() {
			return this.lotteryTypeList.reduce((sum, item) => sum + parseFloat(item.winPrice || 0), 0).toFixed(2);
		},
		// 计算彩种数量
		totalTypes() {
			return this.lotteryTypeList.length;
		}
	},
	// 添加下拉刷新功能
	onPullDownRefresh() {
		// 重置分页参数
		this.queryParam.pageNo = 1;
		// 清空数据列表
		this.lotteryTypeList = [];
		// 重新加载数据
		this.loadLotteryTypeList();
		// 结束下拉刷新
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad(option) {
		// 获取传入参数
		if (option.state) {
			this.state = option.state;

			// 状态 -1全部;0->待接单;1->待开奖;2->未中奖;3->待派奖;4->已派奖;5->拒绝;6->退票;7->待出票
			// 根据state设置对应的查询条件
			if (this.state === '1') { // 出票
				// 设置已出票的查询条件
				this.queryParam.stateList = ['1', '2', '3', '4'];
				this.queryParam.timeFilterType = 2;
			} else if (this.state === '4') { // 派奖
				// 设置派奖的查询条件
				this.queryParam.stateList = ['4'];
				this.queryParam.timeFilterType = 3;
			}
		}

		// 从URL参数获取日期范围
		if (option.startTime) {
			this.startDate = option.startTime;
			this.queryParam.startTime = option.startTime;
		} else {
			this.queryParam.startTime = this.startDate;
		}

		if (option.endTime) {
			this.endDate = option.endTime;
			this.queryParam.endTime = option.endTime;
		} else {
			this.queryParam.endTime = this.endDate;
		}
		
		if (option.employeeId) {
			this.queryParam.employeeId = Number(option.employeeId);
		}

		// 加载数据
		this.loadLotteryTypeList();
	},
	methods: {
		// 日期选择回调
		dateChange(option) {
			if (option.length == 0) {
				this.startDate = formatDate(new Date(), 'yyyy-MM-dd');
				this.endDate = formatDate(new Date(), 'yyyy-MM-dd');
				this.queryParam.startTime = this.startDate;
				this.queryParam.endTime = this.endDate;
			} else {
				// 更新显示的日期
				this.startDate = option[0].split(' ')[0];
				this.endDate = option[1].split(' ')[0];

				// 更新查询参数
				this.queryParam.startTime = this.startDate;
				this.queryParam.endTime = this.endDate;
			}

			// 重置分页参数
			this.queryParam.pageNo = 1;

			// 重新加载数据
			this.lotteryTypeList = [];
			this.loadLotteryTypeList();
		},

		// 加载彩种列表数据
		async loadLotteryTypeList() {
			if (this.loading) return;

			this.loading = true;
			uni.showLoading({
				title: '加载中...'
			});

			try {
				// 清空现有数据
				this.lotteryTypeList = [];

				// 创建所有彩种请求的Promise数组
				const promises = this.ballTypes.map(ball => {
					return lotteryOrderList({
						...this.queryParam,
						typeList: [ball.type]
					}).then(res => {
						// 如果请求成功且有数据，返回处理后的彩种信息
						if (res.success && res.voList && res.voList.length > 0) {
							const ballUrl = res.voList[0].ballUrl || null;
							return {
								type: ball.type,
								ballName: ball.name,
								count: res.total,
								amount: res.price,
								ballUrl: ballUrl,
								winPrice: res.winPrice,
							};
						}
						// 如果没有数据，返回null
						return null;
					});
				});

				// 并行执行所有请求
				const results = await Promise.all(promises);

				// 过滤掉没有数据的彩种，并按照金额(price)从高到低排序
				this.lotteryTypeList = results
					.filter(item => item !== null)
					.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

				// 更新加载状态
				this.loadStatus = 'nomore';

			} catch (err) {
				uni.showToast({
					title: '网络异常，请稍后重试',
					icon: 'none'
				});
				console.error('加载彩种列表失败', err);
			} finally {
				uni.hideLoading();
				this.loading = false;
			}
		},

		// 跳转到订单列表页面
		goToOrderList(type) {
			// 构建URL参数
			const params = {
				type: type,
				startTime: this.queryParam.startTime,
				endTime: this.queryParam.endTime,
			};
			
			if (this.queryParam.employeeId) {
				params.employeeId = this.queryParam.employeeId
			}

			// 添加状态参数
			if (this.state) {
				params.state = this.state;
			}

			// 构建URL查询字符串
			const queryString = Object.entries(params)
				.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
				.join('&');

			uni.navigateTo({
				url: `/pages/order/orderList?${queryString}`,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},

		// 加载更多
		onReachBottom() {
			if (this.loadStatus !== 'nomore') {
				this.queryParam.pageNo++;
				this.loadLotteryTypeList();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.box {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.container {
	padding: 20rpx;
}

.filter-section {
	background-color: #fff;
	padding: 20rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.stats-section {
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	padding: 30rpx 20rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;

	.stats-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;

		.stats-label {
			font-size: 24rpx;
			color: #666;
			margin-bottom: 10rpx;
		}

		.stats-value {
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
		}
	}
}

.date-filter {
	.date-display {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10rpx 0;

		.date-text {
			font-size: 28rpx;
			color: #333;
		}
	}
}

::v-deep(.uni-datetime-picker--btn,)
::v-deep(.uni-calendar-item--after-checked,)
::v-deep(.uni-calendar-item--before-checked ){
	background: var(--themeColor) !important;
}

.list-section {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 10rpx;
}

.lottery-type-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 20rpx;
	border-bottom: 1px solid #f0f0f0;

	&:last-child {
		border-bottom: none;
	}

	.lottery-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		.lottery-name {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;

			.lottery-icon {
				margin-right: 20rpx;
			}
		}
	}

	.lottery-stats {
		display: flex;
		flex-direction: row;
		gap: 10rpx;
		align-items: center;

		.stat-item {
			text-align: center;

			.stat-value {
				font-size: 28rpx;
			}

			.stat-label {
				font-size: 24rpx;
				margin-top: 8rpx;
			}
		}
	}

	.arrow-right {
		display: flex;
		justify-content: flex-end;
		color: black
	}
}
</style>