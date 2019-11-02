<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <h3>电商管理后台</h3>
      </div>
      <el-button type="primary" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <el-col>
          <!-- <h5>自定义颜色</h5> -->
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            background-color="#373D41"
            text-color="#fff"
            active-text-color="#5aa"
          >
            <el-submenu :index="item.id+''" v-for="item in menuslist" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>

              <el-menu-item
                :index="subitem.id+''"
                v-for="subitem in item.children"
                :key="subitem.id"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 右主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getMenuList();
  },
  data() {
    return {
      menuslist: []
    };
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      //  console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //  console.log(key, keyPath);
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");

      if (res.meta.status !== 200) return this.$message.error("获取列表失败");
      this.menuslist = res.data;
    }
  }
};
</script>
<style scoped lang="less">
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 {
        color: #eee;
        padding-left: 20px;
        align-items: center;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>