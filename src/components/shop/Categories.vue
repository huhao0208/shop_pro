<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <!-- 添加弹出框 -->
      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" :before-close="closedialog">
        <el-form ref="cateform" :model="cateform" label-width="80px" :rules="rules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateform.cat_name" :span="5"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader :options="categoresListAll" :props="props" v-model="fenlei" clearable @change="getChecked"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closedialog">取 消</el-button>
          <el-button type="primary" @click="addCateSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <table-tree
        :data="categoresList.result"
        :columns="columns"
        show-index
        :selection-type="false"
        border
        stripe
        :expand-type="false"
      >
        <template slot-scope="scope" slot="isDeleted">
          <i :class="scope.row.cat_deleted?'el-icon-error':'el-icon-success'"></i>
        </template>
        <template slot-scope="scope" slot="level">
          <!-- {{scope.row.cat_level}}
          {{levels[scope.row.cat_level]}}-->
          <el-tag
            :type="levels[scope.row.cat_level].class"
            size="mini"
          >{{levels[scope.row.cat_level].name}}</el-tag>
        </template>
        <template slot="caozuo">
          <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>

          <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </table-tree>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-size="params.pagesize"
        :page-sizes="[3, 4, 5, 6]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categoresList.total"
      >></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCategores();
  },
  data() {
    return {
      fenlei:"",
      // 获取商品信息的参数
      params: {
        type: "",
        pagenum: 1,
        pagesize: 5
      },
      // 获取的商品分类信息result pagenum  pagesize  total(总条数)
      categoresList: {},
      // 所有分类数据`
      categoresListAll: [],
      defaultProps: {
        children: "children",
        label: "cat_name"
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isDeleted"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "level"
        },
        {
          label: "操作",
          type: "template",
          template: "caozuo"
        }
      ],
      //   排序`
      levels: {
        0: {
          class: "",
          name: "一级"
        },
        1: {
          class: "success",
          name: "二级"
        },
        2: {
          class: "warning",
          name: "三级"
        }
      },
      // 添加分类弹出关闭控制
      dialogVisible: false,
      cateform: {
        // 添加分类表单数据
        cat_name: "", // 分类名称
        cat_pid: 0, //分类父 ID
        cat_level: 0 // 分类层级
      },
      selected: "", // 分类选中的
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },
      props: {
        checkStrictly: true,
        label: "cat_name",
        children: "children",
        value: "cat_id",
        expandTrigger: "hover"
      }
    };
  },
  methods: {
    async getCategores() {
      const { data: res } = await this.$http.get("categories", {
        params: this.params
      });
      console.log(res);
      this.categoresList = res.data;
    },
    // 分页`
    handleSizeChange(val) {
      console.log(val);
      this.params.pagesize = val;
      this.getCategores();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.params.pagenum = val;
      this.getCategores();
    },
    async addCate() {
      this.dialogVisible = true;
      const { data: res } = await this.$http.get("categories", {
        params: { type: "" }
      });
      console.log(res);

      this.categoresListAll = res.data;
    },
    // 关闭添加分类框
    closedialog() {
      this.$refs.cateform.resetFields();
      this.dialogVisible = false;
      //  cateform: {
      //   // 添加分类表单数据
      //   cat_name: "", // 分类名称
      //   cat_pid: 0,  //分类父 ID
      //   cat_level:0  // 分类层级

      // },
      // this.cateform.cat_name = "";
      // this.cateform.cat_pid = 0;
      // this.cateform.cat_level = 0;
      this.fenlei=""
      console.log("关闭前执行");
    },
    // 获取分类选择结果
    getChecked(res) {
      //  console.log(this.selected);
      this.cateform.cat_level = res.length; // 分类层级
      this.cateform.cat_pid = res.length >= 1 ? res[res.length - 1] : 0; // 父id
    },
    // 提交分类
    addCateSubmit() {
      console.log(this.cateform);
      this.$refs.cateform.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "categories",this.cateform
          );
          console.log(res);
          if (res.meta.status != 201) return this.$message.error("添加失败");
          this.cateform.cat_name = "";
          this.cateform.cat_pid = "";
          this.cateform.cat_level = "";
          this.dialogVisible = false;
          this.getCategores();
          this.fenlei=""
          console.log("关闭前执行");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.el-icon-success {
  color: green;
}
.el-icon-error {
  color: red;
}
.zk-table {
  margin: 20px 0;
}
</style>
<style lang="less">
.el-cascader-panel {
  height: 500px;
}
</style>