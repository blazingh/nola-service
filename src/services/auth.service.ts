import { compare, hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { APP_URL, SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import {  TokenData, verifactionToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { GroupUserEntity } from '@/entities/groupUser.entity';
import { GroupUser } from '@/interfaces/groupUser.interface';
import { createGroupUserToken, createUserToken, createVerifactionToken } from '@/utils/tokenHelper';

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
@EntityRepository()
export class AuthService extends Repository<UserEntity> {

  // signup with email
  public async signupWithEmail(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });

    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);

    const createUserData: User = await UserEntity.create({
      ...userData,
      password: hashedPassword,
    }).save();

    return createUserData;
  }

  // signup with phone
  public async signupWithPhone(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { phone: userData.phone } });

    if (findUser) throw new HttpException(409, `This phone ${userData.phone} already exists`);

    const hashedPassword = await hash(userData.password, 10);

    const createUserData: User = await UserEntity.create({
      ...userData,
      password: hashedPassword,
    }).save();

    return createUserData;
  }

  // email login
  public async loginWithEmail(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });

    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createUserToken(findUser);

    const cookie = createCookie(tokenData);
  
    return { cookie, findUser };
  }

  // phone login
  public async loginWithPhone(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { phone: userData.phone } });
    
    if (!findUser) throw new HttpException(409, `This phone ${userData.phone} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createUserToken(findUser);

    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  // email login no password
  public async loginWithEmailNoPassword(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });

    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const tokenData = createUserToken(findUser);

    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  // phone login no password
  public async loginWithPhoneNoPassword(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { phone: userData.phone } });
    
    if (!findUser) throw new HttpException(409, `This phone ${userData.phone} was not found`);

    const tokenData = createUserToken(findUser);

    const cookie = createCookie(tokenData);

    return { cookie, findUser };

  }

  // login to group
  public async GroupLogin(userID: string, groupId: string): Promise<{ cookie: string; findUser: User, findGroupUser: GroupUser }> {
    
    const findUser: User = await UserEntity.findOne({ where: { id: userID } });

    if (!findUser) throw new HttpException(409, `This user ${userID} was not found`);

    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { groupID: groupId, userId: findUser.id } });

    if (!findGroupUser) throw new HttpException(409, `This user ${findUser.id} is not a member of group ${groupId}`);

    const tokenData = createGroupUserToken(findUser, findGroupUser);

    const cookie = createCookie(tokenData);

    return { cookie, findUser, findGroupUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  // generate a link to verify email or phone when the link is clicked, the user will be verified
  public async generateVerificationToken(userData: User, method: string): Promise<string> {
    if (method === 'email') {
      const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
      if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

      if (findUser.emailVerified) throw new HttpException(409, `This email ${userData.email} is already verified`);

      const verifactionToken = createVerifactionToken(findUser);

      await UserEntity.update(findUser.id, { ...findUser, verifyEmailToken: verifactionToken });

      return verifactionToken;
    }

    if (method === 'phone') {
      const findUser: User = await UserEntity.findOne({ where: { phone: userData.phone } });

      if (!findUser) throw new HttpException(409, `This phone ${userData.phone} was not found`);

      if (findUser.phoneVerified) throw new HttpException(409, `This phone ${userData.phone} is already verified`);

      const verifactionToken = createVerifactionToken(findUser);

      await UserEntity.update(findUser.id, { ...findUser, verifyEmailToken: verifactionToken });

      return verifactionToken;
    }

    throw new HttpException(409, `This method ${method} is not supported`);
  }

  // verify user email or phone with token generated by generateVerificationLink
  public async verifyUserWithToken(token: string): Promise<User> {
    const decodedToken = (await verify(token, SECRET_KEY)) as verifactionToken;

    const findUser: User = await UserEntity.findOne({ where: { id: decodedToken.sub } });

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (decodedToken.method === 'email') {
      if (findUser.emailVerified) throw new HttpException(409, 'User email is already verified');
      if (!findUser.verifyEmailToken || findUser.verifyEmailToken !== token) throw new HttpException(409, 'Invalid token');
      findUser.emailVerified = true;
      findUser.verifyEmailToken = null;
    }

    if (decodedToken.method === 'phone') {
      if (findUser.phoneVerified) throw new HttpException(409, 'User phone is already verified');
      if (!findUser.verifyPhoneToken || findUser.verifyPhoneToken !== token) throw new HttpException(409, 'Invalid token');
      findUser.phoneVerified = true;
      findUser.verifyPhoneToken = null;
    }

    await UserEntity.update(findUser.id, findUser);

    return findUser;
  }

  // generate a token  to reset user password when the link is clicked, the user will be able to reset password
  public async generateResetPasswordToken(userData: User): Promise<string> {
    const findUser: User = await UserEntity.findOne({ where: { id: userData.id } });

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const verifactionToken = createVerifactionToken(findUser);

    await UserEntity.update(findUser.id, { ...findUser, resetPasswordToken: verifactionToken });

    return verifactionToken;
  }

  // reset user password with token generated by generateResetPasswordLink
  public async resetPasswordWithToken(token: string, newPassword: string): Promise<User> {
    const decodedToken = (await verify(token, SECRET_KEY)) as verifactionToken;

    const findUser: User = await UserEntity.findOne({ where: { id: decodedToken.sub } });

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (!findUser.resetPasswordToken || findUser.resetPasswordToken !== token) throw new HttpException(409, 'Invalid token');

    const hashedPassword = await hash(newPassword, 10);

    findUser.password = hashedPassword;

    await UserEntity.update(findUser.id, { ...findUser, resetPasswordToken: null });

    return findUser;
  }
}
