import { reactive } from 'vue'
import { Fields, ListFields } from '../f'
import { TRuleSchema } from '../v/meta/types'

export const useValidation = (rules: TRuleSchema) => {
  return reactive(new Fields(rules))
}
export const useValidationArray = (rules: TRuleSchema) => {
  return reactive(new ListFields(rules))
}
