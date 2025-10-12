<template>
	       <view class="box" style="">
	       	<nav-bar :title="'用户详情'" :back="true"></nav-bar>
	            <view  class="u-p-v-40 u-p-h-24 u-m-v-24 u-flex bg-f style-alp51" id="style-alp51">
	                <view   class="u-avatar style-MLVBo" id="style-MLVBo">
	                    <image  class="u-avatar__img style-t2VbU" id="style-t2VbU" :src="user.avatar" />
	              
	                </view>
	                <view  class="u-column-between u-flex-1 u-p-l-20 style-VfMbA" id="style-VfMbA">
	                    <view  class="u-flex">
	                        <text  class="u-font-28 c-333"><span>{{ user.storeRemark || user.nickname }}</span></text>
	                        <!-- <text  class="u-font-24 c-theme u-m-l-20 style-3FXRi" id="style-3FXRi"><span>【备注】</span></text> -->
	                    </view>
	                   <view  class="u-font-24 c-666">
						   推广人 : {{ user.parentName }}
	                    </view>
	                    <view  class="u-flex">
	                        <text  class="u-font-24 c-666"><span>{{ user.phone }}</span></text>
	                        <!-- <text  class="u-font-24 c-theme u-m-l-20 style-i6aBG" id="style-i6aBG"><span>查看完整号码</span></text> -->
	                    </view>
	                </view>
	            </view>
	            <view  class="c-333 bg-f u-p-v-30 u-m-b-24">
	                <view  class="u-flex u-text-center">
	                    <view  class="u-flex-1">
	                        <view  class="u-font-28">彩金账户余额（元）</view>
	                        <view  class="font-w-700 style-9SQfY" id="style-9SQfY">{{ user.gold.toFixed(2) }}</view>
	                    </view>
	                    <view  class="u-flex-1">
	                        <view  class="u-font-28">奖金账户余额（元）</view>
	                        <view  class="font-w-700 style-yUooW" id="style-yUooW">{{ user.price.toFixed(2) }}</view>
	                    </view>
	                </view>
	                <view  class="u-font-32 u-flex u-row-between u-p-h-80 style-23rrb" id="style-23rrb">
	                    <view  class="u-br-10 u-p-v-18 u-p-h-68 style-TpXKG" id="style-TpXKG" @click="update(1)">扣款</view>
	                    <view  class="u-p-v-16 u-p-h-66 bg-theme u-br-10 style-sLyeg" id="style-sLyeg" @click="update(0)">加款</view>
	                </view>
	            </view>
	        
	                <view   class="u-cell-box">
	                    <view  class="u-cell-item-box u-border-bottom u-border-top">
	                        <view   class="u-cell u-border-bottom style-qNfw1" id="style-qNfw1" @click="goZhmx(user)"  v-if="user.isAgent != 1">
	                            <view  class="u-flex"></view>
	                            <view  class="u-cell_title style-9i5WF" id="style-9i5WF">资金明细</view>
	                            <view  class="u-cell__value"></view>
	                            <view   class="u-icon u-icon-wrap u-cell__right-icon-wrap u-icon--right style-zzfo1" id="style-zzfo1">
	                                >
	                            </view>
	                        </view>
	                        <view   class="u-cell u-border-bottom style-eTJVF" id="style-eTJVF" @click="goTzjl(user)"  v-if="user.isAgent == 0">
	                            <view  class="u-flex"></view>
	                            <view  class="u-cell_title style-1hnlD" id="style-1hnlD">投注记录</view>
	                            <view  class="u-cell__value"></view>
	                            <view   class="u-icon u-icon-wrap u-cell__right-icon-wrap u-icon--right style-71oiB" id="style-71oiB">
									>
								</view>
	                        </view>
	                        <view   class="u-cell u-border-bottom style-jOVwG" id="style-jOVwG">
	                            <view  class="u-flex"></view>
	                            <view  class="u-cell_title style-oBOJG" id="style-oBOJG">删除此用户？</view>
	                            <view  class="u-cell__value"></view>
	                            
	                        </view>
	                    </view>
	                </view>
	            <u-modal :title="is_update_type == 1 ?'扣款':'加款'" :show="updateShow" :zoom="false" confirmText="提交" showCancelButton
	            	confirmColor="#515ffb" @confirm="userRecharge()" @cancel = "cancle()">
	            	<u-form :model="forms" ref="uForm">
	            			<u-form-item label="输入金额"><u-input type="number" v-model="rechargeMoney" /></u-form-item>
	            			<u-form-item label="类型">
	            				<u-radio-group v-model="radio">
	            					<u-radio v-for="(item, index) in radioList" :key="index" :name="item.value" >
	            						{{ item.name }}
	            					</u-radio>
	            				</u-radio-group>
	            			</u-form-item>
	            		</u-form>
	            </u-modal>
	        </view>
			
		</view>
</template>

<script>
	import {
		getUserDetail,
		delMoniUser,
		shopkeeperRecharge,
		setSalespersonSaleRate,
		setUserCommissionRate,
		adminUserRecharge,
		adminUserRecharge2
	} from '@/api/user.js'
	export default {
			data() {
				return {
					fo: {
						name: '',
						intro: '',
						sex: ''
					},
					is_update_type: 0,
					that:this,
					forms:"",
					switchVal: false,
					switchSalePersonVal:false,
					switchMoniVal:false,
					user:{
						"nickname":"店主1",					
						"phone":"13461346131",
						"create_time":"2023-03-08 14:05",
						"sum_recharge":"8000.00",			//总充值
						"sum_withdraw":"3000.00",			//总提现	
						"balance":"6000.50",				//余额
						"id":1,
						"count_orders":100,					//总订单数量
						"recently":"红-黑-红-红-黑",			//最近五单情况
						"sum_salePersons":20,				//他的销售人数
						"sum_invite":30,					//他的邀请人数
						"sum_customer":30,					//总客户数量
						"saleRate":0.07,					//销售分佣比例
						"commissionRate":6					,//中奖分佣比例
						"shop_rate":0.07					,//店铺扣款比例
						"pnickname":"上级",
						"pid":"上级id",
						"isAgent":1,
						"avatar":"http://app.tianyingty.xyz/logo.png",
						"tenanit_id":1,
						"shop_name":"天盈",
						"recentlyLotteryStateList":[],
						"moni":0,
						"isAgent":0,
					},
					radio: '',
					form:"",
					updateShow:false,
					rechargeId:0,
					rechargeMoney:0,
					that: this,
					//查询条件
					queryParam: {
						pageNo: 1,
						pageSize: 10
					},
					radioList: [
						{
							value:'0',
							name: '彩金账户' 
						},
						{
							value:'1',
							name: '奖金账户'
						}
					],
				};
			},
			filters: {
				//格式化日期
				formatDate(data, that) {
					return that.globalUtil.dateTimeFormat(data)
				},
			},
			onLoad(e) {
				if(!e.uid){
					uni.showToast({
						title:"请选择用户",
						icon:'none'
					})
					return false;
				}
				this.init(e.uid)
			},
			methods: {
				delUser(){
					uni.showModal({
					    title: '删除用户',
					    content: "确认操作么",
					    success: function (res) {
					        if (res.confirm) {
								uni.showLoading();
					            adminUserRecharge({'price':_price,'type':_type,"id":_rechargeId,"tenantId":_tenantId}).then(res => {
									if(res.success){
										uni.hideLoading();
										uni.showToast({
											title: '操作成功！',
											icon: 'none'
										});
										setTimeout(function() {
											// location.reload()
											}, 1000);
									}
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					})
				},
				updateCommissionRate(){
					uni.showLoading();
					setUserCommissionRate({"commissionRate":this.user.commissionRate,"userId":this.user.id}).then(res=>{
						if(res.success){
							uni.hideLoading();
							uni.showToast({
								title: '操作成功！',
								icon: 'none'
							});
							setTimeout(function() {
								location.reload()
								}, 1000);
						}
					})
				},
				updateSaleRate(){
					uni.showLoading();
					setSalespersonSaleRate({"saleRate":this.user.saleRate,"userId":this.user.id}).then(res=>{
						if(res.success){
							uni.hideLoading();
							uni.showToast({
								title: '操作成功！',
								icon: 'none'
							});
							setTimeout(function() {
								location.reload()
								}, 1000);
						}
					})
				},
				update(type){
					this.is_update_type = type;
					this.rechargeId = this.user.userId
					this.updateShow = true
				},
				userRecharge(){
					let _rechargeId = this.rechargeId;
					let _type = this.is_update_type;
					let _price = this.rechargeMoney;
					let _tenantId = this.user.tenantId;
					let _account = this.radio;
					if(_price <= 0){
						uni.showToast({
							title: '输入的金额错误！',
							icon: 'none'
						});
						return;
					}
					if(_account == ""){
						uni.showToast({
							title: '请选择账户类型！',
							icon: 'none'
						});
						return;
					}
					this.updateShow = false
					
					uni.showModal({
					    title: '余额',
					    content: "确认操作么",
					    success: function (res) {
					        if (res.confirm) {
								uni.showLoading();
					            adminUserRecharge2({'price':_price,'type':_type,"id":_rechargeId,"tenantId":_tenantId,'account': _account}).then(res => {
									if(res.success){
										uni.hideLoading();
										uni.showToast({
											title: '操作成功！',
											icon: 'none'
										});
										setTimeout(function() {
											// location.reload()
											}, 1000);
									}
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					})
					
				},
				cancle(){
					this.updateShow = false
				},
				init(uid){
					getUserDetail({"userId":uid}).then(res => {
						if(res){
							this.user = res
						}
					})
				},
				
				goZhmx(item){
					uni.navigateTo({
						// url: `getDetails?id=${id}&item=${item}`
						url: "/pages/order/counts?uid=" + item.id
					});
				},
				goCustomer(item){
					uni.navigateTo({
						url: "/pages/user/customer?uid=" + item.id
					});
				},
				goSalePerson(item){
					uni.navigateTo({
						url: "/pages/user/salePerson?uid=" + item.id
					});
				},
				goTzjl(item){
					uni.navigateTo({
						url: "/pages/order/lotteryOrder?uid=" + item.id+"&phone="+item.phone
					});
				},
				goXstj(item){
					uni.navigateTo({
						url: "/pages/proxy/invitation?uid=" + item.id
					});
				},
				goDpyj(item){
					uni.navigateTo({
						url: "/pages/counts/statisticsMain?tenantId=" + item.tenantId
					});
				},
				goKhtj(item){
					uni.navigateTo({
						url: "/pages/personal/invitation?uid=" + item.id
					});
				},
				
				del(item) {
					uni.showModal({
					    title: '删除模拟用户',
					    content: "确认删除么",
					    success: function (res) {
					        if (res.confirm) {
								uni.showLoading();
					            delMoniUser({"userId":item.userId}).then(res => {
									if(res.success){
										uni.hideLoading();
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
			}
		}
	
</script>

<style>
.box{
	background-color: #f7f7f7;
	height: 100vh;
}



.u-flex { 
    display: flex; 
    flex-direction: row; 
    align-items: center;
} 

.u-m-v-24 { 
    margin-top: 12px!important; 
    margin-bottom: 12px!important;
} 

.u-p-h-24 { 
    padding-left: 12px!important; 
    padding-right: 12px!important;
} 

.u-p-v-40 { 
    padding-top: 20px!important; 
    padding-bottom: 20px!important;
} 

.bg-f { 
    background-color: #fff;
} 

.u-m-b-24 { 
    margin-bottom: 12px!important;
} 

.u-p-v-30 { 
    padding-top: 15px!important; 
    padding-bottom: 15px!important;
} 

.c-333 { 
    color: #333;
} 

.u-avatar { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 14px; 
    color: #606266; 
    border-radius: 10px; 
    position: relative;
} 

.u-column-between { 
    display: flex; 
    flex-direction: column; 
    justify-content: space-between;
} 

.u-flex-1 { 
    flex: 1!important;
} 

.u-p-l-20 { 
    padding-left: 10px!important;
} 

.u-text-center { 
    text-align: center;
} 

.u-row-between { 
    justify-content: space-between;
} 

.u-font-32 { 
    font-size: 16px!important;
} 

.u-p-h-80 { 
    padding-left: 41px!important; 
    padding-right: 41px!important;
} 

.u-cell-box { 
    width: 100%;
} 

uni-image { 
    width: 320px; 
    height: 240px; 
    display: inline-block; 
    overflow: hidden; 
    position: relative;
} 

uni-image { 
    display: inline-block;
} 

.u-avatar__img { 
    width: 100%; 
    height: 100%;
} 

navigator { 
    height: auto; 
    width: auto; 
    display: block; 
    cursor: pointer;
} 

.u-font-24 { 
    font-size: 12px!important;
} 

.c-666 { 
    color: #666;
} 

.u-p-v-18 { 
    padding-top: 9px!important; 
    padding-bottom: 9px!important;
} 

.u-p-h-68 { 
    padding-left: 35px!important; 
    padding-right: 35px!important;
} 

.u-br-10 { 
    border-radius: 5px;
} 

.u-p-v-16 { 
    padding-top: 8px!important; 
    padding-bottom: 8px!important;
} 

.u-p-h-66 { 
    padding-left: 34px!important; 
    padding-right: 34px!important;
} 

.bg-theme { 
    background-color: #e60012!important;
} 

.u-border-bottom,.u-border-top { 
    position: relative;
} 

.u-cell-item-box { 
    background-color: #fff; 
    flex-direction: row;
} 

.u-border-bottom:after,.u-border-left:after,.u-border-right:after,.u-border-top-bottom:after,.u-border-top:after,.u-border:after { 
    content: " "; 
    position: absolute; 
    left: 0; 
    top: 0; 
    pointer-events: none; 
    box-sizing: border-box; 
    -webkit-transform-origin: 0 0; 
    transform-origin: 0 0; 
    width: 199.8%; 
    height: 199.7%; 
    -webkit-transform: scale(.5); 
    transform: scale(.5); 
    border: 0 solid #e4e7ed; 
    z-index: 2;
} 

.u-border-top:after { 
    border-top-width: 1px;
} 

.u-border-bottom:after { 
    border-bottom-width: 1px;
} 

uni-image > div  { 
    width: 100%; 
    height: 100%;
} 

uni-image > img  { 
    width: 100%; 
    height: 100%;
} 

uni-image > img  { 
    -webkit-touch-callout: none; 
    -webkit-user-select: none; 
    -moz-user-select: none; 
    display: block; 
    position: absolute; 
    top: 0; 
    left: 0; 
    opacity: 0;
} 

uni-text { 
    box-sizing: border-box;
} 

.u-font-28 { 
    font-size: 14px!important;
} 

.u-m-l-20 { 
    margin-left: 10px!important;
} 

.c-theme { 
    color: #e60012;
} 

.font-w-700 { 
    font-weight: 700;
} 

.u-border-bottom { 
    position: relative;
} 

.u-cell { 
    display: flex; 
    flex-direction: row; 
    align-items: center; 
    position: relative; 
    box-sizing: border-box; 
    width: 100%; 
    padding: 13px 16px; 
    font-size: 14px; 
    line-height: 28px; 
    color: #606266; 
    background-color: #fff; 
    text-align: left;
} 

.u-cell_title { 
    font-size: 14px;
} 

.u-cell__value { 
    overflow: hidden; 
    text-align: right; 
    vertical-align: middle; 
    color: #909399; 
    font-size: 13px;
} 

.u-cell__value { 
    flex: 1;
} 

.u-icon-wrap { 
    display: flex; 
    align-items: center; 
    border-radius: 50%;
} 

.u-icon { 
    display: inline-flex; 
    align-items: center;
} 

.u-icon--right { 
    flex-direction: row; 
    align-items: center;
} 

.u-cell__right-icon-wrap { 
    margin-left: 5px; 
    color: #969799; 
    font-size: 14px;
} 

.u-cell__right-icon-wrap { 
    display: flex; 
    flex-direction: row; 
    align-items: center; 
    height: 24px;
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

.uicon-arrow-right:before { 
    content: "\e605";
} 


/* These were inline style tags. Uses id+class to override almost everything */
#style-XLkVr.style-XLkVr {  
   height: 104px;  
}  
#style-h93Hn.style-h93Hn {  
   height: 62px;  
    width: 62px;  
    flex: 0 0 62px;  
    background-color: transparent;  
    border-radius: 500px;  
}  
#style-XZ2Oo.style-XZ2Oo {  
   border-radius: 500px;  
}  
#style-MRPn7.style-MRPn7 {  
   background-image: url("https://moss.caimishop.cn/user/profile/avatar.png");  
    background-position: center center;  
    background-size: cover;  
    background-repeat: no-repeat;  
}  
#style-W9Mek.style-W9Mek {  
   height: 62px;  
}  
#style-F5KGM.style-F5KGM {  
   line-height: 1;  
}  
#style-QYwRN.style-QYwRN {  
   line-height: 1;  
}  
#style-YWJ11.style-YWJ11 {  
   font-size: 29px;  
}  
#style-jFIQV.style-jFIQV {  
   font-size: 29px;  
}  
#style-drYV6.style-drYV6 {  
   margin-top: 41px;  
}  
#style-atokZ.style-atokZ {  
   border: 1px solid rgb(234, 234, 234);  
}  
#style-HOezm.style-HOezm {  
   color: rgb(255, 255, 255);  
}  
#style-ASd6R.style-ASd6R {  
   background-color: transparent;  
}  
#style-HL19X.style-HL19X {  
   width: auto;  
}  
#style-eNXPO.style-eNXPO {  
   transform: rotate(0deg);  
}  
#style-n5jdX.style-n5jdX {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  
#style-Hbr35.style-Hbr35 {  
   background-color: transparent;  
}  
#style-av9eD.style-av9eD {  
   width: auto;  
}  
#style-RL1Fv.style-RL1Fv {  
   transform: rotate(0deg);  
}  
#style-r5CEP.style-r5CEP {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  
#style-QkUxX.style-QkUxX {  
   background-color: transparent;  
}  
#style-l6xN3.style-l6xN3 {  
   width: auto;  
}  
#style-UQyNk.style-UQyNk {  
   transform: rotate(0deg);  
}  
#style-aVSHq.style-aVSHq {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  
/* These were inline style tags. Uses id+class to override almost everything */
#style-alp51.style-alp51 {  
   height: 104px;  
}  
#style-MLVBo.style-MLVBo {  
   height: 62px;  
    width: 62px;  
    flex: 0 0 62px;  
    background-color: transparent;  
    border-radius: 500px;  
}  
#style-t2VbU.style-t2VbU {  
   border-radius: 500px;  
}  
#style-cfQXg.style-cfQXg {  
   background-image: url("https://moss.caimishop.cn/user/profile/avatar.png");  
    background-position: center center;  
    background-size: cover;  
    background-repeat: no-repeat;  
}  
#style-VfMbA.style-VfMbA {  
   height: 62px;  
}  
#style-3FXRi.style-3FXRi {  
   line-height: 1;  
}  
#style-i6aBG.style-i6aBG {  
   line-height: 1;  
}  
#style-9SQfY.style-9SQfY {  
   font-size: 29px;  
}  
#style-yUooW.style-yUooW {  
   font-size: 29px;  
}  
#style-23rrb.style-23rrb {  
   margin-top: 41px;  
}  
#style-TpXKG.style-TpXKG {  
   border: 1px solid rgb(234, 234, 234);  
}  
#style-sLyeg.style-sLyeg {  
   color: rgb(255, 255, 255);  
}  
#style-qNfw1.style-qNfw1 {  
   background-color: transparent;  
}  
#style-9i5WF.style-9i5WF {  
   width: auto;  
}  
#style-zzfo1.style-zzfo1 {  
   transform: rotate(0deg);  
}  
#style-Y7X3w.style-Y7X3w {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  
#style-eTJVF.style-eTJVF {  
   background-color: transparent;  
}  
#style-1hnlD.style-1hnlD {  
   width: auto;  
}  
#style-71oiB.style-71oiB {  
   transform: rotate(0deg);  
}  
#style-otdv2.style-otdv2 {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  
#style-jOVwG.style-jOVwG {  
   background-color: transparent;  
}  
#style-oBOJG.style-oBOJG {  
   width: auto;  
}  
#style-xGTJx.style-xGTJx {  
   transform: rotate(0deg);  
}  
#style-Opcve.style-Opcve {  
   font-size: inherit;  
    font-weight: normal;  
    top: 0px;  
}  

</style>
