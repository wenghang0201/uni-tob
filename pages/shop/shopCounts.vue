<template>
	<!-- 店铺余额明细列表 -->
	<view class="box">
		
		<nav-bar :title="'店铺明细'" :back="true"></nav-bar>
		
		<!-- 筛选条件区域 -->
		<view class="filter-section">
			<view class="filter-tabs">
				<view 
					v-for="(item, index) in filterTabs" 
					:key="index"
					class="filter-tab"
					:class="{ 'active': currentFilter === item.value }"
					@click="changeFilter(item.value)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>

		<view>
			<u-empty icon="/static/nodata.png" :show="logList.length<=0" mode="list"
				text="没有明细记录"></u-empty>
				
			<uni-card v-for="(item,index) in logList" :key="index" :border="false"
				:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
				>
				
				<!-- 使用 Flexbox 优化布局 -->
				<view class="card-content">
					<!-- 左侧信息 -->
					<view class="info-left">
						<span>{{ item.changeTypeStr }}</span> 
						<br>
						<span>{{item.createTime}}</span>
					</view>
					<!-- 右侧金额和余额 -->
					<view class="info-right" :style="{ color: item.diffValue >= 0 ? 'blue' : 'red' }">
						<span>￥{{ formatPrice(item.diffValue) }}</span>
						<!-- 显示变化后余额 -->
						<template v-if="item.afterValue != null">
							<br> <!-- 换行 -->
							<span class="balance-info">余额: {{ item.afterValue | formatBalance }}</span> 
						</template>
					</view>
				</view>
				
			</uni-card>
		</view>
	</view>
</template>

<script>
	import {
		getShopGoldChangeLogPage // 引入新的 API 函数
	} from '@/api/shop.js' // 确保路径正确

	export default {
		data() {
			return {
				// 筛选相关
				currentFilter: 'all', // 当前选中的筛选条件
				filterTabs: [
					{ name: '全部', value: 'all' },
					{ name: '出票', value: 'ticket' },
					{ name: '充值', value: 'recharge' },
					{ name: '提现', value: 'withdraw' },
					{ name: '跟单佣金', value: 'commission' }
				],
				//查询条件
				queryParam: {
					pageNo: 1,
					pageSize: 10,
					typeList: [] // 添加筛选类型参数，使用数组
				},
				total: 0,
				//明细记录列表
				logList: []
			}
		},
		onPullDownRefresh() {
			this.queryParam.pageNo = 1; // 重置页码
			this.logList = []; // 清空列表
			this.init();
			setTimeout(function() {
				uni.stopPullDownRefresh()
			}, 500);
		},
		filters: {
			//格式化日期
			formatDate(data, that) {
				return data
				// 假设 globalUtil 存在
				// return that.globalUtil.dateTimeFormat(data)
			},
			// 添加格式化余额的过滤器
			formatBalance(value) {
				const num = parseFloat(value);
				return isNaN(num) ? '--' : num.toFixed(2);
			}
		},
		onLoad(option) {
			// 可以根据需要处理传入的参数，例如 shopId
			this.init();
		},
		//滚动到底部进行分页事件
		onReachBottom() {
			// 使用 total 判断是否还有更多数据
			if (this.logList.length >= this.total) {
				uni.showToast({ title: '没有更多数据了', icon: 'none' });
				return;
			}
			this.queryParam.pageNo++;
			this.init();
		},
		methods: {
			// 切换筛选条件
			changeFilter(filterValue) {
				this.currentFilter = filterValue;
				this.queryParam.pageNo = 1; // 重置页码
				this.logList = []; // 清空列表
				
				// 根据筛选条件设置查询参数
				switch (filterValue) {
					case 'all':
						this.queryParam.typeList = []; // 空数组表示查询全部
						break;
					case 'ticket':
						this.queryParam.typeList = ['TICKET_ISSUANCE_FEE'].join(',');
						break;
					case 'recharge':
						this.queryParam.typeList = [
							'RECHARGE',
							'BALANCE_SYS_ADD',
						].join(',');
						break;
					case 'withdraw':
						this.queryParam.typeList = [
							'WITHDRAWAL',
							'BALANCE_SYS_SUB',
							'BALANCE_DECREASE',
						].join(',');
						break;
					case 'commission':
						this.queryParam.typeList = [
							'COMMISSION_PAYMENT_FOR_SYSTEM',
							'COMMISSION_PAYMENT_FOR_STORE',
							'COMMISSION_PAYMENT_FOR_AGENT',
							'COMMISSION_PAYMENT_FOR_PUBLISHER',
						].join(',');
						break;
					default:
						this.queryParam.typeList = [];
				}
				console.log("queryParam",this.queryParam)
				this.init();
			},
			
			// 添加格式化价格显示的方法 (复用 counts.vue 的逻辑)
			formatPrice(price) {
				const num = parseFloat(price) || 0;
				const fixedPrice = num.toFixed(2);
				// 根据 diffValue 判断正负
				return num >= 0 ? `+${fixedPrice}` : fixedPrice;
			},
			
			//初始化事件
			init() {
				uni.showLoading();
				console.log("queryParam", this.queryParam);
				getShopGoldChangeLogPage(this.queryParam).then(res => {
					if (res.success) {
						this.total = res.total;
						
						const newList = res.voList || [];
						
						// 更新列表数据
						if (this.queryParam.pageNo === 1) {
							this.logList = newList;
						} else {
							this.logList = [...this.logList, ...newList];
						}

					} else {
						uni.showToast({
							title: res.errorMsg || '加载失败',
							icon: 'none'
						});
						this.logList = []; // 清空防止显示旧数据
						this.total = 0;
					}
					uni.hideLoading();
				}).catch(err => {
					console.error("获取店铺余额明细失败:", err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	// 复用 counts.vue 的样式，可以根据需要调整
	::v-deep(.uni-card__header-extra-text ){
		font-size: 14px !important;
		color: #FF3F43 !important;
	}

	.uni-body {
		color: #909399;
	}

	::v-deep(.u-empty ){
		margin-top: 40% !important; // 调整间距
	}

	::v-deep(.uni-datetime-picker--btn,)
	::v-deep(.uni-calendar-item--after-checked,)
	::v-deep(.uni-calendar-item--before-checked ){
		background: #FF3F43 !important;
	}
	
	// 筛选区域样式
	.filter-section {
		background: #ffffff;
		padding: 20upx 30upx;
		border-bottom: 1px solid #f0f0f0;
		
		.filter-tabs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.filter-tab {
				flex: 1;
				text-align: center;
				padding: 15upx 10upx;
				font-size: 28upx;
				color: #666;
				border-radius: 8upx;
				transition: all 0.3s ease;
				margin: 0 5upx;
				
				&.active {
					background: #007AFF;
					color: #ffffff;
					font-weight: bold;
				}
				
				&:active {
					transform: scale(0.95);
				}
			}
		}
	}
	
	// Flexbox 布局样式 (复用 counts.vue)
	.card-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start; 
		padding: 10upx 0; 
	}

	.info-left {
		line-height: 1.5; // 调整行高
		font-size: 26rpx; // 调整字体大小
		color: #666;
		span:first-child {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}
	}

	.info-right {
		text-align: right; 
		line-height: 1.5; // 调整行高
		font-size: 28rpx; // 调整字体大小
		font-weight: 500;
	}

	.balance-info {
		font-size: 24rpx; 
		color: #909399; 
	}
	.box{
		padding-bottom: 20px;
	}
</style> 