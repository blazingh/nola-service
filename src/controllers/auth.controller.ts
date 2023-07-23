import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import MailHelper from '@/utils/mailHelper';

export class AuthController {
  public auth = Container.get(AuthService);
  public transporter = MailHelper.transporter;

  // sign a user up
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

      res.status(201).json({ data: signUpUserData, message: mail.response });
    } catch (error) {
      next(error);
    }
  };

  // log a user in
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const { cookie, findUser } = await this.auth.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'user logged in' });
    } catch (error) {
      next(error);
    }
  };

  // log a user in to a group
  public logInToGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupID } = req.params;
      const userData: User = req.body;
      const { cookie, findUser, findGroupUser } = await this.auth.loginToGroup(userData, Number(groupID));

      res.setHeader('Set-Cookie', [cookie]);

      res.status(200).json({ data: { user: findUser, groupUser: findGroupUser }, message: 'user logged in to group' });

    } catch (error) {
      next(error);
    }
  };

  // log a user out
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'user logged out' });
    } catch (error) {
      next(error);
    }
  };

  // send reset password link to user email
  public sendResetPassword = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const resetPasswordLink = await this.auth.generateResetPasswordLink(userData);

      const mail = await this.transporter.sendMail({
        to: userData.email,
        subject: 'Reset Password',
        html: `<a href="${resetPasswordLink}">Reset Password</a>`,
      });

      res.status(200).json({ data: userData, message: mail.response });
    } catch (error) {
      next(error);
    }
  };

  // verify user email or phone
  public verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;
      const userData: User = await this.auth.verifyUserToken(token);
      res.status(200).json({ data: userData, message: 'user verified' });
    } catch (error) {
      next(error);
    }
  };

  // reset user passwordaa
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password, token } = req.body;
      const userData: User = await this.auth.resetPasswordWithToken(token, password);
      res.status(200).json({ data: userData, message: 'password reset' });
    } catch (error) {
      next(error);
    }
  };
}
