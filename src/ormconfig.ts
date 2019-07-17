import { ConnectionOptions } from 'typeorm';
import { Document } from './documents/document.entity';
import { User } from './auth/user.entity';

// const config: ConnectionOptions = {
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: Number(process.env.POSTGRES_PORT),
//   username: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   synchronize: true, // false in production
//   // entities: [__dirname + '/../**/*.entity{.ts,.js}']
//   entities: [Document, User]
// };

const config: ConnectionOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  entities: [Document, User],
  synchronize: process.env.NODE_ENV === 'production' ? false : true
};

export = config;
// alt: https://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
