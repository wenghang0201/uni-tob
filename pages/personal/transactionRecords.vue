<template>
	<view class="transaction-records-page">
		<!-- 顶部导航栏 -->
		<view class="nav-header">
			<view class="nav-left">
				<view class="back-btn" @click="goBack">
					<u-icon name="arrow-left" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="nav-center">
				<view class="nav-title">交易记录</view>
			</view>
			<view class="nav-right">
				<!-- <view class="filter-btn" @click="showFilter">
					<u-icon name="filter" size="20" color="#333"></u-icon>
				</view> -->
			</view>
		</view>

		<!-- 筛选区域 -->
		<view class="filter-section" v-if="showFilterPanel">
			<view class="filter-row">
				<view class="filter-item" :class="{ active: selectedType === 'all' }" @click="selectType('all')">
					<text>全部</text>
				</view>
				<view class="filter-item" :class="{ active: selectedType === 'recharge' }" @click="selectType('recharge')">
					<text>充值</text>
				</view>
				<view class="filter-item" :class="{ active: selectedType === 'withdraw' }" @click="selectType('withdraw')">
					<text>提现</text>
				</view>
			</view>
		</view>

		<!-- 交易记录列表 -->
		<view class="transaction-list">
			<view v-for="(item, index) in filteredTransactionList" :key="index" class="transaction-item" @click="viewTransactionDetail(item)">
				<view class="transaction-left">
					<view class="transaction-icon" :style="{ backgroundColor: item.iconBgColor }">
						<u-icon :name="item.icon" size="20" :color="item.iconColor"></u-icon>
					</view>
					<view class="transaction-info">
						<view class="title-row">
							<text class="transaction-title">{{item.title}}</text>
							<text class="transaction-desc">({{item.description}})</text>
						</view>
						<text class="transaction-time">{{item.time}}</text>
						<view class="order-row">
							<text class="transaction-order">订单号：{{item.orderNo}}</text>
							<view class="copy-btn" @click.stop="copyOrderNo(item.orderNo)">
								<u-icon name="file-text" size="14" color="#999"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="transaction-right">
					<text class="transaction-amount" :class="item.amountClass">{{item.amount}}</text>
					<text class="transaction-status" :class="item.statusClass">{{item.status}}</text>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<view class="load-more" v-if="hasMore && !loading">
			<text class="load-text" @click="loadMore">加载更多</text>
		</view>
		
		<!-- 加载中状态 -->
		<view class="load-more" v-if="loading && pageNo > 1">
			<text class="load-text">加载中...</text>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="filteredTransactionList.length === 0">
			<u-icon name="file-text" size="80" color="#ccc"></u-icon>
			<text class="empty-text">暂无交易记录</text>
		</view>
		
		<!-- 底部占位，确保有足够的滚动空间 -->
		<view class="bottom-placeholder"></view>
	</view>
</template>

<script>
import {
	getShopOrderList
} from "@/api/shop.js"
	export default {
		data() {
			return {
				showFilterPanel: true,
				selectedType: 'all',
				hasMore: true,
				pageType: '', // 页面类型：recharge 或 withdraw
				transactionList: [],
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false
			}
		},
		computed: {
			filteredTransactionList() {
				if (this.selectedType === 'all') {
					return this.transactionList;
				}
				return this.transactionList.filter(item => item.type === this.selectedType);
			}
		},
		onShow() {
			// 根据页面类型设置标题
			if (this.pageType === 'recharge') {
				uni.setNavigationBarTitle({
					title: '充值记录'
				});
			} else if (this.pageType === 'withdraw') {
				uni.setNavigationBarTitle({
					title: '提现记录'
				});
			}
		},
		onLoad(options) {
			// 接收页面参数
			if (options.type) {
				this.pageType = options.type;
				this.selectedType = options.type;
			}
			this.getTransactionRecords();
		},
		onPullDownRefresh() {
			this.pageNo = 1;
			this.getTransactionRecords(false).finally(() => {
				uni.stopPullDownRefresh();
			});
		},
		onReachBottom() {
			console.log('触发onReachBottom');
			this.loadMore();
		},
		methods: {
					// 获取交易记录
		getTransactionRecords(isLoadMore = false) {
			if (this.loading) return Promise.resolve();
			
			this.loading = true;
			
			if (!isLoadMore) {
				uni.showLoading({
					title: '加载中...'
				});
			}
			
			const params = {
				pageNo: this.pageNo,
				pageSize: this.pageSize
			};
			
			// 根据选择的类型添加orderType参数
			if (this.selectedType === 'recharge') {
				params.orderType = 0; // 充值
			} else if (this.selectedType === 'withdraw') {
				params.orderType = 1; // 提现
			}
			// 全部类型不传orderType参数
			
			return getShopOrderList(params).then(res => {
				uni.hideLoading();
				this.loading = false;
				
				if (res.success && res.voList) {
					// 转换API数据为页面显示格式
					const newList = res.voList.map(item => {
						const isRecharge = item.orderType === 0;
						const isWithdraw = item.orderType === 1;
						
						// 根据auditStatus确定状态
						let status = '处理中';
						let statusClass = 'status-pending';
						if (item.auditStatus === '1') {
							status = '成功';
							statusClass = 'status-success';
						} else if (item.auditStatus === '2') {
							status = '失败';
							statusClass = 'status-failed';
						}
						
						// 根据订单类型设置图标和样式
						let icon = 'rmb-circle';
						let iconColor = '#ffffff';
						let iconBgColor = '#007AFF';
						let amountClass = 'amount-positive';
						let title = '充值';
						let type = 'recharge';
						
						if (isWithdraw) {
							icon = 'arrow-down';
							iconBgColor = '#FF6B6B';
							amountClass = 'amount-negative';
							title = '提现';
							type = 'withdraw';
						}
						
						// 格式化金额
						const amount = isRecharge ? `+${item.rechargeAmount}` : `${item.rechargeAmount}`;
						
						// 获取支付方式描述
						let description = '充值';
						if (isRecharge) {
							description = this.getPaymentMethodName(item.paymentType)+'充值';
						} else {
							description = this.getPaymentMethodName(item.paymentType)+'提现';
						}
						
						return {
							title: title,
							time: item.createTime,
							amount: amount,
							status: status,
							description: description,
							orderNo: item.rechargeId,
							icon: icon,
							iconColor: iconColor,
							iconBgColor: iconBgColor,
							amountClass: amountClass,
							statusClass: statusClass,
							type: type
						};
					});
					
					// 设置总数和分页状态
					this.total = res.total || 0;
					
					if (isLoadMore) {
						// 加载更多，追加到现有列表
						this.transactionList = [...this.transactionList, ...newList];
					} else {
						// 首次加载或刷新，替换列表
						this.transactionList = newList;
					}
					
					// 判断是否还有更多数据
					this.hasMore = this.transactionList.length < this.total;
					console.log('分页状态更新:', { 
						currentLength: this.transactionList.length, 
						total: this.total, 
						hasMore: this.hasMore,
						pageNo: this.pageNo
					});
				} else {
					if (!isLoadMore) {
						this.transactionList = [];
					}
					this.hasMore = false;
				}
			}).catch(err => {
				uni.hideLoading();
				this.loading = false;
				console.error('获取交易记录失败:', err);
				uni.showToast({
					title: '获取交易记录失败',
					icon: 'none'
				});
				return Promise.reject(err);
			});
		},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 显示筛选面板
			showFilter() {
				this.showFilterPanel = !this.showFilterPanel;
			},
			
			// 选择筛选类型
			selectType(type) {
				this.selectedType = type;
				// 切换筛选类型时重新加载数据
				this.pageNo = 1;
				this.getTransactionRecords(false);
			},
			
			// 查看交易详情
			viewTransactionDetail(item) {
				uni.showModal({
					title: '交易详情',
					content: `订单号：${item.orderNo}\n金额：${item.amount}\n状态：${item.status}\n时间：${item.time}\n描述：${item.description}`,
					showCancel: false
				});
			},
			
			// 复制订单号
			copyOrderNo(orderNo) {
				uni.setClipboardData({
					data: orderNo,
					success: () => {
						uni.showToast({
							title: '订单号已复制',
							icon: 'success',
							duration: 1500
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},
			
			// 加载更多
			loadMore() {
				console.log('loadMore被调用', { hasMore: this.hasMore, loading: this.loading, pageNo: this.pageNo });
				if (!this.hasMore || this.loading) return;
				
				this.pageNo++;
				this.getTransactionRecords(true);
			},
			
			// 根据channelId获取支付方式名称
			getPaymentMethodName(paymentType) {
				//支付方式 0 支付宝 1.微信 2.app 3.二维码 4银联
				const paymentTypes = {
					0: '支付宝',
					1: '微信',
					2: 'app',
					3: '二维码',
					4: '银行卡'
				};
				return paymentTypes[paymentType] || paymentType;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.transaction-records-page {
		min-height: calc(100vh + 200rpx);
		background: #f5f5f5;
		
		.nav-header {
			display: flex;
			align-items: center;
			padding: 20rpx 0;
			background: #ffffff;
			border-bottom: 1rpx solid #f0f0f0;
			
			.nav-left {
				width: 30%;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				
				.back-btn {
					display: flex;
					align-items: center;
				}
			}
			
			.nav-center {
				width: 40%;
				display: flex;
				justify-content: center;
				align-items: center;
				
				.nav-title {
					font-size: 36rpx;
					font-weight: bold;
					color: #333;
				}
			}
			
			.nav-right {
				width: 30%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-right: 30rpx;
				
				.filter-btn {
					display: flex;
					align-items: center;
				}
			}
		}
		
		.filter-section {
			background: #ffffff;
			padding: 20rpx 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			
			.filter-row {
				display: flex;
				gap: 20rpx;
				
				.filter-item {
					flex: 1;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #f8f9fa;
					border-radius: 30rpx;
					font-size: 28rpx;
					color: #666;
					transition: all 0.3s ease;
					
					&.active {
						background: #007AFF;
						color: #ffffff;
					}
				}
			}
		}
		
		.transaction-list {
			background: transparent;
			margin: 20rpx;
			
			.transaction-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.transaction-left {
					display: flex;
					align-items: center;
					flex: 1;
					min-width: 0;
					
					.transaction-icon {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 25rpx;
						flex-shrink: 0;
					}
					
														.transaction-info {
						display: flex;
						flex-direction: column;
						gap: 8rpx;
						flex: 1;
						
						.title-row {
							display: flex;
							align-items: baseline;
							gap: 8rpx;
						}
						
						.transaction-title {
							font-size: 30rpx;
							color: #333;
							font-weight: bold;
							flex-shrink: 0;
						}
						
						.transaction-desc {
							font-size: 22rpx;
							color: #999;
							flex-shrink: 1;
							min-width: 0;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						.transaction-time {
							font-size: 24rpx;
							color: #999;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
						
						.order-row {
							display: flex;
							align-items: center;
							gap: 8rpx;
						}
						
						.transaction-order {
							font-size: 22rpx;
							color: #999;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							flex: 1;
						}
						
						.copy-btn {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 32rpx;
							height: 32rpx;
							border-radius: 4rpx;
							background-color: rgba(0, 0, 0, 0.05);
							flex-shrink: 0;
							transition: background-color 0.2s ease;
							
							&:active {
								background-color: rgba(0, 0, 0, 0.1);
							}
						}
					}
				}
				
				.transaction-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 8rpx;
					flex-shrink: 0;
					min-width: 120rpx;
					
					.transaction-amount {
						font-size: 32rpx;
						font-weight: bold;
						
						&.amount-positive {
							color: #007AFF;
						}
						
						&.amount-negative {
							color: #FF6B6B;
						}
					}
					
					.transaction-status {
						font-size: 24rpx;
						
						&.status-success {
							color: #52c41a;
						}
						
						&.status-pending {
							color: #faad14;
						}
						
						&.status-failed {
							color: #ff4d4f;
						}
					}
				}
			}
		}
		
		.load-more {
			padding: 30rpx;
			text-align: center;
			
			.load-text {
				font-size: 28rpx;
				color: #007AFF;
				display: inline-block;
				padding: 10rpx 20rpx;
			}
		}
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 100rpx 0;
			min-height: 500rpx;
			
			.empty-text {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #999;
			}
		}
		
		.bottom-placeholder {
			height: 100rpx;
		}
	}
</style> 