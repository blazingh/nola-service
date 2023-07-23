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
    this.router.get(`${this.path}/user`, AdminMiddleware, this.adminControler.getUsers);
    this.router.get(`${this.path}/user/:id`, AdminMiddleware, this.adminControler.getUserById);
    this.router.post(`${this.path}/user`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.createUser);
    this.router.put(`${this.path}/user/:id`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.updateUser);
    this.router.delete(`${this.path}/user/:id`, AdminMiddleware, this.adminControler.deleteUser);

    this.router.get(`${this.path}/settings`, AdminMiddleware, this.adminControler.getSettings);
    this.router.get(`${this.path}/settings/:name`, AdminMiddleware, this.adminControler.getSettingByName);
    this.router.put(`${this.path}/settings/:id`, AdminMiddleware, ValidationMiddleware(AdminUpdateSettingDto), this.adminControler.updateSetting);

    this.router.get(`${this.path}/group-user`, AdminMiddleware, this.adminControler.getGroupUsers);
    this.router.get(`${this.path}/group-user/:id`, AdminMiddleware, this.adminControler.getGroupUserById);
    this.router.post(`${this.path}/group-user`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.createGroupUser);
    this.router.put(`${this.path}/group-user/:id`, AdminMiddleware, ValidationMiddleware(AdminCreateUserDto), this.adminControler.updateGroupUser);
    this.router.delete(`${this.path}/group-user/:id`, AdminMiddleware, this.adminControler.deleteGroupUser);

  }
}
