<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="detail-module">
    <div class="module-left">
      <div v-if="title" class="module-title">{{ title }}</div>
      <div class="module-content">
        <div v-if="$slots.image" class="module-image">
          <slot name="image"></slot>
        </div>
        <div class="content-wrapper">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
    <div class="module-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-module {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background-color: hsl(var(--primary) / 15%);
  border-radius: 8px;
}

.module-left {
  flex: 1;

  .module-content {
    display: flex;
    gap: 20px;

    .module-image {
      width: 150px;
      height: 150px;

      :deep(.ant-image) {
        width: 100%;
        height: 100%;

        .ant-image-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .content-wrapper {
      flex: 1;
    }
  }
}

.module-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  justify-content: right;
  width: 200px;
}
</style>
