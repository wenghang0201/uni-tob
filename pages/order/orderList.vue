<template>
	<view class="box">
		<nav-bar :title="pageTitle" :back="true"></nav-bar>
		
		<view class="container">
			<!-- 列表区域 -->
			<view class="order-list">
				<u-empty v-if="orderList.length === 0" mode="data" icon="/static/nodata.png" text=" "/>
				
				<view class="LBTL-list">
					<view class="LBTLL-ui" v-for="(item, index) in orderList" :key="index">
						<order-item 
							:item="item"
							:currentTime="currentTime"
							@details="goToOrderDetail"
							@accept-order="acceptOrder"
							@go-to-order-detail="goToOrderDetail"
						/>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<u-loadmore v-if="orderList.length > 0" :status="loadStatus" />
		</view>
	</view>
</template>

<script>
import { lotteryOrderList, getLotteryOrderById } from '@/api/lotteryOrder';
import { formatDate } from '@/util/date';
import OrderItem from '@/components/order-item/index.vue';

export default {
	components: {
		OrderItem
	},
	data() {
		return {
			// 彩种类型
			ballType: '',
			
			// 订单状态
			state: '',
			
			// 日期参数
			startDate: '',
			endDate: '',
			
			// 分页参数
			queryParam: {
				pageNo: 1,
				pageSize: 10,
				startTime: '',
				endTime: '',
				stateList: [],
				employeeId:null,
			},
			
			// 数据列表
			orderList: [],
			total: 0,
			loadStatus: 'loadmore',
			currentTime: Date.now(), // 添加当前时间戳用于倒计时
			timerId: null // 添加定时器ID
		};
	},
	computed: {
		// 根据状态生成页面标题
		pageTitle() {
			// 状态文字映射
			const stateTextMap = {
				'1': '出票',
				'4': '派奖',
			};
			
			// 获取状态文字
			const stateText = this.state && stateTextMap[this.state] ? stateTextMap[this.state] : '';
			
			// 如果有状态，显示「状态记录」格式
			if (stateText) {
				return `${stateText}记录`;
			}
			// 默认显示
			else {
				return '订单列表';
			}
		}
	},
	mounted() {
		// 启动定时器，每秒更新当前时间戳
		this.startTimer();
	},
	beforeDestroy() {
		// 组件销毁前清除定时器
		this.clearTimer();
	},
	onLoad(option) {
		// 所有URL参数是必须的，直接使用
		
		// 设置彩种类型
		this.ballType = option.type || '';
		
		// 设置时间范围
		this.startDate = option.startTime || '';
		this.queryParam.startTime = option.startTime || '';
		
		this.endDate = option.endTime || '';
		this.queryParam.endTime = option.endTime || '';
		this.queryParam.employeeId = option.employeeId || undefined;
		
		// 设置状态条件 - 使用stateList数组
		if (option.state) {
			this.state = option.state; // 保存状态值用于显示标题

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
		
		// 加载订单列表
		this.loadOrderList();
	},
	methods: {
		// 获取页面URL参数
		getPageUrlParams() {
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			return currentPage.options || {};
		},
		
		// 加载订单列表
		loadOrderList() {
			uni.showLoading({
				title: '加载中...'
			});
			
			// 直接使用URL参数构建查询条件
			const urlParams = this.getPageUrlParams();
			
			// 根据接口文档构建查询参数
			const queryParams = {
				...this.queryParam,
				pageNo: this.queryParam.pageNo,
				pageSize: this.queryParam.pageSize,
				startTime: this.startDate,
				endTime: this.endDate
			};
			
			// 处理彩种类型参数
			if (this.ballType) {
				// typeList 需要数字类型的数组
				queryParams.typeList = [this.ballType];
			}
			
			// 处理状态参数 - 确保使用 stateList 数组参数
			if (!queryParams.stateList || queryParams.stateList.length === 0) {
				// 如果未设置状态参数，尝试从URL获取
				if (urlParams.state) {
					queryParams.stateList = [urlParams.state];
				}
			}
			
			lotteryOrderList(queryParams).then(res => {
				uni.hideLoading();
				
				if (res.success) {
					if (this.queryParam.pageNo === 1) {
						this.orderList = res.voList || [];
					} else {
						this.orderList = [...this.orderList, ...(res.voList || [])];
					}
					
					this.total = res.total || 0;
					
					// 更新加载状态
					if (this.orderList.length >= this.total) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
					
					// 更新当前时间戳
					this.currentTime = Date.now();
				} else {
					uni.showToast({
						title: res.errorMsg || '加载失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				uni.hideLoading();
				uni.showToast({
					title: '网络异常，请稍后重试',
					icon: 'none'
				});
				console.error('加载订单列表失败', err);
			});
		},
		
		// 接单处理
		acceptOrder(item) {
			uni.showModal({
				title: '确认接单',
				content: `确认接单：${item.orderId || item.id}？`,
				success: res => {
					if (res.confirm) {
						uni.showLoading({
							title: '处理中...'
						});
						
						// 接单API
						// 这里需要添加实际的接单API调用，参考lotteryOrder.vue中的实现
						
						// 模拟接单成功
						// setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '接单成功',
								icon: 'success'
							});
							
							// 刷新列表
							this.queryParam.pageNo = 1;
							this.orderList = [];
							this.loadOrderList();
						// }, 1000);
					}
				}
			});
		},
		
		// 跳转到订单详情
		goToOrderDetail(id, hasGroupPurchase) {
			uni.navigateTo({
				url: `/pages/order/lotteryOrderDetails?id=${id || 0}&hasGroupPurchase=${hasGroupPurchase || 0}`,
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		
		// 启动定时器，每秒更新当前时间戳
		startTimer() {
			this.timerId = setInterval(() => {
				this.currentTime = Date.now();
			}, 1000);
		},
		
		// 清除定时器
		clearTimer() {
			clearInterval(this.timerId);
		},
		
		// 加载更多
		onReachBottom() {
			if (this.loadStatus !== 'nomore') {
				this.queryParam.pageNo++;
				this.loadOrderList();
			}
		},
		
		// 添加下拉刷新功能
		onPullDownRefresh() {
			// 重置分页参数
			this.queryParam.pageNo = 1;
			// 清空数据列表
			this.orderList = [];
			// 重新加载数据
			this.loadOrderList();
			// 结束下拉刷新
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
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
	padding: 20rpx 0;
}

.order-list {
	margin-bottom: 20rpx;
}

// 添加与order-item兼容的列表样式
.LBTL-list {
	width: 100%;
	font-size: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;

	.LBTLL-ui {
		width: 100%;
	}
}
</style> 