import request from '@/utils/request'

export function // 获取所有产品
listAllProducts() {
  return request({
    url: '/product/listAllProduct',
    method: 'get',
    headers: { token: localStorage.getItem('token') },
  })
}

// 获取单个产品详情
export function getProduct(id) {
  return request.get(`/product/getProduct/${id}`, null, {
    headers: { token: localStorage.getItem('token') },
  })
}
//搜索商品
export function searchProducts(tquery) {
  return request({
    url: '/product/search',
    method: 'get',
    params: {
      query: tquery,
    },
    headers: { token: localStorage.getItem('token') },
  })
}

// 收藏商品
export function collectProduct(id) {
  return request({
    url: `/product/collectProduct/${id}`,
    method: 'post',
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}

export function addproduct(data) {
  return request({
    url: '/product/addProduct',
    data: data,
    method: 'post',
    headers: { token: localStorage.getItem('token') },
  })
}

// 上传商品图片
export function uploadPicture(productId, file) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('productId', productId)

  return request.post('/product/uploadPicture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// 下载商品图片
export function downloadPicture(productId) {
  return request({
    url: `/product/downloadPicture/${productId}`,
    method: 'get',
    responseType: 'blob', // 关键参数，指定响应类型为二进制
  })
}
