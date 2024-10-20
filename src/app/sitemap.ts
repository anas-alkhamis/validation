import { defineComponent } from 'vue'
import { profilePage } from 'cubes-app'
import { sessionRoutes } from 'cubes-ui'

// const Home = () => import('./presentation/home/index.vue')

const RouterView = defineComponent({
  template: '<router-view></router-view>'
})

// 404
//const PageNotFound = () => import('./presentation/pages/404.vue')

//dashboard
const Dashboard = () => import('./presentation/pages/dashboard/index.vue')
//dashboard

//Appraisals
const Appraisals = () => import('./presentation/pages/appraisals/index.vue')
const AppraisalsDraftList = () => import('./presentation/pages/appraisals/drafts/index.vue')
const AppraisalsPerformanceReviewList = () => import('./presentation/pages/appraisals/performance-review-list/index.vue')
//Appraisals

// access denied
const AccessDenied = () => import('./presentation/access-denied/access-denied.vue')
// access denied

const dashboard = {
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: {
    title: { en: 'Dashboard', ar: 'واجهة قياس الأداء' },
    icon: 'cubes-dashboard'
  }
}

// child
const draftList = {
  path: '/draft-list',
  name: 'draft-list',
  component: AppraisalsDraftList,
  meta: {
    title: { en: 'Drafts', ar: 'المسودات' },
    hasParent: true,
    parent: 'appraisals'
  }
}

// root
const appraisal = {
  path: '/appraisals',
  name: 'appraisals',
  component: Appraisals,
  meta: {
    title: { en: 'Appraisals', ar: 'التقييم' },
    icon: 'cubes-dashboard'
  },
  children: [draftList]
}

const routes = [
  dashboard,
  appraisal,
  ...sessionRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  },
  {
    path: '/accessDenied',
    name: 'access-denied',
    component: AccessDenied,
    meta: {
      title: { en: 'Access Denied', ar: 'غير مسموح بالدخول' },
      hidden: true
    }
  }
]
if (window['configure']().secure) {
  profilePage.meta.icon = 'cubes-profile'
  routes.splice(routes.length - 2, 0, profilePage)
}

export default routes
