<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'微信推送'" :back="true"></nav-bar>
		
		<!-- 内容区域 -->
		<view class="content">
			<!-- 二维码区域 -->
			<view class="qr-section">
				<view class="qr-wrapper">
					<canvas id="qrcode" canvas-id="qrcode" style="width: 220px; height: 220px;"></canvas>
				</view>
			</view>
			
			<!-- 提示信息 -->
			<view class="tips-container">
				<view class="tips-title">温馨提示：请截屏保存</view>
				<view class="tips-content">
					<view class="tip-item">打开微信扫一扫</view>
					<view class="tip-item">扫描二维码图片</view>
					<view class="tip-item">绑定微信公众号</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from '@/components/nav-bar/nav-bar.vue'
	import UQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js'
	
	export default {
		components: {
			navBar
		},
		data() {
			return {
				qrText: 'https://weixin.qq.com/bind' // 二维码内容，实际使用时替换为真实链接
			}
		},
		onReady() {
			// 获取uQRCode实例
			const qr = new UQRCode()
			// 设置二维码内容
			qr.data = this.qrText
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = 220
			// 调用制作二维码方法
			qr.make()
			// 获取canvas上下文
			const canvasContext = uni.createCanvasContext('qrcode', this)
			// 设置uQRCode实例的canvas上下文
			qr.canvasContext = canvasContext
			// 调用绘制方法将二维码图案绘制到canvas上
			qr.drawCanvas()
		}
	}
</script>

<style lang="scss" scoped>
.content {
	padding-top: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.qr-section {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 40px 0;
	
	.qr-wrapper {
		width: 220px;
		height: 220px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.tips-container {
	width: 80%;
	text-align: left;
}

.tips-title {
	font-size: 16px;
	color: #333;
	margin-bottom: 10px;
	font-weight: normal;
}

.tips-content {
	color: #666;
	padding-left: 80px;
}

.tip-item {
	font-size: 14px;
	line-height: 2;
}
</style> 