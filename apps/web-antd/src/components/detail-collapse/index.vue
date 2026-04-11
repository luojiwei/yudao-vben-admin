<script setup lang="ts">
import type { PropType } from 'vue';

import type { CollapsePanel } from './index.ts';

import { computed } from 'vue';

import { Tag } from 'ant-design-vue';

import { CellItem, ContentWapper } from '#/components/detail-module';

const props = defineProps({
  active: {
    type: Array,
    default: () => [],
  },
  accordion: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array as PropType<CollapsePanel[]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:active']);

const activeKey = computed({
  get() {
    return props.active;
  },
  set(val) {
    emit('update:active', val);
  },
});
</script>

<template>
  <a-collapse v-model:active-key="activeKey" :accordion="accordion">
    <a-collapse-panel
      v-for="panel in data"
      :key="panel.key"
      :header="panel.title"
    >
      <ContentWapper :col="3">
        <template v-for="child in panel.children" :key="child.field">
          <div v-if="child.type === 'title'" class="wapper-title">
            {{ child.label }}
          </div>
          <template v-else-if="child.type === 'dictText'">
            <div class="wapper-cell-item">
              <div class="label">{{ child.label }}：</div>
              <div class="value">
                <template v-if="Array.isArray(child.value)">
                  <Tag
                    v-for="item in child.value"
                    :key="item.id"
                    color="default"
                  >
                    {{ item.name }}
                  </Tag>
                </template>
                <template v-else>
                  <Tag color="default">{{ child.value }}</Tag>
                </template>
              </div>
            </div>
          </template>
          <CellItem
            v-else
            :label="child.label"
            :value="child.value"
            :type="child.type"
            :format="child.format"
            :prefix="child.prefix"
            :dict-type="child.dictType"
          />
        </template>
      </ContentWapper>
    </a-collapse-panel>
  </a-collapse>
</template>

<style lang="scss" scoped>
.ant-collapse {
  margin-bottom: 20px;

  :deep(.ant-collapse-content-box) {
    padding: 18px;
  }

  .content-wapper {
    padding-right: 200px;
  }
}

.wapper-title {
  grid-column: 1 / -1;
  font-weight: 600;
}

.wapper-cell-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.label {
  width: var(--label-width);
  color: #999;
}

.value {
  display: flex;
}
</style>
