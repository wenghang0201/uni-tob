<template>
	<view class="staff-container">
		<!-- 顶部导航 -->
		<view class="header">
			<view class="back-icon" @click="goBack">
				<u-icon name="arrow-left" size="20"></u-icon>
			</view>
			<view class="title">员工账号</view>
			<view class="add-btn" @click="addStaff">添加</view>
		</view>
		
		<!-- 员工列表 -->
		<view class="staff-list">
			<view v-if="staffList.length > 0">
				<view class="staff-item" 
					v-for="(item, index) in staffList" 
					:key="index"
					@tap="goDetail(item)"
				>
					<view class="staff-info">
						<view class="staff-number">编号:{{item.id}}</view>
						<view class="staff-name">{{item.name || '未命名员工'}}</view>
					</view>
					<view class="staff-status">
						<text :class="{'active': item.status === 0}">
							{{item.status === 0 ? '正在接单' : '暂停接单'}}
						</text>
						<u-icon name="arrow-right" size="16" color="#999"></u-icon>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-else class="empty-state" @click="addStaff">
				<view class="add-icon">+</view>
				<view class="add-text">赶紧添加您的员工账号吧~</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="footer-info">
			<view class="info-item">
				<text class="label">注：</text>
			</view>
			<view class="info-item">
				<text class="label">1.您的店铺编号为：</text>
				<text class="value">{{shopInfo.shopId || '26'}}</text>
			</view>
			<!-- <view class="info-item">
				<text class="label">2.当前员工账号上限为</text>
				<text class="value">999</text>
				<text class="label">名。</text>
			</view> -->
		</view>
	</view>
</template>

<script>
import { getEmployeeList } from '@/api/employee.js'
import {
	getCurrentStoreInfo
} from "@/api/shop.js"

export default {
	data() {
		return {
			staffList: [],
			shopInfo: {
				shopId: ''
			},
			pageNo: 1,
			pageSize: 10,
			total: 0
		}
	},
	
	onShow() {
		// 每次页面显示时刷新数据
		this.getEmployeeList()
		
		// 获取店铺信息
		getCurrentStoreInfo().then(storeRes => {
			this.shopInfo.shopId = storeRes.id;
		})
	},
	
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		
		// 获取员工列表
		async getEmployeeList() {
			try {
				const res = await getEmployeeList({
					pageNo: this.pageNo,
					pageSize: this.pageSize
				})
				if(res.success) {
					this.staffList = (res.voList || []).map((item, index) => {
						return {
							id: item.id,
							userId: item.userId,
							number: index + 1,
							name: item.name,
							status: item.startOrderPermission === 1 ? 0 : 1, // 0-正在接单 1-暂停接单
							permissions: {
								startOrderPermission: item.startOrderPermission === 1,
								viewAlipayPermission: item.viewAlipayPermission === 1,
								viewPhonePermission: item.viewPhonePermission === 1,
								viewDispatchPermission: item.viewDispatchPermission === 1,
								manualFundPermission: item.manualFundPermission === 1,
								viewOrdersPermission: item.viewOrdersPermission === 1,
								awardManagePermission: item.awardManagePermission === 1,
								viewAllUserPermission:item.viewAllUserPermission===1
							},
							loginAccount: item.loginAccount
						}
					})
					this.total = res.total || 0
				}
			} catch(e) {
				uni.showToast({
					title: '获取员工列表失败',
					icon: 'none'
				})
			}
		},
		
		// 跳转到员工详情
		goDetail(staff) {
			if(!staff || !staff.id) return;
			
			// 将员工信息和权限信息编码后传递
			const staffInfo = encodeURIComponent(JSON.stringify({
				id: staff.id,
				name: staff.name,
				number: staff.number,
				account: staff.loginAccount
			}));
			const permissions = encodeURIComponent(JSON.stringify(staff.permissions));
			
			uni.navigateTo({
				url: `/pages/staff/detail?id=${staff.id}&userId=${staff.userId}&staffInfo=${staffInfo}&permissions=${permissions}`,
				fail: (err) => {
					console.error('导航失败：', err);
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 添加员工
		addStaff() {
			uni.navigateTo({
				url: '/pages/staff/add'
			})
		},
		
		// 更新员工状态
		async updateStatus(staff) {
			try {
				const newStatus = staff.status === 0 ? 1 : 0
				const res = await updateStaffStatus({
					id: staff.id,
					status: newStatus
				})
				
				if(res.success) {
					uni.showToast({
						title: '状态更新成功',
						icon: 'success'
					})
					this.getEmployeeList()
				}
			} catch(e) {
				uni.showToast({
					title: '状态更新失败',
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.staff-container {
	min-height: 100vh;
	background: #f5f5f5;
	
	.header {
		display: flex;
		align-items: center;
		height: 44px;
		background: #fff;
		padding: 0 15px;
		position: relative;
		
		.back-icon {
			padding: 10px;
			margin-left: -10px;
		}
		
		.title {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 17px;
			font-weight: 500;
		}

		.add-btn {
			position: absolute;
			right: 15px;
			color: #2979ff;
			font-size: 14px;
		}
	}
	
	.staff-list {
		margin-top: 10px;
		background: #fff;
		
		.staff-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px;
			border-bottom: 1px solid #eee;
			
			.staff-info {
				display: flex;
				flex-direction: column;
				
				.staff-number {
					font-size: 14px;
					color: #999;
					margin-bottom: 3px;
				}
				
				.staff-name {
					font-size: 16px;
					color: #333;
					font-weight: 500;
				}
			}
			
			.staff-status {
				display: flex;
				align-items: center;
				gap: 5px;
				
				text {
					font-size: 14px;
					color: #999;
					
					&.active {
						color: #2979ff;
					}
				}
			}
		}
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 50px 0;
			
			.add-icon {
				font-size: 30px;
				color: #999;
				margin-bottom: 10px;
			}
			
			.add-text {
				color: #999;
				font-size: 14px;
			}
		}
	}
	
	.footer-info {
		margin-top: 20px;
		padding: 15px;
		
		.info-item {
			font-size: 14px;
			color: #999;
			margin-bottom: 5px;
			
			.label {
				color: #999;
			}
			
			.value {
				color: #666;
			}
		}
	}
}
</style> 