import { PerformanceReviewInfo } from '@/app/domain/def/apprisals/performance-review-info'
import { clientFactory, Pagination, TEndPoint } from 'cubes-ui'

const { baseURL, api } = (window as Window & typeof globalThis & { configure: any })['configure']().network['appraisalsApi']
const config = { baseURL: `${baseURL}${api}` }

const performanceReviewInfo = () =>
  clientFactory(
    true,
    PerformanceReviewInfo,
    config,
    {
      list: { verb: 'get', template: `/PerformanceReview` } as TEndPoint
    },
    undefined,
    {
      dataResolver: (json: any) => json.records ?? json,
      paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount })
    },
    false
  )

const clientMap = { performanceReviewInfo }

type TPerformanceReviewClient = typeof clientMap

export type { TPerformanceReviewClient }
export { performanceReviewInfo }
