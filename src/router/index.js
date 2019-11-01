import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue' // 引入Login.vue组件
Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'}, // 重定向login
  {path:'/login', component:Login}, // 登录
]

const router = new VueRouter({
  routes
})

export default router
