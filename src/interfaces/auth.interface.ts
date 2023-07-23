import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
  sub: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  adminVerified: boolean;
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
