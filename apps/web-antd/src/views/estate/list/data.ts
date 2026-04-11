import type { VbenFormSchema } from '#/adapter/form';
import type { Community } from '#/api/select/community';

import { getSimpleCommunityList } from '#/api/select/community';
import { getSimpleStreetList } from '#/api/select/street';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '小区名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入小区名称',
      },
    },
    {
      fieldName: 'companyName',
      label: '物业公司',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物业公司',
      },
    },
    {
      fieldName: 'streetId',
      label: '所属街道',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleStreetList,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
        placeholder: '请选择所属街道',
      },
    },
    {
      fieldName: 'communityId',
      label: '所属社区',
      component: 'Select',
      dependencies: {
        triggerFields: ['streetId'],
        componentProps: async (values, formApi) => {
          let options: Community[] = [];
          if (values.streetId) {
            formApi.setFieldValue('communityId', null);
            options = await getSimpleCommunityList(values.streetId);
          }

          return {
            options,
            fieldNames: {
              label: 'name',
              value: 'id',
            },
            allowClear: true,
            placeholder: '请选择所属社区',
          };
        },
      },
    },
  ];
}
