import { THashMap, TIdentifieable, TNullable, TOptional, TSerializable } from 'cubes'

export interface ICompetency extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  name: THashMap<string>
  weight: number
  competenciesCount: number
  lastModifiedDateUtc: TNullable<string>
  description: THashMap<string>
  index: number
  isNew?: false
}
