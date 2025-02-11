import request from '@/utils/request'

export default {
  // 获取所有产品
  listAllProducts() {
    return request.get('/product/listAllProduct')
  },

  // 获取单个产品详情
  getProduct(id) {
    return request.get(`/product/getProduct/${id}`)
  },

  // 收藏商品
  collectProduct(id, token) {
    return request.post(`/product/collectProduct/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // 上传商品图片
  uploadPicture(productId, file) {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('productId', productId)

    return request.post('/product/uploadPicture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 下载商品图片
  async downloadPicture(productId) {
    const response = await request.get(`/product/downloadPicture/${productId}`, {
      responseType: 'blob',
    })
    return URL.createObjectURL(new Blob([response]))
  },
}
