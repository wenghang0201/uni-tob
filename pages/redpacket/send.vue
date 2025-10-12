<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'红包'" :back="true" :right-text="'发红包'" @rightTextClick="sendRedPacket"></nav-bar>
		
		<view class="redpacket-content">
			<view class="redpacket-list">
				<view class="redpacket-item" v-for="(item, index) in redpacketList" :key="index" @click="viewRedpacketDetail(item)">
					<view class="item-left">
						<view class="item-avatar">
							<image :src="item.avatar || '/static/images/user/logo.png'" mode="scaleToFill"></image>
							<text class="avatar-tag" v-if="item.tag">{{item.tag}}</text>
						</view>
					</view>
					<view class="item-center">
						<view class="item-title">{{item.title}}</view>
						<view class="item-time">{{item.time}}</view>
					</view>
					<view class="item-right">
						<view class="item-amount">{{item.amount}}元</view>
						<view class="item-status">{{item.received}}/{{item.total}}</view>
					</view>
				</view>
			</view>
			
			<u-empty v-if="redpacketList.length === 0" mode="data" text="暂无红包数据"></u-empty>
			
			<view class="no-more" v-if="redpacketList.length > 0">没有更多了</view>
		</view>
		
		<!-- 红包类型选择 -->
		<u-action-sheet 
			:show="showActionSheet" 
			:actions="redpacketTypes" 
			title="选择红包类型"
			@close="showActionSheet = false"
			@select="selectRedPacketType"
			:round="10"
			cancel-text="取消"
		></u-action-sheet>
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
			redpacketList: [
				{
					id: 1,
					title: '新人红包',
					time: '2025-03-26 14:26:38',
					amount: '1',
					received: 0,
					total: 100,
					avatar: '/static/images/user/logo.png',
					tag: '新人'
				},
				{
					id: 2,
					title: '满减红包',
					time: '2025-03-26 16:54:36',
					amount: '满100减1-10',
					received: 0,
					total: 10,
					avatar: '/static/images/user/logo.png',
					tag: '满减'
				},
				{
					id: 3,
					title: '立减红包',
					time: '2025-03-26 17:10:10',
					amount: '1',
					received: 0,
					total: 10,
					avatar: '/static/images/user/logo.png',
					tag: '立减'
				}
			],
			showActionSheet: false,
			redpacketTypes: [
				{
					name: '新人红包',
					type: 'new_user'
				},
				{
					name: '满减红包',
					type: 'discount'
				},
				{
					name: '立减红包',
					type: 'direct'
				}
			]
		}
	},
	onLoad() {
		// 可以在这里获取红包列表数据
		// this.getRedpacketList()
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		sendRedPacket() {
			// 显示红包类型选择
			this.showActionSheet = true;
		},
		selectRedPacketType(item) {
			// 根据选中的红包类型跳转到相应的创建页面
			uni.navigateTo({
				url: `/pages/redpacket/create?type=${item.type}`
			})
		},
		viewRedpacketDetail(item) {
			// 跳转到红包详情页
			uni.navigateTo({
				url: `/pages/redpacket/detail?id=${item.id}`
			});
		},
		getRedpacketList() {
			// 这里添加获取红包列表的逻辑
			// 模拟网络请求
			uni.showLoading({
				title: '加载中'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				// 模拟获取数据
				this.redpacketList = [
					{
						id: 1,
						title: '新人红包',
						time: '2025-03-26 14:26:38',
						amount: '1',
						received: 0,
						total: 100,
						avatar: '/static/images/user/logo.png',
						tag: '新人'
					}
				];
			}, 500);
		}
	}
}
</script>

<style lang="scss" scoped>
.redpacket-content {
	padding: 15px;
	
	.redpacket-list {
		.redpacket-item {
			display: flex;
			align-items: flex-start;
			background-color: #ffffff;
			border-radius: 8px;
			padding: 15px;
			margin-bottom: 15px;
			box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
				box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
			}
			
			.item-left {
				margin-right: 12px;
				
				.item-avatar {
					position: relative;
					width: 50px;
					height: 50px;
					
					image {
						width: 100%;
						height: 100%;
						border-radius: 4px;
					}
					
					.avatar-tag {
						position: absolute;
						top: 0;
						left: 0;
						background-color: #FF5722;
						color: #fff;
						font-size: 12px;
						padding: 2px 4px;
						border-radius: 4px 0 4px 0;
					}
				}
			}
			
			.item-center {
				flex: 1;
				
				.item-title {
					font-size: 16px;
					font-weight: bold;
					color: #333;
				}
				
				.item-time {
					font-size: 14px;
					color: #999;
					margin-top: 8px;
				}
			}
			
			.item-right {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				
				.item-amount {
					font-size: 18px;
					color: #FF5722;
					font-weight: bold;
				}
				
				.item-status {
					font-size: 14px;
					color: #999;
					margin-top: 5px;
				}
			}
		}
	}
	
	.no-more {
		text-align: center;
		color: #999;
		font-size: 14px;
		padding: 15px 0;
		position: relative;
		
		&::before, &::after {
			content: '';
			position: absolute;
			top: 50%;
			width: 20%;
			height: 1px;
			background-color: #ddd;
		}
		
		&::before {
			left: 20%;
		}
		
		&::after {
			right: 20%;
		}
	}
}
</style> 