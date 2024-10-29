<template>
  <v-modal v-model="show" :centered="true" teleport>
    <template #header>
      <h5 class="my-auto">{{ globalTranslation.configuration.deleteConfirm.header }}</h5></template
    >
    <template #body>
      <div class="mb-3">
        <v-input-translatable v-model="competency.name" v-auto-focus:['.form-control'] maxlength="50" label="Competency name" placeholder="Enter name" required />

        <v-input-translatable v-model="competency.description" multiline lines="5" maxlength="500" label="Competency description" placeholder="Enter description" />

        <v-input v-model="competency.weight" class="mb-0" post="%" type="number" :min="1" :max="100" label="Competency weight" placeholder="Enter weight" />
      </div>
    </template>

    <template #footer>
      <v-button @click="emit('cancel')" class="btn btn-secondary">
        {{ globalTranslation.configuration.deleteConfirm.cancel }}
      </v-button>

      <v-button @click="emit('submit', competency)">
        {{ globalTranslation.configuration.deleteConfirm.add }}
      </v-button>
    </template>
  </v-modal>
</template>

<script setup lang="ts">
import { ICompetency } from '@/app/domain/meta/my-application/common/i-competency'
import { AppContexts } from '@/control'
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { computed } from 'vue'
const emit = defineEmits(['submit', 'cancel'])

const show = defineModel('show')
const competency: any = defineModel<ICompetency>('competency')

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = computed(() => appContext.translation.global.value)
</script>
