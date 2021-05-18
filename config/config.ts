import * as dotenv  from 'dotenv';
dotenv.config();


const {
    PORT,
    DATABASE_URL,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    NODE_ENV
} = process.env;

export const port: any = PORT;
export const databaseUrl: any = DATABASE_URL;
export const jwtAccessSecret: any = JWT_ACCESS_SECRET;
export const jwtRefreshSecret: any = JWT_REFRESH_SECRET;
export const nodeEnv: any = NODE_ENV;
