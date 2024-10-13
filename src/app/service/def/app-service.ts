import { AppServiceBase, IModalManager, IUser, useTranslation } from 'cubes-ui'
import { IAppraisalsAppService, TModalManagerAction } from '../meta/i-app-service'
import { Inject, Service, Singleton, TOptional } from 'cubes'
import { IoCLevelsEnum, TModalMap } from '../../../control'

import { IAppService, TApplicationConfig } from 'cubes-ui/dist/types/lib/module'
import { serviceMap } from '../../../service'
import { IOrgUnit, IOrgUnitWithSubCount, IUnitService, IUserService, OrgUnitWithSubCount } from 'cubes-app'
import { ref } from 'vue'
import { Application } from '@/app/domain/def/application'
import { TApplication } from '@/app/domain/meta/i-application'

@Service(IoCLevelsEnum.PROD_1, serviceMap.AppService.key)
@Singleton
class AppraisalsAppService extends AppServiceBase implements IAppraisalsAppService {
  onRouteToLogInHandler?(): void {
    throw new Error('Method not implemented.')
  }
  onRouteToLogOutHandler?(): void {
    throw new Error('Method not implemented.')
  }
  errorHandler(errorMSG: string): void {
    const { tGlobal } = useTranslation(this.AppService)
    this.AppService.error(ref(tGlobal.common.errors[errorMSG] as string))
  }
  public readonly id: string = serviceMap.AppService.key
  application!: TApplication // = new Application({})
  @Inject() ModalManager!: IModalManager<TModalMap>
  @Inject() AppService!: IAppService
  @Inject() UnitService!: IUnitService
  @Inject() UserService!: IUserService

  protected createApp(config: Partial<TApplicationConfig>, state?: TApplication['state']) {
    this.application = new Application({ config, state } as Partial<TApplication>)
  }
  
  async getUser(id: string): Promise<TOptional<IUser>> {
    try {
      return (await this.UserService.getAsync(id)).data as IUser
    } catch (error) {
      const { tGlobal } = useTranslation(this.AppService)
      this.AppService.error(ref(tGlobal.requestError as string), undefined, 'appService::getUser')
      return Promise.reject()
    }
  }

  async getUnit(id: string): Promise<TOptional<IOrgUnit>> {
    try {
      return (await this.UnitService.getAsync(id)).data as IOrgUnit
    } catch (error) {
      const { tGlobal } = useTranslation(this.AppService)
      this.AppService.error(ref(tGlobal.requestError as string), undefined, 'appService::getUnit')
      return Promise.reject()
    }
  }

  async getUnitSubsAsync(id: string): Promise<TOptional<IOrgUnitWithSubCount[]>> {
    try {
      return (await this.UnitService.listSubAsync({ parentId: id }, ['query.parentId'])).data as IOrgUnitWithSubCount[]
    } catch (error) {
      const { tGlobal } = useTranslation(this.AppService)
      this.AppService.error(ref(tGlobal.requestError as string), undefined, 'appService::getUnitSubsAsync')
      return Promise.reject()
    }
  }

  async getUnitWithSubCount(id: string): Promise<TOptional<IOrgUnitWithSubCount>> {
    try {
      const unit = await this.getUnit(id)
      const unitSubs = (await this.getUnitSubsAsync(id)) as IOrgUnitWithSubCount[]
      return new OrgUnitWithSubCount({ ...unit, subUnitsCount: unitSubs.length })
    } catch (error) {
      const { tGlobal } = useTranslation(this.AppService)
      this.AppService.error(ref(tGlobal.requestError as string), undefined, 'appService::getUnitWithSubCount')
      return Promise.reject()
    }
  }
}

export default AppraisalsAppService
