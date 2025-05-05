import { THashMap } from 'cubes'
import { MessageTypeEnum, StateEnum, TFieldValidationState, TRuleSchema } from '../../v/meta/types'

interface IFieldsBase {
  schema: TRuleSchema
  fieldFallBack: TFieldValidationState
  _getDeepValue(data: any, key: string): any
}
interface IFields {
  statuses: Record<
    string,
    {
      hasError: boolean
      hasSuccess: boolean
      hasWarning: boolean
    }
  >
  validate(data: THashMap<any>, multipleMessage?: boolean): Promise<boolean>
  track(key: string, data: THashMap<any>, multipleMessage?: boolean): Promise<boolean>
  validationMessages(field: string): string[]
  message(field: string, type?: MessageTypeEnum): { text: string; type: MessageTypeEnum }[]
  state(field: string): StateEnum
  reset(field: string): void
}

interface IListFields {
  statuses: THashMap<{
    hasError: boolean
    hasSuccess: boolean
    hasWarning: boolean
  }>[]
  validate(data: THashMap<any>[], multipleMessage?: boolean): Promise<boolean>
  track(key: string, index: number, data: THashMap<any>, multipleMessage?: boolean): Promise<boolean>
  validationMessages(field: string, index: number): string[]
  message(field: string, index: number, type?: MessageTypeEnum): { text: string; type: MessageTypeEnum }[]
  state(field: string, index: number): StateEnum
  reset(field: string, index: number): void
}

export type { IFields, IListFields, IFieldsBase }
