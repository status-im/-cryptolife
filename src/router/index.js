import Vue from 'vue'
import Router from 'vue-router'
import Listing from '@/components/Listing'
import Create from '@/components/Create'

Vue.use(Router)

export default new Router({
  routes: [
    {
      mode: 'history',
      path: '/',
      name: 'Root',
      component: Listing
    },
    {
      mode: 'history',
      path: '/home',
      name: 'Home',
      component: Listing
    },
    {
      mode: 'history',
      path: '/create',
      name: 'Create Bond',
      component: Create
    }
  ]
})