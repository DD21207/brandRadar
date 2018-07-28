import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Admin from '@/views/Admin'





Vue.use(Router)

export default new Router({
  base:'/brandradar/',
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path:'/admin',
    name:'Admin',
    component:Admin
  }]
})
