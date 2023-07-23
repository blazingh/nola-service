import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from '@/config';
import nodemailer from 'nodemailer';

class MailHelper {
  public static transporter = nodemailer.createTransport({
    // @ts-ignore
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });
}

export default MailHelper;
