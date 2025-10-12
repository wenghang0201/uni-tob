<template>
	<uni-card class="rounded-10" is-shadow shadow="0px 0px 5px 3px rgba(0, 0, 0, 0.10)" :border="false">
		<view>
			<view class="flex align-center justify-between">
				<view class="flex flex-row justify-center item-center gap-20">
					<u-icon :name="lotteryOrder.ballUrl" size="24" :label="formatBasketBallName(lotteryOrder)" label-pos="right"></u-icon>
					<u-tag v-if="lotteryOrder.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
					<u-tag v-if="lotteryOrder.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
					<u-tag v-if="lotteryOrder.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
				</view>
				<view class="tag-group">
					<u-tag :text="lotteryOrder.notes + '注'" type="error"></u-tag>
					<u-tag :text="(lotteryOrder.times || '') + '倍'" type="primary"></u-tag>
					<u-tag
						v-if="lotteryOrder.pssTypeList && lotteryOrder.pssTypeList.length > 0"
						:text="lotteryOrder.pssTypeList.length === 1 && lotteryOrder.pssTypeList[0] == 1 ? '单关' : lotteryOrder.pssTypeList.join(',') + ' 串一'"
						type="primary"></u-tag>
					<u-tag type="warning" v-if="lotteryOrder.bonusOptimization" text = "奖金优化"></u-tag>
				</view>
			</view>
			<!-- 当订单状态为0时显示提示信息 -->
			<view v-if="[0, 8].includes(Number(lotteryOrder.state))"
				class="flex flex-col items-center justify-center py-40 px-20 rounded-16 my-16">
				<u-icon name="lock-fill" size="84rpx" color="#5E5E5E" class="mb-16"></u-icon>
				<text class="fs-26 text-center c-999">接单后显示订单详细信息</text>
			</view>
			<!-- 其他状态下显示表格 -->
			<uni-table v-else stripe emptyText="数据异常" class="basketball-table">
				<!-- 表头行 -->
				<uni-tr class="table-header">
					<uni-th width="10" align="center">场次</uni-th>
					<uni-th width="100" align="center">客队/主队</uni-th>
					<uni-th width="75" align="center">投注内容</uni-th>
					<uni-th width="40" align="center">赛果</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(record, index) in (['7'].includes(lotteryOrder.state) ? lotteryOrder.ballInfoList : (lotteryOrder.ticketedBallInfoList || lotteryOrder.ballInfoList))" :key="index" class="table-row">
					<uni-td class="td-center">
						<view class="match-number">
							<text class="match-day">{{ getMatchDay(record.number) }}</text>
							<text class="match-id">{{ getMatchId(record.number) }}</text>
						</view>
					</uni-td>
					<uni-td class="td-center">
						<view>{{ record.visitingTeam }}</view>
						<view class="vs">
							<text>VS</text>
						</view>
						<view>
							{{ record.homeTeam }}
							<text class="let-ball"
								:class="{ 'let-ball-positive': record.letBall > 0, 'let-ball-negative': record.letBall < 0 }"
								v-if="record.content.cedePointsOddsList.length > 0">
								({{ record.letBall }})</text>
							</view>
					</uni-td>
					<uni-td class="td-center">
						<view class="bet-option"
							:style="winNegative.describe == record.award[0] ? 'color:red' : ''"
							v-for="(winNegative, wnIndex) in record.content.winNegativeOddsList" :key="'wn' + wnIndex">
							{{ winNegative.describe }}({{ winNegative.odds }})
						</view>
						<view class="bet-option"
							:style="cedePoints.describe == record.award[1] ? 'color:red' : ''"
							v-for="(cedePoints, cpIndex) in record.content.cedePointsOddsList" :key="'cp' + cpIndex">
							让{{ cedePoints.describe }}({{ cedePoints.odds }})
						</view>
						<view class="bet-option"
							:style="size.describe == record.award[3] ? 'color:red' : ''"
							v-for="(size, szIndex) in record.content.sizeOddsList" :key="'sz' + szIndex">
							{{ size.describe }}<text class="score-threshold">[{{ size.score }}]</text>({{ size.odds }})
						</view>
						<view class="bet-option"
							:style="difference.describe == record.award[2] ? 'color:red' : ''"
							v-for="(difference, dIndex) in record.content.differenceOddsList" :key="'d' + dIndex">
							{{ difference.describe }}({{ difference.odds }})
						</view>
					</uni-td>
					<uni-td class="td-center">
						<text v-if="record.halfFullCourt !== undefined">{{ record.halfFullCourt }}</text>
						<text v-else>--</text>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</uni-card>
</template>

<script>
export default {
	name: 'basketball-card',
	props: {
		lotteryOrder: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			that: this
		}
	},
	methods: {
		formatBasketBallName(lotteryOrder){
			console.log('lotteryOrder',lotteryOrder);
			let gameName = "竞彩篮球";
			if(lotteryOrder){
				let ballGameType = {};
				for(let i = 0; i < lotteryOrder.ballInfoList.length; i++){
					let ballInfo = lotteryOrder.ballInfoList[i];
					let betContent = ballInfo.content;
					if(betContent.cedePointsOddsList && betContent.cedePointsOddsList.length > 0){
						ballGameType["cedePointsOdd"] = "让分胜负";
					}
					if(betContent.differenceOddsList && betContent.differenceOddsList.length > 0){
						ballGameType["differenceOdd"] = "胜分差";
					}
					if(betContent.sizeOddsList && betContent.sizeOddsList.length > 0){
						ballGameType["sizeOdd"] = "大小分";
					}
					if(betContent.winNegativeOddsList && betContent.winNegativeOddsList.length > 0){
						ballGameType["winNegativeOdd"] = "胜负";
					}
				}
				//判断ballGameType是否存在多个key
				if(Object.keys(ballGameType).length > 1){
					return gameName+" 混合过关";
				}
				//如果存在一个，则返回ballGameType的值
				if(Object.keys(ballGameType).length === 1){
					return gameName+" "+ballGameType[Object.keys(ballGameType)[0]];
				}
			}
			return gameName;
		},
		formatOdds(odds) {
			if (!odds) return '';
			// 移除字符串前后的非数字字符，只保留数字(和小数点)
			const numericOdds = String(odds).replace(/[^\d.]/g, '');
			return numericOdds;
		},
		
		// 获取比赛日期（中文部分）
		getMatchDay(number) {
			if (!number) return '';
			// 匹配中文字符（包括周一到周日）
			const match = number.match(/^[周一二三四五六日]+/);
			return match ? match[0] : '';
		},
		
		// 获取比赛编号（数字部分）
		getMatchId(number) {
			if (!number) return '';
			// 匹配数字部分
			const match = number.match(/\d+$/);
			return match ? match[0] : number;
		}
	}
}
</script>

<style lang="scss" scoped>
.rangqiu {
	color: #2ecc71;
	/* 浅绿色 */
}

.rangqiuBlue {
	color: #2ecc71;
	/* 也使用相同的浅绿色 */
}

.bet-content-cell {
	white-space: normal;
	font-size: 12px;
	padding: 8px 6px;
	line-height: 1.3;
}

.vs-text {
	font-size: 11px;
	line-height: 1;
	margin: 2px 0;
	color: #999;
}

.tag-group {
	display: flex;
	align-items: center;
	gap: 8px;
}

.td-center {
	font-size: 12px;
	padding: 8px 6px;
	vertical-align: middle;
	line-height: 1.3;
	white-space: nowrap;
	text-align: center !important;
}

.td-number {
	white-space: nowrap;
	font-weight: 500;
}

/* 整体表格样式 */
::v-deep .basketball-table {
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	margin-top: 12px;
}

/* 表头样式优化 */
::v-deep .uni-table-th {
	background-color: #f2f2f2 !important;
	font-weight: 600 !important;
	color: #777 !important;
	font-size: 13px !important;
	border-bottom: 1px solid #e0e0e0 !important;
	padding: 10px 8px !important;
	transition: background-color 0.3s;
}

/* 表格内容样式优化 */
::v-deep .uni-table-td {
	color: #444 !important;
	padding: 10px 8px !important;
	border-bottom: 1px solid #f0f0f0 !important;
	vertical-align: middle !important;
}

/* 行高适中 */
::v-deep .uni-table-tr {
	min-height: 40px !important;
	transition: background-color 0.2s;
}

/* 斑马纹更明显 */
::v-deep .uni-table-tr:nth-child(odd) {
	background-color: #f5f5f5 !important;
}

::v-deep .uni-table-tr:nth-child(even) {
	background-color: #ffffff !important;
}

/* 悬停效果 */
::v-deep .table-row:hover {
	background-color: #e6f1ff !important;
}

.bet-item {
	display: block;
	margin-bottom: 6px;
	text-align: center;
}

.bet-name {
	font-size: 12px;
	margin-bottom: 1px;
}

.bet-odds {
	font-size: 11px;
	color: #333;
	font-weight: 500;
}

.match-number {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
}

.match-day {
	background-color: #1ba3da;
	color: #ffffff;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 11px;
	margin-right: 4px;
	font-weight: 500;
}

.match-id {
	color: #333;
	font-weight: 500;
}

/* 等待接单提示样式 */
.waiting-order-tip {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	color: #999;
	background-color: #f9f9f9;
	border-radius: 8px;
	margin: 16px 0;
}

.waiting-order-icon {
	font-size: 48px;
	margin-bottom: 16px;
	color: #ccc;
}

.waiting-order-text {
	font-size: 16px;
	text-align: center;
}
</style>