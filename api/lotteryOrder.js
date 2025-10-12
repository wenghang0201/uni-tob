import request from '@/util/ajax'


/**
 * 修改票据
 */
export function actual(data) {
	return request({
		url: '/admin/lottery/order/actual',
		method: 'put',
		data
	})
}
export function modifyVote(data) {
	return request({
		url: '/admin/lottery/order/modifyVote',
		method: 'put',
		data
	})
}

/**
 * 获取合买详情
 * @param {Number|String} id 合买ID
 * @returns {Promise} 合买详情数据
 */
export function getJointPurchaseDetail(id) {
	return request({
		url: `/app/jprec/jointpurchase/${id}`,
		method: 'get'
	})
}

/**
 * 更新订单赔率
 */
export function updateBallInfoBonusOdds(data) {
	return request({
		url: '/app/lottery/order/updateBallInfoBonusOdds',
		method: 'post',
		data
	})
}

/**
 * 账户明细
 */
export function widthdrawalList(data) {
	return request({
		url: '/admin/withdrawal/list',
		method: 'post',
		data
	})
}

/**
 * 账户明细
 */
export function getPayOrderList(data) {
	return request({
		url: '/admin/pay/order/getPayOrderList',
		method: 'post',
		data
	})
}


/**
 * 账户明细
 */
export function getMingXiOrders(data) {
	return request({
		url: '/admin/pay/order/payOrderList',
		method: 'post',
		data
	})
}

/**
 * 订单记录
 */
export function getLotteryOrderPage(data) {
	return request({
		url: '/admin/lottery/order/list',
		method: 'post',
		data
	})
}

/**
 * 根据id订单订单记录
 */
export function getLotteryOrderById(id) {
	return request({
		url: '/app/lottery/order/get/'+id,
		method: 'get',
	})
}

/**
 * 获取昨日下单中奖的订单提示信息
 */
export function centre() {
	return request({
		url: '/app/lottery/order/centre',
		method: 'get',
	})
}

/**
 * 购彩订单记录
 */
export function lotteryOrderList(data) {
	return request({
		url: '/admin/lottery/order/lotteryOrderList',
		method: 'post',
		data: {
			...data,
			// 如果没有提供排序字段和规则，则使用默认值
			sortField: data.sortField || 'createTime',
			sortRules: data.sortRules || 'desc'
		}
	})
}

/**
 * 购彩订单记录接口 - APP端
 * @param {Object} data 查询参数
 * @param {Number} [data.documentaryRelationType] 跟单关联类型:1-无关 2-创建跟单 3-跟单订单
 * @param {String} [data.endTime] 结束时间
 * @param {String} [data.orderId] 订单id
 * @param {Number} data.pageNo 起始页
 * @param {Number} data.pageSize 页大小
 * @param {String} [data.sortField] 排序字段
 * @param {String} [data.sortRules] 排序规则
 * @param {String} [data.startTime] 开始时间
 * @param {String} [data.state] 状态 -1全部;0->待接单;1->待开奖;2->未中奖;3->待派奖;4->已派奖;5->拒绝;6->退票;7->待出票
 * @param {Array} [data.stateList] 状态数组
 * @param {Number} [data.timeFilterType] 时间筛选类型：1-创建时间，2-出票时间，3-派奖时间 4-用户接单
 * @param {Array} [data.typeList] 订单类型数组
 * @param {Number} [data.userId] 用户ID
 * @returns {Promise} 购彩订单记录数据
 */
export function getLotteryOrderList(data) {
	return request({
		url: '/app/lottery/order/list',
		method: 'post',
		data
	})
}

/**
 * 合买大厅APP分页查询合买列表
 * @param {Object} params 查询参数
 * @param {Number} params.divineOrder 是否是神单 0-否 1-是
 * @param {Number} params.groupHallRecommend 推荐状态 0-不推荐 1-推荐
 * @param {Number} params.pageNo 当前页码，从1开始
 * @param {Number} params.pageSize 每页显示记录数
 * @param {String} [params.lotteryType] 彩票类型
 * @param {String} [params.order] 排序方式，可选值(asc、desc)
 * @param {String} [params.orderField] 排序字段
 * @param {Number} [params.status] 状态(0:认购中 1:已满员 2:已截止 3:进行中 4:已完成 5:成单失败)
 * @returns {Promise} 合买列表数据
 */
export function getJointPurchaseList(params) {
	// 确保必填参数存在
	const defaultParams = {
		divineOrder: 0,           // 默认非神单
		groupHallRecommend: 0,    // 默认不推荐
		...params,
		order: 'asc',
	};

	return request({
		url: '/app/jprec/jointpurchase/page',
		method: 'get',
		params: defaultParams
	})
}