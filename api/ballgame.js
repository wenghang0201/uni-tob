import request from '@/util/ajax'

/**
 * 彩票列表
 */
export function ballList() {
    return request({
        url: '/app/ball/list',
        method: 'get'
    })
}

/**
 * 福彩接口
 */

export function adminBallList() {
    return request({
        url: '/admin/ball/update/line/1/1',
        method: 'PUT'
    })
}

