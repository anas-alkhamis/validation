import { TProxyResult } from 'cubes-ui'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'
import { ICompetencyGroupInfo } from '@/app/domain/meta/competency-matrices/i-competency-group-info'

export interface ICompetencyGroupInfoService {
  /**
   * @summary: get list of competency group
   */
  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo>

  /**
   * @summary: get list of competency groups
   */
  listCompetencyGroupsAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo>
}
