<template>
    <div class="header">
      <div class="container">
        <div class="left">
          <a href="/">
            <img class="logo" src="@/assets/logo.png"  alt="logo">
          </a>
        </div>
        <div class="middle">
          <router-link class="nav-link" :class="{ active: $route.path  === '/' }" to="/">首页</router-link>
          <router-link class="nav-link" :class="{ active: $route.path  === '/category' }" to="/category">查询</router-link>
          <router-link class="nav-link" :class="{ active: $route.path  === '/cart' }" to="/cart">购物车</router-link>
          <router-link class="nav-link" :class="{ active: $route.path  === '/order' }" to="/order">订单</router-link>
        </div>
        <div class="right">
          <el-dropdown @command="handleCommand">
            <div class="el-dropdown-link nickname">
              <span v-if="!userinfo">
                <el-icon><setting /></el-icon>
                <span>昵称</span>
              </span>
              <span v-if="userinfo">{{ userinfo.username  }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toLogin">登录</el-dropdown-item>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
  
      <el-dialog title="修改密码" v-model="dialogFormVisible" width="500px">
        <el-form :model="pwdForm" ref="pwdFormRef" :rules="updatePwdRules" label-width="80px" style="width: 400px">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="pwdForm.oldPwd"  type="password" autocomplete="off" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="pwdForm.password"  type="password" autocomplete="off" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="pwdForm.confirmPwd"  type="password" autocomplete="off" clearable show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="updatePwd" type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </template>
  <script setup>
import { logout } from "@/api/login";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const store = useStore();
const router = useRouter();
const dialogFormVisible = ref(false);
const pwdForm = ref({
  oldPwd: "",
  password: "",
  confirmPwd: ""
});
const pwdFormRef = ref(null);
const userinfo = ref({});

const initData = () => {
  userinfo.value  = store.state.home.userinfo; 
};
initData();

const checkedPwd = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value!== pwdForm.value.password)  {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const updatePwdRules = reactive({
  oldPwd: [
    { required: true, message: "旧密码不能为空", onTrigger: "blur" },
    { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "新密码不能为空", onTrigger: "blur" },
    { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
  ],
  confirmPwd: [
    { required: true, validator: checkedPwd, onTrigger: "blur" }
  ]
});

const handleCommand = (command) => {
  switch (command) {
    case "updatePwd":
      handlePwd();
      break;
    case "logout":
      toLogout();
      break;
    default:
      break;
  }
};

const toLogin = () => {
  router.push("/login"); 
};

const toLogout = () => {
  logout();
  router.push("/login"); 
  localStorage.removeItem("token");
  ElMessage({
    message: "已退出登录",
    type: "info",
    showClose: true
  });
};

const resetForm = () => {
  pwdForm.value  = {
    oldPwd: "",
    password: "",
    confirmPwd: ""
  };
  pwdFormRef.value.resetFields(); 
};

const handlePwd = () => {
  dialogFormVisible.value  = true;
  resetForm();
};

const updatePwd = () => {
  pwdFormRef.value.validate((valid)  => {
    if (valid) {
      // 实际的更新密码逻辑
      dialogFormVisible.value  = false;
    } else {
      ElMessage({
        message: "请检查输入信息",
        type: "warning",
        showClose: true
      });
    }
  });
};
</script>
<style scoped>
a {
  text-decoration: none;
  color: #333;
}

.logo {
  vertical-align: middle;
  width: 40px;
  height: 40px;
  margin: 0 15px 0 20px;
}

.container {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container.middle  {
  display: flex;
  justify-content: space-around;
  flex: 1;
}

.nav-link {
  display: inline-block;
  padding: 10px 20px;
  color: #333;
  transition: background-color 0.3s ease;
}

.nav-link.active, 
.nav-link:hover {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

.container.right  {
  margin-right: 20px;
  cursor: pointer;
}

.el-dropdown {
  color: #333333;
}

.nickname {
  font-size: 16px;
  display: flex;
  align-items: center;
}

.el-dropdown-link.nickname  {
  display: flex;
  align-items: center;
  gap: 5px;
}

.el-dropdown-menu {
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-dropdown-item {
  padding: 10px 15px;
  transition: background-color 0.3s ease;
}

.el-dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>