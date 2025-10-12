<template>
	<view class="store-balance-page">
		<!-- 顶部导航栏 -->
		<view class="nav-header">
			<view class="nav-left">
				<view class="back-btn" @click="goBack">
					<u-icon name="arrow-left" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="nav-center">
				<view class="nav-title">店铺余额</view>
			</view>
			<view class="nav-right">
				<view class="account-details" @click="goToAccountDetails">
					<text>账户明细</text>
				</view>
			</view>
		</view>

		<!-- 余额卡片区域 -->
		<view class="balance-card">
			<view class="card-content">
				<view class="balance-title">当前余额</view>
				<view class="balance-amount">¥{{balanceAmount}}</view>
				<view class="action-buttons">
					<view class="btn btn-recharge" @click="handleRecharge">
						<text>充值</text>
					</view>
					<view class="btn btn-withdraw" @click="handleWithdraw">
						<text>提现</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 交易记录区域 -->
		<view class="transaction-section" v-if="false">
			<view class="section-header">
				<text class="section-title">交易记录</text>
				<view class="section-more" @click="viewAllTransactions">
					<text>查看更多</text>
					<u-icon name="arrow-right" size="12" color="#666"></u-icon>
				</view>
			</view>
			
			<view class="transaction-list">
				<view v-for="(item, index) in transactionList" :key="index" class="transaction-item" @click="viewTransactionDetail(item)">
					<view class="transaction-left">
						<view class="transaction-icon">
							<u-icon :name="item.icon" size="20" :color="item.iconColor"></u-icon>
						</view>
						<view class="transaction-info">
							<text class="transaction-title">{{item.title}}</text>
							<text class="transaction-time">{{item.time}}</text>
						</view>
					</view>
					<view class="transaction-right">
						<text class="transaction-amount" :class="item.amountClass">{{item.amount}}</text>
						<text class="transaction-status" :class="item.statusClass">{{item.status}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getCurrentStoreInfo
} from "@/api/shop.js"

export default {
		data() {
			return {
				balanceAmount: '0.00',
				transactionList: [
					{
						title: '充值',
						time: '2024-01-15 14:30',
						amount: '+100.00',
						status: '成功',
						icon: 'rmb-circle',
						iconColor: '#007AFF',
						amountClass: 'amount-positive',
						statusClass: 'status-success'
					},
					{
						title: '提现',
						time: '2024-01-14 16:20',
						amount: '-50.00',
						status: '处理中',
						icon: 'arrow-down',
						iconColor: '#FF6B6B',
						amountClass: 'amount-negative',
						statusClass: 'status-pending'
					},
					{
						title: '充值',
						time: '2024-01-13 09:15',
						amount: '+200.00',
						status: '成功',
						icon: 'rmb-circle',
						iconColor: '#007AFF',
						amountClass: 'amount-positive',
						statusClass: 'status-success'
					}
				]
			}
		},
		onLoad() {
			this.getBalanceInfo();
		},
		onShow() {
			// 每次显示页面时刷新余额
			this.getBalanceInfo();
		},
		methods: {
			// 获取余额信息
			getBalanceInfo() {
				getCurrentStoreInfo().then(res => {
					// 更新店铺余额
					this.balanceAmount = res.gold || 0;
					console.log('获取店铺余额成功:', res.gold);
				}).catch(err => {
					console.error('获取店铺余额失败:', err);
					this.balanceAmount = '0.00';
				});
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 跳转到账户明细
			goToAccountDetails() {
				uni.navigateTo({
					url: '/pages/shop/shopCounts'
				});
			},
			
			// 处理充值
			handleRecharge() {
				// if(true){
				// 	uni.showToast({ title: '暂未开放', icon: 'none' });
				// 	return;
				// }
				uni.navigateTo({
					url: '/pages/personal/recharge'
				});
			},
			
			// 处理提现
			handleWithdraw() {
				// if(true){
				// 	uni.showToast({ title: '暂未开放', icon: 'none' });
				// 	return;
				// }
				uni.navigateTo({
					url: '/pages/personal/withdrawal'
				});
			},
			
			// 查看所有交易记录
			viewAllTransactions() {
				uni.navigateTo({
					url: '/pages/personal/transactionRecords'
				});
			},
			
			// 查看交易详情
			viewTransactionDetail(item) {
				console.log('查看交易详情:', item);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.store-balance-page {
		min-height: 100vh;
		background: #f5f5f5;
		
		.nav-header {
			display: flex;
			align-items: center;
			padding: 20upx 0;
			background: #ffffff;
			border-bottom: 1px solid #f0f0f0;
			
			.nav-left {
				width: 30%;
				display: flex;
				align-items: center;
				padding-left: 30upx;
				
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
					font-size: 36upx;
					font-weight: bold;
					color: #333;
				}
			}
			
			.nav-right {
				width: 30%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-right: 30upx;
				
				.account-details {
					display: flex;
					align-items: center;
					
					text {
						font-size: 28upx;
						color: #007AFF;
					}
				}
			}
		}
		
		.balance-card {
			margin: 30upx;
			background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
			border-radius: 25upx;
			overflow: hidden;
			box-shadow: 0 8upx 30upx rgba(0, 122, 255, 0.3);
			
			.card-content {
				padding: 50upx 40upx;
				color: #ffffff;
				
				.balance-title {
					font-size: 28upx;
					opacity: 0.9;
					margin-bottom: 20upx;
				}
				
				.balance-amount {
					font-size: 72upx;
					font-weight: bold;
					margin-bottom: 50upx;
				}
				
				.action-buttons {
					display: flex;
					gap: 30upx;
					
					.btn {
						flex: 1;
						height: 80upx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 20upx;
						font-size: 32upx;
						font-weight: bold;
						transition: all 0.3s ease;
						
						&:active {
							transform: scale(0.98);
						}
					}
					
					.btn-recharge {
						background: #ffffff;
						color: #007AFF;
					}
					
					.btn-withdraw {
						background: transparent;
						color: #ffffff;
						border: 2upx solid #ffffff;
					}
				}
			}
		}
		
		.transaction-section {
			margin: 30upx;
			background: #ffffff;
			border-radius: 20upx;
			padding: 30upx;
			
			.section-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30upx;
				
				.section-title {
					font-size: 32upx;
					font-weight: bold;
					color: #333;
				}
				
				.section-more {
					display: flex;
					align-items: center;
					gap: 10upx;
					
					text {
						font-size: 26upx;
						color: #666;
					}
				}
			}
			
			.transaction-list {
				.transaction-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 25upx 0;
					border-bottom: 1px solid #f0f0f0;
					
					&:last-child {
						border-bottom: none;
					}
					
					.transaction-left {
						display: flex;
						align-items: center;
						flex: 1;
						
						.transaction-icon {
							width: 60upx;
							height: 60upx;
							background: #f8f9fa;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 20upx;
						}
						
						.transaction-info {
							display: flex;
							flex-direction: column;
							gap: 8upx;
							
							.transaction-title {
								font-size: 28upx;
								color: #333;
								font-weight: bold;
							}
							
							.transaction-time {
								font-size: 24upx;
								color: #999;
							}
						}
					}
					
					.transaction-right {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						gap: 8upx;
						
						.transaction-amount {
							font-size: 28upx;
							font-weight: bold;
							
							&.amount-positive {
								color: #007AFF;
							}
							
							&.amount-negative {
								color: #FF6B6B;
							}
						}
						
						.transaction-status {
							font-size: 24upx;
							
							&.status-success {
								color: #52c41a;
							}
							
							&.status-pending {
								color: #faad14;
							}
						}
					}
				}
			}
		}
	}
</style> 