<script lang="ts" setup>
import type { Basic } from '#/api/estate';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { PlusCircleOutlined } from '@ant-design/icons-vue';

import { getBasicPage } from '#/api/estate';
import CustomTable from '#/components/custom-table/index.vue';
import EmptyData from '#/components/empty-data/index.vue';
import { useEstateStore } from '#/store';

import { useGridFormSchema } from './data';

const router = useRouter();
const { resetEstateInfo } = useEstateStore();

const formState = ref<any>({});
const pageNo = ref(1);
const pageSize = ref(8);
const total = ref(0);
const listData = ref<Basic[]>([]);
const formSchema = useGridFormSchema();

const loadData = async () => {
  try {
    const res = await getBasicPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      ...formState.value,
    });
    total.value = res.total;
    listData.value = res.list || [];
  } catch (error) {
    console.error(error);
  }
};

const handleSearch = (formValues: any) => {
  pageNo.value = 1;
  formState.value = formValues;
  loadData();
};

const handlePageChange = (page: { currentPage: number; pageSize: number }) => {
  pageNo.value = page.currentPage;
  pageSize.value = page.pageSize;
  loadData();
};

const handleCreate = () => {
  resetEstateInfo();
  router.push({ path: '/estate/add' });
};

const handleDetail = (row: Basic) => {
  router.push({ path: `/estate/detail`, query: { id: row.id } });
};

const handleMark = (row: Basic) => {
  router.push({ path: `/estate/mark`, query: { id: row.id } });
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page auto-content-height class="ljw">
    <CustomTable
      :form-schema="formSchema"
      :page-no="pageNo"
      :page-size="pageSize"
      :total="total"
      @page-change="handlePageChange"
      @search="handleSearch"
      @reset="handleSearch"
    >
      <div class="custom-table-body">
        <div class="custom-header">
          <div class="custom-header-left">
            <div class="custom-header-left-title">小区列表</div>
          </div>
          <div class="custom-header-right">
            <a-button
              v-access:code="['estate:select-community:query']"
              @click="handleCreate"
            >
              <template #icon> <PlusCircleOutlined /> </template>添加
            </a-button>
          </div>
        </div>
        <div class="custom-table-content">
          <div class="estate-list">
            <div
              v-for="item in listData"
              :key="item.id"
              class="estate-list-item"
            >
              <div class="estate-info">
                <div class="info-cell">
                  <div class="info-cell-label">小区名称</div>
                  <div class="info-cell-value">{{ item.name }}</div>
                </div>
                <div class="info-cell">
                  <div class="info-cell-label">所属街道</div>
                  <div class="info-cell-value">{{ item.streetName }}</div>
                </div>
                <div class="info-cell">
                  <div class="info-cell-label">所属社区</div>
                  <div class="info-cell-value">{{ item.communityName }}</div>
                </div>
                <div class="info-cell">
                  <div class="info-cell-label">物业公司</div>
                  <div class="info-cell-value">{{ item.companyName }}</div>
                </div>
              </div>
              <div class="item-actions">
                <a-button
                  type="primary"
                  size="large"
                  class="action-btn"
                  @click="handleDetail(item)"
                >
                  查看详情
                </a-button>
                <a-button
                  type="primary"
                  size="large"
                  class="action-btn"
                  @click="handleMark(item)"
                >
                  标记
                </a-button>
              </div>
            </div>
          </div>
          <EmptyData v-if="listData.length === 0" />
        </div>
      </div>
    </CustomTable>
  </Page>
</template>

<style lang="scss" scoped>
.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  &-left {
    display: flex;
    align-items: center;
    &-title {
      font-size: 16px;
      font-weight: 600;
    }
  }
  &-right {
    display: flex;
    align-items: center;
  }
}

.estate-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}

.estate-list-item {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;

  .estate-info {
    .info-cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
      border-bottom: 1px solid #e6e6e6;

      .info-cell-label {
        color: #999;
        width: 100px;
      }
      .info-cell-value {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 16px;
  }
}

.action-btn {
  flex: 1;
  background-color: #e6f1fd;
  color: #2980ff;
  font-size: 14px;
}
</style>
