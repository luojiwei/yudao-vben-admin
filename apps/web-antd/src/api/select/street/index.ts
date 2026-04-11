import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export interface Street {
  id: number; // 街道ID
  name: string; // 街道名称
  status: number; // 状态
}

/** 查询公共 - 街道分页 */
export function getStreetPage(params: PageParam) {
  return requestClient.get<PageResult<Street>>('/estate/select-street/page', {
    params,
  });
}

/** 查询公共 - 街道列表（精简) */
export function getSimpleStreetList() {
  return requestClient.get<Street[]>('/estate/select-street/options');
}

/** 查询公共 - 街道详情 */
export function getStreetDetail(id: number) {
  return requestClient.get<Street>(`/estate/select-street/get?id=${id}`);
}

/** 新增公共 - 街道 */
export function createStreetApi(data: Street) {
  return requestClient.post('/estate/select-street/create', data);
}

/** 修改公共 - 街道 */
export function updateStreetApi(data: Street) {
  return requestClient.put('/estate/select-street/update', data);
}

/** 删除公共 - 街道 */
export function deleteStreetApi(id: number) {
  return requestClient.delete(`/estate/select-street/delete?id=${id}`);
}

/** 批量删除公共 - 街道 */
export function deleteStreetList(ids: number[]) {
  return requestClient.delete(
    `/estate/select-street/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出公共 - 街道 */
export function exportStreetApi(params: any) {
  return requestClient.download('/estate/select-street/export-excel', {
    params,
  });
}
