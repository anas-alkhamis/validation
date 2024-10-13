<template>
  <app-page-content boxed>
    <v-empty key="error" :title="tGlobal.common.messages.error.accessDenied" :subtitle="tGlobal.common.messages.error.noPermission" figure="error" figure-width="620px" />
  </app-page-content>
</template>

<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { AppContexts } from '@/control'
import { Ref } from 'vue'
import { TGlobalTranslation } from '../../../i18n/index'

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  tGlobal = appContext!.translation.global as Ref<TGlobalTranslation>
</script>
