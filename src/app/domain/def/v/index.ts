import { TOptional, type THashMap } from 'cubes'
import { IValidationResult, TMethod, TRulesItem, ValidationRuleEnum, type TRule } from './meta/types'

export enum MessageTypeEnum {
  Error = 1,
  Warning,
  Success
}
type RuleObject = {
  rule: TMethod
  message: TOptional<string>
  type: MessageTypeEnum
}
export type SchemaRule = Partial<
  | {
      rule: string
      message: string
      type: MessageTypeEnum
    }
  | string
>
export type RuleSchema = { [key: string]: RuleObject[] }
type TSchema = SchemaRule[]
// setRuleAsync a function that debounce changes params function and delay
// change the rules from object to array
class ValidationRule {
  private rules: THashMap<TRulesItem> = {}
  private static v: ValidationRule
  constructor() {
    if (ValidationRule.v) {
      ValidationRule.v._clearCustomRules(ValidationRule.v.rules)
      return ValidationRule.v
    }
    ValidationRule.v = this
  }
  setRule(key: string, message: string, fn: TRule) {
    const rule = (value: any, parent: any, validator: Object, index?: number): IValidationResult => {
      const valid = fn(value, parent, validator, index)
      return {
        valid,
        message: valid ? '' : message
      }
    }
    this.rules[key] = { rule, state: ValidationRuleEnum.Custom }
  }
  setGeneralRule(key: string, message: string, fn: TRule) {
    const rule = (value: any, parent: any, validator: Object, index?: number): IValidationResult => {
      const valid = fn(value, parent, validator, index)
      return {
        valid,
        message: valid ? '' : message
      }
    }
    this.rules[key] = { rule, state: ValidationRuleEnum.General }
  }

  schema(schema: THashMap<TSchema>) {
    const ruleSchema: RuleSchema = {}
    for (const key in schema) {
      ruleSchema[key] = []
      for (const config of schema[key]) {
        if (typeof config == 'object') {
          ruleSchema[key].push(this._rule(config?.rule!, config.message, config.type))
        }
        if (typeof config == 'string') {
          ruleSchema[key].push(this._rule(config))
        }
      }
    }
    return ruleSchema
  }
  private _rule(ruleName: string, message?: string, type = MessageTypeEnum.Error): RuleObject {
    return { rule: this.rules[ruleName]['rule'], message, type }
  }
  private _clearCustomRules(rules: any) {
    for (const key in rules) {
      if (this.rules[key]['state'] == ValidationRuleEnum.Custom) {
        delete this.rules[key]
      }
    }
  }
}

export { ValidationRule }
