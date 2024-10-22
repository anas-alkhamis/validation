import { IoCLevelsEnum, TProxyResult } from '@/control'
import { serviceMap } from '@/service'
import { Inject, Service, Singleton } from 'cubes'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'
import { ICompetencyGroupInfoRepository } from '@/app/repository/meta/competency-matrices/i-competency-group-info-repository'
import { ICompetencyGroupInfo } from '@/app/domain/meta/competency-matrices/i-competency-group-info'

@Service(IoCLevelsEnum.DEV_2, serviceMap.CompetencyGroupInfoService.key)
@Singleton
class CompetencyGroupInfoService {
  @Inject() CompetencyGroupInfoRepository!: ICompetencyGroupInfoRepository

  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo> {
    return this.CompetencyGroupInfoRepository.listAsync(filter)
  }

  listCompetencyGroupsAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo> {
    return this.CompetencyGroupInfoRepository.listCompetencyGroupsAsync(filter)
  }
}

export { CompetencyGroupInfoService }
