import { requestClient } from '#/api/request';

export type EstateMarkCreate = {
  id: number; // 小区id
  latitude: number; // 纬度
  locationJson: string; // 小区范围节点json
  longitude: number; // 经度
};

export type EstateMark = {
  name: string; // 小区名称
} & EstateMarkCreate;

export type PolygonPath = [number, number][];

/** 获取小区范围标记 */
export function getEstateMark(id: number) {
  return requestClient.get<EstateMark>('/estate/basic/get_location', {
    params: { id },
  });
}

/** 更新小区范围标记 */
export function updateEstateMark(data: EstateMarkCreate) {
  return requestClient.put<EstateMark>('/estate/basic/update_location', data);
}
