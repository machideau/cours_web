import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Quiz from './components/Quiz.vue'
import CoursesExplorer from './components/CoursesExplorer.vue'
import DashboardProgress from './components/DashboardProgress.vue'
import HomeFeatured from './components/HomeFeatured.vue'
import './style.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
    app.component('CoursesExplorer', CoursesExplorer)
    app.component('DashboardProgress', DashboardProgress)
    app.component('HomeFeatured', HomeFeatured)
  }
}

