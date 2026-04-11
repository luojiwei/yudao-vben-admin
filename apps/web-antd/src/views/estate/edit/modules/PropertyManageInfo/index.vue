<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { PropertyCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getPropertyDetail, updatePropertyApi } from '#/api/estate';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

import PropertyStaffList from './PropertyStaffList.vue';
import PropertySupervisorList from './PropertySupervisorList.vue';

type FormState = PropertyCreate;

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    estateId: 0,
    estateName: '',
    accountName: '',
    bankCardNumber: '',
    bankName: '',
    companyName: '',
    creditCode: '',
    idCard: '',
    isEpiboly: 0,
    legalEntity: '',
    money: null,
    serveCostType: null,
    situationId: null,
    type: null,
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
  const data = await getPropertyDetail(estateId.value);
  estateInfo.value.manageId = data.id;
  estateInfo.value.estateName = data.estateName;
  data.type = data.type === 0 ? null : data.type;
  data.situationId = data.situationId === 0 ? null : data.situationId;
  data.serveCostType = data.serveCostType === 0 ? null : data.serveCostType;
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
    await updatePropertyApi(formState.value);
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
  <div class="form-container property-manage-info">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">物业所属情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="物业所属阶段" name="situationId">
              <a-select
                v-model:value="formState.situationId"
                placeholder="请选择物业所属阶段"
                :options="
                  getDictOptions(DICT_TYPE.ESTATE_PROPERTY_STAGE, 'number')
                "
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="form-module">
        <div class="module-title">物业服务情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="是否外包" name="isEpiboly">
              <a-radio-group
                v-model:value="formState.isEpiboly"
                :options="
                  getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                "
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="form-module">
        <div class="module-title">物业基本信息</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="物业企业名称" name="companyName">
              <a-input
                v-model:value="formState.companyName"
                placeholder="请输入物业企业名称"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="统一社会信用代号" name="creditCode">
              <a-input
                v-model:value="formState.creditCode"
                placeholder="请输入统一社会信用代号"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法定代表人" name="legalEntity">
              <a-input
                v-model:value="formState.legalEntity"
                placeholder="请输入法定代表人"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法人身份证号" name="idCard">
              <a-input
                v-model:value="formState.idCard"
                placeholder="请输入法人身份证号"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="公司账户名称" name="accountName">
              <a-input
                v-model:value="formState.accountName"
                placeholder="请输入公司账户名称"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="开户银行" name="bankName">
              <a-input
                v-model:value="formState.bankName"
                placeholder="请输入开户银行"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="银行卡号" name="bankCardNumber">
              <a-input
                v-model:value="formState.bankCardNumber"
                placeholder="请输入银行卡号"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物业类型" name="type">
              <a-select
                v-model:value="formState.type"
                placeholder="请选择物业类型"
                :options="
                  getDictOptions(DICT_TYPE.ESTATE_PROPERTY_TYPE, 'number')
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物业计费方式" name="serveCostType">
              <a-select
                v-model:value="formState.serveCostType"
                placeholder="请选择物业计费方式"
                :options="
                  getDictOptions(
                    DICT_TYPE.ESTATE_PROPERTY_CHARGE_MODE,
                    'number',
                  )
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="物业费用" name="money">
              <a-input
                v-model:value="formState.money"
                placeholder="请输入物业费用"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <PropertySupervisorList
      v-if="estateId && formState.id"
      :estate-id="estateId"
      :estate-name="estateInfo.estateName"
      :manage-id="formState.id"
    />
    <PropertyStaffList
      v-if="estateId && formState.id"
      :estate-id="estateId"
      :estate-name="estateInfo.estateName"
      :manage-id="formState.id"
    />
  </div>
</template>

<style lang="scss" scoped></style>
