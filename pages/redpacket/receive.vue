<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'红包领取详情'" :back="true"></nav-bar>
		
		<!-- 领取记录内容 -->
		<view class="receive-content">
			<!-- 无数据时显示空状态 -->
			<u-empty v-if="receiveList.length === 0" mode="data" text="暂无数据"></u-empty>
			
			<!-- 领取记录列表 -->
			<view class="receive-list" v-else>
				<view class="receive-item" v-for="(item, index) in receiveList" :key="index">
					<view class="user-info">
						<image class="user-avatar" :src="item.avatar" mode="aspectFill"></image>
						<view class="user-detail">
							<text class="user-name">{{item.userName}}</text>
							<text class="receive-time">{{item.receiveTime}}</text>
						</view>
					</view>
					<view class="amount-info">
						<text class="amount">{{item.amount}}元</text>
						<text class="status" :class="item.used ? 'used' : ''">{{item.used ? '已使用' : '未使用'}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/nav-bar.vue'

export default {
	components: {
		navBar
	},
	data() {
		return {
			redpacketId: null,
			receiveList: []
		}
	},
	onLoad(options) {
		if (options.id) {
			this.redpacketId = options.id;
			// 获取红包领取记录
			this.getReceiveList();
		}
	},
	methods: {
		getReceiveList() {
			// 这里应该调用API获取红包领取记录
			// 模拟网络请求
			uni.showLoading({
				title: '加载中'
			});
			
			// 模拟请求延迟
			setTimeout(() => {
				// 这里暂时返回空数据，显示空状态
				this.receiveList = [];
				
				uni.hideLoading();
			}, 500);
		}
	}
}
</script>

<style lang="scss" scoped>
.receive-content {
	padding: 15px;
	
	.receive-list {
		background-color: #ffffff;
		border-radius: 8px;
		overflow: hidden;
		
		.receive-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px;
			border-bottom: 1px solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.user-info {
				display: flex;
				align-items: center;
				
				.user-avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
				}
				
				.user-detail {
					display: flex;
					flex-direction: column;
					
					.user-name {
						font-size: 16px;
						color: #333;
						font-weight: 500;
					}
					
					.receive-time {
						font-size: 12px;
						color: #999;
						margin-top: 5px;
					}
				}
			}
			
			.amount-info {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				
				.amount {
					font-size: 16px;
					color: #FF5722;
					font-weight: bold;
				}
				
				.status {
					font-size: 12px;
					color: #999;
					margin-top: 5px;
					
					&.used {
						color: #4CAF50;
					}
				}
			}
		}
	}
}
</style> 