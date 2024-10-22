import { IoCLevelsEnum } from '@/control'
import { repositoryMap, serviceMap } from '@/service'
import { Inject, Service, TUID } from 'cubes'
import { INetworkManager, TProxyResult } from 'cubes-ui'

import { TCompetencyGroupClient } from '../../proxy/competency-matrices/competency-matrices.proxy'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'
import { ICompetencyGroupInfo } from '@/app/domain/meta/competency-matrices/i-competency-group-info'
import { ICompetencyGroupInfoRepository } from '../../meta/competency-matrices/i-competency-group-info-repository'

@Service(IoCLevelsEnum.DEV_2, repositoryMap.CompetencyGroupInfoRepository.key)
class CompetencyGroupInfoRepository implements ICompetencyGroupInfoRepository {
  @Inject(serviceMap.NetworkManager.key) networkManager!: INetworkManager<TCompetencyGroupClient>

  public readonly id: TUID = repositoryMap.CompetencyGroupInfoRepository.key

  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo> {
    return this.networkManager.clients.competencyGroupInfo.api.list({ query: { ...filter } })
  }

  listCompetencyGroupsAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo> {
    return this.networkManager.clients.competencyGroupInfo.api.listCompetencyGroups({ query: { ...filter } })
  }

  dispose(): void {}
}

export { CompetencyGroupInfoRepository }
