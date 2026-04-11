/** ========== COMMON - 通用模块 ========== */
const COMMON_DICT = {
  USER_TYPE: 'user_type',
  COMMON_STATUS: 'common_status',
  TERMINAL: 'terminal', // 终端
  DATE_INTERVAL: 'date_interval', // 数据间隔
} as const;

/** ========== SYSTEM - 系统模块 ========== */
const SYSTEM_DICT = {
  SYSTEM_USER_SEX: 'system_user_sex',
  SYSTEM_MENU_TYPE: 'system_menu_type',
  SYSTEM_ROLE_TYPE: 'system_role_type',
  SYSTEM_DATA_SCOPE: 'system_data_scope',
  SYSTEM_NOTICE_TYPE: 'system_notice_type',
  SYSTEM_LOGIN_TYPE: 'system_login_type',
  SYSTEM_LOGIN_RESULT: 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE: 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE: 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS: 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS: 'system_sms_receive_status',
  SYSTEM_OAUTH2_GRANT_TYPE: 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS: 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE: 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE: 'system_social_type',
} as const;

/** ========== INFRA - 基础设施模块 ========== */
const INFRA_DICT = {
  INFRA_BOOLEAN_STRING: 'infra_boolean_string',
  INFRA_BOOLEAN_NUMBER: 'infra_boolean_number',
  INFRA_JOB_STATUS: 'infra_job_status',
  INFRA_JOB_LOG_STATUS: 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS: 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE: 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE: 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE: 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE: 'infra_codegen_scene',
  INFRA_FILE_STORAGE: 'infra_file_storage',
  INFRA_OPERATE_TYPE: 'infra_operate_type',
} as const;

const ESTATE_DICT = {
  ESTATE_OWNERERSHOP_STATUS: 'estate_ownershop_status', // 物业所属情况
  ESTATE_FACILITY_TYPE: 'estate_facility_type', // 设备属性
  ESTATE_DEVICE_ELEVATOR_TYPE: 'estate_device_elevator_type', // 电梯设备类型
  ESTATE_DEVICE_FIRE_TYPE: 'estate_device_fire_type', // 消防设备类型
  ESTATE_DEVICE_OTHER_TYPE: 'estate_device_other_type', // 其他设备类型
  ESTATE_DEVICE_USE_STATUS: 'estate_device_use_status', // 设备使用情况
  ESTATE_PROPERTY_TYPE: 'estate_property_type', // 物业类型
  ESTATE_PROPERTY_CHARGE_MODE: 'estate_property_charge_mode', // 物业计费方式
  ESTATE_PROPERTY_STAGE: 'estate_property_stage', // 物业阶段
  ESTATE_DIPLOMA_TYPE: 'estate_diploma_type', // 学历类型
  ESTATE_POL_AFFILIATION_TYPE: 'estate_political_affiliation_type', // 政治面貌类型
  ESTATE_POSITION_TYPE: 'estate_position_type', // 岗位类型
  ESTATE_CONTRACT_TYPE: 'estate_contract_type', // 合同类型
  ESTATE_OWNERERS_COMMITTEE_STATUS: 'estate_owners_committee_status', // 业委会组建情况
  ESTATE_OWNERERS_COMMITTEE_TYPE: 'estate_owners_committee_type', // 业委会类型
  ESTATE_OWNERERS_AUTONOMOUS_TYPE: 'estate_owners_autonomous_type', // 业主自治类型
  ESTATE_BENEFIT_DEPOSIT_TYPE: 'estate_benefit_deposit_type', // 公共收益存放位置
  ESTATE_BENEFIT_ACCOUNT_TYPE: 'estate_benefit_account_type', // 公共收益账户类型
  ESTATE_BENEFIT_DEVICE_TYPE: 'estate_benefit_device_type', // 公共收益设备类型
  ESTATE_BENEFIT_INCOME_TYPE: 'estate_benefit_income_type', // 公共收益收入类型
  ESTATE_BENEFIT_INCOME_USE_TYPE: 'estate_benefit_income_use_type', // 公共收益用途类型
  ESTATE_BENEFIT_RECEIPT_TYPE: 'estate_benefit_receipt_type', // 公共收益收款方式
  ESTATE_BENEFIT_PUBLIC_TYPE: 'estate_benefit_public_type', // 公共收益公示方式
  ESTATE_AFFICHE_PUBLIC_CHANNEL: 'estate_affiche_public_channel', // 信息公开公示渠道
} as const;

/** 字典类型枚举 - 统一导出 */
const DICT_TYPE = {
  ...INFRA_DICT,
  ...SYSTEM_DICT,
  ...COMMON_DICT,
  ...ESTATE_DICT,
} as const;

export { DICT_TYPE };
