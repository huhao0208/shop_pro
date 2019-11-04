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
      <el-aside :width="iscollapse?'63px':'200px'">
         <div class="flag" @click="flag">|||</div>
        <el-col>
          <!-- <h5>自定义颜色</h5> -->
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            background-color="#373D41"
            text-color="#fff"
            active-text-color="#5aa"
            :default-active='path'
            :collapse-transition="false"
            unique-opened
            :collapse="iscollapse"
            @select="selectfn"
            router
          >
            <el-submenu :index="item.id+''" v-for="item in menuslist" :key="item.id">
              <template slot="title">
                <i :class="iconfontlist[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

              <el-menu-item
                :index="subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 右主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getMenuList();
    this.path=sessionStorage.getItem('selectedpath');
     
  },
  updated(){
    // console.log(window.location.hash.split("#/")[1]);
    window.location.hash.split("#/")[1]=="welcome"? sessionStorage.setItem("selectedpath",""):""
  },
  data() {
    return {
      path:'',
      iscollapse:false,
      iconfontlist:{
        125:'iconfont icon-users',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',
      },
      menuslist: []
    };
  },
  methods: {
    selectfn(path){
    sessionStorage.setItem("selectedpath",path)
     // console.log(path);
    },
    flag(){
      this.iscollapse=!this.iscollapse
    },
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //  console.log(key, keyPath);
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      //  console.log(res);
       

        
        
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
    >.flag{
      letter-spacing: .3em;
      background: #444;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      
    }
    .el-menu{
      border-right:none
    }
    .iconfont{
      padding-right:10px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>