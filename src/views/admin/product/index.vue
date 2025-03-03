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
      <el-table :data="paginatedProductList" border style="width: 100%">
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
              <img :src="getCachedImageUrl(row.productId)" style="width: 100px;" />
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
            <el-button v-if="scope.row.status === 20" link size="small" style="color: #e55757"
              @click="upSeal(scope.$index)">上架
            </el-button>
            <el-button v-if="scope.row.status === 10" link size="small" @click="downSeal(scope.$index)">下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
        :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
    </div>

    <!--  添加商品  -->
    <el-dialog title="添加商品" v-model="dialogFormVisible">
      <el-form :model="newProduct">
        <el-form-item label="商品名">
          <el-input type="text" minlength="1" maxlength="3" v-model="newProduct.productName"
            autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="商品价格">
          <el-input-number v-model="newProduct.price" :precision="2" :step="0.01" :min="0.01" :max="1000000000"
            autocomplete="off"></el-input-number>
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
          <el-input-number v-model="newProduct.stock" :precision="0" :step="1" :min="1" :max="100000"
            autocomplete="off"></el-input-number>
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input type="textarea" minlength="1" maxlength="150" v-model="newProduct.description"
            autocomplete="off"></el-input>
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
import { ref,computed,reactive   } from 'vue'
import { ElMessage } from 'element-plus'
import { listAllProducts, addproduct, searchProducts, uploadPicture, editProductById } from '@/api/product2'

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
  listAllProducts().then((response) => {
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
