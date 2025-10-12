<template>
	<view class="box">
		<!-- 添加 nav-bar 组件 -->
		<nav-bar :title="'我的下级'" :back="true"></nav-bar>
		<u-empty icon="/static/no-order.png" :show="userList.length<=0"
		mode="order" text="没有相关记录"></u-empty>
		<!-- 用户列表 -->
		<view class="list_content">
			    <view class="mescroll-body mescroll-render-touch style-Yobop" >
			      <view class="mescroll-body-content mescroll-wxs-content" style="">
			        <view v-for="(user, index) in userList" :key="index" class="list_items u-p-22 u-flex bg-f style-item" @click="detail(user.id)">
					  <image v-if="user.avatar" class="u-avatar" :src="user.avatar"></image>
					  <image v-else src="/static/images/user/logo.png"
					  	mode="scaleToFill"></image>
			          <view class="u-column-between u-flex-1 u-p-l-20">
			            <text class="u-font-32 c-333">{{ user.storeRemark || user.nickname }}<span v-if="user.moni == 1" style="color:red;margin-left: 10px;">模拟</span></text>
			                <text class="u-font-28 c-666">{{ user.phone }}<text class="u-m-l-40">余额：{{ user.price + user.gold}}元</text></text>
			          </view>
			          <view class="u-icon u-icon--right">
			            <!-- 右侧图标 -->
			            >
			          </view>
			        </view>
			      </view>
			    </view>
			  </view>
				</view>
</template>

<script>
	import {
		agent
	} from '@/api/user.js'
	export default {
		data() {
			return {
				userList: [],
				totalUserCount: 0,  // 用户总数
				queryParam: {
					nickname: "",
					salespersonId: 0,
					pageNo: 1,
					pageSize: 10,
				},
			}
		},
		created() {
			// 移除 getStatusBarHeight 调用
			// this.getStatusBarHeight();
		},
		onLoad(options) {
			// 通过options接收外部传入的userId参数
			if (options && options.userId) {
				this.queryParam.salespersonId = Number(options.userId);
			}
			// 直接调用加载列表
			this.queryParam.pageNo = 1; 
			this.userList = []; 
			this.loadUserList();
		},
		onPullDownRefresh() {
			this.queryParam.pageNo = 1;
			this.userList = [];
			this.loadUserList(); // 调用统一的加载方法
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			detail(id) {
				uni.navigateTo({
					url: "/pages/user/info?uid=" + id
				});
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
			// 将 getUserLists 重命名为 loadUserList 并包含加载状态
			loadUserList(){
				let that = this;
				// uni.showLoading({
				// 	title: '加载中...'
				// });
				agent(this.queryParam).then(res => {
					if (res.success) {
						if (res.voList != null) {
							// 如果是第一页，直接赋值
							if (that.queryParam.pageNo === 1) {
								that.userList = res.voList;
							} else {
								// 加载更多，过滤重复数据（如果需要，或者后端保证不重复）
								// const newData = res.voList.filter(item => !that.userList.some(existingItem => existingItem.id === item.id));
								// that.userList = [...that.userList, ...newData];
								// 或者直接追加
								that.userList = [...that.userList, ...res.voList];
							}
							that.totalUserCount = res.total || that.userList.length;
						}
					} else {
						uni.showToast({
							title: res.message || '加载失败',
							icon: 'none'
						});
					}
				}).catch(err => {
				}).finally(() => {
				});
			},
			
			loadMore() {
				if (this.userList.length >= this.totalUserCount) {
					return false;
				}
				this.queryParam.pageNo++;
				this.loadUserList(); // 调用统一的加载方法
				return true;
			},
		}
	}
</script>

<style>
	/* 保持需要的样式 */
	.c-999{
		color: #999;
	}
	.u-p-30 { /* 如果 u-popup 移除了，这个可能也不需要了 */
	    padding: 15px 15px 15px 15px!important;
	}

	.bg-f { /* 列表项背景色 */
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

	.u-font-28 {
	    font-size: 14px!important;
	}

	.u-flex {
	    display: flex;
	    flex-direction: row;
	    align-items: center;
	}

	.u-p-22 { /* 列表项内边距 */
	    padding: 11px!important;
	}

	.list_content .list_items  {
	    border-bottom: 0.5px solid #eaeaea;
	}

	.u-avatar { /* 头像样式 */
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

	.u-flex-1 {
	    flex: 1!important;
	}

	.u-p-l-20 { /* 左侧信息左内边距 */
	    padding-left: 10px!important;
	}

	.u-column-between {
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	}
	
	.c-333 { /* 主要文字颜色 */
	    color: #333;
	}

	.c-666 { /* 次要文字颜色 */
	    color: #666;
	}

	.u-m-l-40 { /* 余额左外边距 */
	    margin-left: 20px!important;
	}

	.u-icon--right { /* 右侧大于号图标容器 */
	    flex-direction: row;
	    align-items: center;
	}
	
	.list_content {
		padding-top: 0; 
		padding-bottom: 0; 
		background-color: #f5f5f5; 
	}
	
	.LBTL-noMag .u-empty { /* 调整空状态间距 */
		margin-top: 30vh !important; /* 居中一些 */
	}

	/* 移除大量不再使用的样式 */
	/* .snipcss-2jlKf, .style-Q6QMt, .style-By75E, .style-Umtzo, ... */

</style>