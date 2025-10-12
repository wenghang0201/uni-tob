<template>
	<view class="box">
		<nav-bar :title="'彩种管理'" :back="true"></nav-bar>
		
		<view class="content-container">
			<view class="status-header">
				<text>玩法开启</text>
			</view>
			
			<view class="lottery-list" v-if="lotteryList.length > 0">
				<view class="lottery-item" v-for="(item, index) in lotteryList" :key="index" @click="goToLotteryDetail(item)">
					<view class="lottery-icon">
						<image :src="item.url || '/static/images/personal/caizhoguanli.png'" mode="scaleToFill"></image>
					</view>
					<view class="lottery-info">
						<view class="lottery-name">{{item.name}}</view>
						<view class="lottery-desc">
							<text class="status-label" :class="item.guessSwitch === 1 ? 'status-on' : 'status-off'">彩种{{item.guessSwitch === 1 ? '已开启' : '已关闭'}}</text>
							<text class="status-label" :class="item.line === '0' ? 'status-online' : 'status-offline'">{{item.line === '0' ? '已上线' : '已下线'}}</text>
							<text>最低投注{{item.minBetAmount || 2}}元</text>
							<text>停售前{{item.betDeadlineAdvance || 10}}分钟截止</text>
						</view>
					</view>
					<view class="lottery-status">
						<text class="status-badge" :class="{ 
							'status-badge-on': item.guessSwitch === 1,
							'status-badge-off': item.guessSwitch === 0
						}">
							{{(item.guessSwitch === 1) ? '已开启' : '已关闭'}}
						</text>
					</view>
					<view class="lottery-arrow">
						<image src="/static/images/personal/zuojianto.png" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
			
			<!-- 加载中 -->
			<view class="loading-container" v-if="isLoading">
				<u-loading-icon></u-loading-icon>
				<text>加载中...</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-container" v-if="!isLoading && lotteryList.length === 0">
				<image src="/static/images/empty.png" mode="aspectFit"></image>
				<text>暂无彩种信息</text>
			</view>
			
			<view class="footer-text">
				<text>说明：开启彩种后，您的店铺用户可以购买该彩种</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getLotteryList } from '@/api/lottery.js'
	import navBar from '@/components/nav-bar/nav-bar.vue'
	import uLoadingIcon from 'uview-ui/components/u-loading-icon/u-loading-icon.vue'
	
	export default {
		components: {
			navBar,
			uLoadingIcon
		},
		data() {
			return {
				lotteryList: [],
				isLoading: false
			}
		},
		onLoad() {
			this.loadLotteryList()
		},
		// 页面显示时重新加载数据，确保从详情页返回时更新列表
		onShow() {
			// 确保页面显示时刷新列表
			this.loadLotteryList();
		},
		// 支持下拉刷新
		onPullDownRefresh() {
			this.loadLotteryList(() => {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			// 加载彩种列表
			loadLotteryList(callback) {
				this.isLoading = true;
				
				getLotteryList().then(res => {
					this.isLoading = false;
					if (res.success) {
						this.lotteryList = res.voList.map(item => {
							const line = Number(item.line === '0')
							item.line = `${Number(!(item.guessSwitch === 1))}`
							item.guessSwitch = line
							return item
						}) || [];
					} else {
						uni.showToast({
							title: res.errorMsg || '获取彩种列表失败',
							icon: 'none'
						});
					}
					callback && callback();
				}).catch(err => {
					this.isLoading = false;
					console.error('获取彩种列表失败:', err);
					callback && callback();
				}).finally(() => {
					this.isLoading = false;
				});
			},
			
			// 跳转到彩种详情
			goToLotteryDetail(item) {
				// 只传递 ID 和 Name
				uni.navigateTo({
					url: `/pages/lottery/detail?id=${item.id}&name=${encodeURIComponent(item.name || '')}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f5f5f5;
	}
	
	.content-container {
		padding-bottom: 30rpx;
	}
	
	.status-header {
		padding: 20rpx 30rpx;
		background-color: #f5f5f5;
		color: #666;
		font-size: 28rpx;
	}
	
	.lottery-list {
		background: #fff;
		margin-bottom: 20rpx;
	}
	
	.lottery-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 24rpx 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}
	
	.lottery-icon {
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		
		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	
	.lottery-info {
		flex: 1;
		
		.lottery-name {
			font-size: 32rpx;
			font-weight: 500;
			color: #333;
			margin-bottom: 8rpx;
		}
		
		.lottery-desc {
			font-size: 24rpx;
			color: #999;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			
			text {
				margin-right: 16rpx;
				line-height: 1.5;
			}
			
			.status-label {
				padding: 2rpx 10rpx;
				border-radius: 4rpx;
				margin-right: 16rpx;
				font-size: 22rpx;
			}
			
			.status-on {
				background-color: rgba(59, 124, 255, 0.1);
				color: #3B7CFF;
			}
			
			.status-off {
				background-color: rgba(153, 153, 153, 0.1);
				color: #999;
			}
			
			.status-online {
				background-color: rgba(82, 196, 26, 0.1);
				color: #52C41A;
			}
			
			.status-offline {
				background-color: rgba(245, 34, 45, 0.1);
				color: #F5222D;
			}
		}
	}
	
	.lottery-status {
		margin-right: 20rpx;
		
		.status-badge {
			padding: 4rpx 12rpx;
			border-radius: 6rpx;
			font-size: 24rpx;
			color: #999;
			display: inline-block;
		}
		
		.status-badge-on {
			background-color: #e6f7ff;
			color: #3B7CFF;
		}
		
		.status-badge-off {
			background-color: #fff1f0;
			color: #F5222D;
		}
	}
	
	.lottery-arrow {
		image {
			width: 30rpx;
			height: 30rpx;
			transform: rotate(180deg);
		}
	}
	
	.footer-text {
		padding: 30rpx;
		text-align: center;
		color: #999;
		font-size: 24rpx;
	}
	
	.loading-container, .empty-container {
		padding: 100rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		text {
			margin-top: 20rpx;
			color: #999;
			font-size: 28rpx;
		}
	}
	
	.empty-container {
		image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 20rpx;
		}
	}
</style> 