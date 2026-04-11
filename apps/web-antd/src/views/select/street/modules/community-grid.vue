<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Community } from '#/api/select/community';

import { watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCommunityApi, getCommunityPage } from '#/api/select/community';
import { $t } from '#/locales';

import { useCommunityGridColumns, useCommunityGridFormSchema } from '../data';
import CommunityForm from './community-form.vue';

const props = defineProps({
  streetId: {
    type: Number,
    default: 0,
  },
  streetName: {
    type: String,
    default: '',
  },
});

const [CommunityFormModal, communityFormModalApi] = useVbenModal({
  connectedComponent: CommunityForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建字典数据 */
function handleCreate() {
  communityFormModalApi
    .setData({ streetId: props.streetId, streetName: props.streetName })
    .open();
}

/** 编辑社区 */
function handleEdit(row: Community) {
  communityFormModalApi.setData(row).open();
}

/** 删除社区 */
async function handleDelete(row: Community) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteCommunityApi(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useCommunityGridFormSchema(),
  },
  gridOptions: {
    columns: useCommunityGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getCommunityPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            streetId: props.streetId === 0 ? undefined : props.streetId,
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
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<Community>,
});

/** 监听 dictType 变化，重新查询 */
watch(
  () => props.streetId,
  () => {
    if (props.streetId) {
      handleRefresh();
    }
  },
);
</script>

<template>
  <div class="flex h-full flex-col">
    <CommunityFormModal @success="handleRefresh" />

    <Grid table-title="社区列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['社区']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['estate:select-community:create'],
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
              auth: ['estate:select-community:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['estate:select-community:delete'],
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
