import { IoC, THashMap } from 'cubes'
import { TFieldValidationState, MessageTypeEnum, TRuleSchema, StateEnum, TValidationResult } from '../v/meta/types'
import { IFields, IFieldsBase, IListFields } from './meta/types'
import { IAppService } from 'cubes-ui'
import { serviceMap } from '@/service'

// validate tree data structure
// handel errors

class FieldsBase implements IFieldsBase {
  fieldFallBack: TFieldValidationState
  schema: TRuleSchema
  constructor(schema: TRuleSchema) {
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
class Fields extends FieldsBase implements IFields {
  private states: THashMap<TFieldValidationState> = {}
  public statuses: { [key: string]: { hasError: boolean; hasSuccess: boolean; hasWarning: boolean } } = {}

  constructor(schema: TRuleSchema) {
    super(schema)
  }

  _setStatus(key: string, messageType: MessageTypeEnum) {
    if (messageType == MessageTypeEnum.Error) this.statuses[key].hasError = true
    if (messageType == MessageTypeEnum.Success) this.statuses[key].hasSuccess = true
    if (messageType == MessageTypeEnum.Warning) this.statuses[key].hasWarning = true
  }
  validate(data: THashMap<any>, multipleMessage?: boolean): Promise<boolean> {
    return new Promise((res, rej) => {
      try {
        let isValid = true
        for (const key in this.schema) {
          const fieldState: TFieldValidationState = {
            state: StateEnum.valid,
            valid: true,
            messages: []
          }
          const currentValue = this._getDeepValue(data, key)
          const rules = this.schema[key].sort((a, b) => a.type - b.type)
          this.statuses[key] = { hasError: false, hasSuccess: false, hasWarning: false }
          for (let idx = 0; idx < rules.length; idx++) {
            const vr = rules[idx]
            const result: TValidationResult = vr.rule(currentValue, data)
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

        res(isValid)
      } catch (error) {
        rej(error)
      }
    })
  }

  track(key: string, data: THashMap<any>, multipleMessage?: boolean): Promise<boolean> {
    return new Promise((res, rej) => {
      try {
        const fieldState: TFieldValidationState = {
          state: StateEnum.valid,
          valid: true,
          messages: []
        }

        const rules = this.schema[key].sort((a, b) => a.type - b.type)
        this.statuses[key] = { hasError: false, hasSuccess: false, hasWarning: false }
        for (let idx = 0; idx < rules.length; idx++) {
          const vr = rules[idx]
          const result: TValidationResult = vr.rule(this._getDeepValue(data, key), data)
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
        res(fieldState.valid)
      } catch (error) {
        rej(error)
      }
    })
  }
  validationMessages(field: string) {
    const appService = IoC.DI().resolve<IAppService>(serviceMap.AppService.key)
    const lang = appService.application.state.ui.culture.lang || 'en'
    if (this.states[field]?.state == StateEnum.invalid) {
      return this.states[field] ? this.states[field]?.messages.filter(m => m.type == MessageTypeEnum.Error).map(m => m.text[lang]) : []
    } else if (this.states[field]?.state == StateEnum.valid) {
      return this.states[field] ? this.states[field]?.messages.filter(m => m.type == MessageTypeEnum.Success).map(m => m.text[lang]) || '' : []
    }
    return []
  }
  message(field: string, type?: MessageTypeEnum) {
    const appService = IoC.DI().resolve<IAppService>(serviceMap.AppService.key)
    const lang = appService.application.state.ui.culture.lang || 'en'
    return this.states[field]
      ? type
        ? this.states[field]?.messages.filter(m => m.type == type).map(m => ({ ...m, text: m.text[lang] }))
        : this.states[field]?.messages.map(m => ({ ...m, text: m.text[lang] })) || ''
      : []
  }
  state(field: string) {
    return this.states[field] ? this.states[field]?.state || this.fieldFallBack.state : this.fieldFallBack.state
  }
  reset(field: string): void {
    this.states[field] = this.fieldFallBack
  }
}

class ListFields extends FieldsBase implements IListFields {
  private states: THashMap<TFieldValidationState>[] = []
  public statuses: { [key: string]: { hasError: boolean; hasSuccess: boolean; hasWarning: boolean } }[] = []

  constructor(schema: TRuleSchema) {
    super(schema)
  }

  _setStatus(key: string, index: number, messageType: MessageTypeEnum) {
    if (messageType == MessageTypeEnum.Error) this.statuses[index][key].hasError = true
    if (messageType == MessageTypeEnum.Success) this.statuses[index][key].hasSuccess = true
    if (messageType == MessageTypeEnum.Warning) this.statuses[index][key].hasWarning = true
  }

  validate(data: THashMap<any>[], multipleMessage?: boolean): Promise<boolean> {
    return new Promise((res, rej) => {
      try {
        let isValidArray = true
        data.forEach((obj, index) => {
          const states: THashMap<TFieldValidationState> = {}
          this.statuses[index] = {}

          for (const key in this.schema) {
            this.statuses[index][key] = { hasError: false, hasSuccess: false, hasWarning: false }
            const fieldState: TFieldValidationState = {
              state: StateEnum.valid,
              valid: true,
              messages: []
            }
            const rules = this.schema[key].sort((a, b) => a.type - b.type)

            for (let idx = 0; idx < rules.length; idx++) {
              const vr = rules[idx]
              const result: TValidationResult = vr.rule(this._getDeepValue(obj, key), obj, index)
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

        res(isValidArray)
      } catch (error) {
        rej(error)
      }
    })
  }

  track(key: string, index: number, data: THashMap<any>, multipleMessage?: boolean): Promise<boolean> {
    return new Promise((res, rej) => {
      try {
        const fieldState: TFieldValidationState = {
          state: StateEnum.valid,
          valid: true,
          messages: []
        }
        const rules = this.schema[key].sort((a, b) => a.type - b.type)
        this.statuses[index] = { [key]: { hasError: false, hasSuccess: false, hasWarning: false } }
        for (let idx = 0; idx < rules.length; idx++) {
          const vr = rules[idx]
          const result: TValidationResult = vr.rule(this._getDeepValue(data[index], key), data)
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
        if (!this.states[index]?.[key]) this.states[index] = {}
        this.states[index][key] = fieldState
        res(fieldState.valid)
      } catch (error) {
        rej(error)
      }
    })
  }
  validationMessages(field: string, index: number) {
    const appService = IoC.DI().resolve<IAppService>(serviceMap.AppService.key)
    const lang = appService.application.state.ui.culture.lang || 'en'
    if (this.states[index]?.[field]?.state == StateEnum.invalid) {
      return this.states[index]?.[field] ? this.states[index][field]?.messages.filter(m => m.type == MessageTypeEnum.Error).map(m => m.text?.[lang]) : []
    } else if (this.states[index]?.[field]?.state == StateEnum.valid) {
      return this.states[index]?.[field] ? this.states[index][field]?.messages.filter(m => m.type == MessageTypeEnum.Success).map(m => m.text?.[lang]) : []
    }
    return []
  }
  message(
    field: string,
    index: number,
    type?: MessageTypeEnum
  ): {
    text: string
    type: MessageTypeEnum
  }[] {
    const appService = IoC.DI().resolve<IAppService>(serviceMap.AppService.key)
    const lang = appService.application.state.ui.culture.lang || 'en'
    return this.states[index]?.[field]
      ? type
        ? this.states[index][field]?.messages.filter(m => m.type == type).map(m => ({ ...m, text: m.text?.[lang] }))
        : this.states[index][field]?.messages.map(m => ({ ...m, text: m.text?.[lang] })) || ''
      : []
  }

  state(field: string, index: number) {
    return this.states[index]?.[field]?.state || this.fieldFallBack.state
  }

  reset(field: string, index: number): void {
    if (!this.states[index]?.[field]) return
    this.states[index][field] = this.fieldFallBack
  }
}

export { Fields, ListFields }
