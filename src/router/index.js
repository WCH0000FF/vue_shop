import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home }
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
