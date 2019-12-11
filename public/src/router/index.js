import Vue from 'vue'
import Router from 'vue-router'
import ProjectIndex from '@/components/Project/Index'

import {
  ROUTE_HOMEPAGE
} from './routes-list'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: ROUTE_HOMEPAGE,
            component: ProjectIndex
        }
    ]
})
