import { reactive } from 'vue'
import { Fields, ListFields } from '../f'
import { RuleSchema } from '../v'

export const useValidation = (rules: RuleSchema) => {
  return reactive(new Fields(rules))
}
export const useValidationArray = (rules: RuleSchema) => {
  return reactive(new ListFields(rules))
}
