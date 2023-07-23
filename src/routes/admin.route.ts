import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminMiddleware } from '@/middlewares/auth.middleware';
import { AdminController } from '@/controllers/admin.controller';
import { AdminCreateUserDto, AdminUpdateSettingDto } from '@/dtos/admin.dto';


export class UserRoute implements Routes {
  public path = '/admin';
  public router = Router();
  public adminControler = new AdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // get all users
    this.router.get(`${this.path}/user`, AdminMiddleware, this.adminControler.getUsers);
    // get user by id
    this.router.get(`${this.path}/user/:id`, AdminMiddleware, this.adminControler.getUserById);
    // create user
    this.router.post(`${this.path}/user`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.createUser);
    // update user
    this.router.put(`${this.path}/user/:id`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.updateUser);
    // delete user
    this.router.delete(`${this.path}/user/:id`, AdminMiddleware, this.adminControler.deleteUser);

    // get all settings
    this.router.get(`${this.path}/setting`, AdminMiddleware, this.adminControler.getSettings);
    // get setting by name
    this.router.get(`${this.path}/setting/:name`, AdminMiddleware, this.adminControler.getSettingByName);
    // update setting
    this.router.put(`${this.path}/setting/:id`, AdminMiddleware, ValidationMiddleware(AdminUpdateSettingDto), this.adminControler.updateSetting);

    // get all group users
    this.router.get(`${this.path}/group-user`, AdminMiddleware, this.adminControler.getGroupUsers);
    // get group user by id 
    this.router.get(`${this.path}/group-user/:id`, AdminMiddleware, this.adminControler.getGroupUserById);
    // create group user
    this.router.post(`${this.path}/group-user`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.createGroupUser);
    // update group user
    this.router.put(`${this.path}/group-user/:id`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.updateGroupUser);
    // delete group user
    this.router.delete(`${this.path}/group-user/:id`, AdminMiddleware, this.adminControler.deleteGroupUser);

  }
}
