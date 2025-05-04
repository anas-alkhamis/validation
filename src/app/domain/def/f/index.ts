import { THashMap } from 'cubes'
import { IFieldValidationState, StateEnum } from '../v/meta/types'
import { IValidationResult } from '../v/meta/types'
import { MessageTypeEnum, RuleSchema } from '../v'

// validate tree data structure
// handel errors

class FieldsBase {
  protected fieldFallBack: IFieldValidationState
  protected schema: RuleSchema
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
}
class Fields extends FieldsBase {
  private states: THashMap<IFieldValidationState> = {}
  public statuses: { [key: string]: { hasError: boolean; hasSuccess: boolean; hasWarning: boolean } } = {}

  constructor(schema: RuleSchema) {
    super(schema)
  }

  _setStatus(key: string, messageType: MessageTypeEnum) {
    if (messageType == MessageTypeEnum.Error) this.statuses[key].hasError = true
    if (messageType == MessageTypeEnum.Success) this.statuses[key].hasSuccess = true
    if (messageType == MessageTypeEnum.Warning) this.statuses[key].hasWarning = true
  }
  validate(data: THashMap<any>, multipleMessage?: boolean): boolean {
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
        const message = vr.message || result.message
        if (!result.valid && vr.type == MessageTypeEnum.Error) {
          isValid = false
          fieldState.valid = false
          fieldState.state = StateEnum.invalid
          fieldState.messages.push({ text: message, type: vr.type })
          this._setStatus(key, vr.type)
        }
        if (vr.type == MessageTypeEnum.Warning && !result.valid) {
          fieldState.messages.push({ text: message, type: vr.type })
          this._setStatus(key, vr.type)
        }
        if (vr.type == MessageTypeEnum.Success && result.valid) {
          fieldState.messages.push({ text: message, type: vr.type })
          this._setStatus(key, vr.type)
        }
        if (!multipleMessage && fieldState.messages.length) {
          break
        }
      }
      this.states[key] = fieldState
    }

    return isValid
  }

  track(key: string, data: THashMap<any>, multipleMessage?: boolean): boolean {
    const fieldState: IFieldValidationState = {
      state: StateEnum.valid,
      valid: true,
      messages: []
    }

    const rules = this.schema[key].sort((a, b) => a.type - b.type)
    this.statuses[key] = { hasError: false, hasSuccess: false, hasWarning: false }
    for (let idx = 0; idx < rules.length; idx++) {
      const vr = rules[idx]
      const result: IValidationResult = vr.rule(this._getDeepValue(data, key), data, this)
      const message = vr.message || result.message
      if (!result.valid && vr.type == MessageTypeEnum.Error) {
        fieldState.valid = false
        fieldState.state = StateEnum.invalid
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, vr.type)
      }

      if (vr.type == MessageTypeEnum.Warning && !result.valid) {
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, vr.type)
      }
      if (vr.type == MessageTypeEnum.Success && result.valid) {
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, vr.type)
      }
      if (!multipleMessage && fieldState.messages.length) {
        break
      }
    }

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
  public statuses: { [key: string]: { hasError: boolean; hasSuccess: boolean; hasWarning: boolean } }[] = []

  constructor(schema: RuleSchema) {
    super(schema)
  }

  _setStatus(key: string, index: number, messageType: MessageTypeEnum) {
    if (messageType == MessageTypeEnum.Error) this.statuses[index][key].hasError = true
    if (messageType == MessageTypeEnum.Success) this.statuses[index][key].hasSuccess = true
    if (messageType == MessageTypeEnum.Warning) this.statuses[index][key].hasWarning = true
  }

  validateFields(data: THashMap<any>[], multipleMessage?: boolean): boolean {
    let isValidArray = true
    data.forEach((obj, index) => {
      const states: THashMap<IFieldValidationState> = {}
      this.statuses[index] = {}

      for (const key in this.schema) {
        this.statuses[index][key] = { hasError: false, hasSuccess: false, hasWarning: false }
        const fieldState: IFieldValidationState = {
          state: StateEnum.valid,
          valid: true,
          messages: []
        }
        const result: IValidationResult = this._getDeepValue(obj, key)
        const rules = this.schema[key].sort((a, b) => a.type - b.type)

        for (let idx = 0; idx < rules.length; idx++) {
          const vr = rules[idx]
          const message = vr.message || result.message
          if (!result.valid && vr.type == MessageTypeEnum.Error) {
            fieldState.valid = false
            fieldState.state = StateEnum.invalid
            fieldState.messages.push({ text: message, type: vr.type })
            this._setStatus(key, index, vr.type)
          }

          if (vr.type == MessageTypeEnum.Warning && !result.valid) {
            fieldState.messages.push({ text: message, type: vr.type })
            this._setStatus(key, index, vr.type)
          }
          if (vr.type == MessageTypeEnum.Success && result.valid) {
            fieldState.messages.push({ text: message, type: vr.type })
            this._setStatus(key, index, vr.type)
          }
          if (!multipleMessage && fieldState.messages.length) {
            break
          }
        }
        states[key] = fieldState
      }
      this.states[index] = states
    })

    return isValidArray
  }

  track(key: string, index: number, data: THashMap<any>, multipleMessage?: boolean): boolean {
    const fieldState: IFieldValidationState = {
      state: StateEnum.valid,
      valid: true,
      messages: []
    }

    const rules = this.schema[key].sort((a, b) => a.type - b.type)

    for (let idx = 0; idx < rules.length; idx++) {
      const vr = rules[idx]
      const result: IValidationResult = vr.rule(this._getDeepValue(data[index], key), data, this)
      const message = vr.message || result.message
      if (!result.valid && vr.type == MessageTypeEnum.Error) {
        fieldState.valid = false
        fieldState.state = StateEnum.invalid
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, index, vr.type)
      }

      if (vr.type == MessageTypeEnum.Warning && !result.valid) {
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, index, vr.type)
      }
      if (vr.type == MessageTypeEnum.Success && result.valid) {
        fieldState.messages.push({ text: message, type: vr.type })
        this._setStatus(key, index, vr.type)
      }
      if (!multipleMessage && fieldState.messages.length) {
        break
      }
    }
    this.states[index][key] = fieldState

    return fieldState.valid
  }
  validationMessages(field: string, index: number) {
    if (this.states[index]?.[field]?.state == StateEnum.invalid) {
      return this.states[index]?.[field] ? this.states[index][field]?.messages.filter(m => m.type == MessageTypeEnum.Error).map(m => m.text) || '' : this.fieldFallBack.messages
    } else if (this.states[index]?.[field]?.state == StateEnum.valid) {
      return this.states[index]?.[field] ? this.states[index][field]?.messages.filter(m => m.type == MessageTypeEnum.Success).map(m => m.text) || '' : this.fieldFallBack.messages
    }
    return this.fieldFallBack.messages
  }
  message(field: string, index: number, type?: MessageTypeEnum) {
    return this.states[index]?.[field] ? (type ? this.states[index][field]?.messages.filter(m => m.type == type) : this.states[index][field]?.messages || '') : this.fieldFallBack.messages
  }

  state(field: string, index: number) {
    return this.states.length && this.states[index]?.[field] ? this.states[index][field]?.state || StateEnum.unset : this.fieldFallBack.state
  }

  reset(field: string, index: number): void {
    if (!this.states[index]?.[field]) return
    this.states[index][field] = this.fieldFallBack
  }
}

export { Fields, ListFields }
