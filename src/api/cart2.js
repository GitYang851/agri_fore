import request from '@/utils/request'
export default {
  //获取用户购物车列表
  getCartItems(userid) {
    return request.get(`/cart/${userid}`)
  },
  //获取总价
  getTotal(userid) {
    return request.get(`/cart/total/${userid}`)
  },
  //加入购物车
  add(param) {
    return request({
      url: '/cart/add',
      method: 'post',
      params: param,
    })
  },
  //编辑购物车
  edit(param) {
    return request({
      url: '/cart/edit',
      method: 'post',
      params: param,
    })
  },
  //删除购物车某商品
  remove(param) {
    return request({
      url: '/cart/remove',
      method: 'post',
      params: param,
    })
  },
  //清空购物车
  clear(userid) {
    return request.get(`/cart/clear/${userid}`)
  },
}
