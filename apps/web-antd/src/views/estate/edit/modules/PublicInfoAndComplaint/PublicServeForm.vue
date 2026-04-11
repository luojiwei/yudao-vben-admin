<script lang="ts" setup>
import type { FileItem } from '@vben/types';

import type { AfficheServeCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createAfficheServe,
  getAfficheServeDetail,
  updateAfficheServe,
} from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { $t } from '#/locales';

type FormState = {
  fileList?: FileItem[]; // 公示文件列表
} & AfficheServeCreate;

const emit = defineEmits(['success']);
const formData = ref<FormState>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['物业企业公示'])
    : $t('ui.actionTitle.create', ['物业企业公示']);
});

const fileList = ref<FileItem[]>([]);
const handleFileListChange = () => {
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
      fieldName: 'evalDay',
      label: '考评时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择考评时间',
      },
    },
    {
      fieldName: 'point',
      label: '考评得分',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 1,
        controls: false,
        placeholder: '请输入考评得分',
      },
    },
    {
      fieldName: 'cityRank',
      label: '全市排名',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controls: false,
        placeholder: '请输入全市排名',
      },
    },
    {
      fieldName: 'typeTxt',
      label: '上榜类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入上榜类型',
      },
    },
    {
      fieldName: 'mainDecItems',
      label: '主要扣分项',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主要扣分项',
      },
    },
    {
      fieldName: 'rectificationMeasures',
      label: '整改措施',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改措施',
      },
    },
    {
      fieldName: 'evalUnit',
      label: '考评单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入考评单位',
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
    data.evalDay = dayjs(data.evalDay).valueOf();
    try {
      await (formData.value?.id
        ? updateAfficheServe(data)
        : createAfficheServe(data));
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
      formData.value = await getAfficheServeDetail(data.id);
      formData.value.evalDay = dayjs(formData.value.evalDay);
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
          @change="handleFileListChange"
        />
      </template>
    </Form>
  </Modal>
</template>
