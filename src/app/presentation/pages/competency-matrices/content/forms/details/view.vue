<template>
  <v-toolbar> <a href="javascript:void(0)" @click="expendAll">Expand All</a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="javascript:void(0)" @click="collapseAll">Collapse All</a> </v-toolbar>
  <v-card class="m-4">
    <v-collapse v-model="expansionDetails" model="details">
      <template #head>
        <div class="card-header p-0 border-0">
          <v-collapse-toggle class="btn btn-block btn-reset font-weight-bold px-0"> Details</v-collapse-toggle>
        </div>
      </template>
      <p class="m-0 my-2">
        <v-literal tag="span" v-model="competencyContext.competencyGroupDC.model.description" :auto="false" />
        <span class="font-weight-bold"></span>
      </p>
    </v-collapse>
  </v-card>
  <v-card class="m-4">
    <v-collapse v-model="expansionCompetencies" model="competencies">
      <template #head>
        <div class="card-header p-0 border-0">
          <v-collapse-toggle class="btn btn-block btn-reset font-weight-bold px-0">Competencies</v-collapse-toggle>
        </div>
      </template>
      <table class="w-100 mt-2">
        <thead class="border-bottom">
          <tr class="bg-light">
            <th class="col-1 text-muted font-weight-normal py-3">#</th>
            <th class="col-3">Competency Name</th>
            <th class="col-4">Weight</th>
            <th class="col-4">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-bottom order-last:border-0" v-for="(item, index) in competencyContext.competencyGroupDC.model.competencies">
            <td class="py-3">{{ index + 1 }}</td>
            <td><v-literal tag="span" v-model="item.name" :auto="false" /></td>
            <td>{{ item.weight }}</td>
            <td><v-literal tag="span" v-model="item.description" :auto="false" /></td>
          </tr>
        </tbody>
      </table>
    </v-collapse>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { inject } from 'vue'
const expansionDetails = ref('details')
const expansionCompetencies = ref('competencies')
const expendAll = () => {
  expansionDetails.value = 'details'
  expansionCompetencies.value = 'competencies'
}
const collapseAll = () => {
  expansionDetails.value = 'false'
  expansionCompetencies.value = 'false'
}
const competencyContext: any = inject('competencyContext')
</script>
