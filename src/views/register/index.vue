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
      <h2 class="title">农产品销售系统注册</h2>
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" clearable></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" clearable show-password></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="form.confirmPwd" type="password" clearable show-password></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="register(this.$refs.form)" plain>注册</el-button>
        <el-button type="danger" @click="toLogin" plain>登录</el-button>
      </el-form-item>
    </el-form>
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
          { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', onTrigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
        ],
        confirmPwd: [{ required: true, validator: checkedPwd, onTrigger: 'blur' }],
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
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.title {
  text-align: center;
  color: #444;
  margin-bottom: 20px;
}

.login-form {
  width: 450px;
  margin: 160px auto;
  background-color: #dadada;
  padding: 30px;
  border-radius: 20px;
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
