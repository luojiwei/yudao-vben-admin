<script lang="ts" setup>
import type { BenefitDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';

import { getBenefitDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';
import PublicBenefitList from '#/views/estate/edit/modules/PublicEarningsFunds/PublicBenefitList.vue';
import PublicDeviceList from '#/views/estate/edit/modules/PublicEarningsFunds/PublicDeviceList.vue';

defineProps({
  activeKey: {
    type: String,
    default: '5',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<BenefitDetail>({} as BenefitDetail);

const getDetailData = async () => {
  const data = await getBenefitDetail(routeId.value);
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
  <div class="detail-container public-earn-funds">
    <div class="detail-module">
      <div class="module-title">公共收益资金情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="是否存在公共收益资金"
          :value="detailData.isExistBenefit"
          type="dictLabel"
          :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
        />
      </div>
    </div>
    <template v-if="detailData.isExistBenefit === 1">
      <div class="detail-module">
        <div class="module-title">公共收益账户</div>
        <div class="detail-wrapper">
          <CellItem
            label="公共收益存放位置"
            :value="detailData.preserveType || 0"
            type="dictLabel"
            :dict-type="DICT_TYPE.ESTATE_BENEFIT_DEPOSIT_TYPE"
          />
          <CellItem
            label="是否单独账户"
            :value="detailData.isAloneAccount"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
          <CellItem
            label="是否单独列账"
            :value="detailData.isAloneBill"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
          <CellItem label="账户名称" :value="detailData.accountName" />
          <CellItem label="开户银行" :value="detailData.openBank" />
          <CellItem label="银行账号" :value="detailData.bankNo" />
          <CellItem
            label="账户类型"
            :value="detailData.accountType || 0"
            type="dictLabel"
            :dict-type="DICT_TYPE.ESTATE_BENEFIT_ACCOUNT_TYPE"
          />
          <CellItem label="资金管理人身份" :value="detailData.manageIdentity" />
          <CellItem label="资金管理人姓名" :value="detailData.manageName" />
          <CellItem label="资金管理人手机号" :value="detailData.managePhone" />
        </div>
      </div>

      <div class="detail-module">
        <div class="module-title">公共收益账户</div>
        <div class="detail-wrapper">
          <CellItem
            label="地面停车位数"
            :value="detailData.groundNum || 0"
            suffix="个"
          />
          <CellItem
            label="地面停车位收费标准"
            :value="detailData.groundFee || 0"
            suffix="元/天"
          />
          <CellItem
            label="合同附件"
            :file-list="detailData.contractFileList"
            type="file"
          />
        </div>
        <PublicDeviceList
          :estate-id="detailData.estateId"
          :estate-name="detailData.estateName"
          :benefit-id="detailData.id"
          from-type="detail"
        />
      </div>

      <div class="detail-module">
        <div class="module-title">小区共管收益</div>
        <div class="detail-wrapper">
          <CellItem
            label="是否有小区共管收益"
            :value="detailData.isCommonIncome"
            type="dictLabel"
            :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
          />
        </div>
        <PublicBenefitList
          v-if="detailData.isCommonIncome === 1"
          :estate-id="detailData.estateId"
          :estate-name="detailData.estateName"
          :benefit-id="detailData.id"
          from-type="detail"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
