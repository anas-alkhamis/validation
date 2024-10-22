//@ts-nocheck
const services = require.context(
  // Look for files in the current directory
  '.',
  //  look in subdirectories
  true,
  // Only include .ts files
  /\.ts$/
)

import { serviceMap as cubesServiceMap } from 'cubes-app'

const serviceMap = {
  ...cubesServiceMap,
  PerformanceReviewService: { key: 'PerformanceReviewService', config: {} },
  CompetencyGroupService: { key: 'CompetencyGroupService', config: {} },
  CompetencyGroupInfoService: { key: 'CompetencyGroupInfoService', config: {} }
}
const repositoryMap = {
  PerformanceReviewRepository: { key: 'PerformanceReviewRepository', config: {} },
  CompetencyGroupRepository: { key: 'CompetencyGroupRepository', config: {} },
  CompetencyGroupInfoRepository: { key: 'CompetencyGroupInfoRepository', config: {} }
}
type TCubesAppraisalServiceMap = typeof serviceMap
export { services, serviceMap, repositoryMap }
export type { TCubesAppraisalServiceMap }
