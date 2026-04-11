<script lang="ts" setup>
import type { BenefitIncomeCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createBenefitIncome,
  getBenefitIncomeDetail,
  updateBenefitIncome,
} from '#/api/estate';
import { $t } from '#/locales';

type FormState = BenefitIncomeCreate & {
  contractDateRange?: [dayjs.Dayjs | number, dayjs.Dayjs | number];
};

const emit = defineEmits(['success']);
const formData = ref<FormState>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['添加小区共管收益'])
    : $t('ui.actionTitle.create', ['添加小区共管收益']);
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
      fieldName: 'benefitId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'itemName',
      label: '收益项目',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收益项目',
      },
    },
    {
      fieldName: 'num',
      label: '数量',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        placeholder: '请输入数量',
      },
    },
    {
      fieldName: 'contractNo',
      label: '合同编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入合同编号',
      },
    },
    {
      fieldName: 'signUnit',
      label: '签约单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入签约单位',
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
      fieldName: 'incomeType',
      label: '收益类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_BENEFIT_INCOME_TYPE, 'number'),
      },
    },
    {
      fieldName: 'fee',
      label: '收费标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收费标准',
      },
    },
    {
      fieldName: 'actFee',
      label: '应收金额',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        controls: false,
        placeholder: '请输入应收金额',
        addonAfter: '元',
      },
    },
    {
      fieldName: 'feeType',
      label: '收款方式',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.ESTATE_BENEFIT_RECEIPT_TYPE,
          'number',
        ),
      },
    },
    {
      fieldName: 'certificateNo',
      label: '收款凭证号及银行流水',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收款凭证号及银行流水',
      },
    },
    {
      fieldName: 'updaterName',
      label: '经办人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经办人',
      },
    },
    {
      fieldName: 'incomeUseType',
      label: '收益用途',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.ESTATE_BENEFIT_INCOME_USE_TYPE,
          'number',
        ),
      },
    },
    {
      fieldName: 'publicType',
      label: '公示方式',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.ESTATE_BENEFIT_PUBLIC_TYPE, 'number'),
      },
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
    if (data.contractDateRange && data.contractDateRange.length > 0) {
      data.contractStart = dayjs(data.contractDateRange[0]).valueOf();
      data.contractEnd = dayjs(data.contractDateRange[1]).valueOf();
      delete data.contractDateRange;
    }
    try {
      await (formData.value?.id
        ? updateBenefitIncome(data)
        : createBenefitIncome(data));
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
      const detail = await getBenefitIncomeDetail(data.id);
      formData.value = {
        ...detail,
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
