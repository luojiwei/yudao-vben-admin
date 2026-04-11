import type { PageParam, PageResult } from '@vben/request';
import type { FileItem } from '@vben/types';

import { requestClient } from '#/api/request';

export type BenefitCreate = {
  accountName: string; // 账户名称
  accountType: null | number; // 账户类型
  bankNo: string; // 银行账号
  contractFileIds: string; // 合同文件id列表
  estateId: number; // 小区id
  estateName: string; // 小区名称
  groundFee: null | number; // 地面停车位收费标准（元/每个每月）
  groundNum: null | number; // 地面停车位数
  id: number; // 表id
  isAloneAccount: number; // 是否单独账户 0-否 1-是
  isAloneBill: number; // 是否单独列账 0-否 1-是
  isCommonIncome: number; // 是否有小区共管收益 0-否 1-是
  isExistBenefit: number; // 是否存在公共收益资金 0-否 1-是
  manageIdentity: string; // 资金管理人身份
  manageName: string; // 资金管理人姓名
  managePhone: string; // 资金管理人手机号
  openBank: string; // 开户行
  preserveType: null | number; // 公共收益存放位置
};

export type Benefit = {
  createTime: number; // 创建时间
} & BenefitCreate;

export type BenefitDetail = {
  contractFileList: FileItem[]; // 合同文件列表
} & Benefit;

/** 获得小区 - 公共收益资金 */
export function getBenefitDetail(estateId: number) {
  return requestClient.get<BenefitDetail>('/estate/benefit/get', {
    params: { estateId },
  });
}

/** 更新小区 - 公共收益资金 */
export function updateBenefitApi(data: BenefitCreate) {
  return requestClient.put<boolean>('/estate/benefit/update', data);
}

export type BenefitDeviceCreate = {
  benefitId: number; // 公共收益资金id
  contractFileIds: string; // 合同文件id列表
  deviceType: number; // 设施类型
  estateId: number; // 小区id
  fee: number; // 收费标准（元）
  id: number; // 表id
  mark: string; // 备注
  num: number; // 设施数量
};

export type BenefitDevice = {
  contractFileList: FileItem[]; // 合同文件列表
  createTime: number; // 创建时间
} & BenefitDeviceCreate;

export type BenefitDeviceDetail = BenefitDevice;

/** 查询公共收益资金设备列表 */
export function getBenefitDevicePage(params: PageParam) {
  return requestClient.get<PageResult<BenefitDevice>>(
    '/estate/benefit-device/page',
    {
      params,
    },
  );
}

/** 获得公共收益资金设备详情 */
export function getBenefitDeviceDetail(id: number) {
  return requestClient.get<BenefitDeviceDetail>('/estate/benefit-device/get', {
    params: { id },
  });
}

/** 创建公共收益资金设备 */
export function createBenefitDevice(data: BenefitDeviceCreate) {
  return requestClient.post<number>('/estate/benefit-device/create', data);
}

/** 更新公共收益资金设备 */
export function updateBenefitDevice(data: BenefitDeviceCreate) {
  return requestClient.put<boolean>('/estate/benefit-device/update', data);
}

/** 删除公共收益资金设备 */
export function deleteBenefitDevice(id: number) {
  return requestClient.delete<boolean>('/estate/benefit-device/delete', {
    params: { id },
  });
}

export type BenefitIncomeCreate = {
  actFee: number; // 应收金额（元）
  benefitId: number; // 公共收益资金id
  certificateNo: string; // 收款凭证号及银行流水
  contractEnd: number; // 合同结束时间
  contractNo: string; // 合同编号
  contractStart: number; // 合同开始时间
  estateId: number; // 小区id
  fee: number; // 收费标准（元）
  feeType: number; // 收款方式
  id: number; // 表id
  incomeType: number; // 收益类型
  incomeUseType: number; // 收益用途类型
  itemName: string; // 所属项目（小区名称）
  mark: string; // 备注
  num: number; // 数量
  publicType: number; // 公示方式
  signUnit: string; // 签约单位
  updaterName: string; // 经办人
};

export type BenefitIncome = {
  createTime: number; // 创建时间
} & BenefitIncomeCreate;

export type BenefitIncomeDetail = BenefitIncome;

/** 获得小区 - 共管收益分页 */
export function getBenefitIncomePage(params: PageParam) {
  return requestClient.get<PageResult<BenefitIncome>>(
    '/estate/benefit-income/page',
    {
      params,
    },
  );
}

/** 获得小区 - 共管收益 */
export function getBenefitIncomeDetail(id: number) {
  return requestClient.get<BenefitIncomeDetail>('/estate/benefit-income/get', {
    params: { id },
  });
}

/** 创建小区 - 共管收益 */
export function createBenefitIncome(data: BenefitIncomeCreate) {
  return requestClient.post<number>('/estate/benefit-income/create', data);
}

/** 更新小区 - 共管收益 */
export function updateBenefitIncome(data: BenefitIncomeCreate) {
  return requestClient.put<boolean>('/estate/benefit-income/update', data);
}

/** 删除小区 - 共管收益 */
export function deleteBenefitIncome(id: number) {
  return requestClient.delete<boolean>('/estate/benefit-income/delete', {
    params: { id },
  });
}
