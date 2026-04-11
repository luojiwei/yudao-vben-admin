import { defineStore } from 'pinia';

interface EstateState {
  estateId: number; // 小区id
  estateName: string; // 小区名称
  deviceId: number; // 公共部位及设备设施表id
  manageId: number; // 物业管理信息表id
  benefitId: number; // 公共收益资金表id
  afficheId: number; // 信息公开与投诉表id
}

const getDefaultEstate = (): EstateState => ({
  estateId: 0,
  estateName: '',
  deviceId: 0,
  manageId: 0,
  benefitId: 0,
  afficheId: 0,
});

export const useEstateStore = defineStore('estate', {
  state: () => {
    return {
      estateInfo: getDefaultEstate(),
    };
  },
  actions: {
    resetEstateInfo() {
      this.estateInfo = getDefaultEstate();
    },
  },
  persist: true,
});
