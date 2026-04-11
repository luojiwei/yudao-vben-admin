<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/es/form';

import type { AfficheCreate } from '#/api/estate';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { cloneDeep } from '@vben/utils';

import { message, Modal } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { getAfficheDetail, updateAfficheApi } from '#/api/estate';
import { useEstateStore } from '#/store';
import emitter from '#/utils/bus';

import PublicCompanyList from './PublicCompanyList.vue';
import PublicRuleList from './PublicRuleList.vue';
import PublicServeList from './PublicServeList.vue';

type FormState = AfficheCreate;

const getDefaultForm = (): FormState => {
  return {
    id: 0,
    estateId: 0,
    estateName: '',
    isFillout: 1,
    isOwner: 1,
    isCompany: 1,
    isServe: 1,
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
  const data = await getAfficheDetail(estateId.value);
  estateInfo.value.afficheId = data.id;
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
    await updateAfficheApi(formState.value);
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
  <div class="form-container public-info-and-complaint">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="form-module">
        <div class="module-title">信息公开与投诉填报情况</div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="是否存在公共收益资金" name="isFillout">
              <a-radio-group
                v-model:value="formState.isFillout"
                :options="
                  getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                "
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <template v-if="formState.isFillout === 1">
        <div class="form-module">
          <div class="module-title">业主大会管理规约、议事规则公开公示情况</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                label="是否有业主大会管理规约、议事规则公开公示情况表"
                name="isOwner"
              >
                <a-radio-group
                  v-model:value="formState.isOwner"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                />
              </a-form-item>
            </a-col>
          </a-row>
          <PublicRuleList
            v-if="formState.id && formState.isOwner === 1"
            :estate-id="estateId"
            :estate-name="estateInfo.estateName"
            :affiche-id="formState.id"
          />
        </div>
        <div class="form-module">
          <div class="module-title">物业企业公示情况</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="是否有物业企业公示情况表" name="isCompany">
                <a-radio-group
                  v-model:value="formState.isCompany"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                />
              </a-form-item>
            </a-col>
          </a-row>
          <PublicCompanyList
            v-if="formState.id && formState.isCompany === 1"
            :estate-id="estateId"
            :estate-name="estateInfo.estateName"
            :affiche-id="formState.id"
          />
        </div>
        <div class="form-module">
          <div class="module-title">物业服务公示情况</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="是否有物业服务公示情况表" name="isServe">
                <a-radio-group
                  v-model:value="formState.isServe"
                  :options="
                    getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number')
                  "
                />
              </a-form-item>
            </a-col>
          </a-row>
          <PublicServeList
            v-if="formState.id && formState.isServe === 1"
            :estate-id="estateId"
            :estate-name="estateInfo.estateName"
            :affiche-id="formState.id"
          />
        </div>
      </template>
    </a-form>
  </div>
</template>

<style lang="scss" scoped></style>
