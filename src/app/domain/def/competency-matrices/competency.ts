import { THashMap, TOptional, Base, uid, clone } from 'cubes'
import { ICompetency } from '../../meta/my-application/common/i-competency'
import { defaultTranslatableFallback } from 'cubes-ui'

export class Competency extends Base<ICompetency, 'id'> implements ICompetency {
  name!: THashMap<string>
  weight!: number
  competenciesCount!: number
  lastModifiedDateUtc!: string
  description!: THashMap<string>
  index!: number
  id!: TOptional<string>
  constructor(data?: Partial<ICompetency>) {
    super()
    this.deserialize(data)
  }
  deserialize(
    {
      name = defaultTranslatableFallback,
      weight = 0,
      competenciesCount = 0,
      lastModifiedDateUtc = '',
      description = defaultTranslatableFallback,
      index = 0,
      id = uid(),
      ...rest
    } = {} as Partial<ICompetency>
  ) {
    super.deserialize(rest)
    this.name = clone(name ?? defaultTranslatableFallback, true)
    this.weight = weight
    this.competenciesCount = competenciesCount
    this.lastModifiedDateUtc = lastModifiedDateUtc
    this.description = clone(description ?? defaultTranslatableFallback, true)
    this.index = index
    this.id = id
  }
}
