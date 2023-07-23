import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ADMIN_ROLE, SECRET_KEY } from '@config';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInUserToken } from '@interfaces/auth.interface';

const getAuthorization = (req: Request) => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(Authorization, SECRET_KEY || "")) as any as DataStoredInUserToken;
      const findUser = await UserEntity.findOne(id);

      if (findUser) {
        // @ts-ignore
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export const AdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (!Authorization) {
      next(new HttpException(404, 'Authentication token missing'));
    }

    const { role } = (await verify(Authorization, SECRET_KEY || "")) as any as DataStoredInUserToken;

    if (role !== ADMIN_ROLE) {
      next(new HttpException(401, 'Wrong authentication token'));
    } 
      next();
    
  } catch (error) {
    console.log(error);
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
  
