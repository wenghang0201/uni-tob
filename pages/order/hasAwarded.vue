<template>
	<view class="printedOrders">
		<view class="printedOrders-head">
			<view class="LH-sort-filter" @click="openSortPopup">
				<u-icon name="list-dot" size="16" color="#666"></u-icon>
				<text>排序规则</text>
			</view>
			<view class="LH-title">已派奖</view>
			<view class="LH-type-filter" @click="openTypePopup">
				<text>{{ displaySelectedTypes }}</text>
				<u-icon name="arrow-down-fill" size="12" color="#666"></u-icon>
			</view>
		</view>
		
		<!-- 订单号搜索区域 -->
		<view class="order-search-box">
			<view class="search-input-wrapper">
				<u-icon name="order" size="20" color="#999" class="order-icon"></u-icon>
				<u-input
					v-model="orderIdInput"
					placeholder="请输入订单编号"
					border="none"
					clearable
					class="order-id-input"
					:custom-style="{backgroundColor: 'transparent'}"
					:input-style="inputStyle"
					:placeholder-style="placeholderStyle"
				/>
			</view>
			<view class="search-button" @click="searchByOrderId">
				<u-icon name="search" size="18" color="#fff"></u-icon>
				<text>搜索</text>
			</view>
		</view>

		<view class="printedOrders-body">
			<view class="LB-top">
				<view class="LBT-list">
					<view class="LBTL-noMag">
						<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length<=0"
							mode="order" text="没有订单记录"></u-empty>
					</view>

					<view class="LBTL-list">
						<view class="LBTLL-ui" v-for="(item, index) in lotteryOrderList" :key="index">
							<order-item 
								:item="item"
								:currentTime="currentTime"
								@details="details"
								@accept-order="acceptOrder"
								@go-to-order-detail="goToOrderDetail"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 彩种选择弹窗 -->
		<u-popup :show="showTypePopup" @close="closeTypePopup" mode="top" closeable>
			<view class="type-popup-content">
				<view class="popup-title">选择彩种</view>
				<scroll-view scroll-y="true" class="popup-scroll-view">
					<view class="type-grid-container">
						<!-- 全部彩种按钮 -->
						<view
							class="type-grid-item"
							:class="{'selected': isAllTypesSelected}"
							@click="handleTypeClick('all')"
						>
							全部彩种
						</view>
						<!-- 其他彩种按钮 -->
						<view
							v-for="(item, index) in lotteryTypes"
							:key="item.type"
							class="type-grid-item"
							:class="{'selected': selectedTypeModels.includes(item.type)}"
							@click="handleTypeClick(item.type)"
						>
							{{ item.name }}
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<u-button @click="confirmTypeSelection" type="primary" shape="circle" size="normal" text="确定"></u-button>
				</view>
			</view>
		</u-popup>

		<nav-bottom :current="2"></nav-bottom>
	</view>
</template>

<script>
	import {
		lotteryOrderList,
		getJointPurchaseList,
		getLotteryOrderById
	} from '@/api/lotteryOrder.js'
	import {
		deleteOrder,
		chupiaoOrder,
		getUser
	} from "@/api/user.js"
	import OrderItem from '@/components/order-item/index.vue'
	export default {
		components: {
			OrderItem
		},
		data() {
			return {
				user: {},
				that: this,
				isFirstLoad: true,
				orderIdInput: "", // 订单号输入
				inputStyle: {
					height: '72rpx',
					lineHeight: '72rpx',
					fontSize: '28rpx',
					color: '#333',
					alignItems: 'center',
					display: 'flex'
				},
				placeholderStyle: {
					fontSize: '28rpx',
					color: '#bbb',
					lineHeight: '72rpx'
				},
				// 查询条件
				queryParam: {
					userId: "",
					stateList: ["4"], // 包含所有已出票状态：待开奖、未中奖、待派奖、已派奖
					startTime: "",
					endTime: "",
					phone:"",
					typeList: [], // 彩种查询条件
					pageNo: 1,
					pageSize: 10
				},
				total: 0,
				// 订单记录列表
				lotteryOrderList: [],
				currentTime: Date.now(), // 当前时间戳
				timerId: null, // 定时器ID
				needsRefresh: false, // 刷新标志
				// 彩种选择相关
				showTypePopup: false, // 彩种选择弹窗
				lotteryTypes: [ // 彩种列表
					{ name: '竞彩足球', type: '0' },
					{ name: '竞彩篮球', type: '1' },
					{ name: '北京单场', type: '2' },
					{ name: '排列三', type: '3' },
					{ name: '排列五', type: '4' },
					{ name: '七星彩', type: '5' },
					{ name: '胜负彩', type: '6' },
					{ name: '任选九', type: '7' },
					{ name: '大乐透', type: '8' },
					{ name: '双色球', type: '9' },
					{ name: '福彩3D', type: '10' },
					{ name: '快乐8', type: '11' },
					{ name: '七乐彩', type: '12' },
					{ name: '胜负过关', type: '13' },
				],
				selectedTypeModels: [], // 用于复选框 v-model
			}
		},
		onPullDownRefresh() {
			this.lotteryOrderList = []
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		filters: {
			// 格式化日期
			formatDate(data, that) {
				return data
			},
			// 格式化状态
			formatState(data) {
				if (data == 0) {
					return "待接单";
				} else if (data == 1) {
					return "待开奖";
				} else if (data == 2) {
					return "未中奖";
				} else if (data == 3) {
					return "待派奖";
				} else if (data == 4) {
					return "已派奖";
				} else if (data == 5) {
					return "拒绝";
				} else if (data == 6) {
					return "退票";
				} else if (data == 7) {
					return "待出票";
				} else if (data == 8) {
					return "合买";
				}
				// 合买订单状态 (从100往上叠加)
				else if (data == 100) {
					return "认购中";
				} else if (data == 101) {
					return "已满员";
				} else if (data == 102) {
					return "已截止";
				} else if (data == 103) {
					return "进行中";
				} else if (data == 104) {
					return "已完成";
				} else if (data == 105) {
					return "成单失败";
				} else if (data == 110) {
					return "未中奖";
				} else if (data == 111) {
					return "已中奖";
				}

				// 默认返回原始状态码
				return data;
			}
		},
		onLoad(option) {
			if (option.uid != undefined) {
				this.queryParam.userId = option.uid;
				this.queryParam.phone = option.phone;
			}
			if(option.type != undefined){
				this.queryParam.state = option.type;
			}
			this.isFirstLoad = true;
			this.init();
		},
		// 每次页面显示时刷新数据（非首次加载）
		onShow() {
			// 如果不是首次加载，则刷新数据
			if (!this.isFirstLoad) {
				// 重置数据和分页信息
				this.lotteryOrderList = [];
				this.queryParam.pageNo = 1;
				// 重新加载数据
				this.init();
			}
			// 重置首次加载标志
			this.isFirstLoad = false;
		},
		// 滚动到底部进行分页事件
		onReachBottom() {
			// 使用 this.total (当前列表的总数) 判断
			if (this.lotteryOrderList.length >= this.total) {
				uni.showToast({ title: '没有更多数据了', icon: 'none' });
				return;
			}
			this.queryParam.pageNo++;

			// 加载下一页数据
			uni.showLoading({ title: '加载更多...' });

			// API 调用，使用现有查询参数（包含stateList）
			lotteryOrderList(this.queryParam).then(res => {
				if (res.success) {
					// 追加数据，不更新 total
					this.lotteryOrderList = [...this.lotteryOrderList, ...(res.voList || [])];
				} else {
					uni.showToast({ title: `加载更多失败: ${res.errorMsg || ''}`, icon: 'none' });
					this.queryParam.pageNo--; // 加载失败，页码回退
				}
				uni.hideLoading();
			}).catch(err => {
				console.error("加载更多出错:", err);
				this.queryParam.pageNo--; // 加载失败，页码回退
				uni.hideLoading();
			});
		},
		onHide() {
			// 组件销毁前清除定时器
			this.clearTimer();
		},
		methods: {
			// 去订单详情页
			goToOrderDetail(id, hasGroupPurchase) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},

			// 接单方法
			acceptOrder(item) {
				// 已出票订单不需要接单功能
				return;
			},

			// 点击卡片查询详情
			details(id, hasGroupPurchase) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			
			// 初始化事件
			init() {
				uni.showLoading({ title: '加载中...' });

				// 直接使用stateList获取所有相关状态的订单
				lotteryOrderList(this.queryParam).then(res => {
					if (res.success) {
						this.total = res.total; // 更新当前列表的总数，用于分页
						this.lotteryOrderList = res.voList || [];
					} else {
						uni.showToast({ title: `加载列表失败: ${res.errorMsg || ''}`, icon: 'none' });
						this.total = 0;
						this.lotteryOrderList = [];
					}
					uni.hideLoading();
				}).catch(err => {
					console.error("加载初始列表出错:", err);
					this.total = 0;
					this.lotteryOrderList = [];
					uni.hideLoading();
				});
			},
			
			clearTimer() {
				if (this.timerId) {
					clearInterval(this.timerId);
					this.timerId = null;
				}
			},
			
			// 彩种选择相关方法
			openTypePopup() {
				// 打开弹窗时，将当前查询条件反映到复选框模型
				const allTypeValues = this.lotteryTypes.map(t => t.type);
				if (!this.queryParam.typeList || this.queryParam.typeList.length === 0) {
					// 如果查询列表为空(表示查询全部)，则默认全选
					this.selectedTypeModels = ['all', ...allTypeValues];
				} else {
					// 否则，仅选中已选类型
					this.selectedTypeModels = [...this.queryParam.typeList];
					// 检查是否所有类型都被选了，如果是，也勾选 all
					if(this.selectedTypeModels.length === allTypeValues.length){
						this.selectedTypeModels.push('all');
					}
				}
				this.showTypePopup = true;
			},
			closeTypePopup() {
				this.showTypePopup = false;
			},
			// 处理类型按钮点击
			handleTypeClick(type) {
				const allTypeValues = this.lotteryTypes.map(t => t.type);
				if (type === 'all') {
					// 点击"全部"
					if (this.isAllTypesSelected) {
						// 如果当前已全选，则清空
						this.selectedTypeModels = [];
					} else {
						// 否则，全选
						this.selectedTypeModels = ['all', ...allTypeValues];
					}
				} else {
					// 点击单个彩种
					const index = this.selectedTypeModels.indexOf(type);
					if (index > -1) {
						// 如果已选中，则取消选中
						this.selectedTypeModels.splice(index, 1);
						// 如果之前是全选状态，取消选中后需要移除 all
						const allIndex = this.selectedTypeModels.indexOf('all');
						if (allIndex > -1) {
							this.selectedTypeModels.splice(allIndex, 1);
						}
					} else {
						// 如果未选中，则选中
						this.selectedTypeModels.push(type);
						// 检查是否因为选中此项而达到了全选
						const selectedConcreteTypes = this.selectedTypeModels.filter(name => name !== 'all');
						if (selectedConcreteTypes.length === allTypeValues.length) {
							if (!this.selectedTypeModels.includes('all')) {
								this.selectedTypeModels.push('all');
							}
						}
					}
				}
			},
			confirmTypeSelection() {
				// 根据 selectedTypeModels 更新 queryParam.typeList
				const selectedTypes = this.selectedTypeModels.filter(name => name !== 'all');

				if (this.selectedTypeModels.includes('all') || selectedTypes.length === 0) {
					// 如果选中了'all'，或者一个具体类型都没选，则查询全部
					this.queryParam.typeList = [];
				} else {
					// 否则，使用选中的具体类型列表
					this.queryParam.typeList = selectedTypes;
				}

				this.closeTypePopup();
				// 重置并刷新数据
				this.queryParam.pageNo = 1;
				this.lotteryOrderList = [];
				this.init(); // 重新加载数据
			},
			// 根据订单ID搜索
			searchByOrderId() {
				if (!this.orderIdInput || this.orderIdInput.trim() === "") {
					uni.showToast({
						title: '请输入订单编号',
						icon: 'none'
					});
					return;
				}
				
				uni.showLoading({ title: '搜索中...' });
				let queryParam = {
					orderId: this.orderIdInput.trim(),
					stateList: this.queryParam.stateList,
				}
				// 调用订单ID查询接口
				lotteryOrderList(queryParam).then(res => {
					if (res.success) {
						this.lotteryOrderList = res.voList || [];
						this.total = 1; // 只有一条结果
					} else {
						uni.showToast({
							title: res.errorMsg || '未找到该订单',
							icon: 'none'
						});
						// 清空列表
						this.lotteryOrderList = [];
						this.total = 0;
					}
					uni.hideLoading();
				}).catch(err => {
					console.error("搜索订单出错:", err);
					uni.showToast({
						title: '搜索失败，请稍后再试',
						icon: 'none'
					});
					uni.hideLoading();
				});
			},
		},
		// 计算属性
		computed: {
			displaySelectedTypes() {
				if (!this.queryParam.typeList || this.queryParam.typeList.length === 0) {
					return '全部彩种';
				}
				if (this.queryParam.typeList.length > 2) {
					const firstTwoNames = this.queryParam.typeList.slice(0, 2)
						.map(type => this.lotteryTypes.find(t => t.type === type)?.name || type);
					return `${firstTwoNames.join(', ')} 等${this.queryParam.typeList.length}种`;
				}
				return this.queryParam.typeList
					.map(type => this.lotteryTypes.find(t => t.type === type)?.name || type)
					.join(', ');
			},
            isAllTypesSelected() {
                return this.selectedTypeModels.includes('all');
            }
		},
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

	::v-deep(.u-empty ){
		margin-top: 50% !important;
	}

	::v-deep(.u-input ){
		background: #fff;
		height: 24rpx;
	}
	::v-deep(.uni-input-input ){
		font-size: 12px !important;
	}
	page {
		width: 100%;
		height: 100%;
		background: #eeeeee;
	}

	.printedOrders {
		width: 100%;
		height: 100%;

		.printedOrders-head {
			width: 100%;
			padding: 20upx 20upx; // 稍微调整左右内边距
			border-bottom: 1upx solid #eeeeee;
			background: #fff;
			/* Use Flexbox for layout */
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box; /* Include padding in width */

			.LH-title {
				color: #000000;
				font-size: 36upx;
				font-weight: bold;
				flex-grow: 1; // 允许标题扩展
				margin: 0 10upx; // 给标题左右留点空间
				text-align: center; // 确保标题居中
			}

			// 排序规则按钮样式
			.LH-sort-filter,
			.LH-type-filter { // 应用相同样式
				display: flex;
				align-items: center;
				font-size: 26upx;
				color: #666;
				background-color: #f5f5f5;
				padding: 8upx 15upx;
				border-radius: 20upx;
				flex-shrink: 0;
				cursor: pointer;
				min-width: 180upx; // 设置最小宽度
				box-sizing: border-box; // 统一盒模型
				justify-content: center; // 内部内容居中
			}

			.LH-sort-filter {
				visibility: hidden; /* 保持占位隐藏 */
				// 图标和文字间距
				text {
					margin-left: 8upx;
				}
			}

			// 彩种选择触发器
			.LH-type-filter {
				// 彩种文字样式
				text {
					margin-right: 8upx;
					max-width: 120upx; // 调整最大宽度以适应min-width
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					display: inline-block; // 确保 ellipsis 生效
				}
			}
		}

		.printedOrders-body {
			width: 100%;

			.LB-top {
				width: 100%;

				.LBT-list {
					width: 100%;

					.LBTL-list {
						width: 100%;
						padding-bottom: 120upx;
						font-size: 12px;
						display: flex;
						flex-direction: column;
						align-items: center;

						.LBTLL-ui {
							width: 100%;
						}
					}
				}
			}
		}
	}

	/* 弹窗样式 */
	.type-popup-content {
		padding: 30upx;
		display: flex;
		flex-direction: column;
		max-height: 70vh; // 设置一个最大高度，例如视口的70%
		background-color: #fff; // 确保有背景色
		box-sizing: border-box; // 防止 padding 撑开

		.popup-title {
			font-size: 32upx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30upx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
		}

		.popup-scroll-view {
			flex: 1; /* Let scroll area take up remaining space */
			overflow-y: auto; /* Allow vertical scrolling */
			margin-bottom: 30upx;
		}

		.type-grid-container {
			display: flex;
			flex-wrap: wrap;
			gap: 15upx; // 设置网格项之间的间隙
		}

		.type-grid-item {
			width: calc(25% - 12upx); // 每行4个，减去部分间隙以适应
			padding: 15upx 0; // 调整内边距
			border: 1upx solid #eee;
			border-radius: 10upx;
			text-align: center;
			font-size: 26upx;
			cursor: pointer;
			background-color: #f8f8f8;
			color: #666;
			box-sizing: border-box; // 确保 padding 和 border 不会撑大元素
			white-space: nowrap; // 防止文字换行
			overflow: hidden;
			text-overflow: ellipsis;

			&.selected {
				background-color: var(--themeColor);
				color: #fff;
				border-color: var(--themeColor);
			}
		}

		.popup-footer {
			padding-top: 20upx;
		}
	}

	/* 订单搜索样式 */
	.order-search-box {
		display: flex;
		padding: 24rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
		align-items: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.search-input-wrapper {
		flex: 1;
		background-color: #f5f7fa;
		border-radius: 36rpx;
		padding: 0 20rpx;
		margin-right: 20rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		transition: all 0.3s;
		box-sizing: border-box;
		
		&:focus-within {
			box-shadow: 0 0 0 2rpx rgba(var(--themeColorRgb), 0.2);
			background-color: #fff;
		}
	}
	
	.order-icon {
		margin-right: 10rpx;
		margin-left: 10rpx;
	}

	::v-deep(.order-id-input ){
		height: 100%;
		flex: 1;
		box-sizing: border-box;
	}

	::v-deep(.order-id-input .uni-input-wrapper ){
		height: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0;
	}

	::v-deep(.order-id-input .uni-input-input ){
		height: 100%;
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}
	
	::v-deep(.order-id-input .uni-input-placeholder ){
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0;
		margin: 0;
	}
	
	::v-deep(.order-id-input .uni-icon-clear ){
		font-size: 30rpx;
		color: #bbb;
	}

	.search-button {
		background: linear-gradient(135deg, var(--themeColor) 0%, var(--themeColorDark, #2979ff) 100%);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		height: 72rpx;
		border-radius: 36rpx;
		font-weight: 500;
		box-shadow: 0 4rpx 8rpx rgba(var(--themeColorRgb), 0.3);
		transition: transform 0.2s;
		
		&:active {
			transform: scale(0.97);
		}
	}

	.search-button text {
		font-size: 28rpx;
		margin-left: 10rpx;
	}
</style> 