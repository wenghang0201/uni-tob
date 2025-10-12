<template>
	<view class="box">
		<!-- 导航栏 -->
		<nav-bar :title="'代理注册用户统计'" :back="true"></nav-bar>
		
		<!-- 内容区域 -->
		<view class="content">
			<!-- 日期选择器 -->
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
			<view class="user-list">
				<view class="user-item" v-for="(item, index) in userList" :key="index">
					<view class="user-info">
						<view class="avatar">
							<u-avatar src="/static/images/default-avatar.png" size="50"></u-avatar>
						</view>
						<view class="info-content">
							<view class="user-name">{{item.name}}</view>
							<view class="agent-label">
								<text>代理: {{item.agentId}}</text>
							</view>
							<view class="register-time">{{item.registerTime}}</view>
						</view>
						<view class="user-actions">
							<view class="view-btn" @click="viewUser(item.id)">查看</view>
						</view>
					</view>
				</view>
				
				<!-- 无数据显示 -->
				<u-empty v-if="userList.length === 0" mode="data" text="暂无用户数据"></u-empty>
			</view>
			
			<!-- 底部统计 -->
			<view class="footer">
				<text>总计: {{userList.length}}人</text>
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
				startDate: '',
				endDate: '',
				startDateValue: new Date().getTime(),
				endDateValue: new Date().getTime(),
				showStartPicker: false,
				showEndPicker: false,
				minDate: new Date('2020-01-01').getTime(),
				maxDate: new Date('2030-12-31').getTime(),
				isLoading: false,
				// 用户列表
				userList: [
					{
						id: 1,
						name: '罗马狼王*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-17 15:39:09'
					},
					{
						id: 2,
						name: '陈真*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-10 21:26:26'
					},
					{
						id: 3,
						name: '彩店宝L5EHSVuS*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-06 12:51:38'
					},
					{
						id: 4,
						name: '彩店宝e3G9Svoq*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-05 14:10:56'
					},
					{
						id: 5,
						name: '彩店宝6u9BpLur*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-05 00:49:57'
					},
					{
						id: 6,
						name: '彩店宝tnkaSy0z*****',
						avatar: '',
						agentId: 'D',
						registerTime: '2025-03-04 22:45:19'
					}
				]
			}
		},
		onLoad(options) {
			// 获取传入的年月参数
			this.year = options.year || new Date().getFullYear();
			this.month = options.month || (new Date().getMonth() + 1).toString().padStart(2, '0');
			
			// 设置初始日期范围为当月第一天到最后一天
			const firstDay = new Date(this.year, parseInt(this.month) - 1, 1);
			const lastDay = new Date(this.year, parseInt(this.month), 0);
			
			this.startDateValue = firstDay.getTime();
			this.endDateValue = lastDay.getTime();
			
			this.startDate = this.formatDate(firstDay);
			this.endDate = this.formatDate(lastDay);
			
			// 加载用户数据
			this.loadUserData();
		},
		methods: {
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
				this.loadUserData();
			},
			
			// 确认结束日期选择
			confirmEndDate(timestamp) {
				const date = new Date(timestamp.value);
				this.endDateValue = timestamp.value;
				this.endDate = this.formatDate(date);
				this.showEndPicker = false;
				
				// 加载选中日期范围的数据
				this.loadUserData();
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
			viewUser(userId) {
				uni.navigateTo({
					url: `/pages/user/info?uid=${userId}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
	padding-top: 10px;
	padding-bottom: 60px;
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
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	margin-right: 10px;
}

.info-content {
	flex: 1;
}

.user-name {
	font-size: 13px;
	color: #333;
	font-weight: 500;
	margin-bottom: 5px;
}

.agent-label {
	font-size: 11px;
	color: #666;
	background-color: #f0f0f0;
	display: inline-block;
	padding: 2px 8px;
	border-radius: 4px;
	margin-bottom: 5px;
}

.register-time {
	font-size: 11px;
	color: #999;
}

.user-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
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
</style> 