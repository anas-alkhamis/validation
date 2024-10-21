<template>
  <h6>Appraisals Drafts Page</h6>
</template>

<script setup lang="ts">
import { IPerformanceReviewService } from '@/app/service/meta/appraisals/i-performance-review-service'
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { IoC, THashMap } from 'cubes'
import { IAppContext } from 'cubes-ui'

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext)

const performanceReview = (appContext!.services as THashMap)[serviceMap.PerformanceReviewService.key] as IPerformanceReviewService
console.log('🚀 ~ performanceReview:', performanceReview)
;(async () => {
  const result = await performanceReview.listAsync({ offset: 0, limit: 10 })
  console.log('🚀 ~ result:', result)
})()
// const getListAsync = async (f = {} as any) => {
//   return new Promise(async (res, rej) => {
//     try {
//       const result = await performanceReviewService[isDraft.value ? 'listDraftAsync' : 'listAsync']({ ...f, limit: f.limit, offset: f.offset })
//       const data = result.data as IPerformanceReviewLite[]
//       data.forEach(p => appraisalsList.value!.findIndex(existing => existing.id == p.id) < 0 && appraisalsList.value!.push(p))
//       res(result)
//     } catch (e) {
//       appService.error((tGlobal.value.common.messages.error as any).requestError, undefined, 'list::getListAsync')
//       rej(e)
//     }
//   })
// }
</script>
