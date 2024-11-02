// 基础用户类型
export interface BaseUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
}

// 用于列表展示的用户类型
export interface User extends BaseUser {
  createdAt: string;
  lastLogin?: string;
}

// 用于详情展示的用户类型
export interface UserDetails extends User {
  role: string;
  avatar?: string;
}

// 用于编辑的用户类型
export interface UserEditData extends BaseUser {
  // 编辑时不需要 createdAt 和 lastLogin
}

// 用于创建的用户类型
export interface UserCreateData extends BaseUser {
  password: string;
  confirmPassword: string;
}

// 机构用户类型
export interface InstitutionUser extends User {
  institutionName: string;
  institutionType: string;
  verificationStatus: "pending" | "verified" | "rejected";
} 