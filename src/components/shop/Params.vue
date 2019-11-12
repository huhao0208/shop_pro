<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title=" 只允许为第三级设置参数" type="warning" effect="dark"></el-alert>请选择商品分类:
      <el-cascader
        v-model="selectedcates"
        :options="categoresList"
        :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
        @change="handleChange"
      ></el-cascader>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-button :disabled="isSelected" type="primary" @click="addparams">添加属性</el-button>
        <el-tab-pane label="动态属性" name="many"></el-tab-pane>
        <el-tab-pane label="静态属性" name="only"></el-tab-pane>
        <el-table :data="dataList" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label>
                  <el-tag
                    v-for="(item,i) in props.row.attr_vals"
                    :key="i"
                    :closable="activeName=='many'"
                    @close="deleteTag(i,props.row)"
                  >{{item}}</el-tag>

                  <el-input
                    class="input-new-tag"
                    v-if="props.row.inputVisible"
                    v-model="props.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(props.row)"
                    @blur="handleInputConfirm(props.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(props.row)"
                  >+ New Tag</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="索引" width="100"></el-table-column>
          <el-table-column prop="attr_name" label="属性"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="editattr(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteAttr(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="method+currentTab"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="resetForm"
    >
      <el-form :model="attrForm" :rules="attrrules" ref="attrForm" label-width="100px">
        <el-form-item :label="currentTab" prop="attrname">
          <el-input v-model="attrForm.attrname" placeholder="属性与参数之间用英文:分隔 各个参数之间,分隔"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { log } from "util";
export default {
  created() {
    this.getCategores();
  },
  computed: {
    isSelected: function() {
      //  console.log("111:" + this.selectedcates.length);

      return this.selectedcates.length != 3;
    },
    currentTab: function() {
      return this.activeName == "many" ? "动态属性" : "静态属性";
    }
  },
  data() {
    return {
      categoresList: [],
      selectedcates: [],
      //   isSelected:true,
      activeName: "many",
      dataList: [], // tab栏显示的数据
      dialogVisible: false, // 对话框控制
      attrrules: {
        attrname: [
          { required: true, message: "内容不能为空", trigger: "blur" }
          //   { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      },
      method: "添加",
      attrForm: {
        attrname: ""
      },
      attredit: {} // 修改时候保存的数据
      //  inputVisible: false,   // 新tag 用的
      //   inputValue: ''     // 新tag 用的
    };
  },
  methods: {
    // 所有分类列表
    async getCategores() {
      const { data: res } = await this.$http.get("categories");

      // console.log(res);
      this.categoresList = res.data;
    },
    //根据分类id获取列表  后面参数 如果为only 则获取分类静态数据 否则 获取动态数据
    async categores(id, only) {
      const { data: res } = await this.$http.get(
        "categories/" + id + "/attributes",
        { params: { sel: only == "only" ? "only" : "many" } }
      );
      !res.data
        ? ""
        : res.data.forEach(e => {
            e.attr_vals = e.attr_vals != "" ? e.attr_vals.split(",") : [];
            e.inputVisible = false;
            e.inputValue = "";
          });
      this.dataList = res.data;
    },
    // 选择分类chang
    handleChange() {
      if (this.selectedcates.length < 3) return (this.selectedcates = []);

      //   console.log(this.selectedcates[2]);
      this.categores(this.selectedcates[2], this.activeName);
    },
    // 选项卡点击
    handleClick() {
      //    console.log(this.activeName);
      this.categores(this.selectedcates[2], this.activeName);
    },
    // 添加动态属性
    addparams() {
      this.method = "添加";
      this.attrForm.attrname = "";
      this.dialogVisible = true;
    },
    // 添加 修改 提交
    submitform() {
      this.$refs.attrForm.validate(async valid => {
        if (!valid) return false;
        //   console.log(v);

        if (this.method == "添加") {
          console.log("添加属性");
          const { data: res } = await this.$http.post(
            "categories/" + this.selectedcates[2] + "/attributes",
            {
              attr_name: this.attrForm.attrname.split(":")[0],
              attr_vals: this.attrForm.attrname.split(":")[1],
              attr_sel: this.activeName
            }
          );

          console.log(res);
          this.resetForm();
        } else {
          console.log("修改功能");
          console.log(this.attredit); // 修改前所有的参数
          console.log(this.attrForm.attrname); // 修改后的属性
          console.log(this.activeName);
          console.log(this.attrForm.attr_vals);

          const { data: res } = await this.$http.put(
            "categories/" +
              this.attredit.cat_id +
              "/attributes/" +
              this.attredit.attr_id,
            {
              attr_name: this.attrForm.attrname,
              attr_sel: this.activeName,
              attr_vals: this.attrForm.attr_vals
            }
          );

          console.log(res);
        }

        this.categores(this.selectedcates[2], this.activeName);
        this.dialogVisible = false;
      });
    },
    // 重置提交表单
    resetForm() {
      this.$refs.attrForm.resetFields();
      this.dialogVisible = false;
    },
    // 修改功能 打开对话框
    editattr(val) {
      this.method = "修改";
      //  console.log(this.activeName);
      //  console.log(val);

      this.dialogVisible = true;
      this.attrForm.attrname = val.attr_name;
      this.attredit = val;
    },
    //删除属性
    async deleteAttr(val) {
      console.log(val);
      console.log(this.selectedcates[2]);
      const { data: res } = await this.$http.delete(
        `categories/${this.selectedcates[2]}/attributes/${val.attr_id}`
      ); // attr_sel
      console.log(res);
      if (res.meta.status == 200) {
        this.categores(this.selectedcates[2], this.activeName);
      }
    },
    // 添加的那个tag 事件
    showInput(e) {
      e.inputVisible = true;
      //    console.log(e.inputValue);

      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加tag 标签
    async handleInputConfirm(e) {
      console.log(e);

      console.log(e.inputValue);
      e.inputValue != "" && e.attr_vals.indexOf(e.inputValue) == -1
        ? e.attr_vals.push(e.inputValue)
        : "";
      const { data: res } = await this.$http.put(
        `categories/${e.cat_id}/attributes/${e.attr_id}`,
        {
          attr_name: e.attr_name,
          attr_sel: e.attr_sel,
          attr_vals: e.attr_vals.join()
        }
      );
      console.log(res);

      // let inputValue = this.inputValue;
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      e.inputVisible = false;
      e.inputValue = "";
    },
    // 删除单个tag标签
    async deleteTag(i, e) {
      console.log(i);
      console.log(e);
      e.attr_vals.splice(i, 1);
      const { data: res } = await this.$http.put(
        `categories/${e.cat_id}/attributes/${e.attr_id}`,
        {
          attr_name: e.attr_name,
          attr_sel: e.attr_sel,
          attr_vals: e.attr_vals.join()
        }
      );
      console.log(res);
    }
  }
};
</script>
<style scoped lang="less">
.el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
