import type { IAppService, IUser, TModal, TOpenPromise } from 'cubes-ui'
import type { TModalMap } from '../../../control'
import type { TOptional } from 'cubes'
import type { IOrgUnit, IOrgUnitWithSubCount } from 'cubes-app'
import { TApplication } from '@/app/domain/meta/i-application'

export type TNoNext<T> = Omit<T, 'next'>

export type TModalManagerAction<T extends keyof TModalMap> = Promise<TNoNext<TOpenPromise<TModal<TModalMap, T>>>>
interface IAppraisalsAppService extends IAppService {
  application: TApplication
  getUser(id: string): Promise<TOptional<IUser>>
  getUnit(id: string): Promise<TOptional<IOrgUnit>>
  getUnitSubsAsync(id: string): Promise<TOptional<IOrgUnitWithSubCount[]>>
  getUnitWithSubCount(id: string): Promise<TOptional<IOrgUnitWithSubCount>>
}

export type { IAppraisalsAppService }
