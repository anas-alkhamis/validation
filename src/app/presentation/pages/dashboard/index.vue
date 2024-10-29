<template>
  <v-card>
    <form @submit.prevent="validateAsync">
      <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" @keydown="states['name']= ValidationStateEnum.unset"
      :state="states['name']" :validation-messages="errorMessages.name" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age" label="age" placeholder="Enter age"
      type="number" @keydown="states['age'] = ValidationStateEnum.unset" :state="states['age']" :validation-messages="errorMessages.age" />

      <v-input
        v-model="controllerDC.model.password"
        maxlength="50"
        label="password"
        placeholder="Enter password"
        type="password"
        @keydown="states['password'] = ValidationStateEnum.unset"
        :state="states['password']"
        :validation-messages="errorMessages.password"
      />
      <v-input
        v-model="controllerDC.model.email"
        maxlength="50"
        label="email"
        placeholder="Enter email"
        type="email"
        @keydown="states['email'] = ValidationStateEnum.unset"
        :state="states['email']"
        :validation-messages="errorMessages.email"
      />
      <v-datepicker
        v-model="controllerDC.model.date"
        :placeholder="'pick'"
        label="Single Date"
        format="P"
        :valid="states['date']"
        required
        :feedback="errorMessages.date[0]"
        @update:model-value="states['date'] = ValidationStateEnum.unset"
      />

      <app-select-picker
        v-model="controllerDC.model.entity"
        :tag-props="{ placeholder: 'entity', label: 'labelasdsadsa', required: true }"
        :list-props="{ fetchOptions: getCompetencyGroupAsync, searchProps: { placeholder: 'searchPlaceholder' } }"
        :key-mapper="{ uniqueId: 'id', searchableKey: 'name.en' }"
        no-label
      >
        <template #no-data>
          <slot name="no-data">
            <div class="m-3"><v-icon :name="['fa', 'info-circle']" class="mr-2 text-muted" fixed-width />{{ 'tGlobal.common.labels.noData' }}</div>
          </slot>
        </template>
      </app-select-picker>
      <v-enum
        v-model="checkboxGroup"
        :enum="{ SizeEnum }"
        :translation="SizeEnum"
        :is="EnumControlTypeEnum.select"
        inline
        :config-items="{ [SizeEnum.xsmall]: { disabled: true, rank: 1, selected: true }, [SizeEnum.xlarge]: { disabled: true, rank: 1, selected: true } }"
      />
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
import { Test } from '@/app/domain/def/competency-matrices/test'
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { IoC, isDate, THashMap } from 'cubes'
import { DataController, IAppContext, ValidationStateEnum } from 'cubes-ui'
import { computed, reactive, ref } from 'vue'


enum SizeEnum {
  default = '',
  xsmall = 'xs',
  small = 'sm',
  large = 'lg',
  xlarge = 'xlg'
}
enum EnumControlTypeEnum {
  radio = 'radio',
  checkbox = 'checkbox',
  select = 'select'
}
const checkboxGroup = ref()
const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  competencyGroup = (appContext!.services as THashMap)[serviceMap.CompetencyGroupService.key]
const controllerDC = new DataController(Test)
const states = reactive<{ name?: ValidationStateEnum; age?: ValidationStateEnum; password?: ValidationStateEnum; email?: ValidationStateEnum; date?: ValidationStateEnum; entity?: Object }>({})

const errorMessages = computed(() => ({
  name: states['name'] == ValidationStateEnum.invalid ? ['error name'] : [],
  age: states['age'] == ValidationStateEnum.invalid ? ['error age'] : [],
  password: states['password'] == ValidationStateEnum.invalid ? ['error password'] : [],
  email: states['email'] == ValidationStateEnum.invalid ? ['error email'] : [],
  date: states['date'] == ValidationStateEnum.invalid ? ['error date'] : []
}))
const validateTranslatable = (value: THashMap<string>, multiLanguage?: boolean): boolean => {
  switch (multiLanguage) {
    case true:
      return !!value.en && !!value.en.trim().length && !!value.ar && !!value.ar.trim().length
    default:
      return (!!value.en && !!value.en.trim().length) || (!!value.ar && !!value.ar.trim().length)
  }
}
const validateAsync = (): Promise<boolean> => {
  return new Promise(async (res, _rej) => {
    let validity = true

    const valid = ValidationStateEnum.valid
    const invalid = ValidationStateEnum.invalid

    const name = validateTranslatable(controllerDC.model.name, true)
    states['name'] = name ? valid : invalid
    validity = validity && name
    const age = controllerDC.model.age >= 18
    states['age'] = age ? valid : invalid
    validity = validity && age
    const password = controllerDC.model.password.length >= 8
    states['password'] = password ? valid : invalid
    validity = validity && password
    const email = controllerDC.model.email.includes('@')
    states['email'] = email ? valid : invalid
    validity = validity && email
    const date = isDate(controllerDC.model.date)

    states['date'] = date ? valid : invalid
    validity = validity && date
    res(validity)
  })
}
const getCompetencyGroupAsync = (f = {} as any) =>
  new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.listAsync({ limit: 10, offset: 0, ...f })

      res(result)
    } catch (e) {
      rej(e)
    }
  })
// defineExpose({ validateAsync })
</script>
