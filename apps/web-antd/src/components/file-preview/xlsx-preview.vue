<script setup lang="ts">
import { ref } from 'vue';

// eslint-disable-next-line n/no-extraneous-import
import VueOfficeExcel from '@vue-office/excel';
import { message } from 'ant-design-vue';

// eslint-disable-next-line n/no-extraneous-import
import '@vue-office/excel/lib/index.css';

defineProps({
  src: {
    type: String,
    default: '',
  },
});

const loading = ref(true);

const renderedHandler = () => {
  loading.value = false;
};

const errorHandler = () => {
  loading.value = false;
  message.error('加载失败');
};
</script>

<template>
  <VueOfficeExcel
    v-loading="loading"
    :src="src"
    style="height: calc(80vh - 66px)"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>
