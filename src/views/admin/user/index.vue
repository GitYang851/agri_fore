<template>
  <div class="user-management">
    <!-- 操作头部 -->
    <div class="operation-header">
      <!-- 状态导航 -->
      <div class="status-nav">
        <el-radio-group 
          v-model="default_nav" 
          @change="changeTab"
          class="status-group"
        >
          <el-radio-button label="50">全部用户</el-radio-button>
          <el-radio-button label="20">已封禁</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 搜索区域 -->
      <div class="search-area">
        <el-input
          v-model="search.username"
          placeholder="输入用户账号搜索"
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
        :data="userList"
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
          prop="username"
          label="用户账号"
          min-width="180"
          show-overflow-tooltip
        />

        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="150"
        />

        <el-table-column
          label="用户头像"
          width="140"
          align="center"
        >
          <template #default="{ row }">
            <el-image 
              :src="require('@/assets/avatar/'+row.avatar)"
              :preview-src-list="[require('@/assets/avatar/'+row.avatar)]"
              fit="cover"
              class="user-avatar"
            >
              <template #error>
                <div class="avatar-error">
                  <el-icon><User /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
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
                v-if="row.status === 10"
                type="danger"
                link
                class="lock-btn"
                @click="lockUser($index)"
              >
                封禁
              </el-button>
              <el-button
                v-if="row.status === 20"
                type="warning"
                link
                class="unlock-btn"
                @click="unLockUser($index)"
              >
                解封
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
          class="smart-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserList } from '@/api/user'

const default_nav = ref("50")
const userList = ref([])
const search = ref({
  username: ""
})

const initData = () => {
  userList.value = getUserList()
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

const lockUser = (index) => {
  userList.value[index].status = 20
  ElMessage.success("操作成功")
}

const unLockUser = (index) => {
  userList.value[index].status = 10
  ElMessage.success("操作成功")
}

const changeTab = () => {
  initData()
  if (default_nav.value === "50") return
  
  userList.value = userList.value.filter(
    item => item.status.toString() === default_nav.value
  )
}
</script>

<style lang="scss" scoped>
.user-management {
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
}

.status-nav {
  flex: 1;
  min-width: 300px;
  
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
  :deep(th) {
    background: #f8fafc !important;
    font-weight: 600;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(2);
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  
  .action-btns {
    display: flex;
    gap: 12px;
    
    .view-btn { color: #4caf50; }
    .lock-btn { color: #f56c6c; }
    .unlock-btn { color: #e6a23c; }
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
    }
  }
  
  .search-btn {
    padding: 10px 16px !important;
  }
}
</style>