// data/product.json
import productList from '@/data/product.json'

// 图片资源动态加载
const warpList = [
  new URL('@/assets/swapper/num1.png', import.meta.url).href,
  new URL('@/assets/swapper/num2.png', import.meta.url).href,
]

export function getProductList() {
  return productList
}

export function getWarpList() {
  return warpList
}
