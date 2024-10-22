import { CompetencyGroup } from '@/app/domain/def/competency-matrices/competency-group'
import { CompetencyGroupInfo } from '@/app/domain/def/competency-matrices/competency-group-info'
import { THashMap } from 'cubes'
import { clientFactory, Pagination, TEndPoint } from 'cubes-ui'

const { baseURL, api } = (window as Window & typeof globalThis & { configure: any })['configure']().network['appraisalsApi']
const config = { baseURL: `${baseURL}${api}` }
const competencyGroup = () =>
  clientFactory(
    true,
    CompetencyGroup,
    config,
    {
      get: { verb: 'get', template: `/CompetencyGroup/{1}` },
      list: { verb: 'get', template: `/CompetencyGroup` },
      put: { verb: 'put', template: `/CompetencyGroup` },
      post: { verb: 'post', template: `/CompetencyGroup` },
      delete: { verb: 'delete', template: `/CompetencyGroup/{1}` },
      listCompetenciesByGroupId: { verb: 'post', template: `/CompetencyGroup/competenciesByGroupIdsAsync` }
    } as THashMap<TEndPoint>,
    undefined,
    { dataResolver: (json: any) => json.records ?? json, paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount }) },
    false
  )
const competencyGroupInfo = () =>
  clientFactory(
    true,
    CompetencyGroupInfo,
    config,
    {
      list: { verb: 'get', template: `/CompetencyGroup` },
      listCompetencyGroups: { verb: 'get', template: `/CompetencyGroup/competencyGroups` }
    } as THashMap<TEndPoint>,
    undefined,
    { dataResolver: (json: any) => json.records ?? json, paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount }) },
    false
  )

const clientMap = { competencyGroup, competencyGroupInfo }

type TCompetencyGroupClient = typeof clientMap

export type { TCompetencyGroupClient }
export { competencyGroup, competencyGroupInfo }
