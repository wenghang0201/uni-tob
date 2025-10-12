<template>
	<view class="box" style="min-height: 100vh;">
		<!-- 导航栏 -->
		<nav-bar :title="title || '选择上级'" :back="true" @backClick="handleBack"></nav-bar>

		<!-- 用户列表用普通 view 包裹，页面整体滚动 -->
		<view class="list_content">
			<view class="mescroll-body mescroll-render-touch">
				<view class="LBTL-noMag">
					<u-empty icon="/static/no-order.png" :show="userList.length<=0"
						mode="order" text="没有相关记录"></u-empty>
				</view>
				<view class="mescroll-body-content mescroll-wxs-content">
					<view v-for="(user, index) in userList" :key="index" class="list_items u-p-22 u-flex bg-f style-item" @click="selectUser(user)">
						<image v-if="user.avatar" class="u-avatar" :src="user.avatar"></image>
						<image v-else src="/static/images/user/logo.png" mode="scaleToFill" class="u-avatar"></image>
						<view class="u-column-between u-flex-1 u-p-l-20">
							<text class="u-font-32 c-333">{{ user.storeRemark || user.nickname }}<span v-if="user.moni == 1" style="color:red;margin-left: 10px;">模拟</span></text>
							<text class="u-font-28 c-666">{{ user.phone }}<text class="u-m-l-40">余额：{{ user.price + user.gold}}元</text></text>
						</view>
					</view>
					<!-- 加载更多按钮/提示 -->
					<view style="text-align:center; padding: 32rpx 0;">
						<button
							v-if="userList.length < totalUserCount"
							@click="loadMore"
							class="load-more-btn"
							plain
						>加载更多</button>
						<text v-else style="color:#999;font-size:28rpx;">没有更多数据了</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStoreUsers,
		shopOwnerModifiesUserPid
	} from '@/api/user.js'
	export default {
		props: {
			// 页面标题
			title: {
				type: String,
				default: '选择上级'
			},
			// 用户筛选条件
			filter: {
				type: Object,
				default: () => ({})
			},
			// 用户ID
			userId: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				userList: [],
				totalUserCount: 0,  // 用户总数
				curUserId: 0,
				queryParam: {
					userTypeList: ["1","2"],
					pageNo: 1,
					pageSize: 10,
				},
				scrollViewHeight: 0, // 新增
			}
		},
		created() {
		},
		onLoad(options) {
			// 通过options接收外部传入的userId参数
			if (options && options.userId) {
				this.curUserId = Number(options.userId);
			}
			// 初始化加载用户列表
			this.resetSearch();
		},
		onPullDownRefresh() {
			this.resetSearch();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		onReachBottom() {
			this.loadMore();
		},
		mounted() {
			// 获取 scroll-view 的实际高度
			uni.getSystemInfo({
				success: (res) => {
					// 这里假设 scroll-view 占满全屏，1px=2rpx
					this.scrollViewHeight = res.windowHeight * 2;
				}
			});
		},
		methods: {
			// 返回按钮点击
			handleBack() {
				uni.navigateBack();
			},
			
			// 重置搜索
			resetSearch() {
				this.queryParam.pageNo = 1;
				this.userList = [];
				// 确保userId在重置时不会丢失
				if (this.userId) {
					this.queryParam.userId = this.userId;
				}
				this.loadUserList();
			},
			
			// 搜索用户
			searchUsers() {
				this.resetSearch();
			},
			
			// 选择用户
			selectUser(user) {
				let that = this;
				//确认是否修改上级
				uni.showModal({
					title: '提示',
					content: '是否修改上级为'+ (user.storeRemark || user.nickname),
					success: (res) => {
						if (res.confirm) {
							shopOwnerModifiesUserPid({
								userId: that.curUserId,
								pid: user.userId
							}).then(res => {
								if (res.success) {
									uni.showToast({
										title: '修改成功',
										icon: 'success'
									});
									setTimeout(function() {
										// 创建一个页面事件通道
										const eventChannel = that.getOpenerEventChannel();
										// 通过事件通道，向上一个页面传递数据
										if (eventChannel && eventChannel.emit) {
											eventChannel.emit('selectUser', {
												user: user
											});
										}
										// 返回上一页
										uni.navigateBack();
									}, 1000);
									
								}
							}).catch(err => {
								uni.showToast({
									title: '修改失败',
									icon: 'none'
								});
							});
						}
					}
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
			
			// 加载用户列表
			loadUserList(){
				let that = this;
				uni.showLoading({
					title: '加载中...'
				});
				
				getStoreUsers(this.queryParam).then(res => {
					if (res.success) {
						if (res.voList != null) {
							// 如果是第一页，直接赋值
							if (that.queryParam.pageNo === 1) {
								that.userList = res.voList;
							} else {
								// 加载更多，追加数据
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
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '网络异常，请重试',
						icon: 'none'
					});
				});
			},
			
			loadMore() {
				console.log('触发翻页', this.userList.length, this.totalUserCount);
				if (this.userList.length >= this.totalUserCount) {
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none'
					});
					return false;
				}
				this.queryParam.pageNo++;
				this.loadUserList();
				return true;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	/* 搜索框样式 */
	.search-box {
		display: flex;
		padding: 24rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
		align-items: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.search-input-wrapper {
		flex: 1;
		background-color: #f5f7fa;
		border-radius: 36rpx;
		padding: 0 20rpx;
		margin-right: 20rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
	}
	
	.search-icon {
		margin: 0 10rpx;
	}

	.search-input {
		flex: 1;
		height: 72rpx;
	}

	::v-deep(.search-input .uni-input-input ){
		height: 72rpx;
		font-size: 28rpx !important;
	}

	.search-button {
		background-color: var(--themeColor, #2979ff);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		height: 72rpx;
		border-radius: 36rpx;
		font-weight: 500;
	}

	.search-button text {
		font-size: 28rpx;
	}
	
	/* 列表样式 */
	.c-999{
		color: #999;
	}

	.bg-f {
		background-color: #fff;
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

	.u-p-22 {
		padding: 11px!important;
	}

	.list_content .list_items  {
		border-bottom: 0.5px solid #eaeaea;
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

	.u-flex-1 {
		flex: 1!important;
	}

	.u-p-l-20 {
		padding-left: 10px!important;
	}

	.u-column-between {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.c-333 {
		color: #333;
	}

	.c-666 {
		color: #666;
	}

	.u-m-l-40 {
		margin-left: 20px!important;
	}

	.u-icon--right {
		flex-direction: row;
		align-items: center;
	}
	
	.list_content {
		padding-top: 0; 
		padding-bottom: 0; 
		background-color: #f5f5f5; 
	}
	
	.LBTL-noMag .u-empty {
		margin-top: 30vh !important;
	}

	.load-more-btn {
		display: inline-block;
		background: #2979ff;
		color: #fff;
		border-radius: 32rpx;
		padding: 0 48rpx;
		font-size: 28rpx;
		height: 64rpx;
		line-height: 64rpx;
		border: none;
		box-shadow: none;
		margin: 0 auto;
		min-width: 160rpx;
	}

	.load-more-btn:active {
		background: #1760d6;
	}
</style>