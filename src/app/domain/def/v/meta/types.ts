import { THashMap, TOptional } from 'cubes'

enum StateEnum {
  unset = '',
  valid = 'valid',
  invalid = 'invalid'
}
enum ValidationStateEnum {
  None,
  Success,
  Error,
  WarningW
}
export enum MessageTypeEnum {
  Error = 1,
  Warning,
  Success
}

enum ValidationRuleEnum {
  General,
  Custom
}

interface TValidationResult {
  valid: boolean
  message: THashMap<string>
}
type TMethod = (value: any, parent: Record<string, any>, index?: number) => TValidationResult
type TRules = TMethod[]
type TRulesItem = { rule: TMethod; state: ValidationRuleEnum }
type TRule = (value: any, parent: Record<string, any>, index?: number) => boolean

type TFieldValidationState = {
  state: StateEnum
  valid: boolean
  messages: { text: THashMap<string>; type: MessageTypeEnum }[]
}

type TSchemaItem = {
  rules: THashMap<TRules>
  messages: THashMap<string[]>
}

type TRuleObject = {
  rule: TMethod
  message: TOptional<THashMap<string>>
  type: MessageTypeEnum
}

type TSchemaRule = Partial<
  | {
      rule: string
      message: THashMap<string>
      type: MessageTypeEnum
    }
  | string
>

type TRuleSchema = { [key: string]: TRuleObject[] }

type TSchema = TSchemaRule[]

export type { TValidationResult, TRule, TSchema, TFieldValidationState, TMethod, TRulesItem, TRuleObject, TRuleSchema, TSchemaItem }
export { StateEnum, ValidationRuleEnum, ValidationStateEnum }
