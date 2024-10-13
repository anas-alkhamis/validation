<template>
  <v-app-container :is-busy="isBusy" :is-ready="isReady">
    <app-main-layout>
      <router-view v-if="isReady" />
    </app-main-layout>
  </v-app-container>
</template>

<script lang="ts" setup>
import { Ref, toRef } from 'vue'
import { AppServiceEvent, ITranslationManager, cubesAppControlProps as props, useTranslation } from 'cubes-ui'
import { useAppContainer } from 'cubes-ui'
import { IoC, CubesEvent } from 'cubes'
import { IAppraisalsAppService } from './service/meta/i-app-service'
import { Ti18n } from '../i18n'
import { TGlobalTranslation } from '../i18n/index'
import { AppContexts } from '../control'
import { AppContext } from './domain/def/app-context'
import { serviceMap } from '../service'
defineProps(props as any)

const { isBusy, isReady } = useAppContainer()

const appService = IoC.DI().resolve<IAppraisalsAppService>(serviceMap.AppService.key)
appService.addEventListener(new CubesEvent(AppServiceEvent.ready), () => {
  const global = toRef(useTranslation<Ti18n>(appService), 'tGlobal') as unknown as Ref<TGlobalTranslation>
  const tm = IoC.DI().resolve<ITranslationManager>(serviceMap.TranslationManager.key)
  IoC.DI().register(AppContext, {
    default: {
      id: AppContexts.appContext!,
      ctorArgs: [
        {
          [serviceMap.AppService.key]: appService
        },
        { global, tm }
      ],
      domain: 0
    }
  })
})
</script>../control
