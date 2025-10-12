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
				<view class="mr-10" v-if="lotteryOrder.welfareInfoList && lotteryOrder.welfareInfoList[0]">
					期号: {{ getStageNumber() }}
				</view>
				<u-tag :text="lotteryOrder.notes + '注'" type="error"></u-tag>
				<u-tag :text="lotteryOrder.times + '倍'" style="margin-left: 10px;"></u-tag>

				<!-- <u-tag :text="lotteryOrder.times +'倍'" style="margin-left: 10px;"></u-tag> -->
			</view>
		</view>

		<!-- 当订单状态为0时显示提示信息 -->
		<view v-if="[0, 8].includes(Number(lotteryOrder.state))" class="flex flex-col items-center justify-center py-40 px-20 rounded-16 my-16">
			<u-icon name="lock-fill" size="84rpx" color="#5E5E5E" class="mb-16"></u-icon>
			<text class="fs-26 text-center c-999">接单后显示订单详细信息</text>
		</view>
		<uni-table v-else stripe emptyText="接单后可查看更多数据" class="welfare-table">
			<!-- 表头行 -->
			<uni-tr class="table-header">
				<uni-th width="50" align="center">序号</uni-th>
				<uni-th width="70" align="center">玩法</uni-th>
				<!-- <uni-th width="65" align="center">倍数</uni-th> -->
				<uni-th width="150" align="center" class="bet-content-cell">投注内容</uni-th>
				<!-- <uni-th width="65" align="center">赛果</uni-th> -->
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="(record, index) in lotteryOrder.welfareInfoList" :key="index" class="table-row">
				<uni-td align="center">
				{{index+1}}
				</uni-td>
				<uni-td align="center">
					<text class="smaller-text">{{getPlayTypeStr(record)}}</text>
				</uni-td>
				<!-- <uni-td align="center" class="td-center">
					<view class="fw-600 fs-30 c-theme">{{ record.times }}</view>
				</uni-td> -->
				<uni-td align="center" class="bet-content-cell">
					<!-- 修改：改为字符显示，添加样式使其自动换行 -->
					<view class="flex flex-row flex-wrap justify-center gap-10">
						<view v-if="record.hundredList && record.tenList && record.individualList">
							<view style="display: flex;flex-direction: column;">
								<view>
									<span>百位：</span>
									<span v-for="(c,index) in record.hundredList" :style="checkWinCode(c,0,record.playTypeCode) ? 'color: red' : ''">
										{{ c }}
										<span v-if="index<record.hundredList.length-1">,</span>
									</span>
								</view>
								<view>
									<span>十位：</span>
									<span v-for="(c,index) in record.tenList" :style="checkWinCode(c,1,record.playTypeCode) ? 'color: red' : ''">
										{{ c }}
										<span v-if="index<record.tenList.length-1">,</span>
									</span>
								</view>
								<view>
									<span>个位：</span>
									<span v-for="(c,index) in record.individualList" :style="checkWinCode(c,2,record.playTypeCode) ? 'color: red' : ''">
										{{ c }}
										<span v-if="index<record.individualList.length-1">,</span>
									</span>
								</view>
							</view>
							
						</view>
						<view class="auto-wrap" v-else-if="record.mode === '2'&& record.betContent.split('#').length === 2">
							<span v-for="(c, index) in record.betContent.split('#')[0].split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
								{{ c }}(胆)
								<span v-if="index<record.betContent.split('#')[0].split(',').length-1">,</span>
							</span>
							<span v-for="(c,index) in record.betContent.split('#')[1].split('|')[0].split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
								{{ c }}
								<span v-if="index<record.betContent.split('#')[1].split('|')[0].split(',').length-1">,</span>
							</span>
							<span v-if="index<record.betContent.split('#')[1].split('|').length-1">
								|
								<span v-for="(c,index) in record.betContent.split('#')[1].split('|')[1].split(',')" :style="checkWinCode(c,2) ? 'color: blue' : ''">
									{{ c }}
									<span v-if="index<record.betContent.split('#')[1].split('|')[1].split(',').length-1">,</span>
								</span>
							</span>
						</view>
						<view class="auto-wrap" v-else-if="record.mode === '0'">
							<span v-if="record.type=='9'">
								<span v-for="(c,index) in record.redBalls.split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
									{{ c }}
									<span v-if="index<record.redBalls.split(',').length-1">,</span>
								</span>|
								<span v-for="(c,index) in record.blueBalls.split(',')" :style="checkWinCode(c,2) ? 'color: blue' : ''">
									{{ c }}
									<span v-if="index<record.blueBalls.split(',').length-1">,</span>
								</span>
							</span>
							<span v-else v-for="(c,index) in record.betContent.split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
								{{ c }}
								<span v-if="index<record.betContent.split(',').length-1">,</span>
							</span>
						</view>
						<view class="auto-wrap" v-else>
							<span v-if="record.type=='9'">
								<span v-for="(c,index) in record.redBalls.split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
									{{ c }}
									<span v-if="index<record.redBalls.split(',').length-1">,</span>
								</span>|
								<span v-for="(c,index) in record.blueBalls.split(',')" :style="checkWinCode(c,2) ? 'color: blue' : ''">
									{{ c }}
									<span v-if="index<record.blueBalls.split(',').length-1">,</span>
								</span>
							</span>
							<span v-else v-for="(c,index) in record.betContent.split(',')" :style="checkWinCode(c,1) ? 'color: red' : ''">
								{{ c }}
								<span v-if="index<record.betContent.split(',').length-1">,</span>
							</span>
						</view>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>

		<view class="flex align-center py-20 flex-wrap ml-20" v-if="hasOpenNumbers()">
			<view class="flex align-center pt-10 mr-10 w-full c-000 fw-700">第<text class="fw-700 c-theme mx-10">{{
				getStageNumber() }}</text>期 开奖号码：
			</view>
			<view class="flex gap-10" style="width: 100%;">
				<view class="fs-28 content-wrap" style="color: red;">{{ notNeedSort()?getOpenNumbers():sortRedBalls() }}</view>
				{{hasBlueBall()?"|":""}}
				<view v-if="hasBlueBall()" class="fs-28" style="color: blue; width: 10%;">{{hasBlueBall()?sortBlueBalls():""}}</view>
			</view>
		</view>

		<!-- 福彩特有状态信息 -->
		<view class="fc-status mt-20 py-10" v-if="lotteryOrder.state == 7">
			<view class="fs-28 fw-700 c-theme">待出票 - 请上传票据并确认出票</view>
		</view>
	</uni-card>
</template>

<script>
export default {
	name: 'welfare-card',
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
		getPlayTypeStr(item){
			console.log("getPlayTypeStr",item)
			let playTypeCodeStr = "";
			if(item.playTypeCode == 10101){
				playTypeCodeStr =  "单选位选";
			}else if(item.playTypeCode == 10102){
				playTypeCodeStr =  "单选复式";
				if(item.mode==2){
					playTypeCodeStr =  "单选胆拖";
				}
			}else if(item.playTypeCode == 10103){
				playTypeCodeStr =  "单选和值";
			}else if(item.playTypeCode == 10201){
				playTypeCodeStr =  "组三";
				if(item.mode==1){
					playTypeCodeStr =  "组三复式";
				}else if(item.mode==2){
					playTypeCodeStr =  "组三胆拖";
				}
			}else if(item.playTypeCode == 10202){
				playTypeCodeStr =  "组三单式";
			}else if(item.playTypeCode == 10301){
				playTypeCodeStr =  "组六";
				if(item.mode==1){
					playTypeCodeStr =  "组六复式";
				}else if(item.mode==2){
					playTypeCodeStr =  "组六胆拖";
				}
			}else if(item.playTypeCode == 10401){
				playTypeCodeStr =  "组选和值";
			}else{
				playTypeCodeStr =  item.playTypeCodeStr + this.checkDanTuo(item);
			}
			return playTypeCodeStr;
		},
		//是否有顺序不需要排序
		notNeedSort(){
			let welfareInfo = this.lotteryOrder.welfareInfoList[0];
			if(welfareInfo.playTypeCode==21 || welfareInfo.playTypeCode==10101){
				//3d直选不需要排序
				return true;
			}
			return false;
		},
		//是否有开奖信息
		hasOpenNumbers(){
			return this.lotteryOrder.welfareInfoList[0].welfareLotteryResult && this.lotteryOrder.welfareInfoList[0].welfareLotteryResult.numberOrder;
		},
		getStageNumber(){
			return this.lotteryOrder.welfareInfoList[0].stageNumber;
		},
		getOpenNumbers(){
			if(!this.lotteryOrder.welfareInfoList[0].welfareLotteryResult){
				return "";
			}
			return this.lotteryOrder.welfareInfoList[0].welfareLotteryResult.numberOrder;
		},
		sortRedBalls(){
			if(!this.lotteryOrder.welfareInfoList[0].welfareLotteryResult){
				return "";
			}
			let redBalls = this.lotteryOrder.welfareInfoList[0].welfareLotteryResult.numberOrder;
			if(redBalls){
				let arr = redBalls.split(',');
				arr = arr.map(Number);
				arr.sort((a,b) => a-b);
				return arr.join(',');
			}
			return '';
		},
		isInBalls(balls,ball){
			if(balls){
				let arr = balls.split(',');
				arr = arr.map(Number);
				if(arr.indexOf(Number(ball))>=0){
					return true;
				}
			}
			return false;
		},
		sortBlueBalls(){
			if(!this.lotteryOrder.welfareInfoList[0].welfareLotteryResult){
				return "";
			}
			let blueBalls = this.lotteryOrder.welfareInfoList[0].welfareLotteryResult.blueBalls;
			if(blueBalls){
				let arr = blueBalls.split(',');
				arr = arr.map(Number);
				arr.sort((a,b) => a-b);
				return arr.join(',');
			}
			return '';
		},
		hasBlueBall(){
			return this.lotteryOrder.welfareInfoList && this.lotteryOrder.welfareInfoList[0].welfareLotteryResult && this.lotteryOrder.welfareInfoList[0].welfareLotteryResult.blueBalls;
		},
		checkDanTuo(record){
			if(this.lotteryOrder.type==11 && record.betContent?.replace(/#/g, ',').split(',').length === 80){
				return '全托';
			}
			if (this.lotteryOrder.type==10 && record.mode==0) {
				return ""
			}
			return record.modeStr;
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
		checkWinCode(code,type,playTypeCode) {
			if(!this.hasOpenNumbers()){
				return false;
			}
			let redBalls = this.sortRedBalls();
			let blueBalls = this.sortBlueBalls();
			if(playTypeCode == 21){
				//3d直选 特殊处理
				let openNumbers = this.getOpenNumbers();
				console.log("checkWinCode",code,type,openNumbers)
				let openArr = openNumbers.split(",");
				openArr = openArr.map(Number);
				if(openArr[type] == code){
					return true;
				}else{
					return false;
				}
			}else{
				console.log("checkWinCode",code,type,redBalls,blueBalls)
				//其他情况
				if(type==1){
					return this.isInBalls(redBalls,code);
					// return redBalls?.split(',').includes(code);
				}else if(type ==2){
					return this.isInBalls(blueBalls,code);
					// return blueBalls?.split(',').includes(code);
				}
			}
			return false;
		}
	}
}
</script>

<style scoped lang="scss">
.auto-wrap {
	display: inline-block;
	word-break: break-all;
	white-space: normal;
	max-width: 100%; /* 可选，防止超出父容器 */
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

.td-center {
	font-size: 12px;
	padding: 8px 6px;
	vertical-align: middle;
	line-height: 1.3;
	white-space: nowrap;
}

.reward-numbers {
	font-size: 28rpx;
	font-weight: bold;
	color: var(--themeColor);
	padding: 10rpx 0;
	word-break: break-all;
}

/* 整体表格样式优化 */
::v-deep .welfare-table {
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

.fc-status {
	background-color: #f8f9fa;
	border-radius: 6px;
	text-align: center;
}

.smaller-text {
	font-size: 11px;
	color: #666;
}

.content-wrap {
	word-break: keep-all;
	word-wrap: break-word;
	white-space: normal;
	max-width: 90%;
	display: inline-block;
	text-align: left;
}
</style>