import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import MailHelper from '@/utils/mailHelper';

export class AuthController {
  public auth = Container.get(AuthService);
  public transporter = MailHelper.transporter;

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      const verifactionLink = await this.auth.generateVerificationLink(signUpUserData, 'email');

      const mail = await this.transporter.sendMail({
        to: signUpUserData.email,
        subject: 'Verify Email',
        html: `<a href="${verifactionLink}">Verify Email</a>`,
      });

      res.status(201).json({ data: signUpUserData, message: mail });
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

      const mail = await this.transporter.sendMail({
        to: userData.email,
        subject: 'Reset Password',
        html: `<a href="${resetPasswordLink}">Reset Password</a>`,
      });

      res.status(200).json({ data: userData, message: mail });
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
      const { password, token } = req.body;
      const userData: User = await this.auth.resetPasswordWithToken(token, password);
      res.status(200).json({ data: userData, message: 'resetPassword' });
    } catch (error) {
      next(error);
    }
  };
}
