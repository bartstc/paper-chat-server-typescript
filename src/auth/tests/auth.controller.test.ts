import * as typeorm from 'typeorm';
import request from 'supertest';
import { CreateUserDTO } from '../dto/create-user.dto';
import { AuthController } from '../auth.controller';
import { App } from '../../app';
import { LoginUserDTO } from '../dto/login-user.dto';

describe('AuthService', () => {
  describe('when registering a user', () => {
    describe('if both username and email are not taken', () => {
      it('should return response with status code equal 200', async () => {
        const userData: CreateUserDTO = {
          email: 'johndoe@gmail.com',
          username: 'JohnDoe',
          password: 'Password123$'
        };

        process.env.JWT_SECRET = 'jwt_secret'; // env variables must be provided
        (typeorm as any).getRepository = jest.fn(() => ({
          createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValueOnce(undefined)
          })),
          create: () => ({ id: 0, ...userData }),
          save: () => ({ id: 0, ...userData }) // if we expect to return a value
        }));

        const authController = new AuthController();
        const app = new App([authController]);

        return request(app.getServer())
          .post(`${authController.path}/signup`)
          .send(userData)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });
  });

  // describe('when the user logs on', () => {
  //   describe('if user was found', () => {
  //     it('should return response with status code equal 200', async () => {
  //       const loginData: LoginUserDTO = {
  //         email: 'johndoe@gmail.com',
  //         password: 'Password123$'
  //       };

  //       process.env.JWT_SECRET = 'jwt_secret';
  //       (typeorm as any).getRepository = jest.fn(() => ({
  //         findOne: () => Promise.resolve(loginData)
  //       }));

  //       const authController = new AuthController();
  //       const app = new App([authController]);

  //       return request(app.getServer())
  //         .post(`${authController.path}/signin`)
  //         .send(loginData)
  //         .expect(200);
  //     });
  //   });
  // });

  describe('when user is not authenticated', () => {
    it('should return an error with status code 401 (authentication token is missing)', () => {
      const authController = new AuthController();
      const app = new App([authController]);

      return request(app.getServer())
        .get(`${authController.path}`)
        .expect(401);
    });
  });
});
