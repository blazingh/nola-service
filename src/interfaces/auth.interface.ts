import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
  sub: string;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  adminVerified: boolean;
}

export interface DataStoredInGroupUserToken {
  id: number;
  sub: string;
  groupSub: string;
  role: string;
  groupRole: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  adminVerified: boolean;
  groupID: string;
}

export interface verifactionToken {
  type: string;
  sub: string;
  method: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
