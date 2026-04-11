<script lang="ts" setup>
import type { PropertyStaffCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createPropertyStaff,
  getPropertyStaffDetail,
  updatePropertyStaff,
} from '#/api/estate';
import { $t } from '#/locales';

type FormState = PropertyStaffCreate & {
  contractDateRange?: [dayjs.Dayjs | number, dayjs.Dayjs | number];
};

const emit = defineEmits(['success']);
const formData = ref<FormState>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['保安、保洁人员'])
    : $t('ui.actionTitle.create', ['保安、保洁人员']);
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
      fieldName: 'manageId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      fieldName: 'sex',
      label: '性别',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_USER_SEX, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 1,
    },
    {
      fieldName: 'idCard',
      label: '身份证号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入身份证号',
      },
    },
    {
      fieldName: 'positionId',
      label: '岗位类别',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_POSITION_TYPE, 'number'),
      },
    },
    {
      fieldName: 'itemName',
      label: '所属项目',
      component: 'Input',
      componentProps: {
        placeholder: '由系统带出',
        disabled: true,
      },
    },
    {
      fieldName: 'hiredate',
      label: '入职时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入职时间',
      },
    },
    {
      fieldName: 'contractType',
      label: '合同类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_CONTRACT_TYPE, 'number'),
      },
    },
    {
      fieldName: 'contractDateRange',
      label: '合同起止日期',
      component: 'RangePicker',
      componentProps: {
        placeholder: [
          $t('utils.rangePicker.beginTime'),
          $t('utils.rangePicker.endTime'),
        ],
        allowClear: true,
      },
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
    },
    {
      fieldName: 'isPoliceReport',
      label: '是否备案',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_NUMBER, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 1,
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
    data.hiredate = dayjs(data.hiredate).valueOf();
    if (data.contractDateRange && data.contractDateRange.length > 0) {
      data.contractStart = dayjs(data.contractDateRange[0]).valueOf();
      data.contractEnd = dayjs(data.contractDateRange[1]).valueOf();
      delete data.contractDateRange;
    }
    try {
      await (formData.value?.id
        ? updatePropertyStaff(data)
        : createPropertyStaff(data));
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
      const detail = await getPropertyStaffDetail(data.id);
      formData.value = {
        ...detail,
        hiredate: dayjs(detail.hiredate),
        contractDateRange: [
          dayjs(detail.contractStart),
          dayjs(detail.contractEnd),
        ],
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
