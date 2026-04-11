<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AfficheServe } from '#/api/estate';

import { useVbenModal } from '@vben/common-ui';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAfficheServe, getAfficheServePage } from '#/api/estate';
import { TablePreviewCell } from '#/components/file-preview';
import { $t } from '#/locales';

import PublicServeForm from './PublicServeForm.vue';

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
  connectedComponent: PublicServeForm,
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
      field: 'evalDay',
      title: '考评时间',
      minWidth: 120,
      formatter: 'formatDate',
    },
    {
      field: 'point',
      title: '考评得分',
      minWidth: 80,
    },
    {
      field: 'cityRank',
      title: '全市排名',
      minWidth: 80,
    },
    {
      field: 'typeTxt',
      title: '上榜类型',
      minWidth: 120,
    },
    {
      field: 'mainDecItems',
      title: '主要扣分项',
      minWidth: 180,
    },
    {
      field: 'rectificationMeasures',
      title: '整改措施',
      minWidth: 180,
    },
    {
      field: 'evalUnit',
      title: '考评单位',
      minWidth: 150,
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
          return await getAfficheServePage({
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
  } as VxeTableGridOptions<AfficheServe>,
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
function handleEdit(row: AfficheServe) {
  formModalApi.setData(row).open();
}

/** 删除电梯设备 */
async function handleDelete(row: AfficheServe) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
  });
  try {
    await deleteAfficheServe(row.id!);
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
      物业服务公示情况表
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
