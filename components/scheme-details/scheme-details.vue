<template>
	<view class="w-full h-full" style="overflow-y: scroll;"> 
		<uni-card class="w-750 mp0" 
			v-if="lotteryOrder.schemeDetails != null && lotteryOrder.schemeDetails != undefined && lotteryOrder.schemeDetails != '' && lotteryOrder.type != 3 && lotteryOrder.type != 4 && lotteryOrder.type != 5 && lotteryOrder.type != 8 && lotteryOrder.type < 9">
			<p>
				<view class="fw-700">方案详情</view>
				<view>共:{{displaySchemeDetails.length}}张票<span class="price-amount">{{lotteryOrder.price.toFixed(2)}}元</span></view>
				<uni-table border :stripe="false" emptyText="接单后可查看更多数据" class="custom-table make" >
					<!-- 表头行 -->
					<uni-tr style="background-color:#f5f5f5">
						<uni-th align="center" width="20px">序号</uni-th>
						<uni-th align="center" width="50px">过关</uni-th>
						<uni-th align="center" width="120px">拆单内容</uni-th>
						<uni-th align="center" width="40px">倍数</uni-th> <!-- 修改表头文本和宽度 -->
						<uni-th align="center" width="40px">票数</uni-th> 
						<uni-th align="center" width="80px">单票预测奖金</uni-th>
					</uni-tr>
					<!-- 表格数据行 - 改为遍历计算属性 -->
					<tbody v-for="(displayItem, index) in displaySchemeDetails" :key="displayItem._key + '-1'">
						<!-- Added unique key suffix -->
						<uni-tr :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }">
							<uni-td align="center">{{index + 1}}</uni-td>
							<uni-td align="center">{{ displayItem.type }}</uni-td>
							<uni-td align="left">
								<view @click="open(displayItem._key)" v-if="displayItem.ballCombinationList"
									style="display: flex;justify-content: left;align-items: left;flex-direction: column;font-size: 12px;">
									<span v-for="(ball, idx) in displayItem.ballCombinationList" :key="idx">
										<view v-if="idx > 0 && displayItem.ballCombinationList[idx - 1].number != ball.number">
											<br>
										</view>
										{{ ball.number }}|{{ ball.content }}<br> <!-- 修改为 number|content -->
									</span>
									<!-- <u-icon name="arrow-down"></u-icon> -->
								</view>
							</uni-td>
							<uni-td align="center">
								{{ displayItem.displayMultiplier }}倍
								<!-- 修改显示格式 -->
							</uni-td>
							<uni-td align="center">
								{{ displayItem.displayTicketCount }}张
								<!-- 修改显示格式 -->
							</uni-td>
							<uni-td align="center" v-if="lotteryOrder.type != 6 && lotteryOrder.type != 7">{{
								displayItem.forecastBonus }}</uni-td> <!-- 确保使用 displayItem -->
							<uni-td align="center" v-else>
								浮动奖金<br>
								以官网<br>
								出奖为准
							</uni-td>
						</uni-tr>
<!-- 		
						<uni-tr v-if="schemeExpansionState[displayItem._key]" style="background: #FAF9DE">
							<uni-th align="center" width="10px">场次</uni-th>
							<uni-th align="center" width="85px">主队</uni-th>
							<uni-th align="center" width="85px">客队</uni-th>
							<uni-th align="center" width="80px">投注内容</uni-th>
						</uni-tr>
						<uni-tr v-for="(data, idx) in displayItem.ballCombinationList" :key="idx + '-detail'"
							v-if="schemeExpansionState[displayItem._key]" style="background: #FAF9DE">
							<uni-td align="center">{{ data.number }}</uni-td>
							<uni-td align="center">{{ data.homeTeam }}</uni-td>
							<uni-td align="center">{{ data.visitingTeam }}</uni-td>
							<uni-td align="center">{{ data.content }}</uni-td>
						</uni-tr> -->
					</tbody>
				</uni-table>
			</p>
		</uni-card>
		
	
		<uni-card class="w-750 mp0" 
			v-if="lotteryOrder.schemeDetails != null && lotteryOrder.schemeDetails != undefined && lotteryOrder.schemeDetails != '' && (lotteryOrder.type == 3 || lotteryOrder.type == 4 || lotteryOrder.type == 5 || lotteryOrder.type == 8)">
			<!-- Updated condition -->
			<p>
				<view class="fw-700">方案详情</view>
				<view>共:{{displaySchemeDetails.length}}张票<span class="price-amount">{{lotteryOrder.price.toFixed(2)}}元</span></view>
				<uni-table border :stripe="false" emptyText="接单后可查看更多数据" class="custom-table make">
					<!-- 表头行 -->
					<uni-tr style="background-color:#f5f5f5">
						<uni-th align="center" width="40px">序号</uni-th>
						<uni-th align="center" width="40px">期号</uni-th>
						<uni-th align="center" width="30px" v-if="lotteryOrder.type == 3">过关</uni-th>
						<uni-th align="center" width="80px">中奖组合</uni-th>
						<uni-th align="center" width="40px">倍数</uni-th>
						<uni-th align="center" width="40px">票数</uni-th>
						<uni-th align="center" width="80px">单票预测奖金</uni-th>
					</uni-tr>
					<!-- 表格数据行 - 改为遍历计算属性 displaySchemeDetails -->
					<tbody v-for="(displayItem, index) in displaySchemeDetails" :key="displayItem._key">
						<uni-tr :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }">
							<uni-td align="center">{{index + 1}}</uni-td>
							<uni-td align="center">{{ displayItem.stageNumber }}</uni-td>
							<uni-td align="center" v-if="lotteryOrder.type == 3">
								{{ displayItem.mode | formatMode }}
							</uni-td>
							<uni-td align="center">
								{{ displayItem.content }}
							</uni-td>
							<uni-td align="center">
								{{ displayItem.displayMultiplier }}倍
							</uni-td>
							<uni-td align="center">
								{{ displayItem.displayTicketCount }}张
							</uni-td>
							<uni-td align="center" v-if="lotteryOrder.type == 3 || lotteryOrder.type == 4">{{
								displayItem.forecastBonus }}</uni-td>
							<uni-td align="center" v-else>
								浮动奖金以官网出奖为准
							</uni-td>
						</uni-tr>
					</tbody>
				</uni-table>
			</p>
		</uni-card>

		<!-- 新增：方案三，用于显示类型 >= 9 的彩票详情 (双色球, 福彩3D, 七乐彩等) -->
		<uni-card class="w-750 mp0" 
			v-if="lotteryOrder.schemeDetails != null && lotteryOrder.schemeDetails != undefined && lotteryOrder.schemeDetails != '' && (lotteryOrder.type >= 9 && lotteryOrder.type <= 12)">
			<!-- Adjust type range if needed -->
			<p>
				<view class="fw-700">方案详情</view>
				<view>共:{{displaySchemeDetails.length}}张票<span class="price-amount">{{lotteryOrder.price.toFixed(2)}}元</span></view>
				<uni-table border :stripe="false" emptyText="接单后可查看更多数据" class="custom-table make">
					<!-- 表头行 -->
					<uni-tr style="background-color:#f5f5f5">
						<uni-th align="center" width="40px">序号</uni-th>
						<uni-th align="center" width="40px">期号</uni-th>
						<!-- 移除 过关 列 -->
						<!-- 添加 内容 列 -->
						<uni-th align="center" width="110px">投注内容</uni-th>
						<uni-th align="center" width="40px">倍数</uni-th>
						<uni-th align="center" width="40px">票数</uni-th>
						<uni-th align="center" width="80px">单票预测奖金</uni-th>
					</uni-tr>
					<!-- 表格数据行 - 遍历 displaySchemeDetails -->
					<tbody v-for="(displayItem, index) in displaySchemeDetails" :key="displayItem._key + '-3'">
						<!-- Unique key -->
						<uni-tr :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }">
							<uni-td align="center">{{index + 1}}</uni-td>
							<uni-td align="center">{{ displayItem.stageNumber }}</uni-td>
							<!-- 添加：显示原始 content 字段 -->
							<uni-td align="center">{{ displayItem.content }}</uni-td>
							<uni-td align="center">
								{{ displayItem.displayMultiplier }}倍
							</uni-td>
							<uni-td align="center">
								{{ displayItem.displayTicketCount }}张
							</uni-td>
							<uni-td align="center">
								浮动奖金以官网出奖为准
							</uni-td>
						</uni-tr>
					</tbody>
				</uni-table>
			</p>
		</uni-card>
	</view>
</template>

<script>
export default {
	name: 'scheme-details',
	props: {
		lotteryOrder: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	data() {
		return {
			schemeExpansionState: {} // 添加用于管理方案详情展开状态的对象
		}
	},
	filters: {
		formatMode(mode) {
			if (mode == "0") {
				return "直选";
			} else if (mode == "1") {
				return "组三";
			} else if (mode == "2") {
				return "组六";
			} else if (mode == "3") {
				return "直选和值";
			} else if (mode == "4") {
				return "组选和值";
			} else if (mode == "5") {
				return "组三复式";
			}
		}
	},
	methods: {
		open(key) {
			if (this.schemeExpansionState.hasOwnProperty(key)) {
				this.$set(this.schemeExpansionState, key, !this.schemeExpansionState[key]);
			} else {
				// 如果 key 不存在，则添加并设置为 true (展开)
				this.$set(this.schemeExpansionState, key, true);
			}
		}
	},
	computed: {
		displaySchemeDetails() {
			if (!this.lotteryOrder || !Array.isArray(this.lotteryOrder.schemeDetails) || !this.lotteryOrder.type) {
				return [];
			}

			const lotteryType = parseInt(this.lotteryOrder.type, 10);
			let maxMultiplier = 50; // 默认值

			// 根据彩票类型确定最大倍数
			if ([9, 10, 12, 0, 1, 2].includes(lotteryType)) {
				maxMultiplier = 50;
			} else if (lotteryType === 11) {
				maxMultiplier = 15;
			} else if ([3, 4, 5, 8, 6, 7].includes(lotteryType)) {
				maxMultiplier = 99;
			}

			const processedDetails = [];
			this.lotteryOrder.schemeDetails.forEach((originalItem, originalIndex) => {
				const notes = parseInt(originalItem.notes, 10) || 0;
				if (notes <= 0) return;

				const originalForecastBonus = parseFloat(originalItem.forecastBonus) || 0;
				const bonusPerNote = notes > 0 ? originalForecastBonus / notes : 0;

				// 使用确定的 maxMultiplier 进行比较
				if (notes <= maxMultiplier) {
					processedDetails.push({
						...originalItem,
						displayMultiplier: notes,
						displayTicketCount: 1,
						forecastBonus: (bonusPerNote * notes).toFixed(2),
						_key: `${originalIndex}-0`
					});
				} else {
					// 使用 maxMultiplier 计算拆分
					const fullTickets = Math.floor(notes / maxMultiplier);
					const remainingMultiplier = notes % maxMultiplier;

					// 添加合并后的 maxMultiplier 倍条目
					if (fullTickets > 0) {
						processedDetails.push({
							...originalItem,
							displayMultiplier: maxMultiplier, // 显示最大倍数
							displayTicketCount: fullTickets,
							forecastBonus: (bonusPerNote * maxMultiplier * fullTickets).toFixed(2), // 计算对应奖金
							_key: `${originalIndex}-g`
						});
					}

					// 添加剩余倍数条目（如果存在）
					if (remainingMultiplier > 0) {
						processedDetails.push({
							...originalItem,
							displayMultiplier: remainingMultiplier,
							displayTicketCount: 1,
							forecastBonus: (bonusPerNote * remainingMultiplier).toFixed(2),
							_key: `${originalIndex}-r`
						});
					}
				}
			});
			return processedDetails;
		}
	}
}
</script>

<style scoped lang="scss">
.scheme {
	margin-top: 30px;
	overflow: auto;
	height: 1000rpx;
	overflow-x: hidden;
}

.mp0 {
	margin: 0 !important;
	padding: 0 !important;
}

.w-750 {
	width: 750rpx;
}

.make {
	margin-top: 15px;
}

.price-amount {
	color: #ff4d4f;
	font-weight: 500;
}

/* 表格样式优化 */
.custom-table {
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	margin-bottom: 30rpx;
	border: 1px solid #e8eaef;
}

::v-deep .uni-table {
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
}

::v-deep .uni-table-th {
	font-weight: 600;
	font-size: 13px;
	color: #333;
	background-color: #e8eaef !important;
	border: 1px solid #c1c6d2;
	white-space: nowrap;
	padding: 14px 8px;
	text-align: center;
}

::v-deep .uni-table-td {
	padding: 14px 8px;
	font-size: 13px;
	line-height: 1.5;
	vertical-align: middle;
	border: 1px solid #ddd;
	text-align: center;
}

::v-deep .uni-table-tr {
	transition: all 0.3s ease;
}

::v-deep .uni-table-tr:hover {
	background-color: #e6f7ff !important;
}

::v-deep .uni-table-tr:nth-child(2n+1) {
	background-color: #ffffff !important;
}

::v-deep .uni-table-tr:nth-child(2n) {
	background-color: #f5f5f5 !important;
}

::v-deep .uni-table tbody tr:nth-child(2n+1) {
	background-color: #ffffff !important;
}

::v-deep .uni-table tbody tr:nth-child(2n) {
	background-color: #f5f5f5 !important;
}

::v-deep .uni-table-tr:last-child .uni-table-td {
	border-bottom: none;
}

/* 增强表格边框样式 */
::v-deep .uni-table-border {
	border: 1px solid #c1c6d2 !important;
}

/* 调整列宽以适配内容 */
::v-deep .uni-th[align="center"] {
	text-align: center;
}

::v-deep .uni-td[align="center"] {
	text-align: center;
}

/* 增加价格强调 */
::v-deep .uni-td:last-child {
	color: #ff4d4f;
	font-weight: 500;
}

/* 美化倍数和票数显示 */
::v-deep .uni-table-td:nth-child(4),
::v-deep .uni-table-td:nth-child(5) {
	font-weight: 500;
	color: #2979ff;
}

/* 为表格添加响应式布局 */
@media screen and (max-width: 768px) {
	.custom-table {
		width: 100%;
		overflow-x: auto;
	}
}
</style> 