<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'应付佣金统计'" :back="true"></nav-bar>
		
		<!-- 内容区域 -->
		<view class="content">
			<!-- 月份选择器 -->
			<view class="month-picker" @click="showMonthPicker">
				<text class="month-text">{{year}}年{{month}}月</text>
				<u-icon name="arrow-down" color="#333" size="14"></u-icon>
			</view>
			
			<!-- 佣金列表 -->
			<view class="commission-list">
				<view class="commission-item" v-for="(item, index) in commissionList" :key="index">
					<view class="agent-info">
						<view class="avatar">
							<u-avatar src="/static/images/default-avatar.png" size="50"></u-avatar>
						</view>
						<view class="agent-content">
							<view class="agent-name">{{item.name}}</view>
							<view class="agent-phone">
								<text>*****</text>
								<u-icon name="phone" color="#999" size="14"></u-icon>
							</view>
						</view>
					</view>
					<view class="commission-info">
						<view class="info-row">
							<view class="info-label">月份</view>
							<view class="info-value">销售额 (元)</view>
							<view class="info-value">佣金比例</view>
							<view class="info-value">佣金</view>
						</view>
						<view class="info-row">
							<view class="info-label">{{month}}月</view>
							<view class="info-value">{{item.salesAmount}}</view>
							<view class="info-value">{{item.commissionRate}}%</view>
							<view class="info-value">{{item.commission}}</view>
						</view>
					</view>
				</view>
				
				<!-- 无数据显示 -->
				<u-empty v-if="commissionList.length === 0" mode="data" text="暂无佣金数据"></u-empty>
			</view>
			
			<!-- 底部总计 -->
			<view class="footer">
				<text>总计: ¥{{totalCommission}}</text>
			</view>
		</view>
		
		<!-- 月份选择器弹出层 -->
		<u-datetime-picker
			:show="showPicker"
			v-model="dateValue"
			mode="year-month"
			:min-date="minDate"
			:max-date="maxDate"
			@confirm="confirmDate"
			@cancel="cancelPicker"
		></u-datetime-picker>
		
		<!-- 加载动画 -->
		<u-loading-page :loading="isLoading"></u-loading-page>
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
				year: '',
				month: '',
				dateValue: new Date().getTime(),
				showPicker: false,
				minDate: new Date('2020-01-01').getTime(),
				maxDate: new Date('2030-12-31').getTime(),
				isLoading: false,
				totalCommission: 60.42,
				// 佣金列表
				commissionList: [
					{
						id: 1,
						name: '大哥大',
						avatar: '',
						phone: '*****',
						salesAmount: 2014,
						commissionRate: 3,
						commission: 60.42
					},
					{
						id: 2,
						name: 'D',
						avatar: '',
						phone: '*****',
						salesAmount: 20,
						commissionRate: 0,
						commission: 0
					}
				]
			}
		},
		onLoad(options) {
			// 获取传入的年月参数
			this.year = options.year || new Date().getFullYear();
			this.month = options.month || (new Date().getMonth() + 1).toString().padStart(2, '0');
			
			// 设置初始日期
			const initialDate = new Date(this.year, parseInt(this.month) - 1);
			this.dateValue = initialDate.getTime();
			
			// 加载佣金数据
			this.loadCommissionData();
		},
		methods: {
			// 加载佣金数据
			loadCommissionData() {
				// 这里应该调用API获取数据
				// 模拟API请求延迟
				this.isLoading = true;
				setTimeout(() => {
					this.isLoading = false;
					// 实际开发中，这里应该通过API获取数据
					// 计算总佣金
					this.calculateTotal();
				}, 500);
			},
			
			// 计算总佣金
			calculateTotal() {
				let total = 0;
				this.commissionList.forEach(item => {
					total += parseFloat(item.commission);
				});
				this.totalCommission = total.toFixed(2);
			},
			
			// 显示月份选择器
			showMonthPicker() {
				this.showPicker = true;
			},
			
			// 确认月份选择
			confirmDate(timestamp) {
				const date = new Date(timestamp.value);
				this.dateValue = timestamp.value;
				this.year = date.getFullYear().toString();
				this.month = (date.getMonth() + 1).toString().padStart(2, '0');
				this.showPicker = false;
				
				// 加载选中月份的数据
				this.loadCommissionData();
			},
			
			// 取消月份选择
			cancelPicker() {
				this.showPicker = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
	padding-top: 10px;
	padding-bottom: 60px;
}

.month-picker {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 15px 10px;
	padding: 8px 0;
	border-radius: 0;
	width: auto;
	gap: 5px;
}

.month-text {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

.commission-list {
	margin: 0 10px;
}

.commission-item {
	background-color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
	padding: 15px;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.agent-info {
	display: flex;
	align-items: center;
	margin-bottom: 15px;
}

.avatar {
	margin-right: 10px;
}

.agent-content {
	flex: 1;
}

.agent-name {
	font-size: 13px;
	color: #333;
	font-weight: 500;
	margin-bottom: 5px;
}

.agent-phone {
	display: flex;
	align-items: center;
	gap: 5px;
	color: #999;
	font-size: 11px;
}

.commission-info {
	border-top: 1px solid #f0f0f0;
	padding-top: 10px;
}

.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 5px;
}

.info-label {
	width: 25%;
	color: #666;
	font-size: 12px;
}

.info-value {
	width: 25%;
	text-align: center;
	font-size: 12px;
	color: #333;
}

.footer {
	position: fixed;
	bottom: 0;
	right: 0;
	padding: 15px 20px;
	background-color: #fff;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
	width: 100%;
	text-align: right;
	font-size: 16px;
	color: #333;
	z-index: 100;
}
</style> 