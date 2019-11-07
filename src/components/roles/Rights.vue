<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
        <el-table
   :data="rightsList"
    height="700"
    border
    style="width: 100%">
    <el-table-column
      width="100"
      type="index"
      label="索引"
      >
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
     >
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径">
    </el-table-column>
    <el-table-column prop="level" label="权限等级">
      <template slot-scope="scope">
        <el-tag :type="rigthsico[scope.row.level].class">{{rigthsico[scope.row.level].name}}</el-tag>
      </template>
      
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList:[],
      rigthsico:{
        0:{
          class:"",
          name:"一级"
        },
        1:{
          class:"success",
          name:"二级"
        },
        2:{
          class:"warning",
          name:"三级"
        }
      }
    };
  },
  methods: {
   async getRightsList(){
  
      const { data: res } = await this.$http.get("rights/list");
     
      console.log(res);
      if(res.meta.status!=200) return this.$message.error("获取权限失败")
      this.rightsList = res.data;
      
    
    }
  }
};
</script>
<style scoped lang="less">
</style>