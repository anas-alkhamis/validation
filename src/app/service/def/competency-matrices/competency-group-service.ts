import { IoCLevelsEnum, TProxyResult } from '@/control'
import { serviceMap } from '@/service'
import { Inject, Service, Singleton } from 'cubes'
import { ICompetencyGroup } from '@/app/domain/meta/competency-matrices/i-competency-group'
import { ICompetencyGroupRepository } from '@/app/repository/meta/competency-matrices/i-competency-group-repository'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'

@Service(IoCLevelsEnum.DEV_2, serviceMap.CompetencyGroupService.key)
@Singleton
class CompetencyGroupService {
  @Inject() CompetencyGroupRepository!: ICompetencyGroupRepository
  getAsync(id: string): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.getAsync(id)
  }
  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.listAsync(filter)
  }
  putAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.putAsync({ ...data })
  }
  postAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.postAsync({ ...data })
  }
  deleteAsync(id: string): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.deleteAsync(id)
  }
  listCompetenciesByGroupIdAsync(ids: string[]): TProxyResult<ICompetencyGroup> {
    return this.CompetencyGroupRepository.listCompetenciesByGroupIdAsync(ids)
  }
}

export { CompetencyGroupService }
