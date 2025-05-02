import { THashMap } from 'cubes'
import { IFieldValidationState, StateEnum } from '../v/meta/types'
import { IValidationResult } from '../v/meta/types'
import { hasValueChanged } from '../checker'
import { RuleSchema } from '../v'

// validate tree data structure
// create a function (hooks, or single class) to make easy access to the classes
class FieldsBase {
  protected fieldFallBack: IFieldValidationState
  protected schema: RuleSchema
  protected previousValue: any = {}
  constructor(schema: RuleSchema) {
    this.schema = schema
    this.fieldFallBack = {
      state: StateEnum.unset,
      valid: true,
      messages: []
    }
  }
  getDeepValue = (data: any, key: string) => {
    const keys = key.split('.')
    let currentValue = data
    for (const dataKey of keys) {
      currentValue = currentValue[dataKey]
    }
    return currentValue
  }
}
class Fields extends FieldsBase {
  private states: THashMap<IFieldValidationState> = {}
  constructor(schema: RuleSchema) {
    super(schema)
  }
  validate(data: THashMap<any>, multipleMessage?: boolean): boolean {
    let isValid = true
    for (const key in this.schema) {
      const fieldState: IFieldValidationState = {
        state: StateEnum.valid,
        valid: true,
        messages: []
      }
      const currentValue = this.getDeepValue(data, key)

      for (let idx = 0; idx < this.schema[key].length; idx++) {
        const vr = this.schema[key][idx]
        const result: IValidationResult = vr.rule(currentValue, data, this)
        if (!result.valid) {
          isValid = false
          fieldState.valid = false
          fieldState.state = StateEnum.invalid
          fieldState.messages.push(vr.message || result.message || '')
          if (!multipleMessage) {
            break
          }
        }
      }
      this.previousValue[key] = currentValue
      this.states[key] = fieldState
    }

    return isValid
  }

  track(key: string, data: THashMap<any>): boolean {
    const state: IFieldValidationState = {
      state: StateEnum.valid,
      valid: true,
      messages: []
    }
    const currentValue = this.getDeepValue(data, key)
    const isChanged = hasValueChanged(this.previousValue[key], currentValue)
    if (!isChanged) {
      this.previousValue[key] = currentValue
      return !!this.states[key]?.valid
    }
    this.schema[key].forEach(vr => {
      const result: IValidationResult = vr.rule(this.getDeepValue(data, key), data, this)
      if (!result.valid) {
        state.valid = false
        state.state = StateEnum.invalid
        state.messages.push(vr.message || result.message || '')
      }
    })
    this.previousValue[key] = currentValue
    this.states[key] = state

    return state.valid
  }
  error(field: string) {
    return this.states[field] ? this.states[field]?.messages || '' : this.fieldFallBack.messages
  }

  state(field: string) {
    return this.states[field] ? this.states[field]?.state || this.fieldFallBack.state : this.fieldFallBack.state
  }

  reset(field: string): void {
    this.states[field] = this.fieldFallBack
  }
}

class ListFields extends FieldsBase {
  private states: THashMap<IFieldValidationState>[] = []
  constructor(schema: RuleSchema) {
    super(schema)
  }

  validateFields(data: THashMap<any>[], multipleMessage?: boolean): boolean {
    let isValidArray = true
    data.forEach((obj, index) => {
      const states: THashMap<IFieldValidationState> = {}
      for (const key in this.schema) {
        const state: IFieldValidationState = {
          state: StateEnum.valid,
          valid: true,
          messages: []
        }
        const currentValue = this.getDeepValue(obj, key)
        const isChanged = this.previousValue.hasOwnProperty(key) ? hasValueChanged(this.previousValue[key], currentValue) : false
        if (!isChanged) {
          this.previousValue[key] = currentValue
          break
        }
        for (let idx = 0; idx < this.schema[key].length; idx++) {
          const vr = this.schema[key][idx]
          const result: IValidationResult = vr.rule(currentValue, data, this, index)
          if (!result.valid) {
            state.valid = false
            state.state = StateEnum.invalid
            state.messages.push(vr.message || result.message || '')
            if (isValidArray) {
              isValidArray = false
            }
            if (!multipleMessage) {
              break
            }
          }
        }
        this.previousValue[key] = currentValue
        states[key] = state
      }
      this.states[index] = states
    })

    return isValidArray
  }

  trackFiled(key: string, index: number, data: THashMap<any>): boolean {
    const state: IFieldValidationState = {
      state: StateEnum.valid,
      valid: true,
      messages: []
    }
    const currentValue = this.getDeepValue(data[index], key)
    const isChanged = hasValueChanged(this.previousValue[key], currentValue)
    if (!isChanged) {
      this.previousValue[key] = currentValue
      return this.states[index][key].valid
    }
    for (let idx = 0; idx < this.schema[key].length; idx++) {
      const vr = this.schema[key][idx]
      const result: IValidationResult = vr.rule(currentValue, data, this, index)
      if (!result.valid) {
        state.valid = false
        state.state = StateEnum.invalid
        state.messages.push(vr.message || result.message || '')
      }
    }
    this.previousValue[key] = currentValue
    this.states[index][key] = state

    return !!state.valid
  }

  errorFiled(index: number, field: string) {
    return this.states.length && this.states[index]?.[field] ? this.states[index][field]?.messages || this.fieldFallBack.messages : this.fieldFallBack.messages
  }

  stateField(index: number, field: string) {
    return this.states.length && this.states[index]?.[field] ? this.states[index][field]?.state || StateEnum.unset : this.fieldFallBack.state
  }

  resetField(index: number, field: string): void {
    if (!this.states[index]?.[field]) return
    this.states[index][field] = this.fieldFallBack
  }
}

export { Fields, ListFields }
