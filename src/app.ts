import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.set('view engine', 'ejs');

// middlewares
app.use(express.json());
app.use(cors());

// bind routes for all
app.use('/', routes);

export default app;