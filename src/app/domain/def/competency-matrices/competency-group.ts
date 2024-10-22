import { Base, clone, THashMap, TNullable, TOptional, uid } from 'cubes'
import { ICompetencyGroup } from '../../meta/competency-matrices/i-competency-group'
import { ICompetency } from '../../meta/my-application/common/i-competency'
import { defaultTranslatableFallback } from 'cubes-ui'
import { Competency } from './competency'

export class CompetencyGroup extends Base<ICompetencyGroup, 'id'> implements ICompetencyGroup {
  name!: THashMap<string>
  competenciesCount!: number
  lastModifiedDateUtc!: string
  description!: THashMap<string>
  competencies!: TNullable<ICompetency[]>
  id: TOptional<string>
  deserialize(
    {
      id = uid(),
      name = defaultTranslatableFallback,
      competenciesCount = 0,
      lastModifiedDateUtc = '',
      description = defaultTranslatableFallback,
      competencies = [],
      ...rest
    } = {} as Partial<ICompetencyGroup>
  ) {
    super.deserialize(rest)
    this.id = id
    this.name = clone(name ?? defaultTranslatableFallback, true)
    this.competenciesCount = competenciesCount
    this.lastModifiedDateUtc = lastModifiedDateUtc
    this.description = clone(description ?? defaultTranslatableFallback, true)
    this.competencies = competencies?.length ? competencies.map(x => new Competency(x)) : []
  }
}
