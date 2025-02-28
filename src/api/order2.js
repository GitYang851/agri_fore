import request from '@/utils/request'
export function makeNewOrder(orderItemList) {
  return request({
    url: '/order/makeNewOrder',
    method: 'post',
    data: orderItemList,
    headers: { token: localStorage.getItem('token') },
  })
}

// 封装makePayment接口
export function makePayment(orderdata) {
  return request({
    url: '/order/makePayment',
    method: 'post',
    params: orderdata,
    headers: { token: localStorage.getItem('token') },
  })
}

export function listAllOrder() {
  return request({
    url: '/order/listAllOrder',
    method: 'get',
    headers: { token: localStorage.getItem('token') },
  })
}
export function selectOrderByStatus(status) {
  return request({
    url: '/order/selectOrderByStatus',
    method: 'get',
    params: status,
    headers: { token: localStorage.getItem('token') },
  })
}
