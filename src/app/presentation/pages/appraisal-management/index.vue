<template>
  Welcome to Appraisal Management <v-input v-auto-focus:['.form-control'] :label="'tGlobal.common.labels.search'" :placeholder="'tGlobal.common.placeholders.searchByName'" :post="[{ type: 'text',
  props: { icon: 'search', type: 'icon' } }]" unified label-sizeless class="mb-0" />
  <v-button>click me</v-button>
</template>
<script lang="ts" setup></script>
