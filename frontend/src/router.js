import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CourseView from './views/CourseView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/course/:slug',
    name: 'course',
    component: CourseView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top on navigation, unless using back/forward buttons
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
