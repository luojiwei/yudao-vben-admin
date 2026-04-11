<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceFacility } from '#/api/estate';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDeviceFacility, getDeviceFacilityPage } from '#/api/estate';
import { $t } from '#/locales';

import FireDeviceForm from './FireDeviceForm.vue';

const props = defineProps({
  estateId: {
    type: Number,
    required: true,
  },
  estateName: {
    type: String,
    default: '',
  },
  deviceId: {
    type: Number,
    required: true,
  },
  fromType: {
    type: String,
    default: 'edit',
  },
});

const DEVICE_TYPE = 2;

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FireDeviceForm,
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
      field: 'name',
      title: '设备名称',
      minWidwth: 120,
    },
    {
      field: 'number',
      title: '设备数量',
      minWidwth: 100,
    },
    {
      field: 'deviceType',
      title: '设备类型',
      minWidwth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_DEVICE_FIRE_TYPE },
      },
    },
    {
      field: 'deviceModel',
      title: '型号',
      minWidwth: 100,
    },
    {
      field: 'manufacturer',
      title: '生产厂家',
      minWidwth: 120,
    },
    {
      field: 'leaveTime',
      title: '出厂日期',
      minWidwth: 100,
      formatter: 'formatDate',
    },
    {
      field: 'installTime',
      title: '安装日期',
      minWidwth: 100,
      formatter: 'formatDate',
    },
    {
      field: 'useStatus',
      title: '使用状态',
      minWidwth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_DEVICE_USE_STATUS },
      },
    },
    {
      field: 'maintIntervals',
      title: '维护周期',
      minWidwth: 100,
      formatter: ({ cellValue }) => `${cellValue}月`,
    },
    {
      field: 'lastMaintDay',
      title: '最近维护周期',
      minWidwth: 120,
      formatter: 'formatDate',
    },
    {
      field: 'maintUnit',
      title: '维保单位',
      minWidwth: 120,
    },
    {
      field: 'maintName',
      title: '维保人员',
      minWidwth: 100,
    },
    {
      field: 'maintPhone',
      title: '维保人员电话',
      minWidwth: 180,
    },
    {
      field: 'maintContent',
      title: '维保内容',
      minWidwth: 180,
    },
    {
      field: 'nextMaintDay',
      title: '下次维护日期',
      minWidwth: 100,
      formatter: 'formatDate',
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
          return await getDeviceFacilityPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            type: DEVICE_TYPE,
            estateId: props.estateId,
            deviceId: props.deviceId,
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
  } as VxeTableGridOptions<DeviceFacility>,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建消防设备 */
function handleCreate() {
  formModalApi
    .setData({
      type: DEVICE_TYPE,
      estateId: props.estateId,
      estateName: props.estateName,
      deviceId: props.deviceId,
    })
    .open();
}

/** 编辑消防设备 */
function handleEdit(row: DeviceFacility) {
  formModalApi.setData(row).open();
}

/** 删除消防设备 */
async function handleDelete(row: DeviceFacility) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
  });
  try {
    await deleteDeviceFacility(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}
</script>

<template>
  <div class="module-grid fire-device-list">
    <div class="module-title">
      消防设备
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
                title: $t('ui.actionMessage.deleteConfirm', ['该设备']),
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
