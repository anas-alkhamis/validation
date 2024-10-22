import { IRepository, TProxyResult } from 'cubes-ui'
import { TCompetencyGroupClient } from '../../proxy/competency-matrices/competency-matrices.proxy'
import { ICompetencyGroup } from '@/app/domain/meta/competency-matrices/i-competency-group'
import { ICommonArgs } from '@/app/domain/meta/i-list-args'

export interface ICompetencyGroupRepository extends IRepository<TCompetencyGroupClient> {
  /**
   * @summary: get competency group by group id
   */
  getAsync(id: string): TProxyResult<ICompetencyGroup>
  /**
   * @summary: get list of competency group
   */
  listAsync(filter: ICommonArgs): TProxyResult<ICompetencyGroup>
  /**
   * @summary: update competency group
   */
  putAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup>
  /**
   * @summary: create competency group
   */
  postAsync(data: ICompetencyGroup): TProxyResult<ICompetencyGroup>
  /**
   * @summary: delete competency group by group id
   */
  deleteAsync(id: string): TProxyResult<ICompetencyGroup>
  /**
   * @summary: get list of competency group by group id
   */
  listCompetenciesByGroupIdAsync(ids: string[]): TProxyResult<ICompetencyGroup>
}
