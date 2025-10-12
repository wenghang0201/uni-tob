import request from '@/util/ajax'

/**
 * 获取彩种列表
 * @returns {Promise} 彩种列表数据
 */
export function getLotteryList() {
  return request({
    url: '/app/ball/list',
    method: 'get',
	data:{
		line:2
	}
  })
}

/**
 * 更新店铺彩种设置
 * @param {Object} data 设置参数
 * @param {Number} data.id 彩种ID
 * @param {String} data.line 上下线状态：0上线，1下线
 * @param {Number} data.guessSwitch 彩种开关：0关闭，1开启
 * @param {Number} data.ticketSwitch 出票开关：0关闭，1开启
 * @param {Number} data.groupBuySwitch 合买开关：0关闭，1开启
 * @param {Number} data.betDeadlineAdvance 用户投注截止时间提前（分钟）
 * @param {Number} data.minBetAmount 用户投注最低金额
 * @param {Number} data.displayOrder 显示顺序
 * @returns {Promise} 更新结果
 */
export function updateLotterySetting(data) {
  return request({
    url: '/app/ball/updateShopLotteryType',
    method: 'post',
    data
  })
} 