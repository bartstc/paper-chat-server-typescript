import { ConnectionOptions } from 'typeorm';
import { Document } from './documents/document.entity';
import { User } from './auth/user.entity';

const developmentConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  // entities: [__dirname + '/../**/*.entity{.ts,.js}']
  entities: [Document, User]
};

const productionConfig: ConnectionOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL, // elephant DB with docker on VS
  // url: process.env.DATABASE_URL, // heroku db as addons
  entities: [Document, User],
  synchronize: false
};

export const config =
  // process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
  developmentConfig;
// conditional export: https://stackoverflow.com/questions/13444064/typescript-conditional-module-import-export
