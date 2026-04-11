interface BasicOption {
  label: string;
  value: string;
}

type SelectItem = {
  id: number;
  name: string;
};

type TreeNode = {
  children?: TreeNode[];
  id: number;
  name: string;
};

type FileItem = {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
};

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

type ClassType = Array<object | string> | object | string;

export type {
  BasicOption,
  BasicUserInfo,
  ClassType,
  FileItem,
  SelectItem,
  SelectOption,
  TabOption,
  TreeNode,
};
