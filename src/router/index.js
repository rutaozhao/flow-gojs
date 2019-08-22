import Vue from 'vue'
import Router from 'vue-router'
import flow from '@/components/flow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'flow',
      component: flow
    }
  ]
})
