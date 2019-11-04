import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue' // 引入Login.vue组件
import Home from '../components/Home.vue'
import UserPage from '../components/user/UserPage.vue'
import Welcome from '../components/Welcome.vue'
Vue.use(VueRouter)


const routes = [
  {path:'/',redirect:'/login'}, // 重定向login
  {path:'/login', component:Login}, // 登录
  {path:'/home',component:Home,redirect:'/welcome',children:[
    {path:'/welcome',component:Welcome},
    {path:'/users',component:UserPage}
  ]} ,// home 页面
  
]


const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(to.path);
  // 判断是否在登录页面 是的话继续
  // 判断是否有token 没有的话跳转登录页面 有的话继续

  if(to.path=='/login') return next();
  const token = window.sessionStorage.getItem("token")
  if(!token||token.length==0) return next('/login')
  return next()
})



export default router

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}