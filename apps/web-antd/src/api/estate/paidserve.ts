import { requestClient } from '#/api/request';

export type PaidServeCreate = {
  applianceRepairContent: string; // 家电维修内容
  applianceRepairFee: string; // 家电维修收费
  childCareContent: string; // 儿童托管内容
  childCareFee: string; // 儿童托管收费
  elderlyCareContent: string; // 居家养老护理内容
  elderlyCareFee: string; // 居家养老护理收费
  estateId: number; // 小区id
  estateName: string; // 小区名称
  housekeepingContent: string; // 家政保洁内容
  housekeepingFee: string; // 家政保洁收费
  id: number; // 表id
  otherPaidServiceContent: string; // 其他有偿服务内容
  otherPaidServiceFee: string; // 其他有偿服务收费
  pipeUnclogContent: string; // 疏通管道内容
  pipeUnclogFee: string; // 疏通管道收费
  seniorCanteenContent: string; // 老年食堂内容
  seniorCanteenFee: string; // 老年食堂收费
  weddingServiceContent: string; // 婚庆服务内容
  weddingServiceFee: string; // 婚庆服务收费
};

export type PaidServe = {
  createTime: string; // 创建时间
} & PaidServeCreate;

export type PaidServeDetail = PaidServe;

/** 获得小区 - 有偿服务 */
export function getPaidServeDetail(estateId: number) {
  return requestClient.get<PaidServeDetail>('/estate/paid-serve/get', {
    params: { estateId },
  });
}

/** 更新小区 - 有偿服务 */
export function updatePaidServeApi(data: PaidServeCreate) {
  return requestClient.put<boolean>('/estate/paid-serve/update', data);
}
