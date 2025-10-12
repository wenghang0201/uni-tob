<template>
	<view class="flex flex-col h-100vh bgc-f5f5f5">
		<nav-bar :title="'托管余额'" :back="true"></nav-bar>
		<u-tabs :list="tabList" :current="currentTab" @change="handleTabChange" :scrollable="false"></u-tabs>
		<swiper class="flex-1" :current="currentTab" @animationfinish="handleSwiperChange">
			<!-- 余额 -->
			<swiper-item class="h-full">
				<scroll-view scroll-y class="h-full" @scrolltolower="handleScrollToLowerBalance">
					<view class="p-20">
						<view v-if="balanceList.length === 0 && balanceStatus === 'nomore'" class="flex justify-center items-center h-full pt-100">
							<u-empty mode="list" text="暂无用户余额记录"></u-empty>
						</view>
						<template v-else>
							<uni-load-more v-if="balanceList.length > 0 && balanceStatus !== 'nomore'" :status="balanceStatus" />
							<uni-load-more v-if="balanceStatus === 'nomore' && balanceList.length > 0" status="nomore" />
							<view v-for="(item, index) in balanceList" :key="item.id || index" class="flex justify-between items-center bgc-fff p-20 rounded-10 mb-20 shadow" @click="navigateToUserDetail(item.id)">
								<view class="flex items-center">
									<u-avatar :src="item.avatar || '/static/images/personal/toxiang.png'" size="40"></u-avatar>
									<view class="ml-20 flex flex-col">
										<view class="fs-28 c-333 mb-5">{{ item.storeRemark || item.nickname }}</view>
										<view class="fs-24 c-999">{{ item.createTime }}</view>
									</view>
								</view>
								<view>
									<view class="fs-32 fw-bold c-ff5500">￥{{ item.gold ? parseFloat(item.gold).toFixed(2) : '0.00' }}</view>
								</view>
							</view>
							<!-- <u-loadmore v-if="balanceList.length > 0 && balanceStatus !== 'nomore'" :status="balanceStatus" />
							<u-loadmore v-if="balanceStatus === 'nomore' && balanceList.length > 0" status="nomore" /> -->
						</template>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 加款 type:7 -->
			<swiper-item class="h-full">
				<scroll-view scroll-y class="h-full" @scrolltolower="handleScrollToLowerDeposit">
					<view class="p-20">
						<view v-if="depositList.length === 0 && depositStatus === 'nomore'" class="flex justify-center items-center h-full pt-100">
							<u-empty mode="list" text="暂无加款记录"></u-empty>
						</view>
						<template v-else>
							<uni-load-more v-if="depositList.length > 0 && depositStatus !== 'nomore'" :status="depositStatus" />
							<uni-load-more v-if="depositStatus === 'nomore' && depositList.length > 0" status="nomore" />
							<view v-for="(item, index) in depositList" :key="item.orderId || index" class="flex justify-between items-center bgc-fff p-20 rounded-10 mb-20 shadow">
								<view class="flex flex-col">
									<view class="fs-28 c-333 mb-5">{{ item.typeStr }} - {{ item.storeRemark || item.nickname }}</view>
									<view class="fs-24 c-999">{{ item.createTime }}</view>
								</view>
								<view>
									<view class="fs-30 fw-bold c-00b26a">+{{ parseFloat(item.price || 0).toFixed(2) }}</view>
								</view>
							</view>
							<!-- <u-loadmore v-if="depositList.length > 0 && depositStatus !== 'nomore'" :status="depositStatus" />
							<u-loadmore v-if="depositStatus === 'nomore' && depositList.length > 0" status="nomore" /> -->
						</template>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 扣款 type:8 -->
			<swiper-item class="h-full">
				<scroll-view scroll-y class="h-full" @scrolltolower="handleScrollToLowerWithdrawal">
					<view class="p-20">
						<view v-if="withdrawalList.length === 0 && withdrawalStatus === 'nomore'" class="flex justify-center items-center h-full pt-100">
							<u-empty mode="list" text="暂无扣款记录"></u-empty>
						</view>
						<template v-else>
							<uni-load-more v-if="withdrawalList.length > 0 && withdrawalStatus !== 'nomore'" :status="withdrawalStatus" />
							<uni-load-more v-if="withdrawalStatus === 'nomore' && withdrawalList.length > 0" status="nomore" />
							<view v-for="(item, index) in withdrawalList" :key="item.orderId || index" class="flex justify-between items-center bgc-fff p-20 rounded-10 mb-20 shadow">
								<view class="flex flex-col">
									<view class="fs-28 c-333 mb-5">{{ item.typeStr }} - {{ item.storeRemark || item.nickname }}</view>
									<view class="fs-24 c-999">{{ item.createTime }}</view>
								</view>
								<view>
									<view class="fs-30 fw-bold c-ff5500">{{ parseFloat(item.price || 0).toFixed(2) }}</view> 
								</view>
							</view>
							<!-- <u-loadmore v-if="withdrawalList.length > 0 && withdrawalStatus !== 'nomore'" :status="withdrawalStatus" />
							<u-loadmore v-if="withdrawalStatus === 'nomore' && withdrawalList.length > 0" status="nomore" /> -->
						</template>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import navBar from '@/components/nav-bar/nav-bar.vue'
import { getUserList } from '@/api/user.js'; // Import getUserList
import { getMingXiOrders } from '@/api/lotteryOrder.js'; // Import getMingXiOrders

export default {
	components: {
		navBar
	},
	data() {
		return {
			tabList: [{ name: '余额' }, { name: '加款' }, { name: '扣款' }],
			currentTab: 0,
			balanceList: [], // User list for the Balance tab
			depositList: [], // 加款列表
			withdrawalList: [], // 扣款列表
			balanceStatus: 'loadmore',
			depositStatus: 'loadmore',
			withdrawalStatus: 'loadmore',
			queryParam: { // Query parameters for user list
				pageNo: 1,
				pageSize: 10,
				nickname: "", // Add other params from person.vue if needed
				userId: null, // Will be set if passed via options
				startTime: "",
				endTime: "",
				type: null // To be set for deposit/withdrawal
			},
			totalBalanceRecords: 0, // Total count for balance list pagination
			totalDepositRecords: 0,
			totalWithdrawalRecords: 0,
			depositPage: 1,
			withdrawalPage: 1,
			pageSize: 10, // Common pageSize, or specific for deposit/withdrawal if needed
		};
	},
	onLoad(options) {
		// Check if userId is passed from previous page (e.g., personal.vue)
		if (options && options.userId) {
			this.queryParam.userId = options.userId;
		}
		this.loadBalanceData();
	},
	onPullDownRefresh() {
		if (this.currentTab === 0) {
			this.queryParam.pageNo = 1;
			this.balanceList = [];
			this.balanceStatus = 'loadmore';
			this.loadBalanceData().finally(() => {
				uni.stopPullDownRefresh();
			});
		} else if (this.currentTab === 1) {
			this.depositPage = 1;
			this.depositList = [];
			this.depositStatus = 'loadmore';
			this.loadDepositData().finally(() => {
				uni.stopPullDownRefresh();
			});
		} else if (this.currentTab === 2) {
			this.withdrawalPage = 1;
			this.withdrawalList = [];
			this.withdrawalStatus = 'loadmore';
			this.loadWithdrawalData().finally(() => {
				uni.stopPullDownRefresh();
			});
		}
	},
	methods: {
		navigateToUserDetail(userId) {
			if(userId){
				uni.navigateTo({
					url: "/pages/user/info?uid=" + userId
				});
			}
		},
		formatTime(timeStr) {
			if (!timeStr) return '未知';
			const date = new Date(timeStr);
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
		reloadDataForCurrentTab() {
			console.log(`reloadDataForCurrentTab: Reloading data for tab index ${this.currentTab}`);
			if (this.currentTab === 0) {
				// console.log('Switching to Balance tab, reloading data.'); // Kept from previous, can be removed if too verbose
				this.queryParam.pageNo = 1;
				this.balanceList = [];
				this.balanceStatus = 'loadmore';
				this.loadBalanceData();
			} else if (this.currentTab === 1) {
				// console.log('Switching to Deposit tab, reloading data.');
				this.depositPage = 1;
				this.depositList = [];
				this.depositStatus = 'loadmore';
				this.loadDepositData();
			} else if (this.currentTab === 2) {
				// console.log('Switching to Withdrawal tab, reloading data.');
				this.withdrawalPage = 1;
				this.withdrawalList = [];
				this.withdrawalStatus = 'loadmore';
				this.loadWithdrawalData();
			}
		},
		handleTabChange(indexOrEvent) {
			const newIndex = typeof indexOrEvent === 'object' ? indexOrEvent.index : indexOrEvent;
			
			if (this.currentTab === newIndex) {
				console.log(`handleTabChange: Tab ${newIndex} is already current or change is a reflection. Ignoring.`);
				return;
			}

			this.currentTab = newIndex;
			console.log(`handleTabChange: Tab set to ${this.currentTab} by u-tabs @change.`);
			this.reloadDataForCurrentTab();
		},
		handleSwiperChange(e) {
			const newIndex = e.detail.current;

			if (this.currentTab === newIndex) {
				console.log(`handleSwiperChange: Tab ${newIndex} is already current or change is a reflection. Ignoring.`);
				return;
			}
			
			this.currentTab = newIndex;
			console.log(`handleSwiperChange: Tab set to ${this.currentTab} by swiper @animationfinish.`);
			this.reloadDataForCurrentTab();
		},
		handleScrollToLowerBalance() {
			if (this.balanceStatus === 'loadmore') {
				this.loadBalanceData();
			}
		},
		handleScrollToLowerDeposit() {
			if (this.depositStatus === 'loadmore') {
				this.loadDepositData();
			}
		},
		handleScrollToLowerWithdrawal() {
			if (this.withdrawalStatus === 'loadmore') {
				this.loadWithdrawalData();
			}
		},
		async loadBalanceData() {
			if (this.balanceStatus === 'loading' || (this.balanceStatus === 'nomore' && this.queryParam.pageNo > 1) ) {
				return Promise.resolve();
			}
			console.log(`Loading balance data, page: ${this.queryParam.pageNo}, status: ${this.balanceStatus}`);
			this.balanceStatus = 'loading';
			uni.showLoading({ title: '加载中...' });
			try {
				const params = {
					...this.queryParam,
					sortField: 'gold',
					sortOrder: 'desc'
				 };
				const res = await getUserList(params);
				console.log('Balance API response:', res); // Log API response
				if (res && res.voList) {
					if (params.pageNo === 1) {
						this.balanceList = res.voList;
					} else {
						this.balanceList = [...this.balanceList, ...res.voList];
					}
					this.totalBalanceRecords = res.total || 0;
					if ((this.totalBalanceRecords > 0 && this.balanceList.length >= this.totalBalanceRecords) || res.voList.length < params.pageSize) {
						this.balanceStatus = 'nomore';
					} else {
						this.balanceStatus = 'loadmore';
						this.queryParam.pageNo++; // Increment the main queryParam.pageNo for balance
					}
					if(params.pageNo === 1 && res.voList.length === 0){
						this.balanceStatus = 'nomore';
					}
				} else {
					this.balanceStatus = 'nomore'; 
					if(params.pageNo === 1) this.balanceList = [];
				}
			} catch (error) {
				console.error('Failed to load balance data:', error);
				this.balanceStatus = 'loadmore'; 
				uni.showToast({ title: '加载余额列表失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
			return Promise.resolve();
		},
		async loadDepositData() {
			if (this.depositStatus === 'loading' || (this.depositStatus === 'nomore' && this.depositPage > 1)) {
				return Promise.resolve();
			}
			console.log(`Loading deposit data, page: ${this.depositPage}, status: ${this.depositStatus}`);
			this.depositStatus = 'loading';
			uni.showLoading({ title: '加载中...' });
			try {
				const params = {
					...this.queryParam, 
					pageNo: this.depositPage,
					type: '7' 
				};
				const res = await getMingXiOrders(params);
				console.log('Deposit API response:', res); // Log API response
				if (res && res.voList) {
					if (this.depositPage === 1) {
						this.depositList = res.voList;
					} else {
						this.depositList = [...this.depositList, ...res.voList];
					}
					this.totalDepositRecords = res.total || 0;
					if ((this.totalDepositRecords > 0 && this.depositList.length >= this.totalDepositRecords) || res.voList.length < params.pageSize) {
						this.depositStatus = 'nomore';
					} else {
						this.depositStatus = 'loadmore';
						this.depositPage++;
					}
					if (this.depositPage === 1 && res.voList.length === 0) {
						this.depositStatus = 'nomore';
					}
				} else {
					this.depositStatus = 'nomore';
					if(this.depositPage === 1) this.depositList = [];
				}
			} catch (error) {
				console.error('Failed to load deposit data:', error);
				this.depositStatus = 'loadmore'; 
				uni.showToast({ title: '加载加款记录失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
			return Promise.resolve();
		},
		async loadWithdrawalData() {
			if (this.withdrawalStatus === 'loading' || (this.withdrawalStatus === 'nomore' && this.withdrawalPage > 1)) {
				return Promise.resolve();
			}
			console.log(`Loading withdrawal data, page: ${this.withdrawalPage}, status: ${this.withdrawalStatus}`);
			this.withdrawalStatus = 'loading';
			uni.showLoading({ title: '加载中...' });
			try {
				const params = {
					...this.queryParam, 
					pageNo: this.withdrawalPage,
					type: '8' 
				};
				const res = await getMingXiOrders(params);
				console.log('Withdrawal API response:', res); // Log API response
				if (res && res.voList) {
					if (this.withdrawalPage === 1) {
						this.withdrawalList = res.voList;
					} else {
						this.withdrawalList = [...this.withdrawalList, ...res.voList];
					}
					this.totalWithdrawalRecords = res.total || 0;
					if ((this.totalWithdrawalRecords > 0 && this.withdrawalList.length >= this.totalWithdrawalRecords) || res.voList.length < params.pageSize) {
						this.withdrawalStatus = 'nomore';
					} else {
						this.withdrawalStatus = 'loadmore';
						this.withdrawalPage++;
					}
					if (this.withdrawalPage === 1 && res.voList.length === 0) {
						this.withdrawalStatus = 'nomore';
					}
				} else {
					this.withdrawalStatus = 'nomore';
					if(this.withdrawalPage === 1) this.withdrawalList = [];
				}
			} catch (error) {
				console.error('Failed to load withdrawal data:', error);
				this.withdrawalStatus = 'loadmore';
				uni.showToast({ title: '加载扣款记录失败', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
			return Promise.resolve();
		},
	},
};
</script>

<style lang="scss" scoped>
.shadow {
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
.pt-100 {
	padding-top: 100rpx;
}
</style> 