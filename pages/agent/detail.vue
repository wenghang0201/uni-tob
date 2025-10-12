<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'代理数据'" :back="true" :right-text="'修改佣金'" @rightTextClick="modifyCommission"></nav-bar>
		
		<!-- 内容区域 -->
		<view class="content">
			<!-- 选项卡 -->
			<view class="tabs">
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'register' }" 
					@click="changeTab('register')"
				>
					注册数据
				</view>
				<view 
					class="tab-item" 
					:class="{ active: activeTab === 'bet' }" 
					@click="changeTab('bet')"
				>
					投注数据
				</view>
			</view>
			
			<!-- 日期选择 -->
			<view class="date-picker">
				<view class="date-item" @click="showStartDatePicker">
					<text>{{startDate}}</text>
					<u-icon name="arrow-down" color="#333" size="14"></u-icon>
				</view>
				<text class="date-separator">——</text>
				<view class="date-item" @click="showEndDatePicker">
					<text>{{endDate}}</text>
					<u-icon name="arrow-down" color="#333" size="14"></u-icon>
				</view>
			</view>
			
			<!-- 用户列表 -->
			<view class="user-list" v-if="activeTab === 'register'">
				<view class="user-item" v-for="(item, index) in userList" :key="index" @click="viewUserDetail(item.id)">
					<view class="user-avatar">
						<u-avatar src="/static/images/default-avatar.png" size="60"></u-avatar>
					</view>
					<view class="user-info">
						<view class="user-name">{{item.name}}</view>
						<view class="user-time">{{item.registerTime}}</view>
					</view>
					<view class="user-account">
						<view class="account-text">账户余额: ¥{{item.balance}}</view>
						<view class="view-btn">查看</view>
					</view>
				</view>
				
				<!-- 无数据显示 -->
				<u-empty v-if="userList.length === 0" mode="data" text="暂无用户数据"></u-empty>
			</view>
			
			<!-- 投注列表 -->
			<view class="user-list" v-if="activeTab === 'bet'">
				<view class="user-item" v-for="(item, index) in betList" :key="index">
					<view class="user-avatar">
						<u-avatar src="/static/images/default-avatar.png" size="60"></u-avatar>
					</view>
					<view class="user-info">
						<view class="user-name">{{item.name}}</view>
						<view class="bet-type">{{item.betType}}</view>
						<view class="user-time">{{item.betTime}}</view>
					</view>
					<view class="user-account">
						<view class="account-text">订单金额: ¥{{item.amount}}</view>
						<view class="view-btn" @click.stop="viewOrderDetail(item.id)">查看</view>
					</view>
				</view>
				
				<!-- 无数据显示 -->
				<u-empty v-if="betList.length === 0" mode="data" text="暂无投注数据"></u-empty>
			</view>
			
			<!-- 底部统计 -->
			<view class="footer">
				<text>总计: {{activeTab === 'register' ? userList.length + '人' : '¥' + totalBetAmount}}</text>
			</view>
		</view>
		
		<!-- 日期选择器弹出层 -->
		<u-datetime-picker
			:show="showStartPicker"
			v-model="startDateValue"
			mode="date"
			:min-date="minDate"
			:max-date="maxDate"
			@confirm="confirmStartDate"
			@cancel="cancelDatePicker('start')"
		></u-datetime-picker>
		
		<u-datetime-picker
			:show="showEndPicker"
			v-model="endDateValue"
			mode="date"
			:min-date="minDate"
			:max-date="maxDate"
			@confirm="confirmEndDate"
			@cancel="cancelDatePicker('end')"
		></u-datetime-picker>
		
		<!-- 加载动画 -->
		<u-loading-page :loading="isLoading"></u-loading-page>

		<!-- 修改佣金比例弹出框 -->
		<u-popup :show="showCommissionPopup" mode="center" :round="10">
			<view class="commission-popup">
				<view class="popup-title">设置代理佣金比例</view>
				<view class="input-container">
					<input type="digit" class="rate-input" v-model="selectedRate" placeholder="请输入佣金比例" @input="validateInput" />
					<text class="rate-unit">%</text>
				</view>
				<view class="rate-options">
					<view 
						class="rate-option" 
						v-for="rate in commissionRates" 
						:key="rate" 
						:class="{ active: selectedRate === rate }"
						@click="selectedRate = rate"
					>
						{{rate}}%
					</view>
				</view>
				<view class="popup-buttons">
					<view class="popup-btn cancel-btn" @click="showCommissionPopup = false">取消</view>
					<view class="popup-btn confirm-btn" @click="confirmCommissionChange">确认</view>
				</view>
			</view>
		</u-popup>
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
				agentId: '',
				activeTab: 'bet', // register 注册数据, bet 投注数据
				startDate: '',
				endDate: '',
				startDateValue: new Date().getTime(),
				endDateValue: new Date().getTime(),
				showStartPicker: false,
				showEndPicker: false,
				minDate: new Date('2020-01-01').getTime(),
				maxDate: new Date('2030-12-31').getTime(),
				isLoading: false,
				totalBetAmount: 20,
				// 佣金设置
				showCommissionPopup: false,
				selectedRate: 0,
				commissionRates: ['1', '1.5', '2', '2.5', '3'],
				// 用户列表
				userList: [
					{
						id: 1,
						name: '罗马狼王',
						avatar: '',
						registerTime: '2025-03-17 15:39:09',
						balance: 0
					},
					{
						id: 2,
						name: '陈真',
						avatar: '',
						registerTime: '2025-03-10 21:26:26',
						balance: 0
					},
					{
						id: 3,
						name: '彩店宝L5EHSVuS',
						avatar: '',
						registerTime: '2025-03-06 12:51:38',
						balance: 0
					},
					{
						id: 4,
						name: '彩店宝e3G9Svoq',
						avatar: '',
						registerTime: '2025-03-05 14:10:56',
						balance: 0
					},
					{
						id: 5,
						name: '彩店宝6u9BpLur',
						avatar: '',
						registerTime: '2025-03-05 00:49:57',
						balance: 0
					},
					{
						id: 6,
						name: '彩店宝tnkaSy0z',
						avatar: '',
						registerTime: '2025-03-04 22:45:19',
						balance: 0
					},
					{
						id: 7,
						name: '彩店宝老刘',
						avatar: '',
						registerTime: '2025-03-04 20:56:52',
						balance: 0
					}
				],
				// 投注列表
				betList: [
					{
						id: 1,
						name: '彩店宝gd95C7a9',
						avatar: '',
						betType: '竞彩足球',
						betTime: '2025-03-15 21:06:12',
						amount: 20
					}
				]
			}
		},
		onLoad(options) {
			// 获取传入的代理ID
			this.agentId = options.id || '';
			
			// 设置初始日期范围为当月第一天到最后一天
			const now = new Date();
			const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
			const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			
			this.startDateValue = firstDay.getTime();
			this.endDateValue = lastDay.getTime();
			
			this.startDate = this.formatDate(firstDay);
			this.endDate = this.formatDate(lastDay);
			
			// 加载数据
			this.loadData();
		},
		methods: {
			// 切换选项卡
			changeTab(tab) {
				this.activeTab = tab;
				this.loadData();
			},
			
			// 加载数据
			loadData() {
				// 根据当前选项卡加载不同数据
				if (this.activeTab === 'register') {
					this.loadUserData();
				} else {
					this.loadBetData();
				}
			},
			
			// 加载用户数据
			loadUserData() {
				// 这里应该调用API获取数据
				// 模拟API请求延迟
				this.isLoading = true;
				setTimeout(() => {
					this.isLoading = false;
					// 实际开发中，这里应该通过API获取数据
				}, 500);
			},
			
			// 加载投注数据
			loadBetData() {
				// 这里应该调用API获取数据
				// 模拟API请求延迟
				this.isLoading = true;
				setTimeout(() => {
					this.isLoading = false;
					// 实际开发中，这里应该通过API获取数据
					// 计算总投注金额
					this.calculateTotal();
				}, 500);
			},
			
			// 计算总金额
			calculateTotal() {
				let total = 0;
				this.betList.forEach(item => {
					total += parseFloat(item.amount);
				});
				this.totalBetAmount = total.toFixed(2);
			},
			
			// 显示开始日期选择器
			showStartDatePicker() {
				this.showStartPicker = true;
			},
			
			// 显示结束日期选择器
			showEndDatePicker() {
				this.showEndPicker = true;
			},
			
			// 确认开始日期选择
			confirmStartDate(timestamp) {
				const date = new Date(timestamp.value);
				this.startDateValue = timestamp.value;
				this.startDate = this.formatDate(date);
				this.showStartPicker = false;
				
				// 加载选中日期范围的数据
				this.loadData();
			},
			
			// 确认结束日期选择
			confirmEndDate(timestamp) {
				const date = new Date(timestamp.value);
				this.endDateValue = timestamp.value;
				this.endDate = this.formatDate(date);
				this.showEndPicker = false;
				
				// 加载选中日期范围的数据
				this.loadData();
			},
			
			// 取消日期选择
			cancelDatePicker(type) {
				if (type === 'start') {
					this.showStartPicker = false;
				} else {
					this.showEndPicker = false;
				}
			},
			
			// 格式化日期为YYYY-MM-DD格式
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			
			// 查看用户详情
			viewUserDetail(userId) {
				uni.navigateTo({
					url: `/pages/user/info?uid=${userId}`
				});
			},
			
			// 查看订单详情
			viewOrderDetail(orderId) {
				uni.navigateTo({
					url: `/pages/order/lotteryOrderDetails?id=${orderId}`
				});
			},
			
			// 修改佣金
			modifyCommission() {
				// 显示修改佣金比例的弹出框
				this.showCommissionPopup = true;
			},
			
			// 确认修改佣金
			confirmCommissionChange() {
				// 这里应该调用API保存佣金比例
				this.isLoading = true;
				setTimeout(() => {
					this.isLoading = false;
					// 关闭弹出框
					this.showCommissionPopup = false;
					// 提示用户修改成功
					uni.showToast({
						title: `佣金比例已设置为${this.selectedRate}%`,
						icon: 'none'
					});
				}, 500);
			},
			
			// 验证输入
			validateInput() {
				// 将空字符串转为0
				if (this.selectedRate === '') {
					this.selectedRate = '0';
					return;
				}
				
				// 检查是否是有效数字
				const value = parseFloat(this.selectedRate);
				if (isNaN(value)) {
					this.selectedRate = '0';
					return;
				}
				
				// 限制最大值为100
				if (value > 100) {
					this.selectedRate = '100';
				}
				
				// 保留一位小数
				this.selectedRate = value.toFixed(1);
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
	padding-top: 10px;
	padding-bottom: 60px;
}

.tabs {
	display: flex;
	justify-content: center;
	border-bottom: 1px solid #f0f0f0;
	margin: 0 20px;
}

.tab-item {
	padding: 15px 30px;
	font-size: 16px;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #3A7AE3;
	font-weight: 500;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40px;
	height: 3px;
	background-color: #3A7AE3;
	border-radius: 3px;
}

.date-picker {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 15px 10px;
	gap: 5px;
}

.date-item {
	background-color: #f5f5f5;
	padding: 8px 15px;
	border-radius: 6px;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 5px;
}

.date-separator {
	color: #999;
}

.user-list {
	margin: 0 10px;
}

.user-item {
	background-color: #fff;
	border-radius: 8px;
	margin-bottom: 10px;
	padding: 15px;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
}

.user-avatar {
	margin-right: 15px;
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 14px;
	color: #333;
	font-weight: 500;
	margin-bottom: 5px;
}

.bet-type {
	display: inline-block;
	font-size: 12px;
	color: #3A7AE3;
	padding: 1px 8px;
	background-color: #f0f5ff;
	border: 1px solid #d4e3ff;
	border-radius: 4px;
	margin-bottom: 5px;
}

.user-time {
	font-size: 12px;
	color: #999;
}

.user-account {
	text-align: right;
}

.account-text {
	font-size: 12px;
	color: #666;
	margin-bottom: 5px;
}

.view-btn {
	padding: 6px 0;
	background-color: #3A7AE3;
	color: #fff;
	border-radius: 4px;
	font-size: 12px;
	width: 80px;
	text-align: center;
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

.commission-popup {
	padding: 20px;
}

.popup-title {
	font-size: 18px;
	text-align: center;
	margin-bottom: 30px;
	color: #333;
}

.input-container {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20px;
}

.rate-input {
	width: 120px;
	height: 40px;
	border: 1px solid #ddd;
	border-radius: 4px;
	text-align: center;
	font-size: 20px;
}

.rate-unit {
	font-size: 20px;
	margin-left: 5px;
}

.rate-options {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	margin-bottom: 30px;
}

.rate-option {
	width: 30%;
	background-color: #f5f5f5;
	padding: 12px 0;
	text-align: center;
	border-radius: 5px;
	font-size: 16px;
	border: 1px solid transparent;
}

.rate-option.active {
	background-color: #e6f0ff;
	color: #3A7AE3;
	border: 1px solid #3A7AE3;
}

.popup-buttons {
	display: flex;
	border-top: 1px solid #eee;
	margin: 0 -20px -20px;
}

.popup-btn {
	flex: 1;
	text-align: center;
	padding: 12px 0;
	font-size: 16px;
}

.cancel-btn {
	color: #666;
}

.confirm-btn {
	color: #3A7AE3;
	font-weight: 500;
}
</style> 