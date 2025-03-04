<template>
  <el-container class="container">
    <el-header height="auto" class="header">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索商品..."
          clearable
          class="search-input"
          @keydown.enter="filterProducts"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="category-filter">
        <el-scrollbar>
          <div class="category-scroll">
            <div
              v-for="category in categoryList"
              :key="category.id"
              class="category-item"
              @click="getCategoryById(category.id)"
            >
              <div class="category-content">
                <span class="category-name">
                  {{ category.name }}
                  <el-icon class="arrow-icon"><ArrowRight /></el-icon>
                </span>
                <div class="sub-category">
                  <span
                    v-for="child in category.child"
                    :key="child.id"
                    class="sub-category-item"
                    @click.stop="getCategoryById(child.id)"
                  >
                    {{ child.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-header>

    <el-main>
      <el-row :gutter="20" class="product-list">
        <el-col
          v-for="product in productList"
          :key="product.productId"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
        >
          <el-card class="product-card" shadow="hover" @click="toProductDetail(product.productId)">
            <div class="image-wrapper">
              <img
                :src="`/dev-api/product/downloadPicture/${product.productId}`"
                class="product-image"
                alt="商品图片"
              />
            </div>
            <div class="product-content">
              <h3 class="product-title">{{ product.productName }}</h3>
              <div class="product-footer">
                <span class="price">￥{{ product.price }}</span>
                <el-tag v-if="product.stock < 10" type="danger" effect="plain" size="small">
                  仅剩{{ product.stock }}件
                </el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 16, 24]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
// 保持原有 script 代码完全不变
import { ArrowRight } from '@element-plus/icons-vue'
import { getCategoryList } from '@/api/category'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { listAllProducts, getProduct, searchProducts } from '@/api/product2'
const router = useRouter()
const categoryList = ref([])
const productList = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const total = ref(0)
const searchQuery = ref('')
const initData = () => {
  categoryList.value = getCategoryList()

  listAllProducts({ pageNum: currentPage.value, pageSize: pageSize.value }).then((response) => {
    productList.value = response.data.list
    total.value = response.data.total
  })
}

initData()
//搜索
const filterProducts = () => {
  searchProducts(searchQuery.value).then((response) => {
    productList.value = response.data
  })
}

//处理分页
// 修改分页处理方法
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 切换每页大小时重置到第一页
  initData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  initData()
}

const getCategoryById = (id) => {
  router.push({ path: '/category', query: { id: id } })
}

const toProductDetail = (id) => {
  router.push({ path: '/product', query: { id: id } })
}
</script>

<style scoped>
/* 优化后的样式 */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  max-width: 800px;
  margin: 20px auto;
  position: relative;
}
.pagination-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 28px;
  padding: 12px 24px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.category-filter {
  margin: 24px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
}

.category-scroll {
  display: flex;
  padding: 12px;
  gap: 16px;
}

.category-item {
  flex: 0 0 auto;
  width: 220px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.category-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  font-size: 15px;
}

.arrow-icon {
  margin-left: auto;
  transition: transform 0.3s;
}

.category-item:hover .arrow-icon {
  transform: translateX(4px);
}

.sub-category {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sub-category-item {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  transition: all 0.2s;
}

.sub-category-item:hover {
  background: #409eff;
  color: white;
}

.product-list {
  margin-top: 20px;
}

.product-card {
  border: none !important;
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f7fa;
}

.product-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-content {
  padding: 16px !important;
}

.product-title {
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.4;
  height: 42px;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.price {
  color: #ff4444;
  font-size: 18px;
  font-weight: 700;
}

.el-tag {
  border-radius: 6px !important;
}

@media (max-width: 768px) {
  .container {
    padding: 12px;
  }

  .category-item {
    width: 180px;
    padding: 12px;
  }

  .product-title {
    font-size: 14px;
    -webkit-line-clamp: 1;
    height: auto;
  }

  .price {
    font-size: 16px;
  }
}
</style>
