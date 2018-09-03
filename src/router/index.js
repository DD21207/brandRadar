import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Admin from '@/views/Admin'
import Content from '@/views/Content'






Vue.use(Router)

export default new Router({
  //上线
  base:'/brandradar/',

  //test   
  // base:'/testbrandradar/',
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
  },{
    path:'/contentList',
    name:'Content',
    component:Content
  }]
})
