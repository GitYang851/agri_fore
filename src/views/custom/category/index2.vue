<template>
  <!-- 添加外层容器限制最大宽度并居中 -->
  <el-container class="container">
    <el-header height="auto" class="header">
      <!-- 改为自适应高度 -->
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品..."
          clearable
          class="search-input"
          @change="filterProducts"
        >
          <template #prefix>
            <el-icon><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="category-filter">
        <!-- 改用element的栅格系统 -->
        <el-row :gutter="20" class="category-list">
          <el-col
            v-for="category in categoryList"
            :key="category.id"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
            class="category-col"
          >
            <div class="category-item">
              <!-- 添加hover效果 -->
              <span class="category-name" @click="getCategoryById(category.id)">
                {{ category.name }}
                <el-icon><arrow-right /></el-icon>
              </span>
              <div class="sub-category">
                <span
                  v-for="child in category.child"
                  :key="child.id"
                  class="sub-category-name"
                  @click.stop="getCategoryById(child.id)"
                >
                  {{ child.name }}
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <!-- 改用element的栅格系统保持一致性 -->
      <el-row :gutter="20">
        <el-col
          v-for="product in productList"
          :key="product.productId"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
        >
          <el-card class="product-card" shadow="hover" @click="toProductDetail(product.productId)">
            <div class="product-image-wrapper">
              <!-- 添加加载失败处理 -->
              <img
                :src="getProductImageUrl(product.productId)"
                class="product-image"
                alt="商品图片"
              />
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.productName }}</h3>
              <div class="price-section">
                <span class="product-price">￥{{ product.price }}</span>
                <el-tag v-if="product.stock < 10" type="danger" effect="plain" size="small">
                  仅剩{{ product.stock }}件
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
// 新增图标引入
import { ArrowRight } from '@element-plus/icons-vue'
import { getCategoryList } from '@/api/category'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { listAllProducts, getProduct } from '@/api/product2'
const router = useRouter()
const categoryList = ref([])
const productList = ref([])

//下载图片
const getProductImageUrl = (productId) => {
  // 添加时间戳参数避免缓存问题
  return `/product/downloadPicture/${productId}?t=${Date.now()}`
}
const initData = () => {
  categoryList.value = getCategoryList()

  listAllProducts().then((response) => {
    productList.value = response.data
  })
}

initData()

const getCategoryById = (id) => {
  router.push({ path: '/category', query: { id: id } })
}

const toProductDetail = (id) => {
  router.push({ path: '/product', query: { id: id } })
}

// 添加图片加载失败处理
// const handleImageError = (e) => {
//   e.target.src = require('@/assets/goods/error-image.png')
// }
</script>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin-left: 40px;
}

.search-container .search-input .el-input__wrapper {
  border-radius: 24px;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 分类筛选区域优化 */
.category-filter {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-col {
  margin-bottom: 16px;
}

.category-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid transparent;
}

.category-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.category-name {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.category-name .el-icon {
  margin-left: auto;
  transition: transform 0.3s;
}

.category-item:hover .el-icon {
  transform: translateX(3px);
}

.sub-category {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #eee;
}

.sub-category-name {
  display: block;
  font-size: 12px;
  padding: 4px 0;
  color: #666;
  transition: all 0.2s;
}

.sub-category-name:hover {
  color: var(--el-color-primary);
  transform: translateX(4px);
}

/* 商品卡片优化 */
.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 保持正方形比例 */
  position: relative;
}

.product-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  padding: 16px 0 0;
}

.product-title {
  font-size: 14px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.product-price {
  color: #ff4444;
  font-size: 16px;
  font-weight: bold;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .category-filter {
    padding: 10px;
  }

  .category-name {
    font-size: 13px;
  }

  .sub-category-name {
    font-size: 12px;
  }
}
</style>
