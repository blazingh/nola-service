import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { SettingService } from '@/services/settings.service';
import { GroupUserService } from '@/services/groupUser.service';

export class AdminController {
  public user = Container.get(UserService);
  public settings = Container.get(SettingService);
  public groupUser = Container.get(GroupUserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'found all users' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'found one' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'user created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated user' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted user' });
    } catch (error) {
      next(error);
    }
  };

  public updateSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settingsData = req.body;
      const updateSettingsData = await this.settings.updateSettings(settingsData);

      res.status(200).json({ data: updateSettingsData, message: 'updated settings' });
    } catch (error) {
      next(error);
    }
  }

    public getSettingByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const name = req.params.name;
        const settingsData = await this.settings.getSettingByName(name);
        
        res.status(200).json({ data: settingsData, message: 'found settings' });
    } catch (error) {
        next(error);
    }
    }

  public getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settingsData = await this.settings.getSettings();

      res.status(200).json({ data: settingsData, message: 'found settings' });
    } catch (error) {
      next(error);
    }
  }


    public getGroupUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUsersData = await this.groupUser.getGroupUsers();
        
        res.status(200).json({ data: groupUsersData, message: 'found group users' });
    } catch (error) {
        next(error);
    }
    }

    public getGroupUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUserId = Number(req.params.id);
        const groupUserData = await this.groupUser.getGroupUserById(groupUserId);
        
        res.status(200).json({ data: groupUserData, message: 'found group user' });
    } catch (error) {
        next(error);
    }
    }

    public createGroupUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUserData = req.body;
        const createGroupUserData = await this.groupUser.createGroupUser(groupUserData);
        
        res.status(201).json({ data: createGroupUserData, message: 'created group user' });
    } catch (error) {
        next(error);
    }
    }

    public updateGroupUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUserId = Number(req.params.id);
        const groupUserData = req.body;
        const updateGroupUserData = await this.groupUser.updateGroupUser(groupUserId, groupUserData);
        
        res.status(200).json({ data: updateGroupUserData, message: 'updated group user' });
    } catch (error) {
        next(error);
    }
    }

    public deleteGroupUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUserId = Number(req.params.id);
        const deleteGroupUserData = await this.groupUser.deleteGroupUser(groupUserId);

        res.status(200).json({ data: deleteGroupUserData, message: 'deleted group user' });
    } catch (error) {
        next(error);
    }
    }

    public getGroupUserPair = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const groupUserId = Number(req.params.id);
        const groupUserData = await this.groupUser.getGroupUserPair(groupUserId);
        
        res.status(200).json({ data: groupUserData, message: 'found group user pair' });
    } catch (error) {
        next(error);
    }
    }


}
