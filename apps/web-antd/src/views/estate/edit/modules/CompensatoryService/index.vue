<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { PaidServeCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getPaidServeDetail, updatePaidServeApi } from '#/api/estate';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

type FormState = PaidServeCreate;

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    estateId: 0,
    estateName: '',
    applianceRepairContent: '',
    applianceRepairFee: '',
    childCareContent: '',
    childCareFee: '',
    elderlyCareContent: '',
    elderlyCareFee: '',
    housekeepingContent: '',
    housekeepingFee: '',
    otherPaidServiceContent: '',
    otherPaidServiceFee: '',
    pipeUnclogContent: '',
    pipeUnclogFee: '',
    seniorCanteenContent: '',
    seniorCanteenFee: '',
    weddingServiceContent: '',
    weddingServiceFee: '',
  };
};

const route = useRoute();
const { estateInfo } = storeToRefs(useEstateStore());

const routeId = ref<number>(0);
const loading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formCache = ref<FormState>(getDefaultForm());
const formState = ref<FormState>(getDefaultForm());
const rules = {};

const estateId = computed(() => {
  return routeId.value || estateInfo.value.estateId;
});

const getDetailData = async () => {
  loading.value = true;
  const data = await getPaidServeDetail(estateId.value);
  formCache.value = cloneDeep(data);
  formState.value = cloneDeep(data);
  loading.value = false;
};

const isFormModified = () => {
  return JSON.stringify(formState.value) !== JSON.stringify(formCache.value);
};

const handleSave = async () => {
  if (loading.value) return;
  loading.value = true;
  if (!estateId.value) {
    Modal.confirm({
      title: '提示',
      content: '请先添加小区基本信息，是否前往？',
      okText: '前往',
      okType: 'primary',
      cancelText: '取消',
      onOk: () => {
        emitter.emit('estate:switchTab', '1');
      },
    });
    return;
  }
  try {
    await formRef.value?.validate();
    formState.value.estateId = estateId.value;
    await updatePaidServeApi(formState.value);
    message.success('保存成功');
    await getDetailData();
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
};

defineExpose({
  loading,
  isFormModified,
  handleSave,
});

onMounted(() => {
  if (route.query.id) {
    routeId.value = Number(route.query.id);
  }

  if (estateId.value) {
    getDetailData();
  }

  emitter.on('estate:baseCreate', () => {
    getDetailData();
  });
});

onBeforeUnmount(() => {
  emitter.off('estate:baseCreate');
});
</script>

<template>
  <div class="form-container compensatory-service">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module w-[1000px]">
        <div class="module-title">有偿服务内容</div>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="家政保洁内容" name="housekeepingContent">
              <a-input
                v-model:value="formState.housekeepingContent"
                placeholder="请输入家政保洁内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="家政保洁收费" name="housekeepingFee">
              <a-input
                v-model:value="formState.housekeepingFee"
                placeholder="请输入家政保洁收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="家电维修内容" name="applianceRepairContent">
              <a-input
                v-model:value="formState.applianceRepairContent"
                placeholder="请输入家电维修内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="家电维修收费" name="applianceRepairFee">
              <a-input
                v-model:value="formState.applianceRepairFee"
                placeholder="请输入家电维修收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="疏通管道内容" name="pipeUnclogContent">
              <a-input
                v-model:value="formState.pipeUnclogContent"
                placeholder="请输入疏通管道内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="疏通管道收费" name="pipeUnclogFee">
              <a-input
                v-model:value="formState.pipeUnclogFee"
                placeholder="请输入疏通管道收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="老年食堂内容" name="seniorCanteenContent">
              <a-input
                v-model:value="formState.seniorCanteenContent"
                placeholder="请输入老年食堂内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="老年食堂收费" name="seniorCanteenFee">
              <a-input
                v-model:value="formState.seniorCanteenFee"
                placeholder="请输入老年食堂收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="居家养老护理内容" name="elderlyCareContent">
              <a-input
                v-model:value="formState.elderlyCareContent"
                placeholder="请输入居家养老护理内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="居家养老护理收费" name="elderlyCareFee">
              <a-input
                v-model:value="formState.elderlyCareFee"
                placeholder="请输入居家养老护理收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="儿童托管内容" name="childCareContent">
              <a-input
                v-model:value="formState.childCareContent"
                placeholder="请输入儿童托管内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="儿童托管收费" name="childCareFee">
              <a-input
                v-model:value="formState.childCareFee"
                placeholder="请输入儿童托管收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="婚礼服务内容" name="weddingServiceContent">
              <a-input
                v-model:value="formState.weddingServiceContent"
                placeholder="请输入婚礼服务内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="婚礼服务收费" name="weddingServiceFee">
              <a-input
                v-model:value="formState.weddingServiceFee"
                placeholder="请输入婚礼服务收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="其他有偿服务内容"
              name="otherPaidServiceContent"
            >
              <a-input
                v-model:value="formState.otherPaidServiceContent"
                placeholder="请输入其他有偿服务内容"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="其他有偿服务收费" name="otherPaidServiceFee">
              <a-input
                v-model:value="formState.otherPaidServiceFee"
                placeholder="请输入其他有偿服务收费"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
