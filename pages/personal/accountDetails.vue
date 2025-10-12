<template>
	<view class="box">
		<nav-bar title="账户明细" :back="true"></nav-bar>
		<view class="content">
			<!-- 选项卡 -->
			<view class="tabs">
				<view v-for="(tab, index) in tabs" :key="index"
					:class="['tab-item', currentTab === index ? 'active' : '']" @click="switchTab(index)">
					{{ tab.name }}
				</view>
			</view>

			<!-- 账单列表 -->
			<view class="bill-list">
				<view class="bill-item" v-for="(item, index) in mockBillList" :key="index">
					<view class="left">
						<view class="name">{{item.typeName}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>
					<view class="right">
						<view class="amount" :class="{ 'negative': item.amount <= 0, 'positive': item.amount > 0 }">
							{{item.amount > 0 ? '+' : ''}}{{item.amount}}
						</view>
						<view class="balance">余额：{{item.balance}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import getPayOrderList from "@/api/lotteryOrder.js"
import getOmitByType from "@/api/omit.js"
import adminBallList from "@/api/ballgame.js"
import {
	getAuthtoken
} from "@/util/auth.js"

export default {
	data() {
		return {
			//查询条件
			queryParam: {
				pageNo: 1,
				pageSize: 10,
				payType: "",
				sortField: "",
				sortRules: "",
				state: "",
				type: ""
			},
			isShow: false,
			currentTab: 0, // 当前选中的选项卡
			tabs: [
				{ name: '全部', type: 'all' },
				{ name: '收入', type: 'income' },
				{ name: '支出', type: 'expense' }
			],
			billList: [], // 账单列表
			// 模拟数据
			mockBillList: [
				{
					typeName: '投注返奖',
					amount: 1000,
					balance: 2000,
					createTime: '2024-01-20 15:30:45'
				},
				{
					typeName: '购买彩票',
					amount: -500,
					balance: 1500,
					createTime: '2024-01-20 14:20:30'
				}
			]
		}
	},
	onLoad() {
		this.loadBillList()
	},
	methods: {
		// 切换选项卡
		switchTab(index) {
			this.currentTab = index
			this.queryParam.type = this.tabs[index].type
			this.loadBillList()
		},
		// 加载账单列表
		loadBillList() {
			getPayOrderList(this.queryParam).then(res => {
				if (res.success) {
					this.billList = res.data || []
				}
			})
		}
	}
}
</script>

<style lang="scss">
.tabs {
	display: flex;
	background-color: #fff;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;

	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666;
		position: relative;

		&.active {
			color: #007AFF;
			font-weight: bold;

			&::after {
				content: '';
				position: absolute;
				bottom: -20rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 4rpx;
				background-color: #007AFF;
			}
		}
	}
}

.bill-list {
	padding: 20rpx;
	
	.bill-item {
		background-color: #fff;
		padding: 24rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.left {
			.name {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
				margin-bottom: 8rpx;
			}
			
			.time {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.right {
			text-align: right;
			
			.amount {
				font-size: 28rpx;
				margin-bottom: 8rpx;
				
				&.positive {
					color: #07c160;
				}
				
				&.negative {
					color: #ff4d4f;
				}
			}
			
			.balance {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style>