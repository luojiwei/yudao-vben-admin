import { requestClient } from '#/api/request';

export type AutonomyCreate = {
  accountNo: string; // 账号
  autonomyType: null | number; // 自治类型{1：自管，2：聘请}
  estateId: number; // 小区id
  estateName: string; // 小区名称
  id: number; // 表id
  isOpenAccount: number; // 是否开启账户 0-否 1-是
  manageName: string; // 业委会负责人
  managePhone: string; // 业委会负责人手机号
  openBank: string; // 开户行
  openMember: string; // 开户人
  openPhone: string; // 开户人手机号
  status: number; // 业委会组建情况{1：成立，2：筹备，3：未成立}
  type: null | number; // 业委会类型{1：业委会，2：物管会}
};

export type Autonomy = {
  createTime: string; // 创建时间
} & AutonomyCreate;

export type AutonomyDetail = Autonomy;

/** 获得小区 - 业主自治管理 */
export function getAutonomyDetail(estateId: number) {
  return requestClient.get<AutonomyDetail>('/estate/owner-autonomy/get', {
    params: { estateId },
  });
}

/** 更新小区 - 业主自治管理 */
export function updateAutonomyApi(data: AutonomyCreate) {
  return requestClient.put<boolean>('/estate/owner-autonomy/update', data);
}
