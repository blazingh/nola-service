export interface User {
  id: number;
  email?: string;
  phone?: string;
  password: string;
  role: string;
  active: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  adminVerified?: boolean;
  resetPasswordToken?: string;
  verifyEmailToken?: string;
  verifyPhoneToken?: string;
}
