import express from 'express';
import dotenv from 'dotenv';

// import userRouter from './routes/users.route';
// import itemRouter from './routes/items.route';

dotenv.config();
const app = express();

// config
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
// app.use('/v1/user', userRouter);
// app.use('/v1/item', itemRouter);

export default app;