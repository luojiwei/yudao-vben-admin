<script lang="ts" setup>
import type { PropertySupervisorCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createPropertySupervisor,
  getPropertySupervisorDetail,
  updatePropertySupervisor,
} from '#/api/estate';
import { $t } from '#/locales';

const emit = defineEmits(['success']);
const formData = ref<PropertySupervisorCreate>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['物业企业股东高管(物业经理/物业负责人)'])
    : $t('ui.actionTitle.create', ['物业企业股东高管(物业经理/物业负责人)']);
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
      fieldName: 'birthday',
      label: '出生日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择出生日期',
      },
    },
    {
      fieldName: 'politicsAffiliation',
      label: '政治面貌',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.ESTATE_POL_AFFILIATION_TYPE,
          'number',
        ),
      },
    },
    {
      fieldName: 'educationId',
      label: '学历',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_DIPLOMA_TYPE, 'number'),
      },
    },
    {
      fieldName: 'specialtyName',
      label: '专业',
      component: 'Input',
      componentProps: {
        placeholder: '请输入专业',
      },
    },
    {
      fieldName: 'positionName',
      label: '职务',
      component: 'Input',
      componentProps: {
        placeholder: '请输入职务',
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
      fieldName: 'certificateName',
      label: '资格证书',
      component: 'Input',
      componentProps: {
        placeholder: '请输入资格证书',
      },
    },
    {
      fieldName: 'certificateNo',
      label: '资格证书编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入资格证书编号',
      },
    },
    {
      fieldName: 'certificateUnit',
      label: '发证单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发证单位',
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
    const data = (await formApi.getValues()) as PropertySupervisorCreate;
    data.birthday = dayjs(data.birthday).valueOf();
    data.hiredate = dayjs(data.hiredate).valueOf();
    try {
      await (formData.value?.id
        ? updatePropertySupervisor(data)
        : createPropertySupervisor(data));
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
    const data = modalApi.getData<PropertySupervisorCreate>();
    if (!data || !data.id) {
      formApi.setValues(data);
      return;
    }
    modalApi.lock();
    try {
      const res = await getPropertySupervisorDetail(data.id);
      formData.value = {
        ...res,
        birthday: dayjs(res.birthday),
        hiredate: dayjs(res.hiredate),
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
