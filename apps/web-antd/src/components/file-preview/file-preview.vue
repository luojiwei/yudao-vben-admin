<script setup lang="ts">
import type { FileType } from './index.ts';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import DocxPreview from './docx-preview.vue';
import PdfPreview from './pdf-preview.vue';
import PptxPreview from './pptx-preview.vue';
import ExcelPreview from './xlsx-preview.vue';

const fileUrl = ref('');
const fileName = ref('');
const fileType = ref<FileType>();

const [Modal, modalApi] = useVbenModal({
  contentClass: 'py-0',
  showCancelButton: false,
  showConfirmButton: false,
  fullscreenButton: false,
});

const filePreview = (url: string, name: string, type: FileType) => {
  fileUrl.value = url;
  fileName.value = name;
  fileType.value = type;
  modalApi.open();
};

// 暴露方法给外部调用
defineExpose({
  filePreview,
});
</script>

<template>
  <Modal title="文件预览" class="w-3/4">
    <PdfPreview v-if="fileType === 'pdf'" :src="fileUrl" />
    <ExcelPreview
      v-else-if="['xlsx', 'xls'].includes(fileType as FileType)"
      :src="fileUrl"
    />
    <DocxPreview
      v-else-if="['docx', 'doc'].includes(fileType as FileType)"
      :src="fileUrl"
    />
    <PptxPreview
      v-else-if="['pptx', 'ppt'].includes(fileType as FileType)"
      :src="fileUrl"
    />
  </Modal>
</template>
