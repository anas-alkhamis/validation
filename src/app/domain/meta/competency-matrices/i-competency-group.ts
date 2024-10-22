import { THashMap, TIdentifieable, TNullable, TOptional, TSerializable } from 'cubes'
import { ICompetency } from '../my-application/common/i-competency'

export interface ICompetencyGroup extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  name: THashMap<TNullable<string>>
  competenciesCount: number
  lastModifiedDateUtc: string
  description: THashMap<string>
  competencies: TNullable<ICompetency[]>
}
