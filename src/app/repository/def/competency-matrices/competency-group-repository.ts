import { IoCLevelsEnum } from '@/control'
import { repositoryMap, serviceMap } from '@/service'
import { Inject, Service, TUID } from 'cubes'
import { INetworkManager, TProxyResult } from 'cubes-ui'

import { TCompetencyGroupClient } from '../../proxy/competency-matrices/competency-matrices.proxy'
import { ICompetencyGroup } from '@/app/domain/meta/competency-matrices/i-competency-group'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'
import { ICompetencyGroupRepository } from '../../meta/competency-matrices/i-competency-group-repository'

@Service(IoCLevelsEnum.DEV_2, repositoryMap.CompetencyGroupRepository.key)

class CompetencyGroupRepository implements ICompetencyGroupRepository {

  @Inject(serviceMap.NetworkManager.key) networkManager!: INetworkManager<TCompetencyGroupClient>
  
  public readonly id: TUID = repositoryMap.CompetencyGroupRepository.key

  getAsync(id: string): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.get({ id })
  }
  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.list({ query: { ...filter } })
  }
  putAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.put({ data: { ...data } } as Partial<ICompetencyGroup>)
  }
  postAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.post({ data: { ...data } } as Partial<ICompetencyGroup>)
  }
  deleteAsync(id: string): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.delete({ id })
  }
  listCompetenciesByGroupIdAsync(ids: string[]): TProxyResult<ICompetencyGroup> {
    return this.networkManager.clients.competencyGroup.api.listCompetenciesByGroupId({ data: ids as any })
  }
  dispose(): void {}
}

export { CompetencyGroupRepository }
