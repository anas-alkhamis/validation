import { clientMaps as cubesAppClientMaps } from 'cubes-app'
import { performanceReviewInfo } from './app/repository/proxy/appraisals/performance-review.proxy'
import { competencyGroup, competencyGroupInfo } from './app/repository/proxy/competency-matrices/competency-matrices.proxy'

const clientMaps = {
  ...cubesAppClientMaps,
  performanceReviewInfo,
  competencyGroupInfo,
  competencyGroup
}
export { clientMaps }
export type TClients = typeof clientMaps
