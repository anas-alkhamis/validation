import { IPerformanceReviewInfo } from '@/app/domain/meta/apprisals/i-performance-review-info'
import { IPerformanceReviewFilterArgs } from '@/app/domain/meta/i-list-args'
import { TProxyResult } from 'cubes-ui'

interface IPerformanceReviewService {
  listAsync(filter: IPerformanceReviewFilterArgs): TProxyResult<IPerformanceReviewInfo>
}

export type { IPerformanceReviewService }
