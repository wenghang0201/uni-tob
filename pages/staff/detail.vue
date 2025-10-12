<template>
	<view class="staff-detail">
		<nav-bar :title="'员工信息'" :back="true"></nav-bar>
		
		<!-- 基本信息 -->
		<view class="info-section">
			<view class="section-title">基本信息</view>
			<view class="info-item">
				<text class="label">员工编号</text>
				<text class="value">{{staffInfo.id || '-'}}</text>
			</view>
			<view class="info-item">
				<text class="label">员工姓名</text>
				<text class="value">{{staffInfo.name || '-'}}</text>
			</view>
			<view class="info-item">
				<text class="label">手机号</text>
				<text class="value">{{staffInfo.phone || '-'}}</text>
			</view>
			<view class="info-item">
				<text class="label">账号</text>
				<text class="value">{{staffInfo.account || staffInfo.phone || '-'}}</text>
			</view>
		</view>

		<!-- 权限设置 -->
		<view class="permission-section">
			<view class="section-header">
				<u-icon name="lock" size="20"></u-icon>
				<text>员工权限</text>
			</view>
			
			<view class="permission-item">
				<view class="item-left">
					<text class="label">开始接单</text>
					<text class="desc">开启后允许员工接单出票</text>
				</view>
				<u-switch v-model="permissions.canTakeOrder" @change="updatePermission('canTakeOrder')"></u-switch>
			</view>

			<!-- <view class="permission-item">
				<view class="item-left">
					<text class="label">用户支付宝账号</text>
					<text class="desc">开启后允许员工查看用户支付宝账号</text>
				</view>
				<u-switch v-model="permissions.canViewAlipay" @change="updatePermission('canViewAlipay')"></u-switch>
			</view> -->

			<!-- <view class="permission-item">
				<view class="item-left">
					<text class="label">派单店铺信息</text>
					<text class="desc">开启后允许该员工查看派单店铺信息</text>
				</view>
				<u-switch v-model="permissions.canViewShop" @change="updatePermission('canViewShop')"></u-switch>
			</view> -->

			<view class="permission-item">
				<view class="item-left">
					<text class="label">加款扣款</text>
					<text class="desc">开启后允许该员工给用户手工加款和扣款</text>
				</view>
				<u-switch v-model="permissions.canManageMoney" @change="updatePermission('canManageMoney')"></u-switch>
			</view>

			<!-- <view class="permission-item">
				<view class="item-left">
					<text class="label">查看订单与余额</text>
					<text class="desc">开启后可查看店铺所有订单信息和用户余额</text>
				</view>
				<u-switch v-model="permissions.canViewOrders" @change="updatePermission('canViewOrders')"></u-switch>
			</view> -->

			<view class="permission-item">
				<view class="item-left">
					<text class="label">派奖管理</text>
					<text class="desc">开启后可派奖店铺所有中奖订单</text>
				</view>
				<u-switch v-model="permissions.canManageAward" @change="updatePermission('canManageAward')"></u-switch>
			</view>

			<view class="permission-item">
				<view class="item-left">
					<text class="label">用户手机号</text>
					<text class="desc">开启后允许该员工查看用户手机号</text>
				</view>
				<u-switch v-model="permissions.viewPhonePermission" @change="updatePermission('viewPhonePermission')"></u-switch>
			</view>

			<view class="permission-item">
				<view class="item-left">
					<text class="label">查看所有用戶</text>
					<text class="desc">开启后可查看店铺所有用戶</text>
				</view>
				<u-switch v-model="permissions.viewAllUserPermission" @change="updatePermission('viewAllUserPermission')"></u-switch>
			</view>
		</view>

		<!-- 彩种配置 -->
		<view class="lottery-section">
			<view class="section-header">
				<u-icon name="setting" size="20"></u-icon>
				<text>彩种配置</text>
				<view class="go-setting" @click="goLotterySetting">
					<text>去设置</text>
					<u-icon name="arrow-right" size="16"></u-icon>
				</view>
			</view>
		</view>

		<!-- 安全设置 -->
		<view class="security-section info-section">
			<view class="section-header">
				<u-icon name="fingerprint" size="20"></u-icon>
				<text>安全设置</text>
			</view>
			<view class="info-item" @click="unlockAccountLimit">
				<text class="label">解除账号冻结</text>
				<view class="go-setting">
					<u-icon name="arrow-right" size="16"></u-icon>
				</view>
			</view>
			<view class="info-item" @click="openChangePasswordModal">
				<text class="label">修改登录密码</text>
				<view class="go-setting">
					<u-icon name="arrow-right" size="16"></u-icon>
				</view>
			</view>
			<view class="info-item" @click="openChangeAccountModal">
				<text class="label">修改登录账号</text>
				<view class="go-setting">
					<u-icon name="arrow-right" size="16"></u-icon>
				</view>
			</view>
		</view>

		<!-- 修改密码弹窗 -->
		<u-modal :show="showChangePasswordModal" title="修改登录密码" :show-cancel-button="true" @confirm="handleChangePassword" @cancel="closeChangePasswordModal">
			<view class="modal-content">
				<!-- <text>弹窗测试内容</text> --> <!-- 暂时简化内容 -->
				
				<view class="input-item">
					<text class="input-label">新密码:</text>
					<u-input type="password" v-model="passwordForm.password" placeholder="请输入新密码"></u-input>
				</view>
				
				<view class="input-item">
					<text class="input-label">确认新密码:</text>
					<u-input type="password" v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码"></u-input>
				</view>
				
			</view>
		</u-modal>

		<!-- 修改账号弹窗 -->
		<u-modal :show="showChangeAccountModal" title="修改登录账号" :show-cancel-button="true" @confirm="handleChangeAccount" @cancel="closeChangeAccountModal">
			<view class="modal-content">
				<view class="input-item">
					<text class="input-label">新账号:</text>
					<u-input v-model="accountForm.loginAccount" placeholder="请输入新登录账号" maxlength="18"></u-input>
				</view>
			</view>
		</u-modal>

		<!-- 删除按钮 -->
		<view class="delete-btn" @click="deleteStaff">
			<text>删除</text>
		</view>
	</view>
</template>

<script>
import { updateEmployee, deleteEmployee, updateEmployeePermission, updateEmployeePassword, updateEmployeeAccount,unlockEmployeeAccount } from '@/api/employee.js'
import { getStoreUserDetail } from '@/api/user.js'

export default {
	data() {
		return {
			staffId: '',
			userId: '',
			staffInfo: {
				id: '',
				name: '',
				phone: ''
			},
			// UI权限开关绑定的数据，从API数据转换而来
			permissions: {
				canTakeOrder: false,
				canViewAlipay: false,
				canViewShop: false, 
				canManageMoney: false,
				canViewOrders: false,
				canManageAward: false,
				viewPhonePermission: false,
				viewAllUserPermission: false,
			},
			// API权限字段与UI开关的映射关系
			permissionMapping: {
				startOrderPermission: 'canTakeOrder',
				viewAlipayPermission: 'canViewAlipay',
				viewDispatchPermission: 'canViewShop',
				manualFundPermission: 'canManageMoney',
				viewOrdersPermission: 'canViewOrders',
				awardManagePermission: 'canManageAward',
				viewPhonePermission: 'viewPhonePermission',
				viewAllUserPermission: 'viewAllUserPermission',
			},
			showChangePasswordModal: false,
			passwordForm: {
				password: '',
				confirmPassword: ''
			},
			showChangeAccountModal: false,
			accountForm: {
				loginAccount: ''
			}
		}
	},

	onLoad(options) {
		if (options.id && options.userId) {
			this.staffId = options.id;
			this.userId = options.userId;
			// 处理页面传递的员工权限数据
			if (options.permissions) {
				try {
					// 将API格式的权限数据转换为UI开关需要的格式
					const apiPermissions = JSON.parse(decodeURIComponent(options.permissions));
					
					// 初始化UI权限开关状态
					for (const apiKey in this.permissionMapping) {
						const uiKey = this.permissionMapping[apiKey];
						this.permissions[uiKey] = apiPermissions[apiKey] || false;
					}
				} catch (e) {
					console.error('解析权限数据出错', e);
				}
			}
			// 处理页面传递的员工信息
			if (options.staffInfo) {
				try {
					this.staffInfo = JSON.parse(decodeURIComponent(options.staffInfo));
				} catch (e) {
					console.error('解析员工信息出错', e);
				}
			}

			// 获取员工详细信息（包括手机号）
			this.fetchStaffDetail();
		}
	},

	methods: {
		goBack() {
			uni.navigateBack();
		},

		// 获取员工详细信息
		async fetchStaffDetail() {
			try {
				const res = await getStoreUserDetail(this.userId);
				console.log('获取员工详细信息:', res);

				if (res) {
					// 更新员工信息，包括手机号
					this.staffInfo = {
						...this.staffInfo,
						phone: res.phone,
					}
					console.log('员工手机号:', this.staffInfo.phone);
				}
			} catch (e) {
				console.error('获取员工详细信息失败:', e);
			}
		},

		// 更新权限设置
		async updatePermission(uiKey) {
			// 找到对应的API参数名
			const apiKey = Object.keys(this.permissionMapping).find(key => 
				this.permissionMapping[key] === uiKey
			);
			
			if (!apiKey) {
				console.error('未找到对应的权限键名');
				return;
			}
			
			try {
				// 准备所有权限数据
				const permissionData = {
					userId: this.userId
				};
				
				// 将所有UI权限转换为API权限值
				for (const apiPermKey in this.permissionMapping) {
					const uiPermKey = this.permissionMapping[apiPermKey];
					permissionData[apiPermKey] = this.permissions[uiPermKey] ? 1 : 0;
				}
				
				uni.showLoading({
					title: '更新中...'
				});
				
				console.log('更新权限参数:', permissionData);
				const res = await updateEmployeePermission(permissionData);
				
				uni.hideLoading();
				
				if (res.success) {
					uni.showToast({
						title: '权限更新成功',
						icon: 'success'
					});

					// 权限更新成功后，同步更新URL参数中的权限数据
					this.updateUrlPermissions();
				} else {
					uni.showToast({
						title: res.errorMsg || '权限更新失败',
						icon: 'none'
					});
					// 还原开关状态
					this.permissions[uiKey] = !this.permissions[uiKey];
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: '权限更新失败',
					icon: 'none'
				});
				// 还原开关状态
				this.permissions[uiKey] = !this.permissions[uiKey];
			}
		},

		// 更新URL参数中的权限数据，确保刷新页面后使用最新数据
		updateUrlPermissions() {
			try {
				// 将当前UI权限状态转换为API格式
				const apiPermissions = {};
				for (const apiKey in this.permissionMapping) {
					const uiKey = this.permissionMapping[apiKey];
					apiPermissions[apiKey] = this.permissions[uiKey];
				}

				// 编码权限数据
				const permissions = encodeURIComponent(JSON.stringify(apiPermissions));
				const staffInfo = encodeURIComponent(JSON.stringify(this.staffInfo));

				// 构建新的URL
				const newUrl = `/pages/staff/detail?id=${this.staffId}&userId=${this.userId}&staffInfo=${staffInfo}&permissions=${permissions}`;

				// 使用 redirectTo 替换当前页面，更新URL参数
				uni.redirectTo({
					url: newUrl,
					fail: (err) => {
						console.error('更新URL参数失败:', err);
					}
				});
			} catch (e) {
				console.error('更新URL权限参数出错:', e);
			}
		},

		goLotterySetting() {
			uni.navigateTo({
				url: `/pages/staff/lottery-config?id=${this.staffId}&userId=${this.userId}`
			});
		},
		//解除冻结
		async unlockAccountLimit(){
			uni.showLoading({ title: '提交中...' });
			try {
				const params = {
					id: parseInt(this.staffInfo.id), // 确保使用 staffInfo.id
				};
				const res = await unlockEmployeeAccount(params);
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '解锁账号成功', icon: 'success' });
				} else {
					uni.showToast({ title: res.errorMsg || '解锁账号失败', icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				uni.showToast({ title: '请求失败，请稍后再试', icon: 'none' });
				console.error('解锁账号失败:', error);
			}
		},
		// 打开修改密码弹窗
		openChangePasswordModal() {
			console.log('[DEBUG] openChangePasswordModal called. Current showChangePasswordModal before change:', this.showChangePasswordModal);
			this.passwordForm.password = '';
			this.passwordForm.confirmPassword = '';
			this.showChangePasswordModal = true;
			console.log('[DEBUG] showChangePasswordModal after change:', this.showChangePasswordModal);
		},

		// 关闭修改密码弹窗
		closeChangePasswordModal() {
			this.showChangePasswordModal = false;
		},

		// 打开修改账号弹窗
		openChangeAccountModal() {
			this.accountForm.loginAccount = '';
			this.showChangeAccountModal = true;
		},

		// 关闭修改账号弹窗
		closeChangeAccountModal() {
			this.showChangeAccountModal = false;
		},

		// 处理修改密码逻辑 (手动校验)
		async handleChangePassword() {
			// 手动校验
			if (!this.passwordForm.password) {
				uni.showToast({ title: '请输入新密码', icon: 'none' });
				return;
			}
			if (this.passwordForm.password.length < 6) {
				uni.showToast({ title: '新密码长度不能少于6位', icon: 'none' });
				return;
			}
			if (!this.passwordForm.confirmPassword) {
				uni.showToast({ title: '请再次输入新密码', icon: 'none' });
				return;
			}
			if (this.passwordForm.password !== this.passwordForm.confirmPassword) {
				uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
				return;
			}

			// 校验通过，执行API调用
			uni.showLoading({ title: '提交中...' });
			try {
				const params = {
					id: parseInt(this.staffInfo.id),
					password: this.passwordForm.password
				};
				const res = await updateEmployeePassword(params);
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '密码修改成功', icon: 'success' });
					this.showChangePasswordModal = false; 
				} else {
					uni.showToast({ title: res.errorMsg || '密码修改失败', icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				uni.showToast({ title: '请求失败，请稍后再试', icon: 'none' });
				console.error('修改密码失败:', error);
			}
		},

		// 处理修改账号逻辑
		async handleChangeAccount() {
			if (!this.accountForm.loginAccount) {
				uni.showToast({ title: '请输入新登录账号', icon: 'none' });
				return;
			}
			// 可以在这里添加更复杂的账号格式校验

			uni.showLoading({ title: '提交中...' });
			try {
				const params = {
					id: parseInt(this.staffInfo.id), // 确保使用 staffInfo.id
					loginAccount: this.accountForm.loginAccount
				};
				const res = await updateEmployeeAccount(params);
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '登录账号修改成功', icon: 'success' });
					this.showChangeAccountModal = false;
					this.staffInfo.account = this.accountForm.loginAccount;
				} else {
					uni.showToast({ title: res.errorMsg || '登录账号修改失败', icon: 'none' });
				}
			} catch (error) {
				uni.hideLoading();
				uni.showToast({ title: '请求失败，请稍后再试', icon: 'none' });
				console.error('修改登录账号失败:', error);
			}
		},

		// 删除员工
		deleteStaff() {
			uni.showModal({
				title: '提示',
				content: '确定要删除该员工吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							const result = await deleteEmployee({
								userId: this.userId
							});
							
							if (result.success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							} else {
								uni.showToast({
									title: result.errorMsg || '删除失败',
									icon: 'none'
								});
							}
						} catch (e) {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							});
						}
					}
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.staff-detail {
	min-height: 100vh;
	background: #f5f5f5;
	// padding-top: 44px; /* 添加顶部padding，防止被navbar遮挡 */
	
	.info-section, .permission-section, .lottery-section, .security-section {
		margin-top: 10px;
		background: #fff;
		padding: 15px;

		.section-header {
			display: flex;
			align-items: center;
			margin-bottom: 15px;
			
			text {
				margin-left: 5px;
				font-size: 16px;
				font-weight: 500;
			}

			.go-setting {
				margin-left: auto;
				display: flex;
				align-items: center;
				color: #999;
				font-size: 14px;
			}
		}
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
		
		.label {
			color: #333;
			font-size: 14px;
		}
		
		.value {
			color: #666;
			font-size: 14px;
		}
	}

	.permission-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		border-bottom: 1px solid #eee;

		.item-left {
			.label {
				font-size: 14px;
				color: #333;
				margin-bottom: 5px;
			}

			.desc {
				font-size: 12px;
				color: #999;
			}
		}
	}

	.delete-btn {
		margin: 20px 15px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ff3b30;
		border-radius: 4px;
		color: #fff;
		font-size: 16px;
	}

	.modal-content {
		padding: 15px 15px 0;
	}

	.input-item {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		// 为 u-input 添加样式，确保其在弹窗中正确显示
		::v-deep(.u-input ){
			flex: 1;
		}
	}

	.input-label {
		width: 100px; // 根据需要调整标签宽度
		margin-right: 10px;
		font-size: 14px;
	}
}
</style> 