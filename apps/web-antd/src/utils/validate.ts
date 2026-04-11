import type { Rule } from 'ant-design-vue/es/form';

export const validateLongitude = (_rule: Rule, value: string) => {
  // 校验空
  if (!value) {
    return Promise.reject(new Error('请输入经度'));
  }
  // 校验范围
  const longitude = Number(value);
  if (longitude < -180 || longitude > 180) {
    return Promise.reject(new Error('经度必须在 -180 到 180 之间'));
  }
  // 校验小数位长度
  if (value.toString().includes('.')) {
    const arr = value.toString().split('.');
    if ((arr[1] || 0).toString().length > 6) {
      return Promise.reject(new Error('小数位长度不能大于6'));
    }
  }
  // 校验通过
  return Promise.resolve();
};

export const validateLatitude = (_rule: Rule, value: string) => {
  // 校验空
  if (!value) {
    return Promise.reject(new Error('请输入纬度'));
  }
  // 校验范围
  const latitude = Number(value);
  if (latitude < -90 || latitude > 90) {
    return Promise.reject(new Error('纬度必须在 -90 到 90 之间'));
  }
  // 校验小数位长度
  if (value.toString().includes('.')) {
    const arr = value.toString().split('.');
    if ((arr[1] || 0).toString().length > 6) {
      return Promise.reject(new Error('小数位长度不能大于6'));
    }
  }
  // 校验通过
  return Promise.resolve();
};
