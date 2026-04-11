<script lang="ts" setup>
import type { PropType } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, reactive, watch } from 'vue';

import { useVbenForm } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import {
  VxeIcon,
  VxeInput,
  VxeNumberInput,
  VxePager,
  VxeSelect,
  VxeUI,
} from 'vxe-pc-ui';
import enUS from 'vxe-pc-ui/lib/language/en-US';
import zhCN from 'vxe-pc-ui/lib/language/zh-CN';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './style.css';

const props = defineProps({
  formSchema: {
    type: Array as PropType<VbenFormSchema[]>,
    default: () => [],
  },
  pageNo: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 8,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (e: 'pageChange', page: { currentPage: number; pageSize: number }): void;
  (e: 'search', formValues: any): void;
  (e: 'reset', formValues: any): void;
}>();

const formData = reactive({
  pageNo: props.pageNo,
  pageSize: props.pageSize,
});

const [Form, formApi] = useVbenForm({
  schema: props.formSchema,
  compact: true,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  showCollapseButton: true,
  submitButtonOptions: {
    content: computed(() => $t('common.search')),
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: async () => {
    const formValues = await formApi.getValues();
    emit('search', formValues);
  },
  handleReset: async () => {
    await formApi.resetForm();
    const formValues = await formApi.getValues();
    emit('reset', formValues);
  },
});

const handlePageChange = (page: { currentPage: number; pageSize: number }) => {
  formData.pageNo = page.currentPage;
  formData.pageSize = page.pageSize;
  emit('pageChange', page);
};

const { isDark, locale } = usePreferences();

const localMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

watch(
  [() => isDark.value, () => locale.value],
  ([isDarkValue, localeValue]) => {
    VxeUI.setTheme(isDarkValue ? 'dark' : 'light');
    VxeUI.setI18n(localeValue, localMap[localeValue]);
    VxeUI.setLanguage(localeValue);
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  // 注册组件
  VxeUI.component(VxePager);
  VxeUI.component(VxeIcon);
  VxeUI.component(VxeNumberInput);
  VxeUI.component(VxeSelect);
  VxeUI.component(VxeInput);
});
</script>

<template>
  <div class="custom-table bg-card">
    <!-- 搜索表单 -->
    <div v-if="formSchema && formSchema.length > 0" class="custom-form-wrapper">
      <Form>
        <template #submit-before>
          <slot name="submit-before"></slot>
        </template>
        <template #reset-before>
          <slot name="reset-before"></slot>
        </template>
        <template #expand-before>
          <slot name="expand-before"></slot>
        </template>
        <template #expand-after>
          <slot name="expand-after"></slot>
        </template>
      </Form>
      <div class="separator bg-background-deep"></div>
    </div>

    <!-- 自定义内容插槽 -->
    <slot></slot>

    <!-- 分页组件 -->
    <VxePager
      v-model:current-page="formData.pageNo"
      v-model:page-size="formData.pageSize"
      size="mini"
      :total="total"
      background
      :layouts="[
        'Total',
        'Sizes',
        'Home',
        'PrevJump',
        'PrevPage',
        'Number',
        'NextPage',
        'NextJump',
        'End',
      ]"
      :page-sizes="[8, 12, 16, 20, 24]"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-table {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.custom-form-wrapper {
  padding: 11px 8px 24px 8px;
  .separator {
    width: 100%;
    height: 12px;
    position: absolute;
    left: 0;
    margin-top: 12px;
  }
}
</style>
