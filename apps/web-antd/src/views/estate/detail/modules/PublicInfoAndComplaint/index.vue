<script lang="ts" setup>
import type { AfficheDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';

import { getAfficheDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';
import PublicCompanyList from '#/views/estate/edit/modules/PublicInfoAndComplaint/PublicCompanyList.vue';
import PublicRuleList from '#/views/estate/edit/modules/PublicInfoAndComplaint/PublicRuleList.vue';
import PublicServeList from '#/views/estate/edit/modules/PublicInfoAndComplaint/PublicServeList.vue';

defineProps({
  activeKey: {
    type: String,
    default: '6',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<AfficheDetail>({} as AfficheDetail);

const getDetailData = async () => {
  const data = await getAfficheDetail(routeId.value);
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
  <div class="detail-container public-info-and-complaint">
    <div class="detail-module">
      <div class="module-title">信息公开与投诉填报情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="是否存在公共收益资金"
          :value="detailData.isFillout"
          type="dictLabel"
          :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
        />
      </div>
    </div>
    <template v-if="detailData.isFillout === 1">
      <div class="detail-module">
        <div class="module-title">业主大会管理规约、议事规则公开公示情况</div>
        <div class="detail-wrapper">
          <CellItem
            label="是否有业主大会管理规约、议事规则公开公示情况表"
            :value="detailData.isOwner"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
        </div>
        <PublicRuleList
          v-if="detailData.isOwner === 1"
          :estate-id="detailData.estateId"
          :estate-name="detailData.estateName"
          :affiche-id="detailData.id"
          from-type="detail"
        />
      </div>

      <div class="detail-module">
        <div class="module-title">物业企业公示情况</div>
        <div class="detail-wrapper">
          <CellItem
            label="是否有物业企业公示情况表"
            :value="detailData.isCompany"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
        </div>
        <PublicCompanyList
          v-if="detailData.isCompany === 1"
          :estate-id="detailData.estateId"
          :estate-name="detailData.estateName"
          :affiche-id="detailData.id"
          from-type="detail"
        />
      </div>

      <div class="detail-module">
        <div class="module-title">物业服务公示情况</div>
        <div class="detail-wrapper">
          <CellItem
            label="是否有物业服务公示情况表"
            :value="detailData.isServe"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
        </div>
        <PublicServeList
          v-if="detailData.isServe === 1"
          :estate-id="detailData.estateId"
          :estate-name="detailData.estateName"
          :affiche-id="detailData.id"
          from-type="detail"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
