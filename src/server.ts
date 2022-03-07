import 'reflect-metadata';
import app from './app';
import { createConnection } from 'typeorm';

createConnection()
    .then(() => {
        const port = process.env.PORT || 3000;

        app.listen(port, () => console.log(`Server is listening to port http://localhost:${port}/`));
    })
    .catch((error) => console.error(error));