<template>
	<view class="users">
		<!-- 顶部搜索栏 -->
		<view class="search-header">
			<view class="title">用户管理</view>
			<view class="search-icon" @click="goToSearch">
				<u-icon name="search" color="#333" size="28"></u-icon>
			</view>
		</view>

		<!-- 分类导航 -->
		<view class="category-list">
			<view class="category-item" @click="switchCategory('all')">
				<view class="category-icon">
					<u-icon name="account" color="var(--themeColor)" size="36"></u-icon>
				</view>
				<text class="category-text">全部用户</text>
			</view>
		</view>
		<view class="category-list">
			<view class="category-item" @click="switchCategory('apply')">
				<view class="category-icon">
					<u-icon name="file-text" color="var(--themeColor)" size="36"></u-icon>
				</view>
				<text class="category-text">申请进店</text>
			</view>
		</view>
		
		<!-- 星标用户 -->
		<view class="user-section">
			<view class="section-header">星标用户</view>
			<view class="user-list">
				<block v-if="starUsers.length > 0">
					<view class="user-item" v-for="(item, index) in starUsers" :key="'star-'+index" @click="goToUserDetail(item)">
						<view class="user-info">
							<image class="user-avatar" :src="item.avatar || '/static/images/personal/toxiang.png'"></image>
							<view class="user-detail">
								<view class="user-name">{{ item.storeRemark || item.nickname }}</view>
								<view class="user-order-info">{{ item.lastOrderInfo }}下单</view>
							</view>
						</view>
						<view class="user-balance">{{ item.balance.toFixed(2) }}</view>
					</view>
				</block>
				<view class="empty-tip" v-else>暂无星标用户</view>
			</view>
		</view>
		
		<!-- 下单用户 -->
		<view class="user-section">
			<view class="section-header">下单用户</view>
			<view class="user-list">
				<block v-if="orderUsers.length > 0">
					<view class="user-item" v-for="(item, index) in orderUsers" :key="'order-'+index" @click="goToUserDetail(item)">
						<view class="user-info">
							<image class="user-avatar" :src="item.avatar || '/static/images/personal/toxiang.png'"></image>
							<view class="user-detail">
								<view class="user-name">{{ item.storeRemark || item.nickname }}</view>
								<view class="user-order-info">{{ item.lastOrderInfo }}下单</view>
							</view>
						</view>
						<view class="user-balance">{{ item.balance.toFixed(2) }}</view>
					</view>
				</block>
				<view class="empty-tip" v-else>暂无下单用户</view>
			</view>
		</view>
		
		<!-- 底部加载更多 -->
		<view class="load-more" @click="loadMore" v-if="orderUsers.length > 0 && orderUsers.length < totalCount">加载更多</view>
		
		<nav-bottom :current="1"></nav-bottom>
	</view>
</template>

<script>
import { storeUserPage } from '@/api/user.js'

export default {
	data() {
		return {
			activeCategory: 'all',
			// 星标用户数据
			starUsers: [],
			// 下单用户数据
			orderUsers: [],
			totalCount: 0,
			//查询条件
			queryParam: {
				pageNo: 1,
				pageSize: 10,
				starUserFlag: 0,
				orderUserFlag: 0
			}
		};
	},
	onShow() {
		this.fetchStarUsers();
		this.fetchOrderUsers();
	},
	methods: {
		// 获取星标用户数据
		fetchStarUsers() {
			uni.showLoading({
				title: '加载中...'
			});
			
			const params = {
				pageNo: 1,
				pageSize: 10,
				starUserFlag: 1
			};
			
			storeUserPage(params).then(res => {
				if (res.success) {
					this.starUsers = this.formatUserData(res.voList);
					uni.hideLoading();
				}
			}).catch(() => {
			});
		},
		
		// 获取下单用户数据
		fetchOrderUsers() {
			uni.showLoading({
				title: '加载中...'
			});
			
			const params = {
				pageNo: 1,
				pageSize: 10,
				orderUserFlag: 1
			};
			
			storeUserPage(params).then(res => {
				if (res.success) {
					this.orderUsers = this.formatUserData(res.voList);
					this.totalCount = res.total || 0;
					uni.hideLoading();
				}
			}).catch(() => {
			});
		},

		// 格式化用户数据
		formatUserData(users) {
			return users.map(user => ({
				id: user.userId,
				nickname: user.nickname || '未知用户',
				storeRemark: user.storeRemark || '',
				avatar: user.avatar || '',
				lastOrderInfo: user.lastOrderInfo || '',
				balance: user.gold || 0
			}));
		},

		// 加载更多下单用户
		loadMore() {
			if (this.orderUsers.length >= this.totalCount) {
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				});
				return;
			}
			
			this.queryParam.pageNo++;
			
			uni.showLoading({
				title: '加载中...'
			});
			
			const params = {
				pageNo: this.queryParam.pageNo,
				pageSize: 10,
				orderUserFlag: 1
			};
			
			storeUserPage(params).then(res => {
				if (res.success) {
					const newUsers = this.formatUserData(res.voList);
					this.orderUsers = [...this.orderUsers, ...newUsers];
					uni.hideLoading();
				}
			}).catch(() => {
			});
		},
		
		// 切换分类
		switchCategory(category) {
			this.activeCategory = category;
			
			if (category === 'all') {
				uni.navigateTo({
					url: '/pages/user/person'
				});
			} else if (category === 'apply') {
				uni.navigateTo({
					url: '/pages/user/apply'
				});
			}
		},

		// 跳转到搜索页面
		goToSearch() {
			uni.navigateTo({
				url: '/pages/user/person?autoFocus=true'
			});
		},

		// 跳转到用户详情
		goToUserDetail(user) {
			uni.navigateTo({
				url: "/pages/user/info?uid=" + user.id
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.users {
	background-color: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 100rpx;
}

.search-header {
	height: 100rpx;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30rpx;
	position: sticky;
	top: 0;
	z-index: 100;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
}

.category-list {
	display: flex;
	background-color: #fff;
	padding: 0;
	border-bottom: 1rpx solid #eee;
	
	.category-item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 12rpx 0;
		
		.category-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 70rpx;
			height: 70rpx;
			margin: 0 20rpx 0 30rpx;
		}
		
		.category-text {
			font-size: 30rpx;
			color: #333;
			line-height: 1;
		}
	}
}

.user-section {
	margin-top: 0;
	
	.section-header {
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 30rpx;
		font-size: 30rpx;
		color: #666;
		background-color: transparent;
	}
	
	.user-list {
		background-color: #fff;
	}
	
	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #eee;
		
		.user-info {
			display: flex;
			align-items: center;
			
			.user-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
				background-color: #eee;
			}
			
			.user-detail {
				.user-name {
					font-size: 30rpx;
					color: #333;
					margin-bottom: 6rpx;
				}
				
				.user-order-info {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.user-balance {
			font-size: 32rpx;
			font-weight: bold;
			color: #FF3B30;
		}
	}
}

.load-more {
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	font-size: 28rpx;
	color: #999;
	background-color: #fff;
}

.empty-tip {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 28rpx;
}
</style>