import { successConsoleLog } from "../../../../lib/color-log";
import { TelegramCacheService } from "../../telegrot/cache";
import { TUserSetting } from "../type";
import Redis from 'ioredis'

let index_0 = 0
class TelegramBotConfigCache extends TelegramCacheService<TUserSetting> {

    private redis: Redis

    constructor(bot_name: string, redis_uri: string, db_number: number) {
        super(bot_name)
        index_0++
        console.log({ index_0 })
        this.redis = this.connectRedis(redis_uri, db_number)
    }

    private connectRedis = (redis_uri: string, db_number: number) => {
        const redis = new Redis(redis_uri, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            db: db_number
        })
        if (redis["connector"]["connecting"]) {
            successConsoleLog(`🚀 redis: connected`)
        }
        return redis
    }

    getDataUserCache = async (userId: string) => {
        try {
            const key = this.createCacheKey(userId)
            const result = await this.redis.get(key)
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
            await this.redis.set(key, JSON.stringify(json_str))
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
            await this.redis.set(key, JSON.stringify(json_str))
        } else {
            await this.redis.del(key)
        }
        return
    }
}

export {
    TelegramBotConfigCache
}