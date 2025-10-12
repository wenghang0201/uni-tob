<template>
	<u-popup :show="show" mode="center" :round="8" @close="$emit('close')">
		<view class="commission-popup flex flex-col">
			<view class="popup-title fw-700 fs-32 p-20">请核对打票内容</view>

			<scroll-view scroll-y="true" class="popup-scroll-content">
				<view class="p-20">
					<view class="ticket-details">
						<!-- 彩票类型，期号 -->
						<view class="flex align-center justify-between mb-20">
							<text class="fs-28 fw-700">{{ lotteryOrder.ballName || '未知彩种' }}</text>

							<!-- 根据彩票类型显示期号 -->
							<text v-if="Number(lotteryOrder.type) >= 3 && lotteryOrder.recordList && lotteryOrder.recordList[0]"
								class="fs-28 period-number">
								期号：{{ lotteryOrder.recordList[0].stageNumber }}
							</text>
							<text
								v-else-if="Number(lotteryOrder.type) >= 9 && lotteryOrder.schemeDetails && lotteryOrder.schemeDetails[0]"
								class="fs-28 period-number">
								期号：{{ lotteryOrder.schemeDetails[0].stageNumber }}
							</text>
						</view>

						<!-- 投注内容表格 -->
						<uni-table border stripe emptyText="接单后可查看更多数据" class="ticket-table">
							<!-- 表头行 - 根据彩票类型显示不同表头 -->
							<uni-tr class="table-header">
								<!-- 福彩/排列五等数字彩票的表头 -->
								<template v-if="[3, 4, 5, 8, 9, 10, 11, 12].includes(Number(lotteryOrder.type))">
									<uni-th width="20" align="center">倍数</uni-th>
									<uni-th width="65" align="center">投注内容</uni-th>
								</template>

								<!-- 竞彩足球/篮球的表头 -->
								<template v-else>
									<uni-th width="15" align="center">场次</uni-th>
									<uni-th width="65" align="center">主客队</uni-th>
									<uni-th width="65" align="center">投注内容</uni-th>
								</template>
							</uni-tr>

							<!-- 表格内容行 - 根据彩票类型显示不同内容 -->
							<!-- 福彩类型 -->
							<template
								v-if="Number(lotteryOrder.type) >= 9 && Number(lotteryOrder.type) <= 12 && lotteryOrder.welfareInfoList && lotteryOrder.welfareInfoList.length > 0">
								<uni-tr
									v-for="(record, index) in lotteryOrder.welfareInfoList.slice(pageIndex * 5, (pageIndex + 1) * 5)"
									:key="index"
									:class="{'row-even': index % 2 === 1, 'row-odd': index % 2 === 0}">
									<uni-td align="center">
										<view class="fw-600 fs-30 c-theme">{{ record.times }}</view>
									</uni-td>
									<uni-td align="right" class="bet-content-cell">
										<!-- 福彩类型 (Type >= 9) - 字符显示 -->
										<view class="flex justify-end" v-if="Number(lotteryOrder.type) >= 9">
											<!-- <text class="ball-number">{{ (record.redBalls || '') }}</text><template v-if="record.blueBalls"> | <text class="blue-ball">{{ record.blueBalls }}</text></template> -->
											<view class="content-wrap" v-if="record.betContent">{{ formatWelfareContent(record.betContent,record.mode) }}</view>
										</view>
										<!-- 排列三 (Type 3) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '3'">
											<template v-if="record.mode == '1' || record.mode == '2' || record.mode == '6'">{{
												record.individual.map(c => c.num + (c.isGallbladder ? '(胆)' :
													'')).join(',')}}
											</template>
											<template v-else-if="record.hundred || record.ten">{{ record.hundred }} | {{
												record.ten }} | </template>
											<template v-else>{{ record.individual
												}}
											</template>
										</view>
										<!-- 排列五 (Type 4) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '4'">
											{{ record.myriad }} | {{ record.kilo }} | {{ record.hundred }} | {{
												record.ten }} | {{
												record.individual }}
										</view>
										<!-- 七星彩 (Type 5) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '5'">
											{{ record.hundredMyriad }} | {{ record.tenMyriad }} | {{ record.myriad
											}} |
											{{ record.kilo }} |
											{{ record.hundred }} | {{ record.ten }} | {{ record.individual }}
										</view>
										<!-- 大乐透 (Type 8) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '8'">
											{{record.ten.map(c => c.num + (c.isGallbladder ? '(胆)' : '')).join(',')
											}} | {{
												record.individual.map(c => c.num + (c.isGallbladder ? '(胆)' :
													'')).join(',')}}
										</view>
										<!-- 其他数字彩票 -->
										<view class="flex justify-end" v-else>
											未知数字彩类型内容
										</view>
									</uni-td>
								</uni-tr>
							</template>

							<!-- 数字彩票类型 -->
							<template
								v-else-if="Number(lotteryOrder.type) >= 3 && Number(lotteryOrder.type) <= 8 && lotteryOrder.recordList && lotteryOrder.recordList.length > 0">
								<uni-tr
									v-for="(record, index) in lotteryOrder.recordList.slice(pageIndex * 5, (pageIndex + 1) * 5)"
									:key="index"
									:class="{'row-even': index % 2 === 1, 'row-odd': index % 2 === 0}">
									<uni-td align="center">
										<view class="fw-600 fs-30 c-theme">{{ lotteryOrder.times }}</view>
									</uni-td>
									<uni-td align="right" class="bet-content-cell">
										<!-- 排列三 (Type 3) 的字符渲染 -->
										<view class="flex justify-end" v-if="lotteryOrder.type == '3'">
											<template v-if="record.hundred || record.ten">{{ record.hundred }} | {{
												record.ten }} | </template><template v-if="record.mode == '1' || record.mode == '2' || record.mode == '6'">{{
													record.individual.map(c => c.num + (c.isGallbladder ? '(胆)' :
														'')).join(',')}}</template><template v-else>{{ record.individual
												}}</template>
										</view>
										<!-- 排列五 (Type 4) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '4'">
											{{ record.myriad }} | {{ record.kilo }} | {{ record.hundred }} | {{
												record.ten }} | {{ record.individual
											}}
										</view>
										<!-- 七星彩 (Type 5) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '5'">
											{{ record.hundredMyriad }} | {{ record.tenMyriad }} | {{ record.myriad
											}} |
											{{ record.kilo }} |
											{{ record.hundred }} | {{ record.ten }} | {{ record.individual }}
										</view>
										<!-- 大乐透 (Type 8) 的字符渲染 -->
										<view class="flex justify-end" v-else-if="lotteryOrder.type == '8'">
											{{record.ten.map(c => c.num + (c.isGallbladder ? '(胆)' : '')).join(',')
											}} | {{
												record.individual.map(c => c.num + (c.isGallbladder ? '(胆)' :
													'')).join(',')
											}}
										</view>
										<!-- 其他数字彩票 -->
										<view class="flex justify-end" v-else>
											未知数字彩类型内容
										</view>
									</uni-td>
								</uni-tr>
							</template>

							<!-- 竞彩类型 -->
							<template v-else-if="lotteryOrder.ballInfoList && lotteryOrder.ballInfoList.length > 0">
								<uni-tr
									v-for="(record, index) in lotteryOrder.ballInfoList.slice(pageIndex * 5, (pageIndex + 1) * 5)"
									:key="index"
									:class="{'row-even': index % 2 === 1, 'row-odd': index % 2 === 0}">
									<uni-td align="center">{{ record.number }}</uni-td>
									<uni-td align="center" class="team-cell">
										<view class="home-team">{{ formatTeamName(record.homeTeam) }}</view>
										<view class="vs-text">vs</view>
										<view class="away-team">{{ formatTeamName(record.visitingTeam) }}</view>
									</uni-td>
									<uni-td align="center" class="bet-content-cell">
										<view class="bet-item" v-for="(notLet, idx) in record.content && record.content.notLetOddsList"
											>
											<view class="bet-desc-line">
												{{ notLet.describe }}
											</view>
											<view class="odds-line">
												<!-- 添加赔率修改框 - 扩展条件 -->
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.notLetOddsList[idx].odds"
														:placeholder="record.content.notLetOddsList[idx].odds" maxlength="10" class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ notLet.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(lets, idx) in record.content && record.content.letOddsList"
											>
											<view class="bet-desc-line">
												让{{ lets.describe }}
												<template v-if="lotteryOrder.type == '1'">
													<view class="input-label">让分值：</view><u-input type="text" v-model="record.content.cedePoints" placeholder="让分值" maxlength="10" class="odds-input" />
												</template>
											</view>
											<view class="odds-line">
												<view class="input-label">赔率：</view>
												<!-- 添加赔率修改框 - 扩展条件 -->
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<u-input type="text" v-model="record.content.letOddsList[idx].odds"
														:placeholder="record.content.letOddsList[idx].odds" maxlength="10" class="odds-input" />
												</template>
												<template v-else>
													<text class="odds-value">{{ lets.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(goal, idx) in record.content && record.content.goalOddsList"
											>
											<view class="bet-desc-line">
												{{ goal.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.goalOddsList[idx].odds"
														:placeholder="record.content.goalOddsList[idx].odds" maxlength="10" class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ goal.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(half, idx) in record.content && record.content.halfWholeOddsList"
											>
											<view class="bet-desc-line">
												{{ half.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.halfWholeOddsList[idx].odds"
														:placeholder="record.content.halfWholeOddsList[idx].odds" maxlength="10"
														class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ half.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(winLose, idx) in record.content && record.content.winLoseOdds"
											>
											<view class="bet-desc-line">
												{{ winLose.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.winLoseOdds[idx].odds"
														:placeholder="record.content.winLoseOdds[idx].odds" maxlength="10"
														class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ winLose.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(score, idx) in record.content && record.content.scoreOddsList"
											>
											<view class="bet-desc-line">
												{{ score.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.scoreOddsList[idx].odds"
														:placeholder="record.content.scoreOddsList[idx].odds" maxlength="10" class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ score.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(winNegative, idx) in record.content && record.content.winNegativeOddsList"
											>
											<view class="bet-desc-line">
												{{ winNegative.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.winNegativeOddsList[idx].odds"
														:placeholder="record.content.winNegativeOddsList[idx].odds" maxlength="10"
														class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ winNegative.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(cedePoints, idx) in record.content && record.content.cedePointsOddsList"
											>
											<view class="bet-desc-line">
												让{{ cedePoints.describe }}
												<template v-if="lotteryOrder.type == '1'">
													<view class="input-label">让分值：</view><u-input type="text" v-model="record.content.cedePoints" placeholder="让分值" maxlength="10" class="odds-input" />
												</template>
											</view>
											<view class="odds-line">
												<view class="input-label">赔率：</view>
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<u-input type="text" v-model="record.content.cedePointsOddsList[idx].odds"
														:placeholder="record.content.cedePointsOddsList[idx].odds" maxlength="10"
														class="odds-input" />
												</template>
												<template v-else>
													<text class="odds-value">{{ cedePoints.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(size, idx) in record.content && record.content.sizeOddsList"
											>
											<view class="bet-desc-line">
												{{ size.describe }}
												<template>
													<u-input type="text" v-model="size.score" placeholder="比分" maxlength="10" class="odds-input" />
												</template>
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.sizeOddsList[idx].odds"
														:placeholder="record.content.sizeOddsList[idx].odds" maxlength="10" class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ size.odds }}</text>
												</template>
											</view>
										</view>
										<view class="bet-item" v-for="(difference, idx) in record.content && record.content.differenceOddsList"
											>
											<view class="bet-desc-line">
												{{ difference.describe }}
											</view>
											<view class="odds-line">
												<template
													v-if="lotteryOrder.type == '0' || lotteryOrder.type == '1'">
													<view class="input-label">赔率：</view><u-input type="text" v-model="record.content.differenceOddsList[idx].odds"
														:placeholder="record.content.differenceOddsList[idx].odds" maxlength="10"
														class="odds-input" />
												</template>
												<template v-else>
													<view class="input-label">赔率：</view><text class="odds-value">{{ difference.odds }}</text>
												</template>
											</view>
										</view>
									</uni-td>
								</uni-tr>
							</template>

							<!-- 如果没有匹配任何类型，显示提示信息 -->
							<template v-else>
								<uni-tr>
									<uni-td colspan="3" align="center">
										<view class="p-20 c-666">彩票信息加载中，请稍候...</view>
									</uni-td>
								</uni-tr>
							</template>
						</uni-table>

						<!-- 分页控制 -->
						<view class="popup-pagination flex align-center justify-center mt-20" v-if="totalPages > 1">
							<view class="pagination-btn" :class="{ 'disabled': pageIndex === 0 }"
								@click="pageIndex > 0 && pageIndex--">
								<u-icon name="arrow-left" size="24"></u-icon>
							</view>
							<text class="pagination-text">{{ pageIndex + 1 }}/{{ totalPages }}</text>
							<view class="pagination-btn" :class="{ 'disabled': pageIndex >= totalPages - 1 }"
								@click="pageIndex < totalPages - 1 && pageIndex++">
								<u-icon name="arrow-right" size="24"></u-icon>
							</view>
						</view>

						<!-- 订单信息 -->
						<view class="order-info flex flex-col mt-20">
							<view class="order-item fs-28 mb-10">订单编号：<text class="order-value">{{ lotteryOrder.orderId }}</text></view>
							<view class="order-item fs-28 mb-10">投注金额：<text class="price-value">{{ lotteryOrder.price }}元</text></view>
							<view class="order-item fs-28 mb-10">投注时间：<text class="order-value">{{ lotteryOrder.createTime }}</text></view>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="popup-footer w-full flex flex-col items-center justify-center">
				<view v-if="!hasTickets" class="popup-btn warn-btn fw-700 fs-32" @click="$emit('upload')">
					请先上传票据</view>
				<view v-else class="popup-btn confirm-btn fw-700 fs-32" @click="$emit('confirm')">核对确认</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'ticket-confirm',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		lotteryOrder: {
			type: Object,
			required: true,
			default: () => ({})
		},
		hasTickets: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			pageIndex: 0 // 分页索引
		}
	},
	methods: {
		formatTeamName(teamName) {
			if (!teamName) return '';
			// 移除类似 [4] 的前缀，只保留实际队名
			return teamName.replace(/^\[\d+\]\s*/, '');
		},
		formatWelfareContent(content,mode){
			if (mode == '2') {
				let parts = content.split('#')
				if (parts.length == 2) {
					return `[胆:${parts[0]}] ${parts[1]}`
				}
			}
			return content;
		},
	},
	watch: {
		show(val) {
			if (val) {
				console.log("this.lotteryOrder.recordList",this.lotteryOrder.recordList)
				// 每次显示时重置页码
				this.pageIndex = 0;
			}
		}
	},
	computed: {
		totalPages() {
			let totalItems = 0;
			if (Number(this.lotteryOrder.type) >= 9 && Number(this.lotteryOrder.type) <= 12 && this.lotteryOrder.welfareInfoList) {
				totalItems = this.lotteryOrder.welfareInfoList.length;
			} else if (Number(this.lotteryOrder.type) >= 3 && Number(this.lotteryOrder.type) <= 8 && this.lotteryOrder.recordList) {
				totalItems = this.lotteryOrder.recordList.length;
			} else if (this.lotteryOrder.ballInfoList) {
				totalItems = this.lotteryOrder.ballInfoList.length;
			}
			return Math.ceil(totalItems / 5);
		}
	}
}
</script>

<style scoped lang="scss">
.commission-popup {
	width: 650rpx;
	max-height: 80vh;
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.popup-scroll-content {
	flex: 1;
	max-height: calc(80vh - 160rpx);
	overflow-y: auto;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
	color: #333;
	border-bottom: 1px solid #f0f0f0;
}

.period-number {
	color: #666;
}

/* 表格样式优化 */
.ticket-table {
	border: 1px solid #e5e5e5;
	border-radius: 6rpx;
	overflow: hidden;
	
	::v-deep .uni-table-tr {
		border-bottom: 1px solid #eaeaea;
	}
	
	::v-deep .uni-table-th {
		background-color: #f5f7fa !important;
		color: #333;
		font-weight: bold;
		padding: 12rpx 8rpx;
		border-right: 1px solid #eaeaea;
	}
	
	::v-deep .uni-table-td {
		padding: 16rpx 8rpx;
		border-right: 1px solid #eaeaea;
	}
}

/* 表格行背景色 */
::v-deep .row-odd {
	background-color: #ffffff;
}

::v-deep .row-even {
	background-color: #f8f9fc;
}

/* 球号样式 */
.ball-number {
	color: #e4393c;
	font-weight: 500;
}

.blue-ball {
	color: #3A7AE3;
	font-weight: 500;
}

/* 竞彩表格样式 */
.team-cell {
	padding: 12rpx 8rpx !important;
}

.home-team, .away-team {
	font-size: 26rpx;
	padding: 6rpx 0;
}

.vs-text {
	font-size: 24rpx;
	color: #999;
	margin: 4rpx 0;
}

/* 投注内容样式 */
.bet-item {
	margin-bottom: 16rpx;
	text-align: left;
	font-size: 26rpx;
	background-color: #f9f9f9;
	border-radius: 8rpx;
	padding: 12rpx;
	border-left: 4rpx solid #3A7AE3;
}

.bet-desc-line {
	color: #333;
	font-weight: 500;
	padding-bottom: 10rpx;
	border-bottom: 1px dashed #eaeaea;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.odds-line {
	color: #666;
	margin-top: 12rpx;
	display: flex;
	align-items: center;
	height: 50rpx;
}

.odds-value {
	color: #e4393c;
	font-weight: 500;
	margin-left: 4rpx;
}

.odds-input {
	display: inline-block;
	width: 120rpx;
	padding: 0 6rpx;
	margin: 0 4rpx;
	font-size: 24rpx;
	border: 1px solid #ddd;
	background-color: #fafafa;
	height: 44rpx;
	line-height: 44rpx;
	border-radius: 4rpx;
	vertical-align: middle;
}

/* 表格内容样式 */
.bet-content-cell {
	white-space: normal !important;
	word-wrap: break-word;
	overflow-wrap: break-word;
	vertical-align: middle !important;
	padding: 12rpx 8rpx !important;
	text-align: left;
}

.bet-content-cell .flex {
	flex-wrap: wrap;
}

/* 订单信息样式 */
.order-info {
	border-top: 1px dashed #eaeaea;
	padding-top: 20rpx;
}

.order-item {
	display: flex;
	align-items: center;
}

.order-value {
	color: #666;
}

.price-value {
	color: #e4393c;
	font-weight: 500;
}

.popup-footer {
	padding: 20rpx 0;
	border-top: 1px solid #eee;
}

.popup-btn {
	flex: 1;
	text-align: center;
	padding: 12px 0;
	font-size: 16px;
	border-radius: 8rpx;
	margin: 0 20rpx;
}

.confirm-btn {
	color: #3A7AE3;
	font-weight: 500;
}

.warn-btn {
	color: #f56c6c;
	font-weight: 500;
}

.ticket-details {
	margin-bottom: 30px;
}

.popup-pagination {
	margin-top: 20rpx;
}

.pagination-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60rpx;
	height: 60rpx;
	background-color: #f5f7fa;
	border-radius: 50%;
	margin: 0 20rpx;
	cursor: pointer;
}

.pagination-text {
	font-size: 28rpx;
	color: #666;
	min-width: 80rpx;
	text-align: center;
}

.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

/* 标签样式 */
.input-label {
	display: inline-block;
	min-width: 80rpx;
	margin-right: 10rpx;
	text-align: right;
	color: #666;
}
.content-wrap {
	word-break: break-all;
	word-wrap: break-word;
	white-space: normal;
	max-width: 100%;
	display: inline-block;
	text-align: left;
}
</style> 