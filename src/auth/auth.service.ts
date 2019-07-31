import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { EmailOrUsernameInUseException } from '../exceptions/EmailOrUsernameInUseException';
import { HttpException } from '../exceptions/HttpException';
import { DataStoredInToken } from '../interfaces/dataStoredInToken.interface';
import { TokenData } from '../interfaces/tokenData.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { WrongCredentialsException } from '../exceptions/WrongCredentialException';

export class AuthService {
  private userRepository = getRepository(User);

  public async signUp(userData: CreateUserDTO) {
    const existingUser = await this.userRepository
      .createQueryBuilder()
      .where('username = :username OR email = :email', {
        username: userData.username,
        email: userData.email
      })
      .getMany();

    if (existingUser.length !== 0) throw new EmailOrUsernameInUseException();

    const newUser = this.userRepository.create({ ...userData });
    const savedUser = await this.userRepository.save(newUser);

    const user = { id: savedUser.id, username: savedUser.username };

    const { token } = this.createToken(savedUser);
    return { token, ...user };
  }

  public async signIn(loginData: LoginUserDTO) {
    const existingUser = await this.userRepository.findOne({
      email: loginData.email
    });
    if (existingUser) {
      const isMatch = await bcrypt.compare(
        loginData.password,
        existingUser.password
      );
      if (isMatch) {
        const user = { id: existingUser.id, username: existingUser.username };

        const { token } = this.createToken(existingUser);
        return { token, ...user };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id
    };

    if (secret) {
      const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
      return { token };
    } else throw new HttpException(500, 'Something goes wrong');
  }
}
