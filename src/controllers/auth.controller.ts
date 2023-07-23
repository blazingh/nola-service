import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import MailHelper from '@/utils/mailHelper';
import { SettingEntity } from '@/entities/settings.entity';
import { settingsOptions } from '@/enums/settings';
import { APP_URL } from '@/config';
import { HttpException } from '@/exceptions/httpException';

export class AuthController {
  public auth = Container.get(AuthService);
  public transporter = MailHelper.transporter;

  // sign a user up
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const method = req.params.method;

      if (method === 'email') {
        const EmailSignup = await SettingEntity.findOne({ where: { name: settingsOptions.DISABLE_EMAIL_SIGNUP } });

        if (EmailSignup?.value === "true" ) throw new HttpException(403, 'Email signup is disabled');

        const signUpUserData: User = await this.auth.signupWithEmail(userData);

        const verifactionToken = await this.auth.generateVerificationToken(signUpUserData, 'email');

        const verifactionLink = `${APP_URL}/${verifactionToken}`;

        const mail = await this.transporter.sendMail({
          to: signUpUserData.email,
          subject: 'Verify Email',
          html: `<a href="${verifactionLink}">Verify Email</a>`,
        });

        res.status(201).json({ data: signUpUserData, message: mail.response, token: verifactionToken });
        return;
      }
      if (method === 'phone') {
        const PhoneSignup = await SettingEntity.findOne({ where: { name: settingsOptions.DISABLE_PHONE_SIGNUP } });

        if (PhoneSignup?.value === 'true') throw new HttpException(403, 'Phone signup is disabled');

        const signUpUserData: User = await this.auth.signupWithPhone(userData);

        const verifactionToken = await this.auth.generateVerificationToken(signUpUserData, 'phone');

        const verifactionLink = `${APP_URL}/${verifactionToken}`;

        res.status(201).json({ data: signUpUserData, message: verifactionLink, token: verifactionToken });
      return;
      }

      throw new HttpException(403, 'Invalid signup method');

    } catch (error) {
      next(error);
    }
  };

  // log a user in
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const method = req. params.method;
      
      if (method === 'email') {
        const EmailLogin = await SettingEntity.findOne({ where: { name: settingsOptions.DISABLE_EMAIL_LOGIN } });

        const UnverifiedEmailLogin = await SettingEntity.findOne({ where: { name: settingsOptions.ALLOW_UNVERIFIED_EMAIL_LOGIN } });

        if (EmailLogin?.value === 'true') throw new HttpException(403, 'Email login is disabled');
        
        const { cookie, findUser } = await this.auth.loginWithEmail(userData);

        if (UnverifiedEmailLogin?.value === 'false' && !findUser.emailVerified) throw new HttpException(403, 'Email is not verified');

        res.setHeader('Set-Cookie', [cookie]);
        res.status(200).json({ data: findUser, message: 'user logged in' });
      }
      if (method === 'phone') {
        const PhoneLogin = await SettingEntity.findOne({ where: { name: settingsOptions.DISABLE_PHONE_LOGIN } });

        if (PhoneLogin?.value === 'true') throw new HttpException(403, 'Phone login is disabled');

        const { cookie, findUser } = await this.auth.loginWithPhone(userData);


      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: findUser, message: 'user logged in' });
      }

      throw new HttpException(403, 'Invalid login method');

    } catch (error) {
      next(error);
    }
  };

  // log a user in to a group
  public GroupLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupID } = req.params;
      const userData: User = req.body;
      const { cookie, findUser, findGroupUser } = await this.auth.GroupLogin(userData.id || 0 , groupID);

      res.setHeader('Set-Cookie', [cookie]);

      res.status(200).json({ data: { user: findUser, groupUser: findGroupUser }, message: 'user logged in to group' });

    } catch (error) {
      next(error);
    }
  };

  // log a user out
  public logOut = async (req : Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = req as RequestWithUser;
      const userData: User = request.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'user logged out' });
    } catch (error) {
      next(error);
    }
  };

  // send reset password link to user email
  public sendResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = req as RequestWithUser;
      const userData: User = request.user;
      const resetPasswordToken = await this.auth.generateResetPasswordToken(userData);

      const resetPasswordLink = `${APP_URL}/reset-password/${resetPasswordToken}`;

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
      const userData: User = await this.auth.verifyUserWithToken(token);
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
