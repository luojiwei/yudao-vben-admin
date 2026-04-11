import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';
import type { FileItem } from '@vben/types';

import { requestClient } from '#/api/request';

export type DeviceCreate = {
  estateId: number; // 小区id
  estateName: string; // 小区名称
  id: number; // 表id
  lotCivilAirDefenceNum: null | number; // 人防车位数数量
  lotFileIds: string; // 停车位规划图id列表
  lotGroundNum: null | number; // 地面停车位数量
  lotIsFile: number; // 是否有停车位规划图 1-是 0-否
  lotUndergroundNum: null | number; // 地下停车位数量
  otherFileIds: string; // 其他材料id列表
};

export type Device = {
  createTime: number; // 创建时间
} & DeviceCreate;

export type DeviceDetail = {
  lotFileList: FileItem[]; // 停车位规划图列表
  otherFileList: FileItem[]; // 其他材料列表
} & Device;

/** 获得小区 - 公共部位及设备设施 */
export function getDeviceDetail(estateId: number) {
  return requestClient.get<DeviceDetail>('/estate/device/get', {
    params: { estateId },
  });
}

/** 更新小区 - 公共部位及设备设施 */
export function updateDeviceApi(data: DeviceCreate) {
  return requestClient.put<boolean>('/estate/device/update', data);
}

export type DeviceFacilityCreate = {
  address: string; // 设备位置
  deviceId: number; // 设备表id
  deviceModel: string; // 设备型号
  deviceType: number; // 设备类型
  estateId: number; // 小区id
  feeStandard: number; // 收费标准
  id: number; // 表id
  installTime: Dayjs | number; // 安装日期
  lastMaintDay: Dayjs | number; // 最后维护日期
  leaveTime: Dayjs | number; // 出厂日期
  maintContent: string; // 维保内容
  maintIntervals: number; // 维护周期（月）
  maintName: string; // 维保人员
  maintPhone: string; // 维保人员手机号
  maintUnit: string; // 维保单位
  manufacturer: string; // 设备制造商
  name: string; // 设备名称
  nextMaintDay: Dayjs | number; // 下次维保日期
  number: number; // 设备数量
  realEstateName: string; // 物业联系人
  realEstatePhone: string; // 物业联系人手机号
  safetyManageName: string; // 安全管理人员姓名
  safetyManagePhone: string; // 安全管理人员手机号
  type: number; // 设备类型 1-电梯 2-消防设备 3-其它
  useStatus: number; // 使用状态
  useYear: Dayjs | string; // 投入使用年份
};

export type DeviceFacility = {
  createTime: number; // 创建时间
} & DeviceFacilityCreate;

export type DeviceFacilityDetail = DeviceFacility;

/** 查询设备设施列表 */
export function getDeviceFacilityPage(params: PageParam) {
  return requestClient.get<PageResult<DeviceFacility>>(
    '/estate/device-facility/page',
    {
      params,
    },
  );
}

/** 获得设备设施详情 */
export function getDeviceFacility(id: number) {
  return requestClient.get<DeviceFacilityDetail>(
    '/estate/device-facility/get',
    {
      params: { id },
    },
  );
}

/** 创建设备设施 */
export function createDeviceFacility(data: DeviceFacilityCreate) {
  return requestClient.post<number>('/estate/device-facility/create', data);
}

/** 更新设备设施 */
export function updateDeviceFacility(data: DeviceFacilityCreate) {
  return requestClient.put<boolean>('/estate/device-facility/update', data);
}

/** 删除设备设施 */
export function deleteDeviceFacility(id: number) {
  return requestClient.delete<boolean>('/estate/device-facility/delete', {
    params: { id },
  });
}
