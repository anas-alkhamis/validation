import { THashMap, TIdentifieable, TNullable, TOptional, TSerializable } from 'cubes'

interface IPerformanceReviewInfo extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  id: TOptional<string>
  year: number
  name: THashMap<string>
  draftCreatedById: TNullable<string>
  hasDraft: boolean
  draftId: TNullable<string>
}

export type { IPerformanceReviewInfo }
