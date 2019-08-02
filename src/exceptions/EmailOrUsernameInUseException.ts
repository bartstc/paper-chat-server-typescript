import { HttpException } from './HttpException';

export class EmailOrUsernameInUseException extends HttpException {
  constructor() {
    super(400, `email or username already taken`);
  }
}
