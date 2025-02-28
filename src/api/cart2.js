import request from '@/utils/request'

//获取用户购物车列表
export function getCartItems() {
  return request({
    url: '/cart/get',
    method: 'get',
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
//获取总价
export function getTotal() {
  return request({
    url: `/cart/total`,
    method: 'get',
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
//加入购物车
export function add(param) {
  return request({
    url: '/cart/add',
    method: 'post',
    params: param,
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
//编辑购物车
export function edit(param) {
  return request({
    url: '/cart/edit',
    method: 'post',
    params: param,
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
//删除购物车某商品
export function remove(param1) {
  return request({
    url: '/cart/remove',
    method: 'post',
    params: param1,
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
//清空购物车
export function clear() {
  return request({
    url: `/cart/clear`,
    method: 'delete',
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
