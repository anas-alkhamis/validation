import { clientMaps as cubesAppClientMaps } from 'cubes-app'
import { performanceReviewInfo } from './app/repository/proxy/appraisals/performance-review.proxy'

const clientMaps = {
  ...cubesAppClientMaps,
  performanceReviewInfo
}
export { clientMaps }
export type TClients = typeof clientMaps
