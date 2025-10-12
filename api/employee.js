import request from '@/util/ajax'

/**
 * 添加员工
 * @param {Object} data 员工信息
 * @param {String} data.name 员工名字
 * @param {String} data.password 密码
 * @param {String} data.confirmPassword 确认密码
 * @param {String} data.phoneNumber 手机号
 */
export function addEmployee(data) {
  return request({
    url: '/app/employee/employee/add',
    method: 'post',
    data
  })
}

/**
 * 删除员工
 * @param {Object} data 员工信息
 * @param {Number} data.userId 用户ID
 */
export function deleteEmployee(data) {
  return request({
    url: '/app/employee/employee/delete',
    method: 'post',
    data
  })
}

/**
 * 获取本店员工列表
 * @param {Object} params 查询参数
 * @param {Number} params.pageNo 当前页码，从1开始
 * @param {Number} params.pageSize 每页显示记录数
 * @param {String} [params.order] 排序方式，可选值(asc、desc)
 * @param {String} [params.orderField] 排序字段
 */
export function getEmployeeList(params) {
  return request({
    url: '/app/employee/employee/page',
    method: 'get',
    params
  })
}

/**
 * 修改员工
 * @param {Object} data 员工信息
 * @param {Number} data.id id
 * @param {String} data.name 员工名字
 * @param {String} data.password 密码
 * @param {String} data.confirmPassword 确认密码
 * @param {String} data.phoneNumber 手机号
 */
export function updateEmployee(data) {
  return request({
    url: '/app/employee/employee/update',
    method: 'post',
    data
  })
}

/**
 * 更新员工权限
 * @param {Object} data 员工权限信息
 * @param {Number} data.id 员工ID
 * @param {Number} data.userId 用户ID
 * @param {Number} data.awardManagePermission 派奖管理权限（0: 禁用, 1: 启用）
 * @param {Number} data.manualFundPermission 手工加款扣款权限（0: 禁用, 1: 启用）
 * @param {Number} data.startOrderPermission 开始接单权限（0: 禁用, 1: 启用）
 * @param {Number} data.viewAlipayPermission 查看用户支付宝账号权限（0: 禁用, 1: 启用）
 * @param {Number} data.viewDispatchPermission 查看派单店铺信息权限（0: 禁用, 1: 启用）
 * @param {Number} data.viewOrdersPermission 查看订单与余额权限（0: 禁用, 1: 启用）
 * @param {Number} data.viewPhonePermission 查看用户手机号权限（0: 禁用, 1: 启用）
 */
export function updateEmployeePermission(data) {
  return request({
    url: '/app/employee/employee/updateEmployeePermissions',
    method: 'post',
    data
  })
}
/**
 * 解锁员工账户
 * @param {Object} data 请求数据
 * @param {Number} data.id 用户ID
 * @param {String} data.password 新密码
 */
export function unlockEmployeeAccount(data) {
  return request({
    url: '/app/employee/employee/unlockUserAccount',
    method: 'post',
    data
  })
}
/**
 * 修改员工密码
 * @param {Object} data 请求数据
 * @param {Number} data.id 用户ID
 * @param {String} data.password 新密码
 */
export function updateEmployeePassword(data) {
  return request({
    url: '/app/employee/employee/updatePassword',
    method: 'post',
    data
  })
}

/**
 * 修改员工登录账号
 * @param {Object} data 请求数据
 * @param {Number} data.id 用户ID
 * @param {String} data.loginAccount 新登录账号
 */
export function updateEmployeeAccount(data) {
  return request({
    url: '/app/employee/employee/updateLoginAccount',
    method: 'post',
    data
  })
} 

/**
 * 员工账号登录
 * @param {Object} data 请求数据
 * @param {Number} data.loginAccount 账号
 * @param {String} data.password 密码
 */
export function loginEmployeeByUsername(data) {
  return request({
    url: '/app/user/employee/loginByUsername',
    method: 'post',
    data
  })
} 

/**
 * 獲取權限
 */
export function getEmployeePermissions() {
	return request({
	  url: '/app/employee/employee/getEmployeePermissions',
	  method: 'post'
	})
}