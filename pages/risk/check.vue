<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'风险抽查任务'" :back="true"></nav-bar>
		
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
			<view class="empty-container">
				<image class="empty-icon" src="/static/images/common/no-data.png" mode="aspectFit"></image>
				<text class="empty-text">暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 1, // 默认选中"已提交"标签
			tabsList: [
				{ name: '抽检中' },
				{ name: '已提交' },
				{ name: '已完成' }
			],
			taskList: [], // 风险抽查任务列表
			queryParams: {
				status: 1, // 0:抽检中, 1:已提交, 2:已完成
				pageNo: 1,
				pageSize: 10
			},
			isLoading: false
		}
	},
	onLoad() {
		this.loadTaskList();
	},
	onPullDownRefresh() {
		this.refreshList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 500);
	},
	methods: {
		// 切换标签页
		onTabChange(e) {
			// u-tabs的change事件返回的是一个对象，需要获取其索引值
			this.currentTab = e.index !== undefined ? e.index : 0;
			this.queryParams.status = this.currentTab;
			this.queryParams.pageNo = 1;
			this.taskList = [];
			this.loadTaskList();
		},
		
		// 加载风险抽查任务列表
		loadTaskList() {
			this.isLoading = true;
			uni.showLoading({
				title: '加载中...'
			});
			
			// 模拟API请求
			setTimeout(() => {
				// 这里设置为空数组，表示暂无数据
				this.taskList = [];
				
				uni.hideLoading();
				this.isLoading = false;
			}, 500);
			
			// 实际API调用示例
			/*
			getRiskCheckTasks(this.queryParams).then(res => {
				if (res.success) {
					this.taskList = res.data.list || [];
				} else {
					uni.showToast({
						title: res.message || '加载失败',
						icon: 'none'
					});
				}
				uni.hideLoading();
				this.isLoading = false;
			}).catch(err => {
				console.error('加载风险抽查任务失败', err);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
				uni.hideLoading();
				this.isLoading = false;
			});
			*/
		},
		
		// 刷新列表
		refreshList() {
			this.queryParams.pageNo = 1;
			this.taskList = [];
			this.loadTaskList();
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
	height: calc(100vh - 44px - 80rpx);
	display: flex;
	flex-direction: column;
}

.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
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
</style> 