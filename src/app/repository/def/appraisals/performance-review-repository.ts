import { IoCLevelsEnum } from '@/control'
import { repositoryMap, serviceMap } from '@/service'
import { IPerformanceReviewRepository } from '../../meta/appraisals/i-performance-review-repository'
import { IPerformanceReviewFilterArgs } from '@/app/domain/meta/i-list-args'
import { INetworkManager, TProxyResult } from 'cubes-ui'
import { IPerformanceReviewInfo } from '@/app/domain/meta/apprisals/i-performance-review-info'
import { Inject, Service, TUID } from 'cubes'
import { TPerformanceReviewClient } from '../../proxy/appraisals/performance-review.proxy'

@Service(IoCLevelsEnum.DEV_2, repositoryMap.PerformanceReviewRepository.key)
class PerformanceReviewRepository implements IPerformanceReviewRepository {
  @Inject(serviceMap.NetworkManager.key) networkManager!: INetworkManager<TPerformanceReviewClient>

  public readonly id: TUID = repositoryMap.PerformanceReviewRepository.key

  listAsync(filter: IPerformanceReviewFilterArgs): TProxyResult<IPerformanceReviewInfo> {
    return this.networkManager.clients.performanceReviewInfo.api.list({ query: { ...filter } as any })
  }

  dispose(): void {}
}

export { PerformanceReviewRepository }
