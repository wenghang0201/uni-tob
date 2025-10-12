<template>
	<!-- 胜负彩和任选9 -->
	<uni-card class="rounded-10" is-shadow v-if="lotteryOrder.type == '6' || lotteryOrder.type == '7'" shadow="0px 0px 5px 3px rgba(0, 0, 0, 0.10)" :border="false">
		<view class="mb-20 flex justify-between align-center">
			<view class="flex flex-row justify-center item-center gap-20">
				<u-icon :name="lotteryOrder.ballUrl" size="24" :label="lotteryOrder.ballName" label-pos="right"></u-icon>
				<u-tag v-if="lotteryOrder.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
				<u-tag v-if="lotteryOrder.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
				<u-tag v-if="lotteryOrder.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
			</view>
			<view class="flex justify-end align-center">
				<view class="mr-10" v-if="lotteryOrder.stageNumber">
					期号: {{ lotteryOrder.stageNumber }}
				</view>
				<view class="tag-group">
					<u-tag :text="lotteryOrder.notes + '注'" type="error"></u-tag>
					<u-tag :text="(lotteryOrder.times || '') + '倍'" type="primary"></u-tag>
					<u-tag :text="isMultiple()?'复式':'单式'" type="primary"></u-tag>
					<u-tag 
						v-if="lotteryOrder.pssTypeList && lotteryOrder.pssTypeList.length > 0"
						v-for="(item, index) in lotteryOrder.pssTypeList" :key="index"
						:text="item + '串一'" type="primary">
					</u-tag>
				</view>
			</view>
		</view>
		<!-- 当订单状态为0时显示提示信息 -->
		<view v-if="[0, 8].includes(Number(lotteryOrder.state))" class="flex flex-col items-center justify-center py-40 px-20 rounded-16 my-16">
			<u-icon name="lock-fill" size="84rpx" color="#5E5E5E" class="mb-16"></u-icon>
			<text class="fs-26 text-center c-999">接单后显示订单详细信息</text>
		</view>
		<!-- 其他状态下显示表格 -->
		<uni-table v-else stripe emptyText="数据异常" class="victory-defeat-table">
			<!-- 表头行 -->
			<uni-tr class="table-header">
				<uni-th width="50" align="center">场次</uni-th>
				<uni-th width="100" align="center">主队/客队</uni-th>
				<uni-th width="65" align="center">投注内容</uni-th>
				<uni-th width="50" align="center">赛果</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(record, index) in lotteryOrder.ballInfoList" :key="index" class="table-row">
				<!-- <uni-td align="center" class="td-center td-number">
					<view class="match-number">
						<text class="match-day" v-if="record.number && record.number.match(/[\u4e00-\u9fa5]+/)">{{ record.number.match(/[\u4e00-\u9fa5]+/)[0] }}</text>
						<text class="match-id" v-if="record.number && record.number.match(/\d+/)">{{ record.number.match(/\d+/)[0] }}</text>
						<view class="content-inline" v-if="record.content.isGallbladder">
							<p>胆</p>
						</view>
					</view>
				</uni-td>
				<uni-td align="center" class="td-center">
					{{ formatTeamName(record.homeTeam) }}
					<view class="vs-text">vs</view>
					{{ formatTeamName(record.visitingTeam) }}
				</uni-td>
				<uni-td align="center" class="bet-content-cell">
					<span :style="notLet.describe == record.award[0] ? 'color:red' : ''"
						v-for="(notLet, index) in record.content.notLetOddsList" v-if="notLet.active" class="bet-item">
						<div class="bet-name">{{ notLet.describe }}</div>
						<div class="bet-odds">({{ formatOdds(notLet.odds) }})</div>
					</span>
					<span :style="record.halfFullCourt != undefined && lets.describe == (Number(record.halfFullCourt.split(',')[1].split(':')[0]) + Number(record.letBall) > Number(record.halfFullCourt.split(',')[1].split(':')[1]) ? '胜'
						: Number(record.halfFullCourt.split(',')[1].split(':')[0]) + Number(record.letBall) < Number(record.halfFullCourt.split(',')[1].split(':')[1]) ? '负'
							: '平') ? 'color:red' : ''" v-for="(lets, index) in record.content.letOddsList"
						v-if="lets.active" class="bet-item">
						<div class="bet-name">让{{ lets.describe }}</div>
						<div class="bet-odds">({{ formatOdds(lets.odds) }})</div>
					</span>
					<span :style="goal.describe == record.award[2] ? 'color:red' : ''"
						v-for="(goal, index) in record.content.goalOddsList" v-if="goal.active" class="bet-item">
						<div class="bet-name">{{ goal.describe }}</div>
						<div class="bet-odds">({{ formatOdds(goal.odds) }})</div>
					</span>
					<span :style="half.describe == record.award[3] ? 'color:red' : ''"
						v-for="(half, index) in record.content.halfWholeOddsList" v-if="half.active" class="bet-item">
						<div class="bet-name">{{ half.describe }}</div>
						<div class="bet-odds">({{ formatOdds(half.odds) }})</div>
					</span>
					<span :style="score.describe == record.award[4] ? 'color:red' : ''"
						v-for="(score, index) in record.content.scoreOddsList" v-if="score.active" class="bet-item">
						<div class="bet-name">{{ score.describe }}</div>
						<div class="bet-odds">({{ formatOdds(score.odds) }})</div>
					</span>
				</uni-td>
				<uni-td align="center" class="td-center td-number">
					<span v-if="record.award != undefined">
						{{ record.award[0] }}
					</span>
				</uni-td> -->
				<uni-td class="td-center">
					<view class="match-number-wrapper">
						<text>{{ record.number }}</text>
						<text class="gallbladder-mark-sfc" v-if="record.content && record.content.isGallbladder">胆</text>
					</view>
				</uni-td>
				<uni-td class="td-center">
					<view>{{ record.homeTeam}}</view>
					<view class="vs">VS</view>
					<view>{{ record.visitingTeam }}</view>
				</uni-td>
				<uni-td class="td-center">
					<view class="bet-option" :style="notLet.describe==record.award[0]?'color:red':''" v-for="(notLet,nlIndex) in record.content.notLetOddsList" :key="'nl'+nlIndex" v-if="notLet.active">
						{{notLet.describe}} ({{notLet.odds}})
					</view>
				</uni-td>
				<uni-td class="td-center">
					<text v-if="record.award!==undefined && record.award.length > 0">{{ record.award[0] }}</text>
					<text v-else>--</text>
				</uni-td>
			</uni-tr>
		</uni-table>
	</uni-card>
</template>

<script>
export default {
	name: 'victory-defeat-card',
	props: {
		lotteryOrder: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	methods: {
		formatOdds(odds) {
			if (!odds) return '';
			// 移除字符串前后的非数字字符，只保留数字(和小数点)
			const numericOdds = String(odds).replace(/[^\d.]/g, '');
			return numericOdds;
		},
		formatTeamName(teamName) {
			if (!teamName) return '';
			// 移除类似 [4] 的前缀，只保留实际队名
			return teamName.replace(/^\[\d+\]\s*/, '');
		},
		//判断是否是复式
		isMultiple() {
			if (this.lotteryOrder && this.lotteryOrder.ballInfoList.length > 0) {
				for (let i = 0; i < this.lotteryOrder.ballInfoList.length; i++) {
					let ballInfo = this.lotteryOrder.ballInfoList[i];
					if (ballInfo.content.notLetOddsList && ballInfo.content.notLetOddsList.length > 1) {
						return true;
					}
				}
			}
			return false;
		}
	}
}
</script>

<style scoped lang="scss">
/* 胜负彩和任选9样式 */
.mb-20 {
	margin-bottom: 20rpx;
}

.mr-10 {
	margin-right: 10rpx;
}

.flex {
	display: flex;
}

.flex-wrap {
	flex-wrap: wrap;
}

.justify-between {
	justify-content: space-between;
}

.justify-end {
	justify-content: flex-end;
}

.align-center {
	align-items: center;
}

.tag-group {
	display: flex;
	align-items: center;
	gap: 8px;
}

.content {
	width: 20px;
	height: 20px;
	background-color: var(--themeColor);
	border-radius: 50%;
	margin-top: 5px;

	p {
		width: 20px;
		height: 20px;
		color: #fff;
		text-align: center;
		line-height: 20px;
		font-size: 12px;
	}
}

.content-inline {
	width: 16px;
	height: 16px;
	background-color: var(--themeColor);
	border-radius: 50%;
	margin-left: 4px;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	p {
		color: #fff;
		font-size: 10px;
		line-height: 1;
	}
}

.bet-content-cell {
	white-space: normal !important;
	word-wrap: break-word;
	overflow-wrap: break-word;
	vertical-align: middle !important;
	padding: 8px 6px !important;
	font-size: 12px;
	line-height: 1.3;
	text-align: left;
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

.vs-text {
	font-size: 11px;
	line-height: 1;
	margin: 2px 0;
	color: #999;
}

.td-center {
	font-size: 12px;
	padding: 8px 6px;
	vertical-align: middle;
	line-height: 1.3;
	white-space: nowrap;
}

.td-number {
	white-space: nowrap;
	font-weight: 500;
}

.match-number {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	white-space: nowrap;
}

.match-day {
	background-color: #3a8ee6;
	color: white;
	padding: 1px 4px;
	border-radius: 3px;
	font-size: 11px;
	margin-right: 3px;
}

.match-id {
	color: #333;
	font-weight: 500;
}

/* 整体表格样式 */
::v-deep .victory-defeat-table {
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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