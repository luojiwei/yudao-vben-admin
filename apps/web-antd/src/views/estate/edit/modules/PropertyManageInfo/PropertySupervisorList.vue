<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PropertySupervisor } from '#/api/estate';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';

import { PlusCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePropertySupervisor,
  getPropertySupervisorPage,
} from '#/api/estate';
import { $t } from '#/locales';

import PropertySupervisorForm from './PropertySupervisorForm.vue';

const props = defineProps({
  estateId: {
    type: Number,
    required: true,
  },
  estateName: {
    type: String,
    required: true,
  },
  manageId: {
    type: Number,
    required: true,
  },
  fromType: {
    type: String,
    default: 'edit',
  },
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PropertySupervisorForm,
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
      title: '姓名',
      minWidwth: 120,
    },
    {
      field: 'sex',
      title: '性别',
      minWidwth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_USER_SEX },
      },
    },
    {
      field: 'birthday',
      title: '出生日期',
      minWidwth: 120,
      formatter: 'formatDate',
    },
    {
      field: 'politicsAffiliation',
      title: '政治面貌',
      minWidwth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_POL_AFFILIATION_TYPE },
      },
    },
    {
      field: 'educationId',
      title: '学历',
      minWidwth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.ESTATE_DIPLOMA_TYPE },
      },
    },
    {
      field: 'specialtyName',
      title: '专业',
      minWidwth: 120,
    },
    {
      field: 'positionName',
      title: '职务',
      minWidwth: 120,
    },
    {
      field: 'itemName',
      title: '所属项目',
      minWidwth: 120,
    },
    {
      field: 'hiredate',
      title: '入职时间',
      minWidwth: 120,
      formatter: 'formatDate',
    },
    {
      field: 'certificateName',
      title: '资格证书',
      minWidwth: 120,
    },
    {
      field: 'certificateNo',
      title: '证书编号',
      minWidwth: 120,
    },
    {
      field: 'certificateUnit',
      title: '发证单位',
      minWidwth: 120,
    },
    {
      field: 'phone',
      title: '联系电话',
      minWidwth: 120,
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
          return await getPropertySupervisorPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            estateId: props.estateId,
            manageId: props.manageId,
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
  } as VxeTableGridOptions<PropertySupervisor>,
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
      manageId: props.manageId,
    })
    .open();
}

/** 编辑电梯设备 */
function handleEdit(row: PropertySupervisor) {
  formModalApi.setData(row).open();
}

/** 删除电梯设备 */
async function handleDelete(row: PropertySupervisor) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
  });
  try {
    await deletePropertySupervisor(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}
</script>

<template>
  <div class="module-grid property-supervisor-list">
    <div class="module-title">
      物业企业股东高管(物业经理/物业负责人)名单
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
