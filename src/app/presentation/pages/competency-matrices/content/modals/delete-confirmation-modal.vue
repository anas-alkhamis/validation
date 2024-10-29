<template>
  <v-modal v-model="props.modelView" :centered="true">
    <template #header>
      <h5 class="my-auto">{{ globalTranslation.configuration.deleteConfirm.header }}</h5></template
    >
    <template #body>
      <div>
        <p>
          {{ globalTranslation.configuration.deleteConfirm.body }}
        </p>
      </div></template
    >
    <template #footer>
      <v-button @click="props.handleCancelDelete" class="btn btn-secondary">{{ globalTranslation.configuration.deleteConfirm.cancel }}</v-button>
      <app-async-button @click="props.deleteCompetencyGroupAsync(props.deletedItem.id)">{{ globalTranslation.configuration.deleteConfirm.confirm }}</app-async-button>
    </template>
  </v-modal>
</template>

<script setup lang="ts">
import { AppContexts } from '@/control'
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { computed } from 'vue'

const props = defineProps<{ handleCancelDelete(): void; deleteCompetencyGroupAsync(id: string): Promise<any>; modelView: boolean; deletedItem: any }>()
const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = computed(() => appContext.translation.global.value)
</script>
