import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.set('view engine', 'ejs');

// global middlewares
app.use(express.json());
app.use(cors());

// bind 'global' router to all routes
app.use('/', routes);

export default app;