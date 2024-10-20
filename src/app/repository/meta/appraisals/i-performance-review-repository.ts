import { IRepository, TProxyResult } from 'cubes-ui'
import { TPerformanceReviewClient } from '../../proxy/appraisals/performance-review.proxy'
import { IPerformanceReviewInfo } from '@/app/domain/meta/apprisals/i-performance-review-info'
import { IPerformanceReviewFilterArgs } from '@/app/domain/meta/i-list-args'

interface IPerformanceReviewRepository extends IRepository<TPerformanceReviewClient> {
  listAsync(query: IPerformanceReviewFilterArgs): TProxyResult<IPerformanceReviewInfo>
}

export type { IPerformanceReviewRepository }
