import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

// middlewares
app.use(express.json());
app.use(cors());

// bind routes for all
app.use('/', routes);

export default app;