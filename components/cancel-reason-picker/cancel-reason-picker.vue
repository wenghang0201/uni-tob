@ -0,0 +1,155 @@
<template>
	<u-popup :show="show" mode="center" :round="8" @close="$emit('close')" closeable
	         @touchmove.stop.prevent="()=>{}" @tap.stop="" :overlay="true">
		<view class="reason-popup" @touchmove.stop.prevent>
			<view class="popup-title">请选择撤单原因</view>
			<scroll-view scroll-y="true" class="popup-scroll-content cancel-reason-scroll" @touchmove.stop>
				<u-radio-group v-model="selectedType" placement="column" class="radio-group-column">
					<u-radio v-for="(item, index) in reasons" :key="item.type" :name="item.type" :label="item.name"
						class="reason-radio"></u-radio>
				</u-radio-group>

				<!-- 自定义原因输入框 -->
				<view v-if="selectedType === 17" class="custom-reason-input">
					<u-textarea v-model="customDesc" placeholder="请输入自定义原因描述" maxlength="100"
						:autoHeight="true"></u-textarea>
				</view>
			</scroll-view>
			<view class="popup-footer flex justify-around">
				<u-button @click="$emit('close')" shape="circle" size="normal" customStyle="width: 40%">取消</u-button>
				<u-button @click="confirm" type="primary" shape="circle" size="normal"
					customStyle="width: 40%">确认</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'cancel-reason-picker',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		// 提供默认的撤单原因列表，也可以从父组件传入
		reasonList: {
			type: Array,
			default: () => [
				{ type: 11, name: '订单逾期' },
				{ type: 12, name: '票数太多' },
				{ type: 13, name: '订单较多，忙不过来' },
				{ type: 14, name: '联系不到客户' },
				{ type: 15, name: '中心限制订单，无法出票' },
				{ type: 16, name: '来不及出票，赔率变化' },
				{ type: 17, name: '自定义' }
			]
		}
	},
	data() {
		return {
			selectedType: null, // 选中的撤单原因类型 (radio v-model)
			customDesc: '', // 自定义撤单原因描述
		}
	},
	computed: {
		reasons() {
			return this.reasonList;
		}
	},
	methods: {
		// 确认按钮处理
		confirm() {
			// 验证是否选择了撤单原因
			if (this.selectedType === null) {
				uni.showToast({ title: '请选择撤单原因', icon: 'none' });
				return;
			}

			// 如果是自定义，检查描述是否为空
			if (this.selectedType === 17 && !this.customDesc.trim()) {
				uni.showToast({ title: '请输入自定义原因描述', icon: 'none' });
				return;
			}

			// 找到对应的原因对象
			const selectedReason = this.reasons.find(r => r.type === this.selectedType);

			if (selectedReason) {
				// 向父组件发送选中的原因和描述
				this.$emit('confirm', {
					reason: selectedReason,
					description: this.selectedType === 17 ? this.customDesc : ''
				});
			} else {
				uni.showToast({ title: '选择原因出错，请重试', icon: 'none' });
			}
		},
		// 重置选择和自定义描述
		reset() {
			this.selectedType = null;
			this.customDesc = '';
		}
	},
	watch: {
		// 监听show属性，当弹窗关闭时重置数据
		show(newVal) {
			if (!newVal) {
				this.reset();
			}
		}
	}
}
</script>

<style scoped lang="scss">
/* 撤单原因选择器样式 */
.reason-popup {
	width: 650rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	max-height: 85vh;
	min-height: 700rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
}

.popup-scroll-content {
	flex: 1;
	max-height: calc(80vh - 160rpx);
	overflow-y: auto;
}

.cancel-reason-scroll {
	height: 400rpx;
	max-height: 60vh;
	overflow-y: auto;
}

.radio-group-column {
	display: flex;
	flex-direction: column;
}

.reason-radio {
	margin-bottom: 25rpx;
}

.custom-reason-input {
	margin-top: 20rpx;
}

.popup-footer {
	padding: 20rpx 0;
	border-top: 1px solid #eee;
	margin-top: 20rpx;
}
</style> 