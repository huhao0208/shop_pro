<template>
  <div>
     
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            @keyup.enter.native="searchGoods"
            placeholder="请输入内容"
            v-model="params.query"
            class="input-with-select"
            clearable
          >
            <el-button @click="searchGoods"  slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addshop">添加商品</el-button>
        </el-col> 
      </el-row>
      <el-table :data="goodsList.goods" height="700">
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time| dateFormat}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">

           <el-button size="small" type="primary" icon="el-icon-edit" >编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsList.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      goodsList: [],
      params: {
          query:'', 
        pagenum: 1, //当前页码
        pagesize: 10 //每页显示条数
      },
   
      searchipt:'',
        
    };
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.params
      });
      if (res.meta.status != 200) return this.$message.error("获取数据失败");
      console.log(res.data);
      this.goodsList = res.data;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`, val);
      this.params.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`, val);
      this.params.pagenum = val;
      this.getGoodsList();
    },
    //商品搜索
   async searchGoods(){
        console.log( this.params);
        
        await  this.getGoodsList();
       this.params.query =""
        
    },
     addshop(){
      this.$router.push('/goodsadd')
  },
  // 删除商品
  deleteGood(id){
    console.log(id);
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res} = await this.$http.delete("goods/"+id)
         // console.log(res);
          if(res.meta.status !==200) return this.$message.error("删除失败")
           this.getGoodsList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
  }
  },
 
};
</script>
<style scoped lang="less">
.el-pagination {
  margin-top: 20px;
}
</style>