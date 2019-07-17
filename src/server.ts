import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as config from './ormconfig';
import { validateEnv } from './utils/validateEnv';
import { App } from './app';
import { DocumentsController } from './documents/document.controller';
import { AuthController } from './auth/auth.controller';
import { User } from './auth/user.entity';

// expand Request interface with a new property: user: User
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

validateEnv();

(async (): Promise<void> => {
  try {
    const connection = await createConnection(config);
    console.log(`Is connected: ${connection.isConnected}`);
  } catch (err) {
    console.log('Error while connecting to the database', err);
    return err;
  }

  const app = new App([new DocumentsController(), new AuthController()]);
  app.listen();
})();
