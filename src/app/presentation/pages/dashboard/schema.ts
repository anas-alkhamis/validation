import { MessageTypeEnum } from '@/app/domain/def/v'
import { ValidationEnum, vr } from '@/app/domain/def/v-builder'

export const rules = vr.schema({
  password: [
    { rule: ValidationEnum.Password, message: 'Password is too weak', type: MessageTypeEnum.Warning },
    { rule: ValidationEnum.Required, message: 'Password is required' }
  ],
  email: [ValidationEnum.Required, { rule: ValidationEnum.Email, message: 'Email must be valid' }],
  name: [ValidationEnum.Required],
  age: [ValidationEnum.Required],
  date: [ValidationEnum.Required],
  'info.description': [{ rule: ValidationEnum.Required, message: 'Description is required' /* , type: MessageTypeEnum.Success */ }]
})
