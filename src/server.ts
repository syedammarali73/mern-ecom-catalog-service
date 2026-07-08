import app from './app.js';
import config from 'config';
import logger from './config/logger.js';
import { initDb } from './config/db.js';

const startServer = async () => {
    const PORT: number = config.get('server.port') || 5502;
    try {
        await initDb();
        logger.info('Database connected successfully.');
        app.listen(PORT, () => {
            logger.info('Server listening on port', { port: PORT });
        });
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on('finish', () => {
                process.exit(1);
            });
        }
    }
};

startServer();
