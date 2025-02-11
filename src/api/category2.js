import request from '@/utils/request'
//获取商品类别
export function listAllCategory() {
  return request.get('/category/listAllCategory')
}
