export type ItemType =
  | 'amount'
  | 'dict'
  | 'dictLabel'
  | 'dictText'
  | 'file'
  | 'text'
  | 'title';

export type ItemFormat = 'amount' | 'date' | 'datetime';

export { default as CellItem } from './cell-item.vue';
export { default as ContentWapper } from './content-wapper.vue';
export { default as DetailModule } from './index.vue';
