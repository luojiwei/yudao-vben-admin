<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { FileItem } from '@vben/types';

import type { DeviceCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getDeviceDetail, updateDeviceApi } from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

import ElevatorDeviceList from './ElevatorDeviceList.vue';
import FireDeviceList from './FireDeviceList.vue';
import OtherDeviceList from './OtherDeviceList.vue';

type FormState = DeviceCreate & {
  lotFileList?: FileItem[];
  otherFileList?: FileItem[];
};

const getDefaultForm = (): FormState => {
  return {
    estateId: 0,
    estateName: '',
    id: 0,
    lotCivilAirDefenceNum: null,
    lotFileIds: '',
    lotGroundNum: null,
    lotIsFile: 1,
    lotUndergroundNum: null,
    otherFileIds: '',
    lotFileList: [],
    otherFileList: [],
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
  const data = await getDeviceDetail(estateId.value);
  estateInfo.value.deviceId = data.id;
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

    const data = cloneDeep(formState.value);
    const { lotFileList, otherFileList } = data;

    if (lotFileList && lotFileList.length > 0) {
      data.lotFileIds = lotFileList.map((item) => item.id).join(',');
      delete data.lotFileList;
    }

    if (otherFileList && otherFileList.length > 0) {
      data.otherFileIds = otherFileList.map((item) => item.id).join(',');
      delete data.otherFileList;
    }

    data.estateId = estateId.value;
    await updateDeviceApi(data);
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
  <div class="form-container public-part-and-device">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">停车位情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="地面停车位" name="lotGroundNum">
              <a-input-number
                v-model:value="formState.lotGroundNum"
                :min="0"
                :controls="false"
                placeholder="请输入地面停车位数量"
              >
                <template #addonAfter>个</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地下停车位" name="lotUndergroundNum">
              <a-input-number
                v-model:value="formState.lotUndergroundNum"
                :min="0"
                :controls="false"
                placeholder="请输入地下停车位数量"
              >
                <template #addonAfter>个</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="人防车位数" name="lotCivilAirDefenceNum">
              <a-input-number
                v-model:value="formState.lotCivilAirDefenceNum"
                :min="0"
                :controls="false"
                placeholder="请输入人防车位数数量"
              >
                <template #addonAfter>个</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否有停车位规划图" name="lotIsFile">
              <a-radio-group v-model:value="formState.lotIsFile">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="停车位规划图" name="lotFileList">
              <FileUpload
                v-model:value="formState.lotFileList"
                :show-description="false"
                :max-number="3"
                layout="horizontal"
                return-mode="id-url"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="其他材料" name="otherFileList">
              <FileUpload
                v-model:value="formState.otherFileList"
                :show-description="false"
                :max-number="3"
                layout="horizontal"
                return-mode="id-url"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <ElevatorDeviceList
      v-if="estateId && formState.id"
      :estate-id="estateId"
      :estate-name="estateInfo.estateName"
      :device-id="formState.id"
    />
    <FireDeviceList
      v-if="estateId && formState.id"
      :estate-id="estateId"
      :estate-name="estateInfo.estateName"
      :device-id="formState.id"
    />
    <OtherDeviceList
      v-if="estateId && formState.id"
      :estate-id="estateId"
      :estate-name="estateInfo.estateName"
      :device-id="formState.id"
    />
  </div>
</template>

<style lang="scss" scoped></style>
