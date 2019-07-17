import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../auth/user.entity';
import { DataStoredInToken } from '../interfaces/dataStoredInToken.interface';
import { WrongAuthenticationTokenException } from '../exceptions/WrongAuthenticationTokenException';
import { AuthenticationTokenMissingException } from '../exceptions/AuthenticationTokenMissingException';
import { HttpException } from '../exceptions/HttpException';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = getRepository(User);
  const token = req.header('x-auth-token');

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;

      if (secret) {
        const decoded = jwt.verify(token, secret) as DataStoredInToken;
        const user = await userRepository.findOne(decoded.id);
        if (user) {
          req.user = user;
          next();
        } else {
          next(new WrongAuthenticationTokenException());
        }
      }
    } catch (e) {
      next(new WrongAuthenticationTokenException());
    }
  } else next(new AuthenticationTokenMissingException());
};

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const cookies = req.cookies;
//   const userRepository = getRepository(User);
//   if (cookies && cookies.Authorization) {
//     const secret = process.env.JWT_SECRET;
//     if (secret) {
//       try {
//         const verificationResponse = jwt.verify(
//           cookies.Authorization,
//           secret
//         ) as DataStoredInToken;
//         const id = verificationResponse.id;
//         const user = await userRepository.findOne(id);
// if (user) {
//   req.user = user;
//   next();
// } else {
//   next(new WrongAuthenticationTokenException());
// }
//       } catch (error) {
//         next(new WrongAuthenticationTokenException());
//       }
//     } else {
//       throw new HttpException(500, 'Something goes wrong');
//     }
//   } else {
//     next(new AuthenticationTokenMissingException());
//   }
// };
