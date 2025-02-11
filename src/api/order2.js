import request from '@/utils/request'
export function makeNewOrder(userId, orderItemList) {
  return request.post('/order/makeNewOrder', {
    userId,
    orderItemList,
  })
}

// 封装makePayment接口
export function makePayment(userId, cashtendered, paymentMethod) {
  return request.post('/order/makePayment', {
    userId,
    cashtendered,
    paymentMethod,
  })
}
