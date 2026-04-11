<script lang="ts" setup>
import type { PropertyDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';

import { getPropertyDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';
import PropertyStaffList from '#/views/estate/edit/modules/PropertyManageInfo/PropertyStaffList.vue';
import PropertySupervisorList from '#/views/estate/edit/modules/PropertyManageInfo/PropertySupervisorList.vue';

defineProps({
  activeKey: {
    type: String,
    default: '3',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<PropertyDetail>({} as PropertyDetail);

const getDetailData = async () => {
  const data = await getPropertyDetail(routeId.value);
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
  <div class="detail-container property-manage-info">
    <div class="detail-module">
      <div class="module-title">物业所属情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="物业所属阶段"
          :value="detailData.situationId || 0"
          type="dictLabel"
          :dict-type="DICT_TYPE.ESTATE_PROPERTY_STAGE"
        />
      </div>
    </div>

    <div class="detail-module">
      <div class="module-title">物业服务情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="是否外包"
          :value="detailData.isEpiboly"
          type="dictLabel"
          :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
        />
      </div>
    </div>

    <div class="detail-module">
      <div class="module-title">物业基本信息</div>
      <div class="detail-wrapper">
        <CellItem label="物业企业名称" :value="detailData.companyName" />
        <CellItem label="统一社会信用代号" :value="detailData.creditCode" />
        <CellItem label="法定代表人" :value="detailData.legalEntity" />
        <CellItem label="法人身份证号" :value="detailData.idCard" />
        <CellItem label="公司账户名称" :value="detailData.accountName" />
        <CellItem label="开户银行" :value="detailData.bankName" />
        <CellItem label="银行卡号" :value="detailData.bankCardNumber" />
        <CellItem
          label="物业类型"
          :value="detailData.type || 0"
          type="dictLabel"
          :dict-type="DICT_TYPE.ESTATE_PROPERTY_TYPE"
        />
        <CellItem
          label="物业计费方式"
          :value="detailData.serveCostType || 0"
          type="dictLabel"
          :dict-type="DICT_TYPE.ESTATE_PROPERTY_CHARGE_MODE"
        />
        <CellItem label="物业费用" :value="detailData.money || 0" suffix="元" />
      </div>
    </div>

    <PropertySupervisorList
      :estate-id="detailData.estateId"
      :estate-name="detailData.estateName"
      :manage-id="detailData.id"
      from-type="detail"
    />
    <PropertyStaffList
      :estate-id="detailData.estateId"
      :estate-name="detailData.estateName"
      :manage-id="detailData.id"
      from-type="detail"
    />
  </div>
</template>

<style lang="scss" scoped></style>
