import type { ItemFormat, ItemType } from '#/components/detail-module';

export interface CollapsePanel {
  key: string;
  title: string;
  children: CollapsePanelChild[];
}

export interface CollapsePanelChild {
  field: string;
  label: string;
  type?: ItemType;
  format?: ItemFormat;
  value: any;
  prefix?: string;
  dictType?: string;
}

export { default as DetailCollapse } from './index.vue';
