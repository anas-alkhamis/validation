import { THashMap, uid } from 'cubes'
import { TResult, modalMap as builtInModalMap } from 'cubes-ui'
import { repositoryMap, serviceMap, services } from './service'
import { AppCoreBase } from 'cubes-app'
import Application from './app/App.vue'
import { clientMaps } from './proxy'
import routes from './app/sitemap'
import { i18nFiles } from './i18n'

const modalMap = {
  ...builtInModalMap
}

export type TProxyResult<T> = Promise<TResult<T>>
export const AppContexts: THashMap = {
  appContext: `appContext`,
  appraisalsContext: `appraisalsContext-${uid()}`
} as any
type TModals = typeof modalMap
export type TModalMap = { [key in keyof TModals]: (typeof modalMap)[key]['props'] }

export enum IoCLevelsEnum {
  DEFAULT_0, // cubes level services..
  PROD_1, // first overrides
  DEV_2 // you can add up as much as you wish in the container
}

class App extends AppCoreBase {
  constructor(e: HTMLElement, c: any) {
    //@ts-ignore
    super(e, c, Application, IoCLevelsEnum.DEV_2, __lib__)
    //@ts-ignore
    this.version = __version__
  }
  setupActiveControl() {
    return this
  }
  getCustomIcons() {
    return [
      require('@fortawesome/free-solid-svg-icons/faCircleNodes').definition,
      require('@fortawesome/free-solid-svg-icons/faDownLeftAndUpRightToCenter').definition,
      require('@fortawesome/free-solid-svg-icons/faBookOpen').definition,
      require('@fortawesome/free-solid-svg-icons/faMagnifyingGlass').definition,
      require('@fortawesome/free-solid-svg-icons/faQrcode').definition,
      require('@fortawesome/free-solid-svg-icons/faArrowsRotate').definition,
      require('@fortawesome/free-solid-svg-icons/faPenToSquare').definition
    ]
  }
  getAppContext(): any {
    return AppContexts
  }
  getServiceMap() {
    return { ...serviceMap, ...repositoryMap }
  }
  getServices() {
    return [services]
  }
  geti18n() {
    return [i18nFiles]
  }
  getSiteMapRoutes() {
    return routes
  }
  getModalConfig() {
    return modalMap
  }
  getNetworkClients() {
    return clientMaps
  }
}

export { App }
