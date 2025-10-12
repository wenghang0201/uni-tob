// 引入 ajax 模块
import ajax from 'uni-ajax'
import cfg from '@/util/environment.js';
import {
	setAuthtoken,
	setExternalLogintoken,
	removeAuthtoken,
	removeExternalLogintoken,
	removeUserInfo
} from '@/util/auth.js'
// 创建请求实例
const instance = ajax.create({
	// 初始配置
	baseURL: cfg.BASE_API
})
// 添加请求拦截器
instance.interceptors.request.use(
	config => {
		/*
		var  listNotUrl = ['/admin/pay/order/payOrderList'];
		if(listNotUrl.indexOf(config.url) == -1){
			const currentDate = new Date();
			if (config.data && ((typeof config.data.startTime == 'undefined' || config.data.startTime == "") ||
				(typeof config.data.endTime == 'undefined' || config.data.endTime == "")
			)) {

				// 获取七天前的日期
				const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

				// 格式化日期
				const formatDate = date => date.toISOString().slice(0, 19).replace('T', ' ');

				// 格式化当前日期和七天前的日期
				const formattedCurrentDate = formatDate(currentDate);
				const formattedSevenDaysAgo = formatDate(sevenDaysAgo);

				config.data.startTime = formattedSevenDaysAgo;
				config.data.endTime = formattedCurrentDate;
			}

			// 补齐日期的时分秒
			const padTime = date => {
			  date.setHours(currentDate.getHours());
			  date.setMinutes(currentDate.getMinutes());
			  date.setSeconds(currentDate.getSeconds());
			};

			// 检查并补齐 config.data.startTime
			if (config.data && config.data.startTime && config.data.startTime.length === 10) {
			  const startTime = new Date(config.data.startTime + 'T00:00:00');
			  padTime(startTime);
			  config.data.startTime = startTime.toISOString().slice(0, 19).replace('T', ' ');
			}

			// 检查并补齐 config.data.endTime
			if (config.data && config.data.endTime && config.data.endTime.length === 10) {
			  const endTime = new Date(config.data.endTime + 'T23:59:59');
			  padTime(endTime);
			  config.data.endTime = endTime.toISOString().slice(0, 19).replace('T', ' ');
			}
		}

		*/
		// 在发送请求前做些什么
		let admin_user = uni.getStorageSync("admin_user")

		if (![
			'/app/shop/registerStoreOwner'
		].includes(config.url)) {
			config.header = Object.assign({
				'x-access-token': uni.getStorageSync("vue_authtoken"),
				// 'X-Sys': 1,
				// 'X-User': `${admin_user?admin_user:''}`,
				// 取出缓存中的租户id，店铺id就是租户id
				// 'x-tenant-id': uni.getStorageSync("shop").id,
				// 'x-tenant-id':1,
				//客户端ip
				'x-access-ip': uni.getStorageSync("x-access-ip"),
			}, config.headers);
		}

		if (config.method.toUpperCase() === 'GET' ) {
			config.params = { ...config.params, _t: Date.now() }
		}

		return config
	},
	error => {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

// 添加拦截器
const interceptor = instance.interceptors.request.use(config => {
	return config
})

// 移除拦截器
instance.interceptors.request.eject(interceptor)


// 添加响应拦截器
instance.interceptors.response.use(
	response => {
		if (['E085', 'E0823'].includes(response.data.errorCode)) {
			const pages = getCurrentPages()
			const page = pages[pages.length - 1].route;
			if (!page.endsWith("pages/shop/inactive")) {
				uni.redirectTo({
					url: '/pages/shop/inactive'
				})
				return Promise.reject(response.data.errorCode);
			}
		}
		if (response.data.errorCode == 'E0826') {
			const pages = getCurrentPages()
			const page = pages[pages.length - 1].route;
			if (!page.endsWith("pages/shop/audit")) {
				uni.redirectTo({
					url: '/pages/shop/audit'
				})
				return Promise.reject(response.data.errorCode);
			}
		}
		//令牌过期处理
		if ([
			'E0752', // token 过期
			'E0753', // token 无效
			'E0758', // token 登录信息失效
			'E0216', // 用户信息失效，请重新登录
		].includes(response.data.errorCode)) {

			/* //这是失效后直接退出*/
			uni.showModal({
				title: '提示',
				content: '登录信息已过期，请重新登录',
				showCancel: false,
				success: function (res) {
					uni.showLoading();
					removeAuthtoken();
					removeExternalLogintoken();
					removeUserInfo();
					setTimeout(() => {
						uni.redirectTo({
							url: "/pages/user/login"
						});
						uni.hideLoading();
					}, 100)
				}
			});


			/* //实现无感刷新token操作
			const config = response.config
			//刷新token接口
			ajax.post({
				url: cfg.BASE_API + "/user/refresh",
				data: {
					'token': uni.getStorageSync("vue_externalLogintoken")
				},
				success: (res) => {
					// 重置token
					config.header['x-access-token'] = res.data.token
					//重新设置本地缓存token
					setAuthtoken(res.data.token)
					setExternalLogintoken(res.data.refreshToken)
					//再次重新请求
					return instance(config)
				}
			}) */
		}
		// 对响应数据做些什么
		if (response.data.hasOwnProperty('success') && !response.data.success) {
			uni.showToast({
				title: response.data.errorMsg,
				icon: "none"
			})
			return Promise.reject(response.data.errorCode)
		}
		return response.data
	}, error => {
		uni.showToast({
			title: "服务器异常"
		})
		// 对响应错误做些什么
		return Promise.reject(error)
	}
)

// 导出 create 创建后的实例
export default instance
