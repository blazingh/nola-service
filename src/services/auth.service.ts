import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { APP_URL, EXPIRES_IN, SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData, verifactionToken } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    id: user.id,
    sub: user.id.toString(),
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    adminVerified: user.adminVerified,
  };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = EXPIRES_IN;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createVerifactionToken = (user: User): string => {
  const dataStoredInToken: verifactionToken = {
    type: 'verification',
    sub: user.id.toString(),
    method: user.email ? 'email' : 'phone',
  };

  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 15 * 60;

  const token = sign(dataStoredInToken, secretKey, { expiresIn });

  return token;
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
@EntityRepository()
export class AuthService extends Repository<UserEntity> {
  public async signup(userData: User): Promise<User> {
    // check if email exists or phone exists
    if (!userData.email && !userData.phone) throw new HttpException(409, 'Please provide email or phone');

    const findEmail: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findEmail) throw new HttpException(409, `This email ${userData.email} already exists`);

    const findPhone: User = await UserEntity.findOne({ where: { phone: userData.phone } });
    if (findPhone) throw new HttpException(409, `This phone ${userData.phone} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({
      ...userData,
      password: hashedPassword,
      role: 'athenticated',
      active: true,
      emailVerified: false,
      phoneVerified: false,
      adminVerified: false,
    }).save();
    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    // check if email exists or phone exists
    if (!userData.email && !userData.phone) throw new HttpException(409, 'Please provide email or phone');
    // return if both email and phone are provided
    if (userData.email && userData.phone) throw new HttpException(409, 'Please provide only email or phone');

    const searchField = userData.email ? 'email' : 'phone';

    const findUser: User = await UserEntity.findOne({ where: { [searchField]: userData[searchField] } });

    if (!findUser) throw new HttpException(409, `This ${searchField} ${userData[searchField]} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async generateVerificationLink(userData: User, method: string): Promise<string> {
    if (method === 'email') {
      const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
      if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

      if (findUser.emailVerified) throw new HttpException(409, `This email ${userData.email} is already verified`);

      const verifactionToken = createVerifactionToken(findUser);

      const verifacaionLink = `${APP_URL}/auth/verify/${verifactionToken}`;

      await UserEntity.update(findUser.id, { ...findUser, verifyEmailToken: verifactionToken });

      return verifacaionLink;
    }

    if (method === 'phone') {
      const findUser: User = await UserEntity.findOne({ where: { phone: userData.phone } });

      if (!findUser) throw new HttpException(409, `This phone ${userData.phone} was not found`);

      if (findUser.phoneVerified) throw new HttpException(409, `This phone ${userData.phone} is already verified`);

      const verifactionToken = createVerifactionToken(findUser);

      const verifacaionLink = `${APP_URL}/auth/verify/${verifactionToken}`;

      await UserEntity.update(findUser.id, { ...findUser, verifyEmailToken: verifactionToken });

      return verifacaionLink;
    }

    throw new HttpException(409, `This method ${method} is not supported`);
  }

  public async verifyUserToken(token: string): Promise<User> {
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

  public async generateResetPasswordLink(userData: User): Promise<string> {
    const findUser: User = await UserEntity.findOne({ where: { id: userData.id } });

    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const verifactionToken = createVerifactionToken(findUser);

    const verifacaionLink = `${APP_URL}/auth/reset-password/${verifactionToken}`;

    await UserEntity.update(findUser.id, { ...findUser, resetPasswordToken: verifactionToken });

    return verifacaionLink;
  }

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
