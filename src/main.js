import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入 element 组件
import './plugins/element.js'
import './assets/css/global.css'
// 导入图标样式表
import './assets/fonts/iconfont.css'

import ZkTable from 'vue-table-with-tree-grid'
 
Vue.component("table-tree", ZkTable) 
//引入axios 
import axios from 'axios'
// 设置请求根路径
axios.defaults.baseURL =`http://127.0.0.1:8888/api/private/v1/`

//axios请求拦截器
axios.interceptors.request.use(function(config){
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
},function(error){
  console.log(error)
})

// 挂载到vue原型
Vue.prototype.$http =axios;






Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


