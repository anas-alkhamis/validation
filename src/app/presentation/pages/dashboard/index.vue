<template>
  <v-card>
    <form @submit.prevent="validateAsync">
      <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" :state="v.state('name')" @keydown="v.reset('name')"
      :validation-messages="v.validationMessages('name')" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age" label="age" placeholder="Enter age" type="number"
      :state="v.state('age')" :validation-messages="v.validationMessages('age')" @keydown="v.reset('age')" />

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

    <form v-if="false" @submit.prevent="validateArrayAsync">
      <div v-for="(field, index) in arrayField">
        <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" @keydown="vf.reset('name',index)"
        :state="vf.state('name',index,)" :validation-messages="vf.validationMessages('name',index)" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age"
        label="age" placeholder="Enter age" type="number" @keydown="vf.reset('age',index)" :state="vf.state('age',index)" :validation-messages="vf.validationMessages('age',index)" />
        <v-input
          v-model="controllerDC.model.info.description"
          maxlength="50"
          label="description"
          placeholder="Enter description"
          :state="vf.state('info.description', index)"
          :validation-messages="vf.validationMessages('info.description', index)"
        />
        <v-input
          v-model="controllerDC.model.password"
          maxlength="50"
          label="password"
          placeholder="Enter password"
          type="password"
          @keydown="vf.reset('password', index)"
          :state="vf.state('password', index)"
          :validation-messages="vf.message('password', index)"
        />
        <v-input
          v-model="controllerDC.model.email"
          maxlength="50"
          label="email"
          placeholder="Enter email"
          @keydown="vf.reset('email', index)"
          :state="vf.state('email', index)"
          :validation-messages="vf.validationMessages('email', index)"
        />
        <v-datepicker
          v-model="controllerDC.model.date"
          :placeholder="'pick'"
          label="Single Date"
          format="P"
          :valid="vf.state('date', index)"
          required
          @update:model-value="vf.reset('date', index)"
          :feedback="vf.message('date', index)[0]"
        />
      </div>
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
import { Test } from '@/app/domain/def/competency-matrices/test'
import { DataController } from 'cubes-ui'
import { vr, ValidationEnum } from '@/app/domain/def/v-builder'
import { MessageTypeEnum } from '@/app/domain/def/v'
import { useValidation, useValidationArray } from '@/app/domain/def/validation'
////// create schema for validation

const rules = vr.schema({
  password: [
    { rule: ValidationEnum.Password, message: 'Password is too weak', type: MessageTypeEnum.Warning },
    { rule: ValidationEnum.Required, message: 'Password is required' }
  ],
  email: [ValidationEnum.Required, { rule: ValidationEnum.Email, message: 'Email must be valid' }],
  name: [ValidationEnum.Required],
  age: [ValidationEnum.Required],
  date: [ValidationEnum.Required],
  'info.description': [{ rule: ValidationEnum.Required, message: 'Description is required'/* , type: MessageTypeEnum.Success */ }]
})

const controllerDC = new DataController(Test)
const v = useValidation(rules)
const vf = useValidationArray(rules)
const arrayField = [
  {
    name: { en: 'test', ar: 'test' },
    age: '18',
    email: 'email',
    password: 'passwordA@2',
    date: '',
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '12',
    email: 'email',
    password: 'password',
    date: 'date',
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '22',
    email: 'email',
    password: 'password',
    date: 'date',
    info: {
      description: ''
    }
  },
  {
    name: 'name',
    age: '8',
    email: 'email',
    password: 'password',
    date: '',
    info: {
      description: 'aa'
    }
  }
]
const validateAsync = (): Promise<boolean> => {
  return new Promise(async (res, _rej) => {
    const valid = v.validate(controllerDC.model)
    console.log(valid)
  })
}
const validateArrayAsync = (): Promise<boolean> => {
  return new Promise(async (res, _rej) => {
    const valid = vf.validateFields(arrayField)
    console.log(valid)
  })
}
</script>
