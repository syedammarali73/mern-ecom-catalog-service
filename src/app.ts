import express, { type Request, type Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler.js';
import categoryRouter from './category/category-router.js';
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to catalog service');
});

app.use('/categories', categoryRouter);

app.use(globalErrorHandler);

export default app;
