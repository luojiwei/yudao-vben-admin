<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AfficheCompany } from '#/api/estate';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAfficheCompany, getAfficheCompanyPage } from '#/api/estate';
import { TablePreviewCell } from '#/components/file-preview';
import { $t } from '#/locales';

import PublicCompanyForm from './PublicCompanyForm.vue';

const props = defineProps({
  estateId: {
    type: Number,
    required: true,
  },
  estateName: {
    type: String,
    required: true,
  },
  afficheId: {
    type: Number,
    required: true,
  },
  fromType: {
    type: String,
    default: 'edit',
  },
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PublicCompanyForm,
  destroyOnClose: true,
});

const getGridColumns = () => {
  const columns = [
    {
      field: 'index',
      title: '序号',
      type: 'seq',
      width: 80,
    },
    {
      field: 'showDay',
      title: '公示日期',
      minWidth: 120,
      formatter: 'formatDate',
    },
    {
      field: 'companyName',
      title: '物业企业名称',
      minWidth: 120,
    },
    {
      field: 'creditCode',
      title: '统一社会信用代码',
      minWidth: 150,
    },
    {
      field: 'projectManager',
      title: '项目经理姓名',
      minWidth: 120,
    },
    {
      field: 'certificateFileList',
      title: '职业资格证书',
      minWidth: 150,
      slots: { default: 'certificateFileList' },
    },
    {
      field: 'certificateNo',
      title: '证书编号',
      minWidth: 150,
    },
    {
      field: 'licenseFileList',
      title: '营业执照',
      minWidth: 150,
      slots: { default: 'licenseFileList' },
    },
    {
      field: 'channel',
      title: '公示渠道',
      minWidth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_AFFICHE_PUBLIC_CHANNEL },
      },
    },
    {
      field: 'fileList',
      title: '公示文件',
      minWidth: 150,
      slots: { default: 'fileList' },
    },
    {
      field: 'mark',
      title: '备注',
      minWidth: 150,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ] as VxeTableGridOptions['columns'];
  props.fromType === 'detail' && columns?.pop();
  return columns;
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: getGridColumns(),
    height: '400px',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getAfficheCompanyPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            estateId: props.estateId,
            afficheId: props.afficheId,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
    },
    pagerConfig: {
      pageSizes: [10, 15, 20],
      pageSize: 10,
    },
  } as VxeTableGridOptions<AfficheCompany>,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建电梯设备 */
function handleCreate() {
  formModalApi
    .setData({
      estateId: props.estateId,
      itemName: props.estateName,
      afficheId: props.afficheId,
    })
    .open();
}

/** 编辑电梯设备 */
function handleEdit(row: AfficheCompany) {
  formModalApi.setData(row).open();
}

/** 删除电梯设备 */
async function handleDelete(row: AfficheCompany) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
  });
  try {
    await deleteAfficheCompany(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}
</script>

<template>
  <div class="module-grid public-device-list">
    <div class="module-title not-dot">
      物业企业公示情况表
      <a-button
        v-if="fromType === 'edit'"
        type="text"
        class="plus-btn"
        @click="handleCreate"
      >
        <PlusCircleOutlined />添加
      </a-button>
    </div>
    <FormModal @success="handleRefresh" />
    <Grid>
      <template #certificateFileList="{ row }">
        <TablePreviewCell
          v-if="row.certificateFileList && row.certificateFileList[0]"
          :file="row.certificateFileList[0]"
        />
      </template>
      <template #licenseFileList="{ row }">
        <TablePreviewCell
          v-if="row.licenseFileList && row.licenseFileList[0]"
          :file="row.licenseFileList[0]"
        />
      </template>
      <template #fileList="{ row }">
        <TablePreviewCell
          v-if="row.fileList && row.fileList[0]"
          :file="row.fileList[0]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['estate:select-street:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['estate:select-street:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', ['该人员']),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </div>
</template>

<style lang="scss" scoped>
:deep(.vxe-grid) {
  padding: 0 !important;
}
</style>
