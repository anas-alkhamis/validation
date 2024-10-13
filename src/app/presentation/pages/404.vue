<template>
  <v-page>
    <app-content>
      <div class="d-flex align-items-center justify-content-center h-100 w-100">
        <v-empty figure="error" :title="tGlobal.errors.pageNotFound" figureWidth="50vw">
          <template #action>
            <router-link :to="{ name: routeName }">{{ tGlobal[actionTitleKey ?? 'defaultRedirect'] }}</router-link>
          </template>
        </v-empty>
      </div>
    </app-content>
  </v-page>
</template>
<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { AppContexts } from '@/appraisals-control'
import { Ref } from 'vue'
import { TGlobalTranslation } from '../../../i18n/index'
import { props } from './def/404'

defineProps(props)

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  tGlobal = appContext!.translation.global as Ref<TGlobalTranslation>
</script>
