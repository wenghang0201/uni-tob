<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'线下收款'" :back="true"></nav-bar>
		
		<!-- 标签页 -->
		<view class="tabs-container">
			<u-tabs :list="tabsList" lineColor="#2979ff" :current="currentTab" 
				:activeStyle="{color: '#2979ff', fontWeight: 'bold'}" 
				:inactiveStyle="{color: '#333'}" 
				:scrollable="false"
				:is-scroll="false"
				:item-style="{width: '33.333%', height: '80rpx', display: 'flex', alignItems: 'center', justifyContent: 'center'}"
				@change="onTabChange">
			</u-tabs>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 数据为空的状态 -->
			<view class="empty-container" v-if="paymentList.length === 0">
				<image class="empty-icon" src="/static/images/common/no-data.png" mode="aspectFit"></image>
				<text class="empty-text">暂无数据</text>
			</view>
			
			<!-- 有数据时的列表 -->
			<view class="payment-list" v-else>
				<view class="payment-item" v-for="(item, index) in paymentList" :key="index" @click="viewDetail(item)">
					<view class="payment-header">
						<text class="payment-phone">手机号: {{item.phone}}</text>
						<text class="payment-amount">¥{{item.price}}</text>
					</view>
					<view class="payment-info">
						<text class="payment-time">支付时间: {{item.createTime}}</text>
					</view>
					<!-- 操作按钮 (仅在待审核标签页显示) -->
					<view class="payment-actions" v-if="currentTab === 0">
						<button class="action-btn approve-btn" @click.stop="approvePayment(item.orderId)">审核通过</button>
						<button class="action-btn reject-btn" @click.stop="rejectPayment(item.orderId)">驳回</button>
					</view>
				</view>
				
				<!-- 底部提示 -->
				<view class="list-footer" v-if="paymentList.length > 0 && !hasMore">
					<text>没有更多了</text>
				</view>
				
				<!-- 加载更多提示 -->
				<view class="list-footer" v-if="paymentList.length > 0 && hasMore">
					<text>上拉加载更多</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getPaymentOrderList, auditVoucherPayment } from '@/api/payment.js'

export default {
	data() {
		return {
			currentTab: 0,
			tabsList: [
				{ name: '待审核' },
				{ name: '已审核' },
				{ name: '已驳回' }
			],
			paymentList: [], // 当前显示的线下收款列表
			allPayments: [], // 存储所有获取到的支付数据
			queryParams: {
				pageNo: 1,
				pageSize: 10, // 增加每页数量，减少请求次数
				payType: '3', // 凭证支付
			},
			isLoading: false,
			hasMore: true, // 是否有更多数据
		}
	},
	onLoad() {
		this.loadPaymentList();
	},
	onPullDownRefresh() {
		this.refreshList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 500);
	},
	onReachBottom() {
		if (!this.isLoading && this.hasMore) {
			this.queryParams.pageNo++;
			this.loadMorePaymentList();
		}
	},
	methods: {
		// 切换标签页
		onTabChange(e) {
			this.currentTab = e.index !== undefined ? e.index : 0;
			// 在前端根据审核状态筛选数据
			this.filterPaymentsByStatus();
		},
		
		// 根据当前选中标签筛选数据
		filterPaymentsByStatus() {
			const auditStatus = String(this.currentTab);
			this.paymentList = this.allPayments.filter(item => item.auditStatus === auditStatus);
		},
		
		// 加载线下收款列表
		loadPaymentList() {
			this.isLoading = true;
			uni.showLoading({
				title: '加载中...'
			});
			
			// 使用API调用获取数据
			getPaymentOrderList(this.queryParams).then(res => {
				if (res.success) {
					if (res.voList && res.voList.length > 0) {
						// 有数据时使用API返回的数据
						this.allPayments = res.voList;
					} else {
						// 没有数据
						this.allPayments = [];
						console.log('API返回数据为空');
					}
					// 根据当前选中标签筛选数据
					this.filterPaymentsByStatus();
					// 判断是否还有更多数据
					this.hasMore = (res.voList && res.voList.length === this.queryParams.pageSize);
				} else {
					// API请求失败
					console.error('API请求失败', res.errorMsg);
					this.allPayments = [];
					this.filterPaymentsByStatus();
					this.hasMore = false;
					
					uni.showToast({
						title: res.errorMsg || '加载失败',
						icon: 'none'
					});
				}
				uni.hideLoading();
				this.isLoading = false;
			}).catch(err => {
				console.error('加载线下收款列表失败', err);
				this.allPayments = [];
				this.filterPaymentsByStatus();
				this.hasMore = false;
				
				this.isLoading = false;
			});
		},
		
		// 加载更多数据
		loadMorePaymentList() {
			if (!this.hasMore) return;
			
			this.isLoading = true;
			uni.showLoading({
				title: '加载更多...'
			});
			
			// 使用API调用获取更多数据
			getPaymentOrderList(this.queryParams).then(res => {
				if (res.success && res.voList) {
					if (res.voList.length > 0) {
						// 添加到所有支付数据缓存中
						this.allPayments = [...this.allPayments, ...res.voList];
						// 重新筛选当前标签页需要的数据
						this.filterPaymentsByStatus();
						// 判断是否还有更多数据
						this.hasMore = (res.voList.length === this.queryParams.pageSize);
					} else {
						this.hasMore = false;
					}
				} else {
					this.hasMore = false;
					uni.showToast({
						title: res.errorMsg || '没有更多数据',
						icon: 'none'
					});
				}
				uni.hideLoading();
				this.isLoading = false;
			}).catch(err => {
				console.error('加载更多线下收款列表失败', err);
				this.hasMore = false;
				this.isLoading = false;
			});
		},
		
		// 刷新列表
		refreshList() {
			this.queryParams.pageNo = 1;
			this.allPayments = [];
			this.paymentList = [];
			this.hasMore = true;
			this.loadPaymentList();
		},
		
		// 审核通过
		approvePayment(orderId) {
			uni.showModal({
				title: '审核通过',
				content: '确认通过此笔线下收款？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '处理中...'
						});
						
						// 调用审核API，approved=true表示通过
						auditVoucherPayment({
							orderId: orderId,
							approved: true,
							remark: '审核通过'
						}).then(res => {
							if (res.success) {
								// 更新项目的审核状态为"已审核"(1)，而不是删除
								const targetIndex = this.allPayments.findIndex(item => item.orderId === orderId);
								if (targetIndex !== -1) {
									this.allPayments[targetIndex].auditStatus = '1';
									// 重新筛选当前显示的列表
									this.filterPaymentsByStatus();
								}
								
								uni.showToast({
									title: '审核通过',
									icon: 'success'
								});
							} else {
								uni.showToast({
									title: res.errorMsg || '操作失败',
									icon: 'none'
								});
							}
							uni.hideLoading();
						}).catch(err => {
							console.error('审核操作失败', err);
						});
					}
				}
			});
		},
		
		// 驳回支付
		rejectPayment(orderId) {
			uni.showModal({
				title: '驳回',
				content: '确认驳回此笔线下收款？',
				success: (res) => {
					if (res.confirm) {
						// 弹出输入框让用户输入驳回原因
						uni.showModal({
							title: '驳回原因',
							editable: true,
							placeholderText: '请输入驳回原因',
							success: (inputRes) => {
								if (inputRes.confirm) {
									uni.showLoading({
										title: '处理中...'
									});
									
									// 调用审核API，approved=false表示驳回
									auditVoucherPayment({
										orderId: orderId,
										approved: false,
										remark: inputRes.content || '审核驳回'
									}).then(res => {
										if (res.success) {
											// 更新项目的审核状态为"已驳回"(2)，而不是删除
											const targetIndex = this.allPayments.findIndex(item => item.orderId === orderId);
											if (targetIndex !== -1) {
												this.allPayments[targetIndex].auditStatus = '2';
												// 重新筛选当前显示的列表
												this.filterPaymentsByStatus();
											}
											
											uni.showToast({
												title: '已驳回',
												icon: 'success'
											});
										} else {
											uni.showToast({
												title: res.errorMsg || '操作失败',
												icon: 'none'
											});
										}
										uni.hideLoading();
									}).catch(err => {
										console.error('驳回操作失败', err);
									});
								}
							}
						});
					}
				}
			});
		},
		
		// 查看详情
		viewDetail(item) {
			// 跳转到详情页面并传递支付信息
			uni.navigateTo({
				url: '/pages/payment/detail?id=' + item.id,
				success: () => {
					// 将当前项保存到全局数据，方便详情页获取
					getApp().globalData = getApp().globalData || {};
					getApp().globalData.currentPaymentDetail = item;
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.tabs-container {
	background-color: #fff;
	position: sticky;
	top: 0;
	z-index: 10;
	border-bottom: 1px solid #f0f0f0;
}

.content-container {
	flex: 1;
	padding: 20rpx;
}

.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 160rpx;
	
	.empty-icon {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}
	
	.empty-text {
		color: #999;
		font-size: 28rpx;
	}
}

.payment-list {
	.payment-item {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding: 30rpx;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		
		.payment-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.payment-phone {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.payment-amount {
				font-size: 34rpx;
				font-weight: bold;
				color: #f00;
			}
		}
		
		.payment-info {
			margin-bottom: 20rpx;
			
			.payment-time {
				color: #666;
				font-size: 26rpx;
			}
		}
		
		.payment-actions {
			display: flex;
			justify-content: space-between;
			
			.action-btn {
				font-size: 26rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 30rpx;
				margin-left: 0;
				border-radius: 30rpx;
				flex: 1;
			}
			
			.approve-btn {
				background-color: #2979ff;
				color: #fff;
				margin-right: 20rpx;
			}
			
			.reject-btn {
				background-color: #fff;
				color: #666;
				border: 1px solid #ddd;
			}
		}
	}
	
	.list-footer {
		text-align: center;
		padding: 30rpx 0;
		color: #999;
		font-size: 24rpx;
	}
}
</style> 