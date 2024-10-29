<template>
  <component v-if="$route.meta.mode === PageMode.CREATE || $route.meta.mode === PageMode.EDIT" :is="CompetencyForm"></component>
  <component v-if="$route.meta.mode === PageMode.VIEW" :is="CompetencyView"></component>
</template>

<script setup lang="ts">
import { PageMode } from '@/app/domain/meta/my-application/common/enum/competency'
import { defineAsyncComponent } from 'vue'

const CompetencyForm = defineAsyncComponent(() => import('./form.vue'))
const CompetencyView = defineAsyncComponent(() => import('./view.vue'))
</script>
