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
        <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.name" label="name" placeholder="Enter name" @keydown="vr.reset('name',index)"
        :state="vr.state('name',index,)" :validation-messages="vr.validationMessages('name',index)" /> <v-input v-auto-focus:['.form-control'] maxlength="50" v-model="controllerDC.model.age"
        label="age" placeholder="Enter age" type="number" @keydown="vr.reset('age',index)" :state="vr.state('age',index)" :validation-messages="vr.validationMessages('age',index)" />
        <v-input
          v-model="controllerDC.model.info.description"
          maxlength="50"
          label="description"
          placeholder="Enter description"
          :state="vr.state('info.description', index)"
          :validation-messages="vr.validationMessages('info.description', index)"
        />
        <v-input
          v-model="controllerDC.model.password"
          maxlength="50"
          label="password"
          placeholder="Enter password"
          type="password"
          @keydown="vr.reset('password', index)"
          :state="vr.state('password', index)"
          :validation-messages="vr.message('password', index)"
        />
        <v-input
          v-model="controllerDC.model.email"
          maxlength="50"
          label="email"
          placeholder="Enter email"
          @keydown="vr.reset('email', index)"
          :state="vr.state('email', index)"
          :validation-messages="vr.validationMessages('email', index)"
        />
        <v-datepicker
          v-model="controllerDC.model.date"
          :placeholder="'pick'"
          label="Single Date"
          format="P"
          :valid="vr.state('date', index)"
          required
          @update:model-value="vr.reset('date', index)"
          :feedback="vr.message('date', index)[0]"
        />
      </div>
      <v-button type="submit"> submit</v-button>
    </form>
  </v-card>
</template>
<script lang="ts" setup>
import { Test } from '@/app/domain/def/competency-matrices/test'
import { DataController } from 'cubes-ui'
import { MessageTypeEnum } from '@/app/domain/def/v'
import { useValidation, useValidationArray } from '@/app/domain/def/validation'
import { rules } from './schema'
////// create schema for validation

const controllerDC = new DataController(Test)
const v = useValidation(rules)
const vr = useValidationArray(rules)
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
const validateAsync = () => {
  const valid = v.validate(controllerDC.model)
  console.log(valid)
}
const validateArrayAsync = () => {
  const valid = vr.validate(arrayField)
  console.log(valid)
}
</script>
