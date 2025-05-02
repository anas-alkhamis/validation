import { type THashMap } from 'cubes'
import { IValidationResult, TMethod, TRules, TRulesItem, ValidationRuleEnum, type TRule } from './meta/types'

export type SchemaRule = Partial<
  | {
      rule: string
      message: string
    }
  | string
>
export type RuleSchema = { [key: string]: { rule: TMethod; message?: string }[] }
type TSchema = SchemaRule[]
class ValidationRule {
  private rules: THashMap<TRulesItem> = {}
  private static readonly v = new ValidationRule()
  constructor() {
    if (ValidationRule.v) {
      ValidationRule.v._clearCustomRules(ValidationRule.v.rules)
    }
    return ValidationRule.v
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
          ruleSchema[key].push(this._rule(config?.rule!, config.message))
        }
        if (typeof config == 'string') {
          ruleSchema[key].push(this._rule(config))
        }
      }
    }
    return ruleSchema
  }
  _rule(ruleName: string, message?: string): any {
    return { rule: this.rules[ruleName]['rule'], message }
  }

  _clearCustomRules(rules: any) {
    for (const key in rules) {
      if (this.rules[key]['state'] == ValidationRuleEnum.Custom) {
        delete this.rules[key]
      }
    }
  }
}

export { ValidationRule }
