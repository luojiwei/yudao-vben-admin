<script setup lang="ts">
import { computed } from 'vue';

import { EmptyIcon } from '@vben/icons';

import EmptyDataImage from './images/empty-data.png';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  image: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '暂无数据',
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  padding: {
    type: [Number, String],
    default: 0,
  },
});

const EmptyDataImageMap: Record<string, string> = {
  data: EmptyDataImage,
};

const EmptyImage = computed(() => {
  if (props.type === 'default') {
    return '';
  }
  return props.image || EmptyDataImageMap[props.type];
});

const paddingStyle = computed(() => {
  return typeof props.padding === 'number'
    ? {
        padding: `${props.padding || 200}px`,
      }
    : {
        padding: props.padding,
      };
});

const imageStyle = computed(() => {
  if (props.width || props.height) {
    return {
      width: props.width ? `${props.width}px` : 'auto',
      height: props.height ? `${props.height}px` : 'auto',
    };
  }
  return {
    width: '200px',
    height: '200px',
  };
});
</script>

<template>
  <div class="empty-data" :style="paddingStyle">
    <EmptyIcon v-if="type === 'default'" />
    <div v-else class="empty-data-image">
      <a-image :src="EmptyImage" :preview="false" :style="imageStyle" />
    </div>
    <div class="empty-data-alt">{{ alt }}</div>
  </div>
</template>

<style lang="scss" scoped>
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.empty-data-image {
  width: 300px;
  height: 300px;
}

.empty-data-alt {
  font-size: 14px;
  color: #c0c4cc;
}
</style>
