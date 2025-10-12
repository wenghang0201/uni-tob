<template>
	<view class="box">
		<nav-bar :title="'申请进店'" :back="true"></nav-bar>
		
		<!-- 用户列表 -->
		<view class="apply-list" v-if="applyList.length > 0">
			<view class="apply-item" v-for="(item, index) in applyList" :key="index">
				<view class="user-info">
					<image class="user-avatar" :src="item.avatar || '/static/images/user/default-avatar.png'"></image>
					<view class="user-detail">
						<view class="user-name">{{ item.storeRemark || item.nickname }}</view>
						<view class="user-phone">{{ item.phone }}</view>
						<view class="apply-time">申请时间：{{ item.createTime }}</view>
					</view>
				</view>
				<view class="action-btns">
					<view class="action-btn reject" @click="handleReject(item)">拒绝</view>
					<view class="action-btn approve" @click="handleApprove(item)">通过</view>
				</view>
			</view>
		</view>
		
		<!-- 暂无数据提示 -->
		<view class="empty-container" v-else>
			<view class="empty-icon">
				<u-icon name="file-text" color="#CCCCCC" size="100"></u-icon>
			</view>
			<view class="empty-text">暂无申请进店数据</view>
		</view>
	</view>
</template>

<script>
import { storeUserPage } from '@/api/user.js'

export default {
	data() {
		return {
			applyList: [],
			queryParam: {
				pageNo: 1,
				pageSize: 10,
				status: 2 // 状态:0->禁用;1->启用;2->待审核
			}
		};
	},
	onLoad() {
		this.fetchApplyList();
	},
	onPullDownRefresh() {
		this.queryParam.pageNo = 1;
		this.fetchApplyList();
	},
	methods: {
		// 获取申请列表
		fetchApplyList() {
			uni.showLoading({
				title: '加载中...'
			});
			
			storeUserPage(this.queryParam).then(res => {
				if (res.success) {
					this.applyList = res.voList || [];
					uni.hideLoading();
				} else {
					uni.hideLoading();
					uni.showToast({
						title: res.errorMsg || '加载失败',
						icon: 'none'
					});
				}
				uni.stopPullDownRefresh();
			}).catch(() => {
				uni.stopPullDownRefresh();
			});
		},
		
		// 处理拒绝申请
		handleReject(item) {
			uni.showModal({
				title: '拒绝申请',
				content: `确定要拒绝 ${item.storeRemark || item.nickname} 的进店申请吗？`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '已拒绝申请',
							icon: 'success'
						});
						// 刷新列表
						this.fetchApplyList();
					}
				}
			});
		},
		
		// 处理通过申请
		handleApprove(item) {
			uni.showModal({
				title: '通过申请',
				content: `确定要通过 ${item.storeRemark || item.nickname} 的进店申请吗？`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '已通过申请',
							icon: 'success'
						});
						// 刷新列表
						this.fetchApplyList();
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.apply-list {
	padding: 20rpx;
}

.apply-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.user-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	background-color: #f0f0f0;
}

.user-detail {
	flex: 1;
}

.user-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.user-phone {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.apply-time {
	font-size: 24rpx;
	color: #999;
}

.action-btns {
	display: flex;
	justify-content: flex-end;
}

.action-btn {
	width: 160rpx;
	height: 70rpx;
	line-height: 70rpx;
	text-align: center;
	border-radius: 35rpx;
	font-size: 28rpx;
	margin-left: 20rpx;
}

.reject {
	background-color: #f5f5f5;
	color: #666;
}

.approve {
	background-color: #2979ff;
	color: #fff;
}

.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 30vh;
}

.empty-icon {
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 30rpx;
	color: #999;
}
</style> 