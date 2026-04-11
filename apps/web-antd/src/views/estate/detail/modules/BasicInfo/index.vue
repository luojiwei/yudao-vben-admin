<script lang="ts" setup>
import type { BasicDetail } from '#/api/estate';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getEstateBasic } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';

defineProps({
  activeKey: {
    type: String,
    default: '1',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<BasicDetail>({} as BasicDetail);

const getDetailData = async () => {
  const res = await getEstateBasic(routeId.value);
  const data = {
    ...res,
    areaList: [res.provinceCode, res.cityCode, res.areaCode].map(Number),
  };
  detailData.value = data;
};

const district = computed(() => {
  const { provinceName, cityName, areaName } = detailData.value;
  return `${provinceName}/${cityName}/${areaName}`;
});

onMounted(() => {
  if (route.query.id) {
    routeId.value = Number(route.query.id);
    getDetailData();
  }
});
</script>

<template>
  <div class="detail-container basic-info">
    <div class="detail-module">
      <div class="module-title">小区基本信息</div>
      <div class="detail-wrapper">
        <CellItem label="小区名称" :value="detailData.name" />
        <CellItem label="省/市/区" :value="district" />
        <CellItem label="街道" :value="detailData.streetName" />
        <CellItem label="社区" :value="detailData.communityName" />
        <CellItem label="经度" :value="detailData.longitude" />
        <CellItem label="纬度" :value="detailData.latitude" />
        <CellItem label="东至" :value="detailData.eastSide" />
        <CellItem label="西至" :value="detailData.westSide" />
        <CellItem label="南至" :value="detailData.southSide" />
        <CellItem label="北至" :value="detailData.northSide" />
        <CellItem
          label="小区住宅区平面图/规划图"
          :file-list="detailData.planFileList"
          type="file"
        />
      </div>
    </div>

    <div class="detail-module">
      <div class="module-title">党员情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="社区干事总人数"
          :value="detailData.officeMemberNum || 0"
          suffix="人"
        />
        <CellItem
          label="社区干事党员人数"
          :value="detailData.partyMemberNum || 0"
          suffix="人"
        />
      </div>
    </div>

    <div class="detail-module">
      <div class="module-title">总建筑面积/交付时间</div>
      <div class="detail-wrapper">
        <CellItem
          label="总建筑面积"
          :value="detailData.buildAcreage || 0"
          suffix="平米"
        />
        <CellItem
          label="占地面积"
          :value="detailData.coverAcreage || 0"
          suffix="平米"
        />
        <CellItem
          label="交付时间"
          :value="detailData.deliveryTime"
          format="date"
        />
      </div>
    </div>

    <div class="detail-module">
      <div class="module-title">建设单位情况</div>
      <div class="detail-wrapper">
        <CellItem label="建设单位名称" :value="detailData.buildUnit" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
