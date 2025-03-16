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
      label-width="80px" 
      class="login-form glassmorphism"
    >
      <p class="subtitle">登录以继续访问系统</p>
      
      <el-form-item label="账号" prop="account">
        <el-input 
          v-model="form.account" 
          clearable
          prefix-icon="el-icon-user"
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
      
      <el-form-item class="action-btns">
        <el-button 
          @click="toLogin(this.$refs.form)" 
          class="login-btn"
        >
          立即登录
        </el-button>
        <div class="divider">或</div>
        <el-button 
          type="text" 
          @click="toReg" 
          class="reg-link"
        >
          创建新账号
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 装饰性背景元素 -->
    <div class="deco-wave"></div>
    <div class="deco-circle"></div>
  </div>
</template>

<script>
import login2 from '@/api/login2'

export default {
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 6 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    toLogin(form) {
      form.validate((valid) => {
        if (valid) {
          login2.login(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success('登录成功')
              this.token = res.data;
              localStorage.setItem('token', this.token);
              const jwtParts = this.token.split(".");
              const jwtPayload = JSON.parse(atob(jwtParts[1]));
              if (jwtPayload.roleType == 1) {
                this.$router.push('/admin');
              } else {
                this.$router.push('/home');
              }
            }
          }).catch(error => {
            console.error('登录失败:', error)
            this.$message.error('登录失败，请检查账号密码')
          })
        } else {
          return false
        }
      })
    },
    toReg() {
      this.$router.push('/reg')
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

.login-form {
  width: 450px;
  margin: 100px auto;
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
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}


.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #4caf50, #81c784);
  color: white !important;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.reg-link {
  width: 100%;
  text-align: center;
  padding: 12px 0 !important;
}

.reg-link:hover {
  color: #4caf50 !important;
}

.divider {
  width: 100%;
  color: #999;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
  margin: 0 10px;
}

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

.deco-circle {
  position: absolute;
  top: 20%;
  right: -100px;
  width: 300px;
  height: 300px;
  background: rgba(129, 199, 132, 0.1);
  border-radius: 50%;
}

@keyframes wave {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .login-form {
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
  
  .deco-circle {
    display: none;
  }
}
</style>