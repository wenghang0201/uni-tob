<template>
	<view class="FBL" @click="handleDetails" >
		<view class="top-row">
			<view class="icon-tag-wrapper">
				<u-icon :name="item.ballUrl" :label="item.ballName" size="24" label-color="#000" label-pop="right" customStyle="font-weight: bold;"></u-icon>
				<u-tag v-if="item.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
				<u-tag v-if="item.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
				<u-tag v-if="item.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
			</view>
			<view class="LBTLLUL-state">
				<span :style="item.state=='3'||item.state=='4'?'color: var(--themeColor);':'color: #000000;'">
					{{item|formatState}}
					<span v-if="item.state == '5' && (item.cancelReasonDesc || item.cancelReasonTypeStr)">
						({{ item.cancelReasonDesc || item.cancelReasonTypeStr }})
					</span>
				</span>
			</view>
		</view>
		<view class="divider"></view>
		<view class="order-number-row">
			<text class="order-number-label">订单编号：</text>
			<text class="order-number-value">{{item.orderId}}</text>
			<view class="copy-btn" @click.stop="copyOrderNumber">
				<u-icon name="file-text" size="14" color="#999"></u-icon>
			</view>
		</view>
		<view class="user-amount-row">
			<view class="LBTLLUL-name">
				<span>注数:{{item.notes}}</span>
			</view>
			<view class="LBTLLUL-name">
				<span style="color: #333;">投注金额：</span>
				<span style="color: #ff6666;">{{item.price}}元</span>
			</view>
		</view>
		<view class="user-amount-row">
			<view class="LBTLLUL-name">
				<span>用户:{{item.storeRemark || item.nickname}}</span>
			</view>
		</view>

		<view v-if="item.winPrice != undefined && (item.state == '3' || item.state == '4')" class="LBTLLUL-winning">中奖金额：
			<span style="color: var(--themeColor);font-size: 14px; font-weight: bold;">{{item.winPrice}}</span>
		</view>
		<view class="LBTLLUL-time" v-if="['5', '6', '7'].includes(item.state)">下单时间：<span
				style="font-size: 13px;">{{item.createTime}}</span>
		</view>
		<view class="LBTLLUL-time" v-if="['1', '2', '3'].includes(item.state)">出票时间：<span
				style="font-size: 13px;">{{item.ticketingTime}}</span>
		</view>
		<view class="LBTLLUL-time" v-if="['4'].includes(item.state)">派奖时间：<span
				style="font-size: 13px;">{{item.prizePaymentTime}}</span>
		</view>
		<view class="LBTLLUL-time" v-if="item.state == '0' && item.acceptanceDeadline">
			接单截止：<span style="color: #ff5500; font-size: 13px; font-weight: bold;">{{ item.acceptanceDeadline }}</span>
		</view>
		<view class="LBTLLUR-bottom">
			<view class="bottom-right">
				<view class="action-container" v-if="item.state == '0' && !isDeadlinePassed">
					<view class="BR-r" @click.stop="handleAcceptOrder">
						<view>接单</view>
						<span class="button-countdown" v-if="showCountdown">
							{{ remainingTime }}
						</span>
					</view>
				</view>
				<view class="action-container" v-if="item.state == '0' && isDeadlinePassed">
					<view class="BR-r expired-button">
						<view>超时订单</view>
					</view>
				</view>

				<view class="action-container" v-if="item.state == '7'">
					<view class="BR-r" @click.stop="handleGoToOrderDetail">出票</view>
				</view>

				<view class="action-container" v-if="item.state == '3'">
					<view class="BR-r" @click.stop="handlePaijiang">派奖</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'OrderItem',
	props: {
		item: {
			type: Object,
			required: true
		},
		currentTime: {
			type: Number,
			default: Date.now()
		}
	},
	computed: {
		isDeadlinePassed() {
			if (!this.item || this.item.state !== '0' || !this.item.acceptanceDeadline) {
				return false;
			}
			const deadlineTime = new Date(this.item.acceptanceDeadline).getTime();
			return deadlineTime <= this.currentTime;
		},
		showCountdown() {
			if (!this.item.acceptanceDeadline) return false;
			const deadlineTime = new Date(this.item.acceptanceDeadline).getTime();
			return this.getRemainingTime() && (deadlineTime - this.currentTime <= 3600 * 1000);
		},
		remainingTime() {
			return this.getRemainingTime();
		}
	},
	methods: {
		handleDetails() {
			this.$emit('details', this.item.jointPurchaseId || this.item.id, this.item.hasGroupPurchase);
		},
		handleAcceptOrder() {
			this.$emit('accept-order', this.item);
		},
		handleGoToOrderDetail() {
			this.$emit('go-to-order-detail', this.item.jointPurchaseId || this.item.id, this.item.hasGroupPurchase);
		},
		handlePaijiang() {
			this.$emit('paijiang', this.item.id);
		},
		copyOrderNumber() {
			uni.setClipboardData({
				data: this.item.orderId,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				}
			});
		},
		getRemainingTime() {
			if (!this.item.acceptanceDeadline) {
				return null;
			}

			const deadlineTime = new Date(this.item.acceptanceDeadline).getTime();
			const diff = deadlineTime - this.currentTime;

			if (diff <= 0) {
				return null;
			}

			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			const formattedHours = String(hours).padStart(2, '0');
			const formattedMinutes = String(minutes).padStart(2, '0');
			const formattedSeconds = String(seconds).padStart(2, '0');

			return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
		}
	},
	filters: {
		formatDate(data) {
			return data;
		},
		formatState(data) {
			if (data.state == 0) return "待接单";
			if (data.state == 1) return "待开奖";
			if (data.state == 2) return "未中奖";
			if (data.state == 3) return "待派奖";
			if (data.state == 4) return "已派奖";
			if (data.state == 5) return [(data.cancelEmployeeName), "拒绝"].filter(v=>!!v).join('-');
			if (data.state == 6) return "退票";
			if (data.state == 7) return "待出票";
			if (data.state == 8) return "合买";
			if (data.state == 100) return "认购中";
			if (data.state == 101) return "已满员";
			if (data.state == 102) return "已截止";
			if (data.state == 103) return "进行中";
			if (data.state == 104) return "已完成";
			if (data.state == 105) return "成单失败";
			if (data.state == 110) return "未中奖";
			if (data.state == 111) return "已中奖";
			return data.state;
		}
	}
}
</script>

<style lang="scss" scoped>
.FBL {
	width: 90%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 10upx;
	overflow: hidden;
	background-color: #ffffff;
	margin: 20upx auto;
	padding: 20upx;
	.top-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15upx;

		.icon-tag-wrapper {
			display: flex;
			align-items: center;
			margin-bottom: 0;
			gap: 10px;
		}

		.LBTLLUL-state {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
		}
	}

	.divider {
		height: 1px;
		background-color: #eeeeee;
		margin: 15upx 0;
	}

	.order-number-row {
		display: flex;
		align-items: center;
		margin-bottom: 15upx;
		font-size: 26rpx;
		color: #999;

		.order-number-label {
			margin-right: 10upx;
		}

		.order-number-value {
			margin-right: 10upx;
		}

		.copy-btn {
			display: flex;
			align-items: center;
			padding: 4upx 12upx;
			background: #f5f5f5;
			border-radius: 4upx;

			.u-icon {
				color: #333 !important;
			}
		}
	}

	.user-amount-row {
		width: 80%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15upx;

		.LBTLLUL-name {
			color: #4a4a4a;
			font-size: 26rpx;
			font-weight: normal;
		}

		.top-text {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			font-weight: normal;

			span {
				color: #333;
			}

			:deep(.u-text) {
				color: #ff6666;
			}
		}
	}

	.LBTLLUL-state {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;

		span {
			color: #333;
			font-weight: bold;
		}
	}

	.LBTLLUL-winning {
		padding-bottom: 15upx;
	}

	.LBTLLUL-time {
		padding-bottom: 15upx;
		color: #999;
		font-size: 26rpx;

		span {
			color: #999;
		}
	}

	.LBTLLU-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.LBTLLUR-top {
			.top-text {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: var(--themeColor);
				font-size: 14px;
				font-weight: bold;

				span {
					color: #333;
				}
			}
		}
	}
	.LBTLLUR-bottom {
		width: 100%;
		font-size: 12px;
		display: flex;
		flex-direction: row;
		color: #000;

		.bottom-right {
			color: #ffffff;
			width: 100%;
			display: flex;
			justify-content: flex-end;

			.action-container {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 10upx;

				.BR-r {
					border-radius: 10upx;
					padding: 5px 20px;
					margin-bottom: 20upx;
					background: var(--themeColor);
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #ffffff;
					font-size: 14px;
				}

				.expired-button {
					background-color: #f56c6c !important;
					color: #ffffff;
					cursor: not-allowed;
				}
			}
		}
}
}

.button-countdown {
	font-size: 22upx;
	color: #fff600;
	margin-top: 5upx;
}
</style>