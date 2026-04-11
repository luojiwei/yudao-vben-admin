<script lang="ts" setup>
import type { FileItem } from '@vben/types';

import type { AfficheCompanyCreate } from '#/api/estate';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createAfficheCompany,
  getAfficheCompanyDetail,
  updateAfficheCompany,
} from '#/api/estate';
import FileUpload from '#/components/upload/file-upload.vue';
import { $t } from '#/locales';

type FormState = {
  certificateFileList?: FileItem[]; // 职业资格证书文件列表
  fileList?: FileItem[]; // 公示文件列表
  licenseFileList?: FileItem[]; // 营业执照文件列表
} & AfficheCompanyCreate;

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

const certificateFileList = ref<FileItem[]>([]);
const handleCertificateFileListChange = () => {
  formApi.setFieldValue(
    'certificateFileIds',
    certificateFileList.value.map((item) => item.id).join(','),
  );
  formApi.setFieldValue('certificateFileList', certificateFileList.value);
};

const licenseFileList = ref<FileItem[]>([]);
const handleLicenseFileListChange = () => {
  formApi.setFieldValue(
    'licenseFileIds',
    licenseFileList.value.map((item) => item.id).join(','),
  );
  formApi.setFieldValue('licenseFileList', licenseFileList.value);
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
      fieldName: 'companyName',
      label: '企业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入企业名称',
      },
    },
    {
      fieldName: 'creditCode',
      label: '信用代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入信用代码',
      },
    },
    {
      fieldName: 'projectManager',
      label: '项目负责人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入项目负责人',
      },
    },
    {
      fieldName: 'certificateFileList',
      label: '职业资格证书',
      component: 'FileUpload',
    },
    {
      fieldName: 'certificateNo',
      label: '证书编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入证书编号',
      },
    },
    {
      fieldName: 'licenseFileList',
      label: '营业执照',
      component: 'FileUpload',
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
        ? updateAfficheCompany(data)
        : createAfficheCompany(data));
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
      formData.value = await getAfficheCompanyDetail(data.id);
      formData.value.showDay = dayjs(formData.value.showDay);
      fileList.value = formData.value.fileList || [];
      certificateFileList.value = formData.value.certificateFileList || [];
      licenseFileList.value = formData.value.licenseFileList || [];
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
      <template #certificateFileList>
        <FileUpload
          v-model:value="certificateFileList"
          :show-description="false"
          :max-number="1"
          layout="horizontal"
          return-mode="id-url"
          @change="handleCertificateFileListChange"
        />
      </template>
      <template #licenseFileList>
        <FileUpload
          v-model:value="licenseFileList"
          :show-description="false"
          :max-number="1"
          layout="horizontal"
          return-mode="id-url"
          @change="handleLicenseFileListChange"
        />
      </template>
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
