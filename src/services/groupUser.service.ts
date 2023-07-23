import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { GroupUser } from '@/interfaces/groupUser.interface';
import { GroupUserEntity } from '@/entities/groupUser.entity';

@Service()
@EntityRepository()
export class GroupUserService extends Repository<GroupUserEntity> {
  // find all groupUsers
  public async findAllGroupUsers(): Promise<GroupUser[]> {
    const groupUsers: GroupUser[] = await GroupUserEntity.find();
    return groupUsers;
  }

  // find groupUser by id
  public async findGroupUserById(GroupUserId: number): Promise<GroupUser> {
    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { id: GroupUserId } });
    if (!findGroupUser) throw new HttpException(409, "GroupUser doesn't exist");

    return findGroupUser;
  }

  // find groupUser by groupID and userId
  public async findGroupUserPair(GroupId: string, UserId: number): Promise<GroupUser> {
    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { groupID: GroupId, userId: UserId } });
    if (!findGroupUser) throw new HttpException(409, "GroupUser doesn't exist");
    
    return findGroupUser;
    }

  // create groupUser
  public async createGroupUser(GroupUserData: GroupUser): Promise<GroupUser> {
    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { groupID: GroupUserData.groupID, userId: GroupUserData.userId } });
    if (findGroupUser) throw new HttpException(409, `This groupID ${GroupUserData.groupID} and userId ${GroupUserData.userId} already exists`);

    const createGroupUserData: GroupUser = await GroupUserEntity.create({ ...GroupUserData }).save();

    return createGroupUserData;
    }

  // update groupUser
  public async updateGroupUser(GroupUserId: number, GroupUserData: GroupUser): Promise<GroupUser> {
    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { id: GroupUserId } });
    if (!findGroupUser) throw new HttpException(409, "GroupUser doesn't exist");

    await GroupUserEntity.update(GroupUserId, { ...GroupUserData });

    const updateGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { id: GroupUserId } });

    return updateGroupUser;
  }

  // delete groupUser
  public async deleteGroupUser(GroupUserId: number): Promise<GroupUser> {
    const findGroupUser: GroupUser = await GroupUserEntity.findOne({ where: { id: GroupUserId } });
    if (!findGroupUser) throw new HttpException(409, "GroupUser doesn't exist");

    await GroupUserEntity.delete({ id: GroupUserId });
    return findGroupUser;
  }

}
