import request from '@/util/ajax'



/**
 * 删除支付通道
 */
export function deleteAliPayKey(data) {
	return request({
		url: '/admin/dict/deleteAliPayKey',
		method: 'put',
		data
	})
}

/**
 * 添加支付通道
 */
export function addAliPayKey(data) {
	return request({
		url: '/admin/dict/addAliPayKey',
		method: 'put',
		data
	})
}

/**
 * 游戏上下架
 */
export function updateLine(data) {
	return request({
		url: '/admin/ball/update/line/'+data.id+'/'+data.line,
		method: 'put',
		data
	})
}


/**
 * 店铺修改扣款比例
 */
export function editShopRate(data) {
	return request({
		url: '/admin/shop/editShopRate',
		method: 'post',
		data
	})
}


/**
 * 店铺上下架
 */
export function updateShopLine(data) {
	return request({
		url: '/admin/shop/editShopLine',
		method: 'post',
		data
	})
}

/**
 * 店铺详情
 */
export function shopDetail(data) {
	return request({
		url: '/admin/shop/shopDetail',
		method: 'post',
		data
	})
}


/**
 * 店铺列表
 */
export function shopList(data) {
	return request({
		url: '/admin/shop/list',
		method: 'post',
		data
	})
}

/**
 * 创建店铺
 * @param {*} data
 */
export function createShop(data) {
	return request({
		url: '/admin/shop/add',
		method: 'post',
		data
	})
}


/**
 * 站点获取
 */
export function domainQuery(data) {
	return request({
		url: '/app/domain/query',
		method: 'get',
		data
	})
}

/**
 * 站点修改
 */
export function update(data) {
	return request({
		url: '/admin/domain/update/'+data.id,
		method: 'put',
		data
	})
}

/**
 * 添加或更新店铺支付方式
 * @param {Object} data 支付方式信息
 * @param {String} data.qrcodeImage 二维码图片
 * @param {String} data.qrcodeType 支付类型，如：alipay、wechat等
 */
export function addOrUpdateShopPayment(data) {
	return request({
		url: '/app/shop/shoppayment/addOrUpdate',
		method: 'post',
		data
	})
}

export function modifyPayment(data) {
	return request({
		url: '/app/shop/shoppayment/modifyPayment',
		method: 'post',
		data
	})
}
export function appOpenPayment(data) {
	return request({
		url: '/app/shop/shoppayment/appOpenPayment',
		method: 'post',
		data
	})
}
export function appOpenYoumiPayment(data) {
	return request({
		url: '/app/shop/shoppayment/appOpenYoumiPayment',
		method: 'post',
		data
	})
}

export function authAlipay(data) {
	return request({
		url: '/app/shop/shoppayment/authAlipay',
		method: 'post',
		data
	})
}

export function closeShopPayment(data) {
	return request({
		url: '/app/shop/shoppayment/closeShopPayment',
		method: 'post',
		data
	})
}
/**
 * 获取店铺所有支付方式
 */
export function getShopPaymentList() {
	return request({
		url: '/app/shop/shoppayment/list',
		method: 'get'
	})
}

/**
 * 获取当前店铺信息
 */
export function getCurrentStoreInfo() {
	return request({
		url: '/app/shop/getCurrentStoreInfo',
		method: 'get'
	})
}

/**
 * 更新店铺设置
 * @param {Object} data 更新参数
 * @param {number} data.dailyWithdrawalLimit 每日提款次数限制
 * @param {number} data.homeBroadcastSwitch 首页播报海报开关
 * @param {number} data.maxReminderAmount 最大提醒金额
 * @param {number} data.newUserRegisterSwitch 新用户注册开关
 */
export function updateStoreSetting(data) {
	return request({
		url: '/app/shop/updateStoreSetting',
		method: 'post',
		data
	})
}

/**
 * 注册店主
 * @param {Object} data 注册参数
 * @param {String} data.appPhone 手机号
 * @param {String} data.appPassword 密码
 * @param {Number} data.uid 邀请码(可选)
 */
export function registerStoreOwner(data) {
	return request({
		url: '/app/shop/registerStoreOwner',
		method: 'post',
		data
	})
}

/**
 * @description: 获取门店余额明细分页列表
 * @param {Object} params
 * @param {number} params.pageNo - 当前页码
 * @param {number} params.pageSize - 每页显示记录数
 * @param {string} [params.startTime] - 开始时间
 * @param {string} [params.endTime] - 结束时间
 * @return {Promise}
 */
export function getShopGoldChangeLogPage(params) {
	return request({
		url: '/app/shop/shopgoldchangelog/page',
		method: 'GET',
		data: params
	})
}

/**
 * 添加店铺认证信息
 * @param {Object} data 认证信息参数
 * @param {string} [data.agencyLicensePhotoUrl] 代销证照片URL
 * @param {number} data.businessType 经营类型 1个体经营店 2个体转让店
 * @param {string} [data.holdingLicensePhotoUrl] 手持代销证照片URL
 * @param {string} [data.idCardBackPhotoUrl] 本人身份证国徽面照片URL
 * @param {string} [data.idCardFrontPhotoUrl] 本人身份证人像面照片URL
 * @param {string} [data.originalOwnerIdCardBackUrl] 原业主身份证国徽面照片URL
 * @param {string} [data.originalOwnerIdCardFrontUrl] 原业主身份证人像面照片URL
 * @param {number} [data.ownerMatch] 经营者与代销证是否一致 0不一致 1一致
 * @param {string} [data.storefrontPhotoUrl] 店铺门头照片URL
 */
export function addShopVerification(data) {
	return request({
		url: '/app/shop/addShopVerification',
		method: 'post',
		data
	})
}

/**
 * 添加newpay支付申请
 * @param {Object} data 请求参数
 * @param {String} data.alipayAccount 支付宝账号
 * @param {String} data.contactEmail 联系人邮箱
 * @param {String} data.contactPhone 联系人电话
 * @param {String} data.dealerCode 代销证编号
 * @param {String} data.dealerExpire 代销证截止日期 (格式: date-time)
 * @param {String} data.realName 真实姓名
 * @param {String} data.shopAddress 店铺地址
 */
export function addNewpayAlipayApply(data) {
	return request({
		url: '/app/shop/addNewpayAlipayApply',
		method: 'post',
		data
	})
}

/**
 * 获取newpay支付申请
 */
export function getNewpayAlipayApply() {
	return request({
		url: '/app/shop/getNewpayAlipayApply',
		method: 'get'
	})
}

export function getPlatformPaymentList(data) {
	return request({
	  url: '/admin/shop/paymentList',
	  method: 'post',
	  data: data
	})
}
export function getPlatformShopPayment(data) {
	return request({
		url: '/admin/shop/getShopPayment',
		method: 'post',
		data: data
	})
}
//充值
export function storeQrcodeRecharge(data) {
	return request({
		url: '/app/shop/storeQrcodeRecharge',
		method: 'post',
		data: data
	})
}
//获取店铺订单记录
export function getShopOrderList(data) {
	return request({
		url: '/app/shop/getShopOrderList',
		method: 'post',
		data: data
	})
}
//提现
export function withdrawApply(data) {
	return request({
		url: '/app/shop/withdrawApply',
		method: 'post',
		data: data
	})
}

export function createAlipayOrder(data) {
	return request({
		url: '/app/shop/createAlipayOrder',
		method: 'post',
		data: data
	})
}