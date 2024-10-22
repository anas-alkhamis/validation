import { IRepository, TProxyResult } from 'cubes-ui'
import { TCompetencyGroupClient } from '../../proxy/competency-matrices/competency-matrices.proxy'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'
import { ICompetencyGroupInfo } from '@/app/domain/meta/competency-matrices/i-competency-group-info'

export interface ICompetencyGroupInfoRepository extends IRepository<TCompetencyGroupClient> {
  /**
   * @summary: get list of competency group
   */
  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo>
  /**
   * @summary: get list of competency group
   */
  listCompetencyGroupsAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroupInfo>
}
