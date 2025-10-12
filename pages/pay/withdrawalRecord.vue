<template>
	<!-- 购彩订单列表 -->
	<view class="box">

		<nav-bar :title="'提现'" :back="true"></nav-bar>
		<!-- <nav-bottom :current="9"></nav-bottom> -->

		<u-sticky bgColor="#fff" style="margin-bottom: 30px;"  >
			<u-tabs :list="lassificationcList" lineColor="var(--themeColor)" :scrollable="false"
				:activeStyle="{color: 'var(--themeColor)',fontWeight: 'bold',transform: 'scale(1.05)'}" @click="changeSelectBall">
			</u-tabs>
		</u-sticky>
		<view  style="margin-top: 30upx;">
			<uni-datetime-picker type="daterange" @change="change" :value="[queryParam.startTime, queryParam.endTime]"/>
		</view>
		<view>
			<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length<=0" mode="order"
				text="没有订单记录"></u-empty>

			<uni-card v-for="(item,index) in lotteryOrderList" :key="index" :border="false" title="提现申请"
				:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
				:sub-title="item.createTime" :extra="''+item.amount+'元'" :thumbnail="item.ballUrl"
				>
				<view>用户：<span class="uni-body">{{item.storeRemark || item.nickname}} </span>&nbsp;&nbsp;
					<!-- <span class="uni-body-moni" > {{item.name}}</span> -->
					<text class="copy-btn" @click="copyContent(item.storeRemark || item.nickname)">复制</text>
				</view>
				<view>支付宝：<span class="uni-body">{{item.zfbNumber}} </span>&nbsp;&nbsp;
					<text class="copy-btn" @click="copyContent(item.zfbNumber)">复制</text>
				</view>
				<view v-if="item.bankNumber">银联：<span class="uni-body">{{item.bankName}} </span>&nbsp;&nbsp;
					<span class="uni-body-moni" > {{item.bankNumber}}</span>
					<text class="copy-btn" @click="copyContent(item.bankNumber)">复制</text>
				</view>

				<view >订单状态：<span class="uni-body"
						:style="item.state=='3'||item.state=='4'?'color: var(--themeColor)':''">{{item.state|formatState}}</span>
				</view>
				<view v-if="item.remark">拒绝原因：
					<span class="uni-body"
						:style="'color: var(--themeColor)'">{{item.remark}}</span>
				</view>
				<view class="delOrder chupiao"   @click="sureOrder(item.id, item.storeRemark || item.nickname)" v-if="item.state == 0 " style="font-size: 11px;">确认打款</view>
				<view class="delOrder "   @click="failOrder(item.id, item.storeRemark || item.nickname)" v-if="item.state == 0 " style="font-size: 11px;">驳回</view>
			</uni-card>
		</view>

	</view>
</template>

<script>

	import {
		widthdrawalList
	} from "@/api/lotteryOrder.js"
	import {
		examine,
	} from "@/api/user.js"
	export default {
		data() {
			return {
				user:{},
				that: this,
				stating:0,
				lassificationcList: [ {
					name: '已打款',
					state: "1"
				}, {
					name: '已拒绝',
					state: "2"
				}],
				//查询条件
				queryParam: {
					userId: "",
					state: "1",
					startTime: "",
					endTime: "",
					pageNo: 1,
					pageSize: 10
				},
				total: 0,
				//订单记录列表
				lotteryOrderList: []
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
				// return data
				return that.globalUtil.dateTimeFormat(data)
			},
			//格式化状态
			formatState(data) {
				if (data == "0") {
					return "待审核";
				} else if (data == "1") {
					return "已打款";
				} else if (data == "2") {
					return "已拒绝";
				}
			}
		},
		onLoad(option) {
			if (option.uid != undefined) {
				this.queryParam.userId = option.uid;
			}
			this.init();
		},
		//滚动到底部进行分页事件
		onReachBottom() {
			if (this.lotteryOrderList.length < this.queryParam.pageNo * 10) {
				return;
			}
			this.queryParam.pageNo++;
			this.init();
		},
		methods: {
			// 复制内容到剪贴板
			copyContent(content) {
				if (!content) {
					uni.showToast({
						title: '复制内容为空',
						icon: 'none'
					});
					return;
				}

				uni.setClipboardData({
					data: content,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						});
					}
				});
			},

			failOrder(id, nickname){
				uni.showModal({
				    title: '驳回',
				    content: '您确定要驳货 : '+nickname+' 的提现吗? ',
				    success: function (res) {
				        if (res.confirm) {
				            examine({'id':id,"state":2}).then(res => {
								if(res.success){
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

			sureOrder(id, nickname){
				uni.showModal({
				    title: '打款',
				    content: '确认已打款 : '+nickname+' ? ',
				    success: function (res) {
				        if (res.confirm) {
				            examine({'id':id,"state":1}).then(res => {
								if(res.success){
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

			paijiang(id){
				var str = '确认一键派奖?';
				if(id != 0){
					str = '确认派奖该订单: '+id+'?'
				}else{
					id = "";
				}
				uni.showModal({
				    title: '派奖',
				    content: str,
				    success: function (res) {
				        if (res.confirm) {
				            paijiangOrder({'id':id}).then(res => {
								if(res.success){
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


			chupiao(id){
				var str = '确认一键出票?';
				var state = "1";
				if(id != 0){
					str = '确认出票该订单: '+id+'?'
				}else{
					id = "";
					state = "";
				}
				uni.showModal({
				    title: '出票',
				    content: str,
				    success: function (res) {
				        if (res.confirm) {
				            chupiaoOrder({'id':id,'state':state}).then(res => {
								if(res.success){
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

			change(option) {
				this.queryParam.startTime = option[0];
				this.queryParam.endTime = option[1];
				this.lotteryOrderList = []
				this.init()
			},
			// tab切换事件
			changeSelectBall(item) {
				this.queryParam.pageNo = 1;
				this.lotteryOrderList = []
				this.queryParam.state = item.state
				this.stating = item.state
				this.init();
			},
			//点击卡片查询详情
			details(id) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrderDetails?id=" + id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			//初始化事件
			init() {
				uni.showLoading();
				widthdrawalList(this.queryParam).then(res => {
					this.total = res.total;
					this.lotteryOrderList = [...this.lotteryOrderList, ...res.voList]
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	::v-deep(.uni-card__header-extra-text ){
		font-size: 14px !important;
		color: var(--themeColor) !important;
	}

	.uni-body {
		color: var(--themeColor);
	}

	.uni-body-moni {
		margin-left: 20upx;
		color: var(--themeColor);
	}

	::v-deep(.u-empty ){
		margin-top: 50% !important;
	}

	::v-deep(.uni-datetime-picker--btn,)
	::v-deep(.uni-calendar-item--after-checked,)
	::v-deep(.uni-calendar-item--before-checked ){
		background: var(--themeColor) !important;
	}

	.yj_chupiao{
		background-color: #00d600;
		color: #fff;
		padding: 4px 15px;
		border-radius: 4px;
		margin-left: 10px;
		width: 80px;
		margin-top: 10px;
	}
	.yj_paijiang{
		background-color: #5555ff;
		color: #fff;
		padding: 4px 15px;
		border-radius: 4px;
		margin-left: 10px;
		width: 80px;
		margin-top: 10px;
	}
	.delOrder{
		color:#fff;float: right;padding: 4upx 8upx;background-color: #e10000;margin-bottom: 15upx;margin-right: 15upx;
	}
	.chupiao{background-color: #00d600;}
	.paijiang{background-color: #5555ff;}
.copy-btn{
	color: #4080FF;
	font-size: 24upx;
	padding: 4upx 10upx;
	border-radius: 4upx;
	cursor: pointer;
}
.copy-btn:active{
	opacity: 0.7;
}
</style>