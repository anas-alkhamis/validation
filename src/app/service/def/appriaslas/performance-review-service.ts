import { IPerformanceReviewInfo } from '@/app/domain/meta/apprisals/i-performance-review-info'
import { IPerformanceReviewFilterArgs } from '@/app/domain/meta/i-list-args'
import { IPerformanceReviewRepository } from '@/app/repository/meta/appraisals/i-performance-review-repository'
import { IoCLevelsEnum } from '@/control'
import { serviceMap } from '@/service'
import { Inject, Service, Singleton } from 'cubes'
import { TProxyResult } from 'cubes-ui'

@Service(IoCLevelsEnum.DEV_2, serviceMap.PerformanceReviewService.key)
@Singleton
class PerformanceReviewService {
  @Inject() PerformanceReviewRepository!: IPerformanceReviewRepository

  listAsync(filter: IPerformanceReviewFilterArgs): TProxyResult<IPerformanceReviewInfo> {
    return this.PerformanceReviewRepository.listAsync(filter)
  }
}

export default PerformanceReviewService
