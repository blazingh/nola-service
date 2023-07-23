import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
@EntityRepository()
export class UserService extends Repository<UserEntity> {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find();
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const findUser = await UserEntity.findOne({ where: { email } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    
    return findUser;
  }

  public async findUserByPhone(phone: string): Promise<User> {
    const findUser = await UserEntity.findOne({ where: { phone } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    
    return findUser;
  }

  public async createUser(userData: User): Promise<User> {

    const findUser = await UserEntity.findOne({ where: { email: userData.email } });

    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const findPhone = await UserEntity.findOne({ where: { phone: userData.phone } });

    if (findPhone) throw new HttpException(409, `This phone ${userData.phone} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();

    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser = await UserEntity.findOne({ where: { id: userId } });

    if (!updateUser) throw new HttpException(409, "User doesn't exist");

    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}
