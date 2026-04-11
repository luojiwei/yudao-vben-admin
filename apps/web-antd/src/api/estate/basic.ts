import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';
import type { FileItem } from '@vben/types';

import { requestClient } from '#/api/request';

export type BasicCreate = {
  areaCode: string; // 区县编码
  areaName: string; // 区县名称
  buildAcreage: null | number; // 建筑面积
  buildUnit: string; // 建设单位名称
  cityCode: string; // 城市编码
  cityName: string; // 城市名称
  communityId: null | number; // 社区id
  communityName: string; // 社区名称
  companyName: string; // 物业公司名称
  coverAcreage: null | number; // 占地面积
  deliveryTime: Dayjs | null | number; // 交付时间
  eastSide: string; // 东至
  id: number; // 小区id
  latitude: string; // 纬度
  longitude: string; // 经度
  name: string; // 小区名称
  northSide: string; // 北至
  officeMemberNum: null | number; // 社区干事总人数
  partyMemberNum: null | number; // 社区干事党员人数
  planFileIds: string; // 小区住宅区平面图/规划图
  provinceCode: string; // 省份编码
  provinceName: string; // 省份名称
  southSide: string; // 南至
  streetId: null | number; // 街道id
  streetName: string; // 街道名称
  westSide: string; // 西至
};

export type Basic = {
  createTime?: number; // 创建时间
  deliveryTime: number;
} & BasicCreate;

export type BasicDetail = {
  planFileList: FileItem[]; // 小区住宅区平面图/规划图列表
} & Basic;

/** 查询小区列表 */
export function getBasicPage(params: PageParam) {
  return requestClient.get<PageResult<Basic>>('/estate/basic/page', {
    params,
  });
}

/** 获取小区基本信息 */
export function getEstateBasic(id: number) {
  return requestClient.get<BasicDetail>('/estate/basic/get', {
    params: { id },
  });
}

/** 创建小区基本信息 */
export function createEstateBasic(data: BasicCreate) {
  return requestClient.post<number>('/estate/basic/create', data);
}

/** 更新小区基本信息 */
export function updateEstateBasic(data: BasicCreate) {
  return requestClient.put<boolean>('/estate/basic/update', data);
}
