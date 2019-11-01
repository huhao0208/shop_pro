import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入 element 组件
import './plugins/element.js'
import './assets/css/global.css'
// 导入图标样式表
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
