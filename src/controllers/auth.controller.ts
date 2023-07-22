import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      const verifactionLink = await this.auth.generateVerificationLink(signUpUserData);

      res.status(201).json({ data: signUpUserData, message: verifactionLink });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public sendResetPassword = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const resetPasswordLink = await this.auth.generateResetPasswordLink(userData);

      res.status(200).json({ data: userData, message: resetPasswordLink });
    } catch (error) {
      next(error);
    }
  };

  public verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const userData: User = await this.auth.verifyUserToken(token);
      res.status(200).json({ data: userData, message: 'verifyUser' });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const userData: User = await this.auth.resetPasswordWithToken(token, password);
      res.status(200).json({ data: userData, message: 'resetPassword' });
    } catch (error) {
      next(error);
    }
  };
}
