import { THashMap, TIdentifieable, TNullable, TOptional, TSerializable } from 'cubes'

export interface ICompetencyGroupInfo extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  id: string
  name: THashMap<TNullable<string>>
  competenciesCount: number
  lastModifiedDateUtc: TNullable<string>
}
