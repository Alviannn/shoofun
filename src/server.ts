import 'reflect-metadata';
import app from './app';
import * as userUtils from './utils/users.util';

import { createConnection } from 'typeorm';

createConnection()
    .then(async () => {
        await userUtils.addAdminIfNotExists();

        const port = process.env.PORT || 3000;
        app.listen(port, () =>
            console.log(`Server is hosted at http://localhost:${port}/`));
    })
    .catch((error) => console.error(error));