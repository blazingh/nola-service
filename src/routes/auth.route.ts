import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, NewPasswordDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto), this.auth.signUp);
    this.router.post(`${this.path}/login`, ValidationMiddleware(CreateUserDto), this.auth.logIn);
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.auth.logOut);
    this.router.get(`${this.path}/verify/:token`, this.auth.verifyUser);
    this.router.post(`${this.path}/reset-password/:token`, ValidationMiddleware(NewPasswordDto), this.auth.resetPassword);
    this.router.get(`${this.path}/send-reset-password`, AuthMiddleware, this.auth.sendResetPassword);
  }
}
