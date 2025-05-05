import { ValidationRule } from '@/app/domain/def/v'
import { ValidationEnum } from '@/app/domain/def/v-builder'
import { MessageTypeEnum } from '@/app/domain/def/v/meta/types'
const vr = new ValidationRule()
// check validation error messages translatable
enum ValidationFormNameEnum {
  RequiredDate = 'RequiredDate'
}
vr.setRule(ValidationFormNameEnum.RequiredDate, { en: 'Date is Required', ar: 'التاريخ مطلوب' }, value => {
  return value instanceof Date
})
export const rules = vr.schema({
  password: [
    { rule: ValidationEnum.Password, message: { en: 'Password is too weak', ar: ' كلمة السر ضعيفة' }, type: MessageTypeEnum.Warning },
    { rule: ValidationEnum.Required, message: { en: 'Password is required', ar: ' كلمة السر مطلوب' } }
  ],
  email: [ValidationEnum.Required, { rule: ValidationEnum.Email, message: { en: 'Email must be valid', ar: ' الايميل غير صحيح' } }],
  name: [ValidationEnum.Required],
  age: [ValidationEnum.Required],
  date: [ValidationEnum.Required],
  'info.description': [{ rule: ValidationEnum.Required, message: { en: 'Description is required', ar: 'التقرير مطلوب' } /* , type: MessageTypeEnum.Success */ }]
})
