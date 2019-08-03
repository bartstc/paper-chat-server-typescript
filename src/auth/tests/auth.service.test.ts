import * as typeorm from 'typeorm';
import { AuthService } from '../auth.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { EmailOrUsernameInUseException } from '../../exceptions/EmailOrUsernameInUseException';
import { LoginUserDTO } from '../dto/login-user.dto';
import { WrongCredentialsException } from '../../exceptions/WrongCredentialException';

/* example for query builder
 const mockRepo = jest.fn(() => ({
   save: async () => {},
   dispose: async () => {},
   createQueryBuilder: jest.fn(() => ({
     delete: jest.fn().mockReturnThis(),
     from: jest.fn().mockReturnThis(),
     where: jest.fn().mockReturnThis(),
     execute: jest.fn().mockReturnThis()
   }))
 }))();
*/

describe('AuthService', () => {
  describe('when registering a user', () => {
    describe('when creating a token', () => {
      it('should return a token', () => {
        const userId: number = 1;

        process.env.JWT_SECRET = 'jwt_secret';
        (typeorm as any).getRepository = jest.fn(() => ({}));
        const authService = new AuthService();
        expect(typeof authService.createToken(userId)).toEqual('string');
      });
    });

    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDTO = {
          email: 'johndoe@gmail.com',
          username: 'JohnDoe',
          password: 'password123'
        };

        // in the service we access a TypeORM repository, (connection returns error if we dont connect or mock),
        // we need to fake the TypeORM functionalities so that our unit tests do not attempt to connect to a real database
        (typeorm as any).getRepository = jest.fn(() => ({
          createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValueOnce(userData)
          }))
        }));

        const authService = new AuthService();
        await expect(
          authService.signUp({ ...userData, username: 'SamSmitch' })
        ).rejects.toMatchObject(new EmailOrUsernameInUseException());
      });
    });

    describe('if the username is already taken', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDTO = {
          email: 'johndoe@gmail.com',
          username: 'JohnDoe',
          password: 'password123'
        };

        (typeorm as any).getRepository = jest.fn(() => ({
          createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValueOnce(userData)
          }))
        }));

        const authService = new AuthService();
        await expect(
          authService.signUp({ ...userData, email: 'samsmitch@gmail.com' })
        ).rejects.toMatchObject(new EmailOrUsernameInUseException());
      });
    });

    describe('if both username and email are not taken', () => {
      it('should not throw an error', async () => {
        const userData: CreateUserDTO = {
          email: 'johndoe@gmail.com',
          username: 'JohnDoe',
          password: 'password123'
        };

        process.env.JWT_SECRET = 'jwt_secret'; // env variables must be provided
        (typeorm as any).getRepository = jest.fn(() => ({
          createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnValueOnce(undefined)
          })),
          create: () => ({ id: 0, ...userData }),
          // save: () => Promise.resolve(), // if we dont expect to return a value
          save: () => ({ id: 0, ...userData }) // if we expect to return a value
        }));

        const authService = new AuthService();
        await expect(authService.signUp(userData)).resolves.toBeDefined();
      });
    });
  });

  describe('when the user logs on', () => {
    describe('if user does not exist', () => {
      it('should throw an error', async () => {
        const loginData: LoginUserDTO = {
          email: 'johndoe@gmail.com',
          password: 'Password123$'
        };

        (typeorm as any).getRepository = jest.fn(() => ({
          findOne: () => Promise.resolve(undefined)
        }));

        const authService = new AuthService();
        await expect(authService.signIn(loginData)).rejects.toMatchObject(
          new WrongCredentialsException()
        );
      });
    });
  });
});
