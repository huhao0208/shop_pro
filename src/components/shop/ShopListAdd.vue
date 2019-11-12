<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>
      <el-steps :space="800" :active="activetab" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="动态属性"></el-step>
        <el-step title="静态属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-tabs tab-position="left" style="height: 200px;" @tab-click="fn">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息">
          <el-form :model="baseInfo" ref="baseInfo" :rules="baseInfoRules" label-width="120px" >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="baseInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="baseInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model="baseInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="baseInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="baseInfo.goods_cat"
                :options="categoresList"
                :props="{ expandTrigger: 'hover' ,label:'cat_name',value:'cat_id' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
           
          </el-form>
        </el-tab-pane>
        <!-- 动态属性 -->
        <el-tab-pane label="动态属性">
          动态属性
          <el-form v-for="item in attributeList" :key="item.attr_id"  >
            <el-form-item :label="item.attr_name">
              <!-- {{ReceiveData[item.attr_id]}}{{item.attr_id}} -->
              <el-checkbox-group v-model="ReceiveData[item.attr_id]">
                <el-checkbox v-for="(iitem,i) in item.attr_vals" :key="i" border :label="iitem"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性">
          静态属性
          <el-form v-for="item in attributeList" :key="item.attr_id">
            <el-form-item :label="item.attr_name" label-width="200px">
              <!-- {{ReceiveData[item.attr_id]}} -->
              {{ReceiveData[item.attr_id][0]}}
              <el-col :span="10">
                <el-input v-model="ReceiveData[item.attr_id][0]"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品图片 -->
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="headers"
            :file-list="fileList"
            list-type="picture"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="onSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" width="50%">
            <img :src="previewPic">
          </el-dialog>
        </el-tab-pane>
        <!-- 商品内容 -->
        <el-tab-pane label="商品内容">商品内容
          <quill-editor v-model="baseInfo.goods_introduce">

          </quill-editor>
          <el-button @click="addform(baseInfo)">提交</el-button>
        </el-tab-pane>
      </el-tabs>
      
    </el-card>
  </div>
</template>
<script>
import _ from "lodash"
export default {
  created() {
    this.getCategores();
  },
  // 检测侧边栏点击index
  watch: {
    activetab(val) {
      // 获取动态 静态属性

      if (val == 1 || val == 2) {
        if (!this.baseInfo.goods_cat) return this.$message.error("未选择分类");
        val == 1
          ? this.getAttribute(this.baseInfo.goods_cat.split(",")[2])
          : this.getAttribute(this.baseInfo.goods_cat.split(",")[2], "only");
      }
    }
  },
  data() {
    return {
      activetab: 0, // 选中的tab index
      // 基本信息
      baseInfo: {
        goods_name: "", // 商品名称不能为空
        goods_cat: "", //以为','分割的分类列表不能为空
        goods_price: "", //价格不能为空
        goods_number: "", //数量不能为空
        goods_weight: "", //重量不能为空
        goods_introduce: "", //介绍可以为空
        pics: [], //上传的图片临时路径（对象）可以为空
        attrs: [] //商品的参数（数组），包含 `动态参数` 和 `静态属性`可以为空
      },
      //  跟表格双向绑定的动静态属性
      ReceiveData: [],
      // 基本信息验证规则
      baseInfoRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 1, max: 150, message: "长度在1-15之间", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "缺少商品分类", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
          // { type: "number", message: "请输入正确的价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
          // { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
          // { type: "number", message: "请输入重量数单位为kg", trigger: "blur" }
        ]
      },
      // 所有商品分类列表
      categoresList: [],
      // 动静态属性列表
      attributeList: [],
      fileList:[],
      headers:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图
      dialogVisible:false,
      previewPic:'',
    };
  },
  methods: {
    // 左侧选项卡点击
    fn(e) {
      this.activetab = Number(e.index); // 选中的tab index
    },
    // 获取所有商品分类
    async getCategores() {
      const { data: res } = await this.$http.get("categories", {
        params: this.params
      });
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      //  console.log(res.data);

      this.categoresList = res.data;
    },
    // 分类选择change
    handleChange() {
      // 将分类选择结果装换为 , 分隔的字符串
     this.baseInfo.goods_cat = this.baseInfo.goods_cat.join();
      // console.log(this.baseInfo.goods_cat);
    },
    // 根据分类获取 动态/静态属性
    async getAttribute(id, only) {
      const { data: res } = await this.$http.get(
        "categories/" + id + "/attributes",
        { params: { sel: only == "only" ? "only" : "many" } }
      );

      if (res.meta.status != 200) return this.$message.error("获取属性失败");
      res.data = res.data.filter(
        e => (e.attr_vals = e.attr_vals !== "" ? e.attr_vals.split(",") : [])
      );
      console.log(res.data);
      this.attributeList = res.data;
      // this.baseInfo
      res.data.filter(e => {
        //if(e.attr_sel=="many"){
        !this.ReceiveData[e.attr_id]
          ? (this.ReceiveData[e.attr_id] = e.attr_vals)
          : "";
        // }
        // else{
        //   !this.ReceiveData[e.attr_id]? this.ReceiveData[e.attr_id]=[] :""
        // }
        //  this.baseInfo.attrs.push(ss)
      });
     // console.log(this.ReceiveData);
    },
    // 图片上传
    //图片删除
     handleRemove(file, fileList) {
      // console.log(file.response.data.tmp_path);
      let index= this.baseInfo.pics.findIndex(e=>e.pic==file.response.data.tmp_path)
      this.baseInfo.pics.splice(index,1)
      
      },
     // 图片预览
      handlePreview(file) {
     console.log(file);
        this.dialogVisible = true;
        this.previewPic = file.response.data.url
        
      },
     // 上传成功
      onSuccess(res){
        console.log(res);
        if(res.meta.status==200){
          this.baseInfo.pics.push({pic:res.data.tmp_path})
          // console.log(this.baseInfo);
          // console.log(this.ReceiveData);
          
        }
        
      },
     addform(){
          this.$refs.baseInfo.validate( async vailad=>{
            if(!vailad) return this.$message.error("验证失败 ")


            let form = _.cloneDeep(this.baseInfo)
            let resData = _.cloneDeep(this.ReceiveData)
            resData.filter((e,i)=>{
              e ? form.attrs.push({attr_id:i,attr_value:e.join(",")}):""
            })
            
            // console.log(this.baseInfo);
            // console.log(this.ReceiveData);
            
           
            console.log(form);
        const {data:res} =  await this.$http.post("goods",form)
        console.log(res);
        if(res.meta.status!=201) return this.$message.error("商品添加失败")
           this.$router.push("/goods")
          })
      }
  }
};
</script>
<style scoped lang="less">
.el-steps /deep/ .el-step__title {
  font-size: 14px;
}
.el-tabs {
  overflow: visible;
}

.el-card {
  height: 750px;
}
img{
  width: 100%;
}
.quill-editor /deep/ .ql-editor{
  height: 300px;
}
</style>
