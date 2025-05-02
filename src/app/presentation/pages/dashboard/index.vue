<template>
  <v-card>
    <form @submit.prevent="validateAsync">
      <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" :state="v.state('name')" @keydown="v.reset('name')"
      :validation-messages="v.error('name')" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age" label="age" placeholder="Enter age" type="number"
      :state="v.state('age')" :validation-messages="v.error('age')" @keydown="v.reset('age')" />

      <v-input
        v-model="controllerDC.model.password"
        maxlength="50"
        label="password"
        placeholder="Enter password"
        type="password"
        :state="v.state('password')"
        :validation-messages="v.error('password')"
        @keydown="v.reset('password')"
      />
      <v-input
        v-model="controllerDC.model.email"
        maxlength="50"
        label="email"
        placeholder="Enter email"
        :state="v.state('email')"
        :validation-messages="v.error('email')"
        @keydown="v.reset('email')"
      />
      <v-input
        v-model="controllerDC.model.info.description"
        maxlength="50"
        label="description"
        placeholder="Enter description"
        :state="v.state('info.description')"
        :validation-messages="v.error('info.description')"
        @keydown="v.reset('info.description')"
      />
      <v-datepicker
        v-model="controllerDC.model.date"
        :placeholder="'pick'"
        label="Single Date"
        format="P"
        :valid="v.state('date')"
        required
        :feedback="v.error('date')[0]"
        @update:model-value="v.reset('date')"
      />
      <v-button type="submit"> submit</v-button>
    </form>

    <form v-if="false" @submit.prevent="validateArrayAsync">
      <div v-for="(field, index) in arrayField">
        <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" @keydown="vf.resetField(index,'name')"
        :state="vf.stateField(index,'name')" :validation-messages="vf.errorFiled(index,'name')" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age" label="age"
        placeholder="Enter age" type="number" @keydown="vf.resetField(index,'age')" :state="vf.stateField(index,'age')" :validation-messages="vf.errorFiled(index,'age')" />
        <v-input
          v-model="controllerDC.model.info.description"
          maxlength="50"
          label="description"
          placeholder="Enter description"
          :state="vf.stateField(index, 'info.description')"
          :validation-messages="vf.errorFiled(index, 'info.description')"
        />
        <v-input
          v-model="controllerDC.model.password"
          maxlength="50"
          label="password"
          placeholder="Enter password"
          type="password"
          @keydown="vf.resetField(index, 'password')"
          :state="vf.stateField(index, 'password')"
          :validation-messages="vf.errorFiled(index, 'password')"
        />
        <v-input
          v-model="controllerDC.model.email"
          maxlength="50"
          label="email"
          placeholder="Enter email"
          @keydown="vf.resetField(index, 'email')"
          :state="vf.stateField(index, 'email')"
          :validation-messages="vf.errorFiled(index, 'email')"
        />
        <v-datepicker
          v-model="controllerDC.model.date"
          :placeholder="'pick'"
          label="Single Date"
          format="P"
          :valid="vf.stateField(index, 'date')"
          required
          @update:model-value="vf.resetField(index, 'date')"
          :feedback="vf.errorFiled(index, 'date')[0]"
        />
      </div>
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
// multiple forms ?
// can I use the builder for both forms ?

import { Test } from '@/app/domain/def/competency-matrices/test'
import { Fields, ListFields } from '@/app/domain/def/f'
import { DataController } from 'cubes-ui'
import { reactive, ref, watch } from 'vue'
import { vr, ValidationEnum } from '@/app/domain/def/v-builder'
////// create schema for validation
// the schema should be create using single class
// its hard to define schema
// find a way to make the validation reactive without using more code
// merge the DataController and validation in a single operation

const rules = vr.schema({
  password: [
    { rule: ValidationEnum.Required, message: 'Password is required' },
    { rule: ValidationEnum.Password, message: 'Password is too weak' }
  ],
  email: [ValidationEnum.Required, { rule: ValidationEnum.Email, message: 'Email must be valid' }],
  name: [ValidationEnum.Required],
  age: [ValidationEnum.Required],
  date: [ValidationEnum.Required],
  'info.description': [{ rule: ValidationEnum.Required, message: 'Description is required' }]
})

const controllerDC = new DataController(Test)
const v = reactive(new Fields(rules))
const vf = reactive(new ListFields(rules))
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
const isValid = ref()
const validateAsync = (): Promise<boolean> => {
  return new Promise(async (res, _rej) => {
    isValid.value = v.validate(controllerDC.model)
    // console.log(v)
  })
}
const validateArrayAsync = (): Promise<boolean> => {
  return new Promise(async (res, _rej) => {
    isValid.value = vf.validateFields(arrayField)
    // console.log(v)
  })
}
watch(
  () => controllerDC.model,
  () => {
    v.track('password', controllerDC.model)
  },
  { deep: true }
)
</script>
