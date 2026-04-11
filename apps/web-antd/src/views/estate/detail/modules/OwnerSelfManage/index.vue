<script lang="ts" setup>
import type { AutonomyDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';

import { getAutonomyDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';

defineProps({
  activeKey: {
    type: String,
    default: '4',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<AutonomyDetail>({} as AutonomyDetail);

const getDetailData = async () => {
  const data = await getAutonomyDetail(routeId.value);
  detailData.value = data;
};

onMounted(() => {
  if (route.query.id) {
    routeId.value = Number(route.query.id);
    getDetailData();
  }
});
</script>

<template>
  <div class="detail-container owner-self-manage">
    <div class="detail-module">
      <div class="module-title">业主自治情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="业委会组建情况"
          :value="detailData.status || 0"
          type="dictLabel"
          :dict-type="DICT_TYPE.ESTATE_OWNERERS_COMMITTEE_STATUS"
        />
        <template v-if="detailData.status && detailData.status === 1">
          <CellItem
            label="业主委员会/物管会成立类型"
            :value="detailData.type || 0"
            type="dictLabel"
            :dict-type="DICT_TYPE.ESTATE_OWNERERS_COMMITTEE_TYPE"
          />
          <template v-if="detailData.type === 1">
            <CellItem
              label="业主自治类型"
              :value="detailData.autonomyType || 0"
              type="dictLabel"
              :dict-type="DICT_TYPE.ESTATE_OWNERERS_AUTONOMOUS_TYPE"
            />
            <CellItem
              label="业委会账户是否开立"
              :value="detailData.isOpenAccount"
              type="dictLabel"
              :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
            />
            <template v-if="detailData.isOpenAccount === 1">
              <CellItem label="账户号" :value="detailData.accountNo" />
              <CellItem label="开户人" :value="detailData.openMember" />
              <CellItem label="开户银行" :value="detailData.openBank" />
              <CellItem label="开户人手机号" :value="detailData.openPhone" />
              <CellItem label="业委会负责人" :value="detailData.manageName" />
              <CellItem label="负责人手机号" :value="detailData.managePhone" />
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
