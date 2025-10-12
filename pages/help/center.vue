<template>
	<view class="box">
		<nav-bar :title="'帮助中心'" :back="true"></nav-bar>
		
		<view class="content-container">
			<view class="empty-tip">
				<u-icon name="info-circle" color="#999" size="80"></u-icon>
				<text class="tip-text">暂无帮助内容</text>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.content-container {
	padding: 30rpx;
	height: calc(100vh - 44px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.empty-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.tip-text {
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #999;
	}
}
</style> 