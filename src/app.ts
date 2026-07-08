import express, { type Request, type Response } from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to catalog service');
});

app.use(globalErrorHandler);

export default app;
