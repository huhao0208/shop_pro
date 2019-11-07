<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="userrid" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row v-for="item in props.row.children" :key="item.id" class="borderbox">
              <el-col :span="4">
                <el-tag>{{item.authName}}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="20">
                <el-row v-for="subitem in item.children" :key="subitem.id">
                  <el-col :span="4">
                    <el-tag type="success">{{subitem.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      type="danger"
                      closable
                      :disable-transitions="false"
                      v-for="ssubitem in subitem.children"
                      :key="ssubitem.id"
                      @close="handleClo(ssubitem.id,props.row)"
                    >{{ssubitem.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>

            <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>

            <el-button
              size="small"
              type="warning"
              icon="el-icon-setting"
              @click="quanxianfenpei(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限弹窗 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogVisible"
        width="50%"
        @close="closed"
        destroy-on-close
       
      >
        <el-tree
          show-checkbox
          :data="rolesListAll"
          :props="defaultProps"
          ref="quanxiange"
          default-expand-all
          node-key="id"
          :default-checked-keys="assignmentList"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitset">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getridlis();
    this.getrolesAll();
  },
  data() {
    return {
      userrid: [],
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      rolesListAll: [], // 用户所有权限列表
      assignmentList: [], // 当前用户已选择权限id列表
      rolesList: [] ,// 当前用户可设置的所有权限
      getselected:{}
    };
  },
  computed: {},
  methods: {
    //获取角色权限
    async getridlis() {
      const { data: res } = await this.$http.get("roles");
      //console.log(res);

      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.userrid = res.data;
      //   console.log(this.userrid);
    },
    // 权限选择 提交
   async submitset() {
      this.dialogVisible = false;
   const ban = this.$refs.quanxiange.getHalfCheckedKeys();
   const zi = this.$refs.quanxiange.getCheckedKeys();  
   console.log([...zi,...ban].join());
   
   
   const {data:res} = await this.$http.post("roles/"+this.rolesList.id+"/rights",{rids:[...zi,...ban].join()});
    console.log(res);
    if(res.meta.status==200)  this.getridlis();
   
    
    },
    // 权限分配打开显示
    quanxianfenpei(data) {
      this.dialogVisible = true;
      this.rolesList = this.userrid.find(e => e.id == data.id);
      let t = [];
      function fn(data) {
        data.forEach(e => {
          if (e.children) return fn(e.children);
          t.push(e.id);
        });
        return t;
      }

      this.assignmentList = fn(data.children);
    },
    // 删除tag
    handleClo(val, ID) {
    //   console.log(val);
    //   console.log(ID.id);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            "roles/" + ID.id + "/rights/" + val
          );
          ID.children = res.data;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getrolesAll() {
      const { data: res } = await this.$http.get("rights/tree");
      this.rolesListAll = res.data;
    },

    closed() {
      this.assignmentList = [];
    }
  }
};
</script>
<style scoped lang="less">
.el-row {
  .el-tag {
    margin: 5px;
  }
}
.el-row {
  &:first-child {
    border-top: 1px solid #ccc;
  }
  border-bottom: 1px solid #ccc;
  align-items: center;
  .el-row:first-child {
    border-top: none;
  }
  .el-row:last-child {
    border-bottom: none;
  }
}
</style>