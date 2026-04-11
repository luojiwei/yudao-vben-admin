<script lang="ts" setup>
import type { DeviceFacilityCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createDeviceFacility,
  getDeviceFacility,
  updateDeviceFacility,
} from '#/api/estate';
import { $t } from '#/locales';

const emit = defineEmits(['success']);
const formData = ref<DeviceFacilityCreate>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['电梯设备'])
    : $t('ui.actionTitle.create', ['电梯设备']);
});

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
      fieldName: 'deviceId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'type',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '设备名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
      },
    },
    {
      fieldName: 'number',
      label: '设备数量',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        placeholder: '请输入设备数量',
      },
    },
    {
      fieldName: 'address',
      label: '电梯位置(楼栋)',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电梯位置',
      },
    },
    {
      fieldName: 'manufacturer',
      label: '制造单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入制造单位',
      },
    },
    {
      fieldName: 'useYear',
      label: '投入使用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择投入使用时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'maintUnit',
      label: '维保单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入维保单位',
      },
    },
    {
      fieldName: 'maintName',
      label: '维保人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入维保人员',
      },
    },
    {
      fieldName: 'maintPhone',
      label: '维保人员电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入维保人员电话',
        maxLength: 11,
        type: 'number',
      },
    },
    {
      fieldName: 'realEstateName',
      label: '物业联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物业联系人',
      },
    },
    {
      fieldName: 'realEstatePhone',
      label: '物业联系人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物业联系人电话',
        maxLength: 11,
        type: 'number',
      },
    },
    {
      fieldName: 'safetyManageName',
      label: '安全管理人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全管理人员',
      },
    },
    {
      fieldName: 'safetyManagePhone',
      label: '安全管理人电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安全管理人电话',
        maxLength: 11,
        type: 'number',
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
    const data = (await formApi.getValues()) as DeviceFacilityCreate;
    try {
      await (formData.value?.id
        ? updateDeviceFacility(data)
        : createDeviceFacility(data));
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
    const data = modalApi.getData<DeviceFacilityCreate>();
    if (!data || !data.id) {
      formApi.setValues(data);
      return;
    }
    modalApi.lock();
    try {
      const res = await getDeviceFacility(data.id);
      formData.value = {
        ...res,
        useYear: dayjs(res.useYear),
      };
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
    <Form class="mx-4" />
  </Modal>
</template>
