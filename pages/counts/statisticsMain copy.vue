<template>
	<view class="statis-box">
		<view class="statis-head">
			<view class="SH-ko">
				<view v-if="isShopOwner && employeeList.length > 1" class="employee-picker-container">
					<picker @change="bindPickerChange" :value="employeeIndex" :range="employeeList" range-key="name">
						<view class="picker-view">
							{{employeeList[employeeIndex] ? employeeList[employeeIndex].name : '选择员工'}}
						</view>
					</picker>
				</view>
			</view>
			<view class="SH-title">统计</view>
			<view class="SH-new" @click="rightText">
				<view class="SHN-text">刷新</view>
				<view class="SHN-img"><image src="/static/images/order/shuaxin.png" mode="scaleToFill"></image></view>
			</view>
		</view>
		<view>
			<!-- <uni-datetime-picker
				type="daterange"
				@change="change"
				@type="top"
				:value="[startDate, endDate]"
			/> -->
			<view @click="calendarShow=true" style="width:100%;display:flex;align-items:center;background-color:aliceblue;margin-bottom: -11px;">
				<u-icon name="calendar" color="var(--blue1)" size="35"></u-icon>
				<view style="width:100%;display:flex;align-items:center;">
					<view style="text-align:center;min-height:40rpx;width: 50%;">
						{{startDate}}
					</view>
					<view>至</view>
					<view style="text-align:center;min-height:40rpx;width: 50%;">
						{{endDate}}
					</view>
				</view>
			</view>
			<!-- <uni-datetime-picker type="daterange" @change="change"  @type="top"/> -->
		</view>
		<!--
		<view class="statis-body">

			<view class="SB-head">
				<view class="SB-box">
					<view class="SBH-top">
						<view class="SBHT-g">
							<view class="g-prices">{{totalOutTicketPrice}}</view>
							<view class="g-text">总出票金额</view>
						</view>
						<view class="SBHT-g" style="border-left: 1upx solid #cccccc;">
							<view class="g-prices">{{totalWinningPrice}}</view>
							<view class="g-text">派奖总金额</view>
						</view>
					</view>
					<view class="SBH-bottom" style="border-top: 1upx solid #cccccc;">
						<view class="SBHB-c">
							<view class="c-prices">{{totalWinningPrice}}</view>
							<view class="c-text">中奖总金额</view>
						</view>
						<view class="SBHB-c" @click="navClick('/pages/counts/statisList')" style="border-left: 1upx solid #cccccc;">
							<view class="c-prices">{{totalWithdrawalPrice}}</view>
							<view class="c-text">提现总金额</view>
						</view>
					</view>
				</view>
			</view>

		</view>

			<view class="SB-user">
				<view class="SBU-box" @click="navClick('/pages/counts/statisList')">
					<view class="SBUB-topUp">
						<view class="tu-text">用户充值总金额</view>
						<view class="tu-money">{{totalRechargePrice}}</view>
						<view class="tu-"></view>
					</view>
				</view>
			</view>

			<view class="SB-price">
				<view class="SBP-box">
					<view class="SBPB-ringht" @click="navClick('/pages/counts/statisList')">
						<view class="r-box">
							<view class="rb-text">加款金额</view>
							<view class="rb-money">{{totalAddFundsPrice}}</view>
						</view>
					</view>
					<view class="SBPB-left" @click="navClick('/pages/counts/statisList')">
						<view class="l-box">
							<view class="lb-text">扣款金额</view>
							<view class="lb-money">{{totalDeductionPrice}}</view>
						</view>
					</view>
				</view>
			</view>
			-->
			<view class="u-p-30 u-m-t-30 snipcss-XT6UT style-UJFhY" id="style-UJFhY">
			    <!-- 出票总金额和派奖总金额（所有用户都显示） -->
			    <view class="ico ico1 u-flex">
			        <view class="u-flex-1">
			            <!-- <navigator url="/pages/order/orderLotteryTypeList?state=1"> -->
			                <view class="u-font-40  style-EMNw9" id="style-EMNw9"  @click="gotoLotteryTypeList(1)">
			                    <!-- 根据用户类型显示不同的字段 -->
			                    <template v-if="isShopOwner">
			                        {{(data.totalOutTicketPrice || 0).toFixed(2)}}
			                    </template>
			                    <template v-else>
			                        {{(data.orderAmount || 0).toFixed(2)}}
			                    </template>
			                </view>
			                <view>出票总金额</view>
			            <!-- </navigator> -->
			        </view>
			        <view class="line"></view>
			        <view class="u-flex-1">
			            <!-- <navigator url="/pages/order/orderLotteryTypeList?state=4"> -->
			                <view class="u-font-40  style-lbCr5" id="style-lbCr5" @click="gotoLotteryTypeList(4)">
			                    <!-- 根据用户类型显示不同的字段 -->
			                    <template v-if="isShopOwner">
			                        {{(data.totalWinningPrice || 0).toFixed(2)}}
			                    </template>
			                    <template v-else>
			                        {{(data.winningAmount || 0).toFixed(2)}}
			                    </template>
			                </view>
			                <view>派奖总金额</view>
			            <!-- </navigator> -->
			        </view>
			    </view>

			    <!-- 仅店主账号显示的内容, 且未选择具体员工时 -->
			    <template v-if="isShopOwner && selectedEmployeeId === 0">
			        <view class="u-flex u-m-t-24">
			            <view class="ico ico2 u-flex u-flex-1" @click="navClick2('/pages/counts/statisList?type=2')">
			                <view class="u-flex-1" >
			                    <view class="u-font-40  style-9tImm" id="style-9tImm">{{(data.totalRechargePrice || 0).toFixed(2)}}</view>
			                    <view>用户充值</view>
			                </view>
			            </view>
			            <view class="ico ico3 u-flex u-flex-1 u-m-l-30" @click="navClick2('/pages/counts/statisList?type=6')">
			                <view class="u-flex-1" >
			                    <view class="u-font-40  style-XIaKU" id="style-XIaKU">{{(data.totalWithdrawalPrice || 0).toFixed(2)}}</view>
			                    <view>用户提现</view>
			                </view>
			            </view>
			        </view>

			        <view class="ico ico4 u-flex u-m-t-24" @click="navClick2('/pages/user/person')">
			            <view class="u-flex-1" >
			                <navigator >
			                    <view class="u-font-40  style-ORx8q" id="style-ORx8q">{{(data.todayTrusteeBalance || 0).toFixed(2)}}</view>
			                    <view>彩民账户总额</view>
			                </navigator>
			            </view>
			            <view class="line"></view>
			        </view>

			        <view class="u-flex u-m-t-24">
			            <view class="ico  u-flex u-flex-1 ico5" @click="navClick2('/pages/counts/statisList?type=7')">
			                <view class="u-flex-1">
			                    <navigator >
			                        <view class="u-font-40  style-qGmU2" id="style-qGmU2">{{(data.manualAddAmount || 0).toFixed(2)}}</view>
			                        <view>手工加款</view>
			                    </navigator>
			                </view>
			            </view>
			            <view class="ico  u-flex u-flex-1 ico6 u-m-l-30" @click="navClick2('/pages/counts/statisList?type=8')">
			                <view class="u-flex-1">
			                    <navigator >
			                        <view class="u-font-40  style-eeODy" id="style-eeODy">{{(data.manualDeductionAmount || 0).toFixed(2)}}</view>
			                        <view>手工扣款</view>
			                    </navigator>
			                </view>
			            </view>
			        </view>
			        <view class="u-flex u-m-t-24">
			            <view class="ico ico7 u-flex u-flex-1"  @click="navClick2('/pages/user/person')">
			                <view class="u-flex-1">
			                    <view class="u-font-40  style-Vesrc" id="style-Vesrc">{{data.gamblingUserCount}}</view>
			                    <view>总彩民</view>
			                </view>
			            </view>
			            <view class="ico ico8 u-flex u-flex-1 u-m-l-30"  @click="navToTodayRegistered">
			                <view class="u-flex-1">
			                    <view class="u-font-40  style-1RCna" id="style-1RCna">{{data.registeredUserCount}}</view>
			                    <view>今日注册</view>
			                </view>
			            </view>
			        </view>
			    </template>
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
		getShopCount
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
				totalDeductionPrice:0,	//扣款总金额
				totalOutTicketPrice:0,	//出票总金额
				totalRechargePrice:0,	//充值总金额
				totalWinningPrice:0,	//中奖总金额
				totalAddFundsPrice:0, 	//加款总金额
				totalWithdrawalPrice:0,	//提现总金额
				data: {}
			}
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
				
				if (this.selectedEmployeeId && this.selectedEmployeeId !== 0) {
					params.employeeId = this.selectedEmployeeId
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
					// 更新显示的日期
					this.startDate = option[0].split(' ')[0];
					this.endDate = option[1].split(' ')[0];

					// 更新查询参数
					this.queryParam.startTime = this.startDate;
					this.queryParam.endTime = this.endDate;
				}
				this.data = {};
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
				getShopCount(paramsToSubmit).then(res => {
					this.totalDeductionPrice = res.totalDeductionPrice
					this.totalOutTicketPrice= res.totalOutTicketPrice
					this.totalRechargePrice= res.userRechargeAmount
					this.totalWinningPrice= res.totalWinningPrice
					this.totalAddFundsPrice= res.totalAddFundsPrice
					this.totalWithdrawalPrice= res.totalWithdrawalPrice
					this.data = res;
					uni.hideLoading();
				})
			}

		}
	}
</script>


<style lang="scss" scoped>
	html,
	body,
	#app {
		height: 100%;
		width: 100%;
	}

	page-body,
	#app {
		height: 100%;
	}

	/deep/.uni-datetime-picker--btn,
	/deep/.uni-calendar-item--after-checked,
	/deep/.uni-calendar-item--before-checked {
		background: var(--themeColor) !important;

	}

	/deep/.uni-calendar__content {
		margin-bottom: 50px;
	}
	page {
		width: 100%;
		height: 100%;
		background: #eeeeee;
	}
	.u-p-30 {
	    padding: 15px!important;
	}

	.u-m-t-30 {
	    margin-top: 15px!important;
	}

	:-webkit-scrollbar {
	    display: none;
	    width: 0!important;
	    height: 0!important;
	    -webkit-appearance: none;
	    background: transparent;
	}

	.u-flex {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}

	.ico {
	    background-size: 100%;
	    background-repeat: no-repeat;
	    min-height: 83px;
	    border-radius: 10px;
	    overflow: hidden;
	    color: #fff;
	    text-align: left;
	    padding-left: 20px;
	}

	.ico1 {
	    background-image: url(data:image/png;base64,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);
	    text-align: center;
	    padding: 0;
	}

	.u-m-t-24 {
	    margin-top: 12px!important;
	}

	.ico4 {
	    padding: 0;
	    text-align: center;
	    background-image: url(data:image/png;base64,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);
	}

	.u-flex-1 {
	    flex: 1!important;
	}

	.line {
	    min-height: 52px;
	    margin: 15px 0;
	    width: 1px;
	    background: #fff;
	}

	.ico2 {
	    background-image: url(/static/images/user/ico2.png);
	}

	.u-m-l-30 {
	    margin-left: 15px!important;
	}

	.ico3 {
	    background-image: url(/static/images/user/ico3.png);
	}

	.ico5 {
	    background-image: url(/static/images/user/ico5.png);
	}

	.ico6 {
	    background-image: url(/static/images/user/ico6.png);
	}

	.ico7 {
	    background-image: url(/static/images/user/ico7.png);
	}

	.ico8 {
	    background-image: url(/static/images/user/ico8.png);
	}

	uni-navigator {
	    height: auto;
	    width: auto;
	    display: block;
	    cursor: pointer;
	}

	.u-font-40 {
	    font-size: 20px!important;
	}


	/* These were inline style tags. Uses id+class to override almost everything */
	#style-RPmYL.style-RPmYL {
	   background: white;
	}
	#style-hWPwf.style-hWPwf {
	   font-weight: 700;
	}
	#style-KMia4.style-KMia4 {
	   font-weight: 700;
	}
	#style-t45oR.style-t45oR {
	   font-weight: 700;
	}
	#style-Nf1kE.style-Nf1kE {
	   font-weight: 700;
	}
	#style-g7ntl.style-g7ntl {
	   font-weight: 700;
	}
	#style-4XoBQ.style-4XoBQ {
	   font-weight: 700;
	}
	#style-qQsjX.style-qQsjX {
	   font-weight: 700;
	}
	#style-hopLN.style-hopLN {
	   font-weight: 700;
	}
	#style-KH2pQ.style-KH2pQ {
	   font-weight: 700;
	}
	#style-L3K3m.style-L3K3m {
	   font-weight: 700;
	}
	/* These were inline style tags. Uses id+class to override almost everything */
	#style-UJFhY.style-UJFhY {
	   background: white;
	}
	#style-EMNw9.style-EMNw9 {
	   font-weight: 700;
	}
	#style-lbCr5.style-lbCr5 {
	   font-weight: 700;
	}
	#style-9tImm.style-9tImm {
	   font-weight: 700;
	}
	#style-XIaKU.style-XIaKU {
	   font-weight: 700;
	}
	#style-ORx8q.style-ORx8q {
	   font-weight: 700;
	}
	#style-wBrJr.style-wBrJr {
	   font-weight: 700;
	}
	#style-qGmU2.style-qGmU2 {
	   font-weight: 700;
	}
	#style-eeODy.style-eeODy {
	   font-weight: 700;
	}
	#style-Vesrc.style-Vesrc {
	   font-weight: 700;
	}
	#style-1RCna.style-1RCna {
	   font-weight: 700;
	}

	.statis-box {
		width: 100%;
		height: 100%;
		.statis-head {
			width: 100%;
			padding: 20upx 0;
			background: #ffffff;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.SH-ko {
				width: 20%;
			}

			.employee-picker-container {
				flex: 1;
				padding: 0 10upx;
				margin-left: 10upx;
				display: flex;
				justify-content: center;
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

		.statis-body {
			width: 100%;
			height: 200px;
			padding-top: 10px;
			color: #ffffff;
			font-size: 11px;
			background: #ffffff;
			.SB-head {
				display: flex;
				align-items: center;
					width: 90%;
					height: 94%;
					margin: auto;
					background: var(--themeColor);
					border-radius: 10upx;
				.SB-box {
					width: 100%;
					height: 100%;
					.SBH-top {
						width: 80%;
						height: 50%;
						margin: auto;
						display: flex;
						justify-content: space-around;
						align-items: center;
						.SBHT-g {
							width: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;

							.g-prices {
								font-size: 22px;
								font-weight: bold;
							}

							.g-text {

							}

						}

					}

					.SBH-bottom {
						width: 80%;
						height: 50%;
						margin: auto;
						display: flex;
						justify-content: space-around;
						align-items: center;
						.SBHB-c {
							width: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							.c-prices {
								font-size: 22px;
								font-weight: bold;
							}

							.c-text {
							}
						}

					}

				}

			}

		}

		.SB-user {
			width: 100%;
			margin: 10px 0;
			padding: 15px 0;
			font-size: 11px;
			color: #fff;
			background: #ffffff;
			.SBU-box {
				width: 90%;
				margin: auto;
				border-radius: 3px;
				background: #f55c23;
				.SBUB-topUp  {
					height: 100px;
					text-align: center;
					.tu-text {
						line-height: 50px;
					}

					.tu-money {
						font-size: 22px;
						font-weight: bold;
					}

				}

			}

		}

		.SB-price {
			width: 100%;
			padding: 15px 0;
			font-size: 11px;
			color: #fff;
			background: #ffffff;
			.SBP-box {
				width: 90%;
				display: flex;
				justify-content: space-between;
				margin: auto;
				.SBPB-ringht {
					width: 49%;
					border-radius: 3px;
					background: #f85b54;
					.r-box {
						padding: 10px 0 20px 10px;
						// rb-text
						.rb-money {
							font-size: 20px;
							font-weight: bold;
						}
					}

				}

				.SBPB-left {
					width: 49%;
					border-radius: 3px;
					background: #46c7c4;
					.l-box {
						padding: 10px 0 20px 10px;
						// lb-text
						.lb-money {
							font-size: 20px;
							font-weight: bold;
						}

					}

				}

			}

		}

	}
</style>
