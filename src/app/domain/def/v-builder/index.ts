import { isArray, isObj, isStr } from 'cubes'
import { ValidationRule } from '../v'

enum ValidationEnum {
  Required = 'required',
  Password = 'password',
  Email = 'email'
}

const vr = new ValidationRule()

vr.setGeneralRule(ValidationEnum.Required, { en: 'Field is Required', ar: 'هذا الحقل مطلوب' }, (value, parent, index) => {
  if (value instanceof Date) return true
  if (isArray(value) && !value?.length) return false
  else if (isObj(value) && !value.en && !value.ar) return false
  return !!value
})
vr.setGeneralRule(ValidationEnum.Password, { en: 'Password Invalid', ar: 'كلمة السر غير صحيحه' }, (value, parent) => {
  return isStr(value) && value?.length > 8
})
vr.setGeneralRule(ValidationEnum.Email, { en: 'Email Invalid', ar: ' الايميل غير صحيح' }, (value, parent) => {
  return value?.includes('@')
})

export { vr, ValidationEnum }
