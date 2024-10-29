<template>
  <div class="d-flex flex-column gap-3">
    <v-literal tag="h6" v-model="props.title" :auto="false" />

    <div class="text-muted">{{ props.dateLabel || globalTranslation.common.labels.lastModifiedHeader }} <v-date :date="props.date" format="DT" class="ml-1" /></div>
  </div>
</template>

<script setup lang="ts">
import { AppContexts } from '@/control'
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { computed } from 'vue'

const props = defineProps<{ title: string; dateLabel: string; date: Date }>()
const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = computed(() => appContext.translation.global.value)
</script>
