import express from 'express';
import fsp from 'fs/promises';
import userRouter from './routes/users';

import { Client } from 'pg';

export const psql = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'shoofun',
    password: '1341'
});

const app = express();
const port = process.env.PORT || 3000;

// config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/user', userRouter);

app.listen(port, async () => {
    await psql.connect();

    const initSql = await fsp.readFile('./sql/init.sql', { encoding: 'utf8' });
    await psql.query(initSql);

    console.log(`Server is running on https://localhost:${port}/`);
});