import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import gate from '../components/goods/gate.vue'
import params from '../components/goods/params.vue'
import list from '../components/goods/list.vue'
import addGoods from '../components/goods/add.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: gate },
      { path: '/params', component: params },
      { path: '/goods', component: list },
      { path: '/goods/add', component: addGoods }
    ]
  }
]
const router = new VueRouter({

  routes

})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const totenStr = window.sessionStorage.getItem('token')
  if (!totenStr) return next('/login')
  next()
})
export default router
