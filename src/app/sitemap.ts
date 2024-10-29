import { defineComponent } from 'vue'
import { profilePage } from 'cubes-app'
import { sessionRoutes } from 'cubes-ui'
import { PageMode } from './domain/meta/my-application/common/enum/competency'

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
const CreateHeader = () => import('./presentation/pages/competency-matrices/content/headers/create.vue')
const EditHeader = () => import('./presentation/pages/competency-matrices/content/headers/edit.vue')
const ViewHeader = () => import('./presentation/pages/competency-matrices/content/headers/view.vue')

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
  components: {
    default: RouterView,
    header: ViewHeader
  },
  meta: {
    title: { en: 'Core Competencies', ar: 'الكفاءات الأساسية' },
    hasParent: true,
    parent: 'competency-matrices',
    child: true,
    disabled: true,
    viewMode: false,
    mode: PageMode.VIEW
  }
}
const createCompetencies = {
  path: 'create-competency',
  name: 'create-competency',
  components: {
    default: RouterView,
    header: CreateHeader
  },
  meta: {
    title: { en: 'Create New Competency Matrix', ar: 'الكفاءات الأساسيةإنشاء مصفوفة كفاءة جديدة' },
    hasParent: true,
    parent: 'competency-matrices',
    child: true,
    disabled: true,
    viewMode: false,
    mode: PageMode.CREATE
  }
}
const editCompetencies = {
  path: 'edit-competency/:id',
  name: 'edit-competency',
  components: {
    default: RouterView,
    header: EditHeader
  },
  meta: {
    title: { en: 'Edit Competency Matrix', ar: 'تعديل' },
    hasParent: true,
    parent: 'competency-matrices',
    child: true,
    disabled: true,
    viewMode: false,
    mode: PageMode.EDIT
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
  children: [coreCompetencies, createCompetencies, editCompetencies]
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
