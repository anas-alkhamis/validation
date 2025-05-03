import { THashMap } from 'cubes'
import { IFieldValidationState, StateEnum } from '../v/meta/types'
import { IValidationResult } from '../v/meta/types'
import { hasValueChanged } from '../checker'
import { MessageTypeEnum, RuleSchema } from '../v'

// validate tree data structure
// handel errors

class FieldsBase {
  protected fieldFallBack: IFieldValidationState
  protected schema: RuleSchema
  public statuses: { [key: string]: { hasError: boolean; hasSuccess: boolean; hasWarning: boolean } } = {}
  protected previousValue: any = {}
  constructor(schema: RuleSchema) {
    this.schema = schema
    this.fieldFallBack = {
      state: StateEnum.unset,
      valid: true,
      messages: []
    }
  }
  _getDeepValue = (data: any, key: string) => {
    const keys = key.split('.')
    let currentValue = data
    for (const dataKey of keys) {
      currentValue = currentValue[dataKey]
    }
    return currentValue
  }

  _setStatus(key: string, messageType: MessageTypeEnum) {
    if (messageType == MessageTypeEnum.Error) this.statuses[key].hasError = true
    if (messageType == MessageTypeEnum.Success) this.statuses[key].hasSuccess = true
    if (messageType == MessageTypeEnum.Warning) this.statuses[key].hasWarning = true
  }
}
class Fields extends FieldsBase {
  private states: THashMap<IFieldValidationState> = {}
  constructor(schema: RuleSchema) {
    super(schema)
  }
  validate(data: THashMap<any>): boolean {
    let isValid = true
    for (const key in this.schema) {
      const fieldState: IFieldValidationState = {
        state: StateEnum.valid,
        valid: true,
        messages: []
      }
      const currentValue = this._getDeepValue(data, key)
      const rules = this.schema[key].sort((a, b) => a.type - b.type)
      this.statuses[key] = { hasError: false, hasSuccess: false, hasWarning: false }
      for (let idx = 0; idx < rules.length; idx++) {
        const vr = rules[idx]
        const result: IValidationResult = vr.rule(currentValue, data, this)
        if (!result.valid && vr.type == MessageTypeEnum.Error) {
          isValid = false
          fieldState.valid = false
          fieldState.state = StateEnum.invalid
        }

        if ((vr.message || result.message) && !result.valid) {
          fieldState.messages.push({ text: vr.message || result.message || '', type: vr.type })
          this._setStatus(key, vr.type)
        }
      }
      this.previousValue[key] = currentValue
      this.states[key] = fieldState
    }

    return isValid
  }

  track(key: string, data: THashMap<any>): boolean {
    const fieldState: IFieldValidationState = {
      state: StateEnum.valid,
      valid: true,
      messages: []
    }
    const currentValue = this._getDeepValue(data, key)
    const isChanged = hasValueChanged(this.previousValue[key], currentValue)
    if (!isChanged) {
      this.previousValue[key] = currentValue
      return !!this.states[key]?.valid
    }
    const rules = this.schema[key].sort((a, b) => a.type - b.type)
    this.statuses[key] = { hasError: false, hasSuccess: false, hasWarning: false }
    for (let idx = 0; idx < rules.length; idx++) {
      const vr = rules[idx]
      const result: IValidationResult = vr.rule(this._getDeepValue(data, key), data, this)
      if (!result.valid && vr.type == MessageTypeEnum.Error) {
        fieldState.valid = false
        fieldState.state = StateEnum.invalid
      }
      if ((vr.message || result.message) && !result.valid) {
        fieldState.messages.push({ text: vr.message || result.message || '', type: vr.type })
        this._setStatus(key, vr.type)
      }
    }
    console.log(this.statuses[key])

    this.previousValue[key] = currentValue
    this.states[key] = fieldState
    return fieldState.valid
  }
  validationMessages(field: string) {
    if (this.states[field]?.state == StateEnum.invalid) {
      return this.states[field] ? this.states[field]?.messages.filter(m => m.type == MessageTypeEnum.Error).map(m => m.text) || '' : this.fieldFallBack.messages
    } else if (this.states[field]?.state == StateEnum.valid) {
      return this.states[field] ? this.states[field]?.messages.filter(m => m.type == MessageTypeEnum.Success).map(m => m.text) || '' : this.fieldFallBack.messages
    }
    return this.fieldFallBack.messages
  }
  message(field: string, type?: MessageTypeEnum) {
    return this.states[field] ? (type ? this.states[field]?.messages.filter(m => m.type == type) : this.states[field]?.messages || '') : this.fieldFallBack.messages
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
        const currentValue = this._getDeepValue(obj, key)
        const isChanged = this.previousValue.hasOwnProperty(key) ? hasValueChanged(this.previousValue[key], currentValue) : false
        if (!isChanged) {
          this.previousValue[key] = currentValue
          break
        }
        const rules = this.schema[key].sort((a, b) => a.type - b.type)

        for (let idx = 0; idx < rules.length; idx++) {
          const vr = rules[idx]
          const result: IValidationResult = vr.rule(currentValue, data, this, index)
          if (!result.valid) {
            state.valid = false
            state.state = StateEnum.invalid
            state.messages.push({ text: vr.message || result.message || '', type: vr.type })
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
    const currentValue = this._getDeepValue(data[index], key)
    const isChanged = hasValueChanged(this.previousValue[key], currentValue)
    if (!isChanged) {
      this.previousValue[key] = currentValue
      return this.states[index][key].valid
    }
    const rules = this.schema[key].sort((a, b) => a.type - b.type)

    for (let idx = 0; idx < rules.length; idx++) {
      const vr = rules[idx]
      const result: IValidationResult = vr.rule(currentValue, data, this, index)
      if (!result.valid) {
        state.valid = false
        state.state = StateEnum.invalid
        state.messages.push({ text: vr.message || result.message || '', type: vr.type })
      }
    }
    this.previousValue[key] = currentValue
    this.states[index][key] = state

    return !!state.valid
  }

  messageFiled(index: number, field: string, type = MessageTypeEnum.Error) {
    return this.states.length && this.states[index]?.[field]
      ? this.states[index][field]?.messages.filter(m => m.type == type).map(m => m.text) || this.fieldFallBack.messages
      : this.fieldFallBack.messages
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
