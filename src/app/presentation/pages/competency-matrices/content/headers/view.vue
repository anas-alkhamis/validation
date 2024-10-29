<template>
  <div class="d-flex align-items-center justify-content-between m-3">
    <page-header :title="competencyContext.competencyGroupDC.model.name" :date="competencyContext.competencyGroupDC.model.lastModifiedDateUtc"></page-header>
    <v-button-group class="align-self-start" :items="items"></v-button-group>
  </div>
</template>

<script setup lang="ts">
import { IButtonGroupItem } from 'cubes-ui'
import { defineAsyncComponent, inject, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const editCompetency = () => {
  router.push({
    name: 'edit-competency',
    params: { id: competencyContext.competencyGroupDC.model.id }
  })
}

const items: Ref<IButtonGroupItem[]> = ref([
  {
    title: { en: 'Edit', ar: 'تعديل' },
    icon: 'pencil',
    handler: editCompetency
  },
  {
    title: { en: 'Delete', ar: 'حذف' },
    icon: ['far', 'trash'],
    handler: (args: any) => {
      console.log('args', args)
    },
    accent: 'danger'
  }
])
const competencyContext: any = inject('competencyContext')

const PageHeader = defineAsyncComponent(() => import('../../../../components/common/page-header.vue'))
</script>
