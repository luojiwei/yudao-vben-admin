<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import CommunityGrid from './modules/community-grid.vue';
import StreetGrid from './modules/street-grid.vue';

const searchStreetId = ref<number>(); // 搜索的街道ID
const searchStreetName = ref<string>(); // 搜索的街道名称

function handleStreetSelect(street: { id: number; name: string }) {
  searchStreetId.value = street.id;
  searchStreetName.value = street.name;
}
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full">
      <!-- 左侧字典类型列表 -->
      <div class="w-1/2 pr-3">
        <StreetGrid @select="handleStreetSelect" />
      </div>
      <!-- 右侧字典数据列表 -->
      <div class="w-1/2">
        <CommunityGrid
          :street-id="searchStreetId"
          :street-name="searchStreetName"
        />
      </div>
    </div>
  </Page>
</template>
