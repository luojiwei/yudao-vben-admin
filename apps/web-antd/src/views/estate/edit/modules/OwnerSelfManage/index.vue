<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { AutonomyCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getAutonomyDetail, updateAutonomyApi } from '#/api/estate';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

type FormState = AutonomyCreate;

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    estateId: 0,
    estateName: '',
    status: 1,
    type: 1,
    autonomyType: null,
    isOpenAccount: 1,
    accountNo: '',
    openMember: '',
    openBank: '',
    openPhone: '',
    manageName: '',
    managePhone: '',
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
  const data = await getAutonomyDetail(estateId.value);
  data.type = data.type === 0 ? null : data.type;
  data.autonomyType = data.autonomyType === 0 ? null : data.autonomyType;
  formCache.value = cloneDeep(data);
  formState.value = cloneDeep(data);
  loading.value = false;
};

const handleStatusChange = () => {
  const { id, status } = formState.value;
  if (status === 3) {
    formState.value = {
      ...getDefaultForm(),
      id,
      status,
    };
  }
};

const handleTypeChange = () => {
  const { id, status, type } = formState.value;
  if (type === 2) {
    formState.value = {
      ...getDefaultForm(),
      id,
      status,
      type,
    };
  }
};

const handleIsAccountChange = () => {
  const { id, status, type, isOpenAccount } = formState.value;
  if (isOpenAccount === 1) {
    formState.value = {
      ...getDefaultForm(),
      id,
      status,
      type,
      isOpenAccount,
    };
  }
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
    await updateAutonomyApi(formState.value);
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
  <div class="form-container owner-self-manage">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">业主自治情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="业委会组建情况" name="status">
              <a-radio-group
                v-model:value="formState.status"
                :options="
                  getDictOptions(
                    DICT_TYPE.ESTATE_OWNERERS_COMMITTEE_STATUS,
                    'number',
                  )
                "
                @change="handleStatusChange"
              />
            </a-form-item>
          </a-col>
          <template v-if="formState.status && formState.status === 1">
            <a-col :span="8">
              <a-form-item label="业主委员会/物管会成立" name="type">
                <a-select
                  v-model:value="formState.type"
                  placeholder="请选择成立类型"
                  :options="
                    getDictOptions(
                      DICT_TYPE.ESTATE_OWNERERS_COMMITTEE_TYPE,
                      'number',
                    )
                  "
                  @change="handleTypeChange"
                />
              </a-form-item>
            </a-col>
            <template v-if="formState.type === 1">
              <a-col :span="8">
                <a-form-item label="业主自治类型" name="autonomyType">
                  <a-select
                    v-model:value="formState.autonomyType"
                    placeholder="请选择自治类型"
                    :options="
                      getDictOptions(
                        DICT_TYPE.ESTATE_OWNERERS_AUTONOMOUS_TYPE,
                        'number',
                      )
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="业委会账户开立" name="isOpenAccount">
                  <a-radio-group
                    v-model:value="formState.isOpenAccount"
                    :options="
                      getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                    "
                    @change="handleIsAccountChange"
                  />
                </a-form-item>
              </a-col>
              <template v-if="formState.isOpenAccount === 1">
                <a-col :span="8">
                  <a-form-item label="账户号" name="accountNo">
                    <a-input
                      v-model:value="formState.accountNo"
                      placeholder="请输入账户号"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="开户人" name="openMember">
                    <a-input
                      v-model:value="formState.openMember"
                      placeholder="请输入开户人"
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
                  <a-form-item label="开户人手机号" name="openPhone">
                    <a-input
                      v-model:value="formState.openPhone"
                      placeholder="请输入开户人手机号"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="业委会负责人" name="manageName">
                    <a-input
                      v-model:value="formState.manageName"
                      placeholder="请输入业委会负责人"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="负责人手机号" name="managePhone">
                    <a-input
                      v-model:value="formState.managePhone"
                      placeholder="请输入负责人手机号"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </template>
            </template>
          </template>
        </a-row>
      </div>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
