<script lang="ts" setup>
import type { FileItem } from '@vben/types';

import type { BenefitDeviceCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createBenefitDevice,
  getBenefitDeviceDetail,
  updateBenefitDevice,
} from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { $t } from '#/locales';

type FormState = {
  contractFileList?: FileItem[]; // 合同文件列表
} & BenefitDeviceCreate;

const emit = defineEmits(['success']);
const formData = ref<FormState>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['添加公共设施'])
    : $t('ui.actionTitle.create', ['添加公共设施']);
});

const contractFileList = ref<FileItem[]>([]);
const handleChange = () => {
  formApi.setFieldValue(
    'contractFileIds',
    contractFileList.value.map((item) => item.id).join(','),
  );
  formApi.setFieldValue('contractFileList', contractFileList.value);
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-1',
    labelWidth: 80,
  },
  layout: 'vertical',
  wrapperClass: 'grid-cols-2',
  schema: [
    {
      fieldName: 'id',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'estateId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'benefitId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'deviceType',
      label: '设施类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_BENEFIT_DEVICE_TYPE, 'number'),
      },
    },
    {
      fieldName: 'num',
      label: '设施数量',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        placeholder: '请输入设施数量',
      },
    },
    {
      fieldName: 'fee',
      label: '收费标准',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        controls: false,
        placeholder: '请输入收费标准',
        addonAfter: '元/月',
      },
    },
    {
      fieldName: 'contractFileList',
      label: '合同文件',
      component: 'Input',
    },
    {
      fieldName: 'mark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as FormState;
    try {
      await (formData.value?.id
        ? updateBenefitDevice(data)
        : createBenefitDevice(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<FormState>();
    if (!data || !data.id) {
      formApi.setValues(data);
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getBenefitDeviceDetail(data.id);
      contractFileList.value = formData.value.contractFileList || [];
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[800px]">
    <Form class="mx-4">
      <template #contractFileList>
        <FileUpload
          v-model:value="contractFileList"
          :show-description="false"
          :max-number="1"
          layout="horizontal"
          return-mode="id-url"
          @change="handleChange"
        />
      </template>
    </Form>
  </Modal>
</template>
