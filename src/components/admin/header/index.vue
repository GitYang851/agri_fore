<template>
  <div class="admin-header">
    <div class="header-container">
      <!-- 左侧Logo -->
      <div class="header-left">
        <router-link to="/" class="logo-link">
          <img class="header-logo" src="@/assets/logo.jpg" alt="系统Logo" />
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <div class="header-nav">
        <router-link 
          to="/" 
          class="nav-item"
          :class="{ 'nav-active': $route.path === '/' }"
        >
          商城管理
        </router-link>
      </div>

      <!-- 右侧用户操作 -->
      <div class="header-actions">
        <el-dropdown 
          trigger="hover"
          @command="handleCommand"
          class="user-dropdown"
        >
          <div class="user-info">
            <span class="user-name">{{ userinfo?.username || '管理员' }}</span>
            <el-icon class="dropdown-icon"><arrow-down /></el-icon>
          </div>
          
          <template #dropdown>
            <el-dropdown-menu class="dropdown-menu">
              <el-dropdown-item command="updatePwd" class="menu-item">
                <el-icon><edit /></el-icon>
                <span>修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" class="menu-item">
                <el-icon><switch-button /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog 
      v-model="dialogFormVisible" 
      title="修改密码" 
      width="500px"
      class="password-dialog"
    >
      <el-form
        :model="pwdForm"
        :rules="updatePwdRules"
        ref="pwdForm"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input
            v-model="pwdForm.oldPass"
            type="password"
            prefix-icon="Lock"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="pwdForm.password"
            type="password"
            prefix-icon="Unlock"
            show-password
            placeholder="6-16位字母数字组合"
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="pwdForm.checkPass"
            type="password"
            prefix-icon="Check"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>

        <el-form-item class="dialog-footer">
          <el-button 
            type="primary"
            class="submit-btn"
            @click="updatePwd"
          >
            <el-icon class="mr-1"><circle-check /></el-icon>
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { logout } from '@/api/login'
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const dialogFormVisible = ref(false)
const pwdForm = ref({
  oldPwd: '',
  password: '',
  confirmPwd: '',
})
const userinfo = ref({})

const initData = () => {
  userinfo.value = store.state.home.userinfo
}
initData()

const checkedPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== pwdForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const updatePwdRules = reactive({
  oldPwd: [
    { required: true, message: '旧密码不能为空', onTrigger: 'blur' },
    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '新密码不能为空', onTrigger: 'blur' },
    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
  ],
  confirmPwd: [{ required: true, validator: checkedPwd, onTrigger: 'blur' }],
})

const handleCommand = (command) => {
  switch (command) {
    case 'updatePwd':
      // 打开修改密码窗口
      handlePwd()
      break
    case 'logout':
      // 退出系统
      toLogout()
      break
    default:
      break
  }
}

const toLogout = () => {
  logout()
  router.push('/')
  ElMessage({
    message: '已退出登录',
    type: 'info',
    showClose: true,
  })
}

const resetForm = () => {
  pwdForm.value = {
    oldPwd: '',
    password: '',
    confirmPwd: '',
  }
}

const handlePwd = () => {
  dialogFormVisible.value = true
  resetForm()
}

const updatePwd = () => {
  dialogFormVisible.value = false
}
</script>

<style scoped lang="scss">
.admin-header {
  height: 64px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  
  .header-container {
    display: flex;
    align-items: center;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
  }
}

.header-left {
  .logo-link {
    display: block;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }
  
  .header-logo {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  }
}

.header-nav {
  flex: 1;
  margin-left: 48px;
  
  .nav-item {
    position: relative;
    padding: 8px 20px;
    margin: 0 12px;
    color: #606266;
    font-size: 15px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      color: #4caf50;
      background: rgba(76, 175, 80, 0.1);
    }
    
    &.nav-active {
      color: #fff;
      background: linear-gradient(45deg, #4caf50, #81c784);
      box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
    }
  }
}

.header-actions {
  .user-dropdown {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      .user-name {
        color: #4caf50;
      }
      
      .dropdown-icon {
        transform: rotate(180deg);
      }
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background 0.3s;
    
    &:hover {
      background: rgba(76, 175, 80, 0.05);
    }
  }
  
  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-right: 6px;
  }
  
  .dropdown-icon {
    transition: transform 0.3s;
    color: #666;
  }
}

// 下拉菜单样式
.dropdown-menu {
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .menu-item {
    padding: 8px 20px;
    color: #606266;
    transition: all 0.2s;
    
    &:hover {
      color: #4caf50;
      background: rgba(76, 175, 80, 0.06);
      
      i {
        color: #4caf50;
      }
    }
    
    i {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}

// 密码修改弹窗
.password-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    margin: 0;
    padding: 16px 24px;
  }
  
  .el-dialog__body {
    padding: 24px;
  }
  
  .dialog-footer {
    margin-top: 24px;
    text-align: center;
    
    .submit-btn {
      width: 200px;
      height: 40px;
      font-size: 14px;
      letter-spacing: 1px;
      background: linear-gradient(45deg, #4caf50, #81c784);
      border: none;
      transition: all 0.3s;
      
      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px !important;
  }
  
  .header-nav {
    margin-left: 24px;
    
    .nav-item {
      margin: 0 6px;
      padding: 6px 12px;
      font-size: 14px;
    }
  }
  
  .user-name {
    display: none;
  }
}
</style>