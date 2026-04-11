<script lang="ts" setup>
import type { DeviceFacilityCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

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
    ? $t('ui.actionTitle.edit', ['消防设备'])
    : $t('ui.actionTitle.create', ['消防设备']);
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
      label: '安装位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入安装位置',
      },
    },
    {
      fieldName: 'deviceType',
      label: '设备类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_DEVICE_FIRE_TYPE, 'number'),
      },
    },
    {
      fieldName: 'deviceModel',
      label: '型号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入型号',
      },
    },
    {
      fieldName: 'manufacturer',
      label: '生产厂家',
      component: 'Input',
      componentProps: {
        placeholder: '请输入生产厂家',
      },
    },
    {
      fieldName: 'leaveTime',
      label: '出厂日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择出厂日期',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'installTime',
      label: '安装日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择安装日期',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'useStatus',
      label: '使用状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_DEVICE_USE_STATUS, 'number'),
      },
    },
    {
      fieldName: 'maintIntervals',
      label: '维护周期',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 1,
        controls: false,
        placeholder: '请输入维护周期',
        addonAfter: '月',
      },
    },
    {
      fieldName: 'lastMaintDay',
      label: '最近维护周期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择最近维护周期',
        valueFormat: 'x',
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
      },
    },
    {
      fieldName: 'maintContent',
      label: '维保内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入维保内容',
      },
    },
    {
      fieldName: 'nextMaintDay',
      label: '下次维保日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择下次维保日期',
        valueFormat: 'x',
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
    // 转换时间戳
    data.leaveTime = Number(data.leaveTime);
    data.installTime = Number(data.installTime);
    data.lastMaintDay = Number(data.lastMaintDay);
    data.nextMaintDay = Number(data.nextMaintDay);
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
        leaveTime: dayjs(res.leaveTime),
        installTime: dayjs(res.installTime),
        lastMaintDay: dayjs(res.lastMaintDay),
        nextMaintDay: dayjs(res.nextMaintDay),
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
