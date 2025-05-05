import { type THashMap } from 'cubes'
import { TValidationResult, MessageTypeEnum, TRuleObject, TRuleSchema, TRulesItem, TSchema, ValidationRuleEnum, type TRule } from './meta/types'

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
  setRule(key: string, message: THashMap<string>, fn: TRule) {
    if (this.rules.hasOwnProperty(key) && this.rules[key]?.state == ValidationRuleEnum.General) {
      throw new Error('Custom rules are not allowed to override general rules.')
    }
    const rule = (value: any, parent: any, index?: number): TValidationResult => {
      const valid = fn(value, parent, index)
      return {
        valid,
        message
      }
    }
    this.rules[key] = { rule, state: ValidationRuleEnum.Custom }
  }
  setGeneralRule(key: string, message: THashMap<string>, fn: TRule) {
    const rule = (value: any, parent: any, index?: number): TValidationResult => {
      const valid = fn(value, parent, index)
      return {
        valid,
        message
      }
    }
    this.rules[key] = { rule, state: ValidationRuleEnum.General }
  }

  schema(schema: THashMap<TSchema>) {
    const ruleSchema: TRuleSchema = {}
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
  private _rule(ruleName: string, message?: THashMap<string>, type = MessageTypeEnum.Error): TRuleObject {
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
