import request from '@/utils/request'

export default {
  register(param) {
    return request({
      url: '/user/register',
      method: 'post',
      params: param,
    })
  },
  login(param) {
    return request({
      url: '/user/login',
      method: 'post',
      params: param,
    })
  },
}
