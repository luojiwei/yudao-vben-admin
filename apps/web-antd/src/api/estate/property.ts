import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export type PropertyCreate = {
  accountName: string; // 物业公司账户名称
  bankCardNumber: string; // 银行卡号
  bankName: string; // 开户银行
  companyName: string; // 物业公司名称
  creditCode: string; // 物业公司统一社会信用代号
  estateId: number; // 小区id
  estateName: string; // 小区名称
  id: number; // 表id
  idCard: string; // 法人身份证号
  isEpiboly: number; // 是否外包 0-否 1-是
  legalEntity: string; // 法人姓名
  money: null | number; // 物业费用
  serveCostType: null | number; // 物业计费方式
  situationId: null | number; // 物业阶段
  type: null | number; // 物业类型
};

export type Property = {
  createTime: string; // 创建时间
} & PropertyCreate;

export type PropertyDetail = Property;

/** 获得小区 - 物业管理信息 */
export function getPropertyDetail(estateId: number) {
  return requestClient.get<PropertyDetail>('/estate/manage/get', {
    params: { estateId },
  });
}

/** 更新小区 - 物业管理信息 */
export function updatePropertyApi(data: PropertyCreate) {
  return requestClient.put<boolean>('/estate/manage/update', data);
}

export type PropertyStaffCreate = {
  contractEnd: number; // 合同结束日期
  contractStart: number; // 合同开始日期
  contractType: number; // 合同类型
  estateId: number; // 小区id
  hiredate: Dayjs | number; // 入职日期
  id: number; // 表id
  idCard: string; // 身份证号
  isPoliceReport: number; // 是否在所属派出所备案 0-否 1-是
  itemName: string; // 所属项目（小区名称）
  manageId: number; // 物业管理id
  name: string; // 姓名
  phone: string; // 手机号
  positionId: number; // 岗位类别
  sex: number; // 性别 0-男 1-女
};

export type PropertyStaff = {
  createTime: string; // 创建时间
} & PropertyStaffCreate;

export type PropertyStaffDetail = PropertyStaff;

/** 查询物业员工列表 */
export function getPropertyStaffPage(params: PageParam) {
  return requestClient.get<PageResult<PropertyStaff>>(
    '/estate/manage-staff/page',
    {
      params,
    },
  );
}

/** 获得物业员工详情 */
export function getPropertyStaffDetail(id: number) {
  return requestClient.get<PropertyStaffDetail>('/estate/manage-staff/get', {
    params: { id },
  });
}

/** 创建物业员工 */
export function createPropertyStaff(data: PropertyStaffCreate) {
  return requestClient.post<number>('/estate/manage-staff/create', data);
}

/** 更新物业员工 */
export function updatePropertyStaff(data: PropertyStaffCreate) {
  return requestClient.put<boolean>('/estate/manage-staff/update', data);
}

/** 删除物业员工 */
export function deletePropertyStaff(id: number) {
  return requestClient.delete<boolean>('/estate/manage-staff/delete', {
    params: { id },
  });
}

export type PropertySupervisorCreate = {
  birthday: Dayjs | number; // 出生日期
  certificateName: string; // 资格证书
  certificateNo: string; // 资格证书编号
  certificateUnit: string; // 发证单位
  educationId: number; // 学历
  estateId: number; // 小区id
  hiredate: Dayjs | number; // 入职日期
  id: number; // 表id
  itemName: string; // 所属项目（小区名称）
  manageId: number; // 物业管理id
  name: string; // 姓名
  phone: string; // 手机号
  politicsAffiliation: string; // 政治面貌
  positionName: string; // 职务
  sex: number; // 性别
  specialtyName: string; // 专业
};

export type PropertySupervisor = {
  createTime: string; // 创建时间
} & PropertySupervisorCreate;

export type PropertySupervisorDetail = PropertySupervisorCreate;

/** 获得小区 - 物业经理/物业负责人分页 */
export function getPropertySupervisorPage(params: PageParam) {
  return requestClient.get<PageResult<PropertySupervisor>>(
    '/estate/manage-supervisor/page',
    {
      params,
    },
  );
}

/** 获得小区 - 物业经理/物业负责人详情 */
export function getPropertySupervisorDetail(id: number) {
  return requestClient.get<PropertySupervisorDetail>(
    '/estate/manage-supervisor/get',
    {
      params: { id },
    },
  );
}

/** 创建小区 - 物业经理/物业负责人 */
export function createPropertySupervisor(data: PropertySupervisorCreate) {
  return requestClient.post<number>('/estate/manage-supervisor/create', data);
}

/** 更新小区 - 物业经理/物业负责人 */
export function updatePropertySupervisor(data: PropertySupervisorCreate) {
  return requestClient.put<boolean>('/estate/manage-supervisor/update', data);
}

/** 删除小区 - 物业经理/物业负责人 */
export function deletePropertySupervisor(id: number) {
  return requestClient.delete<boolean>('/estate/manage-supervisor/delete', {
    params: { id },
  });
}
