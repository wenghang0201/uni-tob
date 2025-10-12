<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'红包'" :back="true" :right-text="'分享'" @rightTextClick="openSharePopup"></nav-bar>
		
		<!-- 红包详情内容 -->
		<view class="redpacket-detail">
			<!-- 红包头部信息 -->
			<view class="detail-header">
				<view class="redpacket-type">
					<image class="type-icon" :src="getTypeIcon(redpacketInfo.type)" mode="aspectFit"></image>
					<text class="type-text">{{getTypeName(redpacketInfo.type)}}</text>
				</view>
				
				<!-- 红包金额显示 -->
				<view class="redpacket-amount" v-if="redpacketInfo.type !== 'discount'">
					<text class="amount-value">{{redpacketInfo.amount}}</text>
					<text class="amount-unit">元</text>
				</view>
				<view class="redpacket-amount" v-else>
					<text class="amount-value">满{{redpacketInfo.betAmount}}减{{redpacketInfo.minDiscount}}-{{redpacketInfo.maxDiscount}}</text>
					<text class="amount-unit">元</text>
				</view>
			</view>
			
			<!-- 红包详情列表 -->
			<view class="detail-list">
				<!-- 已领取/总数 -->
				<view class="detail-item" @click="viewReceivedList">
					<text class="item-label">已领取/总数</text>
					<view class="item-value">
						<text>{{redpacketInfo.received || 0}}/{{redpacketInfo.total}}</text>
						<text class="item-arrow">›</text>
					</view>
				</view>
				
				<!-- 领取金额/总额，仅在非满减红包时显示 -->
				<view class="detail-item" v-if="redpacketInfo.type !== 'discount'">
					<text class="item-label">领取金额/总额</text>
					<text class="item-value">{{redpacketInfo.receivedAmount || 0}}/{{redpacketInfo.totalAmount}}</text>
				</view>
				
				<!-- 已使用个数/已使用金额 -->
				<view class="detail-item">
					<text class="item-label">已使用个数/已使用金额</text>
					<text class="item-value">{{redpacketInfo.usedCount || 0}}/{{redpacketInfo.usedAmount || 0}}</text>
				</view>
				
				<!-- 可用彩种 -->
				<view class="detail-item">
					<text class="item-label">可用彩种</text>
					<text class="item-value">{{redpacketInfo.lottery || '全部彩种'}}</text>
				</view>
				
				<!-- 可用投注方式 -->
				<view class="detail-item">
					<text class="item-label">可用投注方式</text>
					<text class="item-value">{{redpacketInfo.betType || '全部玩法'}}</text>
				</view>
				
				<!-- 适用人群 -->
				<view class="detail-item">
					<text class="item-label">适用人群</text>
					<text class="item-value">{{redpacketInfo.targetUser || '全部'}}</text>
				</view>
				
				<!-- 发送日期 -->
				<view class="detail-item">
					<text class="item-label">发送日期</text>
					<text class="item-value">{{redpacketInfo.createTime}}</text>
				</view>
				
				<!-- 有效期 -->
				<view class="detail-item">
					<text class="item-label">有效期</text>
					<text class="item-value">{{redpacketInfo.expireDays}}天</text>
				</view>
			</view>
		</view>
		
		<!-- 添加分享弹窗 -->
		<u-popup :show="showSharePopup" mode="center" @close="showSharePopup = false" :round="10">
			<view class="share-popup">
				<view class="close-icon" @click="showSharePopup = false">
					<text>×</text>
				</view>
				
				<view class="share-content">
					<!-- 根据红包类型显示不同内容 -->
					<view class="redpacket-info">
						<!-- 满减红包 -->
						<block v-if="redpacketInfo.type === 'discount'">
							<view class="redpacket-amount">{{redpacketInfo.minDiscount}}-{{redpacketInfo.maxDiscount}}元</view>
							<view class="redpacket-desc">满{{redpacketInfo.betAmount}}元可用，满减红包</view>
						</block>
						
						<!-- 立减红包 -->
						<block v-else-if="redpacketInfo.type === 'direct'">
							<view class="redpacket-amount">{{redpacketInfo.amount}}元</view>
							<view class="redpacket-desc">立减红包</view>
						</block>
						
						<!-- 新人红包 -->
						<block v-else>
							<view class="redpacket-amount">{{redpacketInfo.amount}}元</view>
							<view class="redpacket-desc">新人红包</view>
						</block>
					</view>
					
					<view class="qrcode-container">
						<view class="qrcode-wrapper">
							<canvas id="qrcode" canvas-id="qrcode" style="width: 160px; height: 160px;"></canvas>
						</view>
						<view class="qrcode-tip">
							<view class="tip-big">长按识别</view>
							<view class="tip-small">线下实体店，安全更放心</view>
						</view>
					</view>
				</view>
				
				<view class="copy-link-btn" @click="copyShareLink">复制链接</view>
			</view>
		</u-popup>
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
			redpacketId: null,
			showSharePopup: false,
			redpacketInfo: {
				id: null,
				type: 'direct', // direct: 立减红包, discount: 满减红包, new_user: 新人红包
				amount: 1, // 红包金额（立减和新人红包）
				betAmount: 100, // 投注金额（满减红包）
				minDiscount: 1, // 最小优惠金额（满减红包）
				maxDiscount: 10, // 最大优惠金额（满减红包）
				total: 10, // 红包总数
				received: 0, // 已领取数量
				totalAmount: 10, // 红包总金额
				receivedAmount: 0, // 已领取金额
				usedCount: 0, // 已使用个数
				usedAmount: 0, // 已使用金额
				lottery: '竞彩足球,竞彩篮球', // 可用彩种
				betType: '投注#合买#跟单', // 可用投注方式
				targetUser: '全部', // 适用人群
				createTime: '2025-03-26 17:10:10', // 发送日期
				expireDays: 10 // 有效期（天）
			}
		}
	},
	onLoad(options) {
		if (options.id) {
			this.redpacketId = options.id;
			// 根据ID获取红包详情
			this.getRedpacketDetail();
		}
		
		// 如果是通过分享链接进入，可能需要处理其他参数
		if (options.share) {
			// 处理分享逻辑
		}
	},
	methods: {
		getTypeIcon(type) {
			const iconMap = {
				'direct': '/static/images/redpacket/direct.png',
				'discount': '/static/images/redpacket/discount.png',
				'new_user': '/static/images/redpacket/new_user.png'
			};
			return iconMap[type] || iconMap.direct;
		},
		getTypeName(type) {
			const nameMap = {
				'direct': '立减红包',
				'discount': '满减红包',
				'new_user': '新人红包'
			};
			return nameMap[type] || '立减红包';
		},
		getRedpacketDetail() {
			// 这里应该调用API获取红包详情
			// 模拟网络请求
			uni.showLoading({
				title: '加载中'
			});
			
			// 模拟请求延迟
			setTimeout(() => {
				// 根据红包类型设置不同的红包信息
				if (this.redpacketId) {
					// 实际项目中应从API获取
					// 这里用模拟数据
					this.setMockData();
				}
				
				uni.hideLoading();
			}, 500);
		},
		setMockData() {
			// 根据ID设置不同类型的红包模拟数据
			const mockDataMap = {
				'1': { // 新人红包
					type: 'new_user',
					amount: 1,
					total: 100,
					received: 0,
					totalAmount: 100,
					receivedAmount: 0,
					usedCount: 0,
					usedAmount: 0,
					lottery: '竞彩足球',
					betType: '投注',
					targetUser: '新人',
					createTime: '2025-03-26 14:26:38',
					expireDays: 10
				},
				'2': { // 满减红包
					type: 'discount',
					betAmount: 100,
					minDiscount: 1,
					maxDiscount: 10,
					total: 10,
					received: 0,
					usedCount: 0,
					usedAmount: 0,
					lottery: '竞彩足球',
					betType: '跟单',
					targetUser: '全部',
					createTime: '2025-03-26 16:54:36',
					expireDays: 10
				},
				'3': { // 立减红包
					type: 'direct',
					amount: 1,
					total: 10,
					received: 0,
					totalAmount: 10,
					receivedAmount: 0,
					usedCount: 0,
					usedAmount: 0,
					lottery: '竞彩足球,竞彩篮球',
					betType: '投注#合买#跟单',
					targetUser: '全部',
					createTime: '2025-03-26 17:10:10',
					expireDays: 10
				}
			};
			
			// 如果有对应ID的模拟数据，就使用它
			if (mockDataMap[this.redpacketId]) {
				this.redpacketInfo = mockDataMap[this.redpacketId];
			}
		},
		viewReceivedList() {
			// 跳转到红包领取详情页
			uni.navigateTo({
				url: `/pages/redpacket/receive?id=${this.redpacketId}`
			});
		},
		shareRedpacket() {
			// 分享红包
			this.openSharePopup();
		},
		openSharePopup() {
			this.showSharePopup = true;
			// 生成二维码
			this.$nextTick(() => {
				this.generateQRCode();
			});
		},
		generateQRCode() {
			// 构建分享链接
			const shareLink = `https://example.com/redpacket/share?id=${this.redpacketId}`;
			
			// 获取uQRCode实例
			const qr = new UQRCode();
			// 设置二维码内容
			qr.data = shareLink;
			// 设置二维码大小，必须与canvas设置的宽高一致
			qr.size = 160;
			// 调用制作二维码方法
			qr.make();
			// 获取canvas上下文
			const canvasContext = uni.createCanvasContext('qrcode', this);
			// 设置uQRCode实例的canvas上下文
			qr.canvasContext = canvasContext;
			// 调用绘制方法将二维码图案绘制到canvas上
			qr.drawCanvas();
		},
		copyShareLink() {
			// 复制分享链接
			const shareLink = `https://example.com/redpacket/share?id=${this.redpacketId}`;
			uni.setClipboardData({
				data: shareLink,
				success: () => {
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					});
				}
			});
			this.showSharePopup = false;
		}
	}
}
</script>

<style lang="scss" scoped>
.redpacket-detail {
	padding: 0;
	
	.detail-header {
		background-color: #ffffff;
		padding: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15px;
		
		.redpacket-type {
			display: flex;
			align-items: center;
			margin-bottom: 20px;
			
			.type-icon {
				width: 40px;
				height: 40px;
				margin-right: 10px;
			}
			
			.type-text {
				font-size: 18px;
				font-weight: bold;
				color: #333;
			}
		}
		
		.redpacket-amount {
			display: flex;
			align-items: baseline;
			
			.amount-value {
				font-size: 36px;
				font-weight: bold;
				color: #333;
			}
			
			.amount-unit {
				font-size: 18px;
				color: #333;
				margin-left: 5px;
			}
		}
	}
	
	.detail-list {
		background-color: #ffffff;
		
		.detail-item {
			display: flex;
			justify-content: space-between;
			padding: 15px;
			border-bottom: 1px solid #f5f5f5;
			
			.item-label {
				font-size: 16px;
				color: #666;
			}
			
			.item-value {
				font-size: 16px;
				color: #333;
				display: flex;
				align-items: center;
				
				.item-arrow {
					margin-left: 10px;
					font-size: 20px;
					color: #999;
				}
			}
			
			&:last-child {
				border-bottom: none;
			}
		}
	}
}

/* 分享弹窗样式 */
.share-popup {
	width: 300px;
	padding: 20px;
	position: relative;
	
	.close-icon {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		color: #999;
		cursor: pointer;
	}
	
	.share-content {
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
		
		.redpacket-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 20px;
			
			.redpacket-amount {
				font-size: 32px;
				font-weight: bold;
				color: #333;
				margin-bottom: 5px;
			}
			
			.redpacket-desc {
				font-size: 16px;
				color: #666;
			}
		}
		
		.qrcode-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 20px 0;
			
			.qrcode-wrapper {
				width: 160px;
				height: 160px;
				padding: 0;
				background-color: #fff;
				border: 1px solid #eee;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
			}
			
			.qrcode-tip {
				margin-top: 15px;
				text-align: center;
				
				.tip-big {
					font-size: 18px;
					font-weight: bold;
					color: #333;
					margin-bottom: 5px;
				}
				
				.tip-small {
					font-size: 14px;
					color: #666;
				}
			}
		}
	}
	
	.copy-link-btn {
		height: 45px;
		line-height: 45px;
		text-align: center;
		font-size: 16px;
		color: #ffffff;
		background-color: #4080FF;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(64, 128, 255, 0.3);
	}
}
</style> 