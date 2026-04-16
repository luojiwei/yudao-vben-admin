<script setup lang="ts">
import type { ItemFormat, ItemType } from '#/components/detail-module';
import type { FileType } from '#/components/file-preview';

import { computed, onMounted } from 'vue';

import { Copy, EyeIcon } from '@vben/icons';
import { formatDate, formatDateTime } from '@vben/utils';

import { message } from 'ant-design-vue';

import DictTag from '#/components/dict-tag/dict-tag.vue';
import {
  isFile,
  isImage,
  openFilePreview,
  openImagePreview,
} from '#/components/file-preview';
import { getDictLabel } from '#/utils/dict';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  prefix: {
    type: [Boolean, String],
    default: '：',
  },
  suffix: {
    type: String,
    default: '',
  },
  labelWidth: {
    type: Number,
    default: 0,
  },
  /** 展示类型 amount 金额 date 日期 datetime 日期时间 file 文件 text 文本 dict 标签 dictLabel 字典label值  */
  type: {
    type: String as () => ItemType,
    default: 'text',
  },
  dictType: {
    type: String,
    default: '',
  },
  copy: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String as () => ItemFormat,
    default: '',
  },
  previewType: {
    type: String as () => 'image' | 'link',
    default: 'image',
  },
  emptyText: {
    type: String,
    default: '--',
  },
});

const valueData = computed(() => {
  if (!props.value) {
    return typeof props.value === 'number' ? 0 : '';
  }

  let type = props.format;
  if (props.type === 'amount') type = 'amount';

  switch (type) {
    case 'amount': {
      return `¥${Number(props.value).toFixed(2)}`;
    }
    case 'date': {
      return formatDate(props.value) || '';
    }
    case 'datetime': {
      return formatDateTime(props.value) || '';
    }
    default: {
      return props.value;
    }
  }
});

const handleCopy = () => {
  const textarea = document.createElement('textarea');
  textarea.value = valueData.value.toString();
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  message.success('复制成功');
};

const getImageUrls = () => {
  const urls = props.value.toString().split(',');
  if (urls.length > 0) {
    return urls;
  }
  return [];
};

const fileData = computed(() => {
  if (props.type === 'file' && props.value) {
    if (props.value.toString().includes(',')) {
      const urls = props.value.toString().split(',');
      const fileUrl = urls[0] || '';
      const fileName = fileUrl.split('/').pop() || '';
      const [name, type] = fileName.split('.');
      return {
        fileName: name,
        fileType: type as FileType,
        fileUrl,
        previewUrl: urls,
      };
    } else {
      const url = props.value.toString();
      const fileName = url.split('/').pop() || '';
      const [name, type] = fileName.split('.');
      return {
        fileName: name,
        fileType: type as FileType,
        fileUrl: url,
        previewUrl: [url],
      };
    }
  }
  return {
    fileName: '',
    fileType: '' as FileType,
    fileUrl: '',
    previewUrl: [],
  };
});

const handlePreview = () => {
  if (isImage(fileData.value.fileType)) {
    openImagePreview(fileData.value.previewUrl);
  } else if (isFile(fileData.value.fileType)) {
    openFilePreview({
      fileName: fileData.value.fileName || '',
      fileType: fileData.value.fileType || '',
      fileUrl: fileData.value.fileUrl || '',
    });
  }
};

onMounted(() => {
  document.documentElement.style.setProperty(
    '--label-width',
    props.labelWidth ? `${props.labelWidth.toString()}px` : 'auto',
  );
});
</script>

<template>
  <div class="cell-item">
    <div class="label">
      {{ label }}
      <template v-if="prefix">
        {{ prefix }}
      </template>
    </div>
    <div class="value">
      <template v-if="!$slots.default">
        <template v-if="valueData || fileData.fileUrl">
          <template v-if="type === 'text'">
            {{ valueData }}
            <Copy
              v-if="copy"
              class="copy-icon"
              :size="14"
              @click="handleCopy"
            />
          </template>
          <template v-else-if="type === 'dict'">
            <DictTag :type="props.dictType" :value="valueData" />
          </template>
          <template v-else-if="type === 'dictLabel'">
            {{ getDictLabel(props.dictType, valueData) }}
          </template>
          <template v-else-if="type === 'file'">
            <view
              v-if="isImage(fileData.fileType) && props.previewType === 'image'"
              class="image-preview"
              @click="handlePreview"
            >
              <view class="preview-mask"> <EyeIcon :size="14" />预览 </view>
              <a-image
                class="preview-image"
                :src="getImageUrls()[0]"
                :preview="false"
              />
            </view>
            <a-button
              v-else-if="
                isFile(fileData.fileType) || props.previewType === 'link'
              "
              type="link"
              @click="handlePreview"
            >
              {{ fileData.fileName }}.{{ fileData.fileType }}
            </a-button>
          </template>
          <template v-else-if="type === 'amount'">
            <span class="amount-text">{{ valueData }}</span>
          </template>
          <template v-if="props.suffix">
            <span class="value-suffix">{{ props.suffix }}</span>
          </template>
        </template>
        <span v-else>{{ emptyText }}</span>
      </template>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cell-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.label {
  width: var(--label-width);
  color: #999;
}

.value {
  display: flex;
  flex: 1;
  align-items: center;

  .copy-icon {
    margin-left: 5px;
    color: hsl(var(--primary));
    cursor: pointer;
  }

  .amount-text {
    font-size: 16px;
    font-weight: 600;
    color: hsl(var(--primary));
  }

  .image-preview {
    position: relative;
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 4px;

    &:hover {
      .preview-mask {
        display: flex;
      }
    }

    :deep(.ant-image) {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #f5f6f7;
    }

    .preview-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      display: none;
      gap: 2px;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      background-color: #00000080;
    }
  }

  .ant-btn-link {
    height: auto;
    padding: 0 !important;
    border: 0;
    border-radius: 0;
  }
}
</style>
