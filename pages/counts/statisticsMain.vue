<template>
	<view class="statis-box">
		<view class="statis-head">
			<view class="head-left">
				<view v-if="isShopOwner && employeeList.length > 1" class="employee-picker-container">
					<picker @change="bindPickerChange" :value="employeeIndex" :range="employeeList" range-key="name">
						<view class="picker-view">
							{{employeeList[employeeIndex] ? employeeList[employeeIndex].name : '选择员工'}}
						</view>
					</picker>
				</view>
			</view>
			<view class="head-center">
				<view class="SH-title">统计</view>
			</view>
			<view class="head-right">
				<!-- 右侧预留空间 -->
			</view>
		</view>
		
		<!-- 时间筛选区域 -->
		<view class="date-filter">
			<view class="filter-dropdown">
				<text>全部</text>
				<u-icon name="arrow-down" size="12" color="#666"></u-icon>
			</view>
			<view class="date-range" @click="calendarShow=true">
				<text>{{startDate}}至{{endDate}}</text>
				<u-icon name="calendar" size="26" color="var(--blue1)"></u-icon>
			</view>
		</view>

		<!-- 主要内容区域 -->
		<view class="main-content">
			<!-- 蓝色渐变卡片 -->
			<view class="blue-gradient-card">
				<!-- 上半部分：淡蓝色背景 -->
				<view class="card-top-section">
					<view class="amount-section">
						<view class="amount-item" @click="gotoLotteryTypeList(1)">
							<text class="amount-value">{{(data.totalOutTicketPrice || 0).toFixed(2)}}</text>
							<text class="amount-label">出票总金额</text>
						</view>
						<view class="divider"></view>
						<view class="amount-item" @click="gotoLotteryTypeList(4)">
							<text class="amount-value">
								{{data.totalWinningPrice || 0}}
							</text>
							<text class="amount-label">中奖总金额(已派奖)</text>
						</view>
					</view>
				</view>
				
				<!-- 下半部分：白色背景 -->
				<view class="card-bottom-section">
					<view class="commission-section">
						<view class="commission-item">
							<text class="commission-text">店主彩民跟单佣金</text>
							<u-icon name="question-circle" size="16" color="#666"></u-icon>
							<text class="commission-amount">¥{{(data.totalCommissionPrice || 0).toFixed(2)}}</text>
							<u-icon name="arrow-down" size="14" color="#666"></u-icon>
						</view>
					</view>
					
					<view class="action-buttons">
						<view class="action-btn" @click="gotoLotteryTypeList(1)">
						<u-icon name="file-text" size="24" color="#007AFF"></u-icon>
						<text class="btn-text">出票详情</text>
					</view>
					<view class="action-btn" @click="gotoLotteryTypeList(4)">
						<u-icon name="rmb-circle" size="24" color="#007AFF"></u-icon>
						<view class="btn-text-container">
							<text class="btn-text">中奖详情</text>
							<text class="btn-text-small">(已派奖)</text>
						</view>
					</view>
					</view>
				</view>
			</view>

			<!-- 对账汇总 -->
			<view class="summary-section" v-if="isShopOwner && this.selectedEmployeeId === 0">
				<view class="section-title">对账汇总</view>
				<view class="summary-card">
					<view class="summary-item">
						<text class="summary-label">托管余额</text>
						<text class="summary-value">{{(data.trusteeBalance || 0).toFixed(2)}}</text>
					</view>
					<view class="summary-item">
						<text class="summary-label">服务费支出</text>
						<text class="summary-value">{{(data.totalFeePrice || 0).toFixed(2)}}</text>
					</view>
				</view>
				
				<view class="summary-rows">
					<view class="summary-row" @click="navClick2('/pages/counts/statisList?type=2')">
						<view class="row-left">
							<view class="row-icon">
								<u-icon name="rmb-circle" size="26" color="#007AFF"></u-icon>
							</view>
							<text class="row-label">充值总金额</text>
						</view>
						<view class="row-right">
							<text class="row-value recharge-value">{{(data.totalRechargePrice || 0).toFixed(2)}}</text>
							<u-icon name="arrow-right" size="12" color="#999"></u-icon>
						</view>
					</view>
					
					<view class="summary-row" @click="navClick2('/pages/counts/statisList?type=6')">
						<view class="row-left">
							<view class="row-icon">
								<u-icon name="rmb-circle" size="26" color="#007AFF"></u-icon>
							</view>
							<text class="row-label">提现总金额</text>
						</view>
						<view class="row-right">
							<text class="row-value">{{(data.totalWithdrawalPrice || 0).toFixed(2)}}</text>
							<u-icon name="arrow-right" size="12" color="#999"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<!-- 加扣款统计 -->
			<view class="add-deduct-section">
				<view class="section-title">加扣款统计</view>
				<view class="add-deduct-card" >
					<view class="add-deduct-item" @click="navClick2('/pages/counts/statisList?type=0')">
						<text class="add-deduct-label">加款金额</text>
						<text class="add-deduct-value add">+{{(data.totalAddFundsPrice || 0).toFixed(2)}}</text>
					</view>
					<view class="add-deduct-item" @click="navClick2('/pages/counts/statisList?type=8')">
						<text class="add-deduct-label">扣款金额</text>
						<text class="add-deduct-value deduct">{{(data.totalDeductionPrice || 0).toFixed(2)}}</text>
					</view>
				</view>
			</view>
		</view>

		<nav-bottom :current="2"></nav-bottom>
		
		<u-calendar
			:show="calendarShow" 
			mode="range" 
			@confirm="change" 
			:minDate="minDate" 
			:maxDate="maxDate"
			monthNum="24" 
			:allowSameDay="true"
			@close="calendarClose"
		>
		</u-calendar>
	</view>
</template>

<script>
	import {
		getUser,
		shopStatistics
	} from "@/api/user.js"
	import { getEmployeeList } from '@/api/employee.js';
	import { formatDate } from '@/util/date';
	export default {
		computed: {
		},
		data() {
			return {
				calendarShow:false,
				minDate: `${new Date().getFullYear()-1}-01-01`,
				maxDate: formatDate(new Date(), 'yyyy-MM-dd'),
				startDate: formatDate(new Date(), 'yyyy-MM-dd'),
				endDate: formatDate(new Date(), 'yyyy-MM-dd'),
				user:{},
				defaultData: {},
				indexT: 0,
				isShopOwner: false, // 是否店主账号
				employeeList: [{ id: 0, name: '全部' }], // 员工列表，默认包含全部
				employeeIndex: 0, // 默认选中第一个，即"全部"
				selectedEmployeeId: 0, // 选中员工的ID，0代表全部
				//查询条件
				queryParam: {
					startTime: formatDate(new Date(), 'yyyy-MM-dd'),
					endTime: formatDate(new Date(), 'yyyy-MM-dd'),
				},
				data: {}
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.data = {};
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 500);
		},
		// 上拉触底
		onReachBottom() {
			this.onLoadMore();
		},
		onLoad() {
			// 获取缓存中的用户信息
			let userInfo = uni.getStorageSync("vue_userInfo");

			// 如果缓存中没有用户信息，先获取用户信息
			if(!userInfo) {
				getUser().then(res => {
					if(res) {
						userInfo = res;
						uni.setStorageSync("vue_userInfo", userInfo);
						this.processUserInfo(userInfo);
					} else {
						this.init();
					}
				}).catch(() => {
					this.init();
				});
			} else {
				this.processUserInfo(userInfo);
			}
			this.user = userInfo;
			console.log('isShopOwner',this.isShopOwner,userInfo);
		},
		methods: {
			calendarClose(){
				this.calendarShow = false;
			},
			gotoLotteryTypeList(state){
				// 构建URL参数，包含状态和时间范围
				const params = {
					state: state,
					startTime: this.queryParam.startTime || '',
					endTime: this.queryParam.endTime || '',
				};
				if(this.isShopOwner){
					if (this.selectedEmployeeId && this.selectedEmployeeId !== 0) {
						params.employeeId = this.selectedEmployeeId
					}
				}else{
					params.employeeId = this.user.id;
				}

				// 构建URL查询字符串
				const queryString = Object.entries(params)
					.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
					.join('&');

				uni.navigateTo({
					url: `/pages/order/orderLotteryTypeList?${queryString}`
				});
			},
			// 处理用户信息并初始化页面
			processUserInfo(userInfo) {
				// 直接使用用户信息中的tenantId
				this.queryParam.tenantId = userInfo.tenantId;

				// 根据用户类型设置是否为店主账号
				// isAgent: 0=普通用户, 1=店主, 2=销售
				this.isShopOwner = userInfo.isAgent === '1';

				if (this.isShopOwner) {
					this.loadEmployeeList(); // 如果是店主，加载员工列表
				}
				this.init();
			},
			// 新增：加载员工列表的方法
			async loadEmployeeList() {
				try {
					// 假设 getEmployeeList 可以接受分页参数，这里尝试获取较多数量确保获取到所有员工
					// 您可能需要根据实际API调整参数，或者后端提供一个获取所有员工的接口
					const res = await getEmployeeList({ pageNo: 1, pageSize: 999 });
					if (res && res.voList) { // 请根据实际API返回结构调整
						this.employeeList = [{ id: 0, name: '全部' }].concat(
							res.voList.map(emp => ({
								id: emp.userId, // 确保 id 和 name 字段存在且正确
								name: emp.name || '未命名员工'
							}))
						);
					} else {
						this.employeeList = [{ id: 0, name: '全部' }];
					}
				} catch (error) {
					console.error("获取员工列表失败:", error);
					this.employeeList = [{ id: 0, name: '全部' }]; // 出错时保证有默认选项
					uni.showToast({
						title: '获取员工列表失败',
						icon: 'none'
					});
				}
			},

			// 新增：员工选择器变化事件
			bindPickerChange: function(e) {
				this.employeeIndex = e.target.value;
				this.selectedEmployeeId = this.employeeList[this.employeeIndex].id;
				this.init(); // 重新获取统计数据
			},

			rightText(){
				this.init();
			},

			change(option) {
				this.calendarShow = false;
				if (option.length == 0) {
					this.startDate = formatDate(new Date(), 'yyyy-MM-dd');
					this.endDate = formatDate(new Date(), 'yyyy-MM-dd');
					this.queryParam.startTime = this.startDate;
					this.queryParam.endTime = this.endDate;
				} else {
					// 更新显示的日期 - 直接使用日期字符串，不需要split
					this.startDate = option[0];
					this.endDate = option[option.length-1];

					// 更新查询参数
					this.queryParam.startTime = this.startDate;
					this.queryParam.endTime = this.endDate;
				}
				// this.data = {};
				this.init()
			},
			navClick(url) {
				var tenantId = this.queryParam.tenantId;
				if(typeof tenantId == 'undefined') tenantId = uni.getStorageSync("vue_userInfo").tenantId
				uni.navigateTo({
					url: "/pages/counts/statisList?tenantId=" + tenantId
				});
			},
			navClick2(url) {
				uni.navigateTo({
					url: url
				});
			},

			// 导航到今日注册用户列表，并传递今日时间范围
			navToTodayRegistered() {
				// 获取今日日期
				const today = formatDate(new Date(), 'yyyy-MM-dd');

				// 构建URL参数，包含今日时间范围
				const params = {
					startTime: today,
					endTime: today,
				};

				// 构建URL查询字符串
				const queryString = Object.entries(params)
					.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
					.join('&');

				// 导航到用户页面并传递参数
				uni.navigateTo({
					url: `/pages/user/person?${queryString}`
				});
			},
			// 上拉加载更多（预留功能，暂不实现具体逻辑）
			onLoadMore() {
				// 预留上拉加载逻辑
				console.log('上拉加载更多 - 预留功能');
				
				// 这里可以添加分页加载逻辑
				// 例如：加载更多统计数据、历史记录等
				
				// 暂时显示提示
				uni.showToast({
					title: '暂无更多数据',
					icon: 'none',
					duration: 1500
				});
			},
			
			//初始化事件
			init() {
				uni.showLoading();
				const paramsToSubmit = { ...this.queryParam };
				if (this.isShopOwner && this.selectedEmployeeId && this.selectedEmployeeId !== 0) {
					paramsToSubmit.employeeUserId = this.selectedEmployeeId;
				} else {
					// 如果选择"全部"或者不是店主，确保不传递 employeeId，或者传递一个后端能识别为"全部"的值
					delete paramsToSubmit.employeeUserId; 
				}
				shopStatistics(paramsToSubmit).then(res => {
					this.data = res;
					uni.hideLoading();
				}).catch(err => {
					console.error('获取统计数据失败:', err);
					uni.hideLoading();
					uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					});
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		background: #f5f5f5;
	}

	.statis-box {
		width: 100%;
		min-height: 100vh;
		background: #f5f5f5;
		
		.statis-head {
			width: 100%;
			padding: 20upx 0;
			background: #ffffff;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;

			.head-left {
				width: 30%;
				display: flex;
				align-items: center;
				min-height: 60upx;
				padding-left: 30upx;
			}

			.head-center {
				width: 40%;
				display: flex;
				justify-content: center;
				align-items: center;
				min-height: 60upx;
			}

			.head-right {
				width: 30%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				min-height: 60upx;
				padding-right: 30upx;
			}

			// 调试用的背景色类
			.debug-left {
				background-color: black !important;
			}

			.debug-center {
				background-color: aqua !important;
			}

			.debug-right {
				background-color: bisque !important;
			}

			.employee-picker-container {
				width: 100%;
				display: flex;
				justify-content: flex-start;
			}

			.picker-view {
				width: auto;
				max-width: 200upx;
				height: 60upx;
				line-height: 60upx;
				border: 1px solid #eee;
				border-radius: 8upx;
				padding: 0 15upx;
				font-size: 28upx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.SH-title {
				padding: 0 20upx;
				color: #000000;
				font-size: 36upx;
				font-weight: bold;
				text-align: center;
			}

			.SH-new {
				width: 15%;
				display: flex;
				justify-content: space-around;
				padding: 10upx;
				margin-right: 10upx;
				border-radius: 30upx;
				background: #eeeeee;
				.SHN-text {
					color: #4a4a4a;
				}

				.SHN-img {
					display: flex;
					align-items: center;
					image {
						width: 20px;
						height: 20px;
					}
				}
			}
		}

		.date-filter {
			display: flex;
			align-items: center;
			gap: 30upx;
			padding: 20upx 30upx;
			background: #ffffff;
			border-bottom: 1px solid #f0f0f0;

			.filter-dropdown {
				display: flex;
				align-items: center;
				gap: 10upx;
				font-size: 28upx;
				color: #666;
			}

			.date-range {
				display: flex;
				align-items: center;
				gap: 10upx;
				font-size: 28upx;
				color: #333;
			}
		}

		.main-content {
			padding: 30upx;
			
			.blue-gradient-card {
				background: #ffffff;
				border-radius: 25upx;
				margin-bottom: 30upx;
				box-shadow: 0 8upx 30upx rgba(0, 0, 0, 0.1);
				overflow: hidden;

				.card-top-section {
					background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
					padding: 40upx 30upx;
					color: #ffffff;

					.amount-section {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.amount-item {
							flex: 1;
							text-align: center;

							.amount-value {
								display: block;
								font-size: 48upx;
								font-weight: bold;
								margin-bottom: 10upx;
								color: #ffffff;
							}

							.amount-label {
								font-size: 24upx;
								color: rgba(255, 255, 255, 0.9);
							}
						}

						.divider {
							width: 2upx;
							height: 80upx;
							background: rgba(255, 255, 255, 0.3);
							margin: 0 30upx;
						}
					}
				}

				.card-bottom-section {
					background: #ffffff;
					padding: 30upx;

					.commission-section {
						margin-bottom: 25upx;
						padding: 20upx 0;
						border-top: 1upx solid #f0f0f0;

						.commission-item {
							display: flex;
							align-items: center;
							gap: 15upx;
							font-size: 26upx;

							.commission-text {
								flex: 1;
								color: #333;
							}

							.commission-amount {
								color: #FF6B6B;
								font-weight: bold;
								font-size: 28upx;
								margin-right: 10upx;
							}
						}
					}

									.action-buttons {
					display: flex;
					gap: 20upx;

					.action-btn {
						width: 50%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 12upx;
						padding: 20upx 15upx;
						background: #f8f9fa;
						border-radius: 15upx;
						font-size: 24upx;
						color: #333;
						transition: all 0.3s ease;

						&:active {
							background: #e9ecef;
							transform: scale(0.98);
						}

						.btn-text {
							font-size: 30upx;
							font-weight: bold;
						}

						.btn-text-container {
							display: flex;
							align-items: center;
							gap: 2upx;
						}

						.btn-text-small {
							font-size: 20upx;
							font-weight: bold;
						}
					}
				}
				}
			}

			.summary-section {
				margin-bottom: 30upx;

				.section-title {
					font-size: 32upx;
					font-weight: bold;
					color: #333;
					margin-bottom: 20upx;
				}

				.summary-card {
					background: #ffffff;
					border-radius: 15upx;
					padding: 30upx;
					margin-bottom: 20upx;
					display: flex;
					justify-content: space-between;

					.summary-item {
						text-align: center;

						.summary-label {
							display: block;
							font-size: 24upx;
							color: #666;
							margin-bottom: 10upx;
						}

						.summary-value {
							font-size: 36upx;
							font-weight: bold;
							color: #333;
						}
					}
				}

				.summary-rows {
					background: #ffffff;
					border-radius: 15upx;
					overflow: hidden;

					.summary-row {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 30upx;
						border-bottom: 1px solid #f0f0f0;

						&:last-child {
							border-bottom: none;
						}

						.row-left {
							display: flex;
							align-items: center;
							flex: 1;
						}

						.row-right {
							display: flex;
							align-items: center;
							gap: 10upx;
						}

						.row-icon {
							display: flex;
							align-items: center;
							margin-right: 20upx;
						}

						.row-label {
							font-size: 28upx;
							color: #333;
							font-weight: bold;
						}

						.row-value {
							font-size: 28upx;
							color: #333;
							font-weight: bold;

							&.recharge-value {
								color: #FF6B6B;
							}
						}
					}
				}
			}

			.add-deduct-section {
				.section-title {
					font-size: 32upx;
					font-weight: bold;
					color: #333;
					margin-bottom: 20upx;
				}

				.add-deduct-card {
					background: #ffffff;
					border-radius: 15upx;
					padding: 30upx;
					display: flex;
					justify-content: space-between;

					.add-deduct-item {
						text-align: center;
						width: 50%;
						.add-deduct-label {
							display: block;
							font-size: 24upx;
							color: #666;
							margin-bottom: 10upx;
						}

						.add-deduct-value {
							font-size: 36upx;
							font-weight: bold;

							&.add {
								color: #FF6B6B;
							}

							&.deduct {
								color: #007AFF;
							}
						}
					}
				}
			}
		}
	}
</style>
