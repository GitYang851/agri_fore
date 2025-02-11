<template>
    <div class="personal-center">
      <!-- 用户信息板块 -->
      <el-card class="user-info">
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="user-details">
            <h2>{{ user.nickname }}</h2>
            <p>{{ user.phone }}</p>
          </div>
        </div>
      </el-card>
  
      <!-- 订单板块 -->
      <el-card class="order-section">
        <template #header>
          <div class="card-header">
            <span>我的购买记录</span>
            <el-link type="primary" @click="viewAllOrders">查看全部</el-link>
          </div>
        </template>
        <el-table :data="recentOrders" style="width: 100%">
          <el-table-column prop="orderId" label="订单号" width="180" />
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button link type="primary" @click="viewOrderDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- 收藏板块 -->
      <el-card class="favorites-section">
        <template #header>
          <div class="card-header">
            <span>我的收藏</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in favorites" :key="item.id">
            <el-card class="product-card">
              <img :src="item.image" class="product-image" />
              <h4>{{ item.name }}</h4>
              <p class="price">¥{{ item.price }}</p>
              <el-button type="danger" size="small" @click="removeFavorite(item.id)">
                取消收藏
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
  
      <!-- 地址管理 -->
      <el-card class="address-section">
        <template #header>
          <div class="card-header">
            <span>收货地址</span>
            <el-button type="primary" @click="showAddressDialog">新增地址</el-button>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="8" v-for="addr in addresses" :key="addr.id">
            <el-card class="address-card">
              <div class="address-header">
                <span>{{ addr.consignee }}</span>
                <el-tag v-if="addr.isDefault" type="success">默认地址</el-tag>
              </div>
              <p>{{ addr.phone }}</p>
              <p>{{ addr.fullAddress }}</p>
              <div class="address-actions">
                <el-button link type="primary" @click="editAddress(addr)">编辑</el-button>
                <el-button link type="danger" @click="deleteAddress(addr.id)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
  
      <!-- 地址编辑对话框 -->
      <el-dialog v-model="addressDialogVisible" :title="isEditingAddress ? '编辑地址' : '新增地址'">
        <el-form :model="currentAddress" label-width="80px">
          <el-form-item label="收货人" required>
            <el-input v-model="currentAddress.consignee" />
          </el-form-item>
          <el-form-item label="手机号" required>
            <el-input v-model="currentAddress.phone" />
          </el-form-item>
          <el-form-item label="详细地址" required>
            <el-input v-model="currentAddress.fullAddress" type="textarea" />
          </el-form-item>
          <el-form-item label="默认地址">
            <el-switch v-model="currentAddress.isDefault" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  
  // 用户信息
  const user = reactive({
    avatar: 'https://example.com/avatar.jpg',
    nickname: '农场小达人',
    phone: '138-1234-5678'
  })
  
  // 最近订单
  const recentOrders = ref([
    {
      orderId: '202312345678',
      productName: '有机苹果',
      status: '已发货',
      amount: '¥99.00'
    },
    // 更多订单数据...
  ])
  
  // 收藏商品
  const favorites = ref([
    {
      id: 1,
      name: '有机大米',
      price: 45.8,
      image: 'https://example.com/rice.jpg'
    },
    // 更多收藏数据...
  ])
  
  // 地址管理
  const addresses = ref([
    {
      id: 1,
      consignee: '张三',
      phone: '13800001111',
      fullAddress: '北京市朝阳区XXX街道XX号',
      isDefault: true
    },
    // 更多地址数据...
  ])
  
  // 地址对话框相关
  const addressDialogVisible = ref(false)
  const isEditingAddress = ref(false)
  const currentAddress = reactive({
    id: null,
    consignee: '',
    phone: '',
    fullAddress: '',
    isDefault: false
  })
  
  // 方法
  const handleAvatarSuccess = (res) => {
    user.avatar = res.data.url
    ElMessage.success('头像更新成功')
  }
  
  const viewAllOrders = () => {
    // 跳转到订单页面
  }
  
  const getStatusType = (status) => {
    const statusMap = {
      '待付款': 'warning',
      '已发货': 'success',
      '已完成': 'info'
    }
    return statusMap[status] || ''
  }
  
  const removeFavorite = (id) => {
    favorites.value = favorites.value.filter(item => item.id !== id)
  }
  
  const showAddressDialog = () => {
    resetAddressForm()
    addressDialogVisible.value = true
    isEditingAddress.value = false
  }
  
  const editAddress = (addr) => {
    Object.assign(currentAddress, addr)
    addressDialogVisible.value = true
    isEditingAddress.value = true
  }
  
  const saveAddress = () => {
    if (isEditingAddress.value) {
      // 更新地址
      const index = addresses.value.findIndex(a => a.id === currentAddress.id)
      addresses.value.splice(index, 1, {...currentAddress})
    } else {
      // 新增地址
      addresses.value.push({
        ...currentAddress,
        id: Date.now()
      })
    }
    addressDialogVisible.value = false
  }
  
  const deleteAddress = (id) => {
    addresses.value = addresses.value.filter(a => a.id !== id)
  }
  
  const resetAddressForm = () => {
    Object.assign(currentAddress, {
      id: null,
      consignee: '',
      phone: '',
      fullAddress: '',
      isDefault: false
    })
  }
  </script>
  
  <style scoped>
  .personal-center {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
  }
  
  .avatar-section {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed var(--el-border-color);
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .product-card {
    margin-bottom: 20px;
    transition: transform 0.3s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  
  .price {
    color: var(--el-color-primary);
    font-size: 16px;
    margin: 10px 0;
  }
  
  .address-card {
    margin-bottom: 20px;
  }
  
  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .address-actions {
    margin-top: 15px;
    text-align: right;
  }
  </style>