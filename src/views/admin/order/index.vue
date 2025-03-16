<template>
  <div class="order-management">
    <!-- 头部操作区 -->
    <div class="operation-header">
      <!-- 状态导航 -->
      <div class="status-nav">
        <el-radio-group 
          v-model="default_nav" 
          @change="changeTab"
          class="status-group"
        >
          <el-radio-button label="80">全部订单</el-radio-button>
          <el-radio-button label="20">待支付</el-radio-button>
          <el-radio-button label="30">待发货</el-radio-button>
          <el-radio-button label="40">待收货</el-radio-button>
          <el-radio-button label="50">交易完成</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input
          v-model="search.orderNo"
          placeholder="输入订单号搜索"
          clearable
          class="search-input"
          @keyup.enter="toSearch"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          class="search-btn"
          @click="toSearch"
        >
          查询
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-container">
      <el-table
        :data="orderList"
        border
        stripe
        highlight-current-row
        class="data-table"
      >
        <el-table-column
          label="序号"
          width="80"
          align="center"
        >
          <template #default="{ $index }">
            <span class="index-number">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="orderNo"
          label="订单号"
          min-width="180"
          show-overflow-tooltip
        />

        <el-table-column
          prop="price"
          label="商品单价"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="商品图片"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <el-image 
              :src="require('@/assets/goods/'+row.image)"
              :preview-src-list="[require('@/assets/goods/'+row.image)]"
              fit="cover"
              class="product-image"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column
          prop="quantity"
          label="数量"
          width="100"
          align="center"
        />

        <el-table-column
          prop="amount"
          label="总金额"
          width="150"
          align="center"
        >
          <template #default="{ row }">
            <span class="total-amount">¥{{ row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="下单时间"
          width="180"
        />

        <el-table-column
          prop="updateTime"
          label="状态更新时间"
          width="180"
        />

        <el-table-column
          label="操作"
          width="180"
          fixed="right"
        >
          <template #default="{ row, $index }">
            <div class="action-btns">
              <el-button 
                type="primary" 
                link
                class="view-btn"
              >
                详情
              </el-button>
              <el-button
                v-if="row.status === 30"
                type="success"
                link
                class="send-btn"
                @click="sendProduct($index)"
              >
                发货
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :total="1000"
          :page-size="10"
          class="smart-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import {getOrderList} from "@/api/order"
import {ref} from "vue";
import {ElMessage} from "element-plus";

const default_nav = ref("80")
const orderList = ref([])
const search = ref({
  orderNo: ""
})

const initData = () => {
  orderList.value = getOrderList()
}

initData()

const toSearch = () => {
  ElMessage({
    message: "后台无数据",
    showClose: true,
    duration: 3000,
    type: "error"
  })
}

const changeTab = (tab) => {
  let tabName = tab.props.name
  initData()
  if (tabName === "80") {
    return
  }
  let list = []
  for (let i = 0; i < orderList.value.length; i++) {
    if (tabName === (orderList.value[i].status + "")) {
      list.push(orderList.value[i])
    }
  }
  orderList.value = list
}

const sendProduct = (index) => {
  orderList.value[index].status = 40
}

</script>

<style lang="scss" scoped>
.order-management {
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 24px;
}

.status-nav {
  flex: 1;
  
  :deep(.el-radio-group) {
    display: flex;
    gap: 8px;
  }
  
  .el-radio-button {
    --el-radio-button-checked-bg-color: #{rgba(76, 175, 80, 0.1)};
    --el-radio-button-checked-text-color: #4caf50;
    --el-radio-button-checked-border-color: #4caf50;
    
    .el-radio-button__inner {
      border-radius: 6px !important;
      padding: 8px 20px;
      transition: all 0.3s ease;
      
      &:hover {
        color: #4caf50;
      }
    }
  }
}

.search-area {
  display: flex;
  gap: 12px;
  width: 400px;

  .search-input {
    flex: 1;
    
    :deep(.el-input__inner) {
      border-radius: 6px;
      padding-left: 34px;
    }
    
    .search-icon {
      color: #999;
      margin-left: 8px;
    }
  }
  
  .search-btn {
    border-radius: 6px;
    padding: 10px 24px;
    background: linear-gradient(45deg, #4caf50, #81c784);
    border: none;
    transition: all 0.3s;
    
    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
}

.data-container {
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  
  :deep(th) {
    background: #f8fafc !important;
    color: #333;
    font-weight: 600;
  }
  
  .index-number {
    color: #666;
    font-weight: 500;
  }
  
  .price {
    color: #e6a23c;
    font-weight: 500;
  }
  
  .total-amount {
    color: #4caf50;
    font-weight: 600;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.8);
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  
  .action-btns {
    display: flex;
    gap: 12px;
    
    .view-btn {
      color: #4caf50 !important;
    }
    
    .send-btn {
      color: #67c23a !important;
    }
  }
}

.pagination-wrapper {
  padding: 16px;
  background: #f8fafc;
  
  .smart-pagination {
    justify-content: flex-end;
    
    :deep(.btn-prev),
    :deep(.btn-next) {
      border-radius: 6px;
    }
    
    :deep(.number) {
      border-radius: 6px;
      transition: all 0.3s;
      
      &:hover {
        color: #4caf50;
      }
    }
    
    :deep(.active) {
      background: #4caf50 !important;
      border-color: #4caf50;
    }
  }
}

@media (max-width: 1200px) {
  .operation-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-area {
    width: 100%;
  }
  
  .data-table {
    overflow-x: auto;
    
    :deep(.el-table__body-wrapper) {
      min-width: 1200px;
    }
  }
}

@media (max-width: 768px) {
  .order-management {
    padding: 16px;
  }
  
  .status-nav {
    :deep(.el-radio-button) {
      flex: 1;
      
      .el-radio-button__inner {
        padding: 8px 12px;
        font-size: 13px;
      }
    }
  }
  
  .search-btn {
    padding: 10px 16px !important;
  }
}
</style>

