import express, { type Request, type Response } from 'express';
import { globalErrorHandler } from './common/middlewares/globalErrorHandler.js';
import categoryRouter from './category/category-router.js';
import productRouter from './product/product-router.js';
import toppingRouter from './topping/topping-router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';

const app = express();

app.use(
    cors({
        origin: [config.get('server.URL_ORIGIN')],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to catalog service');
});

app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/toppings', toppingRouter);

app.use(globalErrorHandler);

export default app;
