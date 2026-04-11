<script setup lang="ts">
import { ref } from 'vue';

// eslint-disable-next-line n/no-extraneous-import
import VueOfficePptx from '@vue-office/pptx';
import { message } from 'ant-design-vue';

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
  <VueOfficePptx
    v-loading="loading"
    :src="src"
    style="height: calc(80vh - 66px)"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>

<style scoped lang="scss">
:deep(.pptx-preview-wrapper) {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
}
</style>
