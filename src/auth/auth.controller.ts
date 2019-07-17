import { Controller } from '../interfaces/controller.interface';
import express, { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { authMiddleware } from '../middlewares/authMiddleware';

export class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(CreateUserDTO),
      this.signUp
    );
    this.router.post(
      `${this.path}/signin`,
      validationMiddleware(LoginUserDTO),
      this.signIn
    );
    this.router.get(this.path, authMiddleware, this.getCurrentUser);
    // this.router.post(`${this.path}/logout`, this.logout);
  }

  private signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userData: CreateUserDTO = req.body;

    try {
      const authData = await this.authService.signUp(userData);
      res.status(200).json(authData);
    } catch (err) {
      next(err); // allows errorMiddleware to handle catched error
    }
  };

  private signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const loginData: LoginUserDTO = req.body;

    try {
      const authData = await this.authService.signIn(loginData);
      res.status(200).json(authData);
    } catch (err) {
      next(err);
    }
  };

  private getCurrentUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id, username }: User = req.user;
    res.status(200).json({ id, username });
  };

  // private logout = async (req: Request, res: Response): Promise<void> => {
  //   res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
  //   res.status(200).json({ success: true });
  // };
}
