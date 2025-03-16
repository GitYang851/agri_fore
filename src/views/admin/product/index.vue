<template>
  <div class="product-management">
    <!-- 操作头部 -->
    <div class="operation-header">
      <!-- 状态导航 -->
      <div class="status-nav">
        <el-radio-group v-model="default_nav" @change="changeTab" class="status-group">
          <el-radio-button label="30">全部商品</el-radio-button>
          <el-radio-button label="10">已下架</el-radio-button>
          <el-radio-button label="20">已上架</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 操作按钮 -->
      <el-button type="primary" class="add-btn" @click="dialogFormVisible = true">
        <el-icon class="mr-1">
          <Plus />
        </el-icon>
        新增商品
      </el-button>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input v-model="search" placeholder="搜索商品名称" clearable class="search-input" @keyup.enter="toSearch">
          <template #prefix>
            <el-icon class="search-icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" class="search-btn" @click="toSearch">
          查询
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-container">
      <el-table :data="paginatedProductList" border stripe highlight-current-row class="data-table">
        <el-table-column label="序号" width="80" align="center">
          <template #default="{ $index }">
            <span class="index-number">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="商品名称" min-width="180" show-overflow-tooltip />

        <el-table-column label="价格" width="120" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品图片" width="140" align="center">
          <template #default="{ row }">
            <div class="image-wrapper">
              <el-image :src="getCachedImageUrl(row.productId)" :preview-src-list="[getCachedImageUrl(row.productId)]"
                fit="cover" class="product-image">
                <template #error>
                  <div class="image-error">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="stock" label="库存" width="100" align="center" />

        <el-table-column prop="description" label="商品描述" min-width="200" show-overflow-tooltip />

        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row, $index }">
            <div class="action-btns">
              <el-button type="primary" link class="view-btn" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button v-if="row.status === 20" type="danger" link class="down-btn" @click="downSeal($index)">
                下架
              </el-button>
              <el-button v-if="row.status === 10" type="success" link class="up-btn" @click="upSeal($index)">
                上架
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination background layout="prev, pager, next, total" :total="total" :page-size="pageSize"
          :current-page="currentPage" @current-change="handleCurrentChange" class="smart-pagination" />
      </div>
    </div>

    <!-- 新增商品弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="新增商品" width="800px" class="product-dialog">
      <el-form :model="newProduct" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="newProduct.productName" placeholder="请输入商品名称" clearable />
            </el-form-item>

            <el-form-item label="商品价格">
              <el-input-number v-model="newProduct.price" :precision="2" :min="0.01" :max="10000"
                controls-position="right" class="full-width" />
            </el-form-item>

            <el-form-item label="商品库存">
              <el-input-number v-model="newProduct.stock" :min="1" :max="100000" controls-position="right"
                class="full-width" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="商品图片">
              <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1"
                :on-change="handleFileChange" class="image-uploader">
                <el-icon class="upload-icon">
                  <Plus />
                </el-icon>
                <template #file="{ file }">
                  <img :src="file.url" class="upload-image" />
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品描述">
          <el-input v-model="newProduct.description" type="textarea" :rows="4" placeholder="请输入商品详细描述" maxlength="150"
            show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" v-model="editDialogVisible">
      <el-form :model="editProduct">
        <el-form-item label="商品名">
          <el-input v-model="editProduct.productName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number v-model="editProduct.price" :precision="2" :step="0.01" :min="0.01"></el-input-number>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" accept=".jpg,.png" :multiple="false"
            :limit="1" @change="handleFileChange">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="商品库存">
          <el-input-number v-model="editProduct.stock" :min="0" :step="1"></el-input-number>
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="editProduct.description"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  listAllProduct,
  addproduct,
  searchProducts,
  uploadPicture,
  editProductById,
} from '@/api/product2'

const default_nav = ref('30')
const dialogFormVisible = ref(false)
const dialogImageUrl = ref('')
const newProduct = ref({
  productName: '',
  price: 0,
  stock: 0,
  categoryId: 1,
  decription: '',
})
//图片缓存
const imageCache = reactive({})
// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)

const search = ref('')
const productList = ref([])
// 计算总条数
const total = computed(() => productList.value.length)

// 计算分页后的数据
const paginatedProductList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return productList.value.slice(start, end)
})

// 页码改变处理
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}
const selectedFile = ref(null) // 保存选中的文件

const handleFileChange = (file) => {
  selectedFile.value = file.raw // 保存选中的文件
}

const initData = () => {
  listAllProduct().then((response) => {
    productList.value = response.data
  })
}

initData()

//搜索功能
function toSearch() {
  currentPage.value = 1
  try {
    searchProducts(search.value).then((response) => {
      productList.value = response.data
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

function getCachedImageUrl(productId) {
  if (!imageCache[productId]) {
    const imageUrl = `/dev-api/product/downloadPicture/${productId}`
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      imageCache[productId] = imageUrl
    }
    return imageUrl
  }
  return imageCache[productId]
}

const changeTab = (tab) => {
  currentPage.value = 1
  initData()
  let tabName = tab.props.name
  if (tabName === '30') {
    return
  }
  let list = []
  for (let i = 0; i < productList.value.length; i++) {
    if (tabName === productList.value[i].status + '') {
      list.push(productList.value[i])
    }
  }
  productList.value = list
}

const upSeal = (index) => {
  productList.value[index].status = 10
}

const downSeal = (index) => {
  productList.value[index].status = 20
}

const submitEditForm = async () => {
  editProductById(editProduct.value).then((response) => {
    if (response.code === 200) {
      ElMessage.success('编辑商品成功')
      if (selectedFile.value) {
        initData()
        uploadPicture(editProduct.value.productId, selectedFile.value)
        ElMessage.success('商品图片上传成功')
      }
    }
    // 关闭对话框
    editDialogVisible.value = false
    // 清空表单
    editProduct.value = {
      productId: '',
      productName: '',
      price: 0.01,
      stock: 1,
      categoryId: 1,
      description: '',
      image: '',
    }
    selectedFile = ref(null)
  })
}

//添加商品
const submitForm = async () => {
  try {
    addproduct(newProduct.value).then((response) => {
      if (response.code === 200) {
        initData()
        ElMessage.success('添加商品成功')
        if (selectedFile.value) {
          uploadPicture(response.data, selectedFile.value)
          ElMessage.success('商品图片上传成功')
        }
      }
    })
    // 关闭对话框
    dialogFormVisible.value = false
    // 清空表单
    newProduct.value = {
      productName: '',
      price: 0.01,
      stock: 1,
      decription: '',
    }
    selectedFile = ref(null)
  } catch (error) {
    ElMessage.error(' 添加商品失败', error)
  }
}

// 新增编辑相关状态
const editDialogVisible = ref(false)
const editProduct = ref({
  productId: '',
  productName: '',
  price: 0.01,
  stock: 1,
  categoryId: 1,
  description: '', // 修正拼写错误
  image: '',
})
// 新增编辑方法
const handleEdit = (row) => {
  editProduct.value = { ...row }
  // 处理图片显示
  editDialogVisible.value = true
}
</script>
<style lang="scss" scoped>
.product-management {
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.operation-header {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.status-nav {
  flex: 1;
  min-width: 400px;

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
    }
  }
}

.add-btn {
  background: linear-gradient(45deg, #4caf50, #81c784);
  border: none;
  padding: 10px 24px;
  transition: all 0.3s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.search-area {
  display: flex;
  gap: 12px;
  min-width: 400px;
  flex: 1;

  .search-input {
    flex: 1;

    :deep(.el-input__inner) {
      border-radius: 6px;
      padding-left: 34px;
    }
  }

  .search-btn {
    background: linear-gradient(45deg, #4caf50, #81c784);
    border: none;
    padding: 10px 24px;
  }
}

.data-container {
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  :deep {
    th {
      background: #f8fafc !important;
      font-weight: 600;
      padding: 16px 0;
    }

    td {
      padding: 12px 0;
      vertical-align: middle;
    }

    .el-table__cell {

      // 图片列特殊样式
      &:nth-child(4) {
        padding: 16px 0;
        min-width: 140px;
      }
    }
  }

  .price {
    color: #e6a23c;
    font-weight: 500;
  }

  .product-image {
    width: 80px;
    height: 80px;
    margin: 8px auto;
    display: block;
    border-radius: 6px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(2);
      margin: 20px auto;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .action-btns {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;

    .view-btn {
      color: #4caf50;
    }

    .up-btn {
      color: #67c23a;
    }

    .down-btn {
      color: #f56c6c;
    }
  }
}

.pagination-wrapper {
  padding: 16px;
  background: #f8fafc;

  .smart-pagination {
    :deep(.active) {
      background: #4caf50 !important;
    }
  }
}

.product-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;

    .image-uploader {
      .el-upload {
        border: 2px dashed #dcdfe6;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          border-color: #4caf50;
        }
      }

      .upload-icon {
        font-size: 24px;
        color: #666;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

// 图片预览优化
:deep(.el-image-viewer__wrapper) {
  .el-image-viewer__mask {
    background: rgba(0, 0, 0, 0.85);
  }

  .el-image-viewer__btn {
    color: #fff;
  }

  img {
    max-width: 70vw;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }
}

@media (max-width: 768px) {
  .operation-header {
    gap: 16px;
  }

  .status-nav,
  .search-area {
    min-width: 100%;
  }

  .data-table {
    :deep(.el-table__body-wrapper) {
      overflow-x: auto;

      .el-table__cell {
        &:nth-child(4) {
          // 图片列
          min-width: 120px;
          padding: 12px 0;
        }
      }
    }

    .product-image {
      width: 60px;
      height: 60px;

      &:hover {
        transform: scale(1.8);
        margin: 15px auto;
      }
    }
  }

  .product-dialog {
    :deep(.el-dialog) {
      width: 90% !important;
    }
  }
}
</style>