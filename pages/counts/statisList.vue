<template>
	<!-- 流水统计列表 -->
	<view class="box">

		<nav-bar :title="'流水统计'" :back="true"></nav-bar>
		<u-sticky bgColor="#fff" style="margin-bottom: 30px;">
			<!-- 更新 Tabs 列表, 添加 :current 绑定 -->
			<u-tabs 
				:list="lassificationcList" 
				lineColor="#FF3F43" 
				:scrollable="false"
				:activeStyle="{color: '#FF3F43',fontWeight: 'bold',transform: 'scale(1.05)'}" 
				@click="changeSelectBall"
				:current="currentTabIndex" 
				>
			</u-tabs>
		</u-sticky>
		<view style="margin-top: 30upx;">
			<uni-datetime-picker type="daterange" @change="change" />
		</view>
		<!-- 更新统计显示 -->
		<view class="statistics-line" :style="{ color: sum >= 0 ? 'blue' : 'red' }">
			统计：￥{{ sum > 0 ? '+' + sum : sum }}
		</view>
		<view>
			<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length<=0" mode="order"
				text="没有流水记录"></u-empty>

			<!-- 使用 Flexbox 布局，参考 counts.vue -->
			<uni-card v-for="(item,index) in lotteryOrderList" :key="index" :border="false" 
				:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
				> 
				<!-- 移除 title 和 sub-title，或根据需要调整 -->

				<view class="card-content">
					<!-- 左侧信息：类型、昵称、手机、时间 -->
					<view class="info-left">
						<span>{{ formatTransactionType(item.type) }}</span>
						<br>
						<span>{{item.storeRemark || item.nickname}} | {{item.phone}}</span>
						<br>
						<span>{{item.createTime}}</span>
					</view>
					<!-- 右侧金额和余额 -->
					<view class="info-right" :style="{ color: item.price >= 0 ? 'blue' : 'red' }">
						<span>￥{{ formatPrice(item.price) }}</span>
						<!-- 仅当 afterValue 不为 null/undefined 时显示 -->
						<template v-if="item.afterValue != null">
							<br> <!-- 换行 -->
							<span class="balance-info">余额: {{ item.afterValue | formatBalance }}</span> 
						</template>
					</view>
				</view>
				<!-- 移除旧的 v-if 判断 -->
			</uni-card>
		</view>

	</view>
</template>

<script>
	// 切换 API 接口
	import {
		getMingXiOrders // 使用 getMingXiOrders
	} from '@/api/lotteryOrder.js'
	// import { getUser } from "@/api/user.js" // 如果不需要可以移除
	import { formatDate } from '@/util/date';
	export default {
		data() {
			return {
				minDate: `${new Date().getFullYear()-1}-01-01`,
				maxDate: formatDate(new Date(), 'yyyy-MM-dd'),
				// 添加交易类型映射 (与 counts.vue 同步，并补充 2 和 6)
				transactionTypeMap: {
					// 投注
					1: '下单竞彩足球', 2: '下单竞彩篮球', 3: '下单北京单场', 4: '下单排列3', 15: '下单排列5', 18: '下单七星彩', 21: '下单胜负彩', 24: '下单任选九', 27: '下单大乐透', 31: '下单双色球', 34: '下单福彩3D', 37: '下单快乐8', 40: '下单七乐彩',
					// 充值
					0: '充值', 99: '自动充值', 96: '手工加款', 7: '加款', 
					2: '充值', // 添加类别映射
					// 系统
					10: '竞彩足球退票', 11: '竞彩篮球退票', 12: '北京单场退票', 13: '排列3退票', 17: '排列5退票', 20: '七星彩退票', 23: '胜负彩退票', 26: '任选九退票', 29: '大乐透退票', 33: '双色球退票', 36: '福彩3D退票', 39: '快乐8退票', 42: '七乐彩退票', 97: '手工扣款', 8: '扣款',
					// 奖金
					// 6: '竞彩足球派奖', // 注意：6 在这里有歧义，优先使用下方提现类别
					7: '竞彩篮球派奖', 8: '北京单场派奖', 9: '排列3派奖', 16: '排列5派奖', 19: '七星彩派奖', 22: '胜负彩派奖', 25: '任选九派奖', 28: '大乐透派奖', 32: '双色球派奖', 35: '福彩3D派奖', 38: '快乐8派奖', 41: '七乐彩派奖',
					// 佣金
					14: '发单返佣金', 30: '销售返佣金',
					// 提现
					5: '提现', 98: '用户提现', 95: '提现失败退款',
					6: '提现' // 添加类别映射
				},
				user:{}, // 如果不需要可以移除
				that: this,
				stating:"7", // 默认选中加款
				currentTabIndex: 0, // 添加当前选中Tab的索引
				// 更新 Tabs 列表，使用正确的 type
				lassificationcList: [{
					name: '加款',
					type: "7" 
				}, {
					name: '扣款',
					type: "8" 
				}, {
					name: '充值',
					type: "2" // 修改 type 为 2
				}, {
					name: '提现',
					type: "6" // 修改 type 为 6
				}],
				// 更新查询条件
				queryParam: {
					type: "7", // 对应 getMingXiOrders 的 type
					startTime: "",
					endTime: "",
					pageNo: 1,
					pageSize: 10,
					userId: "", // 如果需要按用户查询，需要传入userId
					// 移除 payType, state, tenantId
				},
				sum: 0, // 用于存储统计金额，来自 sumPrice
				totalRecords: 0, // 用于存储总记录数，来自 total
				//订单记录列表
				lotteryOrderList: []
			}
		},
		onPullDownRefresh() {
			this.queryParam.pageNo = 1; // 重置页码
			this.lotteryOrderList = []; // 清空列表
			this.sum = 0; // 重置总和
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		filters: {
			//格式化日期
			formatDate(data, that) {
				return that.globalUtil.dateTimeFormat(data)
			},
			// 添加格式化余额的过滤器
			formatBalance(value) {
				const num = parseFloat(value);
				return isNaN(num) ? '--' : num.toFixed(2);
			}
		},
		onLoad(option) {
			let initialType = this.stating; // 默认类型
			// 检查 URL 参数中是否传入 type
			if (option && option.type) {
				// 验证传入的 type 是否在页签列表中
				const isValidType = this.lassificationcList.some(tab => tab.type === option.type);
				if (isValidType) {
					initialType = option.type; // 使用 URL 传入的有效类型
				} else {
					console.warn(`Invalid type '${option.type}' passed in URL. Defaulting to type '${initialType}'.`);
				}
			}
			
			// 设置初始状态和索引
			this.stating = initialType;
			this.queryParam.type = initialType;
			this.currentTabIndex = this.lassificationcList.findIndex(tab => tab.type === initialType);
			// 如果找不到索引（理论上不应该发生，因为有默认值），则默认为0
			if (this.currentTabIndex === -1) {
				this.currentTabIndex = 0;
			}

			// 移除旧的 tenantId 相关逻辑
			this.init();
		},
		//滚动到底部进行分页事件
		onReachBottom() {
			// 使用 totalRecords 判断
			if (this.lotteryOrderList.length >= this.totalRecords) {
				uni.showToast({ title: '没有更多数据了', icon: 'none' });
				return;
			}
			this.queryParam.pageNo++;
			this.init();
		},
		methods: {
			// 添加格式化交易类型的方法
			formatTransactionType(type) {
				return this.transactionTypeMap[type] || '未知操作'; 
			},
			// 添加格式化价格显示的方法
			formatPrice(price) {
				const num = parseFloat(price) || 0;
				const fixedPrice = num.toFixed(2);
				return num > 0 ? `+${fixedPrice}` : fixedPrice;
			},
			// 更新日期范围处理
			change(option) {
				this.queryParam.pageNo = 1; // 重置页码
				this.lotteryOrderList = []; // 清空列表
				this.sum = 0; // 重置总和
				
				if(option && option.length === 2 && option[0] && option[1]){
					this.queryParam.startTime = option[0]+" 00:00:00"; // 保持时间格式
					this.queryParam.endTime = option[1]+" 23:59:59"; // 保持时间格式
				} else {
					this.queryParam.startTime = "";
					this.queryParam.endTime = "";
				}
				// this.datas = {}; // 移除 datas 相关逻辑
				
				this.init()
			},
			// 更新 tab切换事件
			changeSelectBall(item) {
				// 找到点击项的索引
				const clickedIndex = this.lassificationcList.findIndex(tab => tab.type === item.type);
				if (clickedIndex !== -1) {
					this.currentTabIndex = clickedIndex; // 更新当前索引
				}
				
				this.queryParam.pageNo = 1; // 重置页码
				this.lotteryOrderList = []; // 清空列表
				this.sum = 0; // 重置总和
				this.stating = item.type; // 更新状态标记（如果还需要用）
				this.queryParam.type = item.type; // 设置查询类型
				
				// 移除旧的 state/payType 设置逻辑
				
				this.init();
			},
			// 更新初始化事件
			init() {
				uni.showLoading();
				// 调用 getMingXiOrders
				getMingXiOrders(this.queryParam).then(res => {
					this.totalRecords = res.total || 0; // 更新总记录数
					
					// 更新列表数据，处理分页
					if (this.queryParam.pageNo === 1) {
						this.lotteryOrderList = res.voList || [];
					} else {
						this.lotteryOrderList = [...this.lotteryOrderList, ...(res.voList || [])];
					}
					
					// 直接使用API返回的sumPrice作为总统计金额
					this.sum = parseFloat(res.sumPrice || 0).toFixed(2);

					// 移除旧的客户端 total 计算
					
					uni.hideLoading();
				}).catch(err => { // 添加错误处理
					console.error("获取流水失败:", err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 保持或调整通用样式 */
	::v-deep(.uni-card__header-extra-text ){
		font-size: 14px !important;
		color: #FF3F43 !important;
	}

	.uni-body {
		color: #909399;
	}
	
	/* 移除 .uni-body-moni 如果不再需要 */

	::v-deep(.u-empty ){
		margin-top: 50% !important;
	}

	::v-deep(.uni-datetime-picker--btn,)
	::v-deep(.uni-calendar-item--after-checked,)
	::v-deep(.uni-calendar-item--before-checked ){
		background: #FF3F43 !important;
	}
	
	/* 移除 .yj_chupiao, .yj_paijiang, .delOrder, .chupiao, .paijiang */
	
	/* 移除旧的 float 样式 */
	/* .left{ float: left; } */
	/* .right{ float: right; } */

	/* 引入 Flexbox 布局样式 (来自 counts.vue) */
	.card-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start; /* 顶部对齐 */
		padding: 10upx 0; 
	}

	.info-left {
		line-height: 1.5; /* 调整行高以适应多行 */
		padding-right: 10upx; /* 给右侧留出空间 */
	}

	.info-right {
		text-align: right; 
		line-height: 1.5; /* 调整行高 */
		flex-shrink: 0; /* 防止金额被压缩 */
	}
	
	.statistics-line {
		padding: 10upx;
		font-size: 28rpx; 
	}
	
	.balance-info {
		font-size: 24rpx; 
		color: #909399; 
	}
</style>