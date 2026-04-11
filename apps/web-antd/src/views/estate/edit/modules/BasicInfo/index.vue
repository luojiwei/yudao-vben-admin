<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { FileItem, SelectItem, TreeNode } from '@vben/types';

import type { BasicCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { cloneDeep } from '@vben/utils';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';

import {
  createEstateBasic,
  getEstateBasic,
  updateEstateBasic,
} from '#/api/estate';
import { getSimpleCommunityList } from '#/api/select/community';
import { getSimpleStreetList } from '#/api/select/street';
import { getAreaTree as getAreaTreeApi } from '#/api/system/area';
import FileUpload from '#/components/upload/file-upload.vue';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';
import { validateLatitude, validateLongitude } from '#/utils/validate';

type FormState = BasicCreate & {
  areaList?: number[];
  planFileList?: FileItem[];
};

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    name: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    areaCode: '',
    areaName: '',
    streetId: null,
    streetName: '',
    communityId: null,
    communityName: '',
    longitude: '',
    latitude: '',
    eastSide: '',
    westSide: '',
    southSide: '',
    northSide: '',
    planFileIds: '',
    officeMemberNum: null,
    partyMemberNum: null,
    coverAcreage: null,
    buildAcreage: null,
    deliveryTime: null,
    companyName: '',
    buildUnit: '',
    areaList: [360_000, 360_100, 360_103], // 默认江西省南昌市西湖区
    planFileList: [],
  };
};

const route = useRoute();
const { estateInfo } = storeToRefs(useEstateStore());

const routeId = ref<number>(0);
const loading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formCache = ref<FormState>(getDefaultForm());
const formState = ref<FormState>(getDefaultForm());
const rules = {
  name: [{ required: true, message: '请输入小区名称' }],
  areaList: [{ required: true, message: '请选择省/市/区' }],
  streetId: [{ required: true, message: '请选择街道' }],
  communityId: [{ required: true, message: '请选择社区' }],
  longitude: [{ required: true, validator: validateLongitude }],
  latitude: [{ required: true, validator: validateLatitude }],
  eastSide: [{ required: true, message: '请输入东至' }],
  westSide: [{ required: true, message: '请输入西至' }],
  southSide: [{ required: true, message: '请输入南至' }],
  northSide: [{ required: true, message: '请输入北至' }],
  planFileList: [{ required: true, message: '请上传小区住宅区平面图/规划图' }],
  officeMemberNum: [{ required: true, message: '请输入社区干事总人数' }],
  partyMemberNum: [{ required: true, message: '请输入社区干事党员人数' }],
  buildAcreage: [{ required: true, message: '请输入总建筑面积' }],
  coverAcreage: [{ required: true, message: '请输入占地面积' }],
  deliveryTime: [{ required: true, message: '请输入交付时间' }],
  buildUnit: [{ required: true, message: '请输入建设单位名称' }],
};
const areaTree = ref<TreeNode[]>([]);
const streeList = ref<SelectItem[]>([]);
const communityList = ref<SelectItem[]>([]);

const estateId = computed(() => {
  return routeId.value || estateInfo.value.estateId;
});

const getDetailData = async () => {
  loading.value = true;
  const res = await getEstateBasic(estateId.value);
  const data = {
    ...res,
    deliveryTime: dayjs(res.deliveryTime),
    areaList: [res.provinceCode, res.cityCode, res.areaCode].map(Number),
  };
  estateInfo.value.estateId = data.id;
  formCache.value = cloneDeep(data);
  formState.value = cloneDeep(data);
  loading.value = false;
};

const getAreaTree = async () => {
  const data = await getAreaTreeApi();
  areaTree.value = data as TreeNode[];
};

const getStreetList = async () => {
  const data = await getSimpleStreetList();
  streeList.value = data as SelectItem[];
};

const getCommunityList = async () => {
  const data = await getSimpleCommunityList(formState.value.streetId!);
  communityList.value = data as SelectItem[];
};

const handleStreetChange = async () => {
  formState.value.communityId = null;
  await getCommunityList();
};

const isFormModified = () => {
  return JSON.stringify(formState.value) !== JSON.stringify(formCache.value);
};

const handleSave = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    await formRef?.value?.validate();

    const data = cloneDeep(formState.value);
    const { areaList, planFileList, deliveryTime } = data;
    data.deliveryTime = deliveryTime?.valueOf()!;

    if (areaList && areaList.length === 3) {
      data.provinceCode = (areaList[0] || 0).toString();
      data.cityCode = (areaList[1] || 0).toString();
      data.areaCode = (areaList[2] || 0).toString();

      const province = areaTree.value.find((item) => item.id === areaList[0]);
      data.provinceName = province?.name || '';

      const city = (province?.children || []).find(
        (item) => item.id === areaList[1],
      );
      data.cityName = city?.name || '';

      const area = (city?.children || []).find(
        (item) => item.id === areaList[2],
      );
      data.areaName = area?.name || '';

      data.areaList = undefined;
    }

    if (planFileList && planFileList.length > 0) {
      data.planFileIds = planFileList.map((item) => item.id).join(',');
      data.planFileList = undefined;
    }
    const Api = estateId.value ? updateEstateBasic : createEstateBasic;
    const id = await Api(data);
    if (!estateId.value && typeof id === 'number') {
      estateInfo.value.estateId = id;
      estateInfo.value.estateName = data.name;
      emitter.emit('estate:baseCreate', id);
    }
    message.success('保存成功');
    await getDetailData();
    loading.value = false;
  } catch (error: any) {
    loading.value = false;
    if (error.errorFields && error.errorFields.length > 0) {
      message.error('请完整填写小区基本信息');
    }
  }
};

const handleChange = () => {
  formRef?.value?.validateFields('planFileList');
};

defineExpose({
  loading,
  isFormModified,
  handleSave,
});

onMounted(() => {
  if (route.query.id) {
    routeId.value = Number(route.query.id);
    getDetailData();
  }

  getAreaTree();
  getStreetList();
  getCommunityList();
});

onBeforeUnmount(() => {
  emitter.off('estate:baseCreate');
});
</script>

<template>
  <div class="form-container basic-info">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">小区基本信息</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="小区名称" name="name">
              <a-input
                v-model:value="formState.name"
                allow-clear
                placeholder="请输入小区名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="省/市/区" name="areaList">
              <a-cascader
                v-model:value="formState.areaList"
                :options="areaTree"
                :field-names="{ label: 'name', value: 'id' }"
                placeholder="请选择省/市/区"
                show-search
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="街道" name="streetId">
              <a-select
                v-model:value="formState.streetId"
                :options="streeList"
                :field-names="{ label: 'name', value: 'id' }"
                allow-clear
                show-search
                placeholder="请选择街道"
                @change="handleStreetChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="社区" name="communityId">
              <a-select
                v-model:value="formState.communityId"
                :options="communityList"
                :field-names="{ label: 'name', value: 'id' }"
                :disabled="!formState.streetId"
                allow-clear
                show-search
                placeholder="请选择社区"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="经度" name="longitude">
              <a-input-number
                v-model:value="formState.longitude"
                :min="0"
                :controls="false"
                placeholder="请输入经度"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纬度" name="latitude">
              <a-input-number
                v-model:value="formState.latitude"
                :min="0"
                :controls="false"
                placeholder="请输入纬度"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="东至" name="eastSide">
              <a-input
                v-model:value="formState.eastSide"
                allow-clear
                placeholder="请输入东至"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="西至" name="westSide">
              <a-input
                v-model:value="formState.westSide"
                allow-clear
                placeholder="请输入西至"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="南至" name="southSide">
              <a-input
                v-model:value="formState.southSide"
                allow-clear
                placeholder="请输入南至"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="北至" name="northSide">
              <a-input
                v-model:value="formState.northSide"
                allow-clear
                placeholder="请输入北至"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="小区住宅区平面图/规划图" name="planFileList">
              <FileUpload
                v-model:value="formState.planFileList"
                :show-description="false"
                :max-number="3"
                multiple
                layout="horizontal"
                return-mode="id-url"
                @change="handleChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="form-module">
        <div class="module-title">党员情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="社区干事总人数" name="officeMemberNum">
              <a-input-number
                v-model:value="formState.officeMemberNum"
                :min="0"
                :controls="false"
                placeholder="请输入社区干事总人数"
              >
                <template #addonAfter>人</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="社区干事党员人数" name="partyMemberNum">
              <a-input-number
                v-model:value="formState.partyMemberNum"
                :min="0"
                :controls="false"
                placeholder="请输入社区干事党员人数"
              >
                <template #addonAfter>人</template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="form-module">
        <div class="module-title">总建筑面积/交付时间</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="总建筑面积" name="buildAcreage">
              <a-input-number
                v-model:value="formState.buildAcreage"
                :min="0"
                :controls="false"
                placeholder="请输入总建筑面积"
              >
                <template #addonAfter>平米</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="占地面积" name="coverAcreage">
              <a-input-number
                v-model:value="formState.coverAcreage"
                :min="0"
                :controls="false"
                placeholder="请输入占地面积"
              >
                <template #addonAfter>平米</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="交付时间" name="deliveryTime">
              <a-date-picker
                v-model:value="formState.deliveryTime"
                type="date"
                allow-clear
                placeholder="请选择交付时间"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="form-module">
        <div class="module-title">建设单位情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="建设单位名称" name="buildUnit">
              <a-input
                v-model:value="formState.buildUnit"
                allow-clear
                placeholder="请输入建设单位名称"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
