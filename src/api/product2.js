import request from '@/utils/request'

export function // 获取所有产品
listAllProducts(param) {
  return request({
    url: '/product/listAllProduct',
    method: 'get',
    params: param,
    headers: { token: localStorage.getItem('token') },
  })
}
export function // 获取所有产品
listAllProduct() {
  return request({
    url: '/product/listAllProduct2',
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
//获取推荐
export function getRecommend() {
  return request({
    url: '/product/getRecommandation',
    method: 'get',
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
export function getcollectdata() {
  return request({
    url: 'product/collectdata',
    method: 'get',
    headers: {
      token: localStorage.getItem('token'),
    },
  })
}
export function removecollect(productId) {
  return request({
    url: 'product/removecollect',
    method: 'delete',
    params: productId,
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
    headers: {
      'Content-Type': 'multipart/form-data',
      token: localStorage.getItem('token'),
    },
  })
}

// 编辑商品
export function editProductById(data) {
  return request({
    url: '/product/editProduct',
    data: data,
    method: 'post',
    headers: { token: localStorage.getItem('token') },
  })
}
