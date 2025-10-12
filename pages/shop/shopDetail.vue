<template>
	<view class="box">
		<nav-bar :title="'店铺设置'" :back="true"></nav-bar>
		
		<!-- 店铺基本信息 -->
		<view class="shop-info">
			<image :src="shop.logo" class="shop-logo"></image>
			<view class="shop-detail">
				<view class="shop-name">{{shop.name}}</view>
				<view class="shop-status" :class="{'shop-closed': shop.line == 1}">
					{{shop.line == 0 ? '营业中' : '停业'}}
				</view>
				<view class="shop-time" v-if="shop.createTime">
					绑定时间：{{shop.createTime}}
				</view>
			</view>
		</view>

		<!-- 店铺操作按钮 -->
		<!-- <view class="shop-actions">
			<view class="action-buttons">
				<u-button 
					v-if="shop.line == 1" 
					type="success" 
					size="default" 
					@click="updateShop(0)"
				>开启</u-button>
				<u-button 
					v-if="shop.line == 0" 
					type="warning" 
					size="default" 
					@click="updateShop(1)"
				>关店</u-button>
			</view>
		</view> -->

		<!-- 店铺设置表单 -->
		<view class="settings-form">
			<!-- 扣款比例设置 -->
			<view class="form-section">
				<view class="section-title">基础设置</view>
				<u-form :model="fone" ref="uForm">
					<u-form-item label="店铺扣款比例" label-width="200">
						<text class="shop-rate-text">{{ shop.shopRate }}%</text>
					</u-form-item>
				</u-form>
			</view>

			<!-- 游戏设置 -->
			<view class="form-section">
				<view class="section-title">游戏设置</view>
				<u-form :model="fthree" ref="uForm">
					<u-form-item 
						v-for="(item,index) in shop.ballGames" 
						:key="index" 
						:label="item.name" 
						label-width="200"
					>
						<u-switch 
							slot="right" 
							v-model="item.line" 
							@change="updateGame(item)"
						></u-switch>
					</u-form-item>
				</u-form>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		shopDetail,
		updateShopLine,
		editShopRate,
		updateLine
	} from '@/api/shop.js'
	export default {
		data() {
			return {
				fone: {},
				fthree:{},
				that:this,
				shop:{},
				//查询条件
				queryParam: {
					id:0
				}
			};
		},
		filters: {
			//格式化日期
			formatDate(data, that) {
				return data
				// return that.globalUtil.dateTimeFormat(data)
			},
		},
		onLoad(e) {
			if(e.shopId){
				this.queryParam.id = e.shopId
				this.init()
			}else{
				uni.showToast({
					title:"请选择店铺",
					icon:'none'
				})
				return false;
			}

		},
		methods: {
			updateGame(item) {
				uni.showLoading();
				let line = 0;
				if(item.line == false){line = 1}
				updateLine({"id":item.id,"line":line,"tenantId":item.tenantId}).then(res=>{
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
			updateShop(line){
				let th = this
				uni.showModal({
				    title: '店铺',
				    content: "确认操作么",
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading();
				            updateShopLine({"id":th.shop.id,"line":line}).then(res => {
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
			init(){
				shopDetail(this.queryParam).then(res => {
					if(res.success){
						this.shop = res
						let arr = res.ballGames
						this.shop.ballGames.forEach((item,index)=>{
							if(item.line == "0"){
								item.line = true
								return false
							}
							if(item.line == "1"){
								item.line = false
								return false
							}
						})
					}
				})
			},

			goZhmx(item){
				uni.navigateTo({
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
					url: "/pages/order/lotteryOrder?uid=" + item.id
				});
			},
			goXstj(item){
				uni.navigateTo({
					url: "/pages/proxy/invitation?uid=" + item.id
				});
			},
			goDpyj(item){
				uni.navigateTo({
					url: "/pages/counts/statisticsMain?uid=" + item.id
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

<style lang="scss" scoped>
.box {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 100rpx;
}

.shop-info {
	background-color: #fff;
	padding: 30rpx;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;

	.shop-logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 16rpx;
		margin-right: 30rpx;
	}

	.shop-detail {
		flex: 1;

		.shop-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
		}

		.shop-status {
			font-size: 28rpx;
			color: #19be6b;
			margin-bottom: 10rpx;

			&.shop-closed {
				color: #909399;
			}
		}

		.shop-time {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.shop-actions {
	background-color: #fff;
	margin-bottom: 20rpx;

	.action-buttons {
		display: flex;
		justify-content: center;
		gap: 20rpx;
	}
}

.settings-form {
	background-color: #fff;

	.form-section {
		padding: 30rpx;
		border-bottom: 1px solid #eee;

		&:last-child {
			border-bottom: none;
		}

		.section-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
	}
}

:deep(.u-form-item) {
	margin-bottom: 20rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
}

:deep(.u-input) {
	background-color: #f5f5f5;
}

.shop-rate-text {
	color: #606266;
	font-size: 28rpx;
	padding: 0 26rpx;
	line-height: 1.4;
	display: inline-block;
	width: 100%;
	box-sizing: border-box;
	text-align: right;
}
</style>
