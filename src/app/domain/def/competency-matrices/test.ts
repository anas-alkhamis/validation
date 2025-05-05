import { THashMap, TOptional, Base, uid, clone, TNullable, TSerializable, TIdentifieable } from 'cubes'
import { defaultTranslatableFallback } from 'cubes-ui'

export interface ITest extends TSerializable<TIdentifieable<{ id: TOptional<string> }, 'id'>> {
  name: THashMap<string>
  age: number
  password: string
  email: string
  date: TNullable<string>
  entity: TOptional<Object>
  info: { description: string }
}

export class Test extends Base<ITest, 'id'> implements ITest {
  id: TOptional<string>
  name!: THashMap<string>
  age!: number
  password!: string
  email!: string
  date!: TNullable<string>
  entity!: TOptional<Object>
  info!: { description: string }

  deserialize({ name = defaultTranslatableFallback, age = 0, password = '', email = '', date = null, id = uid(), entity, info = { description: '' }, ...rest } = {} as Partial<ITest>) {
    super.deserialize(rest)
    this.name = clone(name ?? defaultTranslatableFallback, true)
    this.age = age
    this.password = password
    this.email = email
    this.date = date
    this.id = id
    this.entity = entity
    this.info = info
  }
}

export class ListTest extends Base<any, 'id'> {
  data!: ITest[]

  deserialize({ data = [] }) {
    this.data = data.map(d => new Test(d))
  }
}
