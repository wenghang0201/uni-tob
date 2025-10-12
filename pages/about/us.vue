<template>
	<view class="box">
		<nav-bar :title="'关于我们'" :back="true"></nav-bar>
		
		<view class="content-container">
			<view class="about-logo">
				<image src="/static/images/user/logo.png" mode="aspectFit" class="logo-image"></image>
			</view>
			
			<view class="app-info">
				<view class="app-name">彩店宝助手</view>
				<view class="app-version">版本：V1172</view>
			</view>
			
			<view class="about-desc">
				<text class="desc-text">彩店宝助手是一款专业的彩票店铺管理软件，为彩票店主提供便捷的店铺管理、账务统计、用户服务等功能。</text>
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
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.about-logo {
	margin-bottom: 40rpx;
	
	.logo-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
	}
}

.app-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
	
	.app-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}
	
	.app-version {
		font-size: 28rpx;
		color: #999;
	}
}

.about-desc {
	padding: 0 20rpx;
	
	.desc-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		text-align: center;
	}
}
</style> 