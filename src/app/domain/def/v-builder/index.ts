import { isArray, isObj, isStr } from 'cubes'
import { ValidationRule } from '../v'

enum ValidationEnum {
  Required = 'required',
  Password = 'password',
  Email = 'email',
  GG = 'GG'
}

const vr = new ValidationRule()

vr.setGeneralRule(ValidationEnum.Required, 'Field is Required', (value, parent, validator, index) => {
  if (value instanceof Date) return true
  if (isArray(value) && !value?.length) return false
  else if (isObj(value) && !value.en && !value.ar) return false
  return !!value
})
vr.setGeneralRule(ValidationEnum.Password, 'Password Invalid', (value, parent) => {
  return isStr(value) && value?.length > 8
})
vr.setGeneralRule(ValidationEnum.Email, 'Email Invalid', (value, parent) => {
  return value?.includes('@')
})

export { vr, ValidationEnum }
