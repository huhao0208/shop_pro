<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- 表单区域 -->
      <el-form
        label-width="0"
        class="login_form"
        :model="login_form"
        :rules="loginFormRules"
        ref="loginRef"
      >
        <!-- model 属性是element表单的属性 -->
        <el-form-item prop="username">
          <el-input
            v-model="login_form.username"
            placeholder="用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="login_form.password"
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="loginfn">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { log } from "util";
export default {
  data() {
    return {
      login_form: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //登录验证
    loginfn() {
      this.$refs.loginRef.validate(async res => {
        if (!res) {
          return;
        } else {
          let { data } = await this.$http.post("login", this.login_form);
          if (data.meta.status == 200) {
            window.sessionStorage.setItem("token", data.data.token);
            this.$message.success("登录成功");
            // 页面跳转
            this.$router.push("/home");
          } else { 
            // this.$message.error("用户名或密码错误");
            this.$message({
              showClose: true,
              message: "用户名或密码错误",
              type: "error"
            });
            return
          }
        }
      });
    },
    reset() {
      this.$refs.loginRef.resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.login_container {
  background: rgb(54, 128, 138);
  height: 100%;
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    transform: translate(-50%, -50%);
    background: #fff;
    .avatar_box {
      position: absolute;
      top: 0px;
      left: 50%;
      width: 130px;
      height: 130px;
      padding: 10px;
      background-color: #fff;
      //border: 1px solid #ddd;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px 8px #ddd;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      .btn {
        display: flex;
        justify-content: flex-end;
        // flex 主轴水平end对齐
      }
    }
  }
}
</style>