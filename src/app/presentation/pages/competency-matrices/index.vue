<template>
  <app-summary-page-content :no-sidebar="true" :show-details="isDetails || isCreate" :show-filter="false" :no-list="isCreate">
    <template v-if="!isDetails && !isCreate" #header-right-actions>
      <v-button @click="createCompetency">{{ globalTranslation.configuration.createMatrix }} </v-button>
    </template>

    <template #list>
      <v-card>
        <v-col>
          <v-filter ref="filterRef" v-model="filterModel" no-header no-actions>
            <template v-slot:default="{ filter }">
              <v-input
                v-model="filter.name"
                :placeholder="globalTranslation.configuration.searchPlaceholder"
                :post="[{ type: 'text', props: { icon: 'search', type: 'icon', value: 'test' } }]"
                unified
                class="my-0"
                maxlength="500"
                autocomplete="off"
                :v-auto-focus="['input']"
              />
            </template>
          </v-filter>
        </v-col>

        <v-col>
          <app-data-view
            ref="dataView"
            :filter="filterModel"
            :fetch-options="getCompetencyGroupListAsync"
            :initial-offset="0"
            :key-mapper="keyMapper"
            paginated
            paginationType="loadMore"
            class="pb-2 h-100"
            @set-bulk="setBulk"
          >
            {{ bulk }}
            <template #items="{ items }">
              <table class="w-100">
                <thead class="border-bottom">
                  <tr v-if="!isDetails">
                    <app-bulk-actions
                      :size="10"
                      :selected="bulk.selectedSet"
                      class="py-2"
                      colspan="1"
                      :items="items"
                      hide-selected
                      @change="(e:boolean) => bulk.onBulkActionsCheck(e)"
                    ></app-bulk-actions>
                    <th class="col-6 pl-3">{{ globalTranslation.configuration.tableHeaders.name }}</th>
                    <th class="col-4">{{ globalTranslation.configuration.tableHeaders.numberOfCompetencies }}</th>
                    <th class="col-1 text-right">{{ globalTranslation.configuration.tableHeaders.action }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-bottom order-last:border-0" v-for="item in items">
                    <td v-if="!isDetails" class="py-3">
                      <v-checkbox
                        :modelValue="bulk.selectedSet.has(item[keyMapper.uniqueId])"
                        :selected="bulk.selectedSet.has(item[keyMapper.uniqueId])"
                        :id="`r-${item[keyMapper.uniqueId]}`"
                        class="ml-1 pt-1"
                        @change="(e:any) => bulk.updateSelection(item[keyMapper.uniqueId], e)"
                      />
                    </td>
                    <td>
                      <router-link
                        :to="{ name: 'core-competencies', params: { id: item.id } }"
                        v-fake-link
                        :key="`${item.id}`"
                        tag="div"
                        :class="{ 'list-group-item': true, active: $route.params.id == item.id }"
                        active-class="active"
                      >
                        <v-literal tag="span" v-model="item.name" :class="`list-group-item-title ${$route.params.id !== item.id ? 'text-primary' : ''}`" :auto="false" />
                      </router-link>
                    </td>
                    <td v-if="!isDetails">
                      <div class="pl-3">
                        {{ item.competenciesCount }}
                      </div>
                    </td>
                    <td v-if="!isDetails">
                      <v-table-actions :items="createActions(item)"></v-table-actions>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template #not-found="{ query }">
              <v-empty v-if="query" key="not-found" figure="nodata" figure-width="160px" />
              <v-empty
                key="nodata"
                :title="globalTranslation.configuration.noDataListTitle"
                :subtitle="globalTranslation.configuration.noDataListSubTitle"
                class="h-100 w-100"
                figure="empty"
                figure-width="70%"
              >
                <v-button @click="createCompetency">{{ globalTranslation.configuration.createMatrix }} </v-button>
              </v-empty>
            </template>
          </app-data-view>
        </v-col>
      </v-card>
    </template>
    <template #list-add-button>
      <v-button v-if="isDetails" class="btn-floated position-absolute" accent="primary" size="md" @click="createCompetency"> <v-icon name="plus"></v-icon> </v-button>
    </template>
    <template #details-header>
      <router-view name="header" :title="headerDetails?.name" :description="headerDetails?.description"></router-view>
    </template>
    <template #details>
      <competency-forms></competency-forms>
    </template>
  </app-summary-page-content>
  <delete-confirmation v-model="isOpen" :handleCancelDelete :deleteCompetencyGroupAsync :deletedItem />
</template>
<script lang="ts" setup>
import { CompetencyGroup } from '@/app/domain/def/competency-matrices/competency-group'
import { ICompetency } from '@/app/domain/meta/my-application/common/i-competency'
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { EMPTY_GUID, IoC, THashMap, TNullable } from 'cubes'
import { DataController, IAppContext, ITableAction } from 'cubes-ui'
import { computed, defineAsyncComponent, Ref, ref, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = computed(() => appContext.translation.global.value),
  appService = (appContext!.services as THashMap)[serviceMap.AppService.key],
  competencyGroup = (appContext!.services as THashMap)[serviceMap.CompetencyGroupService.key]

const filterModel = ref<{ name: string }>({ name: '' })
const filterRef = ref(),
  bulk = ref({}) as Ref<any>,
  dataView = ref(),
  route = useRoute(),
  router = useRouter(),
  isOpen = ref(false),
  deletedItem = ref<TNullable<ICompetency>>(null),
  headerDetails = ref()

const isDetails = computed(() => (route.params.id !== undefined ? true : false))
const competencyId = computed(() => route.params.id)

const isCreate = computed(() => route.name === 'create-competency' || route.name === 'edit-competency')
const lang = computed(() => appService.application.state.ui.culture.lang)
const keyMapper = computed(() => ({ uniqueId: 'id', searchableKey: `name.${lang.value}` }))
const competencyGroupDC = new DataController(CompetencyGroup)
// table actions
const handleDeleteConfirm = (data: ITableAction & { item: ICompetency }) => {
  deletedItem.value = data.item
  isOpen.value = true
}
const handleCancelDelete = () => {
  deletedItem.value = null
  isOpen.value = false
}
const createActions = (item: ICompetency) => [
  {
    item,
    title: { en: 'Edit', ar: 'تعديل' },
    icon: 'pen',
    handler: (args: any) => {
      router.push({
        name: 'edit-competency',
        params: { id: args.item.id }
      })
    },
    disabled: false
  },
  {
    item,
    title: { en: 'Delete', ar: 'حذف' },
    icon: 'trash',
    accent: 'danger',
    handler: handleDeleteConfirm
  }
]

const setBulk = (b: any) => {
  bulk.value = b
}
const createCompetency = () => {
  router.push({
    name: 'create-competency'
  })
}

const getCompetencyGroupListAsync = async (f = {} as any) => {
  return new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.listAsync({ ...f, limit: 10 })
      res(result)
    } catch (e) {
      rej(e)
    }
  })
}

const getCompetencyGroupAsync = (id: string) =>
  new Promise(async (res, rej) => {
    try {
      const result = await competencyGroup.getAsync(id)
      competencyGroupDC.model = result.data
      competencyGroupDC.commit()
      res(result)
    } catch (e) {
      rej(e)
    }
  })
const resolveCompetenciesEmptyGUIDs = () =>
  new CompetencyGroup({
    ...competencyGroupDC.model,
    id: EMPTY_GUID,
    competenciesCount: competencyGroupDC.model.competencies?.length,
    lastModifiedDateUtc: null,
    competencies: competencyGroupDC.model.competencies?.map((comp: ICompetency, index) => {
      return { ...comp, id: EMPTY_GUID, index, lastModifiedDateUtc: null }
    })
  })
const deleteCompetencyGroupAsync = (id?: string) => () =>
  new Promise(async (res, rej) => {
    try {
      await competencyGroup.deleteAsync(id)
      res('Done')
      handleCancelDelete()
      dataView.value.asyncModel = true
    } catch (e: any) {
      rej(e.message)
    }
  })
const createCompetencyGroupAsync = () =>
  new Promise(async (res, rej) => {
    try {
      await competencyGroup.postAsync(resolveCompetenciesEmptyGUIDs())
      res('Done')
    } catch (e: any) {
      rej(e.message)
    }
  })
const updateCompetencyGroupAsync = () =>
  new Promise(async (res, rej) => {
    try {
      await competencyGroup.putAsync(competencyGroupDC.model)
      res('Done')
    } catch (e: any) {
      rej(e.message)
    }
  })
watch(
  competencyId,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      getCompetencyGroupAsync(newId as any)
    } else {
      competencyGroupDC.model = new CompetencyGroup()
    }
  },
  { immediate: true }
)
const context = { competencyGroupDC, createCompetencyGroupAsync, updateCompetencyGroupAsync }
provide('competencyContext', context)
const CompetencyForms = defineAsyncComponent(() => import('./content/forms/details/index.vue'))
const DeleteConfirmation = defineAsyncComponent(() => import('./content/modals/delete-confirmation-modal.vue'))
</script>
