import request from '@/utils/request'
export default {
  //获取用户购物车列表
  getCartItems(userid) {
    return request({
      url:`/cart/${userid}`,
      method: 'get',
      headers:{
        token: localStorage.getItem('token')
      }
    })
  },
  //获取总价
  getTotal(userid) {
    return request({
      url: `/cart/total/${userid}`,
      method: 'get',
      headers:{
        token: localStorage.getItem('token')
      }
    })
  },
  //加入购物车
  add(param) {
    return request({
      url: '/cart/add',
      method: 'post',
      params: param,
      headers:{
        token: localStorage.getItem('token')
        }
    })
  },
  //编辑购物车
  edit(param) {
    return request({
      url: '/cart/edit',
      method: 'post',
      params: param,
      headers:{
        token: localStorage.getItem('token')
      }
    })
  },
  //删除购物车某商品
  remove(param) {
    return request({
      url: '/cart/remove',
      method: 'post',
      params: param,
      headers:{
        token: localStorage.getItem('token')
        }
    })
  },
  //清空购物车
  clear(userid) {
    return request({
      url:`/cart/clear/${userid}`,
      method: 'get',
      headers:{
        token: localStorage.getItem('token')
      }
    })
  },
}
