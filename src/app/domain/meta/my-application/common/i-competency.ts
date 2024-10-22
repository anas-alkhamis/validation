import { THashMap, TIdentifieable, TOptional, TSerializable } from 'cubes'

export interface ICompetency extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  name: THashMap<string>
  weight: number
  competenciesCount: number
  lastModifiedDateUtc: string
  description: THashMap<string>
  index: number
}
