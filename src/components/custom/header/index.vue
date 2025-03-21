<template>
  <div class="header">
    <div class="container">
      <div class="left">
        <a href="/">
          <img class="logo" src="@/assets/logo.jpg" alt="logo" />
        </a>
      </div>
      <div class="middle">
        <span class="nav-span" :class="{ active: $route.path === '/home' }"
          ><router-link class="nav-link" to="/home">首页</router-link></span
        >
        <span class="nav-span" :class="{ active: $route.path === '/category' }"
          ><router-link class="nav-link" to="/category">全部商品分类</router-link></span
        >
        <span class="nav-span" :class="{ active: $route.path === '/cart' }"
          ><router-link class="nav-link" to="/cart">购物车</router-link></span
        >
        <span class="nav-span" :class="{ active: $route.path === '/order' }"
          ><router-link class="nav-link" to="/order">订单</router-link></span
        >
      </div>

      <div class="right">
        <el-dropdown @command="handleCommand">
          <div class="el-dropdown-link nickname">
            <div style="line-height: 25px" width="50px">
              <el-icon class="el-icon--right">
                <setting />
              </el-icon>
              <span>{{ userinfo }}</span>
            </div>
            <div style="line-height: 50px" v-if="userinfo">
              {{ userinfo.username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div @click="toLogin">登录</div>
              </el-dropdown-item>
              <el-dropdown-item command="toCenter">个人中心</el-dropdown-item>
              <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="修改密码" v-model="dialogFormVisible" width="500px">
      <el-form
        :model="pwdForm"
        ref="pwdForm"
        :rules="updatePwdRules"
        label-width="80px"
        style="width: 400px"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            v-model="pwdForm.oldPwd"
            type="password"
            autocomplete="off"
            show-password
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="pwdForm.password"
            type="password"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="pwdForm.confirmPwd"
            type="password"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="updatePwd('pwdForm')" type="primary">提交</el-button>
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
//从token获取账号信息

const userinfo = ref({})

// 解析 JWT 的工具函数
const parseJwt = (token) => {
  try {
    // 分割 token 的 payload 部分
    const base64Url = token.split('.')[1]
    // 替换 URL 安全字符并补全 base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    // 解码并转 UTF-8
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(payload)
  } catch (error) {
    console.error('token 解析失败:', error)
    return null
  }
}

const initData = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const payload = parseJwt(token)

    if (payload?.account) {
      userinfo.value = payload.account
    }
  }
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
    case 'toCenter':
      toCenter()
      break
    default:
      break
  }
}

const toLogin = () => {
  router.push('/')
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
const toCenter = () => {
  router.push('/center')
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

<style scoped>
a {
  text-decoration: none;
  color: #333;
}

.logo {
  display: block;
  width: 50px; /* 统一宽高确保正圆 */
  height: 50px;
  border-radius: 50%; /* 圆形裁剪 */
  object-fit: cover; /* 保持图片比例 */
  /* 移除默认背景 */
  background-color: transparent;
  /* 可选：添加轻微阴影提升层次感 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  height: 50px;
  display: flex;
  justify-content: space-between;
}

.container .middle {
  width: 1480px;
  display: flex;
  justify-content: left;
}

.nav-span {
  text-align: center;
  width: 150px;
}

.nav-link {
  display: inline-block;
  width: 100%;
}

.active {
  background-color: #c5c5c5;
}

.nav-span:hover {
  background-color: #c5c5c5;
}

.container .right {
  margin-top: 15px;
  margin-right: 50px;
  cursor: pointer;
  text-align: center;
  width: 150px;
}

.el-dropdown {
  color: #333333;
}

.nickname {
  font-size: 18px;
  display: flex;
  align-items: center;
}
</style>
