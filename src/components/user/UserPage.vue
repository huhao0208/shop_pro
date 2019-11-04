<template>
  <!-- 面包屑 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            @keyup.enter.native="search"
            placeholder="请输入内容"
            v-model="input"
            class="input-with-select"
            clearable
          >
            <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-button type="primary">
          添加用户</el-button>-->
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>

          <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
            <el-form label-position="right" label-width="80px">
              <el-form-item label="用户名" prop="name">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="密  码" prop="password">
                <el-input></el-input>
              </el-form-item>
              <el-form-item
                prop="email"
                label="邮箱"
                :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                 { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] } ]"
              >
                <el-input v-model="addDateForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手  机" prop="tel">
                <el-input></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表内容部分 -->
      <el-table :data="tableData.users" border style="width: 100%">
        <el-table-column type="index" label="索引" min-width="60"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="data">
            <el-switch
              @change="changstate(data.row.id,$event)"
              v-model="data.row.mg_state"
              active-color="#13ce66"
              inactive-color
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min- width="220">
          <el-tooltip class="item" :enterable=false effect="light" content="编辑" placement="top">
            <el-button size="small" type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" :enterable=false effect="light"  content="删除" placement="top">
            <el-button size="small" type="danger" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" :enterable=false hide-after:1 effect="light" content="设置" placement="top">
            <el-button size="small" type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 页码 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUsers();
  },
  data() {
    return {
      input: "",
      tableData: [],
      userinfo: {
        pagenum: 1, //当前页码
        pagesize: 2, //每页显示条数
        query: "" // 查询参数
      },
      dialogFormVisible: false,
      addDateForm: {
        name: "",
        password: "",
        email: "",
        tel: ""
      }
    };
  },
  methods: {
    async getUsers() {
      const { data } = await this.$http.get("users", {
        params: this.userinfo
      });
      // console.log(data);

      if (data.meta.status != 200) return this.$message.error(data.meta.msg);
      this.tableData = data.data;
    },
    handleSizeChange(val) {
      this.userinfo.pagesize = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.userinfo.pagenum = val;
      this.getUsers();
    },
    // 修改用户状态
    async changstate(id, state) {
      const { data: res } = await this.$http.put(
        "/users/" + id + "/state/" + state
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("状态修改失败");
    },
    // 根据搜索框内用户姓名查找
    search() {
      this.userinfo.query = this.input;
      this.getUsers();
    }

    // 添加用户验证
    // rules: {
    //   name: [
    //     { required: true, message: "请输入用户名", trigger: "blur" },
    //     { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
    //   ],
    //   email: [{ required: true, message: "请填写密码", trigger: "blur" }],
    //   tel: [{ required: true, message: "手机号码", trigger: "blur" }]
    // }
  }
};
</script>
<style scoped lang="less">
.el-row {
  > .el-col {
    margin-bottom: 20px;
  }
}
</style>