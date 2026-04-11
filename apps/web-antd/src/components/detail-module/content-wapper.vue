<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
  col: {
    type: Number,
    default: 2,
  },
  gap: {
    type: Number,
    default: 12,
  },
});

onMounted(() => {
  document.documentElement.style.setProperty('--cw-col', props.col.toString());
  document.documentElement.style.setProperty(
    '--cw-gap',
    `${props.gap.toString()}px`,
  );
});
</script>

<template>
  <div class="content-wapper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.content-wapper {
  display: grid;
  grid-template-columns: repeat(var(--cw-col), 1fr);
  grid-gap: var(--cw-gap);
}
</style>
