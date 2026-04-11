<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { Card, Modal } from 'ant-design-vue';

import emitter from '#/utils/bus';

import { tabs } from './data';
import BasicInfo from './modules/BasicInfo/index.vue';
import CompensatoryService from './modules/CompensatoryService/index.vue';
import OwnerSelfManage from './modules/OwnerSelfManage/index.vue';
import PropertyManageInfo from './modules/PropertyManageInfo/index.vue';
import PublicEarningsFunds from './modules/PublicEarningsFunds/index.vue';
import PublicInfoAndComplaint from './modules/PublicInfoAndComplaint/index.vue';
import PublicPartAndDevice from './modules/PublicPartAndDevice/index.vue';

const activeKey = ref('1');
const components: Record<string, any> = {
  '1': BasicInfo,
  '2': PublicPartAndDevice,
  '3': PropertyManageInfo,
  '4': OwnerSelfManage,
  '5': PublicEarningsFunds,
  '6': PublicInfoAndComplaint,
  '7': CompensatoryService,
};

const componentRefs = ref<Record<string, any>>({
  '1': null,
  '2': null,
  '3': null,
  '4': null,
  '5': null,
  '6': null,
  '7': null,
});

const setComponentRef = (key: string, el: any) => {
  componentRefs.value[key] = el;
};

const currentComponent = computed(() => componentRefs.value[activeKey.value]);

const loading = computed(() => {
  if (currentComponent.value) {
    return currentComponent.value.loading;
  }
  return false;
});

const handleSave = useDebounceFn(() => {
  currentComponent.value.handleSave();
}, 500);

const handleTabClick = (targetKey: string) => {
  if (currentComponent.value) {
    const isModified = currentComponent.value.isFormModified();
    if (isModified) {
      Modal.confirm({
        title: '提示',
        content: '当前页面有未保存的修改，是否保存？',
        okText: '保存',
        okType: 'primary',
        cancelText: '不保存',
        onOk: () => {
          handleSave();
        },
        onCancel: () => {
          activeKey.value = targetKey;
        },
      });
      // 抛出错误阻止tab切换
      throw new Error('当前页面有未保存的修改');
    }
  }
  activeKey.value = targetKey;
};

onMounted(() => {
  emitter.on('estate:switchTab', (key) => {
    activeKey.value = key as string;
  });
});
</script>

<template>
  <Page auto-content-height>
    <Card>
      <a-tabs v-model:active-key="activeKey" @tab-click="handleTabClick">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.tab">
          <component
            :is="components[tab.key]"
            :active-key="tab.key"
            :ref="(el: any) => setComponentRef(tab.key, el)"
          />
        </a-tab-pane>
        <template #rightExtra>
          <a-button type="primary" :loading="loading" @click="handleSave">
            保存
          </a-button>
        </template>
      </a-tabs>
    </Card>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.module-grid + .module-grid) {
  margin-top: 30px;
}

:deep(.ant-tabs-content-holder) {
  max-height: calc(100vh - 232px);
  padding-right: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
