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
            <template #items="{ items }">
              <table class="w-100">
                <thead class="border-bottom">
                  <tr v-if="!isDetails">
                    <th style="width: 100px" class="py-3">
                      <app-bulk-actions :selected="bulk.selectedSet" colspan="2" :items="items" :actions="[]" hide-selected @change="(e:boolean) => bulk.onBulkActionsCheck(e)"></app-bulk-actions>
                    </th>
                    <th class="w-50 pl-3">Name</th>
                    <th class="w-50">Number of Competencies</th>
                    <th style="width: 80px">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-bottom" v-for="item in items">
                    <td v-if="!isDetails" class="py-4">
                      <v-checkbox class="ml-2" :disabled="false" />
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
                      <div class="mr-4">
                        <v-table-actions :items="actionList"></v-table-actions>
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
    <template #details-header> <div>details-header</div></template>
    <template #details>
      <router-view />
    </template>
  </app-summary-page-content>
</template>
<script lang="ts" setup>
import { AppContexts } from '@/control'
import { serviceMap } from '@/service'
import { IoC, THashMap } from 'cubes'
import { IAppContext, ITableAction } from 'cubes-ui'
import { computed, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  globalTranslation = appContext.translation.global.value,
  appService = (appContext!.services as THashMap)[serviceMap.AppService.key],
  competencyGroup = (appContext!.services as THashMap)[serviceMap.CompetencyGroupService.key]

const filterModel = ref<{ name: string }>({ name: '' })
const filterRef = ref(),
  bulk = ref(),
  dataView = ref(),
  route = useRoute(),
  router = useRouter()
console.log(route)

const isDetails = computed(() => (route.params.id ? true : false))
const isCreate = computed(() => route.name === 'create-competency')
const lang = computed(() => appService.application.state.ui.culture.lang)
const keyMapper = computed(() => ({ uniqueId: 'id', searchableKey: `name.${lang.value}` }))

// table actions
const actionList: Ref<ITableAction[]> = ref([
  {
    title: { en: 'Edit', ar: 'تعديل' },
    icon: 'pen',
    handler: (args: any) => {
      console.log('args', args)
    },
    disabled: true
  },
  {
    title: { en: 'Delete', ar: 'حذف' },
    icon: 'trash',
    accent: 'danger',
    handler: (args: any) => {
      console.log('args', args)
    }
  }
])
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
      const result = await competencyGroup.listAsync(f)
      res(result)
    } catch (e) {
      rej(e)
    }
  })
}
</script>
