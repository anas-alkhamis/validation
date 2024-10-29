<template>
  <form>
    <v-card class="m-3" header-class="border-0 pb-0" body-class="py-0">
      <template #header>
        <h6 v-if="true">Fill in the details below to create a new competency matrix</h6>
      </template>

      <v-input-translatable v-auto-focus:['.form-control'] maxlength="50" v-model="name" label="Competency matrix name" placeholder="Enter name" required :state="states['name']"
      :validation-messages="errorMessage.name" @keydown="states['name'] = ValidationStateEnum.unset" />

      <v-input-translatable v-model="description" multiline lines="5" maxlength="500" label="Competency matrix description" placeholder="Enter description" />
    </v-card>

    <v-card v-if="competencies.length" class="m-3" header-class="border-0 pb-0" body-class="py-0">
      <template #header>
        <h6 v-if="true">Add and define competencies.</h6>
        <p class="text-muted">Add and define competencies for use during the appraisal cycle. Total weight should add up to <strong>100%</strong>.</p>

        <small class="d-block text-muted mb-3"></small>
      </template>
      <table v-if="true" class="table">
        <thead class="bg-secondary">
          <tr>
            <th class="align-middle text-muted" width="5%">#</th>
            <th class="align-middle">Competency Name</th>
            <th class="align-middle">Weight</th>
            <th class="align-middle">Description</th>
            <th class="align-middle text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in competencies" :key="item.id">
            <td class="align-middle">{{ item.index + 1 }}</td>
            <td class="align-middle"><v-literal v-model="item.name"></v-literal></td>
            <td class="align-middle">
              <div style="width: 120px">
                <v-input class="mb-0" post="%" type="number" :min="1" :max="100" v-model="item.weight" :state="states['totalWeight']" />
              </div>
            </td>
            <td class="align-middle">
              <v-literal v-model="item.description"></v-literal>
            </td>
            <td class="align-middle">
              <v-table-actions :items="createActions(item.index)"></v-table-actions>
            </td>
          </tr>
        </tbody>
      </table>
      <v-empty v-else figure="empty" :title="'test'" figureWidth="200px">
        <template #action>
          <v-button modifier="outline">
            <v-icon name="cubes-plus"></v-icon>
            test
          </v-button>
        </template>
      </v-empty>
    </v-card>
    <v-card v-else class="m-3" header-class="border-0 pb-0">
      <p style="font-weight: bold">Add and define competencies.</p>
      <p style="font-size: small">Add and define competencies for use during the appraisal cycle. Total weight should add up to 100%.</p>
      <div class="d-flex justify-content-center align-items-center flex-nowrap">
        <div class="text-center p-5">
          <v-avatar src="https://www.clker.com/cliparts/K/l/Q/3/c/0/grey-circle-white-background.svg.med.png" alt="test" size="xxl" class="mb-3"></v-avatar>
          <div class="mb-3" style="font-weight: bold">You have not added any competency yet</div>
          <v-button @click="isOpen = true" modifier="outline"><v-icon name="plus"></v-icon>&nbsp;Add New Competency</v-button>
        </div>
      </div>
    </v-card>
    <competency-form-modal v-model:show="isOpen" v-model:competency="competency" @cancel="handleCancel" @submit="handleSubmit" />
  </form>
</template>

<script setup lang="ts">
import { Competency } from '@/app/domain/def/competency-matrices/competency'
import { CompetencyModify } from '@/app/domain/meta/my-application/common/enum/competency'
import { ICompetency } from '@/app/domain/meta/my-application/common/i-competency'
import { THashMap } from 'cubes'
import { TValidationState, ValidationStateEnum } from 'cubes-ui'
import { computed, defineAsyncComponent, inject, reactive, ref } from 'vue'

const createActions = (index: number) => [
  {
    index,
    title: { en: 'Edit', ar: 'تعديل' },
    icon: 'pen',
    handler: (args: any) => {
      competency.value = new Competency(competencyContext?.competencyGroupDC.model.competencies[args.index])
      mode.value = CompetencyModify.EDIT
      isOpen.value = true
    }
  },
  {
    index,
    title: { en: 'Delete', ar: 'حذف' },
    icon: 'trash',
    accent: 'danger',
    handler: (args: any) => {
      console.log('args', args)
    }
  }
]
const competencyContext: any = inject('competencyContext'),
  isOpen = ref(false),
  mode = ref(CompetencyModify.CREATE),
  competency = ref(new Competency()),
  name = computed({
    get(): THashMap {
      return competencyContext?.competencyGroupDC.model.name
    },
    set(val: THashMap): any {
      competencyContext.competencyGroupDC.model.name = val
    }
  }),
  description = computed({
    get(): THashMap {
      return competencyContext?.competencyGroupDC.model.description
    },
    set(val: THashMap): any {
      competencyContext.competencyGroupDC.model.description = val
    }
  }),
  competencies = computed({
    get(): THashMap {
      return competencyContext.competencyGroupDC.model.competencies
    },
    set(val: THashMap): any {
      competencyContext.competencyGroupDC.model.competencies = val
    }
  }),
  states = reactive<{ name: TValidationState; totalWeight: TValidationState }>({ name: 'unset', totalWeight: 'unset' })
const handleCancel = () => {
  isOpen.value = false
}

const errorMessage = computed(() => ({
  name: states.name === ValidationStateEnum.invalid ? 'error name' : [],
  totalWeight: states.totalWeight === ValidationStateEnum.invalid ? 'error name' : []
}))
console.log(errorMessage.value, 'errorMessageerrorMessage')

const handleSubmit = (competency: any) => {
  if (mode.value === CompetencyModify.EDIT) {
    const index = competencyContext?.competencyGroupDC.model.competencies.findIndex((comp: ICompetency) => comp.id === competency.id)
    if (index > -1) {
      competencyContext.competencyGroupDC.model.competencies[index] = new Competency(competency)
    }
  } else {
    competencyContext.competencyGroupDC.model.competencies.push({ ...competency, isNew: true }, { ...competency, isNew: true })
  }
  competencies.value = competencyContext?.competencyGroupDC.model.competencies

  isOpen.value = false
}


const competencyFormModal = defineAsyncComponent(() => import('../../modals/competency-form-modal.vue'))
</script>
