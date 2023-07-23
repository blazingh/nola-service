import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { SettingEntity } from '@/entities/settings.entity';
import { Setting } from '@/interfaces/settings.interface';

@Service()
@EntityRepository()
export class SettingService extends Repository<SettingEntity> {
  public async findAllSetting(): Promise<Setting[]> {
    const settings: Setting[] = await SettingEntity.find();
    return settings;
  }

  public async findSettingById(SettingId: number): Promise<Setting> {
    const findSetting: Setting = await SettingEntity.findOne({ where: { id: SettingId } });
    if (!findSetting) throw new HttpException(409, "Setting doesn't exist");

    return findSetting;
  }

  public async findSettingByName(SettingName: string): Promise<Setting> {
    const findSetting: Setting = await SettingEntity.findOne({ where: { name: SettingName } });
    if (!findSetting) throw new HttpException(409, "Setting doesn't exist");

    return findSetting;
  }

  public async createSetting(SettingData: Setting): Promise<Setting> {
    const findSetting: Setting = await SettingEntity.findOne({ where: { name: SettingData.name } });
    if (findSetting) throw new HttpException(409, `This name ${SettingData.name} already exists`);

    const createSettingData: Setting = await SettingEntity.create({ ...SettingData }).save();

    return createSettingData;
  }

  public async updateSetting(SettingId: number, SettingData: Setting): Promise<Setting> {
    const findSetting: Setting = await SettingEntity.findOne({ where: { id: SettingId } });
    if (!findSetting) throw new HttpException(409, "Setting doesn't exist");

    await SettingEntity.update(SettingId, { ...SettingData });

    const updateSetting: Setting = await SettingEntity.findOne({ where: { id: SettingId } });
    return updateSetting;
  }

  public async deleteSetting(SettingId: number): Promise<Setting> {
    const findSetting: Setting = await SettingEntity.findOne({ where: { id: SettingId } });
    if (!findSetting) throw new HttpException(409, "Setting doesn't exist");

    await SettingEntity.delete({ id: SettingId });
    return findSetting;
  }
}
