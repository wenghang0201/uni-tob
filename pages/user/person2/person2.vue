<template>
	<view class="snipcss-2jlKf">
	    <view  class="">
	        <view   class="">
	            <view  class="u-navbar u-navbar-fixed style-Q6QMt" id="style-Q6QMt">
	                <view  class="u-status-bar style-By75E" id="style-By75E"></view>
	                <view  class="u-navbar-inner style-Umtzo" id="style-Umtzo">
	                    <view  class="u-slot-content">
	                        <view  class="slot-wrap">
	                            <view   class="u-tabs u-m-b-55 style-DIh27" id="style-DIh27">
	                                <view  id="u2AWFXmINzUsFuEV5juJapCqrH8tl2pW">
	                                    <scroll-view  class="u-scroll-view">
	                                        <view class="scroll-view">
	                                            <view class="scroll-view style-mqvd7" id="style-mqvd7">
	                                                <!-- <view class="scroll-view-content"> -->
	                                                    <!-- <view  class="u-scroll-box u-tabs-scorll-flex"> -->
	                             <!--                           <view  id="u-tab-item-0" class="u-tab-item u-line-1" style="height: 41px; line-height: 41px; font-size: 18px; transition-duration: 0.5s; flex: 1 1 0%; width: auto; font-weight: bold; color: rgb(255, 255, 255);">用户</view>
	                                                        <view  id="u-tab-item-1" class="u-tab-item u-line-1 style-gznbi">充值</view>
	                                                        <view  id="u-tab-item-2" class="u-tab-item u-line-1 style-MAZYb">转账</view>
	                                                        <view  id="u-tab-item-3" class="u-tab-item u-line-1 style-wWO9X">提现</view> -->

															<u-sticky class="u-tab-item u-line-1">
																<u-tabs :list="lassificationcList" lineColor="#fff" :scrollable="false"
																	:activeStyle="{color: '#fff',fontSize:'20px',fontWeight: 'bold',transform: 'scale(1.05)','height': '41px','line-height': '41px'}"
																	@click="changeSelectBall"
																	:style="{
																		'height': '41px',
																		'line-height': '41px',
																		'font-size': '18px',
																		'width': 'auto',
																		'color': '#fff'
																	}"
																	:inactiveStyle="{color: '#fff',fontSize:'20px','height': '41px','line-height': '41px'}"
																	>
																</u-tabs>
															</u-sticky>
															<!-- <view  class="u-tab-bar style-X3LyA" id="style-X3LyA"></view> -->
	                                                    <!-- </view> -->
	                                                <!-- </view> -->
	                                            </view>
	                                        </view>
	                                    </scroll-view>
	                                </view>
	                            </view>
	                            <view  class="u-br-10 u-flex u-font-24 u-m-h-20 u-m-b-40 u-p-h-20 search_content">
	                                <view   class="u-input u-flex-8 style-TsNfw" id="style-TsNfw">


										<input placeholder="请输入用户手机号查询"  id="style-5knxO" v-model="queryParam.phone" />
	                                    <view  class="u-input__right-icon u-flex"></view>
	                                </view>
									<button class="u-btn u-line-1 u-fix-ios-appearance btn_custom-style u-m-l-10 u-font-32 u-flex-1 u-size-default u-btn--error style-homIM"
									style="
									    line-height: 31px;
									    color: white;
									    background-color: red;
									"
									id="style-homIM" @click="init()">查询</button>
	                                <!-- <button    app-parameter="" send-message-title="" send-message-path="sendMessagePath" lang="en" data-name="" session-from="" send-message-img="" id="style-homIM">查询</button> -->
	                            </view>
	                        </view>
	                    </view>
	                    <view  class="u-slot-right"></view>
	                </view>
	            </view>
	            <view  class="u-navbar-placeholder style-Noo2Z" id="style-Noo2Z"></view>
	        </view>

	        <view  class="recharge_search u-font-28 u-p-h-24 u-p-v-22 u-br-top-20 u-column-between style-HOkrO" id="style-HOkrO" v-if="stating == 1 || stating == 2">
	            <view >
	                <view  class="u-flex">筛选<text  class="u-p-h-12"><span>{{ queryParam.startTime != "" ? dateFom2(queryParam.startTime): "--"  }}</span></text>至<text  class="u-p-h-12"><span>{{ queryParam.endTime != "" ? dateFom2(queryParam.endTime): "--"  }}</span></text>
	                    <view  @click="show = true">全部类型<view   class="u-icon u-icon--right">
	                            <text  hover-class="" class="u-icon__icon uicon-arrow-down-fill u-iconfont style-B7951" id="style-B7951"><span></span></text>
	                        </view>
	                    </view>
	                </view>
	            </view>
	            <view  class="u-flex u-row-between">
	                <view >{{ stating == 1 ? "充值":"提现" }}：<text  class="u-m-r-24 c-theme"><span>{{ orderCount }}笔</span></text>共：<text  class="c-theme"><span>{{ total }}元</span></text>
	                </view>
	            </view>
	        </view>

			 <view class="list_content" v-if="stating == '0'">
			    <view class="mescroll-body mescroll-render-touch style-Yobop" >
					<view class="LBTL-noMag">
						<u-empty icon="/static/no-order.png" :show="userList.length<=0"
							mode="order" text="没有相关记录"></u-empty>
					</view>
			      <view class="mescroll-body-content mescroll-wxs-content" style="">

			        <!-- 使用 v-for 循环渲染用户列表 -->
			        <view v-for="(user, index) in userList" :key="index" class="list_items u-p-22 u-flex bg-f style-item" @click="detail(user.id)">

					  <image v-if="user.avatar" class="u-avatar" :src="user.avatar"></image>

					  <image v-else src="/static/images/user/logo.png"
					  	mode="scaleToFill"></image>


			          <view class="u-column-between u-flex-1 u-p-l-20">
			            <text class="u-font-32 c-333">{{ user.storeRemark || user.nickname }}<span v-if="user.moni == 1" style="color:red;margin-left: 10px;">模拟</span></text>
			            <text class="u-font-28 c-666">{{ user.phone }}<text class="u-m-l-40">余额：{{ user.price +	 user.gold}}元</text></text>
			          </view>
			          <view class="u-icon u-icon--right">
			            <!-- 右侧图标 -->
			            >
			          </view>
			        </view>
			        <!-- 其他代码 -->
			      </view>
			    </view>
			  </view>


			<view class="list_content" v-else>
			   <view class="mescroll-body mescroll-render-touch style-Yobop">
				<view class="LBTL-noMag">
					<u-empty icon="/static/no-order.png" :show="lotteryOrderList.length<=0"
						mode="order" text="没有相关记录"></u-empty>
				</view>
			     <view class="mescroll-body-content mescroll-wxs-content">

			       <!-- 使用 v-for 循环渲染用户列表 -->
			       <view v-for="(user, index) in lotteryOrderList" :key="index" class="list_items u-p-22 u-flex bg-f style-item">

					<!-- <image class="u-avatar2" src="/static/images/user/logo.png"></image> -->
				  <image v-if="user.avatar" class="u-avatar2" :src="user.avatar"></image>

			         <view class="u-column-between u-flex-1 u-p-l-20">
			           <text class="u-font-32 c-333">{{ user.storeRemark || user.nickname }}</text>
			           <text class="u-font-28 c-999">{{ user.phone }}</text>
					   <view class="u-font-28 c-999">
						   充值：{{ user.price }}元
						   <text style="color: red;">({{ flierType(user.type) }})</text>
					   </view>
					   <view class="u-font-28 c-999">{{ dateFom(user.createTime) }}</view>
			         </view>

			       </view>
			       <!-- 其他代码 -->
			     </view>
			   </view>
			 </view>

			<u-popup :show="show" mode="center" :round="10" @close="close" @open="open" :closeable="true"
			:customStyle="{width: '351px'}"
			>
			    <view class="bg-f u-p-30">
			        <view class="u-font-32 u-m-t-38 u-m-b-20 font-w-700" v-if="stating == 1">类型</view>
			        <view class="type_content u-flex u-flex-wrap u-row-between" >
			   <!--         <view class="type_items c-666 ">线下微信收款</view>
			            <view class="type_items c-666 ">线下支付宝收款</view>
			            <view class="type_items c-666 ">线下银行卡收款</view> -->
					<!-- 	<radio-group >
							<radio value="1">微信</radio>
							<radio value="2">支付宝</radio>
							<radio value="0">手动加款</radio>
						</radio-group> -->
						<!-- <view class="type_items c-666 ">微信</view> -->
						<radio-group @change="changes" v-model="queryParam.type" v-if="stating == 1">
							<radio class="type_items c-666" value="99">线上充值</radio>
							<radio class="type_items c-666" value="0">手动充值</radio>
						</radio-group>



			     <!--       <view class="type_items c-666 ">支付宝(CT)</view>
			            <view class="type_items c-666 ">支付宝(XJ)</view> -->

			        </view>
			        <view class="u-font-32 u-m-t-16 u-m-b-20 font-w-700">状态</view>
			        <view class="type_content u-flex u-flex-wrap u-row-between">


						<radio-group @change="changes2">

							<radio class="type_items c-666 " value="0">待处理</radio>
							<radio class="type_items c-666 " value="1">已处理</radio>
							<!-- <radio class="type_items c-666 "></radio> -->
						</radio-group>
			        </view>
			        <view class="u-font-32 u-m-b-20 font-w-700">时间</view>
					<view  style="margin-top: 30upx;">
						<uni-datetime-picker type="daterange" @change="change3" />
					</view>
			        <view class="u-flex u-row-right u-font-32 u-p-t-50">
			            <view class="u-br-10 c-666 bg-f u-p-v-8 u-p-h-46 u-m-r-38 style-c3PSR" id="style-c3PSR">清空</view>
			            <view class="u-br-10 bg-theme c-f u-p-v-10 u-p-h-48" @click="init()">确定</view>
			        </view>
			    </view>
			</u-popup>

	    </view>
	</view>

</template>

<script>
	import {
		getUserList
	} from '@/api/user.js'
	import {
		getPayOrderList,
	} from '@/api/lotteryOrder.js'
	export default {
		data() {
			return {
				userList: [],
				lotteryOrderList: [],
				queryParam: {
					nickname: "",
					phone:undefined,
					userId: 0,
					pageNo: 1,
					pageSize: 10,

					type: "0",
					payType: "8",
					startTime: "",
					endTime: "",
					tenantId:"",
					state: "1"

				},
				lassificationcList: [{
					name: '用户',
					state: "0"
				}, {
					name: '充值',
					state: "1"
				}, {
					name: '提现',
					state: "2"
				}


				// {
				// 	name: '转账',
				// 	state: "2"
				// },
				],

				stating: "0",
				show: false,
				total: 0,
				orderCount: 0
			}
		},
		onLoad(e) {
			this.init()
		},
		onPullDownRefresh() {


			this.userList = []
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		onReachBottom() {

			if (this.userList.length < this.queryParam.pageNo * 10) {
				return;
			}
			this.queryParam.pageNo++;
			this.init();
		},
		methods: {
			detail(id) {
				uni.navigateTo({
					url: "/pages/user/info?uid=" + id
				});
			},
			flierType(orderType){
				switch (orderType) {
				        case 0:
				            return '手动充值';
				        case 5:
				            return '手动扣款';
				        case 14:
				            return '发单返佣金';
				        case 30:
				            return '销售返佣金';
				        case 98:
				            return '用户提现';
				        case 99:
				            return '用户充值';
				        default:
				            return '未知订单类型';
				    }
			},
			dateFom(dateString){

				const dateObj = new Date(dateString);

				const year = dateObj.getFullYear();
				const month = String(dateObj.getMonth() + 1).padStart(2, '0');
				const day = String(dateObj.getDate()).padStart(2, '0');
				const hours = String(dateObj.getHours()).padStart(2, '0');
				const minutes = String(dateObj.getMinutes()).padStart(2, '0');
				const seconds = String(dateObj.getSeconds()).padStart(2, '0');

				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			dateFom2(dateString){

				const dateObj = new Date(dateString);

				const year = dateObj.getFullYear();
				const month = String(dateObj.getMonth() + 1).padStart(2, '0');
				const day = String(dateObj.getDate()).padStart(2, '0');


				return `${year}-${month}-${day}`;
			},
			open() {

			},
			close() {
			    this.show = false
			},
			changes(event){
				this.queryParam.type = event.detail.value;
				// this.queryParam.payType = event.detail.value;
			},
			changes2(event){
				this.queryParam.state = event.detail.value;
			},
			change3(option){
				if(option[0] != null && option[1] != null){
					this.queryParam.startTime = option[0]+" 00:00:00";
					this.queryParam.endTime = option[1]+" 23:59:59";
				}
			},
			init() {
				this.show = false;
				if(this.stating == 1){
					this.getPayOrder();
				}else if(this.stating == 2){

					this.getPayOrder();
				}else{
					this.getUserLists();
				}
			},

			getUserLists(){
				uni.showLoading();
				getUserList(this.queryParam).then(res => {
					if (res.success) {

						this.userList = [...this.userList, ...res.voList]
						uni.hideLoading();
					}
				});
			},
			changeSelectBall(item) {
				this.queryParam.pageNo = 1;
				this.lotteryOrderList = []
				// console.log(item.state)
				this.total = 0;
				this.orderCount = 0;
				this.queryParam.type = item.state == 1 ? "88": "89";

				this.queryParam.state = item.state
				this.stating = item.state
				this.init();
			},
			getPayOrder(){
				uni.showLoading();
				let tha = this;
				let that = this;
				getPayOrderList(tha.queryParam).then(res => {

					// tha.lotteryOrderList = res.voList;
					// if(res.voList != null ) {
					// 	tha.lotteryOrderList = [...tha.lotteryOrderList, ...res.voList]
					// }else{
					// 	tha.lotteryOrderList =[];
					// }

					 if (res.voList != null) {
					    // 检查已有数据列表中是否已包含要加载的数据
					    const newData = res.voList.filter(item => !that.lotteryOrderList.some(existingItem => existingItem.id === item.id));
					    // 将新数据追加到已有数据列表中
					    that.lotteryOrderList = [...that.lotteryOrderList, ...newData];
					}else{
						tha.lotteryOrderList =[];
					}

					tha.total = 0;
					tha.orderCount = 0;
					tha.lotteryOrderList.map(item => {
						tha.total += item.price
						tha.orderCount++;
					})
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style>
	.c-999{
		color: #999;
	}
	.u-p-30 {
	    padding: 15px 15px 15px 15px!important;
	}

	.bg-f {
	    background-color: #fff;
	}

	:-webkit-scrollbar {
	    display: none;
	    width: 0!important;
	    height: 0!important;
	    -webkit-appearance: none;
	    background: transparent;
	}

	.u-font-32 {
	    font-size: 16px!important;
	}

	.u-m-b-20 {
	    margin-bottom: 10px!important;
	}

	.u-m-t-38 {
	    margin-top: 19px!important;
	}

	.font-w-700 {
	    font-weight: 700;
	}

	.u-flex {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}

	.u-flex-wrap {
	    flex-wrap: wrap;
	}

	.u-row-between {
	    justify-content: space-between;
	}

	.type_content:after {
	    content: "";
	    width: 94px;
	}

	.u-m-t-16 {
	    margin-top: 8px!important;
	}

	.u-m-b-40 {
	    margin-bottom: 20px!important;
	}

	.u-row-right {
	    justify-content: flex-end;
	}

	.u-p-t-50 {
	    padding-top: 25px!important;
	}

	.u-font-24 {
	    font-size: 12px!important;
	}

	.u-m-b-24 {
	    margin-bottom: 12px!important;
	}

	.c-666 {
	    color: #666;

	}

	.type_items {
	    width: 94px;
	    /* height: 26px; */
	    border: 1px solid #ccc;
	    background: #fff;
	    line-height: 26px;
	    border-radius: 5px;
	    text-align: center;
	    overflow: hidden;
		margin: 6px;
		font-size: 25rpx;
		/* padding: 1px; */

	}

	.u-p-h-30 {
	    padding-left: 15px!important;
	    padding-right: 15px!important;
	}

	.u-br-16 {
	    border-radius: 8px;
	}

	.bg-ea {
	    background-color: #eaeaea;
	}

	.u-input[data-v-61a2d4d3] {
	    position: relative;
	    flex: 1;
	    display: flex;
	    flex-direction: row;
	}

	.u-m-l-50 {
	    margin-left: 25px!important;
	}

	.u-p-v-8 {
	    padding-top: 4px!important;
	    padding-bottom: 4px!important;
	}

	.u-m-r-38 {
	    margin-right: 19px!important;
	}

	.u-p-h-46 {
	    padding-left: 23px!important;
	    padding-right: 23px!important;
	}

	.u-br-10 {
	    border-radius: 5px;
	}

	.u-p-v-10 {
	    padding-top: 5px!important;
	    padding-bottom: 5px!important;
	}

	.u-p-h-48 {
	    padding-left: 24px!important;
	    padding-right: 24px!important;
	}

	.c-f {
	    color: #fff;
	}

	.bg-theme {
	    background-color: #e60012!important;
	}



	/* These were inline style tags. Uses id+class to override almost everything */
	#style-XJ4pv.style-XJ4pv {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: left;
	}
	#style-Gg8zD.style-Gg8zD {
	   min-height: 35px;
	    pointer-events: none;
	}
	#style-WSTzK.style-WSTzK {
	   color: rgb(153, 153, 153);
	}
	#style-W3qXc.style-W3qXc {
	   font-size: 13px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(192, 196, 204);
	}
	#style-Q2bme.style-Q2bme {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: left;
	}
	#style-wMKxC.style-wMKxC {
	   min-height: 35px;
	    pointer-events: none;
	}
	#style-QHj6w.style-QHj6w {
	   color: rgb(153, 153, 153);
	}
	#style-2qHqo.style-2qHqo {
	   font-size: 13px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(192, 196, 204);
	}
	#style-LdaHi.style-LdaHi {
	   border: 1px solid rgb(204, 204, 204);
	}
	/* These were inline style tags. Uses id+class to override almost everything */
	#style-My1VK.style-My1VK {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: left;
	}
	#style-zcXiG.style-zcXiG {
	   min-height: 35px;
	    pointer-events: none;
	}
	#style-7DZL5.style-7DZL5 {
	   color: rgb(153, 153, 153);
	}
	#style-HT2XN.style-HT2XN {
	   font-size: 13px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(192, 196, 204);
	}
	#style-ZmvZr.style-ZmvZr {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: left;
	}
	#style-GhLzt.style-GhLzt {
	   min-height: 35px;
	    pointer-events: none;
	}
	#style-BPT9W.style-BPT9W {
	   color: rgb(153, 153, 153);
	}
	#style-WVq6o.style-WVq6o {
	   font-size: 13px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(192, 196, 204);
	}
	#style-c3PSR.style-c3PSR {
	   border: 1px solid rgb(204, 204, 204);
	}

	:-webkit-scrollbar {
	    display: none;
	    width: 0!important;
	    height: 0!important;
	    -webkit-appearance: none;
	    background: transparent;
	}


	.u-column-between {
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	}

	.u-font-28 {
	    font-size: 14px!important;
	}

	.u-p-v-22 {
	    padding-top: 11px!important;
	    padding-bottom: 11px!important;
	}

	.u-p-h-24 {
	    padding-left: 12px!important;
	    padding-right: 12px!important;
	}

	.u-br-top-20 {
	    border-radius: 10px 10px 0 0;
	}

	.recharge_search {
	    /* position: fixed; */
	    width: 100vh;
	    z-index: 991;
	    background: #fff;
	    border-bottom: 0.5px solid #eaeaea;
	}

	.u-navbar {
	    width: 100%;
	}

	.u-navbar-fixed {
	    position: fixed;
	    left: 0;
	    right: 0;
	    top: 0;
	    z-index: 991;
	}

	.u-flex {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}

	.u-row-between {
	    justify-content: space-between;
	}

	.mescroll-body {
	    position: relative;
	    height: auto;
	    overflow: hidden;
	    box-sizing: border-box /* 避免设置padding出现双滚动条的问题 */;
	}

	.u-status-bar {
	    width: 100%;
	}

	.u-navbar-inner {
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	    position: relative;
	    align-items: center;
	}


	.mescroll-totop {
	    z-index: 9990;
	    position: fixed!important;
	    right: 10px;
	    bottom: 62px;
	    width: 37px;
	    height: auto;
	    border-radius: 50%;
	    opacity: 0;
	    transition: opacity .5s;
	    margin-bottom: var(--window-bottom) /* css变量 */;
	}

	.mescroll-totop-out {
	    opacity: 0;
	    pointer-events: none;
	}

	.u-slot-content {
	    flex: 1;
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}



	.u-p-h-12 {
	    padding-left: 6px!important;
	    padding-right: 6px!important;
	}

	.u-m-r-24 {
	    margin-right: 12px!important;
	}

	.c-theme {
	    color: #e60012;
	}

	.mescroll-downwarp {
	    position: absolute;
	    top: -100%;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    text-align: center;
	}

	.u-p-22 {
	    padding: 11px!important;
	}

	.bg-f {
	    background-color: #fff;
	}

	.list_content .list_items  {
	    border-bottom: 0.5px solid #eaeaea;
	}

	.mescroll-upwarp {
	    box-sizing: border-box;
	    min-height: 57px;
	    padding: 15px 0;
	    text-align: center;
	    clear: both;
	}



	.slot-wrap {
	    flex: 1;
	}


	.u-icon--right {
	    flex-direction: row;
	    align-items: center;
	}

	.mescroll-downwarp .downwarp-content  {
	    position: absolute;
	    left: 0;
	    bottom: 0;
	    width: 100%;
	    min-height: 31px;
	    padding: 10px 0;
	    text-align: center;
	}

	.u-avatar {
	    display: inline-flex;
	    align-items: center;
	    justify-content: center;
	    font-size: 14px;
	    color: #606266;
	    border-radius: 10px;
	    position: relative;
		width: 88rpx;
		height: 88rpx;
	}
	.u-avatar2 {
	    display: inline-flex;
	    align-items: center;
	    justify-content: center;
	    font-size: 14px;
	    color: #606266;
	    border-radius: 10px;
	    position: relative;
		height: 10vh;
		width: 25%;
	}

	.u-flex-1 {
	    flex: 1!important;
	}

	.u-p-l-20 {
	    padding-left: 10px!important;
	}

	uni-resize-sensor > div  {
	    position: absolute;
	    left: 0;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    overflow: hidden;
	}

	.u-m-b-55 {
	    margin-bottom: 28px!important;
	}

	uni-view {
	    box-sizing: border-box;
	}

	:-webkit-scrollbar {
	    display: none;
	    width: 0!important;
	    height: 0!important;
	    -webkit-appearance: none;
	    background: transparent;
	}

	.u-font-24 {
	    font-size: 12px!important;
	}

	.u-m-h-20 {
	    margin-left: 10px!important;
	    margin-right: 10px!important;
	}

	.u-p-h-20 {
	    padding-left: 10px!important;
	    padding-right: 10px!important;
	}

	.u-m-b-40 {
	    margin-bottom: 20px!important;
	}

	.u-br-10 {
	    border-radius: 5px;
	}

	.slot-wrap .search_content  {
	    height: 35px;
	    background: hsla(0,0%,100%,.6);
	}

	.u-iconfont {
	    position: relative;
	    display: flex;
	    font: normal normal normal 14px/1 uicon-iconfont;
	    font-size: inherit;
	    text-rendering: auto;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	}

	.u-icon__icon {
	    position: relative;
	}

	.u-iconfont:before {
	    display: flex;
	    align-items: center;
	}

	.uicon-arrow-down-fill:before {
	    content: "\e600";
	}

	.mescroll-downwarp .downwarp-progress  {
	    display: inline-block;
	    width: 16px;
	    height: 16px;
	    border-radius: 50%;
	    border: 1px solid grey;
	    border-bottom-color: transparent!important;
	    vertical-align: middle;
	}

	.mescroll-downwarp .downwarp-tip  {
	    display: inline-block;
	    font-size: 14px;
	    vertical-align: middle;
	    margin-left: 8px	/* color: gray; 已在style设置color,此处删去*/;
	}


	.u-font-32 {
	    font-size: 16px!important;
	}

	.c-333 {
	    color: #333;
	}

	.c-666 {
	    color: #666;
	}

	.uicon-arrow-right:before {
	    content: "\e605";
	}

	.mescroll-upwarp .upwarp-progress  {
	    display: inline-block;
	    width: 16px;
	    height: 16px;
	    border-radius: 50%;
	    border: 1px solid grey;
	    border-bottom-color: transparent!important;
	    vertical-align: middle;
	}

	.mescroll-upwarp .mescroll-rotate  {
	    -webkit-animation: mescrollUpRotate-data-v-0bfd0ead .6s linear infinite;
	    animation: mescrollUpRotate-data-v-0bfd0ead .6s linear infinite;
	}

	.mescroll-upwarp .upwarp-tip  {
	    display: inline-block;
	    font-size: 14px;
	    vertical-align: middle	/* color: gray; 已在style设置color,此处删去*/;
	}

	.mescroll-upwarp .upwarp-tip  {
	    margin-left: 8px;
	}

	uni-resize-sensor > div > div  {
	    position: absolute;
	    left: 0;
	    top: 0;
	}

	uni-resize-sensor > div:first-child > div  {
	    width: 100000px;
	    height: 100000px;
	}

	uni-resize-sensor > div:last-child > div  {
	    width: 200%;
	    height: 200%;
	}

	.u-flex-8 {
	    flex: 8!important;
	}

	.u-input {
	    /* position: relative;
	    flex: 1;
	    display: flex;
	    flex-direction: row; */
	}

	uni-button {
	    position: relative;
	    display: block;
	    margin-left: auto;
	    margin-right: auto;
	    padding-left: 14px;
	    padding-right: 14px;
	    box-sizing: border-box;
	    font-size: 18px;
	    text-align: center;
	    text-decoration: none;
	    line-height: 2.55555556;
	    border-radius: 5px;
	    -webkit-tap-highlight-color: transparent;
	    overflow: hidden;
	    color: #000;
	    background-color: #f8f8f8;
	    cursor: pointer;
	}

	uni-button {
	    margin: 0;
	}

	.u-m-l-10 {
	    margin-left: 5px!important;
	}

	.u-fix-ios-appearance {
	    -webkit-appearance: none;
	}

	.u-line-1 {
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}



	.slot-wrap .btn_custom-style  {
	    height: 31px;
	}




	.u-scroll-view {
	    width: 100%;
	    white-space: nowrap;
	    position: relative;
	}



	.u-input__input {
	    font-size: 14px;
	    color: #303133;
	    flex: 1;
	}

	.u-m-l-40 {
	    margin-left: 20px!important;
	}

	.uni-scroll-view {
	    position: relative;
	    -webkit-overflow-scrolling: touch;
	    max-height: inherit;
	}

	.uni-scroll-view {
	    width: 100%;
	    height: 100%;
	}

	.uni-input-wrapper {
	    outline: none;
	    border: none;
	    padding: 0;
	    margin: 0;
	    text-decoration: inherit;
	}

	.uni-input-wrapper {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	    position: relative;
	    width: 100%;
	    height: 100%;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -webkit-flex-direction: column;
	    flex-direction: column;
	    -webkit-box-pack: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	}

	.uni-input-placeholder {
	    outline: none;
	    border: none;
	    padding: 0;
	    margin: 0;
	    text-decoration: inherit;
	}

	.uni-input-placeholder {
	    width: 100%;
	}

	.uni-input-placeholder {
	    position: absolute;
	    top: auto!important;
	    left: 0;
	    color: grey;
	    overflow: hidden;
	    text-overflow: clip;
	    white-space: pre;
	    word-break: keep-all;
	    pointer-events: none;
	    line-height: inherit;
	}

	.uni-input-input {
	    outline: none;
	    border: none;
	    padding: 0;
	    margin: 0;
	    text-decoration: inherit;
	}

	.uni-input-input {
	    width: 100%;
	}

	.uni-input-input {
	    position: relative;
	    display: block;
	    height: 100%;
	    background: none;
	    color: inherit;
	    opacity: 1;
	    font: inherit;
	    line-height: inherit;
	    letter-spacing: inherit;
	    text-align: inherit;
	    text-indent: inherit;
	    text-transform: inherit;
	    text-shadow: inherit;
	}

	.uni-scroll-view-content {
	    width: 100%;
	    height: 100%;
	}

	.u-scroll-box {
	    position: relative;
	}

	.u-tabs-scorll-flex {
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	}

	.u-tab-item {
	    position: relative;
	    display: inline-block;
	    text-align: center;
	    transition-property: background-color,color;
		color:white !important;

	}

	.u-tab-bar {
	    position: absolute;
	    bottom: 0;
	}
	.u-tabs__wrapper__nav__item__text{
		color: #e60012 !important;
	}

	@keyframes once-show {
	  0% {
	      top: 0;
	      top: 0px;
	  }

	}
	@keyframes mescrollUpRotate-data-v-0bfd0ead {
	  0% {
	      -webkit-transform: rotate(0deg);
	      transform: rotate(0deg);
	      transform: rotate(0deg);
	  }
	  100% {
	      -webkit-transform: rotate(1turn);
	      transform: rotate(1turn);
	      transform: rotate(1turn);
	  }

	}
	/* These were inline style tags. Uses id+class to override almost everything */
	#style-vpwiV.style-vpwiV {
	   z-index: 990;
	    background: linear-gradient(rgb(230, 0, 18) 0%, rgb(255, 87, 87) 100%);
	}
	#style-ZlGDv.style-ZlGDv {
	   height: 0px;
	}
	#style-ayohm.style-ayohm {
	   height: 134px;
	}
	#style-wojpS.style-wojpS {
	   background: transparent;
	}
	#style-EW6QZ.style-EW6QZ {
	   overflow: auto hidden;
	}


	#style-Itt6w.style-Itt6w {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: center;
	}
	#style-AIqoQ.style-AIqoQ {
	   min-height: 36px;
	    pointer-events: all;
	    color: rgb(255, 255, 255);
	    font-size: 16px;
	}
	#style-UxyS7.style-UxyS7 {
	   color: rgb(255, 255, 255);
	    font-size: 12px;
	}
	#style-9cDH4.style-9cDH4 {
	   overflow: visible;
	}
	#style-Li5mo.style-Li5mo {
	   width: 100%;
	    height: 134px;
	}
	#style-X236n.style-X236n {
	   height: 64px;
	    display: none;
	}
	#style-vYDLQ.style-vYDLQ {
	   height: 74px;
	    top: 124px;
	    display: none;
	}
	#style-mIbyT.style-mIbyT {
	   font-size: 9px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(230, 0, 18);
	}
	#style-U6vHE.style-U6vHE {
	   min-height: 794px;
	    padding-top: 0px;
	    padding-bottom: 0px;
	}
	#style-31aR1.style-31aR1 {
	   background: transparent;
	    color: gray;
	}
	#style-Jw4ZI.style-Jw4ZI {
	   border-color: gray;
	    transform: rotate(22.5deg);
	}
	#style-3hYXX.style-3hYXX {
	   height: 68px;
	}
	#style-1QIyp.style-1QIyp {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-v8Ond.style-v8Ond {
	   border-radius: 5px;
	}
	#style-GhjZZ.style-GhjZZ {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-bzPAk.style-bzPAk {
	   height: 45px;
	}
	#style-Okl65.style-Okl65 {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-6zyWK.style-6zyWK {
	   height: 68px;
	}
	#style-rxP8F.style-rxP8F {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-75tQi.style-75tQi {
	   border-radius: 5px;
	}
	#style-PzPnK.style-PzPnK {
	   background-image: url("/static/images/user/0tQLORnE9c0v1JhO9rUO9OG2CWEg6w3PUIURA0eu.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-2yAJY.style-2yAJY {
	   height: 45px;
	}
	#style-Q64sg.style-Q64sg {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-and2J.style-and2J {
	   height: 68px;
	}
	#style-6TXoR.style-6TXoR {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-kVZkE.style-kVZkE {
	   border-radius: 5px;
	}
	#style-9ZThM.style-9ZThM {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-o5fWv.style-o5fWv {
	   height: 45px;
	}
	#style-so96W.style-so96W {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-DSdoH.style-DSdoH {
	   height: 68px;
	}
	#style-SdY9r.style-SdY9r {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-VTLUn.style-VTLUn {
	   border-radius: 5px;
	}
	#style-F89Fe.style-F89Fe {
	   background-image: url("/static/images/user/ZmHIl7dwvbDc08KA928zB4ohR7q8aNWwjWeZztpd.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-JPBXe.style-JPBXe {
	   height: 45px;
	}
	#style-5jQpl.style-5jQpl {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-3BNRD.style-3BNRD {
	   height: 68px;
	}
	#style-sMVUF.style-sMVUF {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-aakL5.style-aakL5 {
	   border-radius: 5px;
	}
	#style-wmiXl.style-wmiXl {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-hi6xN.style-hi6xN {
	   height: 45px;
	}
	#style-S5jAs.style-S5jAs {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-EdQpF.style-EdQpF {
	   height: 68px;
	}
	#style-Cqa5J.style-Cqa5J {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-KCkNe.style-KCkNe {
	   border-radius: 5px;
	}
	#style-eaVOy.style-eaVOy {
	   background-image: url("/static/images/user/Q7VaqBCaeD3f63wFaIlbwbOsa9GLU0hehah08s0Q.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-K45wc.style-K45wc {
	   height: 45px;
	}
	#style-bHQay.style-bHQay {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-Gv5Oy.style-Gv5Oy {
	   height: 68px;
	}
	#style-4F22n.style-4F22n {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-Aq3bU.style-Aq3bU {
	   border-radius: 5px;
	}
	#style-21snU.style-21snU {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-1BlYI.style-1BlYI {
	   height: 45px;
	}
	#style-oGIzr.style-oGIzr {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-paTTs.style-paTTs {
	   height: 68px;
	}
	#style-k5k2x.style-k5k2x {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-BzYx6.style-BzYx6 {
	   border-radius: 5px;
	}
	#style-oGcjF.style-oGcjF {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Y2xNZ.style-Y2xNZ {
	   height: 45px;
	}
	#style-saahg.style-saahg {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-2qz7A.style-2qz7A {
	   height: 68px;
	}
	#style-Wozbt.style-Wozbt {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-eOiXV.style-eOiXV {
	   border-radius: 5px;
	}
	#style-aAfDw.style-aAfDw {
	   background-image: url("https://mapi.caimishop.cn/images/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-mMD8v.style-mMD8v {
	   height: 45px;
	}
	#style-STDlp.style-STDlp {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-zFIV4.style-zFIV4 {
	   height: 68px;
	}
	#style-xYS6Q.style-xYS6Q {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-YfUQA.style-YfUQA {
	   border-radius: 5px;
	}
	#style-5SGOK.style-5SGOK {
	   background-image: url("/static/images/user/MjNaiUky3R53Ytu55iYwJyx83z7d03im0laPGeBc.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-xnU83.style-xnU83 {
	   height: 45px;
	}
	#style-fyFyi.style-fyFyi {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-aD9mX.style-aD9mX {
	   height: 68px;
	}
	#style-W9oxm.style-W9oxm {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-zmFhB.style-zmFhB {
	   border-radius: 5px;
	}
	#style-rUj1X.style-rUj1X {
	   background-image: url("/static/images/user/3W6BJ5aeS08WPguUo2PmcdPTJh9la8PIEu6NnrBN.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-LWOYO.style-LWOYO {
	   height: 45px;
	}
	#style-PBj4p.style-PBj4p {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-ZvOcJ.style-ZvOcJ {
	   height: 68px;
	}
	#style-XJoBK.style-XJoBK {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-LqkLW.style-LqkLW {
	   border-radius: 5px;
	}
	#style-wOopK.style-wOopK {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-n6YyV.style-n6YyV {
	   height: 45px;
	}
	#style-oNcMV.style-oNcMV {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-yxpfi.style-yxpfi {
	   height: 68px;
	}
	#style-lEiRs.style-lEiRs {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-iUVkg.style-iUVkg {
	   border-radius: 5px;
	}
	#style-4obl9.style-4obl9 {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-fl3Lg.style-fl3Lg {
	   height: 45px;
	}
	#style-K4ii2.style-K4ii2 {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-G8pqm.style-G8pqm {
	   height: 68px;
	}
	#style-cjpW6.style-cjpW6 {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-QqmAm.style-QqmAm {
	   border-radius: 5px;
	}
	#style-q61gC.style-q61gC {
	   background-image: url("/static/images/user/DTvHi5bwrio28r0idmHd4eWkWu43go9hi6jTJuid.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-pAsz2.style-pAsz2 {
	   height: 45px;
	}
	#style-4r4aG.style-4r4aG {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-Mx5Za.style-Mx5Za {
	   height: 68px;
	}
	#style-19ZWG.style-19ZWG {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-drAWb.style-drAWb {
	   border-radius: 5px;
	}
	#style-25hHc.style-25hHc {
	   background-image: url("https://mapi.caimishop.cn/images/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-wj78z.style-wj78z {
	   height: 45px;
	}
	#style-yPaci.style-yPaci {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-qpUdL.style-qpUdL {
	   height: 68px;
	}
	#style-ZECoC.style-ZECoC {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-8J6WB.style-8J6WB {
	   border-radius: 5px;
	}
	#style-lhL9A.style-lhL9A {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Av9kx.style-Av9kx {
	   height: 45px;
	}
	#style-HlfYP.style-HlfYP {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-kesod.style-kesod {
	   height: 68px;
	}
	#style-GbYDw.style-GbYDw {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-DoNq6.style-DoNq6 {
	   border-radius: 5px;
	}
	#style-KJz6B.style-KJz6B {
	   background-image: url("/static/images/user/crZ2QYx5eVF56fNIrSo6rpuujE1VtSNGys7AQLEP.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-l9mLh.style-l9mLh {
	   height: 45px;
	}
	#style-VPltM.style-VPltM {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-SEoMq.style-SEoMq {
	   height: 68px;
	}
	#style-rGemU.style-rGemU {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-X42GE.style-X42GE {
	   border-radius: 5px;
	}
	#style-4JdPX.style-4JdPX {
	   background-image: url("/static/images/user/LzJ21zB6BHUbeRLYrYPeIxgUXzZpIkr5MzPjrW5f.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-5IQ4p.style-5IQ4p {
	   height: 45px;
	}
	#style-yOFkY.style-yOFkY {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-BkjWK.style-BkjWK {
	   height: 68px;
	}
	#style-aBwKa.style-aBwKa {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-2qsTL.style-2qsTL {
	   border-radius: 5px;
	}
	#style-QhkAV.style-QhkAV {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-46Trz.style-46Trz {
	   height: 45px;
	}
	#style-8X3OK.style-8X3OK {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-RXGwS.style-RXGwS {
	   height: 68px;
	}
	#style-9MfzZ.style-9MfzZ {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-VpgSo.style-VpgSo {
	   border-radius: 5px;
	}
	#style-mVcCx.style-mVcCx {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-4QIVp.style-4QIVp {
	   height: 45px;
	}
	#style-Sm9Y8.style-Sm9Y8 {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-v5D7E.style-v5D7E {
	   background: transparent;
	    color: gray;
	}
	#style-aLPDK.style-aLPDK {
	   display: none;
	}
	#style-sJzJI.style-sJzJI {
	   border-color: gray;
	}
	#style-Ud49Y.style-Ud49Y {
	   height: 50px;
	}
	#style-mh2jM.style-mh2jM {
	   z-index: 9990;
	    left: auto;
	    right: 10px;
	    bottom: 62px;
	    width: 37px;
	    border-radius: 50%;
	    height: 38px;
	}
	#style-zI8kW.style-zI8kW {
	   /* background-image: url("/static/mescroll-totop.png");   */
	    background-size: 100% 100%;
	    background-repeat: no-repeat;
	}
	/* These were inline style tags. Uses id+class to override almost everything */
	#style-Q6QMt.style-Q6QMt {
	   z-index: 990;
	    background: linear-gradient(rgb(230, 0, 18) 0%, rgb(255, 87, 87) 100%);
	}
	#style-By75E.style-By75E {
	   height: 0px;
	}
	#style-Umtzo.style-Umtzo {
	   height: 134px;
	}
	#style-DIh27.style-DIh27 {
	   background: transparent;
	}
	#style-mqvd7.style-mqvd7 {
	   overflow: auto hidden;
	}
	#u-tab-item-1.style-gznbi {
	   height: 41px;
	    line-height: 41px;
	    font-size: 18px;
	    transition-duration: 0.5s;
	    flex: 1 1 0%;
	    width: auto;
	    color: rgb(255, 255, 255);
	}
	#u-tab-item-2.style-MAZYb {
	   height: 41px;
	    line-height: 41px;
	    font-size: 18px;
	    transition-duration: 0.5s;
	    flex: 1 1 0%;
	    width: auto;
	    color: rgb(255, 255, 255);
	}
	#u-tab-item-3.style-wWO9X {
	   height: 41px;
	    line-height: 41px;
	    font-size: 18px;
	    transition-duration: 0.5s;
	    flex: 1 1 0%;
	    width: auto;
	    color: rgb(255, 255, 255);
	}
	#style-X3LyA.style-X3LyA {
	   width: 31px;
	    transform: translate(33.25px, -100%);
	    transition-duration: 0.5s;
	    background-color: rgb(255, 255, 255);
	    height: 3px;
	    opacity: 1;
	    border-radius: 3px;
	}
	#style-TsNfw.style-TsNfw {
	   padding: 0px;
	    border-color: rgb(220, 223, 230);
	    text-align: center;
	}
	#style-TrlPA.style-TrlPA {
	   min-height: 36px;
	    pointer-events: all;
	    color: rgb(255, 255, 255);
	    font-size: 16px;
	}
	#style-5knxO {
	   color: rgb(255, 255, 255);

	    font-size: 12px;
	}
	#style-homIM.style-homIM {
	   overflow: visible;
	}
	#style-Noo2Z.style-Noo2Z {
	   width: 100%;
	    height: 134px;
	}
	#style-nDxWJ.style-nDxWJ {
	   height: 64px;
	}
	#style-HOkrO.style-HOkrO {
	   height: 74px;
	    top: 124px;
	}
	#style-B7951.style-B7951 {
	   font-size: 9px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(230, 0, 18);
	}
	.style-Yobop {
	   min-height: 794px;
	    padding-top: 0px;
	    padding-bottom: 0px;
	}
	#style-H8JdM.style-H8JdM {
	   background: transparent;
	    color: gray;
	}
	#style-1dhWO.style-1dhWO {
	   border-color: gray;
	    transform: rotate(22.5deg);
	}
	#style-ghJ3Q.style-ghJ3Q {
	   height: 68px;
	}
	#style-iz8AR.style-iz8AR {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-tbmUW.style-tbmUW {
	   border-radius: 5px;
	}
	#style-8NajB.style-8NajB {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-pX3aV.style-pX3aV {
	   height: 45px;
	}
	#style-JzeRc.style-JzeRc {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-3ExCN.style-3ExCN {
	   height: 68px;
	}
	#style-1ZtwE.style-1ZtwE {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-hAQMm.style-hAQMm {
	   border-radius: 5px;
	}
	#style-5JlrD.style-5JlrD {
	   background-image: url("/static/images/user/0tQLORnE9c0v1JhO9rUO9OG2CWEg6w3PUIURA0eu.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-494Ga.style-494Ga {
	   height: 45px;
	}
	#style-bdUSJ.style-bdUSJ {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-DHUmX.style-DHUmX {
	   height: 68px;
	}
	#style-ZeXhT.style-ZeXhT {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-aLQEv.style-aLQEv {
	   border-radius: 5px;
	}
	#style-qpTJo.style-qpTJo {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Kn7e1.style-Kn7e1 {
	   height: 45px;
	}
	#style-QfIMN.style-QfIMN {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-F3XJC.style-F3XJC {
	   height: 68px;
	}
	#style-voLdN.style-voLdN {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-bXyik.style-bXyik {
	   border-radius: 5px;
	}
	#style-Fp7lL.style-Fp7lL {
	   background-image: url("/static/images/user/ZmHIl7dwvbDc08KA928zB4ohR7q8aNWwjWeZztpd.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-ALFNI.style-ALFNI {
	   height: 45px;
	}
	#style-lZP9J.style-lZP9J {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-HgXxL.style-HgXxL {
	   height: 68px;
	}
	#style-s62cU.style-s62cU {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-6hMvn.style-6hMvn {
	   border-radius: 5px;
	}
	#style-aLnl7.style-aLnl7 {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-XY5L2.style-XY5L2 {
	   height: 45px;
	}
	#style-dOOMi.style-dOOMi {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-1r24W.style-1r24W {
	   height: 68px;
	}
	#style-4tYTI.style-4tYTI {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-Kq4YN.style-Kq4YN {
	   border-radius: 5px;
	}
	#style-ZbseN.style-ZbseN {
	   background-image: url("/static/images/user/Q7VaqBCaeD3f63wFaIlbwbOsa9GLU0hehah08s0Q.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Q1AaK.style-Q1AaK {
	   height: 45px;
	}
	#style-gJ63W.style-gJ63W {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-US9ew.style-US9ew {
	   height: 68px;
	}
	#style-l7T8M.style-l7T8M {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-nSho9.style-nSho9 {
	   border-radius: 5px;
	}
	#style-k9P79.style-k9P79 {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-bEeF6.style-bEeF6 {
	   height: 45px;
	}
	#style-42JHl.style-42JHl {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-F9jYE.style-F9jYE {
	   height: 68px;
	}
	#style-IbbhR.style-IbbhR {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-Le6H2.style-Le6H2 {
	   border-radius: 5px;
	}
	#style-AE26l.style-AE26l {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-WxW3d.style-WxW3d {
	   height: 45px;
	}
	#style-ideGE.style-ideGE {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-C3XQE.style-C3XQE {
	   height: 68px;
	}
	#style-yooX9.style-yooX9 {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-TFKPO.style-TFKPO {
	   border-radius: 5px;
	}
	#style-1w5Aq.style-1w5Aq {
	   background-image: url("https://mapi.caimishop.cn/images/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-LQxo2.style-LQxo2 {
	   height: 45px;
	}
	#style-hCOBY.style-hCOBY {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-AmViy.style-AmViy {
	   height: 68px;
	}
	#style-AIz1w.style-AIz1w {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-FFoJ8.style-FFoJ8 {
	   border-radius: 5px;
	}
	#style-J1sGV.style-J1sGV {
	   background-image: url("/static/images/user/MjNaiUky3R53Ytu55iYwJyx83z7d03im0laPGeBc.jpeg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-H56Pd.style-H56Pd {
	   height: 45px;
	}
	#style-tJPaI.style-tJPaI {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-kqwnJ.style-kqwnJ {
	   height: 68px;
	}
	#style-aW8YY.style-aW8YY {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-XbRR3.style-XbRR3 {
	   border-radius: 5px;
	}
	#style-EgzaC.style-EgzaC {
	   background-image: url("/static/images/user/3W6BJ5aeS08WPguUo2PmcdPTJh9la8PIEu6NnrBN.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-nH2D6.style-nH2D6 {
	   height: 45px;
	}
	#style-UAGZD.style-UAGZD {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-ZxI27.style-ZxI27 {
	   height: 68px;
	}
	#style-jh9hn.style-jh9hn {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-GzwOr.style-GzwOr {
	   border-radius: 5px;
	}
	#style-RbimE.style-RbimE {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-MISl3.style-MISl3 {
	   height: 45px;
	}
	#style-DDX5A.style-DDX5A {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-D1geD.style-D1geD {
	   height: 68px;
	}
	#style-6ZyqS.style-6ZyqS {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-RpTAW.style-RpTAW {
	   border-radius: 5px;
	}
	#style-1meEw.style-1meEw {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-fEFcT.style-fEFcT {
	   height: 45px;
	}
	#style-RkItm.style-RkItm {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-5Pw7I.style-5Pw7I {
	   height: 68px;
	}
	#style-82K5X.style-82K5X {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-3NCOP.style-3NCOP {
	   border-radius: 5px;
	}
	#style-BkYgU.style-BkYgU {
	   background-image: url("/static/images/user/DTvHi5bwrio28r0idmHd4eWkWu43go9hi6jTJuid.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-tX4Sf.style-tX4Sf {
	   height: 45px;
	}
	#style-hnsFe.style-hnsFe {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-5N5Kv.style-5N5Kv {
	   height: 68px;
	}
	#style-Pmviw.style-Pmviw {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-28NxM.style-28NxM {
	   border-radius: 5px;
	}
	#style-lJl9d.style-lJl9d {
	   background-image: url("https://mapi.caimishop.cn/images/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-tXYYq.style-tXYYq {
	   height: 45px;
	}
	#style-tWTst.style-tWTst {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-TnAim.style-TnAim {
	   height: 68px;
	}
	#style-gU8Ld.style-gU8Ld {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-dHhWU.style-dHhWU {
	   border-radius: 5px;
	}
	#style-gBn5j.style-gBn5j {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-BNOSr.style-BNOSr {
	   height: 45px;
	}
	#style-1StLt.style-1StLt {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-eoPb5.style-eoPb5 {
	   height: 68px;
	}
	#style-HwsYO.style-HwsYO {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-UPUKo.style-UPUKo {
	   border-radius: 5px;
	}
	#style-AHsrK.style-AHsrK {
	   background-image: url("/static/images/user/crZ2QYx5eVF56fNIrSo6rpuujE1VtSNGys7AQLEP.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-k4yiG.style-k4yiG {
	   height: 45px;
	}
	#style-rgf2z.style-rgf2z {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-hNsyw.style-hNsyw {
	   height: 68px;
	}
	#style-Lly9z.style-Lly9z {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-Z9YNX.style-Z9YNX {
	   border-radius: 5px;
	}
	#style-cNSWd.style-cNSWd {
	   background-image: url("/static/images/user/LzJ21zB6BHUbeRLYrYPeIxgUXzZpIkr5MzPjrW5f.jpg");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Db5SR.style-Db5SR {
	   height: 45px;
	}
	#style-Vkcov.style-Vkcov {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-HUfl8.style-HUfl8 {
	   height: 68px;
	}
	#style-pBtiB.style-pBtiB {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-nI2XC.style-nI2XC {
	   border-radius: 5px;
	}
	#style-omrWW.style-omrWW {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-VWTtj.style-VWTtj {
	   height: 45px;
	}
	#style-oOpZI.style-oOpZI {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-Xmtok.style-Xmtok {
	   height: 68px;
	}
	#style-gnipF.style-gnipF {
	   height: 45px;
	    width: 45px;
	    flex: 0 0 45px;
	    background-color: transparent;
	    border-radius: 5px;
	}
	#style-xj7jd.style-xj7jd {
	   border-radius: 5px;
	}
	#style-7SqUi.style-7SqUi {
	   background-image: url("/static/images/user/avatar.png");
	    background-position: center center;
	    background-size: cover;
	    background-repeat: no-repeat;
	}
	#style-Zb5oT.style-Zb5oT {
	   height: 45px;
	}
	#style-C9Xgm.style-C9Xgm {
	   font-size: 16px;
	    font-weight: normal;
	    top: 0px;
	    color: rgb(162, 162, 162);
	}
	#style-Tyh3G.style-Tyh3G {
	   background: transparent;
	    color: gray;
	}
	#style-DIAJT.style-DIAJT {
	   display: none;
	}
	#style-Fokc5.style-Fokc5 {
	   border-color: gray;
	}
	#style-otMvO.style-otMvO {
	   height: 50px;
	}
	#style-hmelI.style-hmelI {
	   z-index: 9990;
	    left: auto;
	    right: 10px;
	    bottom: 62px;
	    width: 37px;
	    border-radius: 50%;
	    height: 38px;
	}
	#style-D6Ys4.style-D6Ys4 {
	   /* background-image: url("/static/mescroll-totop.png"); */
	    background-size: 100% 100%;
	    background-repeat: no-repeat;
	}

</style>