import redisClient from './client';
import logger from '../../logger';

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Redis connection error:', error);
    }
};

export const get = async (key: string) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error('Redis GET Error:', error);
        return null;
    }
};

export const set = async (key: string, value: any, ttl?: number) => {
    try {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await redisClient.setEx(key, ttl, stringValue);
        } else {
            await redisClient.set(key, stringValue);
        }
        return true;
    } catch (error) {
        logger.error('Redis SET Error:', error);
        return false;
    }
};

export const del = async (key: string) => {
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        logger.error('Redis DEL Error:', error);
        return false;
    }
};