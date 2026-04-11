<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BenefitDevice } from '#/api/estate';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteBenefitDevice, getBenefitDevicePage } from '#/api/estate';
import { TablePreviewCell } from '#/components/file-preview';
import { $t } from '#/locales';

import PublicDeviceForm from './PublicDeviceForm.vue';

const props = defineProps({
  estateId: {
    type: Number,
    required: true,
  },
  estateName: {
    type: String,
    required: true,
  },
  benefitId: {
    type: Number,
    required: true,
  },
  fromType: {
    type: String,
    default: 'edit',
  },
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PublicDeviceForm,
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
      field: 'deviceType',
      title: '设施类型',
      minWidth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_BENEFIT_DEVICE_TYPE },
      },
    },
    {
      field: 'num',
      title: '设施数量',
      minWidth: 80,
    },
    {
      field: 'fee',
      title: '收费标准',
      minWidwth: 80,
    },
    {
      field: 'contractFileList',
      title: '合同文件',
      minWidth: 150,
      slots: { default: 'contractFileList' },
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
          return await getBenefitDevicePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            estateId: props.estateId,
            benefitId: props.benefitId,
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
  } as VxeTableGridOptions<BenefitDevice>,
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
      benefitId: props.benefitId,
    })
    .open();
}

/** 编辑电梯设备 */
function handleEdit(row: BenefitDevice) {
  formModalApi.setData(row).open();
}

/** 删除电梯设备 */
async function handleDelete(row: BenefitDevice) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
  });
  try {
    await deleteBenefitDevice(row.id!);
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
      公共设施清单
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
      <template #contractFileList="{ row }">
        <TablePreviewCell
          v-if="row.contractFileList && row.contractFileList[0]"
          :file="row.contractFileList[0]"
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
