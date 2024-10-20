import { Base, clone, THashMap, TNullable, TOptional, uid } from 'cubes'
import { IPerformanceReviewInfo } from '../../meta/apprisals/i-performance-review-info'
import { defaultTranslatableFallback } from 'cubes-ui'

class PerformanceReviewInfo extends Base<IPerformanceReviewInfo, 'id'> implements IPerformanceReviewInfo {
  id: TOptional<string>
  year!: number
  name!: THashMap<string>
  draftCreatedById!: TNullable<string>
  hasDraft!: boolean
  draftId!: TNullable<string>

  deserialize({ id = uid(), name = defaultTranslatableFallback, year = 0, draftCreatedById = null, hasDraft = false, draftId = null, ...rest } = {} as Partial<IPerformanceReviewInfo>) {
    super.deserialize(rest)
    this.id = id
    this.name = clone(name ?? defaultTranslatableFallback, true)
    this.year = year
    this.draftCreatedById = draftCreatedById ? draftCreatedById : null
    this.hasDraft = hasDraft
    this.draftId = draftId ? draftId : null
  }
}

export { PerformanceReviewInfo }
