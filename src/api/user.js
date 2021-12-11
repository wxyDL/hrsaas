import request from '@/utils/request'

// 登录接口
export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料接口
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 根据用户id获取用户头像
export function getUserDateilById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
