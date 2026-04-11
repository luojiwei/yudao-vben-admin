<script lang="ts" setup>
import type { PaidServeDetail } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getPaidServeDetail } from '#/api/estate';
import CellItem from '#/components/detail-module/cell-item.vue';

defineProps({
  activeKey: {
    type: String,
    default: '7',
  },
});

const route = useRoute();

const routeId = ref<number>(0);
const detailData = ref<PaidServeDetail>({} as PaidServeDetail);

const getDetailData = async () => {
  const data = await getPaidServeDetail(routeId.value);
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
  <div class="detail-container compensatory-service">
    <div class="detail-module">
      <div class="module-title">有偿服务内容</div>
      <div class="detail-wrapper w-[1000px] grid-cols-2">
        <CellItem
          label="家政保洁内容"
          :value="detailData.housekeepingContent"
        />
        <CellItem label="家政保洁收费" :value="detailData.housekeepingFee" />
        <CellItem
          label="家电维修内容"
          :value="detailData.applianceRepairContent"
        />
        <CellItem label="家电维修收费" :value="detailData.applianceRepairFee" />
        <CellItem label="疏通管道内容" :value="detailData.pipeUnclogContent" />
        <CellItem label="疏通管道收费" :value="detailData.pipeUnclogFee" />
        <CellItem
          label="老年食堂内容"
          :value="detailData.seniorCanteenContent"
        />
        <CellItem label="老年食堂收费" :value="detailData.seniorCanteenFee" />
        <CellItem
          label="居家养老护理内容"
          :value="detailData.elderlyCareContent"
        />
        <CellItem label="居家养老护理收费" :value="detailData.elderlyCareFee" />
        <CellItem label="儿童托管内容" :value="detailData.childCareContent" />
        <CellItem label="儿童托管收费" :value="detailData.childCareFee" />
        <CellItem
          label="婚礼服务内容"
          :value="detailData.weddingServiceContent"
        />
        <CellItem label="婚礼服务收费" :value="detailData.weddingServiceFee" />
        <CellItem
          label="其他有偿服务内容"
          :value="detailData.otherPaidServiceContent"
        />
        <CellItem
          label="其他有偿服务收费"
          :value="detailData.otherPaidServiceFee"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
