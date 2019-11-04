<template>
  <div>Welcome
    {{loginUser.username}}
  </div>
</template>
<script>
export default {
  created() {
      // 获取当前登录用户
      this.loginUser=JSON.parse(sessionStorage.getItem("user"))
      
  },
  data() {
    return {
      loginUser:''
    };
  },
  methods: {
  
  }
};
</script>
<style scoped lang="less">
</style>