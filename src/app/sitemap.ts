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

//Competency Matrices
const CompetencyMatrices = () => import('./presentation/pages/competency-matrices/index.vue')
const CoreCompetencies = () => import('./presentation/pages/competency-matrices/core-competencies/index.vue')
const CreateCompetency = () => import('./presentation/pages/competency-matrices//create-competency/index.vue')

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
const coreCompetencies = {
  path: 'core-competencies/:id/view',
  name: 'core-competencies',
  component: CoreCompetencies,
  meta: {
    title: { en: 'Core Competencies', ar: 'الكفاءات الأساسية' },
    hasParent: true,
    parent: 'competency-matrices',
    child: true,
    disabled: true,
    viewMode: false
  }
}
const createCompetencies = {
  path: 'create-competency',
  name: 'create-competency',
  component: CreateCompetency,
  meta: {
    title: { en: 'Create New Competency Matrix', ar: 'الكفاءات الأساسيةإنشاء مصفوفة كفاءة جديدة' },
    hasParent: true,
    parent: 'competency-matrices',
    child: true,
    disabled: true,
    viewMode: false
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
const competencyMatrices = {
  path: '/competency-matrices',
  name: 'competency-matrices',
  component: CompetencyMatrices,
  meta: {
    title: { en: 'Competency Matrices', ar: 'مصفوفات الكفاءة' },
    icon: 'cubes-dashboard'
  },
  children: [coreCompetencies, createCompetencies]
}

const routes = [
  dashboard,
  appraisal,
  competencyMatrices,
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
if ((window as unknown as Window & { configure: any })['configure']().secure) {
  profilePage.meta.icon = 'cubes-profile'
  routes.splice(routes.length - 2, 0, profilePage)
}

export default routes
