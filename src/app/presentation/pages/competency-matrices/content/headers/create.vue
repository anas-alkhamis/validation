<template>
  <div class="d-flex align-items-center justify-content-between m-3">
    <page-header :title="name" date=""></page-header>
    <div class="d-flex align-items-center flex-shrink-1 align-self-start">
      <v-button accent="light" modifier="subtle" class="mx-4 text-primary">Cancel</v-button>
      <v-button @click="competencyContext.createCompetencyGroupAsync">Create</v-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, inject } from 'vue'

const PageHeader = defineAsyncComponent(() => import('../../../../components/common/page-header.vue'))
const competencyContext: any = inject('competencyContext')
const name = computed(() => competencyContext.competencyGroupDC.model.name)
</script>
