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
                    <app-bulk-actions :selected="bulk.selectedSet" class="py-2" colspan="1" :items="items" hide-selected @change="(e:boolean) => bulk.onBulkActionsCheck(e)"></app-bulk-actions>
                    <th class="w-50 pl-3">Name</th>
                    <th class="w-50">Number of Competencies</th>
                    <th style="width: 80px">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-bottom order-last:border-0" v-for="item in items">
                    <td v-if="!isDetails" class="py-3">
                      <v-checkbox
                        :modelValue="bulk.selectedSet.has(item[keyMapper.uniqueId])"
                        :selected="bulk.selectedSet.has(item[keyMapper.uniqueId])"
                        :id="`r-${item[keyMapper.uniqueId]}`"
                        class="ml-1"
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
                      <span>
                        {{ item.competenciesCount }}
                      </span>
                    </td>
                    <td v-if="!isDetails">
                      <div class="mr-3">
                        <v-table-actions :items="createActions(item)"></v-table-actions>
                      </div>
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
    <template #details-header> <div>details-header</div></template>
    <template #details>
      <router-view />
    </template>
  </app-summary-page-content>
  <v-modal v-model="isOpen" :centered="true">
    <template #header> <h5 class="my-auto">Delete CompetencyGroup Confirmation</h5></template>
    <template #body>
      <p>Are you sure you want to delete {{ deletedItem?.name[lang] }} competency group item? This action cannot be undone.</p></template
    >
    <template #footer>
      <v-button @click="handleCancelDelete" class="btn btn-secondary">Cancel</v-button>
      <app-async-button @click="deleteCompetencyGroupAsync">Confirm</app-async-button>
    </template>
  </v-modal>
</template>
<script lang="ts" setup>
import { ICompetency } from '@/app/domain/meta/my-application/common/i-competency'
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { IoC, THashMap, TNullable } from 'cubes'
import { IAppContext, ITableAction } from 'cubes-ui'
import { computed, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = appContext.translation.global.value,
  appService = (appContext!.services as THashMap)[serviceMap.AppService.key],
  competencyGroup = (appContext!.services as THashMap)[serviceMap.CompetencyGroupService.key]

const filterModel = ref<{ name: string }>({ name: '' })
const filterRef = ref(),
  bulk = ref({}) as Ref<any>,
  dataView = ref(),
  route = useRoute(),
  router = useRouter(),
  isOpen = ref(false),
  deletedItem = ref<TNullable<ICompetency>>(null)

const isDetails = computed(() => (route.params.id ? true : false))
const isCreate = computed(() => route.name === 'create-competency')
const lang = computed(() => appService.application.state.ui.culture.lang)
const keyMapper = computed(() => ({ uniqueId: 'id', searchableKey: `name.${lang.value}` }))

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
      console.log('args', args)
    },
    disabled: true
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
const deleteCompetencyGroupAsync = () => () =>
  new Promise(async (res, rej) => {
    try {
      await competencyGroup.deleteAsync(deletedItem?.value?.id)
      res('Done')
      handleCancelDelete()
      dataView.value.asyncModel = true
    } catch (e: any) {
      rej(e.message)
    }
  })
</script>
