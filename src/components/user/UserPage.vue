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
            <el-form
              label-position="right"
              label-width="80px"
              :model="addDateForm"
              :ref="addDateForm"
            >
              <el-form-item
                label="用户名"
                prop="username"
                :rules="[ { required: true, message: '请输入用户名称', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                  ]"
              >
                <el-input v-model="addDateForm.username"></el-input>
              </el-form-item>
              <el-form-item
                label="密  码"
                prop="password"
                :rules="[ { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]"
              >
                <el-input v-model="addDateForm.password"></el-input>
              </el-form-item>
              <el-form-item
                prop="email"
                label="邮箱"
                :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                 { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] } ]"
              >
                <el-input v-model="addDateForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手  机" prop="mobile">
                <el-input></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm(addDateForm)">取 消</el-button>
                <el-button type="primary" @click="submitForm(addDateForm)">确 定</el-button>
              </el-form-item>
            </el-form>
            <!-- <div  >
              <el-button @click="resetForm(addDateForm)">取 消</el-button>
              <el-button type="primary" @click="submitForm(addDateForm)">确 定</el-button>
            </div>-->
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
        <el-table-column label="操作" min- width="220" prop="id">
          <template slot-scope="userid">
            <el-tooltip class="item" :enterable="false" effect="light" content="编辑" placement="top">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                @click="edituser(userid.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" :enterable="false" effect="light" content="删除" placement="top">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUser(userid.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              :enterable="false"
              hide-after:1
              effect="light"
              content="设置"
              placement="top"
            >
              <el-button
                size="small"
                type="warning"
                icon="el-icon-setting"
                @click="settingUser(userid.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
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

      <!-- 用户编辑 -->
      <el-dialog title="用户编辑" :visible.sync="editVisible" width="40%">
        <el-form label-position="left">
          <el-form-item label="用户名" label-width="60px">
            <el-input v-model="edituserData.username"></el-input>
          </el-form-item>
          <el-form-item label="邮　箱" label-width="60px">
            <el-input v-model="edituserData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" label-width="60px">
            <el-input v-model="edituserData.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editfn">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 用户设置 -->
      <el-dialog title="用户设置" :visible.sync="setVisible" width="30%">
        <el-form label-position="left">
          <el-row>
            <el-col :span="3">用户名:</el-col>
            <el-col :span="10">{{edituserData.username}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="3">权限:</el-col>
            <el-col :span="10">{{
              userrid.find(e=>e.id==edituserData.rid)?userrid.find(e=>e.id==edituserData.rid).roleName:"未查询到权限名称"
             
              
              }}</el-col>
          </el-row>
          <el-form-item></el-form-item>
          <el-form-item label="选择角色权限" >
            <el-select v-model="edituserData.rid" placeholder="请选择" >
              <el-option
                v-for="item in userrid"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setVisible = false">取 消</el-button>
          <el-button type="primary" @click="roleChange">确 定</el-button>
        </span>
      </el-dialog>
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
      // 用户权限
      userrid: [],
      input: "",
      tableData: [],
      userinfo: {
        pagenum: 1, //当前页码
        pagesize: 2, //每页显示条数
        query: "" // 查询参数
      },
      dialogFormVisible: false,
      addDateForm: {
        // 添加用户信息
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editVisible: false, // 用户编辑 隐藏显示
      edituserData: {
        id: "",
        email: "",
        mobile: "",
        username: "",
       
        rid:''

      },
      setVisible: false, // 用户设置框显示隐藏
     roleName:'', //
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
      // console.log( this.tableData);
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

      if (res.meta.status != 200) return this.$message.error("状态修改失败");
    },
    // 根据搜索框内用户姓名查找
    search() {
      this.userinfo.query = this.input;
      this.getUsers();
    },

    // 添加用户
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return this.$message.error("预验证错误");
        formName.role_id = 40;

        const { data: res } = await this.$http.post("users", formName);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success("添加成功");
        console.log(res);

        this.resetForm(formName);
         this.getUsers();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 用户编辑
    async edituser(id) {
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.editVisible = true;
      this.edituserData = res.data;
    },
    // 用户编辑提交
    async editfn() {
      // console.log(this.edituserData);
      const { data: res } = await this.$http.put(
        "users/" + this.edituserData.id,
        // this.edituserData
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);

      this.editVisible = false;
      this.getUsers();
    },
    // 用户删除
    async deleteUser(id) {
      console.log(id);
      confirm("确定要删除?");
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success("删除成功");
      this.userinfo.pagenum=1;
      this.getUsers();
    },
    //角色权限
    async getridlis() {
      const { data: res } = await this.$http.get("roles");
      this.userrid = res.data;
      console.log(this.userrid);
      
    },
    // 用户设置
    async settingUser(id) {
      this.getridlis();
      const { data: res } = await this.$http.get("users/" + id);
      // console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.setVisible = true;
      this.edituserData = res.data;
    },
   async roleChange() {

     console.log(this.edituserData);
      const {data:res} = await this.$http.put("users/"+this.edituserData.id+"/role",{rid:this.edituserData.rid});
       if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.getUsers();
      this.setVisible=false;

    }
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