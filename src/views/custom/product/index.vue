<template>
  <div class="container">
    <div class="header" v-if="product">
      <div class="left">
        <img v-if="product.image" :src="getImageUrl(product.image)" alt="" />
      </div>
      <div class="right">
        <div class="title">
          <h4>商品名</h4>
          <span>{{ product.productName }}</span>
        </div>
        <div class="desc">
          <h4>商品描述</h4>
          <span>{{ product.description }}</span>
        </div>
        <div class="size">
          <h4>商品款式</h4>
          <div class="size-list">
            <span
              v-for="(item, index) in product.sizeList"
              :key="index"
              class="size-list-item"
              @click="sizeChange(index)"
              :class="{ active: index === currentId }"
              >{{ item.title }}</span
            >
          </div>
        </div>
        <div class="price">
          <h4>商品价格</h4>
          <span style="color: #e55757">
            <span>￥</span>
            <span>{{ product.price }}</span>
          </span>
        </div>
        <div class="quantity">
          <el-input-number v-model="param.quantity" :min="1" :max="999" :step="1"></el-input-number>
          <el-button type="danger" plain @click="buynow">立即购买</el-button>
          <el-button type="primary" @click="addToCart">添加到购物车</el-button>
          <el-button type="success" @click="collection">收藏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProduct, collectProduct } from '@/api/product2'
import { add } from '@/api/cart2'
import { makeNewOrder } from '@/api/order2'
const route = useRoute()

const productId = route.query['id']

const product = ref({
  id: 1,
  title: '',
  stock: 1,
  desc: '',
  image: '',
  price: 1,
  sizeList: [],
  status: 1,
})
//
const param = ref({
  productId: 0,
  quantity: 1,
})

const currentId = ref(0)

const selectSize = ref('')

const initData = () => {
  getProduct(productId).then((response) => {
    product.value = response.data
  })
}

initData()
const getImageUrl = (name) => {
  return new URL(`@/assets/goods/${name}.png`, import.meta.url).href
}
const sizeChange = (index) => {
  currentId.value = index
  selectSize.value = product.value.sizeList[index].title
}
//立即购买
const buynow = () => {
  makeNewOrder([
    {
      productId: productId,
      productName: product.value.productName,
      quantity: param.value.quantity,
      price: product.value.price,
    },
  ]).then(() => {
    ElMessage.success('创建订单成功！请前往付款！')
  })
}
//加入购物车
const addToCart = () => {
  param.value.productId = productId
  console.log(param)
  add(param.value).then(() => {
    ElMessage.success('加入购物车成功')
  })
}
//收藏
const collection = () => {
  collectProduct(productId).then(() => {
    ElMessage.success('收藏成功！')
  })
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  width: 1280px;
  height: 640px;
  padding: 20px;
  border: 1px solid #999999;
  border-radius: 20px;
}

.header .left img {
  width: 600px;
  height: 600px;
}

.header .right {
  width: 600px;
  height: 600px;
  padding: 0 20px;
}

.header .right .title,
.desc,
.price,
.size,
.quantity,
.options {
  margin-bottom: 20px;
}

.header .right h4 {
  margin-bottom: 10px;
}

.header .right .size-list {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
}

.size-list-item {
  border: 1px solid #999999;
  padding: 5px 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
}

.active {
  background-color: red;
}
</style>
