import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export interface Community {
  id: number; // 社区ID
  name: string; // 社区名称
  status: number; // 状态
}

/** 查询公共 - 社区分页 */
export function getCommunityPage(params: PageParam) {
  return requestClient.get<PageResult<Community>>(
    '/estate/select-community/page',
    { params },
  );
}

/** 查询公共 - 社区列表（精简) */
export function getSimpleCommunityList(streetId?: number) {
  return requestClient.get<Community[]>('/estate/select-community/options', {
    params: { streetId: streetId || undefined },
  });
}

/** 查询公共 - 社区详情 */
export function getCommunityDetail(id: number) {
  return requestClient.get<Community>(`/estate/select-community/get?id=${id}`);
}

/** 新增公共 - 社区 */
export function createCommunityApi(data: Community) {
  return requestClient.post('/estate/select-community/create', data);
}

/** 修改公共 - 社区 */
export function updateCommunityApi(data: Community) {
  return requestClient.put('/estate/select-community/update', data);
}

/** 删除公共 - 社区 */
export function deleteCommunityApi(id: number) {
  return requestClient.delete(`/estate/select-community/delete?id=${id}`);
}

/** 批量删除公共 - 社区 */
export function deleteCommunityList(ids: number[]) {
  return requestClient.delete(
    `/estate/select-community/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出公共 - 社区 */
export function exportCommunityApi(params: any) {
  return requestClient.download('/estate/select-community/export-excel', {
    params,
  });
}
