<template>
	<view class="w-100vw h-100vh">
		<nav-bar :title="'员工彩种配置'" :back="true"></nav-bar>

		<view class="flex align-center justify-between p-20" v-for="(item, index) in lotteryList" :key="index"
			@click="modifyLottery(item)">
			<view class="flex align-center gap-20">
				<image :src="item.url || '/static/images/personal/caizhoguanli.png'" mode="scaleToFill"
					class="w-110 h-110" />
				<view class="flex flex-col justify-center gap-10">
					<view class="fs-28">{{ item.name }}</view>
					<view class="fs-28 c-999">
						<template v-if="staffLotteryConfig[item.id] && staffLotteryConfig[item.id].amountLimitStatus === 1">
							接单金额
							<span style="color:red">{{ ` ${staffLotteryConfig[item.id].minAmount} ` }}</span>-
							<span style="color:red">{{ ` ${staffLotteryConfig[item.id].maxAmount} ` }}</span>元
						</template>
						<template v-else>
							{{ '无金额限制' }}
						</template>
					</view>
				</view>
			</view>
			<view class="flex align-center">
				<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
			</view>
		</view>

		<!-- 加载中 -->
		<view class="flex flex-col items-center justify-center py-100" v-if="isLoading">
			<u-loading-icon></u-loading-icon>
			<text class="mt-20 c-999 fs-28">加载中...</text>
		</view>

		<!-- 空状态 -->
		<view class="flex flex-col items-center justify-center py-100" v-if="!isLoading && lotteryList.length === 0">
			<image src="/static/images/empty.png" mode="aspectFit" class="w-200 h-200 mb-20"></image>
			<text class="c-999 fs-28">暂无彩种信息</text>
		</view>

		<u-popup :show="showPopup" :overlay="true" round="40rpx" @close="closePopup">
			<view class="flex flex-col items-center justify-center">
				<view class="p-20 font-bold">{{ currentLottery ? currentLottery.name : '彩种配置' }}</view>
				<view class="flex flex-col justify-start align-center w-full p-20 gap-30 box-border">
					<u-radio-group class="gap-40" v-model="limitType" placement="column" iconPlacement="right">
						<u-radio :name="0" label="不限制金额"></u-radio>
						<u-radio :name="1" label="接单金额限制"></u-radio>
					</u-radio-group>
					<view class="flex justify-between align-center gap-20" v-if="limitType === 1">
						<u-input
							v-model="minAmount"
							placeholder="最小金额"
							suffixIcon="元"
							suffixIconStyle="color: #909399"
							type="number"
						></u-input>
						<u-icon name="minus" />
						<u-input
							v-model="maxAmount"
							placeholder="最大金额"
							suffixIcon="元"
							suffixIconStyle="color: #909399"
							type="number"
						></u-input>
					</view>
					<view class="box-border w-full mt-20">
						<u-button type="primary" @click="saveLotteryConfig">保存</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getLotteryList } from '@/api/lottery.js'
import request from '@/util/ajax'
import navBar from '@/components/nav-bar/nav-bar.vue'

// 获取员工彩种配置
function getUserGameConfig(data) {
  return request({
    url: '/app/config/usergameconfig/getUserGameConfig',
    method: 'post',
    data
  })
}

// 更新员工彩种配置
function setUserGameConfig(data) {
  return request({
    url: '/app/config/usergameconfig/setUserGameConfig',
    method: 'post',
    data
  })
}

export default {
	components: {
		navBar
	},
	data() {
		return {
			staffId: '',
			userId: '',
			lotteryList: [],
			isLoading: false,
			staffLotteryConfig: {}, // 存储员工彩种配置，格式: {lotteryId: true/false}
			showPopup: false,
			currentLottery: null,
			limitType: 0, // 0: 不限制金额, 1: 接单金额限制
			minAmount: '',
			maxAmount: ''
		}
	},
	onLoad(options) {
		this.userId = options.userId;
		this.staffId = options.id || '';

		// 加载彩种列表
		this.loadLotteryList();
	},
	// 支持下拉刷新
	onPullDownRefresh() {
		Promise.all([
			this.loadLotteryList(),
		]).finally(() => {
			uni.stopPullDownRefresh();
		});
	},
	methods: {
		// 加载彩种列表和员工彩种配置
		async loadLotteryList() {
			this.isLoading = true;
			this.staffLotteryConfig = {}; // 重置配置

			try {
				// 获取彩种列表
				const res = await getLotteryList();

				if (res.success) {
					// 处理彩种列表数据
					this.lotteryList = res.voList || [];

					// 获取每个彩种的员工配置
					for (const item of this.lotteryList) {
						await this.loadGameConfig(item);
					}
				} else {
					uni.showToast({
						title: res.errorMsg || '获取彩种列表失败',
						icon: 'none'
					});
				}
			} catch (err) {
				console.error('获取彩种列表失败:', err);
				uni.showToast({
					title: '获取彩种列表失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		// 获取单个彩种的员工配置
		async loadGameConfig(game) {
			try {
				const res = await getUserGameConfig({
					userId: this.userId,
					gameId: game.id
				});

				if (res.success) {
					// 保存配置信息
					this.staffLotteryConfig[game.id] = {
						acceptOrderStatus: res.acceptOrderStatus || 0,
						amountLimitStatus: res.amountLimitStatus || 0,
						minAmount: res.minAmount || 0,
						maxAmount: res.maxAmount || 0
					};
				}
			} catch (err) {
				console.error(`获取彩种${game.id}配置失败:`, err);
			}
		},

		// 修改彩种配置
		modifyLottery(item) {
			this.currentLottery = item;

			// 设置当前配置
			const config = this.staffLotteryConfig[item.id] || {};
			this.limitType = config.amountLimitStatus || 0;
			this.minAmount = config.minAmount || '';
			this.maxAmount = config.maxAmount || '';

			// 显示弹窗
			this.showPopup = true;
		},

		// 关闭弹窗
		closePopup() {
			this.showPopup = false;
			this.currentLottery = null;
			this.limitType = 0;
			this.minAmount = '';
			this.maxAmount = '';
		},

		// 保存彩种配置
		async saveLotteryConfig() {
			if (!this.currentLottery) return;

			// 验证金额输入
			if (this.limitType === 1) {
				const min = parseFloat(this.minAmount);
				const max = parseFloat(this.maxAmount);

				if (isNaN(min) || min <= 0) {
					uni.showToast({
						title: '请输入有效的最小金额',
						icon: 'none'
					});
					return;
				}

				if (isNaN(max) || max <= 0) {
					uni.showToast({
						title: '请输入有效的最大金额',
						icon: 'none'
					});
					return;
				}

				if (min >= max) {
					uni.showToast({
						title: '最小金额必须小于最大金额',
						icon: 'none'
					});
					return;
				}
			}

			// 准备保存的配置数据
			const config = {
				acceptOrderStatus: 1, // 默认开启接单
				amountLimitStatus: this.limitType,
				minAmount: this.limitType === 1 ? parseFloat(this.minAmount) : 0,
				maxAmount: this.limitType === 1 ? parseFloat(this.maxAmount) : 0
			};

			// 更新本地配置
			this.staffLotteryConfig[this.currentLottery.id] = config;

			uni.showLoading({
				title: '保存中...'
			});

			try {
				// 调用API保存配置
				const res = await setUserGameConfig({
					userId: this.userId,
					gameId: this.currentLottery.id,
					acceptOrderStatus: config.acceptOrderStatus,
					amountLimitStatus: config.amountLimitStatus,
					minAmount: config.minAmount,
					maxAmount: config.maxAmount
				});

				uni.hideLoading();

				if (res.success) {
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});

					// 关闭弹窗
					this.closePopup();
				} else {
					uni.showToast({
						title: res.errorMsg || '保存失败',
						icon: 'none'
					});
				}
			} catch (err) {
				uni.hideLoading();
				console.error('保存彩种配置异常:', err);

				uni.showToast({
					title: '保存失败，请稍后再试',
					icon: 'none'
				});
			}
		}
	}
}
</script>
