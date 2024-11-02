import { createClient } from 'redis';
import logger from '../../logger';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            logger.info(`Redis reconnecting... Attempt ${retries}`);
            return Math.min(retries * 50, 2000);
        }
    }
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export default redisClient;