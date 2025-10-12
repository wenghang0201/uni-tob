import request from '@/util/ajax'

/**
 * 获取支付订单列表
 * @param {Object} data 查询条件
 */
export function getPaymentOrderList(data) {
	return request({
		url: '/admin/pay/order/payOrderList',
		method: 'post',
		data
	})
}

/**
 * 审核凭证支付订单
 * @param {Object} data 审核参数
 * @param {string} data.orderId 订单ID
 * @param {boolean} data.approved 是否通过
 * @param {string} [data.remark] 备注说明
 */
export function auditVoucherPayment(data) {
	return request({
		url: '/app/pay/order/auditVoucherPayment',
		method: 'post',
		data
	})
}

/**
 * 获取支付订单详情
 * @param {Number} id 订单ID
 */
export function getPaymentDetail(id) {
	return request({
		url: `/app/pay/order/detail/${id}`,
		method: 'get'
	})
} 