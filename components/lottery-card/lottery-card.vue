<template>
	<uni-card class="rounded-10" is-shadow shadow="0px 0px 5px 3px rgba(0, 0, 0, 0.10)" :border="false">
		<view class="mb-20 flex align-center justify-between">
			<view class="flex flex-row justify-center item-center gap-20">
				<u-icon :name="lotteryOrder.ballUrl" size="24" :label="lotteryOrder.ballName" label-pos="right"></u-icon>
				<u-tag v-if="lotteryOrder.fd == '1'" text="发单" size="mini" bgColor="#f54242" borderColor="#f54242"></u-tag>
				<u-tag v-if="lotteryOrder.gd == '1'" text="跟单" size="mini" bgColor="#7542f5" borderColor="#7542f5"></u-tag>
				<u-tag v-if="lotteryOrder.hasGroupPurchase == '1'" text="合买" size="mini" bgColor="#4287f5" borderColor="#4287f5"></u-tag>
			</view>
			<view style="display: flex;justify-content: flex-end;align-items: center;">
				<!-- 调整显示顺序，将期号放到注/倍前面 -->
				<view class="mr-10" v-if="lotteryOrder.recordList && lotteryOrder.recordList[0]">
					期号: {{ lotteryOrder.recordList[0].stageNumber }}
				</view>
				<u-tag :text="lotteryOrder.notes + '注'" type="error"></u-tag>
				<u-tag :text="lotteryOrder.times + '倍'" style="margin-left: 10px;"></u-tag>
				<u-tag text="追加" style="margin-left: 10px;" type="warning" v-if="lotteryOrder.isAdd"></u-tag>
			</view>
		</view>
		<!-- 当订单状态为0时显示提示信息 -->
		<view v-if="[0, 8].includes(Number(lotteryOrder.state))" class="flex flex-col items-center justify-center py-40 px-20 rounded-16 my-16">
			<u-icon name="lock-fill" size="84rpx" color="#5E5E5E" class="mb-16"></u-icon>
			<text class="fs-26 text-center c-999">接单后显示订单详细信息</text>
		</view>
		<!-- 其他状态下显示表格 -->
		<uni-table v-else stripe emptyText="数据异常" class="lottery-table">
			<!-- 表头行 -->
			<uni-tr class="table-header">
				<uni-th width="15" align="center">序号</uni-th>
				<uni-th width="65" align="center">玩法</uni-th>
				<uni-th width="150" align="center" class="bet-content-cell">投注内容</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(record, index) in lotteryOrder.recordList" :key="index" class="table-row">
				<uni-td align="center" class="td-center">{{ index+1 }}</uni-td>
				<uni-td align="center">{{formatMode(record.mode)}}</uni-td>
				<uni-td align="left" class="bet-content-cell">
					<!-- 修改：改为字符显示，添加自动换行和左对齐 -->
					<view class="flex flex-row flex-wrap justify-center gap-10">
						<span v-for="(c,index) in record.ten" :style="checkWinCode(c.num, record.reward, [0, 5]) ? 'color: red' : ''">
							{{ c.num }}
							<span v-if="c.isGallbladder">(胆)</span>
							<span v-if="index<record.ten.length-1">,</span>
						</span>|
						<span v-for="(c,index) in record.individual" :style="checkWinCode(c.num, record.reward, [5, 2]) ? 'color: blue' : ''">
							{{ c.num }}
							<span v-if="c.isGallbladder">(胆)</span>
							<span v-if="index<record.individual.length-1">,</span>
						</span>

						<!-- {{record.ten.map(c => c.num + (c.isGallbladder ? '(胆)' : '')).join(',')
						}} | {{
							record.individual.map(c => c.num + (c.isGallbladder ? '(胆)' :
								'')).join(',')}} -->
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>

		<view class="flex align-center py-20 flex-wrap ml-20" v-if="lotteryOrder.recordList[0].reward">
			<view class="flex align-center pt-10 mr-10 w-full c-000 fw-700">第<text class="fw-700 c-theme mx-10">{{
				lotteryOrder.recordList[0].stageNumber }}</text>期 开奖号码：
			</view>
			<view class="flex gap-10">
				<view class="fs-28" style="color: red;">{{ lotteryOrder.recordList[0].reward.split(',').splice(0, 5).join(',') }}</view>
				|
				<view class="fs-28" style="color: blue;">{{ lotteryOrder.recordList[0].reward.split(',').splice(5, 2).join(',') }}</view>
			</view>
		</view>
	</uni-card>
</template>

<script>
export default {
	name: 'lottery-card',
	props: {
		lotteryOrder: {
			type: Object,
			required: true,
			default: () => ({})
		}
	},
	data() {
		return {
			that: this
		}
	},
	methods: {
		formatMode(mode) {
			if(mode==0){
				return "单式"
			}else if(mode==1){
				return "复式"
			}else if(mode==2){
				return "胆拖"
			}
		},
		checkWinCode(code, reward, [start, end]) {
			return reward?.split(',').splice(start, end).includes(`${code}`);
		}
	}
}
</script>

<style scoped lang="scss">
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

.td-center {
	font-size: 12px;
	padding: 8px 6px;
	vertical-align: middle;
	line-height: 1.3;
	white-space: nowrap;
}

.bet-numbers {
	font-size: 13px;
	color: #333;
}

.reward-numbers {
	font-size: 28rpx;
	font-weight: bold;
	color: var(--themeColor);
	padding: 10rpx 0;
	word-break: break-all;
}

.content-wrap {
	word-break: break-all;
	word-wrap: break-word;
	white-space: normal;
	max-width: 100%;
	display: inline-block;
	text-align: left;
}

/* 整体表格样式优化 */
::v-deep .lottery-table {
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

/* 斑马纹样式 */
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