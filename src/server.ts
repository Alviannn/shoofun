import 'reflect-metadata';
import app from './app';
import { createConnection } from 'typeorm';

createConnection()
    .then(async (connection) => {
        const { env } = process;
        const port = env.PORT || 3000;

        app.listen(port, () => console.log(`Server is listening to port http://localhost:${port}/`));
    })
    .catch((error) => console.error(error));