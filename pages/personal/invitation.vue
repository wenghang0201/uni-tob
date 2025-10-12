<template>
	<view class="box">
		
		<nav-bar :title="'他的邀請'" :back="true"></nav-bar>
		<view>
			<u-search @search="init" shape="square" margin="16rpx" height="40" animation :showAction="false" @clear="init"
				placeholder="请输入用户昵称或者手机号" v-model="queryParam.searchKey"></u-search>
		</view>
		<view class="flex flex-col gap-10 p-20">
			<view class="invitation">
				<p v-if="userShow" style="font-size: 14px;">共邀请：<span class="font">{{total}}</span>个客户</p>
				<p v-else style="font-size: 14px;">总投注金额：<span class="font">{{totalAmount}}</span>元</p>
			</view>
			<uni-datetime-picker type="daterange" @change="change" />
		</view>
		<view>
			<u-tabs activeStyle="color:#FF3F43;" :scrollable="false" lineWidth="45" lineColor="#FF3F43" :list="tabList"
				@click="selectBtn">
			</u-tabs>
		</view>
		<view class="table" style="width: 100%;" v-show="userShow">
			<uni-table style="width: 100%;" emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center">昵称|手机号</uni-th>
					<uni-th align="center">注册时间</uni-th>
					<!-- <uni-th align="center" width="100" v-if="user.isAgent=='1'" >账户余额</uni-th> -->
					
					<!-- <uni-th align="center" width="60" v-if="user.isAgent=='1'" >流水</uni-th> -->
					<!-- <uni-th align="center" width="60" >订单</uni-th> -->
					<!-- <uni-th align="center" width="60"   v-if="user.isAgent=='1'">操作</uni-th> -->
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item in registerUserList" :key="item.id">
					<uni-td align="center">{{item.storeRemark || item.nickname}}<br>{{item.phone}}</uni-td>
					<uni-td align="center">{{item.createTime}}</uni-td>
					<!-- <uni-td align="center" v-if="user.isAgent=='1'" >{{(item.amount).toFixed(2)}}</uni-td> -->
					
					<!-- <uni-td align="center"  v-if="user.isAgent=='1'"  ><span style="color: #2979FF;" @click="mingxi(item)">明细</span></uni-td> -->
					<!-- <uni-td align="center" ><span style="color: #2979FF;" @click="info(item)">详情</span></uni-td> -->
					<!-- <uni-td align="center" v-if="user.isAgent=='1'"  >
						<span style="color: #2979FF;" @click="update(item)">修改</span>
					</uni-td> -->
				</uni-tr>
			</uni-table>
		</view>

		<view class="table" style="width: 100%;" v-show="orderShow">
			<uni-table style="width: 100%;" emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center">昵称|手机号</uni-th>
					<uni-th align="center">投注金额</uni-th>
					<uni-th align="center" width="100">详情</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="item in bettingUserList" :key="item.id">
					<uni-td align="center">{{item.storeRemark || item.nickname}}<br>{{item.phone}}</uni-td>
					<uni-td align="center">￥{{item.amount}}</uni-td>
					<uni-td align="center">
						<span style="color: #2979FF;" @click="detail(item)">详情</span>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		
		 
		<u-modal title="修改用户余额" :show="updateShow" :zoom="false" confirmText="提交" showCancelButton
			confirmColor="#FF3F43" @confirm="shopRecharge()" @cancel = "cancle()">
			<u-form :model="form" ref="uForm">
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
</template>


<script>
	import {
		getUser,
		shopkeeperRecharge,
		inviteStatistics
	} from '@/api/user.js'
	import {
		setUserInfo
	} from "@/util/auth.js"
	export default {
		data() {
			return {
				radio: '',
				form:"",
				updateShow:false,
				rechargeId:0,
				rechargeMoney:0,
				user:{},
				total: 0,
				totalAmount: 0,
				that: this,
				queryParam: {
					searchKey: undefined,
					startTime: undefined,
					endTime: undefined,
					pid:undefined,
					type: "",
					pageNo: 1,
					pageSize: 10,
				},
				userShow: true,
				orderShow: false,
				registerUserList: [],
				bettingUserList: [],
				// 分頁相關狀態
				registerTotal: 0,
				bettingTotal: 0,
				isLoadingMore: false,
				tabList: [{
					name: '注册数据',
				}, {
					name: '投注数据',
				}],
				radioList: [
					{
						value:'0',
						name: '加款'
					},
					{
						value:'1',
						name: '扣款'
					}
				],
			}
		},
		filters: {
			formatDate(data, that) {
				if (null == data) {
					return null;
				}
				return that.globalUtil.dateTimeFormat(data)
			},
		},
		methods: {
			update(item){
				this.rechargeId = item.userId
				this.updateShow = true
			},
			shopRecharge(){
				let _rechargeId = this.rechargeId;
				let _type = this.radio;
				let _price = this.rechargeMoney;
				this.updateShow = false
				uni.showModal({
				    title: '余额',
				    content: "确认操作么",
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading();
				            shopkeeperRecharge(_rechargeId ,{'price':_price,'type':_type}).then(res => {
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
			cancle(){
				this.updateShow = false
			},
			inits() {
				getUser().then(res => {
					if(res.status=="1"){
						this.logout();
					}
					setUserInfo(res);
					this.user = res
				})
			},
			selectBtn(item) {
				if (item.index == 0) {
					this.userShow = true;
					this.orderShow = false;
				} else if (item.index == 1) {
					this.orderShow = true;
					this.userShow = false;
				}
				// 切換標籤頁時重置分頁狀態
				this.queryParam.pageNo = 1;
				this.isLoadingMore = false;
			},
			change(option) {
				this.queryParam.startTime = option[0];
				this.queryParam.endTime = option[1];
				// 時間範圍改變時重置分頁
				this.queryParam.pageNo = 1;
				this.isLoadingMore = false;
				this.init()
			},
			init() {
				uni.showLoading();
				// 重置分頁參數
				this.queryParam.pageNo = 1;
				this.registerUserList = [];
				this.bettingUserList = [];
				this.total = 0;
				this.totalAmount = 0;
				this.registerTotal = 0;
				this.bettingTotal = 0;
				this.isLoadingMore = false;

				// 加載註冊數據
				this.loadRegisterData();
				// 加載投注數據
				this.loadBettingData();
			},

			// 加載註冊數據
			loadRegisterData() {
				inviteStatistics({
					...this.queryParam,
					type: 1
				}).then(res => {
					if (this.queryParam.pageNo === 1) {
						this.registerUserList = res.data.voList || [];
					} else {
						this.registerUserList = [...this.registerUserList, ...(res.data.voList || [])];
					}
					this.total = res.data.total || 0;
					this.registerTotal = res.data.total || 0;

					// 如果是初始加載，隱藏loading
					if (this.queryParam.pageNo === 1) {
						uni.hideLoading();
					}

					// 重置加載更多狀態
					this.isLoadingMore = false;

					// 如果是加載更多且沒有新數據，顯示提示
					if (this.queryParam.pageNo > 1 && (!res.data.voList || res.data.voList.length === 0)) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(err => {
					console.error("加載註冊數據失敗:", err);
					this.isLoadingMore = false;
					if (this.queryParam.pageNo > 1) {
						this.queryParam.pageNo--; // 加載失敗，頁碼回退
						uni.showToast({
							title: '加载失败，请重试',
							icon: 'none',
							duration: 2000
						});
					}
					if (this.queryParam.pageNo === 1) {
						uni.hideLoading();
					}
				});
			},

			// 加載投注數據
			loadBettingData() {
				inviteStatistics({
					...this.queryParam,
					type: 2
				}).then(res => {
					if (this.queryParam.pageNo === 1) {
						this.bettingUserList = res.data.voList || [];
					} else {
						this.bettingUserList = [...this.bettingUserList, ...(res.data.voList || [])];
					}
					this.totalAmount = res.allAmount || 0;
					this.bettingTotal = res.data.total || 0;

					// 重置加載更多狀態
					this.isLoadingMore = false;

					// 如果是加載更多且沒有新數據，顯示提示
					if (this.queryParam.pageNo > 1 && (!res.data.voList || res.data.voList.length === 0)) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none',
							duration: 1500
						});
					}
				}).catch(err => {
					console.error("加載投注數據失敗:", err);
					this.isLoadingMore = false;
					if (this.queryParam.pageNo > 1) {
						this.queryParam.pageNo--; // 加載失敗，頁碼回退
						uni.showToast({
							title: '加载失败，请重试',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			info(item) {
				uni.navigateTo({
					url: "/pages/order/lotteryOrder?uid=" + item.userId
				});
			},
			mingxi(item) {
				uni.navigateTo({
					url: "/pages/order/counts?uid=" + item.userId
				});
			},
			detail(item) {
				// uni.navigateTo({
				// 	url: "/pages/order/lotteryOrderDetails?id=" + item.id
				// });
				uni.navigateTo({
					url: "pages/order/bettingRecords?uid=" + item.id + `&param=${item.nickname || item.phone}`
				})
			},

			// 加載更多數據
			loadMore() {
				// 防止重複加載
				if (this.isLoadingMore) {
					return;
				}

				// 根據當前顯示的標籤頁判斷是否還有更多數據
				let currentList, currentTotal;
				if (this.userShow) {
					currentList = this.registerUserList;
					currentTotal = this.registerTotal;
				} else {
					currentList = this.bettingUserList;
					currentTotal = this.bettingTotal;
				}

				// 檢查是否還有更多數據
				if (currentList.length >= currentTotal) {
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none',
						duration: 1500
					});
					return;
				}

				// 設置加載狀態
				this.isLoadingMore = true;

				// 增加頁碼
				this.queryParam.pageNo++;

				// 顯示加載提示
				uni.showLoading({ title: '加载更多...' });

				// 根據當前標籤頁加載對應數據
				if (this.userShow) {
					this.loadRegisterData();
				} else {
					this.loadBettingData();
				}
			},
		},
		// 滾動到底部進行分頁事件
		onReachBottom() {
			this.loadMore();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		onLoad(e) {
			this.queryParam.pid = Number(e.uid)
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding-bottom: 0px;
	}

	::v-deep(.u-tabs__wrapper__nav__item__text ){
		font-size: 16px !important;
	}

	.table {
		margin-top: 10rpx;
	}

	.invitation {
		margin: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.font {
			color: #FF3F43;
		}
	}
	
	.caozuo{
		background-color: #948784;
		width: 100%;
		height: 300upx;
		padding: 20upx;
	}
	.caozuo_title{
		text-align: center;
	}
</style>

