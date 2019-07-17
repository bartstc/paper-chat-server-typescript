import { port, cleanEnv } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port()
  });
};
