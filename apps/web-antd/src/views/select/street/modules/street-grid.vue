<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Street } from '#/api/select/street';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteStreetApi, getStreetPage } from '#/api/select/street';
import { $t } from '#/locales';

import { useStreetGridColumns, useStreetGridFormSchema } from '../data';
import StreetForm from './street-form.vue';

const emit = defineEmits(['select']);

const [StreetFormModal, streetFormModalApi] = useVbenModal({
  connectedComponent: StreetForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建字典类型 */
function handleCreate() {
  streetFormModalApi.setData(null).open();
}

/** 编辑字典类型 */
function handleEdit(row: Street) {
  streetFormModalApi.setData(row).open();
}

/** 删除字典类型 */
async function handleDelete(row: Street) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteStreetApi(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useStreetGridFormSchema(),
  },
  gridOptions: {
    columns: useStreetGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getStreetPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<Street>,
  gridEvents: {
    cellClick: ({ row }: { row: Street }) => {
      emit('select', {
        id: row.id,
        name: row.name,
      });
    },
  },
});
</script>

<template>
  <div class="h-full">
    <StreetFormModal @success="handleRefresh" />
    <Grid table-title="街道列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['街道']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['estate:select-street:create'],
              onClick: handleCreate,
            },
          ]"
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
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </div>
</template>
