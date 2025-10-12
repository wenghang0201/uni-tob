<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="navTitle" :back="true"></nav-bar>
		
		<view class="form-content">
			<!-- 新人红包表单 -->
			<template v-if="redPacketType === 'new_user'">
				<view class="form-item">
					<view class="item-label">红包个数</view>
					<view class="item-content">
						<input type="number" v-model="count" placeholder="请输入" />
						<text class="unit">个</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">单个红包金额</view>
					<view class="item-content">
						<input type="digit" v-model="amount" placeholder="请输入" />
						<text class="unit">元</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showLotterySelector">
					<view class="item-label">可用彩种</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedLottery">请选择</text>
						<text v-else>{{selectedLottery}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showBetTypeSelector">
					<view class="item-label">可用投注方式</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedBetType">请选择</text>
						<text v-else>{{selectedBetType}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">红包有效期</view>
					<view class="item-content">
						<input type="number" v-model="expireDays" placeholder="请输入" />
						<text class="unit">天</text>
					</view>
				</view>
			</template>
			
			<!-- 满减红包表单 -->
			<template v-else-if="redPacketType === 'discount'">
				<view class="form-item">
					<view class="item-label">投注金额</view>
					<view class="item-content">
						<input type="digit" v-model="betAmount" placeholder="请输入" />
						<text class="unit">元</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">优惠金额</view>
					<view class="item-content discount-content">
						<view class="discount-input">
							<input type="digit" v-model="minDiscount" placeholder="最少" />
						</view>
						<text class="discount-separator">至</text>
						<view class="discount-input">
							<input type="digit" v-model="maxDiscount" placeholder="最多" />
						</view>
						<text class="unit">元</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showLotterySelector">
					<view class="item-label">可用彩种</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedLottery">请选择</text>
						<text v-else>{{selectedLottery}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showBetTypeSelector">
					<view class="item-label">可用投注方式</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedBetType">请选择</text>
						<text v-else>{{selectedBetType}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">红包个数</view>
					<view class="item-content">
						<input type="number" v-model="count" placeholder="请输入" />
						<text class="unit">个</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">红包有效期</view>
					<view class="item-content">
						<input type="number" v-model="expireDays" placeholder="请输入" />
						<text class="unit">天</text>
					</view>
				</view>
			</template>
			
			<!-- 立减红包表单 -->
			<template v-else-if="redPacketType === 'direct'">
				<view class="form-item">
					<view class="item-label">红包个数</view>
					<view class="item-content">
						<input type="number" v-model="count" placeholder="请输入" />
						<text class="unit">个</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">单个红包金额</view>
					<view class="item-content">
						<input type="digit" v-model="amount" placeholder="请输入" />
						<text class="unit">元</text>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showLotterySelector">
					<view class="item-label">可用彩种</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedLottery">请选择</text>
						<text v-else>{{selectedLottery}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item" @click="showBetTypeSelector">
					<view class="item-label">可用投注方式</view>
					<view class="item-content">
						<text class="placeholder" v-if="!selectedBetType">请选择</text>
						<text v-else>{{selectedBetType}}</text>
						<view class="item-arrow">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
				
				<view class="divider"></view>
				
				<view class="form-item">
					<view class="item-label">红包有效期</view>
					<view class="item-content">
						<input type="number" v-model="expireDays" placeholder="请输入" />
						<text class="unit">天</text>
					</view>
				</view>
			</template>
		</view>
		
		<view class="btn-submit" @click="submitRedPacket">
			发放红包
		</view>
		
		<!-- 彩种选择器 -->
		<u-action-sheet 
			:show="showLotterySheet" 
			:actions="lotteryOptions" 
			title="选择彩种"
			@close="showLotterySheet = false"
			@select="selectLottery"
			:round="10"
			cancel-text="取消"
		></u-action-sheet>
		
		<!-- 投注方式选择器 -->
		<u-action-sheet 
			:show="showBetTypeSheet" 
			:actions="betTypeOptions" 
			title="选择投注方式"
			@close="showBetTypeSheet = false"
			@select="selectBetType"
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
			navTitle: '发红包',
			redPacketType: 'new_user', // 默认新人红包
			typeMap: {
				'new_user': '新人红包',
				'discount': '满减红包',
				'direct': '立减红包'
			},
			// 基本表单数据
			count: '', // 红包个数
			amount: '', // 单个红包金额
			expireDays: '7', // 红包有效期（天）
			
			// 满减红包特有数据
			betAmount: '', // 投注金额
			minDiscount: '', // 最小优惠金额
			maxDiscount: '', // 最大优惠金额
			
			// 彩种相关
			selectedLottery: '全部彩种', // 选中的彩种
			showLotterySheet: false,
			lotteryOptions: [
				{ text: '全部彩种', name: '全部彩种' },
				{ text: '竞彩足球', name: '竞彩足球' },
				{ text: '竞彩篮球', name: '竞彩篮球' },
				{ text: '排列三', name: '排列三' },
				{ text: '大乐透', name: '大乐透' }
			],
			
			// 投注方式相关
			selectedBetType: '全部玩法', // 选中的投注方式
			showBetTypeSheet: false,
			betTypeOptions: [
				{ text: '全部玩法', name: '全部玩法' },
				{ text: '单关', name: '单关' },
				{ text: '2串1', name: '2串1' },
				{ text: '3串1', name: '3串1' },
				{ text: '4串1', name: '4串1' }
			]
		}
	},
	onLoad(options) {
		// 根据传入的type参数设置红包类型
		if (options.type) {
			this.redPacketType = options.type;
			// 设置标题
			this.navTitle = this.typeMap[options.type] || '发红包';
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		showLotterySelector() {
			this.showLotterySheet = true;
		},
		selectLottery(item) {
			this.selectedLottery = item.name;
		},
		showBetTypeSelector() {
			this.showBetTypeSheet = true;
		},
		selectBetType(item) {
			this.selectedBetType = item.name;
		},
		validateForm() {
			// 基本验证
			if (!this.count) {
				uni.showToast({
					title: '请输入红包个数',
					icon: 'none'
				});
				return false;
			}
			
			// 根据不同红包类型进行验证
			if (this.redPacketType === 'new_user' || this.redPacketType === 'direct') {
				if (!this.amount) {
					uni.showToast({
						title: '请输入红包金额',
						icon: 'none'
					});
					return false;
				}
			} else if (this.redPacketType === 'discount') {
				if (!this.betAmount) {
					uni.showToast({
						title: '请输入投注金额',
						icon: 'none'
					});
					return false;
				}
				
				if (!this.minDiscount || !this.maxDiscount) {
					uni.showToast({
						title: '请输入优惠金额范围',
						icon: 'none'
					});
					return false;
				}
			}
			
			if (!this.selectedLottery) {
				uni.showToast({
					title: '请选择可用彩种',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.selectedBetType) {
				uni.showToast({
					title: '请选择可用投注方式',
					icon: 'none'
				});
				return false;
			}
			
			if (!this.expireDays) {
				uni.showToast({
					title: '请输入红包有效期',
					icon: 'none'
				});
				return false;
			}
			
			return true;
		},
		submitRedPacket() {
			if (!this.validateForm()) return;
			
			// 这里添加发送红包的逻辑
			uni.showLoading({
				title: '发送中'
			});
			
			// 构建红包数据
			const redPacketData = {
				type: this.redPacketType,
				count: this.count,
				expireDays: this.expireDays,
				lottery: this.selectedLottery,
				betType: this.selectedBetType
			};
			
			// 根据红包类型添加特定数据
			if (this.redPacketType === 'new_user' || this.redPacketType === 'direct') {
				redPacketData.amount = this.amount;
			} else if (this.redPacketType === 'discount') {
				redPacketData.betAmount = this.betAmount;
				redPacketData.minDiscount = this.minDiscount;
				redPacketData.maxDiscount = this.maxDiscount;
			}
			
			console.log('红包数据', redPacketData);
			
			// 模拟网络请求
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '发送成功',
					icon: 'success'
				});
				
				// 返回红包列表页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}, 1000);
		}
	}
}
</script>

<style lang="scss" scoped>
.form-content {
	background-color: #ffffff;
	margin-top: 15px;
}

.form-item {
	display: flex;
	padding: 15px;
	align-items: center;
	height: 60px;
	box-sizing: border-box;
	
	.item-label {
		width: 40%;
		font-size: 16px;
		color: #333;
		font-weight: 500;
	}
	
	.item-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		
		input {
			text-align: right;
			height: 40px;
			font-size: 16px;
			min-width: 80px;
		}
		
		.placeholder {
			color: #cccccc;
		}
		
		.unit {
			margin-left: 10px;
			color: #666;
			min-width: 20px;
			text-align: right;
		}
		
		.item-arrow {
			margin-left: 10px;
			
			.arrow {
				font-size: 20px;
				color: #cccccc;
				transform: rotate(90deg);
				display: inline-block;
			}
		}
		
		// 满减红包特有样式
		&.discount-content {
			display: flex;
			align-items: center;
			
			.discount-input {
				display: flex;
				align-items: center;
				
				input {
					width: 70px;
					text-align: center;
					height: 34px;
				}
			}
			
			.discount-separator {
				margin: 0 10px;
				color: #666;
			}
		}
	}
}

.divider {
	height: 1px;
	background-color: #f5f5f5;
	margin-left: 15px;
}

.btn-submit {
	margin: 30px 15px;
	height: 45px;
	line-height: 45px;
	text-align: center;
	background-color: #4080FF;
	color: #ffffff;
	font-size: 16px;
	border-radius: 5px;
}
</style> 