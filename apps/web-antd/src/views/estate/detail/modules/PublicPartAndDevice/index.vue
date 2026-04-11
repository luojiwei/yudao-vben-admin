<script lang="ts" setup>
import type { DeviceDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';

import { getDeviceDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';
import ElevatorDeviceList from '#/views/estate/edit/modules/PublicPartAndDevice/ElevatorDeviceList.vue';
import FireDeviceList from '#/views/estate/edit/modules/PublicPartAndDevice/FireDeviceList.vue';
import OtherDeviceList from '#/views/estate/edit/modules/PublicPartAndDevice/OtherDeviceList.vue';

defineProps({
  activeKey: {
    type: String,
    default: '2',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<DeviceDetail>({} as DeviceDetail);

const getDetailData = async () => {
  const data = await getDeviceDetail(routeId.value);
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
  <div v-if="detailData.id" class="detail-container public-part-and-device">
    <div class="detail-module">
      <div class="module-title">停车位情况</div>
      <div class="detail-wrapper">
        <CellItem
          label="地面停车位数"
          :value="detailData.lotGroundNum || 0"
          suffix="个"
        />
        <CellItem
          label="地下停车位数"
          :value="detailData.lotUndergroundNum || 0"
          suffix="个"
        />
        <CellItem
          label="人防车位数"
          :value="detailData.lotCivilAirDefenceNum || 0"
          suffix="个"
        />
        <CellItem
          label="是否有停车位规划图"
          :value="detailData.lotIsFile"
          type="dictLabel"
          :dict-type="DICT_TYPE.INFRA_BOOLEAN_NUMBER"
        />
        <CellItem
          v-if="detailData.lotIsFile === 1"
          label="停车位规划图"
          :file-list="detailData.lotFileList"
          type="file"
        />
        <CellItem
          label="其他材料"
          :file-list="detailData.otherFileList"
          type="file"
        />
      </div>
    </div>

    <ElevatorDeviceList
      :estate-id="detailData.estateId"
      :estate-name="detailData.estateName"
      :device-id="detailData.id"
      from-type="detail"
    />
    <FireDeviceList
      :estate-id="detailData.estateId"
      :estate-name="detailData.estateName"
      :device-id="detailData.id"
      from-type="detail"
    />
    <OtherDeviceList
      :estate-id="detailData.estateId"
      :estate-name="detailData.estateName"
      :device-id="detailData.id"
      from-type="detail"
    />
  </div>
</template>

<style lang="scss" scoped></style>
