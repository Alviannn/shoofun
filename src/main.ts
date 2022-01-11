import express from 'express';
import fsp from 'fs/promises';
import dotenv from 'dotenv';

import userRouter from './routes/users.route';
import itemRouter from './routes/items.route';

import { Client } from 'pg';

dotenv.config();

const { env } = process;
const app = express();
const port = env.PORT || 3000;

export const psql = new Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT!),
    database: env.DB_DATABASE,
    user: env.DB_USER,
    password: env.DB_PASSWORD
});

// config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('v1/user', userRouter);
app.use('v1/item', itemRouter);

app.listen(port, async () => {
    await psql.connect();

    const initSql = await fsp.readFile('./sql/init.sql', { encoding: 'utf8' });
    await psql.query(initSql);

    console.log(`Server is running on http://localhost:${port}/`);
});