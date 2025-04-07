import { TelegramCacheService } from "../../telegrot/cache";
import { TUserSetting } from "../type";
import Redis from 'ioredis'

class TelegramBotConfigCache extends TelegramCacheService<TUserSetting> {

    private _redis: Redis

    constructor(bot_name: string, redis_uri: string, db_number: number) {
        super(bot_name)
        this._redis = new Redis(redis_uri, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            db: db_number
        });
    }

    getDataUserCache = async (userId: string) => {
        try {
            const key = this.createCacheKey(userId)
            const result = await this._redis.get(key)
            return result ? JSON.parse(result) : null
        } catch (e) {
            throw e
        }
    }

    setDataUserCache = async (userId: string, args: Partial<TUserSetting>) => {
        try {
            const key = this.createCacheKey(userId)
            const json_str = await this.getDataUserCache(userId) || args
            Object.assign(json_str, args)
            await this._redis.set(key, JSON.stringify(json_str))
            return
        } catch (e) {
            throw e
        }
    }

    delDataUserCache = async (userId: string, fields?: (keyof TUserSetting)[]) => {
        const key = this.createCacheKey(userId)
        const json_str = await this.getDataUserCache(userId)
        if (fields) {
            if (!json_str) return
            fields.forEach(item => delete json_str[item])
            await this._redis.set(key, JSON.stringify(json_str))
        } else {
            await this._redis.del(key)
        }
        return
    }
}

export {
    TelegramBotConfigCache
}