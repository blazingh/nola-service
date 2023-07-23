import { ADMIN_ROLE, EXPIRES_IN, SECRET_KEY } from "@/config";
import { DataStoredInGroupUserToken, DataStoredInUserToken, TokenData, verifactionToken } from "@/interfaces/auth.interface";
import { GroupUser } from "@/interfaces/groupUser.interface";
import { User } from "@/interfaces/users.interface";
import { sign } from "jsonwebtoken";

export const createUserToken = (user: User): TokenData => {
    const dataStoredInToken: DataStoredInUserToken = {
      id: user.id,
      sub: user.id.toString(),
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      adminVerified: user.adminVerified,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn = EXPIRES_IN;
  
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  };
  
export  const createGroupUserToken = (user: User, groupUser: GroupUser): TokenData => {
    const dataStoredInToken: DataStoredInGroupUserToken = {
      id: user.id,
      sub: user.id.toString(),
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      adminVerified: user.adminVerified,
      groupID: groupUser.groupID,
      groupSub: groupUser.groupID.toString(),
      groupRole: groupUser.userRole,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn = EXPIRES_IN;
  
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  };
  
  
export  const createVerifactionToken = (user: User): string => {
    const dataStoredInToken: verifactionToken = {
      type: 'verification',
      sub: user.id.toString(),
      method: user.email ? 'email' : 'phone',
    };
  
    const secretKey: string = SECRET_KEY;
    const expiresIn = 15 * 60;
  
    const token = sign(dataStoredInToken, secretKey, { expiresIn });
  
    return token;
  };

export const createAdminToken = (): TokenData => {
    const dataStoredInToken: DataStoredInUserToken = {
      id: 1,
      sub: '1',
      role: ADMIN_ROLE,
      emailVerified: true,
      phoneVerified: true,
      adminVerified: true,
    };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 10 * 60;
  
    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

