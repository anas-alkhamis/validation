import { Base, clone, THashMap, TNullable, uid } from 'cubes'
import { ICompetencyGroupInfo } from '../../meta/competency-matrices/i-competency-group-info'
import { defaultTranslatableFallback } from 'cubes-ui'

export class CompetencyGroupInfo extends Base<ICompetencyGroupInfo, 'id'> implements ICompetencyGroupInfo {
  id!: string
  name!: THashMap<TNullable<string>>
  competenciesCount!: number
  lastModifiedDateUtc!: TNullable<string>
  deserialize({ id = uid(), name = defaultTranslatableFallback, competenciesCount = 0, lastModifiedDateUtc = '', ...rest } = {} as Partial<ICompetencyGroupInfo>): void {
    super.deserialize(rest)
    this.id = id
    this.name = clone(name ?? defaultTranslatableFallback, true)
    this.competenciesCount = competenciesCount
    this.lastModifiedDateUtc = lastModifiedDateUtc
  }
}
