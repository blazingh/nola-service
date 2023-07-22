import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
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
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
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
}
