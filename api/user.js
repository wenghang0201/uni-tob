import request from '@/util/ajax'
import cfg from '@/util/environment.js';



/**
 * 设置发单分佣比例
 * @param {*} data
 */
export function adminUserRecharge(data) {
    return request({
        url: '/admin/user/recharge/'+data.id,
        method: 'put',
		data
    })
}
/**
 * 设置发单分佣比例
 * @param {*} data
 */
export function adminUserRecharge2(data) {
    return request({
        url: '/admin/user/recharge2/'+data.id,
        method: 'put',
		data
    })
}
/**
 * 设置发单分佣比例
 * @param {*} data
 */
export function setUserCommissionRate(data) {
    return request({
        url: '/admin/user/setUserCommissionRate',
        method: 'post',
		data
    })
}

/**
 * 设置销售分佣比例
 * @param {*} data
 */
export function setSalespersonSaleRate(data) {
    return request({
        url: '/admin/user/setSalespersonSaleRate',
        method: 'post',
		data
    })
}

/**
 * 后台提现审核
 * @param {*} data
 */
export function examine(data) {
    return request({
        url: '/admin/withdrawal/examine',
        method: 'put',
		data
    })
}

/**
 * 获取用户详情信息
 * @param {*} data
 */
export function getAllUser(data) {
    return request({
        url: '/admin/user/getAllUser',
        method: 'post',
		data
    })
}

// 查询用户列表
export function getUserList(data) {
  return request({
    url: "/admin/user/list",
    method: "post",
    data,
  });
}
export function getStoreUsers(data) {
    return request({
        url: "/app/user/getStoreUsers",
        method: "post",
        data,
    });
}
export function shopOwnerModifiesUserPid(data) {
    return request({
        url: "/app/user/shopOwnerModifiesUserPid",
        method: "post",
        data,
    });
}

/**
 * 获取店主下面所有的销售列表
 */
export function getAllSale(data) {
    return request({
        url: '/admin/user/getAllSale',
        method: 'post',
		data
    })
}

/**
 * 获取用户详情信息
 * @param {*} data
 */
export function getUserDetail(data) {
    return request({
        url: '/admin/user/getUserDetail',
        method: 'post',
		data
    })
}

/**
 * 获取所有的店主
 */
export function getShopers(data) {
    return request({
        url: '/admin/user/shopkeeperList',
        method: 'post',
		data
    })
}

/**
 * 删除模拟
 */
export function delMoniUser(data) {
    return request({
        url: '/app/user/deleteMoniUser',
        method: 'post',
		data
    })
}



/**
 * 昨日榜单
 */
export function yesterdayWinningList() {
    return request({
        url: '/app/statistics/yesterdayWinningList',
        method: 'get',
    })
}


/**
 * 店主给用户充值
 * @param {*} data
 */
export function shopkeeperRecharge(uid,data) {
    return request({
        url: '/app/user/shopkeeperRecharge/'+uid,
        method: 'put',
		data
    })
}


/**
 * 店主模拟跟单
 */
export function shopkeeperMoniAdd(data) {
    return request({
        url: '/app/documentary/shopkeeperMoniAdd',
        method: 'post',
		data
    })
}


/**
 * 获取我的客户的订单
 */
export function getImitates(data) {
    return request({
        url: '/app/user/queryMoniUserList',
        method: 'post',
		data
    })
}

/**
 * 获取下级客户投注列表
 * @param {Object} data
 */
export function agentBettingList(data) {
	return request({
		url: '/app/user/agentBettingList',
		method: 'POST',
		data
	})
}

/**
 * 获取我的客户
 */
export function agentUsers(data) {
    return request({
        url: '/app/user/agentUsers',
        method: 'post',
		data
    })
}

/**
 * 邀請數據
 * @param {Object} data
 */
export function inviteStatistics(data) {
	return request({
		url: 'admin/statistics/inviteStatistics/list',
		method: 'POST',
		data
	})
}

/**
 * 获取店铺数据统计
 *  @param {*} data
 */
export function getShopCount(data) {
	return request({
		url: '/app/statistics/countShopPrice',
		method: 'post',
		data
	})
}

/**
 * 获取店铺数据统计
 *  @param {*} data
 */
export function shopStatistics(data) {
	return request({
		url: '/app/statistics/shopStatistics',
		method: 'post',
		data
	})
}

/**
 * 派奖
 *  @param {*} data
 */
export function paijiangOrder(data) {
	return request({
		url: '/app/lottery/order/award',
		method: 'post',
		data
	})
}

/**
 * 批量派奖
 *  @param {*} data
 */
export function paijiangOrderBatch(data) {
	return request({
		url: '/admin/lottery/order/batchAward',
		method: 'post',
		data
	})
}

/**
 * 出票
 *  @param {*} data
 */
export function chupiaoOrder(data) {
	return request({
		url: '/app/lottery/order/ticketing',
		method: 'post',
		data
	})
}

/**
 * 删除订单记录
 *  @param {*} data
 */
export function deleteOrder(data) {
	return request({
		url: '/app/lottery/order/deleteOrder',
		method: 'post',
		data
	})
}


/**
 * 删除销售
 * @param {*} data
 */
export function delSalePerson(data) {
    return request({
        url: 'app/user/deleteSalesperson',
        method: 'post',
        data
    })
}

/**
 * 投诉详情
 * @param {*} data
 */
export function getComplaintsInfo(data) {
    return request({
        url: '/complaints/detail',
        method: 'post',
        data
    })
}

/**
 * 投诉列表
 * @param {*} data
 */
export function getComplaints(data) {
    return request({
        url: '/complaints/list',
        method: 'post',
        data
    })
}

/**
 * 创建投诉
 * @param {*} data
 */
export function createComplaints(data) {
    return request({
        url: '/complaints/create',
        method: 'post',
        data
    })
}

/**
 * 创建模拟用户
 * @param {*} data
 */
export function createMoniUser(data) {
    return request({
        url: '/app/user/createMoniUser',
        method: 'post',
        data
    })
}

/**
 * 创建销售
 * @param {*} data
 */
export function addSalesperson(data) {
    return request({
        url: '/app/user/addSalesperson',
        method: 'post',
        data
    })
}
/**
 * 登录
 * @param {*} data
 */
// export function login(data) {
//     return request({
//         url: '/app/user/login',
//         method: 'post',
//         data
//     })
// }

/**
 * 登录
 * @param {*} data
 */
export function login(data) {
    return request({
        // url: '/sys/user/login',
		// url:'/app/user/login',
        url: data.userType==1?'/app/user/shopkeeper/login':'/app/user/employee/login',
        method: 'post',
        data
    })
}

/**
 * 注册
 * @param {*} data
 */
export function register(data) {
    return request({
        url: '/app/user/register',
        method: 'post',
		data
    })
}

/**
 * 发送短信
 * @param {*} data
 */
export function send(data) {
    return request({
        url: '/app/user/send',
        method: 'post',
		data
    })
}

/**
 * 退出
 * @param {*} data
 */
export function logout() {
    return request({
        url: '/user/logout',
        method: 'get',
    })
}

/**
 * 好友列表
 * @param {*} id
 */
export function friendList(id) {
    return request({
        url: '/app/user/friend/'+id,
        method: 'get'
    })
}

/**
 * 修改密码
 * @param {*} data
 */
export function changePwd(data) {
    return request({
        url: '/app/user/change/pwd',
        method: 'put',
		data
    })
}
/**
 * 修改密码
 * @param {*} data
 */
export function changeUser(data) {
    return request({
        url: '/app/user/change/info',
        method: 'put',
		data
    })
}

/**
 * 实名
 * @param {Object} data
 */
export function real(data) {
    return request({
        url: '/app/user/real',
        method: 'put',
		data
    })
}

/**
 * 获取用户信息
 */
export function getUser() {
    return request({
        url: '/app/user/get',
        method: 'get',
    })
}


/**
 * 我的销售
 */
export function agentSalesperson(data) {
    return request({
        url: '/admin/user/agentSalesperson',
        method: 'post',
		data
    })
}
/**
 * 我的销售
 */
export function agentSalespersonSet(data) {
    return request({
        url: '/admin/user/update/'+ data.id,
        method: 'PUT',
		data
    })
}
/**
 * 代理
 */
export function agent(data) {
    return request({
        url: '/app/user/agent',
        method: 'post',
		data
    })
}

export function getUserByNickName(data) {
    return request({
        url: '/app/user/get/nickname',
        method: 'post',
		data
    })
}

export function getTenantId(uid) {
    return request({
        url: '/app/user/get/tenant/'+uid,
        method: 'get',
    })
}

export function binding(data) {
    return request({
        url: '/app/user/binding',
        method: 'post',
		data
    })
}

export function checkPhoneIsExist(data) {
    return request({
        url: '/app/user/phone/exist',
        method: 'post',
		data
    })
}

// 门店用户列表
export function storeUserPage(params) {
	return request({
		url: '/app/user/storeUserPage',
		method: 'get',
		params
	})
}

// 门店用户详情
export function getStoreUserDetail(targetUserId) {
	return request({
		url: `/app/user/getStoreUserDetail/${targetUserId}`,
		method: 'get'
	})
}

// 设置成星标用户
export function setAsStarUserFlag(data) {
	return request({
		url: '/app/user/setAsStarUserFlag',
		method: 'post',
		data
	})
}

/**
 * 设置成用户代理
 * @param {Object} data 参数对象
 * @param {Number|String} data.userId 用户ID
 */
export function setAsUserAgent(data) {
	return request({
		url: '/app/user/setAsUserAgent',
		method: 'post',
		data
	})
}

/**
 * 取消用户代理
 * @param {Object} data 参数对象
 * @param {Number|String} data.userId 用户ID
 */
export function cancelUserAgent(data) {
	return request({
		url: '/app/user/cancelUserAgent',
		method: 'post',
		data
	})
}

/**
 * 获取门店代理统计列表
 */
export function getStoreAgentStatisticsList(params) {
	return request({
		url: '/app/user/storeAgentStatisticsList',
		method: 'get',
		params
	})
}

/**
 * 获取代理月度统计数据
 * @param {string} statisticalMonth 统计月份，格式：YYYY-MM
 */
export function getAgentMonthlyStatistics(statisticalMonth) {
	return request({
		url: '/app/statistics/agentMonthlyStatistics',
		method: 'get',
		params: {
			statisticalMonth
		}
	})
}

/**获取个人中心订单统计 */
export function getPersonalCenterOrderStatistics(data) {
	return request({
		url: '/app/user/getShopOrderStatistics',
		method: 'post',
		data
	})
}

/**
 * 更新店铺用户信息（设置备注）
 * @param {Object} data 参数对象
 * @param {Number|String} data.userId 用户ID
 * @param {String} data.storeRemark 门店对用户的备注
 */
export function updateStoreUserInfo(data) {
	return request({
		url: '/app/user/updateStoreUserInfo',
		method: 'post',
		data
	})
}

/**
 * 店主修改专家状态
 * @param {Object} data 参数对象
 * @param {Number|String} data.userId 用户ID
 * @param {Number} data.expertStatus 专家状态：0-否，1-是
 * @param {Number} data.expertSort 专家排序号，ID越小越靠前
 */
export function shopOwnerModifiesExpertStatus(data) {
	return request({
		url: '/app/user/shopOwnerModifiesExpertStatus',
		method: 'post',
		data
	})
}

