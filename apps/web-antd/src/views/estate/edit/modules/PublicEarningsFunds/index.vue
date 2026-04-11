<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { FileItem } from '@vben/types';

import type { BenefitCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getBenefitDetail, updateBenefitApi } from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

import PublicBenefitList from './PublicBenefitList.vue';
import PublicDeviceList from './PublicDeviceList.vue';

type FormState = {
  contractFileList?: FileItem[]; // 合同文件列表
} & BenefitCreate;

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    estateId: 0,
    estateName: '',
    isExistBenefit: 1,
    preserveType: null,
    accountName: '',
    openBank: '',
    bankNo: '',
    accountType: null,
    manageIdentity: '',
    manageName: '',
    managePhone: '',
    isAloneAccount: 1,
    isAloneBill: 1,
    groundNum: null,
    groundFee: null,
    contractFileIds: '',
    isCommonIncome: 1,
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
  const data = await getBenefitDetail(estateId.value);
  estateInfo.value.benefitId = data.id;
  data.preserveType = data.preserveType === 0 ? null : data.preserveType;
  data.accountType = data.accountType === 0 ? null : data.accountType;
  formCache.value = cloneDeep(data);
  formState.value = cloneDeep(data);
  loading.value = false;
};

const handleExistBenefitChange = () => {};

const handleCommonIncomeChange = () => {};

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
    const { contractFileList } = data;

    if (contractFileList && contractFileList.length > 0) {
      data.contractFileIds = contractFileList.map((item) => item.id).join(',');
      delete data.contractFileList;
    }

    data.estateId = estateId.value;
    await updateBenefitApi(data);
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
  <div class="form-container public-earn-funds">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">公共收益资金情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="是否存在公共收益资金" name="isExistBenefit">
              <a-radio-group
                v-model:value="formState.isExistBenefit"
                :options="
                  getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                "
                @change="handleExistBenefitChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <template v-if="formState.isExistBenefit === 1">
        <div class="form-module">
          <div class="module-title">公共收益账户</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="公共收益存放位置" name="preserveType">
                <a-select
                  v-model:value="formState.preserveType"
                  placeholder="请选择公共收益存放位置"
                  :options="
                    getDictOptions(
                      DICT_TYPE.ESTATE_BENEFIT_DEPOSIT_TYPE,
                      'number',
                    )
                  "
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="是否单独账户" name="isAloneAccount">
                <a-radio-group
                  v-model:value="formState.isAloneAccount"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="是否单独列账" name="isAloneBill">
                <a-radio-group
                  v-model:value="formState.isAloneBill"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="账户名称" name="accountName">
                <a-input
                  v-model:value="formState.accountName"
                  placeholder="请输入账户名称"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="开户银行" name="openBank">
                <a-input
                  v-model:value="formState.openBank"
                  placeholder="请输入开户银行"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="银行账号" name="bankNo">
                <a-input
                  v-model:value="formState.bankNo"
                  placeholder="请输入银行账号"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="账户类型" name="accountType">
                <a-select
                  v-model:value="formState.accountType"
                  placeholder="请选择账户类型"
                  :options="
                    getDictOptions(
                      DICT_TYPE.ESTATE_BENEFIT_ACCOUNT_TYPE,
                      'number',
                    )
                  "
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="资金管理人身份" name="manageIdentity">
                <a-input
                  v-model:value="formState.manageIdentity"
                  placeholder="请输入资金管理人身份"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="资金管理人姓名" name="manageName">
                <a-input
                  v-model:value="formState.manageName"
                  placeholder="请输入资金管理人姓名"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="资金管理人手机号" name="managePhone">
                <a-input
                  v-model:value="formState.managePhone"
                  placeholder="请输入资金管理人手机号"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="form-module">
          <div class="module-title">公共区域经营设施</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="地面停车位数" name="groundNum">
                <a-input-number
                  v-model:value="formState.groundNum"
                  :min="0"
                  :controls="false"
                  placeholder="请输入地面停车位数"
                >
                  <template #addonAfter>个</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="地面停车位收费标准" name="groundFee">
                <a-input-number
                  v-model:value="formState.groundFee"
                  :min="0"
                  :controls="false"
                  placeholder="请输入地面停车位收费标准"
                >
                  <template #addonAfter>元/月</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="合同附件" name="contractFileList">
                <FileUpload
                  v-model:value="formState.contractFileList"
                  :show-description="false"
                  :max-number="3"
                  layout="horizontal"
                  return-mode="id-url"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <PublicDeviceList
            v-if="formState.id"
            :estate-id="estateId"
            :estate-name="estateInfo.estateName"
            :benefit-id="formState.id"
          />
        </div>
        <div class="form-module">
          <div class="module-title">小区共管收益</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="是否有小区共管收益" name="isCommonIncome">
                <a-radio-group
                  v-model:value="formState.isCommonIncome"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                  @change="handleCommonIncomeChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <PublicBenefitList
            v-if="formState.id && formState.isCommonIncome === 1"
            :estate-id="estateId"
            :estate-name="estateInfo.estateName"
            :benefit-id="formState.id"
          />
        </div>
      </template>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
