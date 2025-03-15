<template>
  <el-container class="main-container">
    <el-aside width="240px" class="side-menu">
      <div class="category-content">
        <div v-for="category in categoryList" :key="category.id" class="category-group">
          <div class="parent-category" @click="getCategoryById(category.id)">
            <el-icon><arrow-right /></el-icon>
            {{ category.name }}
          </div>
          <div class="child-categories">
            <span
              v-for="child in category.child"
              :key="child.id"
              class="child-category"
              @click="getCategoryById(child.id)"
            >
              {{ child.name }}
            </span>
          </div>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="main-header">
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
      </el-header>

      <el-main class="product-container">
        <!-- 添加轮播图 -->
        <el-carousel :interval="5000" arrow="always" class="carousel">
          <el-carousel-item v-for="(item, index) in carouselList" :key="index">
            <img :src="item.image" class="carousel-image" />
            <div class="carousel-caption">{{ item.caption }}</div>
          </el-carousel-item>
        </el-carousel>
        <h2>猜你喜欢</h2>
        <el-row :gutter="24">
          <el-col
            v-for="product in productList"
            :key="product.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <el-card
              shadow="hover"
              class="product-card"
              @click="toProductDetail(product.productId)"
            >
              <div class="image-wrapper">
                <img
                  :src="`/dev-api/product/downloadPicture/${product.productId}`"
                  class="product-image"
                  alt="商品图片"
                />
                <div class="hot-tag">热卖</div>
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ product.productName }}</h3>
                <div class="price-section">
                  <span class="price-symbol">¥</span>
                  <span class="product-price">{{ product.price }}</span>
                </div>
                <el-button type="primary" size="small" class="add-cart-btn"> 加入购物车 </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>

      <el-footer class="main-footer"> </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
// 原有脚本部分保持不变，仅添加图标引入
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { getRecommend } from '@/api/product2'
import { getProductList, getWarpList } from '@/api/home'
import { getCategoryList } from '@/api/category'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const warpList = ref([])
const productList = ref([])
const categoryList = ref([])
const initData = () => {
  warpList.value = getWarpList()
  categoryList.value = getCategoryList()
  getRecommend().then((response) => {
    productList.value = response.data
  })
}

const carouselList = ref([
  {
    image: '@/assets/swapper/num1.png',
    caption: '夏季新品上线',
  },
  {
    image: '@/assets/swapper/num2.png',
    caption: '限时折扣活动',
  },
])

initData()

const toProductDetail = (id) => {
  router.push({ path: '/product', query: { id: id } })
}
const getCategoryById = (id) => {
  router.push({ path: '/category', query: { id: id } })
}
</script>

<style scoped lang="scss">
.main-container {
  height: 100vh;
  background: #f5f7fa;
}

.side-menu {
  background: #ffffff;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  padding: 20px 0;

  .category-group {
    padding: 8px 20px;

    .parent-category {
      font-weight: 600;
      color: #333;
      padding: 10px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;

      &:hover {
        background: #f0f9eb;
        color: #67c23a;
      }

      .el-icon {
        margin-right: 8px;
      }
    }

    .child-categories {
      padding-left: 28px;

      .child-category {
        display: block;
        padding: 8px 12px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;

        &:hover {
          background: #f5f7fa;
          color: #409eff;
        }
      }
    }
  }
}

.main-header {
  height: 80px;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  .search-container {
    width: 100%;
    max-width: 600px;
    margin-left: 40px;

    .search-input {
      :deep(.el-input__wrapper) {
        border-radius: 24px;
        padding: 0 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.product-container {
  padding: 30px 40px;

  .product-card {
    margin-bottom: 24px;
    transition: transform 0.3s;
    border: none;

    &:hover {
      transform: translateY(-5px);
    }

    .image-wrapper {
      position: relative;
      padding-top: 100%;
      overflow: hidden;

      .product-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }

      .hot-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f56c6c;
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
      }
    }

    .product-info {
      padding: 20px;

      .product-title {
        font-size: 16px;
        height: 44px;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .price-section {
        margin-bottom: 15px;
        .price-symbol {
          color: #f56c6c;
          font-size: 18px;
        }
        .product-price {
          color: #f56c6c;
          font-size: 24px;
          font-weight: 700;
        }
      }

      .add-cart-btn {
        width: 100%;
        border-radius: 20px;
      }
    }
  }
}

.main-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #666;
  font-size: 14px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
}

.carousel {
  width: 100%;
  margin-bottom: 30px;

  .carousel-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    display: block;
  }

  .carousel-caption {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    font-size: 24px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 5px;
  }

  ::v-deep(.el-carousel__indicator) {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0 5px;
  }

  ::v-deep(.el-carousel__arrow) {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    border-radius: 5px;
  }
}
</style>
