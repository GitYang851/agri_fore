import request from '@/utils/request'

export default {
  register(data) {
    return request({
      url: '/user/register',
      method: 'post',
      data: data,
    })
  },
  login(data) {
    return request({
      url: '/user/login',
      method: 'post',
      data: data,
    })
  },
}
