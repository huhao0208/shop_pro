<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单内容列表 -->
      <el-table :data="ordersList.goods">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" min-width="250"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" min-width="50px"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" min-width="100px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.order_pay==0? 'danger':'success'"
            >{{scope.row.order_pay==0?"未付款":"已付款"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" min-width="200px">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat()}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="ordersEdit(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="location(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 物流信息弹窗 -->
      <el-dialog title="物流信息" :visible.sync="dialogVisible" width="50%">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in addressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>

      <!-- 添加地址 -->
      <el-dialog title="添加地址" :visible.sync="dialogVisible1" width="50%" :before-close="resetForm">
        <el-form
          label-width="100px"
          :model="editAddress"
          ref="editAddressRef"
          :rules="editAddressRules"
        >
          <el-form-item label="省市区/县" prop="locationA">
            <el-cascader :options="cityOptions" :show-all-levels="false" @change="handleChange" v-model="editAddress.locationA"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="locationB">
            <el-input v-model="editAddress.locationB"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm ">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersParams.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="ordersParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ordersList.total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>

import cityOptions from "../../assets/js/city_data2017_element.js";
export default {
  created() {
    this.getOrders();
  },
  data() {
    return {
      cityOptions: cityOptions,
      dialogVisible1: false, // 添加地址 开关
      dialogVisible: false, // 物流信息弹窗 显示开关
      ordersParams: {
        // 获取订单时候传入的参数
        query: "", // 查询参数
        pagenum: 1, // 当前页
        pagesize: 10, // 每页条数
        user_id: "", // 用户id
        pay_status: "", // 支付状态
        is_send: "", // 是否发货
        order_fapiao_title: "", // ['个人'/'公司']
        order_fapiao_content: "", // 发票内容
        order_fapiao_company: "", // 公司名称
        consignee_addr: "" // 发票内容
      },
      addressInfo: [], // 物流信息
      ordersList: {}, // 获取到的订单列表 及 页码信息
      editAddress: {}, // 修改的订单地址
      editAddressRules: {
        locationA: [
          {
            required: true,
            message: "你还未选择省市区/县",
            trigger: "change"
          }
        ],
        locationB: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 获取所有订单
    async getOrders() {
      const { data: res } = await this.$http.get("orders", {
        params: this.ordersParams
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.ordersList = res.data;
    },
    // 分页事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.ordersParams.pagesize = val;
      // console.log(this.ordersParams);

      this.getOrders();
    },
    handleCurrentChange(val) {
      this.ordersParams.pagenum = val;
      // console.log(`当前页: ${val}`);
      this.getOrders();
    },
    // 订单编辑
    ordersEdit(val) {
      console.log(val);
      this.dialogVisible1 = true;
    },
    // 物流查询
    async location(val) {
      console.log(val);
      const { data: res } = await this.$http.get("/kuaidi/" + 1106975712662);
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取物流信息失败");
      this.addressInfo = res.data;
      this.dialogVisible = true;
    },
    // 地址选择
    handleChange(value) {
      console.log(value);
    },
    // 提交修改
    submitForm() {
      this.$refs.editAddressRef.validate(valid => {
        if (!valid) return false;
        console.log(this.editAddress);
        //  在此处进行提交修改--在此处进行提交修改--在此处进行提交修改--在此处进行提交修改--
        
      // 添加成功后执行
          this.resetForm()
        
      });
    },
    resetForm() {
      this.$refs.editAddressRef.resetFields();
     this.editAddress={};
     this.dialogVisible1=false;
    }
  }
};
</script>
<style scoped lang="less">
</style>