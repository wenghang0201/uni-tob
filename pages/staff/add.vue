<template>
	<view class="add-staff">
		<nav-bar :title="'添加员工'" :back="true"></nav-bar>
		
		<view class="form-container">
			<u-form :model="form" ref="uForm" label-width="150">
				<u-form-item label="员工姓名" prop="name">
					<u-input v-model="form.name" placeholder="请输入员工姓名" />
				</u-form-item>
				
				<u-form-item label="手机号" prop="phoneNumber">
					<u-input v-model="form.phoneNumber" placeholder="请输入员工手机号" />
				</u-form-item>
				
				<u-form-item label="账号" prop="loginAccount">
					<u-input v-model="form.loginAccount" placeholder="请输入员工账号" />
				</u-form-item>
				
				<u-form-item label="密码" prop="password">
					<u-input v-model="form.password" type="password" placeholder="请输入密码" />
				</u-form-item>
				
				<u-form-item label="确认密码" prop="confirmPassword">
					<u-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
				</u-form-item>
			</u-form>
			
			<view class="form-tips">
				<text>提示：</text>
				<text>1. 请设置6位以上的密码</text>
				<text>2. 员工账号信息请妥善保管, 该账号用于登录</text>
			</view>
			
			<view class="submit-btn" @click="submitForm">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script>
import { addEmployee } from '@/api/employee.js'

export default {
	data() {
		return {
			form: {
				name: '',
				phoneNumber: '',
				password: '',
				confirmPassword: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入员工姓名', trigger: 'blur' }
				],
				phoneNumber: [
					{ required: true, message: '请输入手机号码' }
				],
				loginAccount: [
					{ required: true, message: '请输入账号', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							return value.length >= 6;
						},
						message: '密码长度不能少于6位',
						trigger: 'blur'
					}
				],
				confirmPassword: [
					{ required: true, message: '请再次输入密码', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							return value === this.form.password;
						},
						message: '两次输入密码不一致',
						trigger: 'blur'
					}
				]
			}
		}
	},
	
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	
	methods: {
		// 提交表单
		submitForm() {
			this.$refs.uForm.validate().then(valid => {
				if (valid) {
					this.saveEmployee();
				} else {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
				}
			}).catch(errors => {
				console.log('表单验证失败:', errors);
			});
		},
		
		// 保存员工信息
		async saveEmployee() {
			uni.showLoading({
				title: '保存中...'
			});
			
			try {
				const res = await addEmployee({
					name: this.form.name,
					phoneNumber: this.form.phoneNumber,
					loginAccount: this.form.loginAccount,
					password: this.form.password,
					confirmPassword: this.form.confirmPassword
				});
				
				uni.hideLoading();
				console.log('接口返回数据:', res);
				
				uni.showToast({
					title: '添加员工账号成功',
					icon: 'success'
				});
				
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			} catch (e) {
				console.error('请求异常:', e);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.add-staff {
	min-height: 100vh;
	background: #f5f5f5;
	padding-top: 44px; /* 添加顶部padding，防止被navbar遮挡 */
	
	.form-container {
		margin-top: 10px;
		background: #fff;
		padding: 20px 15px;
		
		.form-tips {
			margin-top: 20px;
			padding: 10px;
			background: #f8f8f8;
			border-radius: 4px;
			
			text {
				display: block;
				font-size: 12px;
				color: #999;
				line-height: 1.5;
			}
		}
		
		.submit-btn {
			margin-top: 30px;
			height: 44px;
			line-height: 44px;
			text-align: center;
			background: #2979ff;
			color: #fff;
			border-radius: 4px;
			font-size: 16px;
		}
	}
}
</style> 