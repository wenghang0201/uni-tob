# 创建新的北单组件

<template>
	<uni-card class="rounded-10" is-shadow shadow="0px 0px 5px 3px rgba(0, 0, 0, 0.10)" :border="false">
		<view class="flex align-center justify-between">
			<view class="flex flex-row justify-center item-center gap-20">
				<u-icon :name="lotteryOrder.ballUrl" size="24" :label="lotteryOrder.ballName" label-pos="right"></u-icon>
				<u-tag v-if="lotteryOrder.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
				<u-tag v-if="lotteryOrder.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
				<u-tag v-if="lotteryOrder.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
			</view>
			<view class="tag-group">
				<u-tag :text="lotteryOrder.notes + '注'" type="error"></u-tag>
				<u-tag :text="(lotteryOrder.times | '') + '倍'" type="primary"></u-tag>
				<u-tag
					v-if="lotteryOrder.pssTypeList && lotteryOrder.pssTypeList.length > 0"
					:text="lotteryOrder.pssTypeList.length === 1 && lotteryOrder.pssTypeList[0] == 1 ? '单关' : lotteryOrder.pssTypeList.join(',') + ' 串一'"
					type="primary"
				></u-tag>
			</view>
		</view>
		<!-- 当订单状态为0时显示提示信息 -->
		<view v-if="[0, 8].includes(Number(lotteryOrder.state))" class="flex flex-col items-center justify-center py-40 px-20 rounded-16 my-16">
			<u-icon name="lock-fill" size="84rpx" color="#5E5E5E" class="mb-16"></u-icon>
			<text class="fs-26 text-center c-999">接单后显示订单详细信息</text>
		</view>
		<!-- 其他状态下显示表格 -->
		<uni-table v-else stripe emptyText="数据异常" class="north-single-table">
			<!-- 表头行 -->
			<uni-tr class="table-header">
				<uni-th width="10" align="center">场次</uni-th>
				<uni-th width="100" align="center">主队/客队</uni-th>
				<uni-th width="65" align="center">投注内容</uni-th>
				<uni-th width="50" align="center">赛果<br>(全/半)</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(record, index) in lotteryOrder.ballInfoList" :key="index" class="table-row">
				<uni-td align="center" class="td-center td-number">
					<view class="match-number">
						<text class="match-day" v-if="record.number && record.number.match(/[\u4e00-\u9fa5]+/)">{{ record.number.match(/[\u4e00-\u9fa5]+/)[0] }}</text>
						<text class="match-id" v-if="record.number && record.number.match(/\d+/)">{{ record.number.match(/\d+/)[0] }}</text>
					</view>
				</uni-td>
				<uni-td align="center" class="td-center">
					{{ formatTeamName(record.homeTeam) }}
					<span class="rangqiu" :class="{ rangqiuBlue: record.letBall < 0 }">({{ record.letBall }})</span>
					<view class="vs-text">vs</view>
					{{ formatTeamName(record.visitingTeam) }}
				</uni-td>
				<uni-td align="center" class="bet-content-cell">
					<!-- <span :style="record.halfFullCourt != undefined && lets.describe == (Number(record.halfFullCourt.split(',')[1].split(':')[0]) + Number(record.letBall) > Number(record.halfFullCourt.split(',')[1].split(':')[1]) ? '胜'
						: Number(record.halfFullCourt.split(',')[1].split(':')[0]) + Number(record.letBall) < Number(record.halfFullCourt.split(',')[1].split(':')[1]) ? '负'
							: '平') ? 'color:red' : ''" v-for="(lets, index) in record.content.letOddsList"
						v-if="lets.active" class="bet-item">
						<div class="bet-name">让{{ lets.describe }}</div>
						<div class="bet-odds">({{ formatOdds(lets.odds, record.halfFullCourt, record.bonusOdds, 0, lets.describe) }})</div>
					</span>
					<span :style="goal.describe == record.award[1] ? 'color:red' : ''"
						v-for="(goal, index) in record.content.goalOddsList" v-if="goal.active" class="bet-item">
						<div class="bet-name">{{ goal.describe }}</div>
						<div class="bet-odds">({{ formatOdds(goal.odds, record.award, record.bonusOdds, 1, goal.describe) }})</div>
					</span>
					<span :style="score.describe == record.award[2] ? 'color:red' : ''"
						v-for="(score, index) in record.content.scoreOddsList" v-if="score.active" class="bet-item">
						<div class="bet-name">{{ score.describe }}</div>
						<div class="bet-odds">({{ formatOdds(score.odds, record.award, record.bonusOdds, 2, score.describe) }})</div>
					</span>
					<span :style="oddEven.describe == record.award[3] ? 'color:red' : ''"
						v-for="(oddEven, index) in record.content.oddEvenOdds" v-if="oddEven.active" class="bet-item">
						<div class="bet-name">{{ oddEven.describe }}</div>
						<div class="bet-odds">({{ formatOdds(oddEven.odds, record.award, record.bonusOdds, 3, oddEven.describe) }})</div>
					</span>
					<span :style="half.describe == record.award[4] ? 'color:red' : ''"
						v-for="(half, index) in record.content.halfWholeOddsList" v-if="half.active" class="bet-item">
						<div class="bet-name">{{ half.describe }}</div>
						<div class="bet-odds">({{ formatOdds(half.odds, record.award, record.bonusOdds, 4, half.describe) }})</div>
					</span>
					<span :style="winLose.describe == record.award[5] ? 'color:red' : ''"
						v-for="(winLose, index) in record.content.winLoseOdds" v-if="winLose.active" class="bet-item">
						<div class="bet-name">{{ winLose.describe === '胜' ? '主胜' : '客胜' }}</div>
						<div class="bet-odds">({{ formatOdds(winLose.odds, record.award, record.bonusOdds, 5, winLose.describe) }})</div>
					</span> -->
					<!-- Let Odds -->
					<view class="bet-option" :style="checkBeidanWin(record, 'let', lets.describe) ? 'color:red' : ''" v-for="(lets,lIndex) in record.content.letOddsList" :key="'l'+lIndex" v-if="lets.active">
							 {{lets.describe}}({{ getBeidanOdds(record, 'let', lets.describe, lets.odds) }})
					</view>
					<!-- Goal Odds -->
					<view class="bet-option" :style="checkBeidanWin(record, 'goal', goal.describe) ? 'color:red' : ''" v-for="(goal,gIndex) in record.content.goalOddsList" :key="'g'+gIndex" v-if="goal.active">
							 {{goal.describe}}({{ getBeidanOdds(record, 'goal', goal.describe, goal.odds) }})
					</view>
					<!-- Score Odds -->
					<view class="bet-option" :style="checkBeidanWin(record, 'score', score.describe) ? 'color:red' : ''" v-for="(score,sIndex) in record.content.scoreOddsList" :key="'s'+sIndex" v-if="score.active">
							 {{score.describe}}({{ getBeidanOdds(record, 'score', score.describe, score.odds) }})
					</view>
					<!-- Odd/Even Odds -->
					<view class="bet-option" :style="checkBeidanWin(record, 'oddEven', oddEven.describe) ? 'color:red' : ''" v-for="(oddEven,oeIndex) in record.content.oddEvenOdds" :key="'oe'+oeIndex" v-if="oddEven.active">
							 {{oddEven.describe}}({{ getBeidanOdds(record, 'oddEven', oddEven.describe, oddEven.odds) }})
					</view>
					<!-- Half/Whole Odds -->
					<view class="bet-option" :style="checkBeidanWin(record, 'half', half.describe) ? 'color:red' : ''" v-for="(half,hIndex) in record.content.halfWholeOddsList" :key="'h'+hIndex" v-if="half.active">
							 {{half.describe}}({{ getBeidanOdds(record, 'half', half.describe, half.odds) }})
					</view>
					
					<!-- Win/Loss -->
					<view class="bet-option" :style="checkBeidanWin(record, 'winloss', half.describe) ? 'color:red' : ''" v-for="(half,hIndex) in record.content.winLoseOdds" :key="'h'+hIndex" v-if="half.active">
							{{half.describe.length==1?(half.describe=='胜'?'主胜':'客胜'):half.describe}}
							({{ getBeidanOdds(record, 'winloss', half.describe, half.odds) }})
					</view>
				</uni-td>
				<uni-td align="center" class="td-center td-number">
					<span v-if="record.halfFullCourt != undefined">
						{{ record.halfFullCourt.split(',')[1] }}<br>半{{ record.halfFullCourt.split(',')[0] }}
					</span>
				</uni-td>
			</uni-tr>
		</uni-table>
	</uni-card>
</template>

<script>
export default {
	name: 'north-single-card',
	props: {
		lotteryOrder: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	methods: {
		formatOdds(odds, result, bonusOdds, index, describe) {
			if (!odds) return '';
			
			// 如果有结果并且结果匹配当前投注内容，显示开奖后的赔率
			if (result && bonusOdds && bonusOdds[index] && 
				((index === 0 && this.isLetResultMatch(result, describe)) || 
				 (index > 0 && describe === result[index]))) {
				return bonusOdds[index];
			}
			
			// 否则显示投注时的赔率
			return String(odds).replace(/[^\d.]/g, '');
		},
		// 让球结果匹配判断
		isLetResultMatch(halfFullCourt, describe) {
			if (!halfFullCourt || typeof halfFullCourt !== 'string') return false;
			
			try {
				const parts = halfFullCourt.split(',');
				if (parts.length < 2) return false;
				
				const score = parts[1].split(':');
				if (score.length < 2) return false;
				
				const homeScore = Number(score[0]);
				const awayScore = Number(score[1]);
				const letBall = Number(this.lotteryOrder.ballInfoList.find(b => b.halfFullCourt === halfFullCourt)?.letBall || 0);
				
				const result = homeScore + letBall > awayScore ? '胜' : 
							  homeScore + letBall < awayScore ? '负' : '平';
							  
				return describe === result;
			} catch (e) {
				return false;
			}
		},
		formatTeamName(teamName) {
			if (!teamName) return '';
			// 移除类似 [4] 的前缀，只保留实际队名
			return teamName.replace(/^\[\d+\]\s*/, '');
		},
		// Helper method to check if a Beidan bet won
		checkBeidanWin(record, betType, betDescribe) {
			if (!record) return false;
		
			const award = record.award; // Already parsed in init()
			const halfFullCourt = record.halfFullCourt;
		
			try {
				switch (betType) {
					case 'let': // 让球胜平负 (index 0 in award/bonusOdds)
						if (!halfFullCourt) return false;
						const scores = halfFullCourt.split(',')[1].split(':');
						const homeScore = Number(scores[0]);
						const awayScore = Number(scores[1]);
						const letBall = Number(record.letBall);
						const result = (homeScore + letBall > awayScore) ? '胜' : (homeScore + letBall < awayScore) ? '负' : '平';
						return betDescribe === result;
					case 'goal': // 总进球 (index 1)
						return award && award.length > 1 && betDescribe === award[1];
					case 'score': // 比分 (index 2)
						return award && award.length > 2 && betDescribe === award[2];
					case 'oddEven': // 单双 (index 3)
						return award && award.length > 3 && betDescribe === award[3];
					case 'half': // 半全场 (index 4)
						return award && award.length > 4 && betDescribe === award[4];
					default:
						return false;
				}
			} catch (e) {
				console.error("Error checking Beidan win:", e);
				return false;
			}
		},
		
		// Helper method to get the display odds for Beidan
		getBeidanOdds(record, betType, betDescribe, originalOdds) {
			const isWon = this.checkBeidanWin(record, betType, betDescribe);
			if (isWon) {
				const bonusOdds = record.bonusOdds; // Already parsed
				try {
					switch (betType) {
						case 'let': return (bonusOdds && bonusOdds.length > 0) ? bonusOdds[0] : '-';
						case 'goal': return (bonusOdds && bonusOdds.length > 1) ? bonusOdds[1] : '-';
						case 'score': return (bonusOdds && bonusOdds.length > 2) ? bonusOdds[2] : '-';
						case 'oddEven': return (bonusOdds && bonusOdds.length > 3) ? bonusOdds[3] : '-';
						case 'half': return (bonusOdds && bonusOdds.length > 4) ? bonusOdds[4] : '-';
						default: return originalOdds;
					}
				} catch (e) {
					console.error("Error getting Beidan bonus odds:", e);
					return '-'; // Return placeholder on error
				}
			} else {
				return originalOdds;
			}
		},
	}
}
</script>

<style scoped lang="scss">
.rangqiu {
	color: #2ecc71; /* 浅绿色 */
}

.rangqiuBlue {
	color: #3498db; /* 蓝色 */
}

.tag-group {
	display: flex;
	align-items: center;
	gap: 8px;
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
::v-deep .north-single-table {
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