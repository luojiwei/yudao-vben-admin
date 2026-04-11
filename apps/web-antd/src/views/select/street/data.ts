import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Community } from '#/api/select/community';
import type { Street } from '#/api/select/street';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

/** 新增/修改街道的表单 */
export function useStreetFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '街道名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入街道名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
    },
  ];
}

/** 街道列表的搜索表单 */
export function useStreetGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '街道名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入街道名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
      },
    },
  ];
}

/** 街道列表的字段 */
export function useStreetGridColumns(): VxeTableGridOptions<Street>['columns'] {
  return [
    {
      field: 'id',
      title: '街道ID',
      minWidth: 80,
    },
    {
      field: 'name',
      title: '街道名称',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },

    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 新增/修改社区的表单 */
export function useCommunityFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'streetId',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'streetName',
      label: '所属街道',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属街道',
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: '社区名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入社区名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
    },
  ];
}

/** 社区列表的搜索表单 */
export function useCommunityGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '社区名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入社区名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
      },
    },
  ];
}

/** 社区列表的字段 */
export function useCommunityGridColumns(): VxeTableGridOptions<Community>['columns'] {
  return [
    {
      field: 'id',
      title: '社区ID',
      minWidth: 80,
    },
    {
      field: 'name',
      title: '社区名称',
      minWidth: 120,
    },
    {
      field: 'streetName',
      title: '所属街道',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
