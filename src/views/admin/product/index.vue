<template>
  <div class="container">
    <div class="admin-header">
      <div class="admin-nav">
        <el-tabs v-model="default_nav" @tab-click="changeTab">
          <el-tab-pane label="商品列表" name="30">商品列表</el-tab-pane>
          <el-tab-pane label="下架商品" name="10">下架商品</el-tab-pane>
          <el-tab-pane label="上架商品" name="20">上架商品</el-tab-pane>
        </el-tabs>
      </div>
      <div class="admin-options">
        <el-button @click="dialogFormVisible = true">添加商品</el-button>
      </div>
      <div class="admin-search">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="search" placeholder="商品名" clearable @input="toSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="admin-content">
      <el-table :data="productList" border style="width: 100%">
        <el-table-column fixed prop="index" label="序号" width="50">
          <template v-slot="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="商品名" show-overflow-tooltip width="150">
        </el-table-column>

        <el-table-column prop="price" label="商品价格" width="120"> </el-table-column>

        <el-table-column prop="image" label="商品图片" width="120">
          <template v-slot="{ row }">
            <div class="image-container">
              <img
                :src="imageCache[row.id] || '/loading.gif'"
                @load="loadProductImage(1)"
                @error="handleImageError"
                class="product-image"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="stock" label="商品库存" width="120"> </el-table-column>

        <el-table-column prop="description" label="描述" show-overflow-tooltip width="200">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template v-slot="scope">
            <el-button link size="small">查看</el-button>
            <el-button link size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 20"
              link
              size="small"
              style="color: #e55757"
              @click="upSeal(scope.$index)"
              >上架
            </el-button>
            <el-button
              v-if="scope.row.status === 10"
              link
              size="small"
              @click="downSeal(scope.$index)"
              >下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="1000"> </el-pagination>
    </div>

    <!--  添加商品  -->
    <el-dialog title="上架商品" v-model="dialogFormVisible">
      <el-form :model="newProduct">
        <el-form-item label="商品名">
          <el-input
            type="text"
            minlength="1"
            maxlength="3"
            v-model="newProduct.productName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number
            v-model="newProduct.price"
            :precision="2"
            :step="0.01"
            :min="0.01"
            :max="1000000000"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            accept=".jpg,.png"
            :multiple="false"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="商品库存">
          <el-input-number
            v-model="newProduct.stock"
            :precision="0"
            :step="1"
            :min="1"
            :max="100000"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            minlength="1"
            maxlength="150"
            v-model="newProduct.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品" v-model="editDialogVisible">
      <el-form :model="editProduct">
        <el-form-item label="商品名">
          <el-input v-model="editProduct.productName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number
            v-model="editProduct.price"
            :precision="2"
            :step="0.01"
            :min="0.01"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList">
            <i class="el-icon-plus"></i>
            <template #file="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            </template>
          </el-upload>
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
import { ref, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { listAllProducts, addproduct, searchProducts, downloadPicture } from '@/api/product2'

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

const search = ref('')
const productList = ref([])

const initData = () => {
  listAllProducts().then((response) => {
    productList.value = response.data
  })
}

initData()

//搜索功能
function toSearch() {
  try {
    searchProducts(search.value).then((response) => {
      productList.value = response.data
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

const changeTab = (tab) => {
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

//下载图片
// 商品图片缓存对象
const imageCache = ref({})

// 获取图片方法
const loadProductImage = (product) => {
  try {
    // 先检查缓存
    if (imageCache.value[product.id]) {
      return imageCache.value[product.id]
    }

    // 发起请求
    const response = downloadPicture(product.id)

    // 创建Blob URL
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const imageUrl = URL.createObjectURL(blob)

    // 加入缓存
    imageCache.value[product.id] = imageUrl
  } catch (error) {
    console.error('图片加载失败:', error)

    return '/default-product.jpg' // 默认图片
  }
}

// 组件卸载时释放内存
onBeforeUnmount(() => {
  Object.values(imageCache.value).forEach((url) => URL.revokeObjectURL(url))
})

//添加商品
const submitForm = async () => {
  try {
    const response = addproduct(newProduct.value)
    ElMessage.success(' 添加商品成功', response.data)
    // 关闭对话框
    dialogFormVisible.value = false
    // 清空表单
    newProduct.value = {
      productName: '',
      price: 0.01,
      stock: 1,
      decription: '',
    }
  } catch (error) {
    ElMessage.error(' 添加商品失败', error)
  }
}

// 新增编辑相关状态
const editDialogVisible = ref(false)
const editProduct = ref({
  id: '',
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

<style scoped>
.admin-header {
  display: flex;
}

.admin-nav {
  border: 1px solid #666666;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  margin-right: 20px;
}

.admin-options {
  border: 1px solid #666666;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  margin-right: 20px;
}

.admin-search {
  border: 1px solid #666666;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.admin-content {
  margin-top: 20px;
  border: 1px solid #666666;
  padding: 20px;
  border-radius: 10px;
  width: 1580px;
}

.el-pagination {
  margin: 20px;
}
</style>
