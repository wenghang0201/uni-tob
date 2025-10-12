<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'代理统计'" :back="true"></nav-bar>

		<!-- 内容区域 -->
		<view class="content">
			<!-- 统计卡片 -->
			<view class="stats-card">
				<view class="card-header">
					<view class="date-selector" @click="showDatePicker">
						<view class="date-text">{{ selectedYear }}年{{ selectedMonth }}月</view>
						<u-icon name="arrow-down" color="#333" size="20"></u-icon>
					</view>
				</view>

				<view class="card-content">
					<view class="stats-item" @click="goToAgentRegisterStats()">
						<view class="stats-label">本月代理注册</view>
						<view class="stats-value">{{ statsData.registerCount }}人</view>
					</view>
					<view class="stats-item" @click="goToAgentSalesStats()">
						<view class="stats-label">本月代理销售</view>
						<view class="stats-value">{{ statsData.salesAmount }}元</view>
					</view>
					<view class="stats-item" @click="goToAgentCommissionStats()">
						<view class="stats-label">本月应付佣金</view>
						<view class="stats-value">{{ statsData.commission }}元</view>
					</view>
				</view>
			</view>

			<!-- 代理列表标题 -->
			<view class="list-title">
				<text>代理列表 ({{ agentList.length }}个)</text>
			</view>

			<!-- 代理列表 -->
			<view class="agent-list">
				<view class="agent-card" v-for="(agent, index) in agentList" :key="index"
					@click="goToAgentDetail(agent)">
					<view class="agent-info">
						<u-avatar v-if="agent.avatar" :src="agent.avatar" size="40"></u-avatar>
						<u-avatar v-else src="/static/images/default-avatar.png" size="40"></u-avatar>
						<view class="agent-name">{{ agent.name }}</view>
						<u-icon name="arrow-right" color="#999" size="24"></u-icon>
					</view>
					<view class="agent-details">
						<view class="detail-item">
							<view class="detail-label">活跃天数</view>
							<view class="detail-value">{{ agent.days }}天</view>
						</view>
						<view class="detail-item">
							<view class="detail-label">销售金额</view>
							<view class="detail-value">{{ agent.sales }}元</view>
						</view>
						<view class="detail-item">
							<view class="detail-label">佣金比例</view>
							<view class="detail-value">{{ agent.rate }}%</view>
						</view>
						<view class="detail-item">
							<view class="detail-label">状态</view>
							<view class="detail-value">
								<u-switch v-model="agent.status" @change="(value) => changeAgentStatus(agent, value)"
									size="22"></u-switch>
							</view>
						</view>
					</view>
				</view>

				<!-- 无数据显示 -->
				<u-empty v-if="agentList.length === 0" mode="data" text="暂无代理数据"></u-empty>
			</view>
		</view>

		<!-- 日期选择器弹出层 -->
		<u-datetime-picker :show="showPicker" v-model="currentDate" mode="year-month" :min-date="minDate"
			:max-date="maxDate" @confirm="confirmDate" @cancel="cancelDate"></u-datetime-picker>

		<!-- 加载动画 -->
		<u-loading-page :loading="isLoading"></u-loading-page>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/nav-bar.vue'
import { getStoreAgentStatisticsList, getAgentMonthlyStatistics } from '@/api/user.js'

export default {
	components: {
		navBar
	},
	data() {
		const now = new Date();
		const currentYear = now.getFullYear().toString();
		const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
		return {
			selectedYear: currentYear,
			selectedMonth: currentMonth,
			currentDate: new Date(`${currentYear}-${currentMonth}-01`).getTime(),
			minDate: new Date('2020-01-01').getTime(),
			maxDate: new Date('2030-12-31').getTime(),
			showPicker: false,
			isLoading: false,
			// 统计数据
			statsData: {
				registerCount: 0,
				salesAmount: 0,
				commission: 0
			},
			// 代理列表
			agentList: [],
			// 分页参数
			pageNo: 1,
			pageSize: 10,
			hasMore: true
		}
	},
	onLoad() {
		// 加载代理统计数据
		this.loadAgentStats();
		this.loadMonthlyStats();
	},
	onReachBottom() {
		if (this.hasMore && !this.isLoading) {
			this.pageNo++;
			this.loadAgentStats();
		}
	},
	methods: {
		// 加载月度统计数据
		loadMonthlyStats() {
			const statisticalMonth = `${this.selectedYear}-${this.selectedMonth}`;
			getAgentMonthlyStatistics(statisticalMonth).then(res => {
				console.log('月度统计返回:', res);

				if (res.success) {
					this.statsData = {
						registerCount: res.registeredAgents,
						salesAmount: res.salesAmount.toFixed(2),
						commission: res.commission.toFixed(2)
					};
				} else {
					uni.showToast({
						title: res.errorMsg || '获取月度统计失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				console.error('获取月度统计失败:', err);
			});
		},

		// 加载代理统计数据
		loadAgentStats() {
			if (this.isLoading) return;
			this.isLoading = true;

			const params = {
				pageNo: this.pageNo,
				pageSize: this.pageSize
			};

			getStoreAgentStatisticsList(params).then(res => {
				console.log('代理统计返回:', res);

				if (res.success) {
					// 处理返回的数据
					const list = res.voList.map(item => ({
						id: item.id,
						name: item.storeRemark || item.nickname,
						avatar: item.avatar,
						days: item.durationDays,
						sales: item.totalSales,
						rate: item.commissionRate,
						status: item.agentStatus === 1
					}));

					// 更新列表数据
					if (this.pageNo === 1) {
						this.agentList = list;
					} else {
						this.agentList = [...this.agentList, ...list];
					}

					// 更新是否有更多数据
					this.hasMore = this.agentList.length < res.total;
				} else {
					uni.showToast({
						title: res.errorMsg || '获取数据失败',
						icon: 'none'
					});
				}

				this.isLoading = false;
			}).catch(err => {
				console.error('获取代理统计失败:', err);
				this.isLoading = false;
			});
		},

		// 显示日期选择器
		showDatePicker() {
			this.showPicker = true;
		},

		// 确认日期选择
		confirmDate(timestamp) {
			const date = new Date(timestamp.value);
			this.selectedYear = date.getFullYear().toString();
			this.selectedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
			this.showPicker = false;

			// 重置分页并重新加载数据
			this.pageNo = 1;
			this.hasMore = true;
			this.loadAgentStats();
			this.loadMonthlyStats();
		},

		// 取消日期选择
		cancelDate() {
			this.showPicker = false;
		},

		// 切换代理状态
		changeAgentStatus(agent, value) {
			// TODO: 调用API更新代理状态
			const statusText = value ? '启用' : '禁用';
			this.$u.toast(`已${statusText}该代理`);
		},

		// 跳转到代理详情页
		goToAgentDetail(agent) {
			uni.navigateTo({
				url: `/pages/agent/detail?id=${agent.id}`
			});
		},

		// 跳转到代理注册用户统计页面
		goToAgentRegisterStats() {
			// uni.navigateTo({
			// 	url: `/pages/agent/user?year=${this.selectedYear}&month=${this.selectedMonth}`
			// });
		},

		// 跳转到代理销售统计页面
		goToAgentSalesStats() {
			// uni.navigateTo({
			// 	url: `/pages/agent/sales?year=${this.selectedYear}&month=${this.selectedMonth}`
			// });
		},

		// 跳转到代理佣金统计页面
		goToAgentCommissionStats() {
			// uni.navigateTo({
			// 	url: `/pages/agent/commission?year=${this.selectedYear}&month=${this.selectedMonth}`
			// });
		}
	}
}
</script>

<style lang="scss" scoped>
.content {}

.stats-card {
	background-color: #fff;
	border-radius: 12px;
	margin: 10px;
	padding: 10px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.card-header {
	display: flex;
	align-items: start;
}

.date-selector {
	display: flex;
	align-items: center;
	justify-content: center;
}

.date-text {
	font-size: 16px;
	margin-right: 5px;
	font-weight: 500;
	color: #333;
}

.card-content {
	display: flex;
	justify-content: space-between;
	gap: 10px;
}

.stats-item {
	flex: 1;
	text-align: center;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 5px;
}

.stats-label {
	font-size: 14px;
	color: #999;
	margin-bottom: 8px;
}

.stats-value {
	font-size: 18px;
	color: #2979ff;
	font-weight: 500;
}

.list-title {
	margin: 10px;
	font-size: 16px;
	color: #333;
	font-weight: 500;
}

.agent-list {
	margin: 0 10px;
}

.agent-card {
	background-color: #fff;
	border-radius: 12px;
	margin-bottom: 15px;
	padding: 0;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	overflow: hidden;
}

.agent-info {
	display: flex;
	align-items: center;
	padding: 10px;
	border-bottom: 1px solid #f2f2f2;
}

.agent-name {
	flex: 1;
	margin-left: 10px;
	font-size: 16px;
	color: #333;
}

.agent-details {
	padding: 10px 10px;
	display: flex;
	flex-wrap: wrap;
}

.detail-item {
	width: 25%;
	margin: 5px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: 5px;
}

.detail-label {
	font-size: 14px;
	color: #999;
}

.detail-value {
	font-size: 14px;
	color: #333;
	font-weight: 500;
}

.empty-data {
	text-align: center;
	margin-top: 50px;
	padding: 30px;
}

.empty-text {
	margin-top: 10px;
	color: #999;
	font-size: 14px;
}
</style>