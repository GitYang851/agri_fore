<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <a href="/">
          <img class="logo" src="@/assets/logo.jpg" alt="logo" />
        </a>
        <h1 class="system-name">智慧农产推荐系统</h1>
      </div>
    </div>

    <el-form 
      :model="form" 
      ref="form" 
      :rules="rules" 
      label-width="100px" 
      class="register-form glassmorphism"
    >
      <p class="subtitle">创建您的专属账号</p>

      <el-form-item label="账号" prop="account">
        <el-input 
          v-model="form.account" 
          clearable
          prefix-icon="el-icon-user-solid"
          class="custom-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="form.password" 
          type="password" 
          show-password
          prefix-icon="el-icon-lock"
          class="custom-input"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input 
          v-model="form.confirmPwd" 
          type="password" 
          show-password
          prefix-icon="el-icon-refresh"
          class="custom-input"
        ></el-input>
      </el-form-item>

      <el-form-item class="action-btns">
        <el-button 
          type="primary" 
          @click="register(this.$refs.form)" 
          class="register-btn"
        >
          立即注册
        </el-button>
        <div class="login-tip">
          已有账号？
          <el-button type="text" @click="toLogin" class="login-link">立即登录</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 装饰元素 -->
    <div class="deco-wave"></div>
    <div class="deco-leaf"></div>
  </div>
</template>

<script>
import login2 from '@/api/login2'

export default {
  data() {
    let checkedPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        account: '',
        password: '',
        confirmPwd: '',
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
        ],
        confirmPwd: [{ required: true, validator: checkedPwd, trigger: 'blur' }],
      },
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/')
    },
    register(form) {
      form.validate((valid) => {
        if (valid) {
          login2.register(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success('注册成功，请登录')
              this.$router.push('/')
            }
          }).catch(error => {
            console.error('注册失败:', error)
            this.$message.error('注册失败，请稍后重试')
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  position: relative;
  overflow: hidden;
}

.header {
  padding: 20px 50px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.system-name {
  font-size: 24px;
  color: #2e7d32;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0;
}

.register-form {
  width: 500px;
  margin: 80px auto;
  padding: 40px;
  border-radius: 20px;
  position: relative;
  z-index: 1;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.title {
  text-align: center;
  color: #1b5e20;
  font-size: 32px;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.custom-input ::v-deep .el-input__inner {
  border-radius: 8px;
  padding-left: 40px;
  transition: all 0.3s ease;
}

.custom-input ::v-deep .el-input__inner:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
}

.action-btns {
  margin-top: 30px;
  text-align: center;
}

.register-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #4caf50, #81c784);
  color: white !important;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.login-tip {
  color: #666;
  margin-top: 20px;
}

.login-link {
  color: #4caf50 !important;
  font-weight: 500;
  padding: 0 5px;
}

.login-link:hover {
  text-decoration: underline;
}

/* 装饰元素 */
.deco-wave {
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 120%;
  height: 200px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40% 40% 0 0;
  animation: wave 12s infinite linear;
}

.deco-leaf {
  position: absolute;
  top: 30%;
  right: -80px;
  width: 200px;
  height: 200px;
  background: url('~@/assets/leaf.png') no-repeat;
  opacity: 0.1;
  transform: rotate(-15deg);
}

@keyframes wave {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .register-form {
    width: 90%;
    margin: 60px auto;
    padding: 30px;
  }
  
  .header {
    padding: 15px 20px;
  }
  
  .system-name {
    font-size: 20px;
  }
  
  .deco-leaf {
    display: none;
  }
}
</style>