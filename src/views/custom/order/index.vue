<template>
  <div class="container">
    <div class="order-list">
      <el-row>
        <el-col>
          <el-card :body-style="{ padding: '0px' }">
            <div class="order-list-header">
              <span style="font-size: 22px; margin-right: 20px">订单</span>
              <el-tabs v-model="default_nav_select" @tab-click="changeOrder">
                <el-tab-pane label="全部订单" name="10">全部订单</el-tab-pane>
                <el-tab-pane label="待付款" name="20">待付款</el-tab-pane>
                <el-tab-pane label="待发货" name="30">待发货</el-tab-pane>
                <el-tab-pane label="待收货" name="40">待收货</el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>

        <div v-if="orderList.length < 1">
          <h1>空空如也</h1>
        </div>

        <el-col :span="24" v-for="(order, index) in orderList" :key="order.id">
          <el-card :body-style="{ padding: '0px' }">
            <div class="order-item">
              <div class="top">
                <div class="create-time">{{ order.createTime }}</div>
                <div class="order-no">
                  订单号:<span>{{ order.orderNum }}</span>
                </div>

                <div class="order-status">
                  订单状态：
                  <span v-if="order.status === 10" style="color: #c77a7a">交易关闭</span>
                  <span v-if="order.orderStatus == '已创建'">待支付</span>
                  <span v-if="order.orderStatus == '已付款'">待发货</span>
                  <span v-if="order.status === 40">待收货</span>
                  <span v-if="order.status === 50" style="color: #47c715">交易完成</span>
                </div>

                <div class="info-order">
                  <el-button size="small" circle>
                    <el-icon><Search /></el-icon>
                  </el-button>
                </div>
                <div class="delete-order">
                  <el-button size="small" circle @click="remove(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <div class="content">
                <img :src="getImageUrl(order.image)" class="product-image" alt="" />
                <span class="product-title">{{ order.productTitle }}</span>

                <span class="order-amount"
                  >总价：<span>￥{{ order.total }}</span></span
                >

                <el-button
                  v-if="order.orderStatus == '已创建'"
                  type="danger"
                  plain
                  @click="open(order)"
                  >去支付</el-button
                >
                <el-button
                  v-if="order.orderStatus == '已付款'"
                  type="primary"
                  plain
                  @click="confirmReceipt(index)"
                  >确认收货
                </el-button>
                <el-button v-if="order.status === 20" type="warning" plain @click="cancel(index)"
                  >取消订单</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="pages" v-if="orderList.length > 0">
      <el-pagination background layout="prev, pager, next" :total="20"> </el-pagination>
    </div>
  </div>

  <el-dialog v-model="visible" title="订单支付" width="500px">
    <el-form :model="form">
      <!-- 订单信息展示 -->
      <el-form-item label="订单号">
        <el-input v-model="form.orderNum" disabled />
      </el-form-item>

      <el-form-item label="支付方式" required>
        <el-select v-model="form.paymentMethod" placeholder="请选择">
          <el-option label="微信支付" value="WeChatPay" />
          <el-option label="支付宝" value="AliPay" />
          <el-option label="银联支付" value="UnionPay" />
        </el-select>
      </el-form-item>

      <el-form-item label="支付金额" required>
        <el-input-number
          v-model="form.cashtendered"
          :min="0.01"
          :precision="2"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitPayment" :loading="loading"> 立即支付 </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { listAllOrder, selectOrderByStatus, makePayment } from '@/api/order2'
const orderList = ref([])
const default_nav_select = ref('10')

const initData = () => {
  listAllOrder().then((response) => {
    orderList.value = response.data
  })
}

initData()
const getImageUrl = (name) => {
  return new URL(`@/assets/goods/${name}.png`, import.meta.url).href
}
const changeOrder = (tab) => {
  const orderstatus = tab.props.label
  switch (orderstatus) {
    case '全部订单':
      listAllOrder().then((response) => {
        orderList.value = response.data
      })
      break
    case '待付款':
      selectOrderByStatus({ status: '已创建' }).then((response) => {
        orderList.value = response.data
      })
      break
    case '待收货':
      selectOrderByStatus({ status: '已付款' }).then((response) => {
        orderList.value = response.data
      })
      break
    default:
      selectOrderByStatus({ status: orderstatus }).then((response) => {
        orderList.value = response.data
      })
  }
}

// 支付
const visible = ref(false)
const loading = ref(false)
const currentOrder = ref(null)
const form = reactive({
  orderNum: '',
  paymentMethod: '',
  cashtendered: 0,
})

const open = (order) => {
  currentOrder.value = order
  form.orderNum = order.orderNum
  form.cashtendered = order.total
  visible.value = true
}

function submitPayment() {
  try {
    loading.value = true
    makePayment({
      cashtendered: form.cashtendered, // 注意参数名与后端一致
      paymentMethod: form.paymentMethod,
      orderNUm: form.orderNum,
    }).then(() => {
      ElMessage.success('支付成功')
      // 更新订单状态
      if (currentOrder.value) {
        currentOrder.value.status = 30
        currentOrder.value.orderStatus = '已付款'
      }
      loading.value = false
    })
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '支付失败')
  }
}
</script>

<style scoped>
.container {
  width: 1280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0 10px 0;
}

.category-content {
  margin: 20px 0;
  width: 1280px;
  height: 300px;
  background-color: #e55757;
  border: 1px solid black;
}

.order-list {
  padding-left: 10px;
}

.order-list .el-card {
  border: 1px solid black;
  width: 1280px;
  margin-bottom: 10px;
}

.order-list-header {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 10px 20px;
}

.all-check {
  margin: 0 20px;
}

.info-order {
  margin-right: 100px;
}

.order-list .order-item {
  height: 130px;
  padding: 10px 20px;
}

.order-list .order-item .top {
  display: flex;
  color: #666666;
  font-size: 14px;
}

.order-list .order-item .top .create-time,
.order-no,
.order-status {
  width: 200px;
  margin-right: 50px;
}

.order-list .order-item .content {
  display: flex;
  align-items: center;
  height: 90px;
}

.order-list .product-image {
  width: 60px;
  height: 60px;
}

.product-title {
  font-size: 14px;
  color: #666;
  width: 200px;
  margin: 0 20px;
}

.product-price {
  color: #999999;
  margin: 0 20px;
}

.product-quantity {
  color: #999999;
  margin: 0 20px;
}

.order-amount {
  color: #999999;
  margin: 0 20px;
}

.pages {
  margin: 30px 0 50px;
}
</style>
