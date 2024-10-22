<template>Welcome to Competency Group Page</template>
<script lang="ts" setup>
import { CompetencyGroup } from '@/app/domain/def/competency-matrices/competency-group'
import { ICompetency } from '@/app/domain/meta/my-application/common/i-competency'
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { EMPTY_GUID, IoC, THashMap } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { ref } from 'vue'

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext)
const competencyGroup = (appContext!.services as THashMap)[serviceMap.CompetencyGroupService.key]
const competencyGroupInfo = (appContext!.services as THashMap)[serviceMap.CompetencyGroupInfoService.key]
const getListCompetencyGroupsAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroupInfo.listCompetencyGroupsAsync({ offset: 0, limit: 10 })
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const getCompetencyListAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroupInfo.listAsync({ offset: 0, limit: 10 })
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const getCompetencyGroupListAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.listAsync({ offset: 0, limit: 10 })
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const getCompetencyGroupAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.getAsync('1f2b62ac-64db-4d0f-a91d-9952987621da')
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const getListCompetenciesByGroupIdAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.listCompetenciesByGroupIdAsync(['1f2b62ac-64db-4d0f-a91d-9952987621da', 'e18b7792-35db-48fe-58c7-08dcf1c5802d'])
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const postCompetenciesAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.postAsync({
        name: {
          ar: 'new Comp',
          en: 'جديد'
        },
        competenciesCount: 2,
        lastModifiedDateUtc: '2024-10-21T11:02:08.114Z',
        description: {
          ar: 'new Comp',
          en: 'جديد'
        },
        competencies: [
          {
            id: EMPTY_GUID,
            weight: 50,
            name: {
              ar: 'new Comp',
              en: 'جديد'
            },
            lastModifiedDateUtc: '2024-10-21T11:02:08.114Z',
            description: {
              ar: 'new Comp',
              en: 'جديد'
            },
            index: 0,
            competenciesCount: 0
          },
          {
            id: EMPTY_GUID,
            weight: 50,
            name: {
              ar: 'new Comp',
              en: 'جديد'
            },
            lastModifiedDateUtc: '2024-10-21T11:02:08.114Z',
            description: {
              ar: 'new Comp',
              en: 'جديد'
            },
            index: 1,
            competenciesCount: 0
          }
        ]
      })
      res(result)
    } catch (error) {
      rej(error)
    }
  })
}
const putCompetenciesAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const comp = await getCompetencyGroupAsync()
      console.log(comp)

      const result = await competencyGroup.putAsync({
        ...(comp as any)!.data
      })
      res(result)
      newCompetency.value = result
    } catch (error) {
      rej(error)
    }
  })
}
const deleteCompetenciesAsync = async () => {
  return await new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.deleteAsync('6cab628e-2a6e-4073-58c3-08dcf1c5802d')
      res(result)
      newCompetency.value = result
    } catch (error) {
      rej(error)
    }
  })
}
const newCompetency = ref()
newCompetency.value = console.log(getCompetencyGroupListAsync())
// console.log(getListCompetencyGroupsAsync())
// console.log(getCompetencyListAsync())
// console.log(getCompetencyGroupAsync())
// console.log(getListCompetenciesByGroupIdAsync())
// console.log(postCompetenciesAsync())
// console.log(putCompetenciesAsync())
// console.log(deleteCompetenciesAsync())// change id
</script>
