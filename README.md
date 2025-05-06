# Validation

## Main Points

- setup the general rules
- create schema & setup custom rules
- use validation hooks

## General Rules

general rules are function shared across system this rules can be override with new general rule with same name.

```ts
import { isArray, isObj, isStr } from 'cubes'
import { ValidationRule } from '../v'

enum ValidationEnum {
  Required = 'required',
  Password = 'password',
  Email = 'email'
}
// ValidationRule is a singleton class the  new instantiate will return the first instance created or create first one
const vr = new ValidationRule() // create new instance from ValidationRule
// parameters (ruleName, ruleMessage(translatable),callback function)
vr.setGeneralRule(ValidationEnum.Required, { en: 'Field is Required', ar: 'هذا الحقل مطلوب' }, (value, parent, index) => {
  // callback function accept 3 parameter (the value related to the schema, the hole data passed to the validate function, index is optional will be exist if we use validationArray hook)
  // function return boolean
  return !!value
})
vr.setGeneralRule(ValidationEnum.Password, { en: 'Password Invalid', ar: 'كلمة السر غير صحيحه' }, (value, parent) => {
  return isStr(value) && value?.length > 8
})
vr.setGeneralRule(ValidationEnum.Email, { en: 'Email Invalid', ar: ' الايميل غير صحيح' }, (value, parent) => {
  return value?.includes('@')
})
// export the ValidationEnum to be used when creating new schema
export { ValidationEnum }
```

## Schema & Custom Rules

custom rules are specific functions to validate spacial cases it can override general rule.
schema is the configuration object to define the rules and customize messages and there types.

```ts
import { ValidationRule } from '@/app/domain/def/v'
import { ValidationEnum } from '@/app/domain/def/v-builder'
import { MessageTypeEnum } from '@/app/domain/def/v/meta/types'
const vr = new ValidationRule()
enum ValidationFormNameEnum {
  RequiredDate = 'RequiredDate'
}
vr.setRule(ValidationFormNameEnum.RequiredDate, { en: 'Date is Required', ar: 'التاريخ مطلوب' }, value => {
  return value instanceof Date
})
export const rules = vr.schema({
  password: [
    { rule: ValidationEnum.Password, message: { en: 'Password is too weak', ar: ' كلمة السر ضعيفة' }, type: MessageTypeEnum.Warning },
    { rule: ValidationEnum.Required, message: { en: 'Password is required', ar: ' كلمة السر مطلوب' } }
  ],
  email: [ValidationEnum.Required, { rule: ValidationEnum.Email, message: { en: 'Email must be valid', ar: ' الايميل غير صحيح' } }],
  name: [ValidationEnum.Required],
  age: [ValidationEnum.Required],
  date: [ValidationEnum.Required],
  'info.description': [{ rule: ValidationEnum.Required, message: { en: 'Description is required', ar: 'التقرير مطلوب' } }]
})
```

## Validation Hooks & Usage

use a validation hook to define validation functionality by calling a hook and passing the rules to it.

**1. Example: useValidation hook**

```ts
<template>
  <v-card>
    <form @submit.prevent="validateAsync">
      <v-input-translatable
      v-auto-focus:['.form-control']
      maxlength="50"
      v-model="controllerDC.model.name"
      label="name"
      placeholder="Enter name"
      :state="v.state('name')"
      @keydown="v.reset('name')"
      :validation-messages="v.validationMessages('name')"
      />
      <v-input
      v-auto-focus:['.form-control']
      maxlength="50"
      v-model="controllerDC.model.age"
      label="age"
      placeholder="Enter age"
      type="number"
      :state="v.state('age')"
      :validation-messages="v.validationMessages('age')"
      @keydown="v.reset('age')"
      />
      <v-input
        v-model="controllerDC.model.password"
        maxlength="50"
        label="password"
        placeholder="Enter password"
        type="password"
        :state="v.state('password')"
        :validation-messages="v.validationMessages('password')"
        @keyup="v.track('password', controllerDC.model)"
      />
      <span v-if="v.statuses.password?.hasWarning" class="text-warning">
        {{ v.message('password', MessageTypeEnum.Warning).map(m => m.text) }}
      </span>
      <v-input
        v-model="controllerDC.model.email"
        maxlength="50"
        label="email"
        placeholder="Enter email"
        :state="v.state('email')"
        :validation-messages="v.validationMessages('email')"
        @keyup="v.track('email', controllerDC.model)"
      />
      <v-input
        v-model="controllerDC.model.info.description"
        maxlength="50"
        label="description"
        placeholder="Enter description"
        :state="v.state('info.description')"
        :validation-messages="v.validationMessages('info.description')"
        @keydown="v.reset('info.description')"
      />
      <v-datepicker
        v-model="controllerDC.model.date"
        :placeholder="'pick'"
        label="Single Date"
        format="P"
        :valid="v.state('date')"
        required
        :feedback="v.validationMessages('date')[0]"
        @update:model-value="v.reset('date')"
      />
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
import { Test } from '@/app/domain/def/competency-matrices/test'
import { DataController } from 'cubes-ui'
import { useValidation } from '@/app/domain/def/validation'
import { rules } from './schema'
import { MessageTypeEnum } from '@/app/domain/def/v/meta/types'

const controllerDC = new DataController(Test)
const v = useValidation(rules)
const validateAsync = async () => {
  const valid = await v.validate(controllerDC.model)
  console.log(valid)
}
</script>
```

**2. Example: useValidationArray hook**

```ts
<template>
  <v-card>
    <form @submit.prevent="validateArrayAsync">
      <div v-for="(field, index) in controllerListDC.model.data">
        <v-input-translatable
        v-auto-focus:['.form-control']
        maxlength="50"
        v-model="field.name"
        label="name"
        placeholder="Enter name"
        @keydown="vr.reset('name',index)"
        :state="vr.state('name',index,)"
        :validation-messages="vr.validationMessages('name',index)"
        />
        <v-input
        v-auto-focus:['.form-control']
        maxlength="50"
        v-model="field.age"
        label="age"
        placeholder="Enter age"
        type="number"
        @keydown="vr.reset('age',index)"
        :state="vr.state('age',index)"
        :validation-messages="vr.validationMessages('age',index)"
        />
        <v-input
          v-model="field.info.description"
          maxlength="50"
          label="description"
          placeholder="Enter description"
          :state="vr.state('info.description', index)"
          :validation-messages="vr.validationMessages('info.description', index)"
        />
        <v-input
          v-model="field.password"
          maxlength="50"
          label="password"
          placeholder="Enter password"
          type="password"
          :state="vr.state('password', index)"
          @keyup="vr.track('password', index, controllerListDC.model.data)"
          :validation-messages="vr.validationMessages('password', index)"
        />
        <span v-if="vr.statuses[index]?.password?.hasWarning" class="text-warning">
          {{ vr.message('password', index, MessageTypeEnum.Warning).map(m => m.text) }}
        </span>
        <v-input
          v-model="field.email"
          maxlength="50"
          label="email"
          placeholder="Enter email"
          @keydown="vr.reset('email', index)"
          :state="vr.state('email', index)"
          :validation-messages="vr.validationMessages('email', index)"
        />
        <v-datepicker
          v-model="field.date"
          :placeholder="'pick'"
          label="Single Date"
          format="P"
          :valid="vr.state('date', index)"
          required
          @update:model-value="vr.reset('date', index)"
          :feedback="vr.validationMessages('date', index)[0]"
        />
      </div>
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
import { ListTest } from '@/app/domain/def/competency-matrices/test'
import { DataController } from 'cubes-ui'
import { useValidationArray } from '@/app/domain/def/validation'
import { rules } from './schema'
import { MessageTypeEnum } from '@/app/domain/def/v/meta/types'
import { onMounted } from 'vue'

// array of form validation
const vr = useValidationArray(rules)
const arrayField = [
  {
    name: { en: 'test', ar: 'test' },
    age: '18',
    email: 'email',
    password: '',
    date: null,
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '12',
    email: 'email',
    password: 'password',
    date: null,
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '22',
    email: 'email',
    password: 'password',
    date: null,
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '8',
    email: 'email',
    password: 'password',
    date: null,
    info: {
      description: 'aa'
    }
  }
]
const controllerListDC = new DataController(ListTest)

const validateArrayAsync = async () => {
  const valid = await vr.validate(controllerListDC.model.data)
  console.log(valid)
}

onMounted(() => {
  controllerListDC.model = new ListTest({ data: arrayField })
  controllerListDC.commit()
})
</script>
```
