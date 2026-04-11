<script setup lang="ts">
import type { PropType } from 'vue';

import type { FileItem } from '@vben/types';

import type { FileType } from '#/components/file-preview';

import { EyeOutlined } from '@ant-design/icons-vue';

import {
  isFile,
  isImage,
  openFilePreview,
  openImagePreview,
} from '#/components/file-preview';

const props = defineProps({
  file: {
    type: Object as PropType<FileItem>,
    required: true,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});

const handlePreview = () => {
  if (!props.preview) {
    return;
  }

  const fileType = props.file.type.includes('image/')
    ? props.file.type.replace('image/', '')
    : props.file.type;

  if (isImage(fileType)) {
    openImagePreview([props.file.url]);
  } else if (isFile(fileType)) {
    openFilePreview({
      fileName: props.file.name,
      fileType: fileType as FileType,
      fileUrl: props.file.url,
    });
  }
};
</script>

<template>
  <a-button type="link" @click="handlePreview">
    {{ file.name }}<EyeOutlined />
  </a-button>
</template>

<style scoped lang="scss">
.ant-btn-link {
  padding: 0 !important;
  height: auto;
}
</style>
