<template>
	<view class="box">
		<nav-bar :title="'线下收款详情'" :back="true"></nav-bar>
		
		<view class="detail-container">
			<!-- 数据为空状态 -->
			<view class="empty-container" v-if="!isLoading && !paymentDetail.id">
				<image class="empty-icon" src="/static/images/common/no-data.png" mode="aspectFit"></image>
				<text class="empty-text">暂无数据</text>
			</view>
			
			<!-- 详情内容 -->
			<view class="detail-section" v-if="!isLoading && paymentDetail.id">
				<view class="detail-row">
					<text class="detail-label">订单号:</text>
					<text class="detail-value">{{ paymentDetail.orderId }}</text>
				</view>
				
				<view class="detail-row">
					<text class="detail-label">手机号码:</text>
					<text class="detail-value">{{ paymentDetail.phone }}</text>
				</view>
				
				<view class="detail-row">
					<text class="detail-label">支付时间:</text>
					<text class="detail-value">{{ paymentDetail.createTime }}</text>
				</view>
				
				<view class="detail-row">
					<text class="detail-label">支付金额:</text>
					<view class="detail-value amount-value">
						<text class="currency-symbol">¥</text>
						<input type="number" :value="paymentDetail.price" class="amount-input" disabled />
						<text class="currency-unit">元</text>
					</view>
				</view>
				
				<view class="detail-row voucher-row">
					<text class="detail-label">支付凭证:</text>
					<view class="voucher-content">
						<!-- 单图显示 -->
						<view v-if="voucherImages.length === 1" class="voucher-single">
							<image 
								:src="voucherImages[0]" 
								class="voucher-image-large"
								mode="aspectFit"
								@click="previewImage(0)"
							></image>
						</view>
						
						<!-- 两图显示 -->
						<view v-else-if="voucherImages.length === 2" class="voucher-double">
							<view class="voucher-image-item" v-for="(imageUrl, index) in voucherImages" :key="index">
								<image 
									:src="imageUrl" 
									class="voucher-image"
									mode="aspectFill"
									@click="previewImage(index)"
								></image>
							</view>
						</view>
						
						<!-- 多图网格显示 -->
						<view v-else-if="voucherImages.length > 2" class="voucher-grid">
							<view class="voucher-image-item" v-for="(imageUrl, index) in voucherImages" :key="index">
								<image 
									:src="imageUrl" 
									class="voucher-image"
									mode="aspectFill"
									@click="previewImage(index)"
								></image>
							</view>
						</view>
						
						<!-- 无图显示（默认图片） -->
						<view v-else class="voucher-single">
							<image 
								src="/static/images/payment/default-voucher.jpg" 
								class="voucher-image-large"
								mode="aspectFit"
							></image>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部空白占位区域，为固定按钮留出空间 -->
			<view class="bottom-space" v-if="!isLoading && paymentDetail.id && paymentDetail.auditStatus === '0'"></view>
		</view>
		
		<!-- 固定在底部的操作按钮 -->
		<view class="fixed-action-buttons" v-if="!isLoading && paymentDetail.id && paymentDetail.auditStatus === '0'">
			<button class="action-btn approve-btn" @click="handleApprove">审核通过</button>
			<button class="action-btn reject-btn" @click="handleReject">驳回</button>
		</view>
	</view>
</template>

<script>
import { getPaymentDetail, auditVoucherPayment } from '@/api/payment.js'

export default {
	data() {
		return {
			id: '',
			isLoading: false,
			paymentDetail: {
				id: '',
				orderId: '',
				phone: '',
				price: '',
				createTime: '',
				auditStatus: '',
				voucherUrl: '', // 单个凭证图片URL（兼容旧数据）
				paymentVoucher: '' // 多个凭证图片URL的JSON字符串
			}
		};
	},
	computed: {
		// 解析凭证图片数组
		voucherImages() {
			// 优先使用paymentVoucher字段
			if (this.paymentDetail.paymentVoucher) {
				try {
					// 尝试解析JSON字符串
					const images = JSON.parse(this.paymentDetail.paymentVoucher);
					if (Array.isArray(images) && images.length > 0) {
						return images;
					}
				} catch (error) {
					console.error('解析支付凭证JSON失败:', error);
				}
			}
			
			// 兼容单图模式，如果有voucherUrl则作为单个元素的数组返回
			if (this.paymentDetail.voucherUrl) {
				return [this.paymentDetail.voucherUrl];
			}
			
			// 没有图片时返回空数组
			return [];
		}
	},
	onLoad(options) {
		if (options.id) {
			this.id = options.id;
			this.loadPaymentDetail();
		}
	},
	methods: {
		// 加载收款详情
		loadPaymentDetail() {
			this.isLoading = true;
			uni.showLoading({
				title: '加载中...'
			});
			
			// 尝试从全局数据获取详情
			const app = getApp();
			if (app.globalData && app.globalData.currentPaymentDetail) {
				this.paymentDetail = app.globalData.currentPaymentDetail;
				this.isLoading = false;
				uni.hideLoading();
				return;
			}
			
			// 如果全局数据不存在，则通过API获取详情
			getPaymentDetail(this.id).then(res => {
				if (res.success && res.data) {
					this.paymentDetail = res.data;
				} else {
					uni.showToast({
						title: res.errorMsg || '获取详情失败',
						icon: 'none'
					});
				}
				this.isLoading = false;
				uni.hideLoading();
			}).catch(err => {
				console.error('获取支付详情失败', err);
				this.isLoading = false;
				uni.hideLoading();
			});
		},
		
		// 预览图片
		previewImage(index) {
			if (this.voucherImages.length > 0) {
				uni.previewImage({
					urls: this.voucherImages,
					current: this.voucherImages[index]
				});
			}
		},
		
		// 审核通过
		handleApprove() {
			uni.showModal({
				title: '审核通过',
				content: '确认通过此笔线下收款？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' });
						
						// 调用审核API
						auditVoucherPayment({
							orderId: this.paymentDetail.orderId,
							approved: true,
							remark: '审核通过'
						}).then(res => {
							uni.hideLoading();
							if (res.success) {
								uni.showToast({
									title: '审核通过',
									icon: 'success',
									duration: 2000,
									success: () => {
										setTimeout(() => {
											// 返回上一页并刷新
											const pages = getCurrentPages();
											const prevPage = pages[pages.length - 2];
											if (prevPage && prevPage.$vm) {
												prevPage.$vm.refreshList();
											}
											uni.navigateBack();
										}, 1000);
									}
								});
							} else {
								uni.showToast({
									title: res.errorMsg || '操作失败',
									icon: 'none'
								});
							}
						}).catch(err => {
							console.error('审核操作失败', err);
						});
					}
				}
			});
		},
		
		// 驳回
		handleReject() {
			uni.showModal({
				title: '驳回',
				content: '确认驳回此笔线下收款？',
				success: (res) => {
					if (res.confirm) {
						// 弹出输入框让用户输入驳回原因
						uni.showModal({
							title: '驳回原因',
							editable: true,
							placeholderText: '请输入驳回原因',
							success: (inputRes) => {
								if (inputRes.confirm) {
									uni.showLoading({ title: '处理中...' });
									
									// 调用审核API
									auditVoucherPayment({
										orderId: this.paymentDetail.orderId,
										approved: false,
										remark: inputRes.content || '审核驳回'
									}).then(res => {
										uni.hideLoading();
										if (res.success) {
											uni.showToast({
												title: '已驳回',
												icon: 'success',
												duration: 2000,
												success: () => {
													setTimeout(() => {
														// 返回上一页并刷新
														const pages = getCurrentPages();
														const prevPage = pages[pages.length - 2];
														if (prevPage && prevPage.$vm) {
															prevPage.$vm.refreshList();
														}
														uni.navigateBack();
													}, 1000);
												}
											});
										} else {
											uni.showToast({
												title: res.errorMsg || '操作失败',
												icon: 'none'
											});
										}
									}).catch(err => {
										console.error('驳回操作失败', err);
									});
								}
							}
						});
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.detail-container {
	padding: 30rpx;
	padding-bottom: 130rpx; /* 为固定底部按钮留出空间 */
}

.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 200rpx;
	
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

.detail-section {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.detail-row {
	display: flex;
	margin-bottom: 30rpx;
	
	.detail-label {
		color: #666;
		width: 180rpx;
		font-size: 28rpx;
		padding-top: 6rpx;
	}
	
	.detail-value {
		flex: 1;
		color: #333;
		font-size: 30rpx;
		word-break: break-all;
	}
	
	&.voucher-row {
		flex-direction: column;
		
		.detail-label {
			margin-bottom: 20rpx;
		}
		
		.voucher-content {
			padding: 20rpx 0;
		}
	}
}

// 单图布局
.voucher-single {
	display: flex;
	justify-content: center;
	
	.voucher-image-large {
		width: 500rpx;
		height: 500rpx;
		border: 1rpx solid #eee;
		border-radius: 8rpx;
	}
}

// 两图布局
.voucher-double {
	display: flex;
	justify-content: space-between;
	
	.voucher-image-item {
		width: 48%;
		height: 340rpx;
		
		.voucher-image {
			width: 100%;
			height: 100%;
			border: 1rpx solid #eee;
			border-radius: 8rpx;
		}
	}
}

// 多图网格布局
.voucher-grid {
	display: flex;
	flex-wrap: wrap;
	
	.voucher-image-item {
		width: 220rpx;
		height: 220rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		
		&:nth-child(3n) {
			margin-right: 0;
		}
		
		.voucher-image {
			width: 100%;
			height: 100%;
			border: 1rpx solid #eee;
			border-radius: 8rpx;
		}
	}
}

.amount-value {
	display: flex;
	align-items: center;
	
	.currency-symbol {
		color: #f00;
		font-size: 36rpx;
		margin-right: 10rpx;
	}
	
	.amount-input {
		color: #f00;
		font-size: 36rpx;
		font-weight: bold;
		background-color: #f9f9f9;
		padding: 10rpx;
		border-radius: 8rpx;
		width: 200rpx;
		text-align: center;
	}
	
	.currency-unit {
		margin-left: 10rpx;
		font-size: 28rpx;
	}
}

/* 底部空白区域，为固定按钮留出空间 */
.bottom-space {
	height: 100rpx;
}

/* 固定在底部的操作按钮 */
.fixed-action-buttons {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 999;
	box-sizing: border-box;
	
	.action-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border-radius: 40rpx;
	}
	
	.approve-btn {
		background-color: #2979ff;
		color: #fff;
		margin-right: 30rpx;
	}
	
	.reject-btn {
		background-color: #fff;
		color: #666;
		border: 1px solid #ddd;
	}
}
</style> 