<template>
	<view class="lottery-withdrawal-page">
		<!-- 顶部导航栏 -->
		<view class="nav-header">
			<view class="nav-left" @click="goBack">
				<u-icon name="arrow-left" size="16" color="#333"></u-icon>
			</view>
			<view class="nav-center">
				<text class="nav-title">彩民提现</text>
			</view>
			<view class="nav-right" @click="goToHistory">
				<text class="nav-link">历史记录</text>
			</view>
		</view>

		<!-- 提现方式选择 -->
		<view class="withdrawal-methods">
			<view 
				class="method-item" 
				:class="{ active: selectedMethod === 'alipay' }"
				@click="selectMethod('alipay')"
			>
				<text class="method-text">支付宝({{ alipayCount }})</text>
			</view>
			<view 
				class="method-item" 
				:class="{ active: selectedMethod === 'bank' }"
				@click="selectMethod('bank')"
			>
				<text class="method-text">银行卡({{ bankCount }})</text>
			</view>
		</view>

		<!-- 信息提示横幅 -->
		<view class="info-banner">
			<view class="banner-left">
				<u-icon name="info-circle" size="20" color="#ffa500"></u-icon>
			</view>
			<view class="banner-right">
				<text class="banner-text">彩民提现由店主进行打款处理，请知悉。</text>
			</view>
		</view>

		<!-- 提现记录详情卡片 -->
		<view class="withdrawal-card" v-for="(item, index) in filteredWithdrawalList" :key="index" @click="showWithdrawalDetail(item)">
			<view class="card-header">
				<view class="user-info">
					<view class="user-avatar">
						<image src="/static/images/personal/toxiang.png" mode="aspectFill"></image>
					</view>
					<view class="user-details">
						<text class="user-name">{{ item.name }}</text>
						<text class="withdrawal-time">{{ item.createTime }}</text>
					</view>
				</view>
				<view class="amount-info">
					<text class="amount">{{ item.amount }}</text>
					<u-icon name="arrow-right" size="16" color="#999"></u-icon>
				</view>
			</view>
			
			<view class="card-content">
				<view class="waiting-time">
					<text class="time-text">已等待 {{ calculateWaitingTime(item.createTime) }}</text>
				</view>
				
				<view class="bank-info" v-if="item.type === '1'">
					<view class="bank-details">
						<text class="bank-name">{{ item.bankName }}: {{ item.bankNumber }}</text>
					</view>
					<view class="copy-btn" @click.stop="copyBankInfo(item.bankNumber)">
						<text class="copy-text">复制</text>
					</view>
				</view>
				<view class="alipay-info" v-if="item.type === '0'">
					<view class="alipay-details">
						<text class="alipay-name">支付宝: {{ item.zfbNumber }}</text>
					</view>
					<view class="copy-btn" @click.stop="copyBankInfo(item.zfbNumber)">
						<text class="copy-text">复制</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多提示 -->
		<view class="load-more" v-if="hasMore && withdrawalList.length > 0">
			<text class="load-more-text">{{ loadingMore ? '加载中...' : '上拉加载更多' }}</text>
		</view>

		<!-- 没有更多数据提示 -->
		<view class="no-more" v-if="!hasMore && withdrawalList.length > 0">
			<text class="no-more-text">没有更多数据了</text>
		</view>

		<!-- 空状态 -->
		<view class="empty-state" v-if="filteredWithdrawalList.length === 0 && !refreshing">
			<u-icon name="file-text" size="80" color="#ccc"></u-icon>
			<text class="empty-text">暂无提现记录</text>
		</view>

		<!-- 提现明细弹窗 -->
		<u-popup :show="showDetailPopup" @close="showDetailPopup = false" mode="center" :closeable="true" close-icon-pos="top-right" :custom-style="{ borderRadius: '20rpx' }">
			<view class="detail-popup">
				<view class="popup-header">
					<text class="popup-title">{{ currentDetail.type === '0' ? '支付宝提现' : '银行卡提现' }}</text>
				</view>
				
				<view class="popup-content">
					<!-- 支付宝提现明细 -->
					<view v-if="currentDetail.type === '0'">
						<view class="detail-item">
							<text class="detail-label">提现人</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.name }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.name)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">UID</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.userId }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.userId)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">支付宝账号</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.zfbNumber }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.zfbNumber)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">手机号</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.phone }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.phone)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 银行卡提现明细 -->
					<view v-if="currentDetail.type === '1'">
						<view class="detail-item">
							<text class="detail-label">提现人</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.name }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.name)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">UID</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.userId }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.userId)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">银行名称</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.bankName }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.bankName)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
						
						<view class="detail-item">
							<text class="detail-label">银行卡号</text>
							<view class="detail-value">
								<text class="value-text">{{ currentDetail.bankNumber }}</text>
								<view class="copy-btn-small" @click="copyText(currentDetail.bankNumber)">
									<u-icon name="file-text" size="20" color="#007aff"></u-icon>
								</view>
							</view>
						</view>
					</view>
					
					<!-- 通用信息 -->
					<view class="detail-item">
						<text class="detail-label">提现金额(元)</text>
						<view class="detail-value">
							<text class="value-text amount-text">{{ currentDetail.amount }}</text>
						</view>
					</view>
					
					<view class="detail-item">
						<text class="detail-label">状态</text>
						<view class="detail-value">
							<text class="value-text status-text">已结算</text>
						</view>
					</view>
					
					<view class="detail-item">
						<text class="detail-label">备注</text>
						<view class="detail-value">
							<text class="value-text">{{ currentDetail.type === '0' ? '提现到支付宝' : '提现到银行卡' }}</text>
						</view>
					</view>
				</view>
				
				<!-- 确认打款按钮 -->
				<view class="popup-footer" v-if="currentDetail.state === '0'">
					<view class="btn-group">
						<view class="reject-btn" @click="rejectPayment">
							<text class="btn-text">驳回</text>
						</view>
						<view class="confirm-btn" @click="confirmPayment">
							<text class="btn-text">确认打款</text>
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 驳回原因输入弹窗 -->
		<u-popup :show="showRejectPopup" @close="showRejectPopup = false" mode="center" :closeable="true" close-icon-pos="top-right" :custom-style="{ borderRadius: '20rpx' }">
			<view class="reject-popup">
				<view class="popup-header">
					<text class="popup-title">驳回原因</text>
				</view>
				
				<view class="popup-content">
					<view class="input-wrapper">
						<textarea 
							class="remark-input" 
							v-model="rejectRemark" 
							placeholder="请输入驳回原因..."
							maxlength="200"
							:auto-height="true"
						></textarea>
						<view class="char-count">{{ rejectRemark.length }}/200</view>
					</view>
				</view>
				
				<view class="popup-footer">
					<view class="btn-group">
						<view class="cancel-btn" @click="showRejectPopup = false">
							<text class="btn-text">取消</text>
						</view>
						<view class="confirm-btn" @click="confirmRejectPayment">
							<text class="btn-text">确认驳回</text>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {
	widthdrawalList
} from "@/api/lotteryOrder.js"
import {
	examine
} from "@/api/user.js"

export default {
	data() {
		return {
			selectedMethod: 'bank', // alipay 或 bank
			alipayCount: 0,
			bankCount: 0,
			withdrawalList: [],
			// 查询参数
			queryParam: {
				state: "0", // 待审核状态
				pageNo: 1,
				pageSize: 10
			},
			refreshing: false, // 下拉刷新状态
			loadingMore: false, // 上拉加载更多状态
			hasMore: true, // 是否有更多数据
			showDetailPopup: false, // 提现明细弹窗显示状态
			currentDetail: {}, // 当前显示的提现明细
			showRejectPopup: false, // 驳回原因弹窗显示状态
			rejectRemark: '' // 驳回原因
		}
	},
	computed: {
		// 根据选择的提现方式过滤列表
		filteredWithdrawalList() {
			if (this.selectedMethod === 'alipay') {
				return this.withdrawalList.filter(item => item.type === '0');
			} else if (this.selectedMethod === 'bank') {
				return this.withdrawalList.filter(item => item.type === '1');
			}
			return this.withdrawalList;
		}
	},
	onLoad() {
		this.init();
	},
	onShow() {
		// 每次显示页面时刷新数据
		this.init();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.onRefresh();
	},
	// 上拉加载更多
	onReachBottom() {
		this.onLoadMore();
	},

	methods: {
		goBack() {
			uni.navigateBack()
		},
		goToHistory() {
			uni.navigateTo({
				url: '/pages/pay/withdrawalRecord'
			})
		},
		selectMethod(method) {
			this.selectedMethod = method
		},
		copyBankInfo(content) {
			uni.setClipboardData({
				data: content,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					})
				}
			})
		},
		// 初始化数据
		init() {
			this.queryParam.pageNo = 1; // 重置页码为1
			this.withdrawalList = []; // 清空列表
			this.hasMore = true; // 重置是否有更多数据
			this.loadData();
		},
		
		// 加载数据
		loadData() {
			if (!this.hasMore || this.loadingMore) {
				return;
			}
			this.loadingMore = true;
			uni.showLoading();
			widthdrawalList(this.queryParam).then(res => {
				const newList = res.voList || [];
				if (this.queryParam.pageNo === 1) {
					// 第一页，直接替换数据
					this.withdrawalList = newList;
				} else {
					// 加载更多，追加数据
					this.withdrawalList = [...this.withdrawalList, ...newList];
				}
				this.updateCounts();
				// 判断是否还有更多数据
				this.hasMore = newList.length === this.queryParam.pageSize;
				this.loadingMore = false;
				this.refreshing = false;
				uni.hideLoading();
				// 停止下拉刷新
				uni.stopPullDownRefresh();
			}).catch(err => {
				console.error('获取提现记录失败:', err);
				this.loadingMore = false;
				this.refreshing = false;
				uni.hideLoading();
				// 停止下拉刷新
				uni.stopPullDownRefresh();
			});
		},

		// 下拉刷新
		onRefresh() {
			this.refreshing = true;
			this.queryParam.pageNo = 1; // 重置页码为1
			this.hasMore = true; // 重置是否有更多数据
			this.loadData();
		},

		// 上拉加载更多
		onLoadMore() {
			if (this.hasMore && !this.loadingMore) {
				this.queryParam.pageNo++; // 页码加1
				this.loadData();
			}
		},
		
		// 更新支付宝和银行卡数量
		updateCounts() {
			this.alipayCount = this.withdrawalList.filter(item => item.type === '0').length;
			this.bankCount = this.withdrawalList.filter(item => item.type === '1').length;
			
			// 根据数据量自动选择默认页签
			if (this.alipayCount > 0 && this.bankCount > 0) {
				// 如果都大于0，默认选择支付宝
				this.selectedMethod = 'alipay';
			} else if (this.alipayCount > 0) {
				// 只有支付宝有数据
				this.selectedMethod = 'alipay';
			} else if (this.bankCount > 0) {
				// 只有银行卡有数据
				this.selectedMethod = 'bank';
			}
			// 如果都没有数据，保持当前选择
		},
		
		// 计算等待时间
		calculateWaitingTime(createTime) {
			if (!createTime) return '0时0分0秒';
			const createDate = new Date(createTime);
			const now = new Date();
			const diffMs = now - createDate;
			const hours = Math.floor(diffMs / (1000 * 60 * 60));
			const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
			return `${hours}时${minutes}分${seconds}秒`;
		},
		
		// 复制信息
		copyBankInfo(content) {
			if (!content) {
				uni.showToast({
					title: '复制内容为空',
					icon: 'none'
				});
				return;
			}
			
			uni.setClipboardData({
				data: content,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				},
				fail: () => {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
			});
		},

		// 显示提现明细弹窗
		showWithdrawalDetail(item) {
			console.log('点击了提现记录:', item);
			this.currentDetail = item;
			this.showDetailPopup = true;
			console.log('弹窗状态:', this.showDetailPopup);
		},

		// 复制文本
		copyText(content) {
			console.log('复制内容:', content);
			content = content+'';
			if (!content) {
				uni.showToast({
					title: '复制内容为空',
					icon: 'none'
				});
				return;
			}
			uni.setClipboardData({
				data: content,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				},
				fail: () => {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
			});
		},

		// 确认打款
		confirmPayment() {
			if (!this.currentDetail.id) {
				uni.showToast({
					title: '提现记录ID不存在',
					icon: 'none'
				});
				return;
			}
			uni.showLoading();
			examine({ 
				id: this.currentDetail.id,
				state: 1 // 确认打款状态
			}).then(res => {
				uni.hideLoading();
				uni.showToast({
					title: '确认打款成功',
					icon: 'success'
				});
				this.showDetailPopup = false;
				this.init(); // 刷新列表
			}).catch(err => {
				uni.hideLoading();
				console.error('确认打款失败:', err);
				uni.showToast({
					title: '确认打款失败',
					icon: 'none'
				});
			});
		},

		// 显示驳回原因输入弹窗
		rejectPayment() {
			this.rejectRemark = '';
			this.showRejectPopup = true;
		},

		// 确认驳回打款
		confirmRejectPayment() {
			if (!this.rejectRemark.trim()) {
				uni.showToast({
					title: '请输入驳回原因',
					icon: 'none'
				});
				return;
			}
			
			if (!this.currentDetail.id) {
				uni.showToast({
					title: '提现记录ID不存在',
					icon: 'none'
				});
				return;
			}
			
			this.showRejectPopup = false;
			uni.showLoading();
			examine({ 
				id: this.currentDetail.id,
				state: 2, // 驳回状态
				remark: this.rejectRemark.trim() // 驳回原因
			}).then(res => {
				uni.hideLoading();
				uni.showToast({
					title: '驳回成功',
					icon: 'success'
				});
				this.showDetailPopup = false;
				this.rejectRemark = '';
				this.init(); // 刷新列表
			}).catch(err => {
				uni.hideLoading();
				console.error('驳回失败:', err);
				uni.showToast({
					title: '驳回失败',
					icon: 'none'
				});
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.lottery-withdrawal-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.nav-header {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	
	.nav-left {
		width: 30%;
		display: flex;
		align-items: center;
		padding-left: 30rpx;
	}
	
	.nav-center {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.nav-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.nav-right {
		width: 30%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 30rpx;
		
		.nav-link {
			font-size: 28rpx;
			color: #007aff;
		}
	}
}

.withdrawal-methods {
	display: flex;
	padding: 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	
	.method-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		position: relative;
		
		.method-icon {
			margin-bottom: 10rpx;
		}
		
		.method-text {
			font-size: 28rpx;
			color: #999;
		}
		
		&.active {
			.method-text {
				color: #007aff;
				font-weight: bold;
			}
			
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 4rpx;
				background-color: #007aff;
				border-radius: 2rpx;
			}
		}
	}
}

.info-banner {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background-color: #fff7e6;
	margin: 20rpx 0;
	
	.banner-left {
		margin-right: 20rpx;
	}
	
	.banner-right {
		flex: 1;
		
		.banner-text {
			font-size: 26rpx;
			color: #666;
			line-height: 1.4;
		}
	}
}


.withdrawal-card {
	background-color: #fff;
	margin: 20rpx 30rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	margin-bottom: 20rpx;
	transition: all 0.3s ease;
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.15);
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.user-info {
			display: flex;
			align-items: center;
			
			.user-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.user-details {
				display: flex;
				flex-direction: column;
				
				.user-name {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 8rpx;
					text-decoration: underline;
					text-decoration-color: #ff6b6b;
				}
				
				.withdrawal-time {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.amount-info {
			display: flex;
			align-items: center;
			
			.amount {
				font-size: 48rpx;
				font-weight: bold;
				color: #333;
				margin-right: 10rpx;
			}
		}
	}
	
	.card-content {
		.waiting-time {
			margin-bottom: 20rpx;
			
			.time-text {
				font-size: 26rpx;
				color: #ff6b6b;
				font-weight: bold;
			}
		}
		
		.bank-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.bank-details {
				flex: 1;
				
				.bank-name {
					font-size: 28rpx;
					color: #333;
				}
			}
			
			.copy-btn {
				padding: 10rpx 20rpx;
				background-color: #007aff;
				border-radius: 8rpx;
				
				.copy-text {
					font-size: 24rpx;
					color: #fff;
				}
			}
		}
		
		.alipay-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.alipay-details {
				flex: 1;
				
				.alipay-name {
					font-size: 28rpx;
					color: #333;
				}
			}
			
			.copy-btn {
				padding: 10rpx 20rpx;
				background-color: #007aff;
				border-radius: 8rpx;
				
				.copy-text {
					font-size: 24rpx;
					color: #fff;
				}
			}
		}
	}
}

.load-more, .no-more {
	text-align: center;
	padding: 20rpx 0;
	color: #999;
	font-size: 28rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
	
	.empty-text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999;
	}
}

.detail-popup {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 20rpx;
	width: 95%;
	max-height: 90vh;
	overflow-y: auto;
	
	.popup-header {
		text-align: center;
		margin-bottom: 30rpx;
		
		.popup-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.popup-content {
		.detail-item {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.detail-label {
				font-size: 28rpx;
				color: #666;
				flex-shrink: 0;
				width: 200rpx;
				text-align: left;
			}
			
			.detail-value {
				display: flex;
				align-items: center;
				flex: 1;
				justify-content: flex-end;
				
				.value-text {
					font-size: 28rpx;
					color: #333;
					word-break: break-all;
					flex: 1;
					text-align: right;
					margin-right: 10rpx;
				}
				
				.copy-btn-small {
					padding: 5rpx;
					flex-shrink: 0;
					margin-left: 10rpx;
				}
			}
		}
		
		.amount-text {
			font-size: 36rpx;
			font-weight: bold;
			color: #ff6b6b;
		}
		
		.status-text {
			font-size: 28rpx;
			color: #007aff;
			font-weight: bold;
		}
	}

	.popup-footer {
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		display: flex;
		justify-content: center;

		.btn-group {
			display: flex;
			justify-content: space-around;
			width: 100%;

			.reject-btn, .confirm-btn {
				flex: 1;
				padding: 15rpx 20rpx;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 10rpx;
			}

			.reject-btn {
				background-color: #ff6b6b;
				border: 1rpx solid #ff6b6b;
			}

			.confirm-btn {
				background-color: #007aff;
				border: 1rpx solid #007aff;
			}

			.btn-text {
				font-size: 32rpx;
				color: #fff;
				font-weight: bold;
			}
		}
	}
}

.reject-popup {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 20rpx;
	width: 600rpx;
	
	.popup-header {
		text-align: center;
		margin-bottom: 30rpx;
		
		.popup-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.popup-content {
		.input-wrapper {
			position: relative;
			
			.remark-input {
				width: 100%;
				min-height: 200rpx;
				padding: 20rpx;
				border: 1rpx solid #e0e0e0;
				border-radius: 12rpx;
				font-size: 28rpx;
				line-height: 1.4;
				resize: none;
				box-sizing: border-box;
				
				&:focus {
					border-color: #007aff;
					outline: none;
				}
			}
			
			.char-count {
				position: absolute;
				bottom: 10rpx;
				right: 15rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}
	
	.popup-footer {
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
		
		.btn-group {
			display: flex;
			justify-content: space-between;
			gap: 20rpx;
			
			.cancel-btn, .confirm-btn {
				flex: 1;
				padding: 20rpx;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.cancel-btn {
				background-color: #f5f5f5;
				border: 1rpx solid #e0e0e0;
				
				.btn-text {
					font-size: 32rpx;
					color: #666;
				}
			}
			
			.confirm-btn {
				background-color: #ff6b6b;
				border: 1rpx solid #ff6b6b;
				
				.btn-text {
					font-size: 32rpx;
					color: #fff;
					font-weight: bold;
				}
			}
		}
	}
}
</style> 