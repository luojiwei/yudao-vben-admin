<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { useEstateStore } from '#/store';
import { tabs } from '#/views/estate/edit/data';

import BasicInfo from './modules/BasicInfo/index.vue';
import CompensatoryService from './modules/CompensatoryService/index.vue';
import OwnerSelfManage from './modules/OwnerSelfManage/index.vue';
import PropertyManageInfo from './modules/PropertyManageInfo/index.vue';
import PublicEarningsFunds from './modules/PublicEarningsFunds/index.vue';
import PublicInfoAndComplaint from './modules/PublicInfoAndComplaint/index.vue';
import PublicPartAndDevice from './modules/PublicPartAndDevice/index.vue';

const route = useRoute();
const router = useRouter();
const { resetEstateInfo } = useEstateStore();

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

const handleEdit = () => {
  resetEstateInfo();
  router.push({ path: '/estate/edit', query: { id: route.query.id } });
};
</script>

<template>
  <Page auto-content-height>
    <Card>
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.tab">
          <component
            :is="components[tab.key]"
            :active-key="tab.key"
            :ref="(el: any) => setComponentRef(tab.key, el)"
          />
        </a-tab-pane>
        <template #rightExtra>
          <a-button type="primary" @click="handleEdit"> 编辑 </a-button>
        </template>
      </a-tabs>
    </Card>
  </Page>
</template>

<style lang="scss" scoped>
:deep(.module-grid) {
  margin-top: 30px;
}

:deep(.ant-tabs-content-holder) {
  max-height: calc(100vh - 232px);
  padding-right: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
