import { THashMap } from 'cubes'

enum StateEnum {
  unset = '',
  valid = 'valid',
  invalid = 'invalid'
}

interface IValidationResult {
  valid: boolean
  message: string
}
enum ValidationRuleEnum {
  General,
  Custom
}
type TRule = (value: any, parent: Record<string, any>, validator: Object, index?: number) => boolean
type TMethod = (value: any, parent: Record<string, any>, validator: Object, index?: number) => IValidationResult
type TRules = TMethod[]
type TRulesItem = { rule: TMethod; state: ValidationRuleEnum }
type IFieldValidationState = {
  state: StateEnum
  valid: boolean
  messages: string[]
}

type ISchema = {
  rules: THashMap<TRules>
  messages?: THashMap<string[]>
}

export type { IValidationResult, TRule, TRules, ISchema, IFieldValidationState, TMethod,TRulesItem }
export { StateEnum ,ValidationRuleEnum}
