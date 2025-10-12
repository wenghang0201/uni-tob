<template>
	<view class="box">
		<nav-bar :title="lottery.name + '管理'" :back="true"></nav-bar>
		
		<view class="content-container" v-if="!isLoading">
			<view class="setting-item">
				<view class="item-left">
					<view class="item-title">彩种开关</view>
					<view class="item-desc">关闭后,用户无法看到此彩种,谨慎操作!</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.status" @change="updateSetting('status')"></u-switch>
				</view>
			</view>
			
			<!-- <view class="setting-item" v-if="settingVisibility.liveStatus">
				<view class="item-left">
					<view class="item-title">上下线状态</view>
					<view class="item-desc">开启表示上线状态，彩种可正常使用；关闭表示下线状态，彩种暂停使用</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.liveStatus" @change="updateSetting('liveStatus')"></u-switch>
				</view>
			</view> -->

			<!-- <view class="setting-item" v-if="settingVisibility.ticketStatus">
				<view class="item-left">
					<view class="item-title">出票开关</view>
					<view class="item-desc">{{lottery.ticketStatus ? '手动出票模式，用户下单后需手动出票' : '自动派单模式，用户下单后系统自动派单'}}</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.ticketStatus" @change="updateSetting('ticketStatus')"></u-switch>
				</view>
			</view> -->

			<!-- <view class="setting-item" v-if="settingVisibility.unionBuySwitch">
				<view class="item-left">
					<view class="item-title">合买开关</view>
					<view class="item-desc">关闭后,用户无法发起{{lottery.name}}合买,也无法参与{{lottery.name}}合买。</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.unionBuySwitch" @change="updateSetting('unionBuySwitch')"></u-switch>
				</view>
			</view> -->

			<view class="setting-item" v-if="settingVisibility.betRatioSwitch">
				<view class="item-left">
					<view class="item-title">号码投注比例开关</view>
					<view class="item-desc">关闭后,用户在投注区看不到号码投注比例</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.betRatioSwitch" @change="updateSetting('betRatioSwitch')"></u-switch>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.forbidComplexPlan">
				<view class="item-left">
					<view class="item-title">禁止复杂方案</view>
					<view class="item-desc">开启后,用户下单时允许的方案组合不超过4个</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.forbidComplexPlan" @change="updateSetting('forbidComplexPlan')"></u-switch>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.allowMultiSelect">
				<view class="item-left">
					<view class="item-title">投注方案其中一场玩法多选</view>
					<view class="item-desc">开启后,用户投注时只能选择其中一场比赛进行玩法多选</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.allowMultiSelect" @change="updateSetting('allowMultiSelect')"></u-switch>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.allowBonusOptimize">
				<view class="item-left">
					<view class="item-title">是否允许奖金优化</view>
					<view class="item-desc">开启后,本店用户投注时可选择奖金优化</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.allowBonusOptimize" @change="updateSetting('allowBonusOptimize')"></u-switch>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.allowMNCombo">
				<view class="item-left">
					<view class="item-title">M串N组合过关</view>
					<view class="item-desc">关闭后,用户投注时无法使用M串N组合过关</view>
				</view>
				<view class="item-right">
					<u-switch v-model="lottery.allowMNCombo" @change="updateSetting('allowMNCombo')"></u-switch>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.officialEndTime" @click="updateTime">
				<view class="item-left">
					<view class="item-title">官方截止时间</view>
					<view class="item-desc">请根据官方{{lottery.name}}截止时间进行设定</view>
				</view>
				<view class="item-right">
					<text>{{lottery.officialEndTime}}</text>
					<u-icon name="arrow-right" size="28rpx" color="#999"></u-icon>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.advanceEndTime" @click="updateAdvanceTime">
				<view class="item-left">
					<view class="item-title">用户投注截止时间提前</view>
					<view class="item-desc">用户需在官方截止时间前{{lottery.advanceEndTime}}分钟下单</view>
				</view>
				<view class="item-right">
					<text>{{lottery.advanceEndTime}}分钟</text>
					<u-icon name="arrow-right" size="28rpx" color="#999"></u-icon>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.minBet" @click="updateMinBet">
				<view class="item-left">
					<view class="item-title">用户投注最低金额</view>
					<view class="item-desc">用户投注时低于此金额无法投注成功</view>
				</view>
				<view class="item-right">
					<text>{{lottery.minBet}}元</text>
					<u-icon name="arrow-right" size="28rpx" color="#999"></u-icon>
				</view>
			</view>
			
			<view class="setting-item" v-if="settingVisibility.minUnionBet" @click="updateMinUnionBet">
				<view class="item-left">
					<view class="item-title">追期投注最低金额</view>
					<view class="item-desc">用户追号时低于此金额无法投注成功</view>
				</view>
				<view class="item-right">
					<text>{{lottery.minUnionBet}}元</text>
					<u-icon name="arrow-right" size="28rpx" color="#999"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 加载中 -->
		<view class="loading-container" v-if="isLoading">
			<u-loading-icon></u-loading-icon>
			<text>加载中...</text>
		</view>
		
		<!-- 时间选择弹窗 -->
		<u-picker 
			:show="showTimePicker"
			:columns="timeColumns"
			@confirm="onTimeConfirm"
			@cancel="showTimePicker = false"
		></u-picker>
		
		<!-- 数字输入弹窗 -->
		<u-popup :show="showNumberInput" mode="center" @close="showNumberInput = false">
			<view class="number-input-popup">
				<view class="popup-title">{{inputTitle}}</view>
				<u-input 
					v-model="inputValue"
					type="number"
					:placeholder="inputPlaceholder"
				></u-input>
				<view class="popup-buttons">
					<button @click="showNumberInput = false">取消</button>
					<button @click="confirmNumberInput" type="primary">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { updateLotterySetting, getLotteryList } from '@/api/lottery.js'
	import navBar from '@/components/nav-bar/nav-bar.vue'
	import uLoadingIcon from 'uview-ui/components/u-loading-icon/u-loading-icon.vue'
	import uSwitch from 'uview-ui/components/u-switch/u-switch.vue'
	import uIcon from 'uview-ui/components/u-icon/u-icon.vue'
	import uPicker from 'uview-ui/components/u-picker/u-picker.vue'
	import uPopup from 'uview-ui/components/u-popup/u-popup.vue'
	import uInput from 'uview-ui/components/u-input/u-input.vue'
	
	export default {
		components: {
			navBar,
			uLoadingIcon,
			uSwitch,
			uIcon,
			uPicker,
			uPopup,
			uInput
		},
		data() {
			return {
				isLoading: false,
				lottery: {
					id: '',
					name: '',
					status: false,
					liveStatus: true,
					ticketStatus: false,
					unionBuySwitch: false,
					betRatioSwitch: false,
					forbidComplexPlan: false,
					allowMultiSelect: false,
					allowBonusOptimize: false,
					allowMNCombo: false,
					officialEndTime: '20:10',
					advanceEndTime: 10,
					minBet: 2,
					minUnionBet: 0
				},
				// 控制各个设置项的显示
				settingVisibility: {
					status: false,
					liveStatus: false,
					ticketStatus: false,
					unionBuySwitch: false,
					betRatioSwitch: false,
					forbidComplexPlan: false,
					allowMultiSelect: false,
					allowBonusOptimize: false,
					allowMNCombo: false,
					officialEndTime: false,
					advanceEndTime: false,
					minBet: false,
					minUnionBet: false
				},
				originalLotteryData: null,
				showTimePicker: false,
				timeColumns: [
					{
						values: Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')),
						defaultIndex: 20
					},
					{
						values: Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')),
						defaultIndex: 10
					}
				],
				showNumberInput: false,
				inputTitle: '',
				inputPlaceholder: '',
				inputValue: '',
				currentSetting: ''
			}
		},
		onLoad(option) {
			if (option.id) {
				this.lottery.id = Number(option.id);
				this.lottery.name = decodeURIComponent(option.name || '');
				
				this.fetchLotteryDetails(this.lottery.id);
				
			} else {
				uni.showToast({
					title: '参数错误',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		methods: {
			fetchLotteryDetails(id) {
				this.isLoading = true;
				getLotteryList()
					.then(res => {
						if (res.success && res.voList) {
							const foundItem = res.voList.find(item => item.id === id);
							if (foundItem) {
								this.originalLotteryData = { ...foundItem };
								
								this.settingVisibility.status = 'guessSwitch' in foundItem || 'status' in foundItem;
								this.settingVisibility.liveStatus = 'line' in foundItem;
								this.settingVisibility.ticketStatus = 'ticketSwitch' in foundItem || 'ticketStatus' in foundItem;
								this.settingVisibility.unionBuySwitch = 'groupBuySwitch' in foundItem || 'unionBuySwitch' in foundItem;
								this.settingVisibility.betRatioSwitch = 'betRatioSwitch' in foundItem;
								this.settingVisibility.forbidComplexPlan = 'forbidComplexPlan' in foundItem;
								this.settingVisibility.allowMultiSelect = 'allowMultiSelect' in foundItem;
								this.settingVisibility.allowBonusOptimize = 'allowBonusOptimize' in foundItem;
								this.settingVisibility.allowMNCombo = 'allowMNCombo' in foundItem;
								this.settingVisibility.officialEndTime = 'officialEndTime' in foundItem;
								this.settingVisibility.advanceEndTime = 'betDeadlineAdvance' in foundItem || 'advanceEndTime' in foundItem;
								this.settingVisibility.minBet = 'minBetAmount' in foundItem || 'minBet' in foundItem;
								this.settingVisibility.minUnionBet = 'minUnionBet' in foundItem;

								this.lottery = {
									id: foundItem.id,
									name: foundItem.name || this.lottery.name,
									status: foundItem.line === '0',
									liveStatus: foundItem.guessSwitch === 1 || false,
									ticketStatus: foundItem.ticketSwitch === 1 || foundItem.ticketStatus === 1 || false,
									unionBuySwitch: foundItem.groupBuySwitch === 1 || foundItem.unionBuySwitch === 1 || false,
									betRatioSwitch: foundItem.betRatioSwitch === 1 || false,
									forbidComplexPlan: foundItem.forbidComplexPlan === 1 || false,
									allowMultiSelect: foundItem.allowMultiSelect === 1 || false,
									allowBonusOptimize: foundItem.allowBonusOptimize === 1 || false,
									allowMNCombo: foundItem.allowMNCombo === 1 || false,
									officialEndTime: foundItem.officialEndTime || '20:10',
									advanceEndTime: foundItem.betDeadlineAdvance || foundItem.advanceEndTime || 0,
									minBet: foundItem.minBetAmount || foundItem.minBet || 2,
									minUnionBet: foundItem.minUnionBet || 0
								};
								
							} else {
								uni.showToast({ title: '未找到该彩种信息', icon: 'none' });
								setTimeout(() => uni.navigateBack(), 1500);
							}
						} else {
							uni.showToast({ title: res.errorMsg || '获取彩种列表失败', icon: 'none' });
							setTimeout(() => uni.navigateBack(), 1500);
						}
					})
					.catch(err => {
						console.error('获取彩种列表错误:', err);
						setTimeout(() => uni.navigateBack(), 1500);
					})
					.finally(() => {
						setTimeout(() => {
							this.isLoading = false;
						}, 300); 
					});
			},
			updateSetting(type) {
				const titles = {
					status: '彩种开关',
					liveStatus: '上下线状态',
					ticketStatus: '出票开关',
					unionBuySwitch: '合买开关',
					betRatioSwitch: '号码投注比例开关',
					forbidComplexPlan: '禁止复杂方案',
					allowMultiSelect: '投注方案其中一场玩法多选',
					allowBonusOptimize: '是否允许奖金优化',
					allowMNCombo: 'M串N组合过关'
				};
				
				// 转换值为开启/关闭文本
				const value = this.lottery[type] ? '开启' : '关闭';
				
				uni.showModal({
					title: titles[type] || '设置',
					content: `确认${value}?`,
					success: (res) => {
						if (res.confirm) {
							this.saveSetting(type);
						} else {
							// 取消操作，恢复原值
							this.lottery[type] = !this.lottery[type];
						}
					}
				});
			},

			// 保存设置
			saveSetting(type) {
				if (!this.originalLotteryData) {
					uni.showToast({ title: '无法保存，原始数据丢失', icon: 'none' });
					return;
				}

				uni.showLoading({
					title: '保存中...'
				});

				// 创建一个空的数据对象
				const data = {
					id: this.lottery.id
				};

				// 只添加原始数据中存在的字段, 并处理别名和值转换
				if ('line' in this.originalLotteryData) {
					// line字段值为'0'表示上线，'1'表示下线
					data.line = this.lottery.status ? '0' : '1';
				}

				if ('guessSwitch' in this.originalLotteryData) {
					// guessSwitch是彩种开关
					data.guessSwitch = this.lottery.liveStatus ? 1 : 0;
				}

				// 处理 ticketStatus/ticketSwitch 别名
				if ('ticketSwitch' in this.originalLotteryData) {
					data.ticketSwitch = this.lottery.ticketStatus ? 1 : 0;
				} else if ('ticketStatus' in this.originalLotteryData) {
					// 如果API返回的是 ticketStatus，则用 ticketSwitch 更新
					data.ticketSwitch = this.lottery.ticketStatus ? 1 : 0;
				}
				
				// 处理 groupBuySwitch/unionBuySwitch 别名
				if ('groupBuySwitch' in this.originalLotteryData) {
					data.groupBuySwitch = this.lottery.unionBuySwitch ? 1 : 0;
				} else if ('unionBuySwitch' in this.originalLotteryData) {
					data.groupBuySwitch = this.lottery.unionBuySwitch ? 1 : 0;
				}
				
				// 处理 betDeadlineAdvance/advanceEndTime 别名
				if ('betDeadlineAdvance' in this.originalLotteryData) {
					data.betDeadlineAdvance = Number(this.lottery.advanceEndTime);
				} else if ('advanceEndTime' in this.originalLotteryData) {
					data.betDeadlineAdvance = Number(this.lottery.advanceEndTime);
				}
				
				// 处理 minBetAmount/minBet 别名
				if ('minBetAmount' in this.originalLotteryData) {
					data.minBetAmount = Number(this.lottery.minBet);
				} else if ('minBet' in this.originalLotteryData) {
					data.minBetAmount = Number(this.lottery.minBet);
				}
				
				// 添加其他字段，但仅当它们存在于原始数据中
				if ('forbidComplexPlan' in this.originalLotteryData) {
					data.forbidComplexPlan = this.lottery.forbidComplexPlan ? 1 : 0;
				}
				
				if ('allowMultiSelect' in this.originalLotteryData) {
					data.allowMultiSelect = this.lottery.allowMultiSelect ? 1 : 0;
				}
				
				if ('allowBonusOptimize' in this.originalLotteryData) {
					data.allowBonusOptimize = this.lottery.allowBonusOptimize ? 1 : 0;
				}
				
				if ('allowMNCombo' in this.originalLotteryData) {
					data.allowMNCombo = this.lottery.allowMNCombo ? 1 : 0;
				}
				
				if ('officialEndTime' in this.originalLotteryData) {
					data.officialEndTime = this.lottery.officialEndTime;
				}
				
				if ('minUnionBet' in this.originalLotteryData) {
					data.minUnionBet = Number(this.lottery.minUnionBet);
				}
				
				// 如果有 displayOrder 字段，也加上 (假设值为0，根据实际需求调整)
				if ('displayOrder' in this.originalLotteryData) {
				    data.displayOrder = this.originalLotteryData.displayOrder || 0; 
				}

				updateLotterySetting(data)
					.then(res => {
						uni.hideLoading();
						if (res.success) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: res.errorMsg || '保存失败',
								icon: 'none'
							});
							// 保存失败，恢复原值 - 保留所有字段的恢复逻辑
							if (['status', 'liveStatus', 'ticketStatus', 'unionBuySwitch', 'betRatioSwitch', 
								 'forbidComplexPlan', 'allowMultiSelect', 'allowBonusOptimize', 
								 'allowMNCombo'].includes(type)) {
								this.lottery[type] = !this.lottery[type];
							}
						}
					})
					.catch(err => {
						// 保存失败，恢复原值 - 保留所有字段的恢复逻辑
						if (['status', 'liveStatus', 'ticketStatus', 'unionBuySwitch', 'betRatioSwitch', 
							 'forbidComplexPlan', 'allowMultiSelect', 'allowBonusOptimize', 
							 'allowMNCombo'].includes(type)) {
							this.lottery[type] = !this.lottery[type];
						}
					});
			},
			
			// 更新时间
			updateTime() {
				// 解析当前时间
				const [hour, minute] = this.lottery.officialEndTime.split(':');
				this.timeColumns[0].defaultIndex = parseInt(hour);
				this.timeColumns[1].defaultIndex = parseInt(minute);
				
				this.currentSetting = 'officialEndTime';
				this.showTimePicker = true;
			},
			
			// 时间选择确认
			onTimeConfirm(e) {
				this.showTimePicker = false;
				const [hour, minute] = e.value;
				const timeStr = `${hour}:${minute}`;
				
				// 更新时间
				if (this.currentSetting === 'officialEndTime') {
					this.lottery.officialEndTime = timeStr;
					this.saveSetting('officialEndTime');
				}
			},
			
			// 更新提前时间
			updateAdvanceTime() {
				this.inputTitle = '投注截止时间提前';
				this.inputPlaceholder = '请输入分钟数';
				this.inputValue = this.lottery.advanceEndTime.toString();
				this.currentSetting = 'advanceEndTime';
				this.showNumberInput = true;
			},
			
			// 更新最低投注金额
			updateMinBet() {
				this.inputTitle = '最低投注金额';
				this.inputPlaceholder = '请输入金额';
				this.inputValue = this.lottery.minBet.toString();
				this.currentSetting = 'minBet';
				this.showNumberInput = true;
			},
			
			// 更新最低合买金额
			updateMinUnionBet() {
				this.inputTitle = '追期投注最低金额';
				this.inputPlaceholder = '请输入金额';
				this.inputValue = this.lottery.minUnionBet.toString();
				this.currentSetting = 'minUnionBet';
				this.showNumberInput = true;
			},
			
			// 确认数字输入
			confirmNumberInput() {
				if (this.inputValue === '') {
					uni.showToast({
						title: '请输入有效数值',
						icon: 'none'
					});
					return;
				}
				
				const value = Number(this.inputValue);
				if (isNaN(value) || value < 0) {
					uni.showToast({
						title: '请输入有效数值',
						icon: 'none'
					});
					return;
				}
				
				// 关闭弹窗
				this.showNumberInput = false;
				
				// 根据当前设置类型更新对应的值
				this.lottery[this.currentSetting] = value;
				this.saveSetting(this.currentSetting);
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}
	
	.content-container {
		padding: 20rpx 0;
	}
	
	.setting-item {
		background-color: #fff;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rpx;
		
		.item-left {
			flex: 1;
			
			.item-title {
				font-size: 32rpx;
				color: #333;
				margin-bottom: 8rpx;
				font-weight: 500;
			}
			
			.item-desc {
				font-size: 24rpx;
				color: #999;
				line-height: 1.5;
			}
		}
		
		.item-right {
			display: flex;
			align-items: center;
			
			text {
				margin-right: 10rpx;
				color: #666;
				font-size: 28rpx;
			}
		}
	}
	
	.loading-container {
		padding: 100rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		text {
			margin-top: 20rpx;
			color: #999;
			font-size: 28rpx;
		}
	}
	
	.number-input-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		
		.popup-title {
			font-size: 32rpx;
			color: #333;
			text-align: center;
			font-weight: 500;
			margin-bottom: 30rpx;
		}
		
		.popup-buttons {
			display: flex;
			margin-top: 30rpx;
			
			button {
				flex: 1;
				margin: 0 10rpx;
				font-size: 28rpx;
			}
		}
	}
</style> 