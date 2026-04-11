<script lang="ts" setup>
import type { FileItem } from '@vben/types';

import type { AfficheOwnerCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createAfficheOwner,
  getAfficheOwnerDetail,
  updateAfficheOwner,
} from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { $t } from '#/locales';

type FormState = {
  fileList?: FileItem[]; // 公示文件列表
} & AfficheOwnerCreate;

const emit = defineEmits(['success']);
const formData = ref<FormState>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['业主大会管理规约、议事规则公开公示'])
    : $t('ui.actionTitle.create', ['业主大会管理规约、议事规则公开公示']);
});

const fileList = ref<FileItem[]>([]);
const handleChange = () => {
  formApi.setFieldValue(
    'fileIds',
    fileList.value.map((item) => item.id).join(','),
  );
  formApi.setFieldValue('fileList', fileList.value);
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
      fieldName: 'afficheId',
      component: 'InputNumber',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'showDay',
      label: '公示时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择公示时间',
      },
    },
    {
      fieldName: 'manageAgreement',
      label: '管理规约',
      component: 'Input',
      componentProps: {
        placeholder: '请输入管理规约',
      },
    },
    {
      fieldName: 'discussRule',
      label: '议事规则',
      component: 'Input',
      componentProps: {
        placeholder: '请输入议事规则',
      },
    },
    {
      fieldName: 'channel',
      label: '公示渠道',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.ESTATE_AFFICHE_PUBLIC_CHANNEL,
          'number',
        ),
      },
    },
    {
      fieldName: 'fileList',
      label: '公示文件',
      component: 'FileUpload',
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
    data.showDay = dayjs(data.showDay).valueOf();
    try {
      await (formData.value?.id
        ? updateAfficheOwner(data)
        : createAfficheOwner(data));
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
    console.log(1111, data);
    if (!data || !data.id) {
      formApi.setValues(data);
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getAfficheOwnerDetail(data.id);
      formData.value.showDay = dayjs(formData.value.showDay);
      fileList.value = formData.value.fileList || [];
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
      <template #fileList>
        <FileUpload
          v-model:value="fileList"
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
