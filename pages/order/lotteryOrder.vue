<template>
	<view style="background: #f8f8f8; height: 100%; overflow: hidden;">
		<view class="lotteryOrder-head">
			<view class="LH-type-filter"></view>
			<view class="LH-title">订单</view>
			<!-- 新增：彩种选择触发器 -->
			<view class="LH-type-filter" @click="openTypePopup">
				<text>筛选</text>
				<u-icon name="arrow-down-fill" size="12" color="#666"></u-icon>
			</view>
			
		</view>
		<view style="margin-top: 100rpx;">
			<u-sticky bgColor="#fff" style="margin-bottom: 15upx;">
				<u-tabs
					:list="tabsWithCounts"
					lineColor="var(--themeColor)"
					:scrollable="true"
					inactiveStyle="font-size: 14px; color: #666666;"
					:activeStyle="{
						color: 'var(--themeColor)',
						fontSize: '14px',
						transition: 'all 0.3s ease'
					}"
					:itemStyle="{
						padding: '0 2%',
						height: '90upx',
						lineHeight: '90upx',
						width: '25%',
						textAlign: 'center'
					}"
					:lineWidth="60"
					:lineHeight="4"
					:lineColor="'var(--themeColor)'"
					:isEqually="true"
					@click="changeSelectBall"
					:current="valueTab">
				</u-tabs>
			</u-sticky>
		</view>
		<scroll-view
			style="height: 100%;"
			scroll-y="true"
			@scrolltolower="loadMore"
		>
			<view class="order-card" v-for="(item, index) in lotteryOrderList" :key="index">
				<order-item
					:item="item"
					:currentTime="currentTime"
					@details="details"
					@accept-order="acceptOrder"
					@go-to-order-detail="goToOrderDetail"
					@paijiang="paijiang"
				/>
			</view>
			<view class="LBTL-noMag">
				<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length<=0"
					mode="order" text="没有订单记录"></u-empty>
			</view>
			<view style="height: 350rpx;"></view>
		</scroll-view>


		<!-- 新增：彩种选择弹窗 - 修改 mode -->
		<u-popup :show="showTypePopup" @close="closeTypePopup" mode="top" closeable>
			<view class="type-popup-content">
				<view class="popup-title">筛选</view>
				<!-- 修改：使用 Flex 布局替代 Checkbox Group -->
				<scroll-view scroll-y="true" class="popup-scroll-view">
					<!-- 排序规则部分 -->
					<view class="filter-section">
						<view class="section-title">排序规则</view>
						<view class="sort-grid-container">
							<view
								v-for="(item, index) in sortOptions"
								:key="item.field"
								class="sort-grid-item"
								:class="{'selected': selectedSortField === item.field}"
								@click="handleSortClick(item)"
							>
								{{ item.name }}
							</view>
						</view>
					</view>

					<!-- 彩种选择部分 -->
					<view class="filter-section">
						<view class="section-title">彩种选择</view>
						<view class="type-grid-container">
							<!-- 全部彩种按钮 -->
							<view
								class="type-grid-item"
								:class="{'selected': selectedSingleType === 'all'}"
								@click="handleSingleTypeClick('all')"
							>
								全部彩种
							</view>
							<!-- 其他彩种按钮 -->
							<view
								v-for="(item, index) in lotteryTypes"
								:key="item.type"
								class="type-grid-item"
								:class="{'selected': selectedSingleType === item.type}"
								@click="handleSingleTypeClick(item.type)"
							>
								{{ item.name }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>



		<nav-bottom :current="0"></nav-bottom>
	</view>
</template>


<script>
	import {
		lotteryOrderList,
		getJointPurchaseList
	} from '@/api/lotteryOrder.js'
	import {
		deleteOrder,
		chupiaoOrder,
		paijiangOrder,
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
				stating: 0,
				valueTab: 0,
				isFirstLoad: true,
				lassificationcList: [{
					name: '待接单',
					state: "0",
					count: 0
				}, {
					name: '待出票',
					state: "7",
					count: 0
				}, {
					name: '合买',
					state: "8",
					count: 0
				}],
				// lassificationcList: [{
				// 	name: '待接单',
				// 	state: "0",
				// 	count: 0
				// }, {
				// 	name: '待出票',
				// 	state: "7",
				// 	count: 0
				// }, {
				// 	name: '合买',
				// 	state: "8",
				// 	count: 0
				// }, {
				// 	name: '待开奖',
				// 	state: "1",
				// 	count: 0
				// }, {
				// 	name: '未中奖',
				// 	state: "2",
				// 	count: 0
				// }, {
				// 	name: '待派奖',
				// 	state: "3",
				// 	count: 0
				// }, {
				// 	name: '已派奖',
				// 	state: "4",
				// 	count: 0
				// }, {
				// 	name: '拒绝',
				// 	state: "5",
				// 	count: 0
				// }, {
				// 	name: '退票',
				// 	state: "6",
				// 	count: 0
				// }],
				//查询条件
				queryParam: {
					userId: "",
					state: "0",
					startTime: "",
					endTime: "",
					phone:"",
					typeList: [], // 新增：彩种查询条件
					pageNo: 1,
					pageSize: 10
				},
				total: 0,
				//订单记录列表
				lotteryOrderList: [],
				currentTime: Date.now(), // 添加当前时间戳
				timerId: null, // 添加定时器ID
				needsRefresh: false, // 添加刷新标志
				// --- 新增彩种选择相关 ---
				showTypePopup: false, // 新增：彩种选择弹窗
				lotteryTypes: [ // 示例静态列表，建议从API获取
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
				selectedTypeModels: [], // 保留：兼容性
				selectedSingleType: 'all', // 新增：单选彩种
				// -------------------------

				// --- 新增排序规则相关 ---
				sortOptions: [ // 排序选项
					{ name: '下单时间', field: 'createTime' },
					{ name: '截止时间', field: 'orderDeadline' },
				],
				selectedSortField: 'createTime', // 当前选中的排序字段
				selectedSortOrder: 'asc', // 当前选中的排序规则：asc-升序，desc-降序
				// -------------------------
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
			//格式化日期
			formatDate(data, that) {
				return data
				// return that.globalUtil.dateTimeFormat(data)
			},
			//格式化状态
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
				this.stating = this.queryParam.state  = option.type;
				this.valueTab = this.lassificationcList.findIndex(tab => tab.state === option.type);
			}
			this.isFirstLoad = true;
			this.init();
		},
		// 添加onShow生命周期函数，每次页面显示时刷新数据（非首次加载）
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
		onHide() {
			// 组件销毁前清除定时器
			this.clearTimer();
		},
		methods: {
			// 去订单详情页（用于接单按钮点击）- 保留此方法以兼容其他地方的调用
			goToOrderDetail(id, hasGroupPurchase) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}` + "&fromAction=orderAccept",
					animationType: 'pop-in',
					animationDuration: 200
				})
			},

			// 直接接单（不跳转到详情页）
			acceptOrder(item) {
				// 用户点击确定，执行接单操作
				uni.showLoading({
					title: '接单中...'
				});

				// 调用接单API
				chupiaoOrder({
					'id': item.id,
					'state': "7"
				}).then(res => {
					uni.hideLoading();
					uni.showToast({
						title: '接单成功！',
						icon: 'success'
					});

					this.goToOrderDetail(item.jointPurchaseId || item.id, item.hasGroupPurchase);
				}).catch(err => {
					console.error('接单失败:', err);
				});
			},
			delOrder(id) {
				uni.showModal({
					title: '删除',
					content: '确认删除订单 : ' + id + ' ? ',
					success: function(res) {
						if (res.confirm) {
							deleteOrder({
								'orderId': id
							}).then(res => {
								if (res.success) {
									uni.showToast({
										title: '操作成功！',
										icon: 'none'
									});
									setTimeout(function() {
										location.reload()
									}, 1000);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},

			paijiang(id) {
				var str = '确认一键派奖?';
				if (id != 0) {
					str = '确认派奖该订单: ' + id + '?'
				} else {
					id = "";
				}
				uni.showModal({
					title: '派奖',
					content: str,
					success: function(res) {
						if (res.confirm) {
							paijiangOrder({
								'id': id
							}).then(res => {
								if (res.success) {
									uni.showToast({
										title: '操作成功！',
										icon: 'none'
									});
									setTimeout(function() {
										location.reload()
									}, 1000);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},


			chupiao(id, orderId) {
				var str = '确认一键出票?';
				var state = "1";
				if (id != 0) {
					str = '确认接单该订单: ' + orderId + '?'
				} else {
					id = "";
					state = "";
				}
				uni.showModal({
					title: '接单',
					content: str,
					success: function(res) {
						if (res.confirm) {
							chupiaoOrder({
								'id': id,
								'state': state
							}).then(res => {
								if (res.success) {
									uni.showToast({
										title: '接单成功！',
										icon: 'none'
									});
									setTimeout(function() {
										location.reload()
									}, 1000);
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},

			change(option) {
				this.queryParam.startTime = option[0];
				this.queryParam.endTime = option[1];
				this.lotteryOrderList = []
				this.init()
			},
			// tab切换事件
			changeSelectBall(item) {
				// **先清除可能存在的定时器，防止快速切换导致问题**
				this.clearTimer();

				this.queryParam.pageNo = 1;
				this.lotteryOrderList = []

				this.stating = item.state
				// 更新当前选中的 tab 索引
				this.valueTab = this.lassificationcList.findIndex(tab => tab.state === item.state);

				// 只加载列表数据，数量已在 init 中获取
				uni.showLoading({ title: '加载中...' });

				// 处理合买标签的特殊情况
				if (item.state === "8") {
					// 合买标签：使用新的合买列表API
					// 添加排序参数
					const jointPurchaseParams = {
						pageNo: this.queryParam.pageNo,
						pageSize: this.queryParam.pageSize,
						subsUnfinishedStatus: 0,
						// 添加排序参数
						orderField: this.selectedSortField,
						order: this.selectedSortOrder,
						// 彩票类型参数
						lotteryType: this.queryParam.typeList && this.queryParam.typeList.length === 1 ? this.queryParam.typeList[0] : undefined
					};

					getJointPurchaseList(jointPurchaseParams).then(res => {
						if (res.success) {
							this.total = res.total || 0; // 更新当前列表总数用于分页
							console.log('合买列表数据:', res); // 调试输出

							// 将合买列表数据转换为与普通订单列表兼容的格式
							this.lotteryOrderList = (res.voList || []).map(item => this.convertJointPurchaseToOrder(item));
						} else {
							uni.showToast({ title: `加载合买列表失败: ${res.errorMsg || ''}`, icon: 'none' });
							this.total = 0;
							this.lotteryOrderList = [];
						}
						uni.hideLoading();
					}).catch(err => {
						console.error("加载合买列表出错:", err);
						this.total = 0;
						this.lotteryOrderList = [];
					});
				} else {
					// 其他标签：使用原有的订单列表API
					// 设置 state 参数，清除 hasGroupPurchase 参数
					this.queryParam.state = item.state;
					delete this.queryParam.hasGroupPurchase;

					// !! 修改 API 调用，加入 typeList 和排序规则
					const queryParams = {
						...this.queryParam,
						sortField: this.selectedSortField,
						sortRules: this.selectedSortOrder
					};
					console.log("queryParams",queryParams)

					lotteryOrderList(queryParams).then(res => {
						if (res.success) {
							this.total = res.total; // 更新当前列表总数用于分页
							this.lotteryOrderList = res.voList || [];
							// **在数据加载完成后，根据当前状态决定是否启动定时器**
							if (this.queryParam.state === '0') {
								this.startTimer();
							}
						} else {
							uni.showToast({ title: `加载列表失败: ${res.errorMsg || ''}`, icon: 'none' });
							this.total = 0;
							this.lotteryOrderList = [];
						}
						uni.hideLoading();
					}).catch(err => {
						console.error("切换页签加载列表出错:", err);
						this.total = 0;
						this.lotteryOrderList = [];
					});
				}
			},
			//点击卡片查询详情
			details(id, hasGroupPurchase) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id + `&hasGroupPurchase=${hasGroupPurchase}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			search() {
				uni.showLoading();
				console.log("search",this.queryParam)
				lotteryOrderList(this.queryParam).then(res => {
					this.total = res.total;
					this.lotteryOrderList = res.voList
					uni.hideLoading();
				})
			},
			//初始化事件
			init() {
				uni.showLoading({ title: '加载中...' });

				// 1. 创建获取所有页签数量的 Promises (请求中也加入 typeList)
				const countFetchPromises = this.lassificationcList.map(tab => {
					// 处理合买标签的特殊情况
					if (tab.state === "8") {
						// 合买标签：使用新的合买列表API
						const jointPurchaseParams = {
							pageNo: 1,
							pageSize: 1, // 只需获取 total，设置 pageSize 为 1
							subsUnfinishedStatus: 0,
							// 可以根据需要添加其他参数，如彩票类型、排序方式等
							lotteryType: this.queryParam.typeList && this.queryParam.typeList.length === 1 ? this.queryParam.typeList[0] : undefined
						};

						return getJointPurchaseList(jointPurchaseParams).then(res => {
							if (res.success) {
								console.log('合买数量数据:', res); // 调试输出
								const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
								if (tabIndex !== -1) {
									this.$set(this.lassificationcList[tabIndex], 'count', res.total || 0);
								}
							} else {
								console.error(`获取合买列表数量失败:`, res.errorMsg);
								const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
								if (tabIndex !== -1) {
									this.$set(this.lassificationcList[tabIndex], 'count', 0); // 出错时设为0
								}
							}
						}).catch(err => {
							console.error(`请求合买列表数量出错:`, err);
							const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
							if (tabIndex !== -1) {
								this.$set(this.lassificationcList[tabIndex], 'count', 0); // 出错时设为0
							}
						});
					} else {
						// 其他标签：使用原有的订单列表API
						// 为普通标签创建查询参数
						const tabQueryParam = {
							...this.queryParam, // 继承基础参数，包括 typeList
							pageNo: 1,
							pageSize: 1, // 只需获取 total，设置 pageSize 为 1
							state: tab.state
						};
						console.log("tabQueryParam",tabQueryParam)
						// !! 修改 API 调用
						return lotteryOrderList(tabQueryParam).then(res => {
							if (res.success) {
								const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
								if (tabIndex !== -1) {
									this.$set(this.lassificationcList[tabIndex], 'count', res.total || 0);
								}
							} else {
								console.error(`获取状态 ${tab.state} 数量失败:`, res.errorMsg);
								const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
								if (tabIndex !== -1) {
									this.$set(this.lassificationcList[tabIndex], 'count', 0); // 出错时设为0
								}
							}
						}).catch(err => {
							console.error(`请求状态 ${tab.state} 数量出错:`, err);
							const tabIndex = this.lassificationcList.findIndex(t => t.state === tab.state);
							if (tabIndex !== -1) {
								this.$set(this.lassificationcList[tabIndex], 'count', 0); // 出错时设为0
							}
						});
					}
				});

				// 2. 创建获取当前选中页签列表数据的 Promise
				let listFetchPromise;

				// 处理合买标签的特殊情况
				if (this.stating === "8") {
					// 合买标签：使用新的合买列表API
					// 添加排序参数
					const jointPurchaseParams = {
						pageNo: 1,
						pageSize: this.queryParam.pageSize,
						subsUnfinishedStatus: 0,
						// 添加排序参数
						orderField: this.selectedSortField,
						order: this.selectedSortOrder,
						// 彩票类型参数
						lotteryType: this.queryParam.typeList && this.queryParam.typeList.length === 1 ? this.queryParam.typeList[0] : undefined
					};

					listFetchPromise = getJointPurchaseList(jointPurchaseParams).then(res => {
						if (res.success) {
							this.total = res.total || 0; // 更新当前列表总数用于分页
							console.log('合买列表数据:', res); // 调试输出

							// 将合买列表数据转换为与普通订单列表兼容的格式
							this.lotteryOrderList = (res.voList || []).map(item => this.convertJointPurchaseToOrder(item));
						} else {
							uni.showToast({ title: `加载合买列表失败: ${res.errorMsg || ''}`, icon: 'none' });
							this.total = 0;
							this.lotteryOrderList = [];
						}
					}).catch(err => {
						console.error("加载合买列表出错:", err);
						this.total = 0;
						this.lotteryOrderList = [];
					});
				} else {
					// 其他标签：使用原有的订单列表API
					// 创建当前页签的查询参数
					const currentTabQueryParam = {
						...this.queryParam, // 包含 typeList
						pageNo: 1,
						pageSize: this.queryParam.pageSize,
						state: this.stating
					};

					// !! 修改 API 调用，加入排序规则
					const queryParams = {
						...currentTabQueryParam,
						sortField: this.selectedSortField,
						sortRules: this.selectedSortOrder
					};
					console.log("queryParams",queryParams)
					listFetchPromise = lotteryOrderList(queryParams).then(res => {
						if (res.success) {
							this.total = res.total; // 更新当前列表的总数，用于分页
							this.lotteryOrderList = res.voList || [];
						} else {
							uni.showToast({ title: `加载列表失败: ${res.errorMsg || ''}`, icon: 'none' });
							this.total = 0;
							this.lotteryOrderList = [];
						}
					}).catch(err => {
						console.error("加载初始列表出错:", err);
						this.total = 0;
						this.lotteryOrderList = [];
					});
				}

				// 3. 等待所有请求完成
				Promise.all([...countFetchPromises, listFetchPromise]).finally(() => {
					uni.hideLoading();
					// Filter expired orders if initially loading '待接单' tab
					// Removed duplicate filter here
					// 初始化加载完成后，检查是否需要启动定时器
					if (this.queryParam.state === '0') {
						this.startTimer();
					} else {
						this.clearTimer();
					}
				});
			},
			startTimer() {
				// 清除旧的定时器（以防万一）
				this.clearTimer();
				// 每秒更新一次当前时间
				this.timerId = setInterval(() => {
					this.currentTime = Date.now();
				}, 1000);
			},
			clearTimer() {
				if (this.timerId) {
					clearInterval(this.timerId);
					this.timerId = null;
				}
			},
			// 计算并格式化剩余时间
			getRemainingTime(deadline) {
				if (!deadline) {
					return null;
				}

				const deadlineTime = new Date(deadline).getTime();
				const diff = deadlineTime - this.currentTime; // 毫秒差

				if (diff <= 0) {
					return null;
				}

				if (diff > 3600 * 1000) {
				    // 超过1小时，返回一个标记或其他，但不是null，以便isDeadlinePassed工作
				    // 或者简单地计算并让v-if决定是否显示
				    // 为了简化，我们让它计算，但在模板中用 v-if 控制显示
				}

				// 计算剩余小时、分钟和秒
				const hours = Math.floor((diff / (1000 * 60 * 60)) % 24); // 虽然只显示1小时内的，但计算还是需要的
				const minutes = Math.floor((diff / (1000 * 60)) % 60);
				const seconds = Math.floor((diff / 1000) % 60);

				// 格式化输出 HH:MM:SS (即使小时是0也显示)
				const formattedHours = String(hours).padStart(2, '0');
				const formattedMinutes = String(minutes).padStart(2, '0');
				const formattedSeconds = String(seconds).padStart(2, '0');

				return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
			},

			/**
			 * 将合买数据转换为与普通订单列表兼容的格式
			 * @param {Object} jointPurchase 合买数据
			 * @returns {Object} 转换后的订单数据
			 */
			convertJointPurchaseToOrder(jointPurchase) {
				console.log('转换合买数据:', jointPurchase); // 调试输出

				// 合买状态从100往上叠加，不转换为普通订单状态
				// 合买状态(0:认购中 1:已满员 2:已截止 3:进行中 4:已完成 5:成单失败)
				const statusMap = {
					0: '100', // 认购中
					1: '101', // 已满员
					2: '102', // 已截止
					3: '103', // 进行中
					4: '104', // 已完成
					5: '105'  // 成单失败
				};

				// 使用状态映射获取对应的订单状态
				let orderState = statusMap[jointPurchase.status] || '100';

				// 如果有中奖状态，添加到状态中
				// 中奖状态(0:未开奖 1:未中奖 2:已中奖)
				if (jointPurchase.winStatus === 1) {
					orderState = '110'; // 未中奖
				} else if (jointPurchase.winStatus === 2) {
					orderState = '111'; // 已中奖
				}

				// 创建一个与订单列表兼容的对象
				return {
					id: jointPurchase.id,
					orderId: jointPurchase.orderId || jointPurchase.id, // 优先使用订单ID，否则使用合买ID
					ballName: this.getBallNameByType(jointPurchase.lotteryType),
					ballUrl: jointPurchase.ballUrl,
					price: jointPurchase.totalAmount,
					createTime: jointPurchase.createTime,
					state: orderState,
					winPrice: jointPurchase.winAmount,
					hasGroupPurchase: 1, // 标记为合买订单，使用数字类型
					jointPurchaseId: jointPurchase.id, // 保存合买ID
					// 添加合买特有的字段
					progress: jointPurchase.progress || jointPurchase.completionPercentage, // 兼容不同字段名
					currentAmount: jointPurchase.currentAmount,
					remainAmount: jointPurchase.remainAmount,
					guaranteeAmount: jointPurchase.guaranteeAmount,
					guaranteeRatio: jointPurchase.guaranteeRatio,
					statusDesc: jointPurchase.statusDesc,
					description: jointPurchase.description,
					// 如果是神单或推荐单，可以添加标记
					divineOrder: jointPurchase.divineOrder,
					groupHallRecommend: jointPurchase.groupHallRecommend,
					// 添加认购信息
					subscriptions: jointPurchase.subscriptions || [],
					nickname: jointPurchase.creatorNickname,
					notes: '-'
				};
			},

			/**
			 * 根据彩票类型获取彩票名称
			 * @param {String} type 彩票类型
			 * @returns {String} 彩票名称
			 */
			getBallNameByType(type) {
				const ballType = this.lotteryTypes.find(item => item.type === type);
				return ballType ? ballType.name : '未知彩种';
			},

			/**
			 * 根据彩票类型获取彩票图标
			 * @param {String} type 彩票类型
			 * @returns {String} 彩票图标URL
			 */
			getBallIconByType(type) {
				// 这里可以根据彩票类型返回对应的图标URL
				// 如果没有特定的图标映射，可以返回一个默认图标
				return 'ball-icon-' + type; // 假设图标命名规则为 ball-icon-{type}
			},
			// **新增**: 判断是否超过接单截止时间
			isDeadlinePassed(item) {
				if (!item || item.state !== '0' || !item.acceptanceDeadline) {
					return false; // 非待接单状态或无截止时间，不算过期
				}
				const deadlineTime = new Date(item.acceptanceDeadline).getTime();
				return deadlineTime <= this.currentTime;
			},
			// --- 新增彩种选择方法 ---
			openTypePopup() {
				// 打开弹窗时，将当前查询条件反映到单选模型
				if (!this.queryParam.typeList || this.queryParam.typeList.length === 0) {
					// 如果查询列表为空(表示查询全部)，则选中全部
					this.selectedSingleType = 'all';
				} else {
					// 否则，选中第一个类型（因为现在是单选）
					this.selectedSingleType = this.queryParam.typeList[0];
				}

				// 保留：兼容性 - 同时更新多选模型
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
			closeTypePopup(shouldRefresh = true) {
				this.showTypePopup = false;
				// 根据参数决定是否刷新数据
				if (shouldRefresh) {
					this.refreshDataAfterFilter();
				}
			},
			// 新增：处理单选类型按钮点击
			handleSingleTypeClick(type) {
				this.selectedSingleType = type;
				// 选择后立即刷新数据并关闭弹窗
				this.refreshDataAfterFilter();
				this.closeTypePopup(false); // 不重复刷新数据
			},

			// 保留：处理类型按钮点击（兼容性）
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
			// 新增：筛选后刷新数据的方法
			refreshDataAfterFilter() {
				// 根据 selectedSingleType 更新 queryParam.typeList
				if (this.selectedSingleType === 'all') {
					// 如果选中了'all'，则查询全部
					this.queryParam.typeList = [];
				} else {
					// 否则，使用选中的单个类型
					this.queryParam.typeList = [this.selectedSingleType];
				}

				// 重置并刷新数据
				this.queryParam.pageNo = 1;
				this.lotteryOrderList = [];
				this.init(); // 重新加载数据
			},

			// --- 新增排序规则方法 ---
			// 处理排序选项点击
			handleSortClick(item) {
				this.selectedSortField = item.field;
				this.selectedSortOrder = 'asc';
				console.log("handleSortClick",this.selectedSortField,this.selectedSortOrder)
				// 选择后立即刷新数据并关闭弹窗
				this.refreshDataAfterFilter();
				this.closeTypePopup(false); // 不重复刷新数据
			},
			// 新增：加载更多方法
			loadMore() {
				// 使用 this.total (当前列表的总数) 判断
				if (this.lotteryOrderList.length >= this.total) {
					uni.showToast({ title: '没有更多数据了', icon: 'none' });
					return;
				}
				this.queryParam.pageNo++;

				// 加载下一页数据
				uni.showLoading({ title: '加载更多...' });

				// 处理合买标签的特殊情况
				if (this.stating === "8") {
					// 合买标签：使用新的合买列表API
					const jointPurchaseParams = {
						pageNo: this.queryParam.pageNo,
						pageSize: this.queryParam.pageSize,
						subsUnfinishedStatus: 0,
						// 可以根据需要添加其他参数，如彩票类型、排序方式等
						lotteryType: this.queryParam.typeList && this.queryParam.typeList.length === 1 ? this.queryParam.typeList[0] : undefined
					};

					getJointPurchaseList(jointPurchaseParams).then(res => {
						if (res.success) {
							// 将合买列表数据转换为与普通订单列表兼容的格式，并追加到现有列表
							const newItems = (res.voList || []).map(item => this.convertJointPurchaseToOrder(item));
							this.lotteryOrderList = [...this.lotteryOrderList, ...newItems];
						} else {
							uni.showToast({ title: `加载更多失败: ${res.errorMsg || ''}`, icon: 'none' });
							this.queryParam.pageNo--; // 加载失败，页码回退
						}
						uni.hideLoading();
					}).catch(err => {
						console.error("加载更多合买列表出错:", err);
						this.queryParam.pageNo--; // 加载失败，页码回退
					});
				} else {
					// 其他标签：使用原有的订单列表API
					// 创建分页查询参数，加入排序规则
					const paginationQueryParam = {
						...this.queryParam, // 包含 typeList 和 pageNo
						state: this.stating,
						sortField: this.selectedSortField,
						sortRules: this.selectedSortOrder
					};
					console.log("paginationQueryParam",paginationQueryParam)
					// !! 修改 API 调用，加入 typeList 和排序规则
					lotteryOrderList(paginationQueryParam).then(res => {
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
					});
				}
			},
		},
		// 添加计算属性来处理页签显示
		computed: {
			tabsWithCounts() {
				return this.lassificationcList.map(tab => {
					return {
						...tab,
						name: tab.count > 0 ? `${tab.name} (${tab.count})` : tab.name
					};
				});
			},
			// --- 新增计算属性 ---
			displaySelectedTypes() {
				if (!this.queryParam.typeList || this.queryParam.typeList.length === 0) {
					return '全部彩种';
				}
				return this.queryParam.typeList
					.map(type => this.lotteryTypes.find(t => t.type === type)?.name || type)
					.join(', ');
			},
            isAllTypesSelected() {
                // 检查 selectedTypeModels 是否包含了 "all"
                // 修正：如果 all 被选中，即为全选
                return this.selectedTypeModels.includes('all');
            },

			// ---------------------
		},
	}
</script>


<style lang="scss" scoped>
	html,
	body,
	#app,
	page {
		height: 100%;
		width: 100%;
	}
    .lotteryOrder-head {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		z-index: 10;
		padding: 20upx 20upx;
		border-bottom: 1upx solid #eeeeee;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		flex-shrink: 0;
		box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);

		.LH-title {
			color: #000000;
			font-size: 36upx;
			font-weight: bold;
			flex-grow: 1; // 允许标题扩展
			margin: 0 10upx; // 给标题左右留点空间
			text-align: center; // 确保标题居中
		}

		// 新增：彩种选择触发器样式
		.LH-type-filter {
			display: flex;
			align-items: center;
			font-size: 26upx;
			color: #666;
			background-color: #f5f5f5;
			padding: 8upx 15upx;
			border-radius: 20upx;
			flex-shrink: 0;
			cursor: pointer;
			min-width: 120upx; // 设置最小宽度
			box-sizing: border-box; // 统一盒模型
			justify-content: center; // 内部内容居中

			// 彩种文字样式
			text {
				margin-right: 8upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				display: inline-block; // 确保 ellipsis 生效
			}
			// 图标紧随文字
			.u-icon {
				/* 图标样式 */
			}
		}

	}
	.lotteryOrder {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;

	}
	.lotteryOrder-body {
		width: 100%;
		margin-top: 100rpx; // 与 .lotteryOrder-head 高度一致
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: #ffffff;

		.LB-top {
			width: 100%;

			.LBT-bottom {
				/* 底部容器 */
			}

			.LBT-time {
				margin-top: 3upx;
			}

			.LBT-list {
				width: 100%;

				.LBTL-haveMag {
					width: 90%;
					margin: auto;

					.LBTLH-0 {
						margin-top: 15upx;
						padding: 15upx 0;
						border-radius: 10upx;
						text-align: center;
						background: var(--themeColor);
						font-size: 34upx;
						font-weight: bold;
						color: #ffffff;
					}

				}

				.LBTL-list {
					width: 100%;
					padding-bottom: 120upx;
					font-size: 12px;
					display: flex;
					flex-direction: column;
					align-items: center;

					.LBTLL-ui {
						width: 100%;
						// margin-top: 15upx;
						// padding: 20upx 0;

					}

				}

			}

		}

	}
	.action-container {
		display: flex;
		flex-direction: column; /* Let buttons and countdown be vertical */
		align-items: center; /* Center align */
		margin-bottom: 10upx; /* Add some spacing */
	}

	/* Add button internal countdown styles */
	.button-countdown {
		font-size: 22upx; /* Can be smaller than button text */
		color: #fff600; /* Bright color, or adjust based on button background */
		margin-top: 5upx; /* Add top spacing */
	}

	/* Optional: Adjust button styles to fit content */
	.BR-r {
		border-radius: 10upx;
		padding: 5px 20px; /* Adjust top and bottom padding */
		margin-bottom: 20upx;
		background: var(--themeColor);
		display: flex; /* Enable flex */
		flex-direction: column; /* Vertical arrangement */
		align-items: center; /* Center align */
	}

	/* **新增**: 超过截止时间按钮样式 */
	.expired-button {
		background-color: #f56c6c !important; // 使用 !important 确保覆盖
		color: #ffffff;
		cursor: not-allowed; // 设置鼠标样式为不可用
		// 继承 .BR-r 的其他样式
		border-radius: 10upx;
		padding: 5px 20px;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center; // 确保文字居中
	}

	/* --- Popup styles --- */
	.type-popup-content {
		padding: 30upx;
		display: flex;
		flex-direction: column;
		// height: 100vh; // 不再强制占满全屏高度
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
			padding-bottom: 30upx; /* 改为底部内边距 */
		}

		// 筛选部分样式
		.filter-section {
			margin-bottom: 30upx;

			.section-title {
				font-size: 28upx;
				font-weight: bold;
				color: #333;
				margin-bottom: 20upx;
				padding-bottom: 10upx;
				border-bottom: 1upx solid #f0f0f0;
			}
		}

		// 排序网格容器样式
		.sort-grid-container {
			display: flex;
			flex-wrap: wrap;
			gap: 15upx; // 设置网格项之间的间隙
		}

		.sort-grid-item {
			width: calc(50% - 8upx); // 每行2个，减去部分间隙以适应
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

		// 彩种网格容器样式
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


	}
	.order-card {
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
		margin: 20rpx 24rpx 0 24rpx;
		padding: 4rpx 2rpx;
	}
</style>