<template>
  <div class="container">
    <div class="cart-list">
      <div v-if="cartList.length < 1">
        <h1>购物车空空的，快去购物吧</h1>
      </div>

      <el-row v-if="cartList.length > 0">
        <el-col>
          <el-card :body-style="{ padding: '0px' }">
            <div class="cart-list-header">
              <span style="font-size: 22px; font-weight: bold"
                >购物车(全部<span>{{ cartList.length }}</span
                >)</span
              >
              <el-checkbox v-model="allCheck" class="all-check" @change="changeAllCheck"
                >全选</el-checkbox
              >
              <el-button type="warning" @click="removeMany">移除</el-button>
              <el-button type="danger" @click="buyMany">购买</el-button>
              <span>总金额：{{ total }}</span>
            </div>
          </el-card>
        </el-col>

        <el-col :span="24" v-for="(product, index) in cartList.slice().reverse()" :key="index">
          <el-card :body-style="{ padding: '0px', marginBottom: '10px' }">
            <div class="cart-item">
              <el-checkbox
                v-model="product.selected"
                class="checkedBox"
                @change="singleSelect"
              ></el-checkbox>
              <img :src="getImageUrl(product.image)" class="product-image" alt="" />
              <div class="product-title">{{ product.productName }}</div>

              <div class="product-item-quantity">
                <span class="product-quantity-title">数量：</span>
                <el-input-number
                  v-model="product.quantity"
                  size="small"
                  :min="1"
                  :max="product.stock"
                  @change="quantityChange(product)"
                  :step="1"
                ></el-input-number>
              </div>

              <div class="product-item-size">
                <span class="product-quantity-title">尺码：</span>
                <span>{{ product.size }}</span>
              </div>

              <div class="product-item-price">
                <span class="product-price-title">单价：</span>
                <span class="product-price">￥{{ product.price }}</span>
              </div>

              <div class="product-item-price">
                <span class="product-price-title">总价：</span>
                <span class="product-price">￥{{ product.amount }}</span>
              </div>

              <el-button type="text" @click="removeOne(product)">移除</el-button>
              <el-button type="text" @click="buyMany">购买</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { getCartItems, getTotal, remove } from '@/api/cart2'
import { getProduct } from '@/api/product2'
import { makeNewOrder } from '@/api/order2'
const allCheck = ref(false)
const cartList = ref([])
const price = ref(0)
const total = ref(0)

const initData = () => {
  getCartItems().then((response) => {
    // 获取购物车基础数据
    const basicCartItems = response.data
    // 为每个商品获取详细信息
    const promises = basicCartItems.map((item) =>
      getProduct(item.productId).then((productRes) => ({
        ...item, // 保留购物车原始数据
        ...productRes.data, // 合并商品详情数据
        amount: item.quantity * productRes.data.price, // 计算总价
      })),
    )
    // 等待所有商品详情加载完成
    Promise.all(promises).then((fullCartItems) => {
      cartList.value = fullCartItems
    })
  })

  getTotal(1).then((response) => {
    total.value = response.data
  })
}

initData()

//
const buyMany = () => {
  const selectedItems = cartList.value.filter((item) => item.selected)
  if (selectedItems.length === 0) {
    ElMessage.error('请选择要购买的商品')
    return
  }

  // 构造符合后端要求的订单项结构
  const orderItems = selectedItems.map((item) => ({
    productId: item.productId, // 确保字段名与后端DTO一致
    quantity: item.quantity,
    price: item.price,
    productName: item.productName,
  }))
  makeNewOrder(orderItems).then(() => {
    ElMessage.success('订单创建成功！')
  })
}

const getImageUrl = (name) => {
  return new URL(`@/assets/goods/${name}.png`, import.meta.url).href
}

const quantityChange = (product) => {
  product.amount = (product.quantity * product.price).toFixed(2)
}

const changeAllCheck = () => {
  if (allCheck.value) {
    cartList.value.forEach((item) => {
      item.selected = true
    })
  } else {
    cartList.value.forEach((item) => {
      item.selected = false
    })
  }
}

const singleSelect = () => {
  let checkCount = 0
  cartList.value.forEach((item) => {
    if (item.selected) {
      checkCount++
    }
  })
  if (checkCount === cartList.value.length) {
    allCheck.value = true
  } else {
    allCheck.value = false
  }
}

const removeOne = (product) => {
  let index = cartList.value.indexOf(product)
  cartList.value.splice(index, 1)

  ElMessage({
    message: '移出成功',
    type: 'success',
    showClose: true,
    duration: 3000,
  })
}

const removeMany = () => {
  let list = []
  cartList.value.forEach((item) => {
    if (item.selected) {
      list.push(item)
    }
  })
  if (list.length === 0) {
    ElMessage({
      message: '请勾选需要移除的商品',
      type: 'error',
      showClose: true,
      duration: 3000,
    })
    return
  }

  for (let i = 0; i < list.length; i++) {
    let index = cartList.value.indexOf(list[i])
    cartList.value.splice(index, 1)
  }

  ElMessage({
    message: '移除成功',
    type: 'success',
    showClose: true,
    duration: 3000,
  })
}

const buyOne = (id) => {
  ElMessage({
    message: '买了' + id,
    type: 'error',
    showClose: true,
    duration: 3000,
  })
}
</script>

<style scoped>
.container {
  width: 1280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.cart-list {
  padding-left: 10px;
}

.cart-list .el-card {
  border: none;
  width: 100%;
  margin-bottom: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.cart-list-header {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.all-check {
  margin: 0 20px;
}

.cart-list .cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
  padding: 10px 20px;
  background-color: #ffffff;
}

.checkedBox {
  transform: scale(150%);
}

.cart-list .cart-item .el-checkbox {
  margin-right: 10px;
}

.cart-list .product-image {
  width: 60px;
  height: 60px;
  border-radius: 5px;
}

.product-title {
  font-size: 16px;
  color: #333;
  width: 200px;
  margin: 0 20px;
  font-weight: bold;
}

.product-title:hover {
  cursor: pointer;
  color: #30bd78;
}

.product-item-quantity {
  color: #666;
  margin-right: 10px;
  width: 180px;
}

.product-item-size {
  color: #666;
  user-select: none;
  width: 180px;
}

.product-item-price {
  width: 180px;
  margin-left: 10px;
}

.product-price-title {
  color: #666;
  user-select: none;
}

.product-price {
  color: #e55757;
  font-weight: bold;
}

.el-button--text {
  color: #666;
}

.el-button--text:hover {
  color: #30bd78;
}
</style>
