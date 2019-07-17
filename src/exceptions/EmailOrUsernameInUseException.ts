import { HttpException } from './HttpException';

export class EmailOrUsernameInUseException extends HttpException {
  constructor() {
    super(400, `User with email or username already exists`);
  }
}
