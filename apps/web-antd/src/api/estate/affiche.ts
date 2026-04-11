import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';
import type { FileItem } from '@vben/types';

import { requestClient } from '#/api/request';

export type AfficheCreate = {
  estateId: number; // 小区id
  estateName: string; // 小区名称
  id: number; // 表id
  isCompany: number; // 是否有物业企业公示情况{1：是，0：否}
  isFillout: number; // 是否填报信息公开与投诉纠纷{1：是，0：否}
  isOwner: number; // 是否有业主大会管理规约、议事规则公开公示情况{1：是，0：否}
  isServe: number; // 是否有物业服务公示情况{1：是，0：否}
};

export type Affiche = {
  createTime: number; // 创建时间
} & AfficheCreate;

export type AfficheDetail = Affiche;

/** 获得小区 - 信息公开与投诉 */
export function getAfficheDetail(estateId: number) {
  return requestClient.get<AfficheDetail>('/estate/affiche/get', {
    params: { estateId },
  });
}

/** 更新小区 - 信息公开与投诉 */
export function updateAfficheApi(data: AfficheCreate) {
  return requestClient.put<boolean>('/estate/affiche/update', data);
}

export type AfficheOwnerCreate = {
  afficheId: number; // 信息公开与投诉id
  channel: number; // 公示渠道
  discussRule: string; // 议事规则
  estateId: number; // 小区id
  fileIds: string; // 公示文件ids
  id: number; // 表id
  manageAgreement: string; // 管理规约
  showDay: Dayjs | number; // 公示日期
};

export type AfficheOwner = {
  createTime: number; // 创建时间
  fileList: FileItem[]; // 公示文件列表
} & AfficheOwnerCreate;

export type AfficheOwnerDetail = AfficheOwner;

/** 获得小区 - 业主大会管理规约、议事规则公开公示情况分页 */
export function getAfficheOwnerPage(params: PageParam) {
  return requestClient.get<PageResult<AfficheOwner>>(
    '/estate/affiche-owner/page',
    {
      params,
    },
  );
}

/** 获得小区 - 业主大会管理规约、议事规则公开公示情况详情 */
export function getAfficheOwnerDetail(id: number) {
  return requestClient.get<AfficheOwnerDetail>('/estate/affiche-owner/get', {
    params: { id },
  });
}

/** 创建小区 - 业主大会管理规约、议事规则公开公示情况 */
export function createAfficheOwner(data: AfficheOwnerCreate) {
  return requestClient.post<number>('/estate/affiche-owner/create', data);
}

/** 更新小区 - 业主大会管理规约、议事规则公开公示情况 */
export function updateAfficheOwner(data: AfficheOwnerCreate) {
  return requestClient.put<boolean>('/estate/affiche-owner/update', data);
}

/** 删除小区 - 业主大会管理规约、议事规则公开公示情况 */
export function deleteAfficheOwner(id: number) {
  return requestClient.delete<boolean>('/estate/affiche-owner/delete', {
    params: { id },
  });
}

export type AfficheCompanyCreate = {
  afficheId: number; // 信息公开与投诉id
  certificateFileIds: string; // 职业资格证书ids
  certificateNo: string; // 职业资格证书编号
  channel: number; // 公示渠道
  companyName: string; // 物业企业名称
  creditCode: string; // 统一社会信用代码
  estateId: number; // 小区id
  fileIds: string; // 公示文件ids
  id: number; // 表id
  licenseFileIds: string; // 营业执照ids
  mark: string; // 备注
  projectManager: string; // 项目经理姓名
  showDay: Dayjs | number; // 公示日期
};

export type AfficheCompany = {
  certificateFileList: FileItem[]; // 职业资格证书文件列表
  createTime: number; // 创建时间
  fileList: FileItem[]; // 公示文件列表
  licenseFileList: FileItem[]; // 营业执照文件列表
} & AfficheCompanyCreate;

export type AfficheCompanyDetail = AfficheCompany;

/** 获得小区 - 物业企业公示情况分页 */
export function getAfficheCompanyPage(params: PageParam) {
  return requestClient.get<PageResult<AfficheCompany>>(
    '/estate/affiche-company/page',
    {
      params,
    },
  );
}

/** 获得小区 - 物业企业公示情况详情 */
export function getAfficheCompanyDetail(id: number) {
  return requestClient.get<AfficheCompanyDetail>(
    '/estate/affiche-company/get',
    {
      params: { id },
    },
  );
}

/** 创建小区 - 物业企业公示情况 */
export function createAfficheCompany(data: AfficheCompanyCreate) {
  return requestClient.post<number>('/estate/affiche-company/create', data);
}

/** 更新小区 - 物业企业公示情况 */
export function updateAfficheCompany(data: AfficheCompanyCreate) {
  return requestClient.put<boolean>('/estate/affiche-company/update', data);
}

/** 删除小区 - 物业企业公示情况 */
export function deleteAfficheCompany(id: number) {
  return requestClient.delete<boolean>('/estate/affiche-company/delete', {
    params: { id },
  });
}

export type AfficheServeCreate = {
  afficheId: number; // 信息公开与投诉id
  cityRank: number; // 全市排名
  estateId: number; // 小区id
  evalDay: Dayjs | number; // 考评时间
  evalUnit: string; // 考评单位
  fileIds: string; // 公示文件ids
  id: number; // 表id
  mainDecItems: string; // 主要扣分项
  mark: string; // 备注
  point: number; // 考评分数
  rectificationMeasures: string; // 整改措施
  typeTxt: string; // 上榜类型
};

export type AfficheServe = {
  createTime: number; // 创建时间
  fileList: FileItem[]; // 公示文件列表
} & AfficheServeCreate;

export type AfficheServeDetail = AfficheServe;

/** 获得小区 - 物业服务公示情况分页 */
export function getAfficheServePage(params: PageParam) {
  return requestClient.get<PageResult<AfficheServe>>(
    '/estate/affiche-serve/page',
    {
      params,
    },
  );
}

/** 获得小区 - 物业服务公示情况详情 */
export function getAfficheServeDetail(id: number) {
  return requestClient.get<AfficheServeDetail>('/estate/affiche-serve/get', {
    params: { id },
  });
}

/** 创建小区 - 物业服务公示情况 */
export function createAfficheServe(data: AfficheServeCreate) {
  return requestClient.post<number>('/estate/affiche-serve/create', data);
}

/** 更新小区 - 物业服务公示情况 */
export function updateAfficheServe(data: AfficheServeCreate) {
  return requestClient.put<boolean>('/estate/affiche-serve/update', data);
}

/** 删除小区 - 物业服务公示情况 */
export function deleteAfficheServe(id: number) {
  return requestClient.delete<boolean>('/estate/affiche-serve/delete', {
    params: { id },
  });
}
