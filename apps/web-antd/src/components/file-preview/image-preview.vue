<script setup lang="ts">
import { ref } from 'vue';

import { Image, ImagePreviewGroup } from 'ant-design-vue';

const visible = ref(false);
const images = ref<string[]>([]);
const current = ref(0);

const imagePreview = (urls: string[], index: number = 0) => {
  images.value = urls;
  current.value = index;
  visible.value = true;
};

defineExpose({
  imagePreview,
});
</script>

<template>
  <ImagePreviewGroup
    v-if="visible"
    :preview="{
      visible,
      current,
      onVisibleChange: (vis: boolean) => (visible = vis),
    }"
  >
    <Image v-for="(url, index) in images" :key="index" :src="url" />
  </ImagePreviewGroup>
</template>
