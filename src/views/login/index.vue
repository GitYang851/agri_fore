<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <a href="/">
          <img class="logo" src="@/assets/logo.png" alt="logo" />
        </a>
      </div>
    </div>

    <el-form :model="form" ref="form" :rules="rules" label-width="80px" class="login-form">
      <h2 class="title">农产品销售系统登录</h2>
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" clearable show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="toLogin(this.$refs.form)" type="primary" plain>登录</el-button>
        <el-button type="danger" @click="toReg" plain>注册</el-button>
      </el-form-item>
    </el-form>
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
          { required: true, message: '密码不能为空', onTrigger: 'blur' },
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
              localStorage.setItem('token', res.data)
              this.$router.push('/home')
            }
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
.title {
  text-align: center;
  color: #70b053;
  margin-bottom: 20px;
}

.login-form {
  width: 450px;
  margin: 160px auto;
  background-color: #d5f0ca;
  padding: 30px;
  border-radius: 20px;
}

.container {
  background-color: #e8f5e9;
  /* 浅绿色页面背景 */
  min-height: 100vh;

  justify-content: center;
  align-items: center;
}

.header {
  line-height: 50px;
  background-color: #cdd5d2;
  display: flex;
}

a {
  text-decoration: none;
  color: #333;
}

.logo {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  margin: 0 10px 0 40px;
}
</style>
